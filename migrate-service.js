import { db } from './src/lib/server/db.js';

async function migrate() {
	try {
		await db.execute(`
			CREATE TABLE IF NOT EXISTS machine_services (
				service_id TEXT PRIMARY KEY,
				machine_id TEXT NOT NULL REFERENCES machines(machine_id),
				service_date TEXT NOT NULL,
				service_description TEXT NOT NULL,
				service_cost REAL NOT NULL DEFAULT 0,
				service_notes TEXT,
				service_created_at TEXT NOT NULL DEFAULT (datetime('now'))
			)
		`);
		console.log('Migration completed: machine_services table created');
	} catch (err) {
		console.error('Migration failed:', err);
		process.exit(1);
	}
}

migrate();