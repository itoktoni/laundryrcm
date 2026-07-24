import { db } from '$lib/server/db.js';
import { redirect } from '@sveltejs/kit';

export async function load({ locals }) {
	if (locals.user?.role !== 'owner') {
		throw redirect(302, '/dashboard');
	}

	const users = await db.execute({
		sql: `SELECT user_id, user_name, user_email, user_role, user_status, user_created_at
			FROM users
			ORDER BY CASE user_status WHEN 'pending' THEN 0 ELSE 1 END, user_created_at DESC`
	});

	return { users: users.rows };
}

export const actions = {
	approve: async ({ request, locals }) => {
		if (locals.user?.role !== 'owner') return { error: 'Tidak diizinkan' };

		const formData = await request.formData();
		const id = formData.get('id')?.toString();

		if (!id) return { error: 'ID tidak valid' };

		await db.execute({
			sql: "UPDATE users SET user_status = 'approved' WHERE user_id = ?",
			args: [id]
		});

		return { success: true };
	},

	reject: async ({ request, locals }) => {
		if (locals.user?.role !== 'owner') return { error: 'Tidak diizinkan' };

		const formData = await request.formData();
		const id = formData.get('id')?.toString();

		if (!id) return { error: 'ID tidak valid' };

		await db.execute({
			sql: "UPDATE users SET user_status = 'rejected' WHERE user_id = ?",
			args: [id]
		});

		return { success: true };
	},

	setRole: async ({ request, locals }) => {
		if (locals.user?.role !== 'owner') return { error: 'Tidak diizinkan' };

		const formData = await request.formData();
		const id = formData.get('id')?.toString();
		const role = formData.get('role')?.toString();

		if (!id || !role || !['owner', 'admin', 'staff'].includes(role)) {
			return { error: 'Data tidak valid' };
		}

		await db.execute({
			sql: 'UPDATE users SET user_role = ? WHERE user_id = ?',
			args: [role, id]
		});

		return { success: true };
	}
};
