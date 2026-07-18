import { createClient } from '@libsql/client';

const db = createClient({ url: 'file:local.db' });

// Create categories table
await db.execute(`CREATE TABLE IF NOT EXISTS categories (
	category_id TEXT PRIMARY KEY,
	category_name TEXT NOT NULL UNIQUE,
	category_created_at TEXT NOT NULL DEFAULT (datetime('now'))
)`);

// Add category_id column to products (if not exists)
try {
	await db.execute(`ALTER TABLE products ADD COLUMN category_id TEXT REFERENCES categories(category_id)`);
} catch (e) {
	// column already exists
}

// Seed categories
await db.execute(`INSERT OR IGNORE INTO categories (category_id, category_name) VALUES
	('cat-kiloan', 'Kiloan'),
	('cat-satuan', 'Satuan'),
	('cat-tambahan', 'Layanan Tambahan')
`);

// Update products with category
const updates = [
	['prod-cuci-lipat', 'cat-kiloan'],
	['prod-cuci-setrika', 'cat-kiloan'],
	['prod-express', 'cat-kiloan'],
	['prod-sprei', 'cat-kiloan'],
	['prod-selimut', 'cat-kiloan'],
	['prod-karpet', 'cat-kiloan'],
	['prod-dryclean', 'cat-kiloan'],
	['prod-boneka', 'cat-satuan'],
	['prod-jas', 'cat-satuan']
];

for (const [prodId, catId] of updates) {
	await db.execute({
		sql: 'UPDATE products SET category_id = ? WHERE product_id = ?',
		args: [catId, prodId]
	});
}

// Verify
const cats = await db.execute('SELECT * FROM categories');
console.log('Categories:');
cats.rows.forEach(c => console.log(`  ${c.category_id}: ${c.category_name}`));

const prods = await db.execute(`SELECT p.product_name, p.product_price, p.product_unit, c.category_name 
	FROM products p LEFT JOIN categories c ON p.category_id = c.category_id 
	ORDER BY c.category_name, p.product_name`);
console.log('\nProducts:');
prods.rows.forEach(p => console.log(`  [${p.category_name}] ${p.product_name}: Rp${p.product_price}/${p.product_unit}`));
