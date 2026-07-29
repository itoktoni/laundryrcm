import { createClient } from '@libsql/client';

const db = createClient({
	url: process.env.TURSO_DATABASE_URL || 'file:local.db',
	authToken: process.env.TURSO_AUTH_TOKEN || undefined
});

try {
	await db.execute(`ALTER TABLE customers ADD COLUMN customer_est_freq TEXT`);
	console.log('customer_est_freq column added');
} catch (e) {
	if (e.message.includes('duplicate column')) {
		console.log('customer_est_freq column already exists, skipping');
	} else {
		console.error('Migration error:', e.message);
		process.exit(1);
	}
}

console.log('migrate-v18-customer-est-freq: done');
