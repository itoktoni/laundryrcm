import { db } from '$lib/server/db.js';
import { fail, redirect } from '@sveltejs/kit';

export async function load({ params }) {
	const customerId = params.id;

	const [customer, orders, totalSpent] = await Promise.all([
		db.execute({
			sql: 'SELECT * FROM customers WHERE customer_id = ?',
			args: [customerId]
		}),
		db.execute({
			sql: `SELECT * FROM orders WHERE customer_id = ? ORDER BY order_created_at DESC LIMIT 20`,
			args: [customerId]
		}),
		db.execute({
			sql: `SELECT COALESCE(SUM(order_total_price), 0) as total FROM orders WHERE customer_id = ? AND order_payment_status = 'paid'`,
			args: [customerId]
		})
	]);

	if (customer.rows.length === 0) {
		throw redirect(302, '/customers');
	}

	return {
		customer: customer.rows[0],
		orders: orders.rows,
		totalSpent: totalSpent.rows[0]?.total || 0
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

		if (!name || !phone) {
			return fail(400, { error: 'Nama dan nomor HP wajib diisi' });
		}

		await db.execute({
			sql: 'UPDATE customers SET customer_name = ?, customer_phone = ?, customer_address = ? WHERE customer_id = ?',
			args: [name, phone, address || '', params.id]
		});

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
