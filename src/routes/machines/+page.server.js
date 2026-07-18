import { db } from '$lib/server/db.js';

export async function load() {
	const machines = await db.execute('SELECT * FROM machines ORDER BY machine_name');
	return { machines: machines.rows };
}

export const actions = {
	add: async ({ request }) => {
		const formData = await request.formData();
		const name = formData.get('name')?.toString().trim();
		const type = formData.get('type')?.toString();
		const nextService = formData.get('next_service')?.toString();

		if (!name || !type) {
			return { error: 'Nama dan tipe wajib diisi' };
		}

		await db.execute({
			sql: 'INSERT INTO machines (machine_id, machine_name, machine_type, machine_status, machine_next_service) VALUES (?, ?, ?, ?, ?)',
			args: [crypto.randomUUID(), name, type, 'active', nextService || null]
		});

		return { success: true };
	},

	updateStatus: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id')?.toString();
		const status = formData.get('status')?.toString();

		if (!id || !status) {
			return { error: 'Data tidak valid' };
		}

		await db.execute({
			sql: 'UPDATE machines SET machine_status = ? WHERE machine_id = ?',
			args: [status, id]
		});

		return { success: true };
	},

	recordService: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id')?.toString();
		const nextService = formData.get('next_service')?.toString();

		if (!id) {
			return { error: 'Data tidak valid' };
		}

		await db.execute({
			sql: 'UPDATE machines SET machine_last_service = ?, machine_next_service = ? WHERE machine_id = ?',
			args: [new Date().toISOString(), nextService || null, id]
		});

		return { success: true };
	},

	edit: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id')?.toString();
		const name = formData.get('name')?.toString().trim();
		const type = formData.get('type')?.toString();
		const nextService = formData.get('next_service')?.toString();

		if (!id || !name || !type) {
			return { error: 'Nama dan tipe wajib diisi' };
		}

		await db.execute({
			sql: 'UPDATE machines SET machine_name = ?, machine_type = ?, machine_next_service = ? WHERE machine_id = ?',
			args: [name, type, nextService || null, id]
		});

		return { success: true };
	},

	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id')?.toString();

		if (!id) {
			return { error: 'ID tidak valid' };
		}

		await db.execute({ sql: 'DELETE FROM machines WHERE machine_id = ?', args: [id] });
		return { success: true };
	}
};
