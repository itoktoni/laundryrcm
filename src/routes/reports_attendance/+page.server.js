import { db } from '$lib/server/db.js';

export async function load({ url }) {
	const period = url.searchParams.get('period') || 'month';
	const start = url.searchParams.get('start') || '';
	const end = url.searchParams.get('end') || '';
	const userId = url.searchParams.get('user_id');

	let clause = '';
	let args = [];

	if (period === 'custom' && start && end) {
		clause = 'AND DATE(a.created_at) BETWEEN DATE(?) AND DATE(?)';
		args = [start, end];
	} else if (period === 'today') {
		clause = "AND DATE(a.created_at) = DATE('now')";
	} else if (period === 'week') {
		clause = "AND DATE(a.created_at) >= DATE('now', 'weekday 0', '-7 days')";
	} else if (period === 'month') {
		clause = "AND strftime('%Y-%m', a.created_at) = strftime('%Y-%m', 'now')";
	}

	if (userId) {
		clause += ' AND a.user_id = ?';
		args.push(userId);
	}

	const [records, summary, byUser, users] = await Promise.all([
		db.execute({
			sql: `SELECT a.attendance_id, a.user_id, u.user_name, a.type,
					a.latitude, a.longitude, a.location_name, a.distance_meters,
					a.status, a.created_at
				FROM attendance a
				JOIN users u ON a.user_id = u.user_id
				WHERE 1=1 ${clause}
				ORDER BY a.created_at DESC`,
			args
		}),
		db.execute({
			sql: `SELECT
					COUNT(*) as total,
					COUNT(CASE WHEN type = 'masuk' THEN 1 END) as total_masuk,
					COUNT(CASE WHEN type = 'keluar' THEN 1 END) as total_keluar,
					COUNT(CASE WHEN status = 'success' THEN 1 END) as total_success,
					COUNT(CASE WHEN status = 'failed' THEN 1 END) as total_failed
				FROM attendance a WHERE 1=1 ${clause}`,
			args
		}),
		db.execute({
			sql: `SELECT u.user_name,
					COUNT(*) as total,
					COUNT(CASE WHEN a.type = 'masuk' THEN 1 END) as masuk,
					COUNT(CASE WHEN a.type = 'keluar' THEN 1 END) as keluar,
					COUNT(CASE WHEN a.status = 'success' THEN 1 END) as success,
					COUNT(CASE WHEN a.status = 'failed' THEN 1 END) as failed
				FROM attendance a
				JOIN users u ON a.user_id = u.user_id
				WHERE 1=1 ${clause}
				GROUP BY a.user_id
				ORDER BY u.user_name ASC`,
			args
		}),
		db.execute({
			sql: `SELECT DISTINCT u.user_id, u.user_name FROM attendance a JOIN users u ON a.user_id = u.user_id ORDER BY u.user_name`,
			args: []
		})
	]);

	return {
		records: records.rows,
		summary: summary.rows[0],
		byUser: byUser.rows,
		users: users.rows,
		filters: { period, start, end, userId }
	};
}
