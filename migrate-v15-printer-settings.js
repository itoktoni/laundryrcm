// Migration v15: Add printer-related settings
import { createClient } from '@libsql/client';

const db = createClient({ url: process.env.TURSO_DATABASE_URL || 'file:local.db' });

const rows = [
	['printer_enabled', '1', 'public', 0, 30],
	['printer_auto_print', '1', 'public', 0, 31],
	['printer_copies', '1', 'public', 0, 32]
];

for (const [key, value, status, mandatory, urutan] of rows) {
	await db.execute({
		sql: `INSERT INTO app_settings (setting_key, setting_value, status, mandatory, urutan, setting_updated_at)
			VALUES (?, ?, ?, ?, ?, datetime('now'))
			ON CONFLICT(setting_key) DO UPDATE SET
				setting_value = excluded.setting_value,
				status = excluded.status,
				mandatory = excluded.mandatory,
				urutan = excluded.urutan,
				setting_updated_at = datetime('now')`,
		args: [key, value, status, mandatory, urutan]
	});
	console.log('migrated printer setting:', key);
}

console.log('Migration v15 completed: printer settings added');