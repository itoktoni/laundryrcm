import { createClient } from '@libsql/client';

const db = createClient({ url: 'file:local.db' });

// Drop old tables (keep sessions, users, customers, orders, transactions, inventory, machines)
const dropTables = [
	'DROP TABLE IF EXISTS order_items',
	'DROP TABLE IF EXISTS pricing',
	'DROP TABLE IF EXISTS services',
	'DROP TABLE IF EXISTS item_types'
];

// New products table
const createProducts = `CREATE TABLE IF NOT EXISTS products (
	product_id TEXT PRIMARY KEY,
	product_name TEXT NOT NULL,
	product_price REAL NOT NULL,
	product_unit TEXT NOT NULL DEFAULT 'kg',
	product_description TEXT,
	product_is_active INTEGER NOT NULL DEFAULT 1,
	product_created_at TEXT NOT NULL DEFAULT (datetime('now'))
)`;

// Updated order_items
const createOrderItems = `CREATE TABLE IF NOT EXISTS order_items (
	item_id TEXT PRIMARY KEY,
	order_id TEXT NOT NULL REFERENCES orders(order_id),
	product_id TEXT NOT NULL REFERENCES products(product_id),
	item_quantity REAL NOT NULL,
	item_price REAL NOT NULL,
	item_subtotal REAL NOT NULL,
	item_created_at TEXT NOT NULL DEFAULT (datetime('now'))
)`;

// Seed products
const seedProducts = `INSERT OR IGNORE INTO products (product_id, product_name, product_price, product_unit, product_description) VALUES
	('prod-cuci-baju', 'Cuci Baju', 8000, 'kg', 'Cuci baju biasa'),
	('prod-setrika-baju', 'Setrika Baju', 10000, 'kg', 'Setrika baju'),
	('prod-cucisetrika-baju', 'Cuci + Setrika Baju', 15000, 'kg', 'Cuci dan setrika baju'),
	('prod-express-baju', 'Express Baju', 20000, 'kg', 'Cuci kilat 4 jam'),
	('prod-dryclean', 'Dry Clean', 25000, 'kg', 'Cuci kering'),
	('prod-cuci-sprei', 'Cuci Sprei', 12000, 'kg', 'Cuci sprei/bedcover'),
	('prod-setrika-sprei', 'Setrika Sprei', 14000, 'kg', 'Setrika sprei'),
	('prod-cucisetrika-sprei', 'Cuci + Setrika Sprei', 18000, 'kg', 'Cuci dan setrika sprei'),
	('prod-cuci-jas', 'Cuci Jas', 30000, 'pcs', 'Cuci jas/blazer'),
	('prod-cuci-celana', 'Cuci Celana', 8000, 'kg', 'Cuci celana'),
	('prod-cuci-handuk', 'Cuci Handuk', 6000, 'kg', 'Cuci handuk'),
	('prod-cuci-selimut', 'Cuci Selimut', 15000, 'kg', 'Cuci selimut'),
	('prod-cuci-karpet', 'Cuci Karpet', 20000, 'kg', 'Cuci karpet'),
	('prod-stripping', 'Stripping Cover', 5000, 'pcs', 'Stripping cover jok')`;

console.log('Migrating to products schema...');

for (const sql of dropTables) {
	try { await db.execute(sql); } catch (e) { /* ignore */ }
}

await db.execute(createProducts);
await db.execute(createOrderItems);

// Seed
try {
	await db.execute(seedProducts);
} catch (e) {
	console.log('Seed error (might already exist):', e.message);
}

// Verify
const r = await db.execute('SELECT COUNT(*) as count FROM products');
console.log(`products: ${r.rows[0].count} rows`);

const all = await db.execute('SELECT product_name, product_price, product_unit FROM products');
console.log('Products:');
all.rows.forEach(r => console.log(`  - ${r.product_name}: Rp${r.product_price}/${r.product_unit}`));

console.log('Done!');
