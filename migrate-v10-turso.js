import { createClient } from '@libsql/client';

const db = createClient({
	url: 'libsql://laundry-app-itoktoni.aws-ap-northeast-1.turso.io',
	authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3ODQ0NDQ5MTUsImlkIjoiMDE5Zjc0NDEtZjgwMS03N2Q4LThiNTUtODQwZGQyNWIzYTk2Iiwia2lkIjoiOE1yUThLTHVYbV9ZenE0emIyM1B6cU5yeDJVSzBrOWUxUjl1NjlnQmVUYyIsInJpZCI6IjY2YWVjMjkyLTE3OTgtNGZlNC1iZmNjLTllNjhiYjc4MTZiNiJ9.mib6Yfi0HyV_KN-3xsxckjj7a_8-CxYbesjkCC9yYiqjD-pCISSjsFJx6hBV0BkUJNV_lV3dXsmMkJrNvv88DQ'
});

async function migrate() {
	try {
		console.log('Running migration on Turso: create machines table...');
		await db.execute(`
			CREATE TABLE IF NOT EXISTS machines (
				machine_id TEXT PRIMARY KEY,
				machine_name TEXT NOT NULL,
				machine_type TEXT NOT NULL,
				machine_status TEXT NOT NULL DEFAULT 'active' CHECK(machine_status IN ('active', 'broken', 'maintenance')),
				machine_last_service TEXT,
				machine_next_service TEXT,
				machine_created_at TEXT NOT NULL DEFAULT (datetime('now'))
			)
		`);
		console.log('Migration completed: machines table created on Turso');
	} catch (err) {
		console.error('Migration failed:', err);
		process.exit(1);
	}

	try {
		console.log('Running migration on Turso: create machine_services table...');
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
		console.log('Migration completed: machine_services table created on Turso');
	} catch (err) {
		console.error('Migration failed:', err);
		process.exit(1);
	}
}

migrate();