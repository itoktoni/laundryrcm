import { t as db } from "../../../../../chunks/db2.js";
import { n as toCsv, t as csvResponse } from "../../../../../chunks/csv.js";
//#region src/routes/api/orders/export/+server.js
async function GET({ url }) {
	const status = url.searchParams.get("status") || "";
	const startDate = url.searchParams.get("start_date") || "";
	const endDate = url.searchParams.get("end_date") || "";
	let sql = `SELECT o.*, c.customer_name, c.customer_phone 
		FROM orders o JOIN customers c ON o.customer_id = c.customer_id 
		WHERE 1=1`;
	let args = [];
	if (status) {
		sql += " AND o.order_status = ?";
		args.push(status);
	}
	if (startDate) {
		sql += " AND DATE(o.order_created_at) >= ?";
		args.push(startDate);
	}
	if (endDate) {
		sql += " AND DATE(o.order_created_at) <= ?";
		args.push(endDate);
	}
	sql += " ORDER BY o.order_created_at DESC";
	const orders = await db.execute({
		sql,
		args
	});
	const totalOrders = orders.rows.length;
	const totalRevenue = orders.rows.reduce((sum, o) => sum + Number(o.order_total_price || 0), 0);
	const totalPaid = orders.rows.filter((o) => o.order_payment_status === "paid").reduce((sum, o) => sum + Number(o.order_total_price || 0), 0);
	const totalUnpaid = totalRevenue - totalPaid;
	return generateCsv(orders.rows, {
		totalOrders,
		totalRevenue,
		totalPaid,
		totalUnpaid
	});
}
var statusLabels = {
	pending: "Antre",
	cuci: "Cuci",
	kering: "Kering",
	setrika: "Setrika",
	selesai: "Selesai",
	diambil: "Diambil"
};
function generateCsv(rows, summary) {
	const columns = [
		"Tanggal",
		"ID Order",
		"Pelanggan",
		"Telepon",
		"Status",
		"Pembayaran",
		"Total"
	];
	const data = rows.map((r) => ({
		Tanggal: r.order_created_at?.slice(0, 10) || "",
		"ID Order": r.order_id?.slice(0, 8).toUpperCase() || "",
		Pelanggan: r.customer_name || "",
		Telepon: r.customer_phone || "",
		Status: statusLabels[r.order_status] || r.order_status,
		Pembayaran: r.order_payment_status === "paid" ? "Lunas" : "Belum Bayar",
		Total: r.order_total_price || 0
	}));
	data.push({
		Tanggal: "",
		"ID Order": "",
		Pelanggan: "",
		Telepon: "",
		Status: "",
		Pembayaran: "TOTAL ORDER",
		Total: summary.totalOrders
	});
	data.push({
		Tanggal: "",
		"ID Order": "",
		Pelanggan: "",
		Telepon: "",
		Status: "",
		Pembayaran: "TOTAL PENDAPATAN",
		Total: summary.totalRevenue
	});
	data.push({
		Tanggal: "",
		"ID Order": "",
		Pelanggan: "",
		Telepon: "",
		Status: "",
		Pembayaran: "SUDAH DIBAYAR",
		Total: summary.totalPaid
	});
	data.push({
		Tanggal: "",
		"ID Order": "",
		Pelanggan: "",
		Telepon: "",
		Status: "",
		Pembayaran: "BELUM DIBAYAR",
		Total: summary.totalUnpaid
	});
	return csvResponse("laporan-order.csv", toCsv(columns, data));
}
//#endregion
export { GET };
