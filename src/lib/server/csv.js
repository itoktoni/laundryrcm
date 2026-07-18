function escapeCell(v) {
	const s = v === null || v === undefined ? '' : String(v);
	return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function toCsv(columns, rows) {
	const header = columns.join(',');
	const body = rows.map((r) => columns.map((c) => escapeCell(r[c])).join(',')).join('\n');
	return `${header}\n${body}`;
}

export function csvResponse(filename, csv) {
	return new Response('\uFEFF' + csv, {
		headers: {
			'Content-Type': 'text/csv; charset=utf-8',
			'Content-Disposition': `attachment; filename="${filename}"`
		}
	});
}
