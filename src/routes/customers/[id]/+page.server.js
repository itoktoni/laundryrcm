import { db } from '$lib/server/db.js';
import { fail, redirect } from '@sveltejs/kit';
import { recalculateCustomerProfile } from '$lib/server/customer-profile.js';

async function ensureColumns() {
	try {
		await db.execute(`ALTER TABLE customers ADD COLUMN customer_avg_weight REAL DEFAULT 0`);
	} catch {}
	try {
		await db.execute(`ALTER TABLE customers ADD COLUMN customer_avg_days REAL DEFAULT 0`);
	} catch {}
	try {
		await db.execute(`ALTER TABLE customers ADD COLUMN customer_last_order_date TEXT`);
	} catch {}
	try {
		await db.execute(`ALTER TABLE customers ADD COLUMN customer_notes TEXT`);
	} catch {}
	try {
		await db.execute(`ALTER TABLE customers ADD COLUMN customer_est_freq_days INTEGER DEFAULT 0`);
	} catch {}
	try {
		await db.execute(`ALTER TABLE customers ADD COLUMN customer_est_weight REAL DEFAULT 0`);
	} catch {}
}

export async function load({ params }) {
	await ensureColumns();

	const customerId = params.id;

	const [customer, orders, totalSpent, lastOrder, weightStats, orderDates] = await Promise.all([
		db.execute({
			sql: 'SELECT * FROM customers WHERE customer_id = ?',
			args: [customerId]
		}),
		db.execute({
			sql: `SELECT o.*,
				(SELECT GROUP_CONCAT(p.product_name || ' ' || oi.item_quantity || p.product_unit, ', ')
				FROM order_items oi JOIN products p ON oi.product_id = p.product_id
				WHERE oi.order_id = o.order_id) as item_summary
			FROM orders o WHERE o.customer_id = ? ORDER BY o.order_created_at DESC LIMIT 20`,
			args: [customerId]
		}),
		db.execute({
			sql: `SELECT COALESCE(SUM(order_total_price), 0) as total FROM orders WHERE customer_id = ? AND order_payment_status = 'paid'`,
			args: [customerId]
		}),
		db.execute({
			sql: `SELECT MAX(order_created_at) as last_order FROM orders WHERE customer_id = ?`,
			args: [customerId]
		}),
		db.execute({
			sql: `SELECT
				COALESCE(SUM(CASE WHEN p.product_unit = 'kg' THEN oi.item_quantity ELSE 0 END), 0) as total_kg,
				COALESCE(SUM(CASE WHEN p.product_unit = 'pcs' THEN oi.item_quantity ELSE 0 END), 0) as total_pcs,
				COUNT(DISTINCT o.order_id) as total_orders
			FROM orders o
			JOIN order_items oi ON o.order_id = oi.order_id
			JOIN products p ON oi.product_id = p.product_id
			WHERE o.customer_id = ?`,
			args: [customerId]
		}),
		db.execute({
			sql: `SELECT order_created_at FROM orders WHERE customer_id = ? ORDER BY order_created_at ASC`,
			args: [customerId]
		})
	]);

	if (customer.rows.length === 0) {
		throw redirect(302, '/customers');
	}

	const lastOrderDate = lastOrder.rows[0]?.last_order;
	const daysSinceLastOrder = lastOrderDate
		? Math.round((Date.now() - new Date(lastOrderDate).getTime()) / (1000 * 60 * 60 * 24))
		: null;

	const ws = weightStats.rows[0] || { total_kg: 0, total_pcs: 0, total_orders: 0 };
	const totalOrders = ws.total_orders || 0;
	const avgWeightPerOrder = totalOrders > 0 ? Math.round((ws.total_kg / totalOrders) * 10) / 10 : 0;

	let avgDaysBetween = 0;
	const dates = orderDates.rows.map(r => r.order_created_at);
	if (dates.length > 1) {
		let totalDays = 0;
		for (let i = 1; i < dates.length; i++) {
			totalDays += (new Date(dates[i]).getTime() - new Date(dates[i - 1]).getTime()) / 86400000;
		}
		avgDaysBetween = Math.round((totalDays / (dates.length - 1)) * 10) / 10;
	}

	return {
		customer: customer.rows[0],
		orders: orders.rows,
		totalSpent: totalSpent.rows[0]?.total || 0,
		lastOrderDate,
		daysSinceLastOrder,
		profile: {
			totalOrders,
			totalKg: Math.round(ws.total_kg * 10) / 10,
			totalPcs: Math.round(ws.total_pcs),
			avgWeightPerOrder,
			avgDaysBetween
		}
	};
}

export const actions = {
	toggleVip: async ({ params }) => {
		const customer = await db.execute({
			sql: 'SELECT customer_vip FROM customers WHERE customer_id = ?',
			args: [params.id]
		});

		if (customer.rows.length > 0) {
			const newVip = customer.rows[0].customer_vip ? 0 : 1;
			await db.execute({
				sql: 'UPDATE customers SET customer_vip = ? WHERE customer_id = ?',
				args: [newVip, params.id]
			});
		}

		return { success: true };
	},

	updateCustomer: async ({ params, request }) => {
		const formData = await request.formData();
		const name = formData.get('customer_name')?.toString().trim();
		const phone = formData.get('customer_phone')?.toString().trim();
		const address = formData.get('customer_address')?.toString().trim();
		const notes = formData.get('customer_notes')?.toString().trim();
		const estFreqDays = formData.get('customer_est_freq_days')?.toString().trim();
		const estWeight = formData.get('customer_est_weight')?.toString().trim();

		if (!name || !phone) {
			return fail(400, { error: 'Nama dan nomor HP wajib diisi' });
		}

		await ensureColumns();
		try { await db.execute(`ALTER TABLE customers ADD COLUMN customer_est_freq_days INTEGER`); } catch {}
		try { await db.execute(`ALTER TABLE customers ADD COLUMN customer_est_weight REAL`); } catch {}
		await db.execute({
			sql: 'UPDATE customers SET customer_name = ?, customer_phone = ?, customer_address = ?, customer_notes = ?, customer_est_freq_days = ?, customer_est_weight = ? WHERE customer_id = ?',
			args: [name, phone, address || '', notes || '', estFreqDays || '', estWeight || '', params.id]
		});

		return { success: true };
	},

	recalculateProfile: async ({ params }) => {
		await recalculateCustomerProfile(params.id);
		return { success: true };
	},

	deleteCustomer: async ({ params }) => {
		const orders = await db.execute({
			sql: 'SELECT COUNT(*) as count FROM orders WHERE customer_id = ?',
			args: [params.id]
		});

		if (orders.rows[0]?.count > 0) {
			return fail(400, { error: 'Pelanggan tidak bisa dihapus karena masih memiliki order' });
		}

		await db.execute({
			sql: 'DELETE FROM customers WHERE customer_id = ?',
			args: [params.id]
		});

		throw redirect(302, '/customers');
	}
};
