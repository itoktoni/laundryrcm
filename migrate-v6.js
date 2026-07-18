import { createClient } from '@libsql/client';

const db = createClient({ url: 'file:local.db' });

// SQLite can't ALTER CHECK; rebuild users table with new role set (owner, admin, staff)
await db.execute('PRAGMA foreign_keys=OFF');

await db.execute(`CREATE TABLE IF NOT EXISTS users_new (
	user_id TEXT PRIMARY KEY,
	user_name TEXT NOT NULL,
	user_email TEXT NOT NULL UNIQUE,
	user_password TEXT NOT NULL,
	user_role TEXT NOT NULL CHECK(user_role IN ('owner', 'admin', 'staff')),
	user_created_at TEXT NOT NULL DEFAULT (datetime('now'))
)`);

// Map old 'karyawan' -> 'staff'
await db.execute(`INSERT OR IGNORE INTO users_new (user_id, user_name, user_email, user_password, user_role, user_created_at)
	SELECT user_id, user_name, user_email, user_password,
		CASE user_role WHEN 'karyawan' THEN 'staff' WHEN 'owner' THEN 'owner' WHEN 'admin' THEN 'admin' WHEN 'staff' THEN 'staff' ELSE 'staff' END,
		user_created_at
	FROM users`);

await db.execute('DROP TABLE users');
await db.execute('ALTER TABLE users_new RENAME TO users');
await db.execute('PRAGMA foreign_keys=ON');

const rows = await db.execute('SELECT user_name, user_email, user_role FROM users');
console.log('Users:');
rows.rows.forEach((u) => console.log(`  ${u.user_name} <${u.user_email}> [${u.user_role}]`));
