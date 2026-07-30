import { t as db } from "../../../../chunks/db2.js";
import { n as toCsv, t as csvResponse } from "../../../../chunks/csv.js";
//#region src/routes/inventory/export/+server.js
var COLUMNS = [
	"inventory_name",
	"inventory_quantity",
	"inventory_unit",
	"inventory_min_stock",
	"inventory_last_restocked"
];
async function GET() {
	return csvResponse("inventory.csv", toCsv(COLUMNS, (await db.execute("SELECT * FROM inventory ORDER BY inventory_name")).rows));
}
//#endregion
export { GET };
