-- LaundryKu Database Schema

CREATE TABLE IF NOT EXISTS sessions (
	session_id TEXT PRIMARY KEY,
	user_id TEXT NOT NULL REFERENCES users(user_id),
	expires_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
	user_id TEXT PRIMARY KEY,
	user_name TEXT NOT NULL,
	user_email TEXT NOT NULL UNIQUE,
	user_password TEXT NOT NULL,
	user_role TEXT NOT NULL CHECK(user_role IN ('owner', 'admin', 'staff')),
	user_created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS customers (
	customer_id TEXT PRIMARY KEY,
	customer_name TEXT NOT NULL,
	customer_phone TEXT NOT NULL,
	customer_address TEXT,
	customer_vip INTEGER NOT NULL DEFAULT 0,
	customer_total_orders INTEGER NOT NULL DEFAULT 0,
	customer_created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS categories (
	category_id TEXT PRIMARY KEY,
	category_name TEXT NOT NULL UNIQUE,
	category_created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS products (
	product_id TEXT PRIMARY KEY,
	product_name TEXT NOT NULL,
	product_price REAL NOT NULL,
	product_unit TEXT NOT NULL DEFAULT 'kg',
	product_description TEXT,
	product_is_active INTEGER NOT NULL DEFAULT 1,
	category_id TEXT REFERENCES categories(category_id),
	product_created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS promotions (
	promo_id TEXT PRIMARY KEY,
	promo_name TEXT NOT NULL,
	promo_type TEXT NOT NULL CHECK(promo_type IN ('percent', 'nominal', 'package')),
	promo_value REAL NOT NULL,
	promo_min_order REAL,
	promo_code TEXT UNIQUE,
	promo_start_date TEXT NOT NULL,
	promo_end_date TEXT NOT NULL,
	promo_is_active INTEGER NOT NULL DEFAULT 1,
	promo_created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS orders (
	order_id TEXT PRIMARY KEY,
	customer_id TEXT NOT NULL REFERENCES customers(customer_id),
	promo_id TEXT REFERENCES promotions(promo_id),
	order_subtotal REAL NOT NULL,
	order_discount_amount REAL NOT NULL DEFAULT 0,
	order_total_price REAL NOT NULL,
	order_unique_code TEXT,
	order_payment_code TEXT,
	order_paid_amount REAL,
	order_status TEXT NOT NULL DEFAULT 'pending' CHECK(order_status IN ('pending', 'cuci', 'kering', 'setrika', 'selesai', 'diambil')),
	order_payment_status TEXT NOT NULL DEFAULT 'unpaid' CHECK(order_payment_status IN ('unpaid', 'paid')),
	order_notes TEXT,
	order_created_by TEXT NOT NULL REFERENCES users(user_id),
	order_created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS order_items (
	item_id TEXT PRIMARY KEY,
	order_id TEXT NOT NULL REFERENCES orders(order_id),
	product_id TEXT NOT NULL REFERENCES products(product_id),
	item_quantity REAL NOT NULL,
	item_price REAL NOT NULL,
	item_subtotal REAL NOT NULL,
	item_created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS transactions (
	transaction_id TEXT PRIMARY KEY,
	order_id TEXT REFERENCES orders(order_id),
	transaction_type TEXT NOT NULL CHECK(transaction_type IN ('income', 'expense')),
	transaction_amount REAL NOT NULL,
	transaction_category TEXT NOT NULL,
	transaction_description TEXT,
	transaction_date TEXT NOT NULL,
	transaction_created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS inventory (
	inventory_id TEXT PRIMARY KEY,
	inventory_name TEXT NOT NULL,
	inventory_quantity REAL NOT NULL,
	inventory_unit TEXT NOT NULL,
	inventory_min_stock REAL NOT NULL,
	inventory_last_restocked TEXT,
	inventory_avg_cost REAL NOT NULL DEFAULT 0,
	inventory_created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS templates (
	template_id TEXT PRIMARY KEY,
	template_name TEXT NOT NULL,
	template_description TEXT,
	template_created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS faqs (
	faq_id TEXT PRIMARY KEY,
	faq_question TEXT NOT NULL,
	faq_answer TEXT,
	faq_created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS app_settings (
	setting_key TEXT PRIMARY KEY,
	setting_value TEXT,
	setting_updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS machines (
	machine_id TEXT PRIMARY KEY,
	machine_name TEXT NOT NULL,
	machine_type TEXT NOT NULL,
	machine_status TEXT NOT NULL DEFAULT 'active' CHECK(machine_status IN ('active', 'broken', 'maintenance')),
	machine_last_service TEXT,
	machine_next_service TEXT,
	machine_created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS machine_services (
	service_id TEXT PRIMARY KEY,
	machine_id TEXT NOT NULL REFERENCES machines(machine_id),
	service_date TEXT NOT NULL,
	service_description TEXT NOT NULL,
	service_cost REAL NOT NULL DEFAULT 0,
	service_notes TEXT,
	service_created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Seed data: default categories
INSERT OR IGNORE INTO categories (category_id, category_name) VALUES
	('cat-kiloan', 'Kiloan'),
	('cat-satuan', 'Satuan'),
	('cat-tambahan', 'Layanan Tambahan');

-- Seed data: default products
INSERT OR IGNORE INTO products (product_id, product_name, product_price, product_unit, product_description, category_id) VALUES
	('prod-cuci-lipat', 'Cuci Lipat', 7000, 'kg', 'Cuci, kering, lipat', 'cat-kiloan'),
	('prod-cuci-setrika', 'Cuci Setrika', 10000, 'kg', 'Cuci, kering, setrika', 'cat-kiloan'),
	('prod-express', 'Express', 15000, 'kg', 'Cuci kilat 4 jam', 'cat-kiloan'),
	('prod-boneka', 'Boneka', 15000, 'pcs', 'Cuci boneka per pcs', 'cat-satuan'),
	('prod-sprei', 'Sprei', 12000, 'kg', 'Cuci sprei/bedcover', 'cat-kiloan'),
	('prod-selimut', 'Selimut', 12000, 'kg', 'Cuci selimut', 'cat-kiloan'),
	('prod-karpet', 'Karpet', 15000, 'kg', 'Cuci karpet', 'cat-kiloan'),
	('prod-jas', 'Jas/Blazer', 25000, 'pcs', 'Cuci jas/blazer per pcs', 'cat-satuan'),
	('prod-dryclean', 'Dry Clean', 30000, 'kg', 'Cuci kering khusus', 'cat-kiloan');

CREATE TABLE IF NOT EXISTS stock_movements (
	movement_id TEXT PRIMARY KEY,
	inventory_id TEXT NOT NULL REFERENCES inventory(inventory_id),
	movement_type TEXT NOT NULL CHECK(movement_type IN ('in', 'out')),
	movement_date TEXT NOT NULL,
	movement_description TEXT,
	movement_qty REAL NOT NULL,
	movement_cost REAL NOT NULL DEFAULT 0,
	movement_avg_cost REAL NOT NULL DEFAULT 0,
	movement_created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS whatsapp_schedules (
	schedule_id TEXT PRIMARY KEY,
	schedule_type TEXT NOT NULL CHECK(schedule_type IN ('pending_pickup', 'inactive_customer', 'low_stock', 'machine_service', 'ready_delivery')),
	schedule_name TEXT NOT NULL,
	schedule_description TEXT,
	schedule_enabled INTEGER NOT NULL DEFAULT 1,
	schedule_cron_expression TEXT,
	schedule_days_threshold INTEGER,
	schedule_template TEXT,
	schedule_last_run TEXT,
	schedule_last_success TEXT,
	schedule_last_error TEXT,
	schedule_created_at TEXT NOT NULL DEFAULT (datetime('now')),
	schedule_updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS whatsapp_schedule_logs (
	log_id TEXT PRIMARY KEY,
	schedule_id TEXT NOT NULL REFERENCES whatsapp_schedules(schedule_id),
	log_status TEXT NOT NULL CHECK(log_status IN ('success', 'failed', 'partial')),
	log_message_count INTEGER NOT NULL DEFAULT 0,
	log_error TEXT,
	log_created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS whatsapp_pending_messages (
	pending_id TEXT PRIMARY KEY,
	schedule_id TEXT NOT NULL REFERENCES whatsapp_schedules(schedule_id),
	schedule_type TEXT NOT NULL,
	phone TEXT NOT NULL,
	message TEXT NOT NULL,
	ref_type TEXT,
	ref_id TEXT,
	status TEXT NOT NULL DEFAULT 'queued' CHECK(status IN ('queued', 'sent', 'failed')),
	sent_at TEXT,
	error TEXT,
	created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
