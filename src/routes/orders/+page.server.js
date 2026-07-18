import { db } from '$lib/server/db.js';

export async function load({ url }) {
	const status = url.searchParams.get('status') || '';
	const search = url.searchParams.get('search') || '';
	const page = parseInt(url.searchParams.get('page') || '1');
	const limit = 20;
	const offset = (page - 1) * limit;

	let sql = `SELECT o.*, c.customer_name, c.customer_phone 
		FROM orders o JOIN customers c ON o.customer_id = c.customer_id 
		WHERE 1=1`;
	let args = [];

	if (status) {
		sql += ' AND o.order_status = ?';
		args.push(status);
	}

	if (search) {
		sql += ' AND (c.customer_name LIKE ? OR c.customer_phone LIKE ? OR o.order_id LIKE ?)';
		const s = `%${search}%`;
		args.push(s, s, s);
	}

	sql += ' ORDER BY o.order_created_at DESC LIMIT ? OFFSET ?';
	args.push(limit, offset);

	const [orders, countResult] = await Promise.all([
		db.execute({ sql, args }),
		db.execute({
			sql: `SELECT COUNT(*) as total FROM orders o JOIN customers c ON o.customer_id = c.customer_id WHERE 1=1`,
			args: []
		})
	]);

	return {
		orders: orders.rows,
		total: countResult.rows[0]?.total || 0,
		page,
		limit,
		filters: { status, search }
	};
}
