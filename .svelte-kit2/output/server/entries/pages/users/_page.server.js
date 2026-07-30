import { t as db } from "../../../chunks/db2.js";
import { redirect } from "@sveltejs/kit";
//#region src/routes/users/+page.server.js
async function load({ locals }) {
	if (locals.user?.role !== "owner") throw redirect(302, "/dashboard");
	return { users: (await db.execute({
		sql: "SELECT user_id, user_name, user_email, user_role, user_status, user_created_at FROM users ORDER BY user_created_at DESC",
		args: []
	})).rows };
}
var actions = {
	approve: async ({ request, locals }) => {
		if (locals.user?.role !== "owner") return { error: "Tidak diizinkan" };
		const id = (await request.formData()).get("id")?.toString();
		if (!id) return { error: "ID tidak valid" };
		await db.execute({
			sql: "UPDATE users SET user_status = 'approved' WHERE user_id = ?",
			args: [id]
		});
		return { success: true };
	},
	reject: async ({ request, locals }) => {
		if (locals.user?.role !== "owner") return { error: "Tidak diizinkan" };
		const id = (await request.formData()).get("id")?.toString();
		if (!id) return { error: "ID tidak valid" };
		await db.execute({
			sql: "UPDATE users SET user_status = 'rejected' WHERE user_id = ?",
			args: [id]
		});
		return { success: true };
	},
	setRole: async ({ request, locals }) => {
		if (locals.user?.role !== "owner") return { error: "Tidak diizinkan" };
		const formData = await request.formData();
		const id = formData.get("id")?.toString();
		const role = formData.get("role")?.toString();
		if (!id || !role || ![
			"owner",
			"admin",
			"staff"
		].includes(role)) return { error: "Data tidak valid" };
		await db.execute({
			sql: "UPDATE users SET user_role = ? WHERE user_id = ?",
			args: [role, id]
		});
		return { success: true };
	}
};
//#endregion
export { actions, load };
