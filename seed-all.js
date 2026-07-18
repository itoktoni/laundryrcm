import { createClient } from '@libsql/client';
import { webcrypto } from 'node:crypto';

function hashPassword(password) {
	const data = new TextEncoder().encode(password);
	return webcrypto.subtle.digest('SHA-256', data).then((b) => {
		const h = Array.from(new Uint8Array(b));
		return h.map((x) => x.toString(16).padStart(2, '0')).join('');
	});
}

const db = createClient({
	url: process.env.TURSO_DATABASE_URL || 'file:local.db',
	authToken: process.env.TURSO_AUTH_TOKEN || undefined
});

const now = new Date().toISOString();

// Customers
await db.execute(`INSERT OR IGNORE INTO customers (customer_id, customer_name, customer_phone, customer_address, customer_vip, customer_total_orders) VALUES
	('cust-walk-in', 'Walk Customer', '-', null, 0, 0)
`);

// Users
const users = [
	{ id: 'user-owner', name: 'Owner Laundry', email: 'owner@laundryku.com', password: 'owner123', role: 'owner' },
	{ id: 'user-admin', name: 'Admin Laundry', email: 'admin@laundryku.com', password: 'admin123', role: 'admin' },
	{ id: 'user-staff', name: 'Staff Laundry', email: 'staff@laundryku.com', password: 'staff123', role: 'staff' }
];

for (const u of users) {
	const hashed = await hashPassword(u.password);
	await db.execute({
		sql: 'INSERT OR IGNORE INTO users (user_id, user_name, user_email, user_password, user_role) VALUES (?, ?, ?, ?, ?)',
		args: [u.id, u.name, u.email, hashed, u.role]
	});
}

// App settings
await db.execute(`INSERT OR IGNORE INTO app_settings (setting_key, setting_value, setting_updated_at) VALUES
	('store_name', 'LaundryKu', '${now}'),
	('store_address', 'Jl. Contoh No. 123, BERBAH', '${now}'),
	('store_phone', '08123456789', '${now}'),
	('store_email', 'owner@laundryku.com', '${now}'),
	('qris', '', '${now}'),
	('currency', 'IDR', '${now}'),
	('open_hours', '08:00-20:00', '${now}')
`);

// Categories
await db.execute(`INSERT OR IGNORE INTO categories (category_id, category_name, category_created_at) VALUES
	('cat-cuci', 'Cuci', '${now}'),
	('cat-setrika', 'Setrika', '${now}'),
	('cat-dryclean', 'Dry Clean', '${now}'),
	('cat-tambahan', 'Layanan Tambahan', '${now}'),
	('cat-parfum', 'Parfum', '${now}')
`);

// Products
await db.execute(`INSERT OR IGNORE INTO products (product_id, product_name, product_price, product_unit, product_description, product_is_active, product_created_at, category_id) VALUES
	('prod-cuci-per-kg', 'Cuci Per Kg', 8000, 'kg', 'Layanan cuci reguler per kilogram', 1, '${now}', 'cat-cuci'),
	('prod-cuci-setrika-per-kg', 'Cuci + Setrika Per Kg', 12000, 'kg', 'Cuci dan setrika per kilogram', 1, '${now}', 'cat-cuci'),
	('prod-express-per-kg', 'Express Per Kg', 18000, 'kg', 'Cuci kilat 4 jam per kilogram', 1, '${now}', 'cat-cuci'),
	('prod-setrika-per-kg', 'Setrika Per Kg', 5000, 'kg', 'Layanan setrika saja per kilogram', 1, '${now}', 'cat-setrika'),
	('prod-dryclean-jas', 'Dry Clean Jas', 35000, 'pcs', 'Dry clean jas', 1, '${now}', 'cat-dryclean'),
	('prod-dryclean-gaun', 'Dry Clean Gaun', 50000, 'pcs', 'Dry clean gaun', 1, '${now}', 'cat-dryclean'),
	('prod-antar-jemput', 'Antar Jemput', 10000, 'order', 'Layanan antar jemput pakaian', 1, '${now}', 'cat-tambahan'),
	('prod-plastik-premium', 'Plastik Packing Premium', 1000, 'pcs', 'Packing rapi dengan plastik premium', 1, '${now}', 'cat-tambahan'),
	('prod-parfum-fresh', 'Parfum Fresh', 2000, 'pcs', 'Tambahan pewangi fresh', 1, '${now}', 'cat-parfum'),
	('prod-parfum-floral', 'Parfum Floral', 2000, 'pcs', 'Tambahan pewangi floral', 1, '${now}', 'cat-parfum')
`);

// FAQs
await db.execute(`INSERT OR IGNORE INTO faqs (faq_id, faq_question, faq_answer, faq_created_at) VALUES
	('faq-1', 'Berapa lama waktu cuci reguler?', 'Waktu cuci reguler adalah 2-3 hari kerja tergantung jenis pakaian.', '${now}'),
	('faq-2', 'Apakah ada layanan antar jemput?', 'Ya, kami menyediakan layanan antar jemput dengan biaya tambahan.', '${now}'),
	('faq-3', 'Bagaimana cara menghitung berat?', 'Berat dihitung per kilogram saat pakaian diterima di outlet.', '${now}'),
	('faq-4', 'Apakah bisa ekspres?', 'Ya, layanan express 4 jam tersedia dengan harga lebih tinggi.', '${now}')
`);

