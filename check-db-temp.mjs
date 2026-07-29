import { createClient } from '@libsql/client';
const db = createClient({ url: 'file:local.db' });

// 1. Check if customer profile columns exist
try {
  const r = await db.execute("SELECT customer_avg_weight, customer_avg_days, customer_last_order_date, customer_notes FROM customers WHERE customer_id = 'cust-test-overdue'");
  console.log('Profile columns:', r.rows[0] || 'customer not found');
} catch (e) {
  console.error('Columns missing:', e.message);
}

// 2. Check all orders for this customer
const orders = await db.execute("SELECT * FROM orders WHERE customer_id = 'cust-test-overdue'");
console.log('\nOrders:', orders.rows.length);
orders.rows.forEach(o => console.log(' ', o.order_id, o.order_status, o.order_created_at));

// 3. Check order items
for (const o of orders.rows) {
  const items = await db.execute({
    sql: `SELECT oi.*, p.product_name, p.product_unit FROM order_items oi JOIN products p ON oi.product_id = p.product_id WHERE oi.order_id = ?`,
    args: [o.order_id]
  });
  console.log(`\nItems for ${o.order_id}:`);
  items.rows.forEach(i => console.log(' ', i.product_name, i.item_quantity, i.product_unit, i.item_subtotal));
}

// 4. Full customer row
const cust = await db.execute("SELECT * FROM customers WHERE customer_id = 'cust-test-overdue'");
console.log('\nFull customer:', JSON.stringify(cust.rows[0], null, 2));
