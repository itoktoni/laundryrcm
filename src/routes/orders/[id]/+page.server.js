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
		const paidAmount = formData.has('paid_amount') ? parseFloat(formData.get('paid_amount')) : null;
		const uniqueCode = formData.get('unique_code')?.toString() || null;

		const order = await db.execute({
			sql: 'SELECT * FROM orders WHERE order_id = ?',
			args: [params.id]
		});

		if (order.rows.length === 0) {
			return fail(404, { error: 'Order tidak ditemukan' });
		}

		const o = order.rows[0];
		const currentUniq = o.order_unique_code != null ? Number(o.order_unique_code) : 0;

		const isManual = !uniqueCode || uniqueCode === 'null' || uniqueCode === '';
		const finalTotal = isManual ? o.order_total_price - currentUniq : o.order_total_price;
		const paidValue = paidAmount != null ? paidAmount : finalTotal;
		const savedUniq = isManual ? null : uniqueCode;

		if (o.order_payment_status !== 'paid') {
			await db.execute({
				sql: 'UPDATE orders SET order_payment_status = ?, order_paid_amount = ?, order_unique_code = ?, order_total_price = ? WHERE order_id = ?',
				args: ['paid', paidValue, savedUniq, finalTotal, params.id]
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
					`Pembayaran order ${params.id}`,
					new Date().toISOString()
				]
			});
		}

		return { success: true };
	}
};
