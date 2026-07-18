import { db } from '$lib/server/db.js';
import { fail } from '@sveltejs/kit';

export async function load() {
	const rows = await db.execute('SELECT * FROM app_settings ORDER BY setting_key ASC');
	return { settings: rows.rows };
}

export const actions = {
	save: async ({ request }) => {
		const formData = await request.formData();
		const entries = [];
		for (const [key, value] of formData.entries()) {
			if (key.startsWith('setting__')) {
				entries.push([key.slice('setting__'.length), value.toString()]);
			}
		}

		for (const [k, v] of entries) {
			await db.execute({
				sql: `INSERT INTO app_settings (setting_key, setting_value, setting_updated_at)
					VALUES (?, ?, datetime('now'))
					ON CONFLICT(setting_key) DO UPDATE SET setting_value = excluded.setting_value, setting_updated_at = datetime('now')`,
				args: [k, v]
			});
		}

		return { success: true };
	},

	add: async ({ request }) => {
		const formData = await request.formData();
		const key = formData.get('key')?.toString().trim().toLowerCase().replace(/\s+/g, '_');
		const value = formData.get('value')?.toString() ?? '';

		if (!key) return fail(400, { error: 'Key wajib diisi' });

		await db.execute({
			sql: `INSERT INTO app_settings (setting_key, setting_value) VALUES (?, ?)
				ON CONFLICT(setting_key) DO UPDATE SET setting_value = excluded.setting_value`,
			args: [key, value]
		});
		return { success: true };
	},

	delete: async ({ request }) => {
		const formData = await request.formData();
		const key = formData.get('key')?.toString();
		if (!key) return fail(400, { error: 'Key tidak valid' });

		await db.execute({ sql: 'DELETE FROM app_settings WHERE setting_key = ?', args: [key] });
		return { success: true };
	}
};
