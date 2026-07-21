import { db } from '$lib/server/db.js';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
	const { id } = params;

	const inventoryResult = await db.execute({
		sql: 'SELECT * FROM inventory WHERE inventory_id = ?',
		args: [id]
	});

	if (inventoryResult.rows.length === 0) {
		throw error(404, 'Item tidak ditemukan');
	}

	const item = inventoryResult.rows[0];

	// Get running balance movements ordered by date
	const movementsResult = await db.execute({
		sql: `
			SELECT sm.*, 
				CASE WHEN sm.movement_type = 'in' THEN sm.movement_qty ELSE -sm.movement_qty END AS signed_qty
			FROM stock_movements sm
			WHERE sm.inventory_id = ?
			ORDER BY sm.movement_date ASC, sm.movement_created_at ASC
		`,
		args: [id]
	});

	const movements = movementsResult.rows;
	
	const avgCost = parseFloat(item.inventory_avg_cost) || 0;
	
	let runningQty = 0;
	let runningValue = 0;
	let currentAvg = avgCost;

	const formattedMovements = movements.map((m, i) => {
		const type = m.movement_type;
		const qty = parseFloat(m.movement_qty);
		const cost = parseFloat(m.movement_cost) || 0;
		const movementAvgCost = parseFloat(m.movement_avg_cost) || 0;
		
		if (type === 'in') {
			runningQty += qty;
			runningValue += cost;
		} else {
			runningQty -= qty;
			runningValue -= cost;
		}

		// Update current avg cost when out movement happens
		if (type === 'out' && movementAvgCost > 0) {
			currentAvg = movementAvgCost;
		}

		return {
			...m,
			sign: type === 'in' ? '+' : '-',
			nominal: cost,
			rata_rata: currentAvg,
			running_qty: runningQty
		};
	});

	const currentQty = parseFloat(item.inventory_quantity) || 0;
	const currentValue = currentQty * currentAvg;

	return {
		item: {
			...item,
			currentQty,
			currentAvg,
			currentValue
		},
		movements: formattedMovements.reverse()
	};
}