import { db } from '$lib/server/db.js';
import { generateId } from '$lib/server/auth.js';
import { generatePaymentCode } from '$lib/server/payment-code.js';
import { fail, redirect } from '@sveltejs/kit';

export async function load() {
	const [customers, products, categories, promotions] = await Promise.all([
		db.execute('SELECT * FROM customers ORDER BY customer_name'),
		db.execute(`SELECT p.*, c.category_name FROM products p 
			LEFT JOIN categories c ON p.category_id = c.category_id 
			WHERE p.product_is_active = 1 
			ORDER BY c.category_name, p.product_name`),
		db.execute('SELECT * FROM categories ORDER BY category_name'),
		db.execute(`SELECT * FROM promotions 
			WHERE promo_is_active = 1 AND promo_end_date >= date('now') 
			ORDER BY promo_name`)
	]);

	return {
		customers: customers.rows,
		products: products.rows,
		categories: categories.rows,
		promotions: promotions.rows
	};
}

export const actions = {
	createCustomer: async ({ request }) => {
		const formData = await request.formData();
		const name = formData.get('customer_name')?.toString().trim();
		const phone = formData.get('customer_phone')?.toString().trim();
		const address = formData.get('customer_address')?.toString().trim();

		if (!name || !phone) {
			return fail(400, { error: 'Nama dan nomor HP wajib diisi' });
		}

		const id = generateId();
		await db.execute({
			sql: 'INSERT INTO customers (customer_id, customer_name, customer_phone, customer_address) VALUES (?, ?, ?, ?)',
			args: [id, name, phone, address || '']
		});

		return { newCustomerId: id };
	},

	createOrder: async ({ request, locals }) => {
		const result = await createOrderCore({ request, locals });
		if (result.error) return result.error;
		if (result.redirect) throw redirect(302, `/orders/${result.orderId}`);
		return { success: true };
	},

	createPending: async ({ request, locals }) => {
		try {
			const result = await createOrderCore({ request, locals, forceUnpaid: true, withUniqueCode: true });
			if (result.error) return result.error;
			return { orderId: result.orderId };
		} catch (err) {
			console.error('[createPending] ERROR', err?.stack || String(err));
			return fail(500, { error: err?.message || 'Internal error' });
		}
	}
};

async function createOrderCore({ request, locals, forceUnpaid = false, withUniqueCode = false }) {
	const formData = await request.formData();
	const customerId = formData.get('customer_id')?.toString();
	const promoId = formData.get('promo_id')?.toString() || null;
	const promoCode = formData.get('promo_code')?.toString().trim() || '';
	const notes = formData.get('notes')?.toString() || '';
	const itemsJson = formData.get('items')?.toString();

	if (!customerId) {
		return { error: fail(400, { error: 'Pilih pelanggan' }) };
	}

	let items;
	try {
		items = JSON.parse(itemsJson);
	} catch {
		return { error: fail(400, { error: 'Data item tidak valid' }) };
	}

	if (!items || items.length === 0) {
		return { error: fail(400, { error: 'Tambahkan minimal 1 item' }) };
	}

	let subtotal = 0;
	const orderItems = items.map((item) => {
		const sub = item.quantity * item.price;
		subtotal += sub;
		return {
			id: generateId(),
			productId: item.productId,
			quantity: item.quantity,
			price: item.price,
			subtotal: sub
		};
	});

	// Apply discount
	let discount = 0;
	let appliedPromoId = null;

	if (promoCode) {
		const promo = await db.execute({
			sql: `SELECT * FROM promotions 
				WHERE promo_code = ? AND promo_is_active = 1 
				AND promo_start_date <= date('now') AND promo_end_date >= date('now')`,
			args: [promoCode]
		});
		if (promo.rows.length > 0) {
			const p = promo.rows[0];
			if (!p.promo_min_order || subtotal >= p.promo_min_order) {
				if (p.promo_type === 'percent') {
					discount = Math.round(subtotal * (p.promo_value / 100));
				} else if (p.promo_type === 'nominal') {
					discount = p.promo_value;
				}
				appliedPromoId = p.promo_id;
			}
		}
	} else if (promoId) {
		const promo = await db.execute({
			sql: `SELECT * FROM promotions WHERE promo_id = ? AND promo_is_active = 1`,
			args: [promoId]
		});
		if (promo.rows.length > 0) {
			const p = promo.rows[0];
			if (!p.promo_min_order || subtotal >= p.promo_min_order) {
				if (p.promo_type === 'percent') {
					discount = Math.round(subtotal * (p.promo_value / 100));
				} else if (p.promo_type === 'nominal') {
					discount = p.promo_value;
				}
				appliedPromoId = p.promo_id;
			}
		}
	}

	// Check VIP auto discount
	if (!appliedPromoId) {
		const customer = await db.execute({
			sql: 'SELECT customer_vip FROM customers WHERE customer_id = ?',
			args: [customerId]
		});
		if (customer.rows.length > 0 && customer.rows[0].customer_vip) {
			discount = Math.round(subtotal * 0.05); // 5% VIP discount
		}
	}

	const total = subtotal - discount;
	const paymentStatus = forceUnpaid ? 'unpaid' : formData.get('payment_status')?.toString() || 'unpaid';

	// Generate 4-character alphanumeric code
	function generateOrderCode() {
		const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
		let code = '';
		for (let i = 0; i < 4; i++) {
			code += chars.charAt(Math.floor(Math.random() * chars.length));
		}
		return code;
	}

	// Unique code generated lazily by QRIS API (numeric) to avoid legacy string codes
	const orderId = generateId();
	const uniqueCodeValue = null;
	// Cash/unpaid default prefix; QRIS flow overwrites with Q-prefix when paid via QRIS
	const orderPaymentCode = generatePaymentCode('C');
	await db.execute({
		sql: `INSERT INTO orders (order_id, customer_id, promo_id, order_subtotal, order_discount_amount, order_total_price, order_unique_code, order_payment_code, order_payment_status, order_notes, order_created_by) 
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
		args: [orderId, customerId, appliedPromoId, subtotal, discount, total, uniqueCodeValue, orderPaymentCode, paymentStatus, notes, locals.user.id]
	});

	// If paid, create income transaction
	if (paymentStatus === 'paid') {
		await db.execute({
			sql: `INSERT INTO transactions (transaction_id, order_id, transaction_type, transaction_amount, transaction_category, transaction_description, transaction_date) 
				VALUES (?, ?, ?, ?, ?, ?, ?)`,
			args: [
				crypto.randomUUID(),
				orderId,
				'income',
				total,
				'pembayaran order',
				`Pembayaran order ${orderId}`,
				new Date().toISOString()
			]
		});
	}

	for (const item of orderItems) {
		await db.execute({
			sql: `INSERT INTO order_items (item_id, order_id, product_id, item_quantity, item_price, item_subtotal) 
				VALUES (?, ?, ?, ?, ?, ?)`,
			args: [item.id, orderId, item.productId, item.quantity, item.price, item.subtotal]
		});
	}

	await db.execute({
		sql: 'UPDATE customers SET customer_total_orders = customer_total_orders + 1 WHERE customer_id = ?',
		args: [customerId]
	});

	return { orderId, redirect: !forceUnpaid };
}
