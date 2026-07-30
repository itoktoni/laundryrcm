import { t as db } from "../../../chunks/db2.js";
import { r as generateId } from "../../../chunks/auth.js";
import { fail } from "@sveltejs/kit";
//#region src/routes/categories/+page.server.js
async function load() {
	return { categories: (await db.execute({
		sql: `
			SELECT c.*, COUNT(p.product_id) as product_count
			FROM categories c
			LEFT JOIN products p ON p.category_id = c.category_id
			GROUP BY c.category_id
			ORDER BY c.category_name ASC
		`,
		args: []
	})).rows };
}
var actions = {
	add: async ({ request }) => {
		const name = (await request.formData()).get("name")?.toString().trim();
		if (!name) return fail(400, { error: "Nama kategori wajib diisi" });
		if ((await db.execute({
			sql: "SELECT category_id FROM categories WHERE category_name = ?",
			args: [name]
		})).rows.length > 0) return fail(400, { error: "Nama kategori sudah ada" });
		await db.execute({
			sql: "INSERT INTO categories (category_id, category_name) VALUES (?, ?)",
			args: [generateId(), name]
		});
		return { success: true };
	},
	edit: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get("id")?.toString();
		const name = formData.get("name")?.toString().trim();
		if (!id || !name) return fail(400, { error: "Data tidak valid" });
		if ((await db.execute({
			sql: "SELECT category_id FROM categories WHERE category_name = ? AND category_id != ?",
			args: [name, id]
		})).rows.length > 0) return fail(400, { error: "Nama kategori sudah ada" });
		await db.execute({
			sql: "UPDATE categories SET category_name = ? WHERE category_id = ?",
			args: [name, id]
		});
		return { success: true };
	},
	delete: async ({ request }) => {
		const id = (await request.formData()).get("id")?.toString();
		if (!id) return fail(400, { error: "ID tidak valid" });
		if ((await db.execute({
			sql: "SELECT COUNT(*) as count FROM products WHERE category_id = ?",
			args: [id]
		})).rows[0]?.count > 0) return fail(400, { error: "Kategori tidak bisa dihapus karena masih ada produk" });
		await db.execute({
			sql: "DELETE FROM categories WHERE category_id = ?",
			args: [id]
		});
		return { success: true };
	}
};
//#endregion
export { actions, load };
