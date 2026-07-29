import { createClient } from '@libsql/client';

const db = createClient({
	url: process.env.TURSO_DATABASE_URL || 'file:local.db',
	authToken: process.env.TURSO_AUTH_TOKEN || undefined
});

async function addColumns() {
	console.log('Adding columns to customers table...');

	try {
		await db.execute(`ALTER TABLE customers ADD COLUMN customer_est_freq_days INTEGER DEFAULT 0`);
		console.log('✓ customer_est_freq_days added');
	} catch (e) {
		if (e.message.includes('duplicate column')) {
			console.log('✓ customer_est_freq_days already exists');
		} else {
			console.error('✗ customer_est_freq_days error:', e.message);
		}
	}

	try {
		await db.execute(`ALTER TABLE customers ADD COLUMN customer_est_weight REAL DEFAULT 0`);
		console.log('✓ customer_est_weight added');
	} catch (e) {
		if (e.message.includes('duplicate column')) {
			console.log('✓ customer_est_weight already exists');
		} else {
			console.error('✗ customer_est_weight error:', e.message);
		}
	}

	console.log('Migration completed successfully!');
}

addColumns().catch(console.error).finally(() => {
	db.close();
});