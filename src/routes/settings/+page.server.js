import { db } from '$lib/server/db.js';
import { hashPassword } from '$lib/server/auth.js';
import { fail } from '@sveltejs/kit';

const ROLES = ['owner', 'admin', 'staff'];

export const actions = {
	changePassword: async ({ request, locals }) => {
		if (!locals.user) return fail(401, { pwError: 'Tidak diizinkan' });

		const formData = await request.formData();
		const current = formData.get('current_password')?.toString() || '';
		const next = formData.get('new_password')?.toString() || '';
		const confirm = formData.get('confirm_password')?.toString() || '';

		if (!current || !next || !confirm) {
			return fail(400, { pwError: 'Semua field wajib diisi' });
		}
		if (next.length < 6) {
			return fail(400, { pwError: 'Password baru minimal 6 karakter' });
		}
		if (next !== confirm) {
			return fail(400, { pwError: 'Konfirmasi password tidak cocok' });
		}

		const result = await db.execute({
			sql: 'SELECT user_password FROM users WHERE user_id = ?',
			args: [locals.user.id]
		});
		if (result.rows.length === 0) {
			return fail(404, { pwError: 'User tidak ditemukan' });
		}

		const hashedCurrent = await hashPassword(current);
		if (hashedCurrent !== result.rows[0].user_password) {
			return fail(400, { pwError: 'Password saat ini salah' });
		}

		await db.execute({
			sql: 'UPDATE users SET user_password = ? WHERE user_id = ?',
			args: [await hashPassword(next), locals.user.id]
		});

		return { pwSuccess: true };
	},

	changeRole: async ({ request, locals }) => {
		if (locals.user?.role !== 'owner') {
			return fail(403, { roleError: 'Hanya owner yang dapat mengganti role' });
		}

		const formData = await request.formData();
		const role = formData.get('role')?.toString();

		if (!ROLES.includes(role)) {
			return fail(400, { roleError: 'Role tidak valid' });
		}

		await db.execute({
			sql: 'UPDATE users SET user_role = ? WHERE user_id = ?',
			args: [role, locals.user.id]
		});

		return { roleSuccess: true };
	}
};
