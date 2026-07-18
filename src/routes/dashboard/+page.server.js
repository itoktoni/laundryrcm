import { db } from '$lib/server/db.js';

export async function load({ locals }) {
	const userId = locals.user.id;
	const today = new Date().toISOString().split('T')[0];

	const [ordersToday, activeOrders, revenue, newCustomers, recentOrders, weekly] = await Promise.all([
		db.execute({
			sql: `SELECT COUNT(*) as count, COALESCE(SUM(order_total_price), 0) as total 
				FROM orders WHERE DATE(order_created_at) = DATE(?) AND order_created_by = ?`,
			args: [today, userId]
		}),
		db.execute({
			sql: `SELECT COUNT(*) as count FROM orders 
				WHERE order_status NOT IN ('selesai', 'diambil') AND order_created_by = ?`,
			args: [userId]
		}),
		db.execute({
			sql: `SELECT COALESCE(SUM(transaction_amount), 0) as total 
				FROM transactions WHERE transaction_type = 'income' 
				AND strftime('%Y-%m', transaction_date) = strftime('%Y-%m', 'now')`,
			args: []
		}),
		db.execute({
			sql: `SELECT COUNT(*) as count FROM customers 
				WHERE strftime('%Y-%m', customer_created_at) = strftime('%Y-%m', 'now')`,
			args: []
		}),
		db.execute({
			sql: `SELECT o.*, c.customer_name FROM orders o 
				JOIN customers c ON o.customer_id = c.customer_id 
				WHERE o.order_created_by = ? 
				ORDER BY o.order_created_at DESC LIMIT 5`,
			args: [userId]
		}),
		db.execute({
			sql: `SELECT DATE(t.transaction_date) as day, COALESCE(SUM(t.transaction_amount), 0) as total
				FROM transactions t
				WHERE t.transaction_type = 'income'
				AND DATE(t.transaction_date) >= DATE('now', '-6 days')
				GROUP BY DATE(t.transaction_date)
				ORDER BY day ASC`,
			args: []
		})
	]);

	const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
	const revenueByDay = days.map((_, i) => {
		const d = new Date();
		d.setDate(d.getDate() - (6 - i));
		return d.toISOString().split('T')[0];
	});
	const totalMap = {};
	weekly.rows.forEach((r) => (totalMap[r.day] = r.total));

	const weeklyLabels = revenueByDay.map((d) => days[new Date(d).getDay()]);
	const weeklyData = revenueByDay.map((d) => totalMap[d] || 0);

	return {
		stats: {
			ordersToday: ordersToday.rows[0]?.count || 0,
			revenueToday: ordersToday.rows[0]?.total || 0,
			activeOrders: activeOrders.rows[0]?.count || 0,
			monthlyRevenue: revenue.rows[0]?.total || 0,
			newCustomers: newCustomers.rows[0]?.count || 0
		},
		recentOrders: recentOrders.rows,
		weekly: { labels: weeklyLabels, data: weeklyData }
	};
}
