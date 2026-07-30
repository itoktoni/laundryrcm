import { dbExecute } from '$lib/client/db.js';
import { getCurrentUser } from '$lib/client/auth.js';

export async function load() {
	const user = getCurrentUser();
	if (!user) {
		return {
			stats: { ordersToday: 0, revenueToday: 0, activeOrders: 0, monthlyRevenue: 0, newCustomers: 0 },
			recentOrders: [],
			weekly: { labels: ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'], data: [0, 0, 0, 0, 0, 0, 0] },
			lowStock: [],
			attendanceNeeded: 'none'
		};
	}

	try {
		const today = new Date().toISOString().split('T')[0];
		const userId = user.id;

		const [ordersToday, activeOrders, revenue, newCustomers, recentOrders, weekly, lowStock, attendanceStatus] = await Promise.all([
			dbExecute(
				`SELECT COUNT(*) as count, COALESCE(SUM(order_total_price), 0) as total FROM orders WHERE DATE(order_created_at) = DATE(?) AND order_created_by = ?`,
				[today, userId]
			),
			dbExecute(
				`SELECT COUNT(*) as count FROM orders WHERE order_status NOT IN ('selesai', 'diambil') AND order_created_by = ?`,
				[userId]
			),
			dbExecute(
				`SELECT COALESCE(SUM(transaction_amount), 0) as total FROM transactions WHERE transaction_type = 'income' AND strftime('%Y-%m', transaction_date) = strftime('%Y-%m', 'now')`
			),
			dbExecute(
				`SELECT COUNT(*) as count FROM customers WHERE strftime('%Y-%m', customer_created_at) = strftime('%Y-%m', 'now')`
			),
			dbExecute(
				`SELECT o.*, c.customer_name FROM orders o JOIN customers c ON o.customer_id = c.customer_id WHERE o.order_created_by = ? ORDER BY o.order_created_at DESC LIMIT 5`,
				[userId]
			),
			dbExecute(
				`SELECT DATE(t.transaction_date) as day, COALESCE(SUM(t.transaction_amount), 0) as total FROM transactions t WHERE t.transaction_type = 'income' AND DATE(t.transaction_date) >= DATE('now', '-6 days') GROUP BY DATE(t.transaction_date) ORDER BY day ASC`
			),
			dbExecute(
				`SELECT inventory_id, inventory_name, inventory_quantity, inventory_unit, inventory_min_stock FROM inventory WHERE inventory_quantity < inventory_min_stock ORDER BY inventory_name ASC`
			),
			dbExecute(
				`SELECT type, created_at FROM attendance WHERE user_id = ? AND DATE(created_at) = DATE('now') ORDER BY created_at ASC`,
				[userId]
			)
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

		const masukRecord = attendanceStatus.rows.find((r) => r.type === 'masuk');
		const keluarRecord = attendanceStatus.rows.find((r) => r.type === 'keluar');
		let attendanceNeeded = 'none';
		if (!masukRecord && !keluarRecord) attendanceNeeded = 'masuk';
		else if (masukRecord && !keluarRecord) attendanceNeeded = 'keluar';

		return {
			stats: {
				ordersToday: ordersToday.rows[0]?.count || 0,
				revenueToday: ordersToday.rows[0]?.total || 0,
				activeOrders: activeOrders.rows[0]?.count || 0,
				monthlyRevenue: revenue.rows[0]?.total || 0,
				newCustomers: newCustomers.rows[0]?.count || 0
			},
			recentOrders: recentOrders.rows,
			weekly: { labels: weeklyLabels, data: weeklyData },
			lowStock: lowStock.rows,
			attendanceNeeded
		};
	} catch (err) {
		console.error('[Dashboard] Load error:', err);
		return {
			stats: { ordersToday: 0, revenueToday: 0, activeOrders: 0, monthlyRevenue: 0, newCustomers: 0 },
			recentOrders: [],
			weekly: { labels: ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'], data: [0, 0, 0, 0, 0, 0, 0] },
			lowStock: [],
			attendanceNeeded: 'none'
		};
	}
}
