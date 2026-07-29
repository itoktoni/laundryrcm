import { createClient } from '@libsql/client';
const db = createClient({
  url: process.env.TURSO_DATABASE_URL || 'file:local.db',
  authToken: process.env.TURSO_AUTH_TOKEN
});

async function recalculateAllProfiles() {
  console.log('Starting to recalculate all customer profiles...\n');

  const customers = await db.execute('SELECT customer_id FROM customers');
  console.log(`Found ${customers.rows.length} customers`);

  let successCount = 0;
  let errorCount = 0;

  for (const c of customers.rows) {
    const customerId = c.customer_id;
    try {
      await db.execute({
        sql: `UPDATE customers
              SET customer_total_orders = (
                SELECT COUNT(*) FROM orders WHERE customer_id = ?
              )
              WHERE customer_id = ?`,
        args: [customerId, customerId]
      });

      await db.execute({
        sql: `UPDATE customers
              SET customer_last_order_date = (
                SELECT MAX(order_created_at) FROM orders WHERE customer_id = ?
              )
              WHERE customer_id = ?`,
        args: [customerId, customerId]
      });

      await db.execute({
        sql: `UPDATE customers
              SET customer_avg_weight = (
                SELECT COALESCE(SUM(oi.item_quantity), 0) / NULLIF(COUNT(*), 0)
                FROM orders o
                JOIN order_items oi ON o.order_id = oi.order_id
                JOIN products p ON oi.product_id = p.product_id
                WHERE o.customer_id = ? AND p.product_unit = 'kg'
              )
              WHERE customer_id = ?`,
        args: [customerId, customerId]
      });

      await db.execute({
        sql: `UPDATE customers
              SET customer_avg_days = (
                SELECT ROUND(AVG(
                  CAST(strftime('%s', MAX(o2.order_created_at)) - strftime('%s', MIN(o1.order_created_at)) AS REAL) / 86400
                ), 1)
                FROM (
                  SELECT order_created_at
                  FROM orders
                  WHERE customer_id = ?
                  ORDER BY order_created_at ASC
                ) o1
                JOIN (
                  SELECT order_created_at
                  FROM orders
                  WHERE customer_id = ?
                  ORDER BY order_created_at ASC
                ) o2 ON o1.rowid = o2.rowid - 1
              )
              WHERE customer_id = ?`,
        args: [customerId, customerId, customerId]
      });

      successCount++;
      console.log(`✓ ${customerId} recalculated`);
    } catch (e) {
      errorCount++;
      console.error(`✗ ${customerId} error:`, e.message);
    }
  }

  console.log(`\nDone! Success: ${successCount}, Errors: ${errorCount}`);
}

recalculateAllProfiles().catch(console.error);
