import { createClient } from '@libsql/client';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = join(__dirname, '.env');

const TURSO_URL = 'libsql://laundry-app-itoktoni.aws-ap-northeast-1.turso.io';

const envContent = readFileSync(envPath, 'utf8');
const tokenMatch = envContent.match(/TURSO_AUTH_TOKEN=(.+)/);
const TURSO_AUTH_TOKEN = tokenMatch ? tokenMatch[1].trim() : null;

if (!TURSO_AUTH_TOKEN) {
	console.error('TURSO_AUTH_TOKEN not found in .env');
	process.exit(1);
}

const db = createClient({
	url: TURSO_URL,
	authToken: TURSO_AUTH_TOKEN
});

async function migrate() {
	try {
		console.log('[migrate-v14] Adding inventory_avg_cost to inventory table...');
		
		// Check if column already exists
		const info = await db.execute("PRAGMA table_info(inventory)");
		const hasCol = info.rows.some(r => r.name === 'inventory_avg_cost');
		
		if (!hasCol) {
			await db.execute('ALTER TABLE inventory ADD COLUMN inventory_avg_cost REAL DEFAULT 0');
			console.log('[migrate-v14] inventory_avg_cost column added.');
		} else {
			console.log('[migrate-v14] inventory_avg_cost already exists, skipping.');
		}

		console.log('[migrate-v14] Done.');
	} catch (err) {
		console.error('[migrate-v14] Error:', err.message);
		process.exit(1);
	}
}

migrate();