import { db } from '$lib/server/db.js';
import { generateId } from '$lib/server/auth.js';
import { fail } from '@sveltejs/kit';

export async function load({ url }) {
	const search = url.searchParams.get('search') || '';

	let sql = `
		SELECT p.*, c.category_name
		FROM products p
		LEFT JOIN categories c ON p.category_id = c.category_id
		WHERE 1=1
	`;
	let args = [];

	if (search) {
		sql += ' AND (p.product_name LIKE ? OR c.category_name LIKE ? OR p.product_description LIKE ?)';
		const s = `%${search}%`;
		args.push(s, s, s);
	}

	sql += ' ORDER BY p.product_name ASC';

	const products = await db.execute({ sql, args });
	const categories = await db.execute('SELECT * FROM categories ORDER BY category_name');

	return {
		products: products.rows,
		categories: categories.rows,
		filters: { search }
	};
}

export const actions = {
	add: async ({ request }) => {
		const formData = await request.formData();
		const name = formData.get('name')?.toString().trim();
		const price = parseFloat(formData.get('price'));
		const unit = formData.get('unit')?.toString();
		const description = formData.get('description')?.toString().trim() || null;
		const categoryId = formData.get('category_id')?.toString() || null;
		const isActive = formData.get('is_active') === '1' ? 1 : 0;

		if (!name || isNaN(price) || !unit) {
			return fail(400, { error: 'Nama, harga, dan satuan wajib diisi' });
		}

		await db.execute({
			sql: `INSERT INTO products (product_id, product_name, product_price, product_unit, product_description, product_is_active, category_id) VALUES (?, ?, ?, ?, ?, ?, ?)`,
			args: [generateId(), name, price, unit, description, isActive, categoryId]
		});

		return { success: true };
	},

	toggle: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id')?.toString();

		if (!id) {
			return fail(400, { error: 'ID tidak valid' });
		}

		await db.execute({
			sql: 'UPDATE products SET product_is_active = CASE WHEN product_is_active = 1 THEN 0 ELSE 1 END WHERE product_id = ?',
			args: [id]
		});

		return { success: true };
	},

	edit: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id')?.toString();
		const name = formData.get('name')?.toString().trim();
		const price = parseFloat(formData.get('price'));
		const unit = formData.get('unit')?.toString();
		const description = formData.get('description')?.toString().trim() || null;
		const categoryId = formData.get('category_id')?.toString() || null;
		const isActive = formData.get('is_active') === '1' ? 1 : 0;

		if (!id || !name || isNaN(price) || !unit) {
			return fail(400, { error: 'Data tidak valid' });
		}

		await db.execute({
			sql: `UPDATE products SET product_name = ?, product_price = ?, product_unit = ?, product_description = ?, product_is_active = ?, category_id = ? WHERE product_id = ?`,
			args: [name, price, unit, description, isActive, categoryId, id]
		});

		return { success: true };
	},

	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id')?.toString();

		if (!id) {
			return fail(400, { error: 'ID tidak valid' });
		}

		const orders = await db.execute({
			sql: 'SELECT COUNT(*) as count FROM order_items WHERE product_id = ?',
			args: [id]
		});

		if (orders.rows[0]?.count > 0) {
			return fail(400, { error: 'Produk tidak bisa dihapus karena masih ada di order' });
		}

		await db.execute({ sql: 'DELETE FROM products WHERE product_id = ?', args: [id] });
		return { success: true };
	}
};
