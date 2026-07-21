import { createClient } from '@libsql/client';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = join(__dirname, '.env');

const TURSO_URL = 'libsql://laundry-app-itoktoni.aws-ap-northeast-1.turso.io';

const envContent = readFileSync(envPath, 'utf8');
const tokenMatch = envContent.match(/TURSO_AUTH_TOKEN=(.+)/);
const TURSO_AUTH_TOKEN = tokenMatch ? tokenMatch[1].trim() : null;

if (!TURSO_AUTH_TOKEN) {
	console.error('TURSO_AUTH_TOKEN not found in .env');
	process.exit(1);
}

const db = createClient({
	url: TURSO_URL,
	authToken: TURSO_AUTH_TOKEN
});

async function migrate() {
	try {
		console.log('[migrate-v12-turso] Creating whatsapp_schedules table...');
		await db.execute(`
			CREATE TABLE IF NOT EXISTS whatsapp_schedules (
				schedule_id TEXT PRIMARY KEY,
				schedule_type TEXT NOT NULL CHECK(schedule_type IN ('pending_pickup', 'inactive_customer', 'low_stock', 'machine_service', 'ready_delivery')),
				schedule_name TEXT NOT NULL,
				schedule_description TEXT,
				schedule_enabled INTEGER NOT NULL DEFAULT 1,
				schedule_cron_expression TEXT,
				schedule_days_threshold INTEGER,
				schedule_template TEXT,
				schedule_last_run TEXT,
				schedule_last_success TEXT,
				schedule_last_error TEXT,
				schedule_created_at TEXT NOT NULL DEFAULT (datetime('now')),
				schedule_updated_at TEXT NOT NULL DEFAULT (datetime('now'))
			)
		`);
		console.log('[migrate-v12-turso] ✓ whatsapp_schedules table created');

		console.log('[migrate-v12-turso] Creating whatsapp_schedule_logs table...');
		await db.execute(`
			CREATE TABLE IF NOT EXISTS whatsapp_schedule_logs (
				log_id TEXT PRIMARY KEY,
				schedule_id TEXT NOT NULL REFERENCES whatsapp_schedules(schedule_id),
				log_status TEXT NOT NULL CHECK(log_status IN ('success', 'failed', 'partial')),
				log_message_count INTEGER NOT NULL DEFAULT 0,
				log_error TEXT,
				log_created_at TEXT NOT NULL DEFAULT (datetime('now'))
			)
		`);
		console.log('[migrate-v12-turso] ✓ whatsapp_schedule_logs table created');

		console.log('[migrate-v12-turso] Creating whatsapp_pending_messages table...');
		await db.execute(`
			CREATE TABLE IF NOT EXISTS whatsapp_pending_messages (
				pending_id TEXT PRIMARY KEY,
				schedule_id TEXT NOT NULL REFERENCES whatsapp_schedules(schedule_id),
				schedule_type TEXT NOT NULL,
				phone TEXT NOT NULL,
				message TEXT NOT NULL,
				ref_type TEXT,
				ref_id TEXT,
				status TEXT NOT NULL DEFAULT 'queued' CHECK(status IN ('queued', 'sent', 'failed')),
				sent_at TEXT,
				error TEXT,
				created_at TEXT NOT NULL DEFAULT (datetime('now'))
			)
		`);
		console.log('[migrate-v12-turso] ✓ whatsapp_pending_messages table created');
		console.log('[migrate-v12-turso] ✓ Migration completed on Turso');
	} catch (err) {
		console.error('[migrate-v12-turso] ERROR', err.message);
		process.exit(1);
	}
}

migrate();