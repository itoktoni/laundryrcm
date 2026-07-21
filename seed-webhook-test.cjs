const { createClient } = require('@libsql/client');
const crypto = require('crypto');
const db = createClient({
  url: 'libsql://laundry-app-itoktoni.aws-ap-northeast-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3ODQ0NDQ5MTUsImlkIjoiMDE5Zjc0NDEtZjgwMS03N2Q4LThiNTUtODQwZGQyNWIzYTk2Iiwia2lkIjoiOE1yUThLTHVYbV9ZenE0emIyM1B6cU5yeDJVSzBrOWUxUjl1NjlnQmVUYyIsInJpZCI6IjY2YWVjMjkyLTE3OTgtNGZlNC1iZmNjLTllNjhiYjc4MTZiNiJ9.mib6Yfi0HyV_KN-3xsxckjj7a_8-CxYbesjkCC9yYiqjD-pCISSjsFJx6hBV0BkUJNV_lV3dXsmMkJrNvv88DQ'
});

function nanoid() {
  return crypto.randomBytes(20).toString('hex');
}

async function run() {
  console.log('=== Seeding webhook test data ===\n');

  // Get a valid user_id for FK constraint on order_created_by
  const user = (await db.execute(`SELECT user_id FROM users LIMIT 1`)).rows[0];
  if (!user) {
    console.error('No users in DB! Create a user first.');
    process.exit(1);
  }
  const userId = user.user_id;
  console.log('Using user_id:', userId);

  // Create test customers
  const customers = [
    { id: 'cust-test-overdue', name: 'Budi Santoso (Test Overdue)', phone: '62 812-3456-7890' },
    { id: 'cust-test-inactive', name: 'Sari Dewi (Test Inactive)', phone: '62 823-4567-8901' },
    { id: 'cust-test-ready', name: 'Andi Pratama (Test Ready)', phone: '62 834-5678-9012' },
  ];

  for (const c of customers) {
    try {
      await db.execute({
        sql: `INSERT OR IGNORE INTO customers (customer_id, customer_name, customer_phone) VALUES (?, ?, ?)`,
        args: [c.id, c.name, c.phone]
      });
      console.log(`  Created customer: ${c.name}`);
    } catch(e) {
      console.log(`  Customer ${c.id} exists`);
    }
  }

  // Get a product_id
  const products = (await db.execute(`SELECT product_id FROM products WHERE product_is_active = 1 LIMIT 1`)).rows;
  const productId = products[0]?.product_id || 'prod-cuci-per-kg';

  // Helper to insert order
  async function insertOrder(orderId, customerId, totalPrice, status, paymentStatus, notes) {
    await db.execute({
      sql: `INSERT INTO orders (order_id, customer_id, order_subtotal, order_discount_amount, order_total_price, order_status, order_payment_status, order_notes, order_created_by, order_unique_code, order_paid_amount) VALUES (?, ?, ?, 0, ?, ?, ?, ?, ?, ?, ?)`,
      args: [orderId, customerId, totalPrice, totalPrice, status, paymentStatus, notes, userId, nanoid().slice(0, 6), paymentStatus === 'paid' ? totalPrice : 0]
    });
    await db.execute({
      sql: `INSERT INTO order_items (item_id, order_id, product_id, item_quantity, item_price, item_subtotal) VALUES (?, ?, ?, 1, ?, ?)`,
      args: [nanoid(), orderId, productId, totalPrice, totalPrice]
    });
  }

  // 1. OVERDUE PICKUP: selesai+paid > 3 hari
  console.log('\n--- 1. overdue_pickup ---');
  const oid1 = nanoid();
  await insertOrder(oid1, customers[0].id, 25000, 'selesai', 'paid', 'Test overdue');
  await db.execute({ sql: `UPDATE orders SET order_created_at = datetime('now', '-5 days') WHERE order_id = ?`, args: [oid1] });
  console.log(`  Order ${oid1.slice(0,8)} → ${customers[0].name} (5 hari lalu)`);

  // 2. INACTIVE CUSTOMER: order > 7 hari lalu
  console.log('\n--- 2. inactive_customer ---');
  const oid2 = nanoid();
  await insertOrder(oid2, customers[1].id, 15000, 'selesai', 'paid', 'Test inactive');
  await db.execute({ sql: `UPDATE orders SET order_created_at = datetime('now', '-10 days') WHERE order_id = ?`, args: [oid2] });
  console.log(`  Order ${oid2.slice(0,8)} → ${customers[1].name} (10 hari lalu)`);

  // 3. LOW STOCK
  console.log('\n--- 3. low_stock ---');
  const inv = (await db.execute(`SELECT inventory_id, inventory_name, inventory_quantity, inventory_min_stock FROM inventory LIMIT 3`)).rows;
  for (const i of inv) {
    await db.execute({ sql: `UPDATE inventory SET inventory_quantity = 0 WHERE inventory_id = ?`, args: [i.inventory_id] });
    console.log(`  ${i.inventory_name}: stock → 0 (min: ${i.inventory_min_stock})`);
  }

  // 4. MACHINE SERVICE
  console.log('\n--- 4. machine_service ---');
  const mach = (await db.execute(`SELECT machine_id, machine_name FROM machines LIMIT 1`)).rows;
  if (mach.length) {
    await db.execute({ sql: `UPDATE machines SET machine_next_service = datetime('now', '-1 days') WHERE machine_id = ?`, args: [mach[0].machine_id] });
    console.log(`  ${mach[0].machine_name}: next_service → yesterday`);
  }

  // 5. READY DELIVERY: selesai+paid today
  console.log('\n--- 5. ready_delivery ---');
  const oid5 = nanoid();
  await insertOrder(oid5, customers[2].id, 18000, 'selesai', 'paid', 'Siap antar');
  console.log(`  Order ${oid5.slice(0,8)} → ${customers[2].name} (hari ini)`);

  // Summary
  const allOrders = (await db.execute(`SELECT order_id, customer_id, order_status, order_payment_status, order_created_at FROM orders WHERE order_status = 'selesai' AND order_payment_status = 'paid' ORDER BY order_created_at`)).rows;
  console.log('\n=== Orders selesai+paid ===');
  allOrders.forEach(r => console.log(`  ${r.order_id.slice(0,8)} | ${r.customer_id} | ${r.order_created_at}`));

  console.log('\n=== Done! Test with: ===');
  console.log('curl -X POST http://localhost:3000/api/webhook/schedule');
}

run().catch(e => { console.error('Error:', e.message); process.exit(1); });