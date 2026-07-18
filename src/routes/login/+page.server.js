import { db } from '$lib/server/db.js';
import { hashPassword, createSession, setSessionCookie } from '$lib/server/auth.js';
import { fail, redirect } from '@sveltejs/kit';

export const actions = {
	default: async ({ request, cookies }) => {
		const formData = await request.formData();
		const email = formData.get('email')?.toString().trim();
		const password = formData.get('password')?.toString();

		if (!email || !password) {
			return fail(400, { error: 'Email dan password wajib diisi' });
		}

		const result = await db.execute({
			sql: 'SELECT * FROM users WHERE user_email = ?',
			args: [email]
		});

		if (result.rows.length === 0) {
			return fail(400, { error: 'Email atau password salah' });
		}

		const user = result.rows[0];
		const hashed = await hashPassword(password);

		if (hashed !== user.user_password) {
			return fail(400, { error: 'Email atau password salah' });
		}

		const session = await createSession(user.user_id);
		setSessionCookie(cookies, session.id, session.expiresAt);

		throw redirect(302, '/dashboard');
	}
};
