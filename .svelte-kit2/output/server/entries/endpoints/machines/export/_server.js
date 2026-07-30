import { t as db } from "../../../../chunks/db2.js";
import { n as toCsv, t as csvResponse } from "../../../../chunks/csv.js";
//#region src/routes/machines/export/+server.js
var COLUMNS = [
	"machine_name",
	"machine_type",
	"machine_status",
	"machine_last_service",
	"machine_next_service"
];
async function GET() {
	return csvResponse("mesin.csv", toCsv(COLUMNS, (await db.execute("SELECT * FROM machines ORDER BY machine_name")).rows));
}
//#endregion
export { GET };
