import { db } from '$lib/server/db.js';

export async function load() {
	const inventory = await db.execute(`
		SELECT i.*, COALESCE(SUM(CASE WHEN sm.movement_type = 'in' THEN sm.movement_qty ELSE -sm.movement_qty END), 0) AS total_qty
		FROM inventory i
		LEFT JOIN stock_movements sm ON sm.inventory_id = i.inventory_id
		GROUP BY i.inventory_id
		ORDER BY i.inventory_name
	`);
	const lowStock = inventory.rows.filter((i) => i.total_qty < i.inventory_min_stock);
	
	// Get stock movements for each inventory item
	const movements = await db.execute(`
		SELECT sm.*, i.inventory_name, i.inventory_unit
		FROM stock_movements sm
		JOIN inventory i ON sm.inventory_id = i.inventory_id
		ORDER BY sm.movement_date DESC, sm.movement_created_at DESC
		LIMIT 100
	`);
	
	return {
		inventory: inventory.rows,
		lowStockCount: lowStock.length,
		movements: movements.rows
	};
}

export const actions = {
	add: async ({ request }) => {
		const formData = await request.formData();
		const name = formData.get('name')?.toString().trim();
		const quantity = parseFloat(formData.get('quantity'));
		const unit = formData.get('unit')?.toString();
		const minStock = parseFloat(formData.get('min_stock'));
		const price = parseFloat(formData.get('price') || '0');

		if (!name || isNaN(quantity) || !unit || isNaN(minStock) || isNaN(price) || price < 0) {
			return { error: 'Semua field wajib diisi' };
		}

		const id = crypto.randomUUID();
		await db.execute({
			sql: 'INSERT INTO inventory (inventory_id, inventory_name, inventory_quantity, inventory_unit, inventory_min_stock, inventory_last_restocked, inventory_avg_cost) VALUES (?, ?, ?, ?, ?, ?, ?)',
			args: [id, name, quantity, unit, minStock, new Date().toISOString(), price]
		});

		// Record initial stock as a movement so history is not empty.
		// Cost left 0: avg cost already set to price, stockIn movements carry real cost separately.
		await db.execute({
			sql: 'INSERT INTO stock_movements (movement_id, inventory_id, movement_type, movement_date, movement_description, movement_qty, movement_cost) VALUES (?, ?, ?, ?, ?, ?, ?)',
			args: [crypto.randomUUID(), id, 'in', new Date().toISOString(), 'Stok awal', quantity, 0]
		});

		return { success: true };
	},

	stockIn: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id')?.toString();
		const qty = parseFloat(formData.get('qty'));
		const cost = parseFloat(formData.get('cost') || '0');
		const description = formData.get('description')?.toString().trim() || null;

		if (!id || isNaN(qty) || qty <= 0) {
			return { error: 'Data tidak valid' };
		}

		// Get current inventory
		const current = await db.execute({
			sql: 'SELECT inventory_quantity, inventory_avg_cost FROM inventory WHERE inventory_id = ?',
			args: [id]
		});

		if (current.rows.length === 0) {
			return { error: 'Item tidak ditemukan' };
		}

		const currentQty = current.rows[0].inventory_quantity || 0;
		const currentAvgCost = current.rows[0].inventory_avg_cost || 0;
		const currentValue = currentQty * currentAvgCost;
		const newValue = currentValue + cost;
		const newQty = currentQty + qty;
		const newAvgCost = newQty > 0 ? newValue / newQty : 0;

		// Insert stock movement
		await db.execute({
			sql: 'INSERT INTO stock_movements (movement_id, inventory_id, movement_type, movement_date, movement_description, movement_qty, movement_cost) VALUES (?, ?, ?, ?, ?, ?, ?)',
			args: [crypto.randomUUID(), id, 'in', new Date().toISOString(), description, qty, cost]
		});

		// Update inventory
		await db.execute({
			sql: 'UPDATE inventory SET inventory_quantity = ?, inventory_avg_cost = ?, inventory_last_restocked = ? WHERE inventory_id = ?',
			args: [newQty, newAvgCost, new Date().toISOString(), id]
		});

		return { success: true };
	},

	stockOut: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id')?.toString();
		const qty = parseFloat(formData.get('qty'));
		const description = formData.get('description')?.toString().trim() || null;

		if (!id || isNaN(qty) || qty <= 0) {
			return { error: 'Data tidak valid' };
		}

		// Get current inventory
		const current = await db.execute({
			sql: 'SELECT inventory_quantity, inventory_avg_cost FROM inventory WHERE inventory_id = ?',
			args: [id]
		});

		if (current.rows.length === 0) {
			return { error: 'Item tidak ditemukan' };
		}

		const currentQty = current.rows[0].inventory_quantity || 0;
		const currentAvgCost = current.rows[0].inventory_avg_cost || 0;

		if (qty > currentQty) {
			return { error: 'Stok tidak mencukupi' };
		}

		const newQty = currentQty - qty;
		const costOut = qty * currentAvgCost;

		// Insert stock movement
		await db.execute({
			sql: 'INSERT INTO stock_movements (movement_id, inventory_id, movement_type, movement_date, movement_description, movement_qty, movement_cost) VALUES (?, ?, ?, ?, ?, ?, ?)',
			args: [crypto.randomUUID(), id, 'out', new Date().toISOString(), description, qty, costOut]
		});

		// Update inventory
		await db.execute({
			sql: 'UPDATE inventory SET inventory_quantity = ? WHERE inventory_id = ?',
			args: [newQty, id]
		});

		return { success: true };
	},

	updateStock: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id')?.toString();
		const quantity = parseFloat(formData.get('quantity'));
		const minStock = formData.has('min_stock') ? parseFloat(formData.get('min_stock')) : null;

		if (!id || isNaN(quantity)) {
			return { error: 'Data tidak valid' };
		}

		if (minStock !== null && !isNaN(minStock)) {
			await db.execute({
				sql: 'UPDATE inventory SET inventory_quantity = ?, inventory_min_stock = ?, inventory_last_restocked = ? WHERE inventory_id = ?',
				args: [quantity, minStock, new Date().toISOString(), id]
			});
		} else {
			await db.execute({
				sql: 'UPDATE inventory SET inventory_quantity = ?, inventory_last_restocked = ? WHERE inventory_id = ?',
				args: [quantity, new Date().toISOString(), id]
			});
		}

		return { success: true };
	},

	editPrice: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id')?.toString();
		const price = parseFloat(formData.get('price'));

		if (!id || isNaN(price) || price < 0) {
			return { error: 'Harga tidak valid' };
		}

		await db.execute({
			sql: 'UPDATE inventory SET inventory_avg_cost = ? WHERE inventory_id = ?',
			args: [price, id]
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

		// Delete related stock movements first
		await db.execute({ sql: 'DELETE FROM stock_movements WHERE inventory_id = ?', args: [id] });
		await db.execute({ sql: 'DELETE FROM inventory WHERE inventory_id = ?', args: [id] });
		return { success: true };
	}
};