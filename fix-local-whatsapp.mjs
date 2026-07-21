import { createClient } from '@libsql/client';

const db = createClient({ url: 'file:local.db' });

// 1) Create tables
await db.executeMultiple(`
  CREATE TABLE IF NOT EXISTS whatsapp_schedules (
    schedule_id TEXT PRIMARY KEY,
    schedule_type TEXT NOT NULL UNIQUE,
    schedule_name TEXT NOT NULL,
    schedule_enabled INTEGER NOT NULL DEFAULT 1,
    schedule_template TEXT,
    schedule_last_run TEXT,
    schedule_last_success TEXT,
    schedule_last_error TEXT,
    schedule_created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS whatsapp_pending_messages (
    pending_id TEXT PRIMARY KEY,
    schedule_id TEXT NOT NULL,
    schedule_type TEXT NOT NULL,
    phone TEXT NOT NULL,
    message TEXT NOT NULL,
    ref_type TEXT,
    ref_id TEXT,
    status TEXT NOT NULL DEFAULT 'queued',
    sent_at TEXT,
    error TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS whatsapp_schedule_logs (
    log_id TEXT PRIMARY KEY,
    schedule_id TEXT NOT NULL,
    log_status TEXT NOT NULL,
    log_message_count INTEGER DEFAULT 0,
    log_error TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);
console.log('Tables created.');

// 2) Seed schedules
const schedules = [
  ['pending_pickup', 'Lewat Ambil (>3 hari)', 'Pesanan Anda sudah 3 hari belum diambil.'],
  ['inactive_customer', 'Belum Cuci Lagi (>1 minggu)', 'Kami rindu dengan Anda! Sudah lama tidak cuci.'],
  ['low_stock', 'Stok Habis', 'Stok barang habis, segera beli!'],
  ['machine_service', 'Service Mesin', 'Mesin perlu service.'],
  ['ready_delivery', 'Siap Diambil/Diantar', 'Pesanan Anda sudah selesai dan siap diambil.']
];

for (const [type, name, tpl] of schedules) {
  await db.execute({
    sql: `INSERT INTO whatsapp_schedules (schedule_id, schedule_type, schedule_name, schedule_template)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(schedule_type) DO UPDATE SET schedule_template = excluded.schedule_template, schedule_name = excluded.schedule_name`,
    args: [crypto.randomUUID(), type, name, tpl]
  });
  console.log('seeded', type);
}

// 3) Check
const r = await db.execute('SELECT schedule_type, schedule_name, schedule_template, schedule_enabled FROM whatsapp_schedules');
console.log('\nAll schedules:');
console.table(r.rows);

// 4) Check store_phone
const p = await db.execute("SELECT setting_key, setting_value FROM app_settings WHERE setting_key = 'store_phone'");
console.log('\nstore_phone:', p.rows[0]?.setting_value || '(empty)');