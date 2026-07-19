import { createClient } from '@libsql/client';

const db = createClient({ url: process.env.TURSO_DATABASE_URL || 'file:local.db' });

await db.execute(`CREATE TABLE IF NOT EXISTS app_settings (
	setting_key TEXT PRIMARY KEY,
	setting_value TEXT,
	setting_updated_at TEXT NOT NULL DEFAULT (datetime('now')),
	status TEXT NOT NULL DEFAULT 'public',
	mandatory INTEGER NOT NULL DEFAULT 0,
	urutan INTEGER NOT NULL DEFAULT 0
)`);

// [key, value, status, mandatory, urutan]
// value kosong untuk secret (diisi manual via setting page)
const rows = [
	['store_name', 'LaundryKu', 'public', 1, 1],
	['store_address', '', 'public', 1, 2],
	['store_phone', '', 'public', 1, 3],
	['store_email', '', 'public', 1, 4],
	['store_lat', '', 'public', 1, 7],
	['store_lng', '', 'public', 1, 8],
	['open_hours', '08:00-20:00', 'public', 1, 10],
	['currency', 'IDR', 'public', 1, 5],
	['qris', '', 'public', 1, 1],
	['uniq', '1', 'public', 1, 2],
	['webhook', '', 'public', 1, 3],
	['provider', 'telegram', 'public', 1, 6],
	['pickup_radius_km', '3', 'public', 1, 21],
	['pickup_price_per_km', '2000', 'public', 1, 27],
	['ai_base_url', '', 'private', 1, 13],
	['ai_model', '', 'private', 1, 4],
	['ai_api_key', '', 'private', 1, 9],
	['qris_api_key', '', 'private', 1, 17],
	['fonnte_token', '', 'private', 1, 16],
	['telegram_bot_token', '', 'private', 1, 23],
	['telegram_user_id', '', 'private', 1, 22],
	['webhook_basic_user', '', 'private', 1, 26],
	['webhook_basic_pass', '', 'private', 1, 25],
	['webhook_debug', '0', 'private', 1, 19]
];

for (const [key, value, status, mandatory, urutan] of rows) {
	await db.execute({
		sql: `INSERT INTO app_settings (setting_key, setting_value, status, mandatory, urutan, setting_updated_at)
			VALUES (?, ?, ?, ?, ?, datetime('now'))
			ON CONFLICT(setting_key) DO UPDATE SET status = excluded.status, mandatory = excluded.mandatory, urutan = excluded.urutan, setting_updated_at = datetime('now')`,
		args: [key, value, status, mandatory, urutan]
	});
	console.log('seed', key);
}
console.log('done');
