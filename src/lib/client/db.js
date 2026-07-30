/**
 * Client-side Turso HTTP API client for Capacitor SPA.
 * Uses the Turso REST API directly via fetch.
 */

const DB_URL = 'libsql://laundry-app-itoktoni.aws-ap-northeast-1.turso.io';
const AUTH_TOKEN = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3ODQ0NDQ5MTUsImlkIjoiMDE5Zjc0NDEtZjgwMS03N2Q4LThiNTUtODQwZGQyNWIzYTk2Iiwia2lkIjoiOE1yUThLTHVYbV9ZenE0emIyM1B6cU5yeDJVSzBrOWUxUjl1NjlnQmVUYyIsInJpZCI6IjY2YWVjMjkyLTE3OTgtNGZlNC1iZmNjLTllNjhiYjc4MTZiNiJ9.mib6Yfi0HyV_KN-3xsxckjj7a_8-CxYbesjkCC9yYiqjD-pCISSjsFJx6hBV0BkUJNV_lV3dXsmMkJrNvv88DQ';

// Convert libsql:// to https:// for HTTP API
const HTTP_URL = DB_URL.replace('libsql://', 'https://');

/**
 * Execute a SQL query via Turso HTTP API
 * @param {string} sql - SQL query
 * @param {Array} args - Query parameters
 * @returns {Promise<{rows: Array, columns: Array}>}
 */
export async function dbExecute(sql, args = []) {
	const response = await fetch(`${HTTP_URL}/v2/pipeline`, {
		method: 'POST',
		headers: {
			'Authorization': `Bearer ${AUTH_TOKEN}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			requests: [
				{
					type: 'execute',
					stmt: {
						sql,
						args: args.map((a) => {
							if (a === null || a === undefined) return { type: 'null' };
							if (typeof a === 'number') return { type: 'integer', value: String(a) };
							return { type: 'text', value: String(a) };
						})
					}
				},
				{ type: 'close' }
			]
		})
	});

	if (!response.ok) {
		throw new Error(`Turso HTTP API error: ${response.status} ${response.statusText}`);
	}

	const data = await response.json();
	const result = data.results?.[0];

	if (result?.type === 'error') {
		throw new Error(result.error?.message || 'Database query failed');
	}

	const resultSet = result?.result;
	if (!resultSet) return { rows: [], columns: [] };

	// Convert Turso row format to objects
	const cols = resultSet.cols.map((c) => c.name);
	const rows = (resultSet.rows || []).map((row) => {
		const obj = {};
		row.forEach((val, i) => {
			obj[cols[i]] = val.value !== undefined ? val.value : val;
		});
		return obj;
	});

	return { rows, columns: cols };
}
