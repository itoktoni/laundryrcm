import { t as db } from "../../../chunks/db2.js";
import { a as hashPassword, r as generateId, s as setSessionCookie, t as createSession } from "../../../chunks/auth.js";
import { fail, redirect } from "@sveltejs/kit";
//#region src/routes/register/+page.server.js
var actions = { default: async ({ request, cookies }) => {
	const formData = await request.formData();
	const name = formData.get("name")?.toString().trim();
	const email = formData.get("email")?.toString().trim();
	const password = formData.get("password")?.toString();
	if (!name || !email || !password) return fail(400, { error: "Semua field wajib diisi" });
	if (password.length < 6) return fail(400, { error: "Password minimal 6 karakter" });
	if ((await db.execute({
		sql: "SELECT user_id FROM users WHERE user_email = ?",
		args: [email]
	})).rows.length > 0) return fail(400, { error: "Email sudah terdaftar" });
	const userId = generateId();
	const hashed = await hashPassword(password);
	await db.execute({
		sql: "INSERT INTO users (user_id, user_name, user_email, user_password, user_role) VALUES (?, ?, ?, ?, ?)",
		args: [
			userId,
			name,
			email,
			hashed,
			"owner"
		]
	});
	const session = await createSession(userId);
	setSessionCookie(cookies, session.id, session.expiresAt);
	throw redirect(302, "/dashboard");
} };
//#endregion
export { actions };
