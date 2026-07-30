import { t as db } from "../../../chunks/db2.js";
import { a as hashPassword, s as setSessionCookie, t as createSession } from "../../../chunks/auth.js";
import { fail, redirect } from "@sveltejs/kit";
//#region src/routes/login/+page.server.js
var actions = { default: async ({ request, cookies }) => {
	const formData = await request.formData();
	const email = formData.get("email")?.toString().trim();
	const password = formData.get("password")?.toString();
	if (!email || !password) return fail(400, { error: "Email dan password wajib diisi" });
	const result = await db.execute({
		sql: "SELECT * FROM users WHERE user_email = ?",
		args: [email]
	});
	if (result.rows.length === 0) return fail(400, { error: "Email atau password salah" });
	const user = result.rows[0];
	if (await hashPassword(password) !== user.user_password) return fail(400, { error: "Email atau password salah" });
	if (user.user_status === "pending") return fail(400, { error: "Akun Anda menunggu persetujuan Owner" });
	if (user.user_status === "rejected") return fail(400, { error: "Akun Anda ditolak. Hubungi Owner." });
	const session = await createSession(user.user_id);
	setSessionCookie(cookies, session.id, session.expiresAt);
	throw redirect(302, "/dashboard");
} };
//#endregion
export { actions };
