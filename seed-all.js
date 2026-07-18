import { createClient } from '@libsql/client';
import { webcrypto } from 'node:crypto';

function hashPassword(password) {
	const data = new TextEncoder().encode(password);
	return webcrypto.subtle.digest('SHA-256', data).then((b) => {
		const h = Array.from(new Uint8Array(b));
		return h.map((x) => x.toString(16).padStart(2, '0')).join('');
	});
}

const db = createClient({ url: 'file:local.db' });

// Seed default walk-in customer
await db.execute(`INSERT OR IGNORE INTO customers (customer_id, customer_name, customer_phone, customer_address, customer_vip, customer_total_orders) VALUES
	('cust-walk-in', 'Walk Customer', '-', null, 0, 0)
`);

// Seed users (admin, staff)
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

// Seed promotions
await db.execute(`INSERT OR IGNORE INTO promotions (promo_id, promo_name, promo_type, promo_value, promo_min_order, promo_code, promo_start_date, promo_end_date) VALUES
	('promo-diskon10', 'Diskon 10%', 'percent', 10, 50000, 'HEMAT10', '2026-01-01', '2026-12-31'),
	('promo-diskon15rb', 'Potongan Rp15rb', 'nominal', 15000, 100000, null, '2026-01-01', '2026-12-31'),
	('promo-newcust', 'Diskon Pelanggan Baru', 'percent', 15, null, 'BARU15', '2026-01-01', '2026-12-31'),
	('promo-weekend', 'Weekend Hemat', 'percent', 10, 75000, 'WEEKEND', '2026-01-01', '2026-12-31')
`);

// Seed machines
await db.execute(`INSERT OR IGNORE INTO machines (machine_id, machine_name, machine_type, machine_status, machine_last_service, machine_next_service) VALUES
	('mesin-cuci-1', 'Mesin Cuci 1', 'Mesin Cuci', 'active', '2026-06-01', '2026-09-01'),
	('mesin-cuci-2', 'Mesin Cuci 2', 'Mesin Cuci', 'active', '2026-05-15', '2026-08-15'),
	('mesin-cuci-3', 'Mesin Cuci 3', 'Mesin Cuci', 'maintenance', '2026-07-01', '2026-07-20'),
	('mesin-pengering-1', 'Pengering 1', 'Pengering', 'active', '2026-06-15', '2026-09-15'),
	('mesin-pengering-2', 'Pengering 2', 'Pengering', 'broken', '2026-04-01', '2026-07-01'),
	('mesin-setrika-1', 'Setrika Uap 1', 'Setrika Uap', 'active', '2026-07-01', '2026-10-01'),
	('mesin-setrika-2', 'Setrika Uap 2', 'Setrika Uap', 'active', '2026-06-20', '2026-09-20')
`);

// Seed inventory
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
const us = await db.execute('SELECT user_name, user_email, user_role FROM users ORDER BY user_role');
console.log('Users:');
us.rows.forEach((u) => console.log(`  [${u.user_role}] ${u.user_name} <${u.user_email}>`));

const custs = await db.execute('SELECT customer_name, customer_phone FROM customers');
console.log('Customers:');
custs.rows.forEach(c => console.log(`  ${c.customer_name} (${c.customer_phone})`));

const promos = await db.execute('SELECT promo_name, promo_type, promo_value, promo_code FROM promotions');
console.log('Promotions:');
promos.rows.forEach(p => console.log(`  ${p.promo_name}: ${p.promo_type === 'percent' ? p.promo_value + '%' : 'Rp' + p.promo_value.toLocaleString()} ${p.promo_code ? '(' + p.promo_code + ')' : ''}`));

const machines = await db.execute('SELECT machine_name, machine_type, machine_status FROM machines');
console.log('\nMachines:');
machines.rows.forEach(m => console.log(`  ${m.machine_name} [${m.machine_type}]: ${m.machine_status}`));

const inv = await db.execute('SELECT inventory_name, inventory_quantity, inventory_unit, inventory_min_stock FROM inventory');
console.log('\nInventory:');
inv.rows.forEach(i => {
	const low = i.inventory_quantity < i.inventory_min_stock ? ' ⚠️ STOK RENDAH' : '';
	console.log(`  ${i.inventory_name}: ${i.inventory_quantity} ${i.inventory_unit} (min: ${i.inventory_min_stock})${low}`);
});
