import { createClient } from '@libsql/client';

const url = process.env.TURSO_DATABASE_URL || 'file:local.db';
const authToken = process.env.TURSO_AUTH_TOKEN;

const db = createClient({ url, authToken });

async function migrate() {
	try {
		console.log('Running migration: add order_payment_code column...');
		await db.execute(`
			ALTER TABLE orders ADD COLUMN order_payment_code TEXT;
		`);
		console.log('Migration completed: order_payment_code column added');
	} catch (err) {
		if (String(err.message || err).includes('duplicate column')) {
			console.log('Column order_payment_code already exists, skipping.');
		} else {
			console.error('Migration failed:', err);
			process.exit(1);
		}
	}
}

migrate();