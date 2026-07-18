import { createClient } from '@libsql/client';

const db = createClient({ url: 'file:local.db' });

const migrations = [
	`CREATE TABLE IF NOT EXISTS sessions (session_id TEXT PRIMARY KEY, user_id TEXT NOT NULL, expires_at TEXT NOT NULL)`,

	`CREATE TABLE IF NOT EXISTS users (user_id TEXT PRIMARY KEY, user_name TEXT NOT NULL, user_email TEXT NOT NULL UNIQUE, user_password TEXT NOT NULL, user_role TEXT NOT NULL CHECK(user_role IN ('owner', 'karyawan')), user_created_at TEXT NOT NULL DEFAULT (datetime('now')))`,

	`CREATE TABLE IF NOT EXISTS customers (customer_id TEXT PRIMARY KEY, customer_name TEXT NOT NULL, customer_phone TEXT NOT NULL, customer_address TEXT, customer_vip INTEGER NOT NULL DEFAULT 0, customer_total_orders INTEGER NOT NULL DEFAULT 0, customer_created_at TEXT NOT NULL DEFAULT (datetime('now')))`,

	`CREATE TABLE IF NOT EXISTS item_types (item_type_id TEXT PRIMARY KEY, item_type_name TEXT NOT NULL UNIQUE, item_type_created_at TEXT NOT NULL DEFAULT (datetime('now')))`,

	`CREATE TABLE IF NOT EXISTS services (service_id TEXT PRIMARY KEY, service_name TEXT NOT NULL UNIQUE, service_description TEXT, service_created_at TEXT NOT NULL DEFAULT (datetime('now')))`,

	`CREATE TABLE IF NOT EXISTS pricing (pricing_id TEXT PRIMARY KEY, item_type_id TEXT NOT NULL REFERENCES item_types(item_type_id), service_id TEXT NOT NULL REFERENCES services(service_id), pricing_price_per_kg REAL NOT NULL, pricing_created_at TEXT NOT NULL DEFAULT (datetime('now')), UNIQUE(item_type_id, service_id))`,

	`CREATE TABLE IF NOT EXISTS promotions (promo_id TEXT PRIMARY KEY, promo_name TEXT NOT NULL, promo_type TEXT NOT NULL CHECK(promo_type IN ('percent', 'nominal', 'package')), promo_value REAL NOT NULL, promo_min_order REAL, promo_code TEXT UNIQUE, promo_start_date TEXT NOT NULL, promo_end_date TEXT NOT NULL, promo_is_active INTEGER NOT NULL DEFAULT 1, promo_created_at TEXT NOT NULL DEFAULT (datetime('now')))`,

	`CREATE TABLE IF NOT EXISTS orders (order_id TEXT PRIMARY KEY, customer_id TEXT NOT NULL REFERENCES customers(customer_id), promo_id TEXT REFERENCES promotions(promo_id), order_subtotal REAL NOT NULL, order_discount_amount REAL NOT NULL DEFAULT 0, order_total_price REAL NOT NULL, order_status TEXT NOT NULL DEFAULT 'pending' CHECK(order_status IN ('pending', 'cuci', 'kering', 'setrika', 'selesai', 'diambil')), order_payment_status TEXT NOT NULL DEFAULT 'unpaid' CHECK(order_payment_status IN ('unpaid', 'paid')), order_notes TEXT, order_created_by TEXT NOT NULL REFERENCES users(user_id), order_created_at TEXT NOT NULL DEFAULT (datetime('now')))`,

	`CREATE TABLE IF NOT EXISTS order_items (item_id TEXT PRIMARY KEY, order_id TEXT NOT NULL REFERENCES orders(order_id), item_type_id TEXT NOT NULL REFERENCES item_types(item_type_id), service_id TEXT NOT NULL REFERENCES services(service_id), item_weight_kg REAL NOT NULL, item_price_per_kg REAL NOT NULL, item_subtotal REAL NOT NULL, item_created_at TEXT NOT NULL DEFAULT (datetime('now')))`,

	`CREATE TABLE IF NOT EXISTS transactions (transaction_id TEXT PRIMARY KEY, order_id TEXT REFERENCES orders(order_id), transaction_type TEXT NOT NULL CHECK(transaction_type IN ('income', 'expense')), transaction_amount REAL NOT NULL, transaction_category TEXT NOT NULL, transaction_description TEXT, transaction_date TEXT NOT NULL, transaction_created_at TEXT NOT NULL DEFAULT (datetime('now')))`,

	`CREATE TABLE IF NOT EXISTS inventory (inventory_id TEXT PRIMARY KEY, inventory_name TEXT NOT NULL, inventory_quantity REAL NOT NULL, inventory_unit TEXT NOT NULL, inventory_min_stock REAL NOT NULL, inventory_last_restocked TEXT, inventory_created_at TEXT NOT NULL DEFAULT (datetime('now')))`,

	`CREATE TABLE IF NOT EXISTS machines (machine_id TEXT PRIMARY KEY, machine_name TEXT NOT NULL, machine_type TEXT NOT NULL, machine_status TEXT NOT NULL DEFAULT 'active' CHECK(machine_status IN ('active', 'broken', 'maintenance')), machine_last_service TEXT, machine_next_service TEXT, machine_created_at TEXT NOT NULL DEFAULT (datetime('now')))`
];

