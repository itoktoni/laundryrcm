import { t as db } from "../../../chunks/db2.js";
//#region src/routes/crm/+page.server.js
async function load({ url }) {
	const inactiveDays = parseInt(url.searchParams.get("inactive_days") || "7");
	const pendingDays = parseInt(url.searchParams.get("pending_days") || "0");
	const [inactiveCustomers, pendingPickupOrders, customerStats, topCustomers, recentActivity] = await Promise.all([
		db.execute(`
			SELECT c.customer_id, c.customer_name, c.customer_phone, c.customer_vip,
				   MAX(o.order_created_at) AS last_order_date,
				   julianday('now') - julianday(MAX(o.order_created_at)) AS days_since_last_order
			FROM customers c
			INNER JOIN orders o ON c.customer_id = o.customer_id
			WHERE c.customer_phone IS NOT NULL
			  AND c.customer_phone != ''
			GROUP BY c.customer_id
			HAVING julianday('now') - julianday(MAX(o.order_created_at)) >= ?
			ORDER BY days_since_last_order DESC
			LIMIT 10
		`, [inactiveDays]),
		db.execute(`
			SELECT o.order_id, o.order_unique_code, o.order_total_price,
				   c.customer_name, c.customer_phone,
				   o.order_created_at, o.order_notes
			FROM orders o
			JOIN customers c ON o.customer_id = c.customer_id
			WHERE o.order_status = 'selesai'
			  AND o.order_payment_status = 'paid'
			  AND o.order_status != 'diambil'
			ORDER BY o.order_created_at ASC
			LIMIT 10
		`),
		db.execute(`
			SELECT
				COUNT(*) AS total_customers,
				SUM(CASE WHEN customer_vip = 1 THEN 1 ELSE 0 END) AS vip_count,
				SUM(CASE WHEN customer_total_orders = 0 THEN 1 ELSE 0 END) AS new_customers,
				COALESCE(SUM(CASE WHEN customer_vip = 1 THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 0) AS vip_percentage
			FROM customers
			WHERE customer_phone IS NOT NULL
			  AND customer_phone != ''
		`),
		db.execute(`
			SELECT c.customer_id, c.customer_name, c.customer_phone,
				   COUNT(o.order_id) AS total_orders,
				   COALESCE(SUM(o.order_total_price), 0) AS total_spent,
				   MAX(o.order_created_at) AS last_order
			FROM customers c
			LEFT JOIN orders o ON c.customer_id = o.customer_id
			WHERE c.customer_phone IS NOT NULL
			  AND c.customer_phone != ''
			GROUP BY c.customer_id
			ORDER BY total_spent DESC
			LIMIT 10
		`),
		db.execute(`
			SELECT
				'customer_inactive' AS activity_type,
				c.customer_id, c.customer_name, c.customer_phone,
				MAX(o.order_created_at) AS created_at,
				julianday('now') - julianday(MAX(o.order_created_at)) AS days_diff
			FROM customers c
			INNER JOIN orders o ON c.customer_id = o.customer_id
			WHERE c.customer_phone IS NOT NULL
			  AND c.customer_phone != ''
			GROUP BY c.customer_id
			HAVING julianday('now') - julianday(MAX(o.order_created_at)) >= ?
			UNION ALL
			SELECT
				'pending_pickup' AS activity_type,
				o.order_id AS customer_id,
				c.customer_name,
				c.customer_phone,
				o.order_created_at,
				0 AS days_diff
			FROM orders o
			JOIN customers c ON o.customer_id = c.customer_id
			WHERE o.order_status = 'selesai'
			  AND o.order_payment_status = 'paid'
			ORDER BY created_at DESC
			LIMIT 20
		`, [inactiveDays])
	]);
	const stats = customerStats.rows[0] || {
		total_customers: 0,
		vip_count: 0,
		new_customers: 0,
		vip_percentage: 0
	};
	return {
		inactiveCustomers: inactiveCustomers.rows,
		pendingPickupOrders: pendingPickupOrders.rows,
		stats,
		topCustomers: topCustomers.rows,
		recentActivity: recentActivity.rows,
		filters: {
			inactiveDays,
			pendingDays
		}
	};
}
//#endregion
export { load };
