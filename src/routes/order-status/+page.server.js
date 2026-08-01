import { db } from '$lib/server/db.js';

// Urutan status order (sesuai alur yang dipakai di seluruh aplikasi)
const STATUS_FLOW = ['pending', 'cuci', 'kering', 'setrika', 'packing', 'selesai', 'diambil'];

const STATUS_LABELS = {
	pending: 'Antre',
	cuci: 'Cuci',
	kering: 'Kering',
	setrika: 'Setrika',
	packing: 'Packing',
	selesai: 'Selesai',
	diambil: 'Diambil'
};

const STATUS_COLORS = {
	pending: 'bg-pending',
	cuci: 'bg-primary',
	kering: 'bg-kering',
	setrika: 'bg-setrika',
	packing: 'bg-packing',
	selesai: 'bg-success',
	diambil: 'bg-secondary'
};

export async function load() {
	const countResult = await db.execute({
		sql: 'SELECT order_status, COUNT(*) as total FROM orders GROUP BY order_status',
		args: []
	});

	const countMap = {};
	for (const row of countResult.rows) {
		countMap[row.order_status] = Number(row.total) || 0;
	}

	const statuses = STATUS_FLOW.map((value, i) => ({
		no: i + 1,
		value,
		label: STATUS_LABELS[value] || value,
		color: STATUS_COLORS[value] || 'bg-pending',
		count: countMap[value] || 0
	}));

	return { statuses };
}
