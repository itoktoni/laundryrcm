import { createClient } from '@libsql/client';
import { readFileSync } from 'node:fs';

// read .env manually to avoid shell quoting issues
const envText = readFileSync(new URL('./.env', import.meta.url), 'utf8');
for (const line of envText.split('\n')) {
	const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.*)\s*$/);
	if (m) process.env[m[1]] = m[2];
}

const url = process.env.TURSO_DATABASE_URL || 'file:local.db';
const authToken = process.env.TURSO_AUTH_TOKEN || undefined;

const db = createClient({ url, authToken });

try {
	console.log('Running migration against', url);
	await db.execute(`ALTER TABLE orders ADD COLUMN order_payment_code TEXT;`);
	console.log('Migration completed: order_payment_code column added');
} catch (err) {
	if (String(err.message || err).includes('duplicate column')) {
		console.log('Column order_payment_code already exists, skipping.');
	} else {
		console.error('Migration failed:', err);
		process.exit(1);
	}
}