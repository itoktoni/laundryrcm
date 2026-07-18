import { db } from '$lib/server/db.js';
import { fail } from '@sveltejs/kit';

export async function load() {
	const templates = await db.execute('SELECT * FROM templates ORDER BY template_created_at DESC');
	return { templates: templates.rows };
}

export const actions = {
	add: async ({ request }) => {
		const formData = await request.formData();
		const name = formData.get('name')?.toString().trim();
		const description = formData.get('description')?.toString() ?? '';

		if (!name) return fail(400, { error: 'Nama template wajib diisi' });

		await db.execute({
			sql: 'INSERT INTO templates (template_id, template_name, template_description) VALUES (?, ?, ?)',
			args: [crypto.randomUUID(), name, description]
		});
		return { success: true };
	},

	edit: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id')?.toString();
		const name = formData.get('name')?.toString().trim();
		const description = formData.get('description')?.toString() ?? '';

		if (!id || !name) return fail(400, { error: 'Data tidak valid' });

		await db.execute({
			sql: 'UPDATE templates SET template_name = ?, template_description = ? WHERE template_id = ?',
			args: [name, description, id]
		});
		return { success: true };
	},

	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id')?.toString();
		if (!id) return fail(400, { error: 'ID tidak valid' });

		await db.execute({ sql: 'DELETE FROM templates WHERE template_id = ?', args: [id] });
		return { success: true };
	}
};
