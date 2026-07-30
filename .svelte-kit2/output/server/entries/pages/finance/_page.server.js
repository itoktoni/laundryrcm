import { t as db } from "../../../chunks/db2.js";
//#region src/routes/finance/+page.server.js
async function load({ url }) {
	const period = url.searchParams.get("period") || "month";
	const type = url.searchParams.get("type") || "";
	const startDate = url.searchParams.get("start_date") || "";
	const endDate = url.searchParams.get("end_date") || "";
	let dateFilter = "";
	const args = [];
	if (startDate && endDate) {
		dateFilter = "AND DATE(transaction_date) >= ? AND DATE(transaction_date) <= ?";
		args.push(startDate, endDate);
	} else if (period === "today") dateFilter = "AND DATE(transaction_date) = DATE('now')";
	else if (period === "week") dateFilter = "AND DATE(transaction_date) >= DATE('now', 'weekday 0', '-7 days')";
	else if (period === "month") dateFilter = "AND strftime('%Y-%m', transaction_date) = strftime('%Y-%m', 'now')";
	let typeFilter = "";
	const typeArgs = [];
	if (type) {
		typeFilter = "AND transaction_type = ?";
		typeArgs.push(type);
	}
	const allArgs = [...args, ...typeArgs];
	const [transactions, summary, unpaid] = await Promise.all([
		db.execute({
			sql: `SELECT * FROM transactions WHERE 1=1 ${dateFilter} ${typeFilter} ORDER BY transaction_date DESC LIMIT 100`,
			args: allArgs
		}),
		db.execute({
			sql: `SELECT
				COALESCE(SUM(CASE WHEN transaction_type = 'income' THEN transaction_amount ELSE 0 END), 0) as income,
				COALESCE(SUM(CASE WHEN transaction_type = 'expense' THEN transaction_amount ELSE 0 END), 0) as expense
				FROM transactions WHERE 1=1 ${dateFilter}`,
			args
		}),
		db.execute({
			sql: `SELECT COALESCE(SUM(order_total_price), 0) as total_unpaid
				FROM orders WHERE order_payment_status = 'unpaid'`,
			args: []
		})
	]);
	const income = summary.rows[0]?.income || 0;
	const expense = summary.rows[0]?.expense || 0;
	const totalUnpaid = unpaid.rows[0]?.total_unpaid || 0;
	return {
		transactions: transactions.rows,
		summary: {
			income,
			expense,
			profit: income - expense,
			unpaid: totalUnpaid
		},
		filters: {
			period,
			type,
			startDate,
			endDate
		}
	};
}
var actions = { addTransaction: async ({ request }) => {
	const formData = await request.formData();
	const type = formData.get("type")?.toString();
	const category = formData.get("category")?.toString();
	const amount = parseFloat(formData.get("amount"));
	const description = formData.get("description")?.toString() || "";
	if (!type || !category || isNaN(amount) || amount <= 0) return { error: "Data tidak valid" };
	await db.execute({
		sql: `INSERT INTO transactions (transaction_id, transaction_type, transaction_amount, transaction_category, transaction_description, transaction_date) 
				VALUES (?, ?, ?, ?, ?, ?)`,
		args: [
			crypto.randomUUID(),
			type,
			amount,
			category,
			description,
			(/* @__PURE__ */ new Date()).toISOString()
		]
	});
	return { success: true };
} };
//#endregion
export { actions, load };
