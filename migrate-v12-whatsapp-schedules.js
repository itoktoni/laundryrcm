import { createClient } from '@libsql/client';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = join(__dirname, '.env');

const envContent = readFileSync(envPath, 'utf8');
const dbUrlMatch = envContent.match(/DATABASE_URL=(.+)/);
const DB_URL = dbUrlMatch ? dbUrlMatch[1].trim() : 'file:local.db';

const db = createClient({ url: DB_URL });

async function migrate() {
	try {
		console.log('[migrate-v12] Starting on', DB_URL);

		// Create whatsapp_schedules table
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

		// Create execution log table
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

		// Insert default schedules
		const schedules = [
			{
				id: crypto.randomUUID(),
				type: 'pending_pickup',
				name: 'Pesanan Siap Diambil',
				desc: 'Notif baju sudah selesai dicuci dan siap diambil atau diantar',
				template: 'Halo {{customer_name}}, baju Anda sudah selesai dicuci. Silakan diambil di toko kami atau hubungi untuk pengiriman.'
			},
			{
				id: crypto.randomUUID(),
				type: 'inactive_customer',
				name: 'Customer Tidak Aktif',
				desc: 'Notif customer yang tidak mencuci lebih dari 1 minggu',
				template: 'Halo {{customer_name}}, lama tidak ada kabar. Kami rindu dengan Anda. Hubungi kami untuk mendapatkan promo khusus!'
			},
			{
				id: crypto.randomUUID(),
				type: 'low_stock',
				name: 'Stok Habis',
				desc: 'Notif ketika stok bahan inventory habis atau dibawah minimum',
				template: 'Alert: Stok {{item_name}} telah mencapai {{current_qty}} {{unit}} (minimum: {{min_qty}} {{unit}}). Segera lakukan pemesanan.'
			},
			{
				id: crypto.randomUUID(),
				type: 'machine_service',
				name: 'Jadwal Service Mesin',
				desc: 'Notif waktunya jadwal service mesin laundry',
				template: 'Reminder: Mesin {{machine_name}} perlu service. Jadwal terakhir: {{last_service}}. Status: {{machine_status}}.'
			},
			{
				id: crypto.randomUUID(),
				type: 'ready_delivery',
				name: 'Pesanan Siap Diantar',
				desc: 'Notif ketika pesanan yang sudah 3 hari tidak diambil dapat diantar',
				template: 'Halo {{customer_name}}, pesanan Anda sudah siap selama 3 hari. Kami siap mengantar. Berapa alamat pengiriman Anda?'
			}
		];

		for (const s of schedules) {
			await db.execute({
				sql: `INSERT OR IGNORE INTO whatsapp_schedules 
					(schedule_id, schedule_type, schedule_name, schedule_description, schedule_template, schedule_enabled)
					VALUES (?, ?, ?, ?, ?, 1)`,
				args: [s.id, s.type, s.name, s.desc, s.template]
			});
		}

		// Create pending messages table
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

		console.log('[migrate-v12] ✓ Tables created, default schedules inserted');
	} catch (err) {
		console.error('[migrate-v12] ERROR', err);
		process.exit(1);
	}
}

migrate();