// Templates
await db.execute(`INSERT OR IGNORE INTO templates (template_id, template_name, template_description, template_created_at) VALUES
	('tpl-struk', 'Struk Pembayaran', 'Template struk default untuk cetak bukti pembayaran', '${now}'),
	('tpl-wa-konfirmasi', 'WA Konfirmasi Order', 'Template pesan WhatsApp konfirmasi order baru', '${now}'),
	('tpl-wa-selesai', 'WA Order Selesai', 'Template pesan WhatsApp pemberitahuan order selesai', '${now}')
`);

// Promotions
await db.execute(`INSERT OR IGNORE INTO promotions (promo_id, promo_name, promo_type, promo_value, promo_min_order, promo_code, promo_start_date, promo_end_date) VALUES
	('promo-diskon10', 'Diskon 10%', 'percent', 10, 50000, 'HEMAT10', '2026-01-01', '2026-12-31'),
	('promo-diskon15rb', 'Potongan Rp15rb', 'nominal', 15000, 100000, null, '2026-01-01', '2026-12-31'),
	('promo-newcust', 'Diskon Pelanggan Baru', 'percent', 15, null, 'BARU15', '2026-01-01', '2026-12-31'),
	('promo-weekend', 'Weekend Hemat', 'percent', 10, 75000, 'WEEKEND', '2026-01-01', '2026-12-31')
`);

// Machines
await db.execute(`INSERT OR IGNORE INTO machines (machine_id, machine_name, machine_type, machine_status, machine_last_service, machine_next_service) VALUES
	('mesin-cuci-1', 'Mesin Cuci 1', 'Mesin Cuci', 'active', '2026-06-01', '2026-09-01'),
	('mesin-cuci-2', 'Mesin Cuci 2', 'Mesin Cuci', 'active', '2026-05-15', '2026-08-15'),
	('mesin-cuci-3', 'Mesin Cuci 3', 'Mesin Cuci', 'maintenance', '2026-07-01', '2026-07-20'),
	('mesin-pengering-1', 'Pengering 1', 'Pengering', 'active', '2026-06-15', '2026-09-15'),
	('mesin-pengering-2', 'Pengering 2', 'Pengering', 'broken', '2026-04-01', '2026-07-01'),
	('mesin-setrika-1', 'Setrika Uap 1', 'Setrika Uap', 'active', '2026-07-01', '2026-10-01'),
	('mesin-setrika-2', 'Setrika Uap 2', 'Setrika Uap', 'active', '2026-06-20', '2026-09-20')
`);

// Inventory
await db.execute(`INSERT OR IGNORE INTO inventory (inventory_id, inventory_name, inventory_quantity, inventory_unit, inventory_min_stock, inventory_last_restocked) VALUES
	('inv-deterjen', 'Deterjen Bubuk', 15, 'kg', 5, '2026-07-10'),
	('inv-softener', 'Softener/Pelembut', 8, 'liter', 3, '2026-07-10'),
	('inv-pewangi', 'Pewangi Laundry', 12, 'liter', 5, '2026-07-12'),
	('inv-stain-remover', 'Stain Remover', 3, 'liter', 2, '2026-07-05'),
	('inv-plastik', 'Plastik Packing', 500, 'pcs', 100, '2026-07-08'),
	('inv-hanger', 'Hanger', 200, 'pcs', 50, '2026-06-20'),
	('inv-setrika-spray', 'Spray Setrika', 4, 'liter', 2, '2026-07-15'),
	('inv-kaporit', 'Kaporit', 2, 'kg', 5, '2026-07-01')
`);

// Verify
const dump = async (table, cols, label) => {
	const r = await db.execute(`SELECT ${cols} FROM ${table}`);
	console.log(`\n${label} (${r.rows.length}):`);
	r.rows.forEach((row) => console.log('  ' + cols.split(',').map((c) => row[c.trim()]).join(' | ')));
};

await dump('users', 'user_role, user_name, user_email', 'Users');
await dump('customers', 'customer_name, customer_phone', 'Customers');
await dump('app_settings', 'setting_key, setting_value', 'App Settings');
await dump('categories', 'category_id, category_name', 'Categories');
await dump('products', 'product_name, product_price, product_unit, category_id', 'Products');
await dump('faqs', 'faq_question', 'FAQs');
await dump('templates', 'template_name, template_description', 'Templates');
await dump('promotions', 'promo_name, promo_type, promo_value, promo_code', 'Promotions');
await dump('machines', 'machine_name, machine_type, machine_status', 'Machines');
await dump('inventory', 'inventory_name, inventory_quantity, inventory_unit, inventory_min_stock', 'Inventory');
