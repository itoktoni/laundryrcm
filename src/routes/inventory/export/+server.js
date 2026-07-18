import { db } from '$lib/server/db.js';
import { toCsv, csvResponse } from '$lib/server/csv.js';

const COLUMNS = ['inventory_name', 'inventory_quantity', 'inventory_unit', 'inventory_min_stock', 'inventory_last_restocked'];

export async function GET() {
	const result = await db.execute('SELECT * FROM inventory ORDER BY inventory_name');
	return csvResponse('inventory.csv', toCsv(COLUMNS, result.rows));
}
