import { db } from '$lib/server/db.js';

export async function load() {
	const machines = await db.execute('SELECT * FROM machines ORDER BY machine_name');
	const services = await db.execute(`
		SELECT ms.*, m.machine_name 
		FROM machine_services ms 
		JOIN machines m ON ms.machine_id = m.machine_id 
		ORDER BY ms.service_created_at DESC
	`);
	return { machines: machines.rows, services: services.rows };
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
		const description = formData.get('description')?.toString().trim();
		const cost = parseFloat(formData.get('cost') || '0');
		const notes = formData.get('notes')?.toString().trim() || null;
		const nextService = formData.get('next_service')?.toString();

		console.log('recordService action called with:', { id, description, cost, notes, nextService });

		if (!id || !description) {
			console.log('Validation failed: missing id or description');
			return { error: 'Data tidak valid' };
		}

		const now = new Date().toISOString();

		try {
			console.log('Inserting into machine_services...');
			await db.execute({
				sql: 'INSERT INTO machine_services (service_id, machine_id, service_date, service_description, service_cost, service_notes) VALUES (?, ?, ?, ?, ?, ?)',
				args: [crypto.randomUUID(), id, now, description, cost, notes]
			});
			console.log('Insert successful');

			console.log('Updating machines table...');
			await db.execute({
				sql: 'UPDATE machines SET machine_last_service = ?, machine_next_service = ? WHERE machine_id = ?',
				args: [now, nextService || null, id]
			});
			console.log('Update successful');

			return { success: true };
		} catch (err) {
			console.error('Record service error:', err);
			const message = err instanceof Error ? err.message : 'Unknown error';
			return { error: 'Gagal menyimpan: ' + message };
		}
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
