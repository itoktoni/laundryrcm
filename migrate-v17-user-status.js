import { createClient } from '@libsql/client';

const db = createClient({
	url: process.env.TURSO_DATABASE_URL || 'file:local.db',
	authToken: process.env.TURSO_AUTH_TOKEN || undefined
});

try {
	await db.execute(`ALTER TABLE users ADD COLUMN user_status TEXT NOT NULL DEFAULT 'approved'`);
	console.log('user_status column added (existing users set to approved)');
} catch (e) {
	if (e.message.includes('duplicate column')) {
		console.log('user_status column already exists, skipping');
	} else {
		console.error('Migration error:', e.message);
		process.exit(1);
	}
}

const rows = await db.execute('SELECT user_name, user_email, user_role, user_status FROM users');
console.log('Users:');
rows.rows.forEach((u) => console.log(`  ${u.user_name} <${u.user_email}> [${u.user_role}] [${u.user_status}]`));
