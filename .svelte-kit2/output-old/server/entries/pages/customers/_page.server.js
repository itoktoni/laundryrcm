import { t as db } from "../../../chunks/db2.js";
import { r as generateId } from "../../../chunks/auth.js";
import { fail } from "@sveltejs/kit";
//#region src/routes/customers/+page.server.js
async function load({ url }) {
	const search = url.searchParams.get("search") || "";
	let sql = "SELECT * FROM customers WHERE 1=1";
	let args = [];
	if (search) {
		sql += " AND (customer_name LIKE ? OR customer_phone LIKE ?)";
		const s = `%${search}%`;
		args.push(s, s);
	}
	sql += " ORDER BY customer_total_orders DESC LIMIT 50";
	return {
		customers: (await db.execute({
			sql,
			args
		})).rows,
		filters: { search }
	};
}
var actions = {
	addCustomer: async ({ request }) => {
		const formData = await request.formData();
		const name = formData.get("customer_name")?.toString().trim();
		const phone = formData.get("customer_phone")?.toString().trim();
		const address = formData.get("customer_address")?.toString().trim() || "";
		if (!name || !phone) return fail(400, { error: "Nama dan nomor HP wajib diisi" });
		await db.execute({
			sql: "INSERT INTO customers (customer_id, customer_name, customer_phone, customer_address) VALUES (?, ?, ?, ?)",
			args: [
				generateId(),
				name,
				phone,
				address
			]
		});
		return { success: true };
	},
	deleteCustomer: async ({ request }) => {
		const id = (await request.formData()).get("customer_id")?.toString();
		if (!id) return fail(400, { error: "ID pelanggan tidak valid" });
		if ((await db.execute({
			sql: "SELECT COUNT(*) as count FROM orders WHERE customer_id = ?",
			args: [id]
		})).rows[0]?.count > 0) return fail(400, { error: "Pelanggan tidak bisa dihapus karena masih memiliki order" });
		await db.execute({
			sql: "DELETE FROM customers WHERE customer_id = ?",
			args: [id]
		});
		return { success: true };
	}
};
//#endregion
export { actions, load };