const seeds = [
	`INSERT OR IGNORE INTO item_types (item_type_id, item_type_name) VALUES ('type-baju', 'Baju'), ('type-sprei', 'Sprei'), ('type-jas', 'Jas'), ('type-celana', 'Celana'), ('type-handuk', 'Handuk'), ('type-selimut', 'Selimut'), ('type-karpet', 'Karpet')`,

	`INSERT OR IGNORE INTO services (service_id, service_name, service_description) VALUES ('svc-cuci', 'Cuci', 'Cuci biasa'), ('svc-setrika', 'Setrika', 'Setrika saja'), ('svc-cucisetrika', 'Cuci + Setrika', 'Cuci dan setrika'), ('svc-express', 'Express', 'Cuci kilat 4 jam'), ('svc-dryclean', 'Dry Clean', 'Cuci kering')`,

	`INSERT OR IGNORE INTO pricing (pricing_id, item_type_id, service_id, pricing_price_per_kg) VALUES ('price-1','type-baju','svc-cuci',8000), ('price-2','type-baju','svc-setrika',10000), ('price-3','type-baju','svc-cucisetrika',15000), ('price-4','type-baju','svc-express',20000), ('price-5','type-baju','svc-dryclean',25000), ('price-6','type-sprei','svc-cuci',12000), ('price-7','type-sprei','svc-setrika',14000), ('price-8','type-sprei','svc-cucisetrika',18000), ('price-9','type-jas','svc-dryclean',30000), ('price-10','type-celana','svc-cuci',8000), ('price-11','type-celana','svc-setrika',10000), ('price-12','type-celana','svc-cucisetrika',15000), ('price-13','type-handuk','svc-cuci',6000), ('price-14','type-handuk','svc-cucisetrika',10000), ('price-15','type-selimut','svc-cuci',15000), ('price-16','type-selimut','svc-cucisetrika',22000), ('price-17','type-karpet','svc-cuci',20000), ('price-18','type-karpet','svc-cucisetrika',28000)`
];

console.log('Creating tables...');
for (const sql of migrations) {
	try {
		await db.execute(sql);
	} catch (e) {
		console.error('Migration error:', e.message);
	}
}

console.log('Seeding data...');
for (const sql of seeds) {
	try {
		await db.execute(sql);
	} catch (e) {
		console.error('Seed error:', e.message);
	}
}

const tables = ['sessions','users','customers','item_types','services','pricing','promotions','orders','order_items','transactions','inventory','machines'];
for (const t of tables) {
	const r = await db.execute(`SELECT COUNT(*) as count FROM ${t}`);
	console.log(`  ${t}: ${r.rows[0].count} rows`);
}

console.log('Done!');
