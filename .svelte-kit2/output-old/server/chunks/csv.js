//#region src/lib/server/csv.js
function escapeCell(v) {
	const s = v === null || v === void 0 ? "" : String(v);
	return /[",\n]/.test(s) ? `"${s.replace(/"/g, "\"\"")}"` : s;
}
function toCsv(columns, rows) {
	return `${columns.join(",")}\n${rows.map((r) => columns.map((c) => escapeCell(r[c])).join(",")).join("\n")}`;
}
function csvResponse(filename, csv) {
	return new Response("﻿" + csv, { headers: {
		"Content-Type": "text/csv; charset=utf-8",
		"Content-Disposition": `attachment; filename="${filename}"`
	} });
}
//#endregion
export { toCsv as n, csvResponse as t };
