import { db } from '$lib/server/db.js';

export async function load({ url }) {
	const status = url.searchParams.get('status') || '';
	const search = url.searchParams.get('search') || '';
	const startDate = url.searchParams.get('start_date') || '';
	const endDate = url.searchParams.get('end_date') || '';
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

	if (startDate) {
		sql += ' AND DATE(o.order_created_at) >= ?';
		args.push(startDate);
	}

	if (endDate) {
		sql += ' AND DATE(o.order_created_at) <= ?';
		args.push(endDate);
	}

	sql += ' ORDER BY datetime(o.order_created_at) DESC LIMIT ? OFFSET ?';
	args.push(limit, offset);

	let countSql = `SELECT COUNT(*) as total FROM orders o JOIN customers c ON o.customer_id = c.customer_id WHERE 1=1`;
	let countArgs = [];

	if (status) {
		countSql += ' AND o.order_status = ?';
		countArgs.push(status);
	}

	if (search) {
		countSql += ' AND (c.customer_name LIKE ? OR c.customer_phone LIKE ? OR o.order_id LIKE ?)';
		const s = `%${search}%`;
		countArgs.push(s, s, s);
	}

	if (startDate) {
		countSql += ' AND DATE(o.order_created_at) >= ?';
		countArgs.push(startDate);
	}

	if (endDate) {
		countSql += ' AND DATE(o.order_created_at) <= ?';
		countArgs.push(endDate);
	}

	const [orders, countResult] = await Promise.all([
		db.execute({ sql, args }),
		db.execute({ sql: countSql, args: countArgs })
	]);

	return {
		orders: orders.rows,
		total: countResult.rows[0]?.total || 0,
		page,
		limit,
		filters: { status, search, startDate, endDate }
	};
}