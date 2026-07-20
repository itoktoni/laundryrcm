import { db } from '$lib/server/db.js';
import { toCsv, csvResponse } from '$lib/server/csv.js';

export async function GET({ url }) {
	const period = url.searchParams.get('period') || 'month';
	const type = url.searchParams.get('type') || '';
	const startDate = url.searchParams.get('start_date') || '';
	const endDate = url.searchParams.get('end_date') || '';

	let dateFilter = '';
	const args = [];

	if (startDate && endDate) {
		dateFilter = "AND DATE(transaction_date) >= ? AND DATE(transaction_date) <= ?";
		args.push(startDate, endDate);
	} else if (period === 'today') {
		dateFilter = "AND DATE(transaction_date) = DATE('now')";
	} else if (period === 'week') {
		dateFilter = "AND DATE(transaction_date) >= DATE('now', 'weekday 0', '-7 days')";
	} else if (period === 'month') {
		dateFilter = "AND strftime('%Y-%m', transaction_date) = strftime('%Y-%m', 'now')";
	}

	let typeFilter = '';
	const typeArgs = [];
	if (type) {
		typeFilter = 'AND transaction_type = ?';
		typeArgs.push(type);
	}

	const allArgs = [...args, ...typeArgs];

	const [transactions, summary, unpaid] = await Promise.all([
		db.execute({
			sql: `SELECT * FROM transactions WHERE 1=1 ${dateFilter} ${typeFilter} ORDER BY transaction_date DESC`,
			args: allArgs
		}),
		db.execute({
			sql: `SELECT
				COALESCE(SUM(CASE WHEN transaction_type = 'income' THEN transaction_amount ELSE 0 END), 0) as income,
				COALESCE(SUM(CASE WHEN transaction_type = 'expense' THEN transaction_amount ELSE 0 END), 0) as expense
				FROM transactions WHERE 1=1 ${dateFilter}`,
			args: args
		}),
		db.execute({
			sql: `SELECT COALESCE(SUM(order_total_price), 0) as total_unpaid
				FROM orders WHERE order_payment_status = 'unpaid'`,
			args: []
		})
	]);

	const income = Number(summary.rows[0]?.income || 0);
	const expense = Number(summary.rows[0]?.expense || 0);
	const profit = income - expense;
	const totalUnpaid = Number(unpaid.rows[0]?.total_unpaid || 0);

	return generateCsv(transactions.rows, { income, expense, profit, unpaid: totalUnpaid });
}

function generateCsv(rows, summary) {
	const columns = ['Tanggal', 'Tipe', 'Kategori', 'Jumlah', 'Keterangan'];
	const data = rows.map((r) => ({
		Tanggal: r.transaction_date?.slice(0, 10) || '',
		Tipe: r.transaction_type === 'income' ? 'Pemasukan' : 'Pengeluaran',
		Kategori: r.transaction_category || '',
		Jumlah: r.transaction_amount || 0,
		Keterangan: r.transaction_description || ''
	}));

	// Add summary rows
	data.push({ Tanggal: '', Tipe: '', Kategori: 'TOTAL PEMASUKAN', Jumlah: summary.income, Keterangan: '' });
	data.push({ Tanggal: '', Tipe: '', Kategori: 'TOTAL PENGELUARAN', Jumlah: summary.expense, Keterangan: '' });
	data.push({ Tanggal: '', Tipe: '', Kategori: 'LABA BERSIH', Jumlah: summary.profit, Keterangan: '' });
	data.push({ Tanggal: '', Tipe: '', Kategori: 'PIUTANG (BELUM DIBAYAR)', Jumlah: summary.unpaid, Keterangan: '' });

	const csv = toCsv(columns, data);
	return csvResponse('laporan-keuangan.csv', csv);
}