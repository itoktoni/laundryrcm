import { t as db } from "../../../../chunks/db2.js";
import { t as generatePaymentCode } from "../../../../chunks/payment-code.js";
import { fail, redirect } from "@sveltejs/kit";
//#region src/routes/orders/[id]/+page.server.js
async function load({ params }) {
	const orderId = params.id;
	try {
		await db.execute(`ALTER TABLE customers ADD COLUMN customer_est_freq_days INTEGER DEFAULT 0`);
	} catch {}
	try {
		await db.execute(`ALTER TABLE customers ADD COLUMN customer_est_weight REAL DEFAULT 0`);
	} catch {}
	const [order, items, settingsResult] = await Promise.all([
		db.execute({
			sql: `SELECT o.*, c.customer_name, c.customer_phone, c.customer_address, c.customer_vip,
					c.customer_notes, c.customer_est_freq_days, c.customer_est_weight,
					p.promo_name, p.promo_type, p.promo_value
					FROM orders o
					JOIN customers c ON o.customer_id = c.customer_id
					LEFT JOIN promotions p ON o.promo_id = p.promo_id
					WHERE o.order_id = ?`,
			args: [orderId]
		}),
		db.execute({
			sql: `SELECT oi.*, p.product_name, p.product_unit
				FROM order_items oi
				JOIN products p ON oi.product_id = p.product_id
				WHERE oi.order_id = ?`,
			args: [orderId]
		}),
		db.execute({
			sql: `SELECT setting_key, setting_value FROM app_settings WHERE setting_key IN ('store_name', 'store_address', 'store_phone')`,
			args: []
		})
	]);
	if (order.rows.length === 0) throw redirect(302, "/orders");
	const storeSettings = {};
	for (const row of settingsResult.rows) storeSettings[row.setting_key] = row.setting_value;
	return {
		order: order.rows[0],
		items: items.rows,
		store: storeSettings
	};
}
var actions = {
	updateStatus: async ({ request, params }) => {
		const status = (await request.formData()).get("status");
		if (![
			"pending",
			"cuci",
			"kering",
			"setrika",
			"selesai",
			"diambil"
		].includes(status)) return fail(400, { error: "Status tidak valid" });
		await db.execute({
			sql: "UPDATE orders SET order_status = ? WHERE order_id = ?",
			args: [status, params.id]
		});
		return { success: true };
	},
	markPaid: async ({ request, params }) => {
		const formData = await request.formData();
		const paidAmountRaw = formData.get("paid_amount");
		const paidAmount = paidAmountRaw != null && paidAmountRaw !== "" ? parseFloat(paidAmountRaw) : null;
		const uniqueCodeRaw = formData.get("unique_code")?.toString() || "";
		const uniqueCode = uniqueCodeRaw === "null" ? "" : uniqueCodeRaw;
		const method = formData.get("payment_method")?.toString() === "cash" ? "cash" : "qris";
		const order = await db.execute({
			sql: "SELECT * FROM orders WHERE order_id = ?",
			args: [params.id]
		});
		if (order.rows.length === 0) return fail(404, { error: "Order tidak ditemukan" });
		const o = order.rows[0];
		const baseTotal = Number(o.order_total_price) || 0;
		const existingUniq = o.order_unique_code != null ? Number(o.order_unique_code) : 0;
		let savedUniq = 0;
		if (uniqueCode && uniqueCode !== "") savedUniq = parseInt(uniqueCode) || 0;
		else if (existingUniq) savedUniq = existingUniq;
		const paidValue = paidAmount != null && !isNaN(paidAmount) ? paidAmount : baseTotal + savedUniq;
		if (o.order_payment_status !== "paid") {
			const wantPrefix = method === "cash" ? "C" : "Q";
			const savedCode = (o.order_payment_code ? String(o.order_payment_code).charAt(0) : "") === wantPrefix ? o.order_payment_code : generatePaymentCode(wantPrefix);
			const category = method === "cash" ? "pembayaran cash" : "pembayaran qris";
			const desc = `Pembayaran ${method === "cash" ? "cash" : "qris"} ${savedCode}`;
			await db.execute({
				sql: "UPDATE orders SET order_payment_status = ?, order_paid_amount = ?, order_unique_code = ?, order_payment_code = ? WHERE order_id = ?",
				args: [
					"paid",
					paidValue,
					savedUniq,
					savedCode,
					params.id
				]
			});
			await db.execute({
				sql: `INSERT INTO transactions (transaction_id, order_id, transaction_type, transaction_amount, transaction_category, transaction_description, transaction_date)
				VALUES (?, ?, ?, ?, ?, ?, ?)`,
				args: [
					crypto.randomUUID(),
					params.id,
					"income",
					paidValue,
					category,
					desc,
					(/* @__PURE__ */ new Date()).toISOString()
				]
			});
		}
		return { success: true };
	},
	deleteOrder: async ({ params, locals }) => {
		const user = locals.user;
		if (!user || user.role !== "owner" && user.role !== "admin") return fail(403, { error: "Hanya owner dan admin yang bisa menghapus order" });
		const orderId = params.id;
		if ((await db.execute({
			sql: "SELECT * FROM orders WHERE order_id = ?",
			args: [orderId]
		})).rows.length === 0) return fail(404, { error: "Order tidak ditemukan" });
		await db.execute({
			sql: "DELETE FROM transactions WHERE order_id = ?",
			args: [orderId]
		});
		await db.execute({
			sql: "DELETE FROM order_items WHERE order_id = ?",
			args: [orderId]
		});
		await db.execute({
			sql: "DELETE FROM orders WHERE order_id = ?",
			args: [orderId]
		});
		throw redirect(302, "/orders");
	}
};
//#endregion
export { actions, load };
