import { db } from '$lib/server/db.js';
import { json } from '@sveltejs/kit';

export async function POST({ request }) {
	const { env } = await import('$env/dynamic/private');
	const token = env.WEBHOOK_TOKEN || '';

	let body;
	try {
		body = await request.json();
	} catch {
		return json({ error: 'Invalid JSON' }, { status: 400 });
	}

	const { order_id, token: reqToken, paid_amount, unique_code } = body;

	if (!order_id || !reqToken) {
		return json({ error: 'order_id and token required' }, { status: 400 });
	}

	if (reqToken !== token) {
		return json({ error: 'Invalid token' }, { status: 401 });
	}

	const result = await db.execute({
		sql: 'SELECT * FROM orders WHERE order_id = ?',
		args: [order_id]
	});

	if (result.rows.length === 0) {
		return json({ error: 'Order not found' }, { status: 404 });
	}

	const order = result.rows[0];

	if (order.order_payment_status === 'paid') {
		return json({ success: true, message: 'Already paid' });
	}

	await db.execute({
		sql: 'UPDATE orders SET order_payment_status = ?, order_paid_amount = ?, order_unique_code = ? WHERE order_id = ?',
		args: ['paid', paid_amount ?? order.order_total_price, unique_code ?? null, order_id]
	});

	await db.execute({
		sql: `INSERT INTO transactions (transaction_id, order_id, transaction_type, transaction_amount, transaction_category, transaction_description, transaction_date)
			VALUES (?, ?, ?, ?, ?, ?, ?)`,
		args: [
			crypto.randomUUID(),
			order_id,
			'income',
			paid_amount ?? order.order_total_price,
			'pembayaran order',
			`Pembayaran webhook order ${order_id}`,
			new Date().toISOString()
		]
	});

	return json({ success: true });
}
