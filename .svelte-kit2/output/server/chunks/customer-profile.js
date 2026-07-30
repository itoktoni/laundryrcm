import { t as db } from "./db2.js";
//#region src/lib/server/customer-profile.js
async function recalculateCustomerProfile(customerId) {
	const [orders, orderDates, avgWeight] = await Promise.all([
		db.execute({
			sql: `SELECT COUNT(*) as count FROM orders WHERE customer_id = ?`,
			args: [customerId]
		}),
		db.execute({
			sql: `SELECT order_created_at FROM orders WHERE customer_id = ? ORDER BY order_created_at ASC`,
			args: [customerId]
		}),
		db.execute({
			sql: `SELECT COALESCE(SUM(oi.item_quantity), 0) as total_weight
				FROM orders o
				JOIN order_items oi ON o.order_id = oi.order_id
				JOIN products p ON oi.product_id = p.product_id
				WHERE o.customer_id = ? AND p.product_unit = 'kg'`,
			args: [customerId]
		})
	]);
	const totalOrders = orders.rows[0]?.count || 0;
	const totalWeight = avgWeight.rows[0]?.total_weight || 0;
	const avgW = totalOrders > 0 ? totalWeight / totalOrders : 0;
	let avgDays = 0;
	let lastOrderDate = null;
	const dates = orderDates.rows.map((r) => r.order_created_at);
	if (dates.length > 0) {
		lastOrderDate = dates[dates.length - 1];
		if (dates.length > 1) {
			let totalDays = 0;
			for (let i = 1; i < dates.length; i++) totalDays += (new Date(dates[i]).getTime() - new Date(dates[i - 1]).getTime()) / 864e5;
			avgDays = totalDays / (dates.length - 1);
		}
	}
	await db.execute({
		sql: `UPDATE customers SET customer_total_orders = ?, customer_avg_weight = ?, customer_avg_days = ?, customer_last_order_date = ? WHERE customer_id = ?`,
		args: [
			totalOrders,
			Math.round(avgW * 100) / 100,
			Math.round(avgDays * 10) / 10,
			lastOrderDate,
			customerId
		]
	});
}
//#endregion
export { recalculateCustomerProfile as t };
