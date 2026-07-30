import { t as db } from "../../../../chunks/db2.js";
import { n as toCsv, t as csvResponse } from "../../../../chunks/csv.js";
//#region src/routes/promo/export/+server.js
var COLUMNS = [
	"promo_name",
	"promo_type",
	"promo_value",
	"promo_min_order",
	"promo_code",
	"promo_start_date",
	"promo_end_date",
	"promo_is_active"
];
async function GET() {
	return csvResponse("promo.csv", toCsv(COLUMNS, (await db.execute("SELECT * FROM promotions ORDER BY promo_created_at DESC")).rows));
}
//#endregion
export { GET };
