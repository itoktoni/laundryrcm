import { createClient } from '@libsql/client';

const db = createClient({ url: 'file:local.db' });

// Drop old product-related tables if exist
const cleanup = [
	'DROP TABLE IF EXISTS order_items',
	'DROP TABLE IF EXISTS pricing',
	'DROP TABLE IF EXISTS services',
	'DROP TABLE IF EXISTS item_types'
];

for (const sql of cleanup) {
	try { await db.execute(sql); } catch (e) { /* ignore */ }
}

// Create products table
await db.execute(`CREATE TABLE IF NOT EXISTS products (
	product_id TEXT PRIMARY KEY,
	product_name TEXT NOT NULL,
	product_price REAL NOT NULL,
	product_unit TEXT NOT NULL DEFAULT 'kg',
	product_description TEXT,
	product_is_active INTEGER NOT NULL DEFAULT 1,
	product_created_at TEXT NOT NULL DEFAULT (datetime('now'))
)`);

// Create order_items
await db.execute(`CREATE TABLE IF NOT EXISTS order_items (
	item_id TEXT PRIMARY KEY,
	order_id TEXT NOT NULL REFERENCES orders(order_id),
	product_id TEXT NOT NULL REFERENCES products(product_id),
	item_quantity REAL NOT NULL,
	item_price REAL NOT NULL,
	item_subtotal REAL NOT NULL,
	item_created_at TEXT NOT NULL DEFAULT (datetime('now'))
)`);

// Clear old products
await db.execute('DELETE FROM products');

// Insert new products
await db.execute(`INSERT INTO products (product_id, product_name, product_price, product_unit, product_description) VALUES
	('prod-cuci-lipat', 'Cuci Lipat', 7000, 'kg', 'Cuci, kering, lipat'),
	('prod-cuci-setrika', 'Cuci Setrika', 10000, 'kg', 'Cuci, kering, setrika'),
	('prod-express', 'Express', 15000, 'kg', 'Cuci kilat 4 jam'),
	('prod-boneka', 'Boneka', 15000, 'pcs', 'Cuci boneka per pcs'),
	('prod-sprei', 'Sprei', 12000, 'kg', 'Cuci sprei/bedcover'),
	('prod-selimut', 'Selimut', 12000, 'kg', 'Cuci selimut'),
	('prod-karpet', 'Karpet', 15000, 'kg', 'Cuci karpet'),
	('prod-jas', 'Jas/Blazer', 25000, 'pcs', 'Cuci jas/blazer per pcs'),
	('prod-dryclean', 'Dry Clean', 30000, 'kg', 'Cuci kering khusus')`);

// Verify
const r = await db.execute('SELECT product_name, product_price, product_unit FROM products ORDER BY product_name');
console.log('Products:');
r.rows.forEach(r => console.log(`  ${r.product_name}: Rp${r.product_price.toLocaleString()}/${r.product_unit}`));
console.log(`\nTotal: ${r.rows.length} products`);
