import { json } from '@sveltejs/kit';
import { generatePaymentCode } from '$lib/server/payment-code.js';

function calcCRC16(str) {
	let crc = 0xFFFF;
	for (let c = 0; c < str.length; c++) {
		crc ^= str.charCodeAt(c) << 8;
		for (let i = 0; i < 8; i++) {
			if ((crc & 0x8000) !== 0) {
				crc = (crc << 1) ^ 0x1021;
			} else {
				crc = crc << 1;
			}
		}
	}
	return (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
}

function convertStaticToDynamic(staticQris, amount) {
	let dynamicStr = staticQris.replace('010211', '010212');

	if (dynamicStr.includes('6304')) {
		dynamicStr = dynamicStr.split('6304')[0];
	}

	const amountStr = amount.toString();
	const amountLen = amountStr.length.toString().padStart(2, '0');
	const tag54 = `54${amountLen}${amountStr}`;

	dynamicStr += tag54;
	dynamicStr += '6304';
	const newCrc = calcCRC16(dynamicStr);

	return dynamicStr + newCrc;
}

export async function GET({ url, request }) {
	const { getSettings } = await import('$lib/server/settings.js');
	const settings = await getSettings();

	const qris = settings.qris || '';
	const uniqStr = settings.uniq || '0';
	const amount = parseInt(url.searchParams.get('amount') || '0');
	const orderId = url.searchParams.get('orderId') || '';
	const uniq = parseInt(uniqStr);

	const { db } = await import('$lib/server/db.js');

	if (!qris) {
		return json({ error: 'QRIS not configured' }, { status: 500 });
	}

	let finalAmount = amount;
	let uniqValue = 0;

	if (orderId) {
		const res = await db.execute({
			sql: 'SELECT order_unique_code, order_total_price FROM orders WHERE order_id = ?',
			args: [orderId]
		});
		if (res.rows.length > 0) {
			const row = res.rows[0];
			let orderUniq = row.order_unique_code != null ? Number(row.order_unique_code) : 0;

			// If stored value is non-numeric (legacy string) or zero, generate numeric unique code
			if (isNaN(orderUniq) || orderUniq === 0) {
				if (uniq > 0) {
					orderUniq = Math.floor(Math.random() * Math.pow(10, uniq));
				} else if (uniq < 0) {
					orderUniq = uniq;
				} else {
					orderUniq = 0;
				}
			}

			uniqValue = orderUniq;
			finalAmount = amount + (isNaN(orderUniq) ? 0 : orderUniq);

			// Persist unique code, final total (base + uniq) and QRIS payment code (Q prefix)
			const orderPaymentCode = generatePaymentCode('Q');
			await db.execute({
				sql: 'UPDATE orders SET order_unique_code = ?, order_total_price = ?, order_payment_code = ? WHERE order_id = ?',
				args: [orderUniq, finalAmount, orderPaymentCode, orderId]
			});
		}
	} else if (uniq < 0) {
		finalAmount = amount + uniq;
		uniqValue = uniq;
	} else if (uniq > 0) {
		uniqValue = Math.floor(Math.random() * Math.pow(10, uniq));
		finalAmount = amount + uniqValue;
	}

	const dynamicQris = convertStaticToDynamic(qris, finalAmount);

	return json({
		qris: dynamicQris,
		originalAmount: amount,
		finalAmount: finalAmount,
		uniq: uniqValue
	});
}
