import { db } from '$lib/server/db.js';
import { toCsv, csvResponse } from '$lib/server/csv.js';

const COLUMNS = ['machine_name', 'machine_type', 'machine_status', 'machine_last_service', 'machine_next_service'];

export async function GET() {
	const result = await db.execute('SELECT * FROM machines ORDER BY machine_name');
	return csvResponse('mesin.csv', toCsv(COLUMNS, result.rows));
}
