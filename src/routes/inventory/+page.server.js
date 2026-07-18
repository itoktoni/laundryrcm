import { db } from '$lib/server/db.js';

export async function load() {
	const inventory = await db.execute('SELECT * FROM inventory ORDER BY inventory_name');
	return { inventory: inventory.rows };
}

export const actions = {
	add: async ({ request }) => {
		const formData = await request.formData();
		const name = formData.get('name')?.toString().trim();
		const quantity = parseFloat(formData.get('quantity'));
		const unit = formData.get('unit')?.toString();
		const minStock = parseFloat(formData.get('min_stock'));

		if (!name || isNaN(quantity) || !unit || isNaN(minStock)) {
			return { error: 'Semua field wajib diisi' };
		}

		await db.execute({
			sql: 'INSERT INTO inventory (inventory_id, inventory_name, inventory_quantity, inventory_unit, inventory_min_stock, inventory_last_restocked) VALUES (?, ?, ?, ?, ?, ?)',
			args: [crypto.randomUUID(), name, quantity, unit, minStock, new Date().toISOString()]
		});

		return { success: true };
	},

	updateStock: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id')?.toString();
		const quantity = parseFloat(formData.get('quantity'));

		if (!id || isNaN(quantity)) {
			return { error: 'Data tidak valid' };
		}

		await db.execute({
			sql: 'UPDATE inventory SET inventory_quantity = ?, inventory_last_restocked = ? WHERE inventory_id = ?',
			args: [quantity, new Date().toISOString(), id]
		});

		return { success: true };
	},

	edit: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id')?.toString();
		const name = formData.get('name')?.toString().trim();
		const unit = formData.get('unit')?.toString();
		const minStock = parseFloat(formData.get('min_stock'));

		if (!id || !name || !unit || isNaN(minStock)) {
			return { error: 'Data tidak valid' };
		}

		await db.execute({
			sql: 'UPDATE inventory SET inventory_name = ?, inventory_unit = ?, inventory_min_stock = ? WHERE inventory_id = ?',
			args: [name, unit, minStock, id]
		});

		return { success: true };
	},

	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id')?.toString();

		if (!id) {
			return { error: 'ID tidak valid' };
		}

		await db.execute({ sql: 'DELETE FROM inventory WHERE inventory_id = ?', args: [id] });
		return { success: true };
	}
};
