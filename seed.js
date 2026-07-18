import { createClient } from '@libsql/client';

const db = createClient({ url: 'file:local.db' });

const seedData = [
	`INSERT OR IGNORE INTO item_types (item_type_id, item_type_name) VALUES ('type-baju', 'Baju'), ('type-sprei', 'Sprei'), ('type-jas', 'Jas'), ('type-celana', 'Celana'), ('type-handuk', 'Handuk'), ('type-selimut', 'Selimut'), ('type-karpet', 'Karpet')`,

	`INSERT OR IGNORE INTO services (service_id, service_name, service_description) VALUES ('svc-cuci', 'Cuci', 'Cuci biasa'), ('svc-setrika', 'Setrika', 'Setrika saja'), ('svc-cucisetrika', 'Cuci + Setrika', 'Cuci dan setrika'), ('svc-express', 'Express', 'Cuci kilat 4 jam'), ('svc-dryclean', 'Dry Clean', 'Cuci kering')`,

	`INSERT OR IGNORE INTO pricing (pricing_id, item_type_id, service_id, pricing_price_per_kg) VALUES
		('price-1', 'type-baju', 'svc-cuci', 8000),
		('price-2', 'type-baju', 'svc-setrika', 10000),
		('price-3', 'type-baju', 'svc-cucisetrika', 15000),
		('price-4', 'type-baju', 'svc-express', 20000),
		('price-5', 'type-baju', 'svc-dryclean', 25000),
		('price-6', 'type-sprei', 'svc-cuci', 12000),
		('price-7', 'type-sprei', 'svc-setrika', 14000),
		('price-8', 'type-sprei', 'svc-cucisetrika', 18000),
		('price-9', 'type-jas', 'svc-dryclean', 30000),
		('price-10', 'type-celana', 'svc-cuci', 8000),
		('price-11', 'type-celana', 'svc-setrika', 10000),
		('price-12', 'type-celana', 'svc-cucisetrika', 15000),
		('price-13', 'type-handuk', 'svc-cuci', 6000),
		('price-14', 'type-handuk', 'svc-cucisetrika', 10000),
		('price-15', 'type-selimut', 'svc-cuci', 15000),
		('price-16', 'type-selimut', 'svc-cucisetrika', 22000),
		('price-17', 'type-karpet', 'svc-cuci', 20000),
		('price-18', 'type-karpet', 'svc-cucisetrika', 28000)`
];

for (const sql of seedData) {
	try {
		await db.execute(sql);
		console.log('OK:', sql.substring(0, 40) + '...');
	} catch (e) {
		console.error('Error:', e.message);
	}
}

const checks = ['item_types', 'services', 'pricing'];
for (const table of checks) {
	const r = await db.execute(`SELECT COUNT(*) as count FROM ${table}`);
	console.log(`${table}: ${r.rows[0].count} rows`);
}
