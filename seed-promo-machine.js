import { createClient } from '@libsql/client';

const db = createClient({ url: 'file:local.db' });

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

// Verify
const promos = await db.execute('SELECT promo_name, promo_type, promo_value, promo_code FROM promotions');
console.log('Promotions:');
promos.rows.forEach(p => console.log(`  ${p.promo_name}: ${p.promo_type === 'percent' ? p.promo_value + '%' : 'Rp' + p.promo_value.toLocaleString()} ${p.promo_code ? '(' + p.promo_code + ')' : ''}`));

const machines = await db.execute('SELECT machine_name, machine_type, machine_status FROM machines');
console.log('\nMachines:');
machines.rows.forEach(m => console.log(`  ${m.machine_name} [${m.machine_type}]: ${m.machine_status}`));
