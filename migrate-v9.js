import { createClient } from '@libsql/client';

const db = createClient({ url: 'file:local.db' });

await db.execute(`CREATE TABLE IF NOT EXISTS app_settings (
	setting_key TEXT PRIMARY KEY,
	setting_value TEXT,
	setting_updated_at TEXT NOT NULL DEFAULT (datetime('now'))
)`);

const seed = [
	['laundry_name', 'LaundryKu'],
	['laundry_address', 'Jl. Contoh No. 123, Kota Anda'],
	['laundry_phone', '08123456789'],
	['laundry_email', 'info@laundryku.com'],
	['laundry_slogan', 'Cucian bersih, wangi, dan rapi'],
	['open_hours', '08:00 - 20:00']
];

for (const [k, v] of seed) {
	await db.execute({
		sql: 'INSERT OR IGNORE INTO app_settings (setting_key, setting_value) VALUES (?, ?)',
		args: [k, v]
	});
}

const rows = await db.execute('SELECT setting_key, setting_value FROM app_settings');
console.log('App settings:');
rows.rows.forEach((r) => console.log(`  ${r.setting_key} = ${r.setting_value}`));
