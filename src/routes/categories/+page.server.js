import { db } from '$lib/server/db.js';
import { generateId } from '$lib/server/auth.js';
import { fail } from '@sveltejs/kit';

export async function load() {
	const categories = await db.execute({
		sql: `
			SELECT c.*, COUNT(p.product_id) as product_count
			FROM categories c
			LEFT JOIN products p ON p.category_id = c.category_id
			GROUP BY c.category_id
			ORDER BY c.category_name ASC
		`,
		args: []
	});

	return {
		categories: categories.rows
	};
}

export const actions = {
	add: async ({ request }) => {
		const formData = await request.formData();
		const name = formData.get('name')?.toString().trim();

		if (!name) {
			return fail(400, { error: 'Nama kategori wajib diisi' });
		}

		// Check duplicate
		const existing = await db.execute({
			sql: 'SELECT category_id FROM categories WHERE category_name = ?',
			args: [name]
		});

		if (existing.rows.length > 0) {
			return fail(400, { error: 'Nama kategori sudah ada' });
		}

		await db.execute({
			sql: 'INSERT INTO categories (category_id, category_name) VALUES (?, ?)',
			args: [generateId(), name]
		});

		return { success: true };
	},

	edit: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id')?.toString();
		const name = formData.get('name')?.toString().trim();

		if (!id || !name) {
			return fail(400, { error: 'Data tidak valid' });
		}

		// Check duplicate (excluding current)
		const existing = await db.execute({
			sql: 'SELECT category_id FROM categories WHERE category_name = ? AND category_id != ?',
			args: [name, id]
		});

		if (existing.rows.length > 0) {
			return fail(400, { error: 'Nama kategori sudah ada' });
		}

		await db.execute({
			sql: 'UPDATE categories SET category_name = ? WHERE category_id = ?',
			args: [name, id]
		});

		return { success: true };
	},

	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id')?.toString();

		if (!id) {
			return fail(400, { error: 'ID tidak valid' });
		}

		// Check if category has products
		const products = await db.execute({
			sql: 'SELECT COUNT(*) as count FROM products WHERE category_id = ?',
			args: [id]
		});

		if (products.rows[0]?.count > 0) {
			return fail(400, { error: 'Kategori tidak bisa dihapus karena masih ada produk' });
		}

		await db.execute({
			sql: 'DELETE FROM categories WHERE category_id = ?',
			args: [id]
		});

		return { success: true };
	}
};
