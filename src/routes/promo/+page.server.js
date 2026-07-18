import { db } from '$lib/server/db.js';

export async function load() {
	const promotions = await db.execute('SELECT * FROM promotions ORDER BY promo_created_at DESC');
	return { promotions: promotions.rows };
}

export const actions = {
	add: async ({ request }) => {
		const formData = await request.formData();
		const name = formData.get('name')?.toString().trim();
		const type = formData.get('type')?.toString();
		const value = parseFloat(formData.get('value'));
		const minOrder = parseFloat(formData.get('min_order')) || null;
		const code = formData.get('code')?.toString().trim() || null;
		const startDate = formData.get('start_date')?.toString();
		const endDate = formData.get('end_date')?.toString();

		if (!name || !type || isNaN(value) || !startDate || !endDate) {
			return { error: 'Semua field wajib diisi' };
		}

		await db.execute({
			sql: `INSERT INTO promotions (promo_id, promo_name, promo_type, promo_value, promo_min_order, promo_code, promo_start_date, promo_end_date) 
				VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
			args: [crypto.randomUUID(), name, type, value, minOrder, code, startDate, endDate]
		});

		return { success: true };
	},

	toggle: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id')?.toString();

		await db.execute({
			sql: 'UPDATE promotions SET promo_is_active = CASE WHEN promo_is_active = 1 THEN 0 ELSE 1 END WHERE promo_id = ?',
			args: [id]
		});

		return { success: true };
	},

	edit: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id')?.toString();
		const name = formData.get('name')?.toString().trim();
		const type = formData.get('type')?.toString();
		const value = parseFloat(formData.get('value'));
		const minOrder = parseFloat(formData.get('min_order')) || null;
		const code = formData.get('code')?.toString().trim() || null;
		const startDate = formData.get('start_date')?.toString();
		const endDate = formData.get('end_date')?.toString();

		if (!id || !name || !type || isNaN(value) || !startDate || !endDate) {
			return { error: 'Semua field wajib diisi' };
		}

		await db.execute({
			sql: `UPDATE promotions SET promo_name = ?, promo_type = ?, promo_value = ?, promo_min_order = ?, promo_code = ?, promo_start_date = ?, promo_end_date = ? WHERE promo_id = ?`,
			args: [name, type, value, minOrder, code, startDate, endDate, id]
		});

		return { success: true };
	},

	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id')?.toString();

		if (!id) {
			return { error: 'ID tidak valid' };
		}

		await db.execute({ sql: 'DELETE FROM promotions WHERE promo_id = ?', args: [id] });
		return { success: true };
	}
};
