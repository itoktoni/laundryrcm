import { db } from '$lib/server/db.js';
import { generateId } from '$lib/server/auth.js';
import { fail } from '@sveltejs/kit';

export async function load({ url }) {
	const search = url.searchParams.get('search') || '';

	const customers = await db.execute({
		sql: `SELECT 
				c.*,
				(SELECT COUNT(*) FROM orders WHERE customer_id = c.customer_id) as total_orders,
				(SELECT SUM(CASE WHEN p.product_unit = 'kg' THEN oi.item_quantity ELSE 0 END) 
					FROM orders o JOIN order_items oi ON o.order_id = oi.order_id 
					JOIN products p ON oi.product_id = p.product_id WHERE o.customer_id = c.customer_id) as total_kg,
				(SELECT MAX(order_created_at) FROM orders WHERE customer_id = c.customer_id) as last_order
			FROM customers c
			WHERE 1=1`,
		args: []
	});

	if (search) {
		const s = `%${search}%`;
		const { rows } = await db.execute({
			sql: `SELECT * FROM customers WHERE customer_name LIKE ? OR customer_phone LIKE ? ORDER BY total_orders DESC LIMIT 50`,
			args: [s, s]
		});
		customers.rows = rows;
	} else {
		customers.rows = customers.rows.sort((a, b) => (b.total_orders || 0) - (a.total_orders || 0));
	}

	return {
		customers: customers.rows,
		filters: { search }
	};
}

export const actions = {
	addCustomer: async ({ request }) => {
		const formData = await request.formData();
		const name = formData.get('customer_name')?.toString().trim();
		const phone = formData.get('customer_phone')?.toString().trim();
		const address = formData.get('customer_address')?.toString().trim() || '';

		if (!name || !phone) {
			return fail(400, { error: 'Nama dan nomor HP wajib diisi' });
		}

		await db.execute({
			sql: 'INSERT INTO customers (customer_id, customer_name, customer_phone, customer_address) VALUES (?, ?, ?, ?)',
			args: [generateId(), name, phone, address]
		});

		return { success: true };
	},

	deleteCustomer: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('customer_id')?.toString();

		if (!id) {
			return fail(400, { error: 'ID pelanggan tidak valid' });
		}

		const orders = await db.execute({
			sql: 'SELECT COUNT(*) as count FROM orders WHERE customer_id = ?',
			args: [id]
		});

		if (orders.rows[0]?.count > 0) {
			return fail(400, { error: 'Pelanggan tidak bisa dihapus karena masih memiliki order' });
		}

		await db.execute({
			sql: 'DELETE FROM customers WHERE customer_id = ?',
			args: [id]
		});

		return { success: true };
	}
};
