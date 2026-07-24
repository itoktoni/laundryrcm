import { createClient } from '@libsql/client';

const db = createClient({
	url: 'file:laundry-app.db'
});

try {
	await db.execute(`
		CREATE TABLE IF NOT EXISTS attendance (
			attendance_id TEXT PRIMARY KEY,
			user_id TEXT NOT NULL REFERENCES users(user_id),
			type TEXT NOT NULL CHECK(type IN ('masuk', 'keluar')),
			latitude REAL NOT NULL,
			longitude REAL NOT NULL,
			photo TEXT NOT NULL,
			location_name TEXT,
			distance_meters REAL NOT NULL,
			status TEXT NOT NULL DEFAULT 'success' CHECK(status IN ('success', 'failed')),
			created_at TEXT NOT NULL DEFAULT (datetime('now'))
		)
	`);
	console.log('Attendance table migration completed successfully!');
} catch (e) {
	console.error('Migration error:', e.message);
	process.exit(1);
}
