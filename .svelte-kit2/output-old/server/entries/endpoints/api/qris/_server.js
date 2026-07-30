import { t as generatePaymentCode } from "../../../../chunks/payment-code.js";
import { json } from "@sveltejs/kit";
//#region src/routes/api/qris/+server.js
function calcCRC16(str) {
	let crc = 65535;
	for (let c = 0; c < str.length; c++) {
		crc ^= str.charCodeAt(c) << 8;
		for (let i = 0; i < 8; i++) if ((crc & 32768) !== 0) crc = crc << 1 ^ 4129;
		else crc = crc << 1;
	}
	return (crc & 65535).toString(16).toUpperCase().padStart(4, "0");
}
function convertStaticToDynamic(staticQris, amount) {
	let dynamicStr = staticQris.replace("010211", "010212");
	if (dynamicStr.includes("6304")) dynamicStr = dynamicStr.split("6304")[0];
	const amountStr = amount.toString();
	const tag54 = `54${amountStr.length.toString().padStart(2, "0")}${amountStr}`;
	dynamicStr += tag54;
	dynamicStr += "6304";
	const newCrc = calcCRC16(dynamicStr);
	return dynamicStr + newCrc;
}
async function GET({ url, request }) {
	const { getSettings } = await import("../../../../chunks/settings.js");
	const settings = await getSettings();
	const qris = settings.qris || "";
	const uniqStr = settings.uniq || "0";
	const amount = parseInt(url.searchParams.get("amount") || "0");
	const orderId = url.searchParams.get("orderId") || "";
	const uniq = parseInt(uniqStr);
	const { db } = await import("../../../../chunks/db.js");
	if (!qris) return json({ error: "QRIS not configured" }, { status: 500 });
	let finalAmount = amount;
	let uniqValue = 0;
	if (orderId) {
		const res = await db.execute({
			sql: "SELECT order_unique_code, order_total_price FROM orders WHERE order_id = ?",
			args: [orderId]
		});
		if (res.rows.length > 0) {
			const row = res.rows[0];
			let orderUniq = row.order_unique_code != null ? Number(row.order_unique_code) : 0;
			if (isNaN(orderUniq) || orderUniq === 0) if (uniq > 0) orderUniq = Math.floor(Math.random() * Math.pow(10, uniq));
			else if (uniq < 0) orderUniq = uniq;
			else orderUniq = 0;
			uniqValue = orderUniq;
			finalAmount = amount + (isNaN(orderUniq) ? 0 : orderUniq);
			const orderPaymentCode = generatePaymentCode("Q");
			await db.execute({
				sql: "UPDATE orders SET order_unique_code = ?, order_total_price = ?, order_payment_code = ? WHERE order_id = ?",
				args: [
					orderUniq,
					finalAmount,
					orderPaymentCode,
					orderId
				]
			});
		}
	} else if (uniq < 0) {
		finalAmount = amount + uniq;
		uniqValue = uniq;
	} else if (uniq > 0) {
		uniqValue = Math.floor(Math.random() * Math.pow(10, uniq));
		finalAmount = amount + uniqValue;
	}
	return json({
		qris: convertStaticToDynamic(qris, finalAmount),
		originalAmount: amount,
		finalAmount,
		uniq: uniqValue
	});
}
//#endregion
export { GET };
