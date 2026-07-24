import { db } from '$lib/server/db.js';
import { json } from '@sveltejs/kit';

export async function POST({ request, locals }) {
	if (!locals.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	if (locals.user.role === 'staff') {
		return json({ error: 'Tidak memiliki akses' }, { status: 403 });
	}

	const { latitude, longitude, name } = await request.json();

	if (latitude == null || longitude == null) {
		return json({ error: 'Koordinat tidak valid' }, { status: 400 });
	}

	const pairs = [
		['store_lat', String(latitude)],
		['store_lng', String(longitude)],
		['store_location_name', name || '']
	];

	for (const [k, v] of pairs) {
		await db.execute({
			sql: `INSERT INTO app_settings (setting_key, setting_value, setting_updated_at)
				VALUES (?, ?, datetime('now'))
				ON CONFLICT(setting_key) DO UPDATE SET setting_value = excluded.setting_value, setting_updated_at = datetime('now')`,
			args: [k, v]
		});
	}

	return json({ success: true });
}
