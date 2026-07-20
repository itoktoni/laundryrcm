const { createClient } = require('@libsql/client');
const db = createClient({
	url: 'libsql://laundry-app-itoktoni.aws-ap-northeast-1.turso.io',
	authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3ODQ0NDQ5MTUsImlkIjoiMDE5Zjc0NDEtZjgwMS03N2Q4LThiNTUtODQwZGQyNWIzYTk2Iiwia2lkIjoiOE1yUThLTHVYbV9ZenE0emIyM1B6cU5yeDJVSzBrOWUxUjl1NjlnQmVUYyIsInJpZCI6IjY2YWVjMjkyLTE3OTgtNGZlNC1iZmNjLTllNjhiYjc4MTZiNiJ9.mib6Yfi0HyV_KN-3xsxckjj7a_8-CxYbesjkCC9yYiqjD-pCISSjsFJx6hBV0BkUJNV_lV3dXsmMkJrNvv88DQ'
});
(async () => {
	const items = await db.execute('SELECT inventory_id, inventory_name, inventory_quantity, inventory_avg_cost FROM inventory');
	for (const it of items.rows) {
		const m = await db.execute({
			sql: "SELECT COALESCE(SUM(movement_qty),0) q, COALESCE(SUM(movement_cost),0) c FROM stock_movements WHERE inventory_id = ? AND movement_type = 'in'",
			args: [it.inventory_id]
		});
		const q = Number(m.rows[0].q), c = Number(m.rows[0].c);
		const avg = q > 0 ? Math.round(c / q) : 0;
		const bad = avg !== Number(it.inventory_avg_cost) || q !== Number(it.inventory_quantity);
		console.log((bad ? 'DIFF ' : 'ok   ') + it.inventory_name + ' stored(q' + it.inventory_quantity + ',a' + it.inventory_avg_cost + ') calc(q' + q + ',a' + avg + ')');
	}
})().catch((e) => console.error(e));
