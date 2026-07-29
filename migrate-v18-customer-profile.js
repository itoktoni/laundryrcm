import { createClient } from '@libsql/client';

const db = createClient({
	url: process.env.TURSO_DATABASE_URL || 'file:local.db',
	authToken: process.env.TURSO_AUTH_TOKEN || undefined
});

const columns = [
	['customer_avg_weight', 'REAL DEFAULT 0'],
	['customer_avg_days', 'REAL DEFAULT 0'],
	['customer_last_order_date', 'TEXT'],
	['customer_notes', 'TEXT']
];

for (const [col, type] of columns) {
	try {
		await db.execute(`ALTER TABLE customers ADD COLUMN ${col} ${type}`);
		console.log(`  + ${col}`);
	} catch (e) {
		if (e.message.includes('duplicate column')) {
			console.log(`  ${col} already exists, skipping`);
		} else {
			console.error(`  ${col} error:`, e.message);
			process.exit(1);
		}
	}
}

console.log('migrate-v18-customer-profile: done');
