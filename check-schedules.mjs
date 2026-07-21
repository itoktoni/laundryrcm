import { createClient } from '@libsql/client';

const db = createClient({
  url: process.env.TURSO_DATABASE_URL || 'file:local.db',
  authToken: process.env.TURSO_AUTH_TOKEN
});

console.log('--- whatsapp_schedules ---');
const r1 = await db.execute('SELECT schedule_id, schedule_type, schedule_name, schedule_enabled FROM whatsapp_schedules');
console.log(JSON.stringify(r1.rows, null, 2));

console.log('\n--- whatsapp_schedule_templates ---');
const r2 = await db.execute('SELECT template_id, schedule_id, template_text FROM whatsapp_schedule_templates');
console.log(JSON.stringify(r2.rows, null, 2));

console.log('\n--- app_settings (store_phone) ---');
const r3 = await db.execute("SELECT setting_key, setting_value FROM app_settings WHERE setting_key = 'store_phone'");
console.log(JSON.stringify(r3.rows, null, 2));

console.log('\n--- machines ---');
const r4 = await db.execute('SELECT machine_id, machine_name, machine_next_service FROM machines');
console.log(JSON.stringify(r4.rows, null, 2));

console.log('\n--- orders (selesai) ---');
const r5 = await db.execute("SELECT order_id, order_status, order_created_at FROM orders WHERE order_status = 'selesai' LIMIT 5");
console.log(JSON.stringify(r5.rows, null, 2));