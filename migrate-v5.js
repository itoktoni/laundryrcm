import { createClient } from '@libsql/client';

const db = createClient({ url: 'file:local.db' });

for (const col of ['order_unique_code TEXT', 'order_paid_amount REAL']) {
	try {
		await db.execute(`ALTER TABLE orders ADD COLUMN ${col}`);
		console.log('Added:', col);
	} catch (e) {
		console.log('Skip (exists):', col);
	}
}

const cols = await db.execute('PRAGMA table_info(orders)');
console.log('\norders columns:');
cols.rows.forEach((c) => console.log('  ' + c.name));
