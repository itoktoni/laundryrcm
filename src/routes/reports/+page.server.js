import { db } from '$lib/server/db.js';

export async function load({ url }) {
	const period = url.searchParams.get('period') || 'month';
	const start = url.searchParams.get('start') || '';
	const end = url.searchParams.get('end') || '';

	const isCustom = period === 'custom' && start && end;

	function buildFilter(column) {
		if (isCustom) {
			return {
				clause: `AND DATE(${column}) BETWEEN DATE(?) AND DATE(?)`,
				args: [start, end]
			};
		}
		if (period === 'today') {
			return { clause: `AND DATE(${column}) = DATE('now')`, args: [] };
		}
		if (period === 'week') {
			return { clause: `AND DATE(${column}) >= DATE('now', 'weekday 0', '-7 days')`, args: [] };
		}
		if (period === 'month') {
			return { clause: `AND strftime('%Y-%m', ${column}) = strftime('%Y-%m', 'now')`, args: [] };
		}
		return { clause: '', args: [] };
	}

	const orderF = buildFilter('order_created_at');
	const txF = buildFilter('transaction_date');
	const custF = buildFilter('customer_created_at');

	const [orders, finance, customers] = await Promise.all([
		db.execute({
			sql: `SELECT COUNT(*) as count, COALESCE(SUM(order_total_price), 0) as total, 
				COALESCE(SUM(CASE WHEN order_payment_status = 'paid' THEN order_total_price ELSE 0 END), 0) as paid
				FROM orders WHERE 1=1 ${orderF.clause}`,
			args: orderF.args
		}),
		db.execute({
			sql: `SELECT 
				COALESCE(SUM(CASE WHEN transaction_type = 'income' THEN transaction_amount ELSE 0 END), 0) as income,
				COALESCE(SUM(CASE WHEN transaction_type = 'expense' THEN transaction_amount ELSE 0 END), 0) as expense
				FROM transactions WHERE 1=1 ${txF.clause}`,
			args: txF.args
		}),
		db.execute({
			sql: `SELECT COUNT(*) as count FROM customers WHERE 1=1 ${custF.clause}`,
			args: custF.args
		})
	]);

	return {
		orders: orders.rows[0],
		finance: finance.rows[0],
		customers: customers.rows[0],
		filters: { period, start, end }
	};
}
