import { db } from '$lib/server/db.js';
import { json } from '@sveltejs/kit';

export async function GET({ params }) {
	const result = await db.execute({
		sql: 'SELECT order_id, order_payment_status, order_total_price FROM orders WHERE order_id = ?',
		args: [params.id]
	});

	if (result.rows.length === 0) {
		return json({ error: 'Order tidak ditemukan' }, { status: 404 });
	}

	const order = result.rows[0];
	return json({
		orderId: order.order_id,
		paid: order.order_payment_status === 'paid',
		paymentStatus: order.order_payment_status,
		total: order.order_total_price
	});
}
