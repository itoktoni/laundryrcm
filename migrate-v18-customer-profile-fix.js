import { createClient } from '@libsql/client';

const db = createClient({
	url: process.env.TURSO_DATABASE_URL || 'file:local.db',
	authToken: process.env.TURSO_AUTH_TOKEN || undefined
});

try {
	await db.execute(`ALTER TABLE customers ADD COLUMN customer_est_freq_days INTEGER DEFAULT 0`);
	console.log('customer_est_freq_days column added');
} catch (e) {
	if (e.message.includes('duplicate column')) {
		console.log('customer_est_freq_days column already exists, skipping');
	} else {
		console.error('customer_est_freq_days error:', e.message);
		process.exit(1);
	}
}

try {
	await db.execute(`ALTER TABLE customers ADD COLUMN customer_est_weight REAL DEFAULT 0`);
	console.log('customer_est_weight column added');
} catch (e) {
	if (e.message.includes('duplicate column')) {
		console.log('customer_est_weight column already exists, skipping');
	} else {
		console.error('customer_est_weight error:', e.message);
		process.exit(1);
	}
}

console.log('migrate-v18-customer-profile-fix: done');