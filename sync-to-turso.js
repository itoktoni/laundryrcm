import { createClient } from '@libsql/client';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = join(__dirname, '.env');

const TURSO_URL = 'libsql://laundry-app-itoktoni.aws-ap-northeast-1.turso.io';

// Read token from .env
const envContent = readFileSync(envPath, 'utf8');
const tokenMatch = envContent.match(/TURSO_AUTH_TOKEN=(.+)/);
const TURSO_AUTH_TOKEN = tokenMatch ? tokenMatch[1].trim() : null;

if (!TURSO_AUTH_TOKEN) {
	console.error('TURSO_AUTH_TOKEN not found in .env');
	process.exit(1);
}

const localDbPath = join(__dirname, 'laundry-app.db');
const local = createClient({ url: 'file:' + localDbPath });
const remote = createClient({ url: TURSO_URL, authToken: TURSO_AUTH_TOKEN });

// Tables in dependency order (foreign keys respected)
const TABLES = [
	'users',
	'sessions',
	'customers',
	'categories',
	'products',
	'promotions',
	'orders',
	'order_items',
	'transactions',
	'inventory',
	'templates',
	'faqs',
	'app_settings',
	'machines',
	'whatsapp_schedules',
	'whatsapp_schedule_logs'
];

console.log('=== Sync Local DB -> Turso ===\n');

// Disable foreign keys for clean sync
await remote.execute('PRAGMA foreign_keys = OFF');

// Step 1: Read actual schema from local DB and recreate on remote
console.log('1. Recreating tables on remote...');

// Drop all tables first (reverse order for FK safety)
for (const table of [...TABLES].reverse()) {
	try {
		await remote.execute(`DROP TABLE IF EXISTS ${table}`);
	} catch (e) {
		// ignore
	}
}

// Get actual CREATE TABLE statements from local DB
const localSchema = await local.execute("SELECT name, sql FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'");

for (const row of localSchema.rows) {
	if (!TABLES.includes(row.name)) continue;
	try {
		await remote.execute(row.sql);
		console.log('   Created: ' + row.name);
	} catch (e) {
		console.error('   Error creating ' + row.name + ': ' + e.message);
	}
}
console.log();

// Step 2: Sync data - detect columns dynamically from local DB
console.log('2. Syncing data...');
let totalRows = 0;

for (const table of TABLES) {
	try {
		// Get column names from local DB
		const pragma = await local.execute(`PRAGMA table_info(${table})`);
		const cols = pragma.rows.map(r => r.name);

		if (cols.length === 0) {
			console.log(`   ${table}: table not found (skipped)`);
			continue;
		}

		const colList = cols.join(', ');

		// Read all rows from local
		const localRows = await local.execute(`SELECT * FROM ${table}`);
		const rows = localRows.rows;

		if (rows.length === 0) {
			console.log(`   ${table}: 0 rows (skipped)`);
			continue;
		}

		// Batch insert (50 rows at a time)
		const BATCH_SIZE = 50;
		for (let i = 0; i < rows.length; i += BATCH_SIZE) {
			const batch = rows.slice(i, i + BATCH_SIZE);
			const placeholders = batch.map(() => `(${cols.map(() => '?').join(', ')})`).join(', ');
			const values = batch.flatMap(row => cols.map(c => row[c] ?? null));

			await remote.execute({
				sql: `INSERT OR REPLACE INTO ${table} (${colList}) VALUES ${placeholders}`,
				args: values
			});
		}

		console.log(`   ${table}: ${rows.length} rows synced`);
		totalRows += rows.length;
	} catch (e) {
		console.log(`   ${table}: table not found (skipped)`);
		continue;
	}
}

// Re-enable foreign keys
await remote.execute('PRAGMA foreign_keys = ON');

console.log(`\n=== Done! Total ${totalRows} rows synced to Turso ===`);
