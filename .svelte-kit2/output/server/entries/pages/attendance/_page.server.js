import { t as db } from "../../../chunks/db2.js";
import { t as getSettings } from "../../../chunks/settings2.js";
//#region src/routes/attendance/+page.server.js
async function load({ locals }) {
	const userId = locals.user.id;
	const todayRecords = await db.execute({
		sql: `SELECT * FROM attendance 
			WHERE user_id = ? AND DATE(created_at) = DATE('now') 
			ORDER BY created_at ASC`,
		args: [userId]
	});
	const storeLocation = await getSettings();
	const masukRecord = todayRecords.rows.find((r) => r.type === "masuk");
	const keluarRecord = todayRecords.rows.find((r) => r.type === "keluar");
	let attendanceStatus = "none";
	if (masukRecord && keluarRecord) attendanceStatus = "complete";
	else if (masukRecord) attendanceStatus = "need_keluar";
	else attendanceStatus = "need_masuk";
	return {
		attendanceStatus,
		todayRecords: todayRecords.rows,
		storeLocation: {
			latitude: storeLocation.store_lat,
			longitude: storeLocation.store_lng,
			name: storeLocation.store_location_name
		},
		userRole: locals.user.role
	};
}
//#endregion
export { load };
