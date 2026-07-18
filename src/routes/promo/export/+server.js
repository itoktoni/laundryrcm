import { db } from '$lib/server/db.js';
import { toCsv, csvResponse } from '$lib/server/csv.js';

const COLUMNS = ['promo_name', 'promo_type', 'promo_value', 'promo_min_order', 'promo_code', 'promo_start_date', 'promo_end_date', 'promo_is_active'];

export async function GET() {
	const result = await db.execute('SELECT * FROM promotions ORDER BY promo_created_at DESC');
	return csvResponse('promo.csv', toCsv(COLUMNS, result.rows));
}
