import { db } from '$lib/server/db.js';
import { generateId, hashPassword, createSession, setSessionCookie } from '$lib/server/auth.js';
import { fail, redirect } from '@sveltejs/kit';

export const actions = {
	default: async ({ request, cookies }) => {
		const formData = await request.formData();
		const name = formData.get('name')?.toString().trim();
		const email = formData.get('email')?.toString().trim();
		const password = formData.get('password')?.toString();

		if (!name || !email || !password) {
			return fail(400, { error: 'Semua field wajib diisi' });
		}

		if (password.length < 6) {
			return fail(400, { error: 'Password minimal 6 karakter' });
		}

		const existing = await db.execute({
			sql: 'SELECT user_id FROM users WHERE user_email = ?',
			args: [email]
		});

		if (existing.rows.length > 0) {
			return fail(400, { error: 'Email sudah terdaftar' });
		}

		const userId = generateId();
		const hashed = await hashPassword(password);

		await db.execute({
			sql: 'INSERT INTO users (user_id, user_name, user_email, user_password, user_role) VALUES (?, ?, ?, ?, ?)',
			args: [userId, name, email, hashed, 'owner']
		});

		const session = await createSession(userId);
		setSessionCookie(cookies, session.id, session.expiresAt);

		throw redirect(302, '/dashboard');
	}
};
