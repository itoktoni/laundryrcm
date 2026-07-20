import { db } from '$lib/server/db.js';
import { fail, redirect } from '@sveltejs/kit';

export async function load({ params }) {
	const orderId = params.id;

	const [order, items] = await Promise.all([
		db.execute({
			sql: `SELECT o.*, c.customer_name, c.customer_phone, c.customer_address, c.customer_vip,
				p.promo_name, p.promo_type, p.promo_value
				FROM orders o 
				JOIN customers c ON o.customer_id = c.customer_id
				LEFT JOIN promotions p ON o.promo_id = p.promo_id
				WHERE o.order_id = ?`,
			args: [orderId]
		}),
		db.execute({
			sql: `SELECT oi.*, p.product_name, p.product_unit
				FROM order_items oi
				JOIN products p ON oi.product_id = p.product_id
				WHERE oi.order_id = ?`,
			args: [orderId]
		})
	]);

	if (order.rows.length === 0) {
		throw redirect(302, '/orders');
	}

	return {
		order: order.rows[0],
		items: items.rows
	};
}

export const actions = {
	updateStatus: async ({ request, params }) => {
		const formData = await request.formData();
		const status = formData.get('status');
		const validStatuses = ['pending', 'cuci', 'kering', 'setrika', 'selesai', 'diambil'];

		if (!validStatuses.includes(status)) {
			return fail(400, { error: 'Status tidak valid' });
		}

		await db.execute({
			sql: 'UPDATE orders SET order_status = ? WHERE order_id = ?',
			args: [status, params.id]
		});

		return { success: true };
	},

	markPaid: async ({ request, params }) => {
		const formData = await request.formData();
		const paidAmountRaw = formData.get('paid_amount');
		const paidAmount = paidAmountRaw != null && paidAmountRaw !== '' ? parseFloat(paidAmountRaw) : null;
		const uniqueCodeRaw = formData.get('unique_code')?.toString() || '';
		const uniqueCode = uniqueCodeRaw === 'null' ? '' : uniqueCodeRaw;

		const order = await db.execute({
			sql: 'SELECT * FROM orders WHERE order_id = ?',
			args: [params.id]
		});

		if (order.rows.length === 0) {
			return fail(404, { error: 'Order tidak ditemukan' });
		}

		const o = order.rows[0];
		const baseTotal = Number(o.order_total_price) || 0;
		const existingUniq = o.order_unique_code != null ? Number(o.order_unique_code) : 0;

		// Determine unique code: use form value, else keep existing, else 0
		let savedUniq = 0;
		if (uniqueCode && uniqueCode !== '') {
			savedUniq = parseInt(uniqueCode) || 0;
		} else if (existingUniq) {
			savedUniq = existingUniq;
		}

		// paid_amount: use form value if valid, else base + uniq
		const paidValue = paidAmount != null && !isNaN(paidAmount) ? paidAmount : (baseTotal + savedUniq);

		if (o.order_payment_status !== 'paid') {
			await db.execute({
				sql: 'UPDATE orders SET order_payment_status = ?, order_paid_amount = ?, order_unique_code = ? WHERE order_id = ?',
				args: ['paid', paidValue, savedUniq, params.id]
			});

			await db.execute({
				sql: `INSERT INTO transactions (transaction_id, order_id, transaction_type, transaction_amount, transaction_category, transaction_description, transaction_date) 
				VALUES (?, ?, ?, ?, ?, ?, ?)`,
				args: [
					crypto.randomUUID(),
					params.id,
					'income',
					paidValue,
					'pembayaran order',
					`Pembayaran order ${o.order_payment_code ? 'kode ' + o.order_payment_code : params.id}`,
					new Date().toISOString()
				]
			});
		}

		return { success: true };
	},

	deleteOrder: async ({ params, locals }) => {
		const user = locals.user;
		if (!user || (user.role !== 'owner' && user.role !== 'admin')) {
			return fail(403, { error: 'Hanya owner dan admin yang bisa menghapus order' });
		}

		const orderId = params.id;

		const order = await db.execute({
			sql: 'SELECT * FROM orders WHERE order_id = ?',
			args: [orderId]
		});

		if (order.rows.length === 0) {
			return fail(404, { error: 'Order tidak ditemukan' });
		}

		// Delete related transactions first
		await db.execute({
			sql: 'DELETE FROM transactions WHERE order_id = ?',
			args: [orderId]
		});

		// Delete order items
		await db.execute({
			sql: 'DELETE FROM order_items WHERE order_id = ?',
			args: [orderId]
		});

		// Finally delete the order
		await db.execute({
			sql: 'DELETE FROM orders WHERE order_id = ?',
			args: [orderId]
		});

		throw redirect(302, '/orders');
	}
};