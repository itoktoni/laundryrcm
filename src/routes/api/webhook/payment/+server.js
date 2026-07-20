import { db } from '$lib/server/db.js';
import { json } from '@sveltejs/kit';
import { appendFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';

const logDir = join(process.cwd(), 'logs');
const logFile = join(logDir, 'webhook.log');

let dirReady = false;
async function log(...args) {
	const line = `[webhook/payment] ${new Date().toISOString()} ${args.map((a) => (typeof a === 'object' ? JSON.stringify(a) : a)).join(' ')}\n`;
	console.log(line.trim());
	try {
		if (!dirReady) {
			await mkdir(logDir, { recursive: true });
			dirReady = true;
		}
		await appendFile(logFile, line);
	} catch (err) {
		console.error('[webhook/payment] log write failed', err);
	}
}

export async function POST({ request }) {
	try {
		const { getSettings } = await import('$lib/server/settings.js');
		const settings = await getSettings();
		const expectedUser = settings.webhook_basic_user || '';
		const expectedPass = settings.webhook_basic_pass || '';
		const debug = settings.webhook_debug === '1';

		await log('received request', { debug, method: request.method, contentType: request.headers.get('content-type') });

		const headers = {};
		for (const [key, value] of request.headers) {
			if (key.startsWith('x-')) headers[key] = value;
		}
		await log('x-headers', headers);

		const authHeader = request.headers.get('authorization') || '';
		let authUser = '';
		let authPass = '';
		let authMethod = 'none';

		if (authHeader.startsWith('Basic ')) {
			try {
				const decoded = atob(authHeader.slice(6));
				[authUser, authPass] = decoded.split(':');
				authMethod = 'basic';
			} catch { /* ignore */ }
		} else if (authHeader.startsWith('Bearer ')) {
			authPass = authHeader.slice(7);
			authMethod = 'bearer';
		}

		const xApiKey = request.headers.get('x-api-key') || '';
		if (xApiKey) {
			authPass = xApiKey;
			authMethod = 'x-api-key';
		}

		await log('auth', { method: authMethod, user: authUser });

		let authorized = debug;

		if (!authorized && authMethod === 'basic' && expectedUser && expectedPass) {
			authorized = authUser === expectedUser && authPass === expectedPass;
		}
		if (!authorized && authMethod === 'bearer' && expectedPass) {
			authorized = authPass === expectedPass;
		}
		if (!authorized && authMethod === 'x-api-key' && expectedPass) {
			authorized = authPass === expectedPass;
		}

		if (!authorized) {
			await log('unauthorized', { method: authMethod });
			return json({ error: 'Unauthorized' }, { status: 401 });
		}

		let rawText;
		try {
			rawText = await request.text();
		} catch {
			await log('cannot read body');
			return json({ error: 'Cannot read body' }, { status: 400 });
		}

		await log('raw body text', rawText);

		let body;
		try {
			body = rawText ? JSON.parse(rawText) : {};
		} catch {
			await log('invalid JSON');
			return json({ error: 'Invalid JSON' }, { status: 400 });
		}

		await log('raw body', body);

		const reference = body.reference || body.order_id || body.orderId || null;
		const notifText = body.notification_text || '';
		const extractedAmount = notifText ? Number(String(notifText).replace(/[^0-9.,]/g, '').replace(/\./g, '').replace(',', '.')) : NaN;
		const paid_amount = body.paid_amount ?? body.amount ?? body.paidAmount ?? extractedAmount;
		const unique_code = body.unique_code ?? body.uniqueCode ?? (body.source ? String(body.source).replace(/\s+/g, '_').toLowerCase() : null);

		await log('payload', { reference, paid_amount, extractedAmount, notifText, unique_code });

		if (!paid_amount || Number.isNaN(Number(paid_amount))) {
			await log('missing amount');
			return json({ error: 'amount required' }, { status: 400 });
		}

		const amountNum = Number(paid_amount);

		// 1) Explicit order id match (most reliable when PSP echoes it back).
		// ponytail: project has no TS types for db ResultSet; keep loose to match existing code style
		// Query WITHOUT the != 'paid' filter so a replayed webhook for an already-settled
		// order is treated as success (idempotent) instead of a false 404.
		/** @type {any} */
		let result = { rows: [] };
		if (reference) {
			result = await db.execute({
				sql: `SELECT * FROM orders
					WHERE order_id = ?
					LIMIT 1`,
				args: [reference]
			});
		}

		// 2) Amount match (fallback when PSP does not echo order id).
		// Tolerance ±0.5 to survive float/string drift; unique-code amounts are integers so no clash.
		// Includes already-paid orders so a duplicate notification returns success, not 404.
		if (result.rows.length === 0) {
			result = await db.execute({
				sql: `SELECT * FROM orders
					WHERE ABS(CAST(order_total_price AS REAL) - ?) <= 0.5
					ORDER BY order_created_at DESC LIMIT 1`,
				args: [amountNum]
			});
		}

		// 3) Base-amount match: customer may have paid the raw static QRIS (no unique code),
		// so the notified amount equals order_total_price - order_unique_code.
		if (result.rows.length === 0) {
			result = await db.execute({
				sql: `SELECT * FROM orders
					WHERE order_unique_code IS NOT NULL
					AND ABS(CAST(order_total_price AS REAL) - CAST(order_unique_code AS REAL) - ?) <= 0.5
					ORDER BY order_created_at DESC LIMIT 1`,
				args: [amountNum]
			});
		}

		if (result.rows.length === 0) {
			await log('no matching order at all', { amount: amountNum, reference });
			return json({ error: 'No matching order' }, { status: 404 });
		}

		const order = result.rows[0];
		const order_id = order.order_id;

		// Idempotent: a re-delivered webhook for an already-settled order is success, not a failure.
		if (order.order_payment_status === 'paid') {
			await log('already paid (idempotent replay)', order_id);
			return json({ success: true, message: 'Already paid', order_id });
		}

		// Order paid amount = order's own total price (base + unique code), not raw PSP amount.
		// Booking the order total guarantees settlement even when PSP amount differs (rounding, fees, no unique code).
		const orderPaidAmount = Math.round((Number(order.order_total_price) + Number.EPSILON) * 100) / 100;

		// Fetch payment_code (short human code) to use in finance description instead of internal id
		let paymentCode = null;
		try {
			const pcRes = await db.execute({
				sql: 'SELECT order_payment_code FROM orders WHERE order_id = ?',
				args: [order_id]
			});
			if (pcRes.rows.length > 0) paymentCode = pcRes.rows[0].order_payment_code || null;
		} catch (e) {
			await log('payment_code lookup error', e?.stack || e);
		}

		await log('marking paid', { order_id, payment_code: paymentCode, amount: orderPaidAmount, psp_amount: amountNum });

		await db.execute({
			sql: 'UPDATE orders SET order_payment_status = ?, order_paid_amount = ? WHERE order_id = ?',
			args: ['paid', orderPaidAmount, order_id]
		});

		// Description uses the PSP reference (e.g. PH-xxxxxxxx) so finance records show the
		// webhook source, not the internal payment code. Fall back to order_id if PSP sends none.
		const webhookRef = reference || paymentCode || order_id;

		await db.execute({
			sql: `INSERT INTO transactions (transaction_id, order_id, transaction_type, transaction_amount, transaction_category, transaction_description, transaction_date)
			VALUES (?, ?, ?, ?, ?, ?, ?)`,
			args: [
				crypto.randomUUID(),
				order_id,
				'income',
				orderPaidAmount,
				'pembayaran webhook',
				`Pembayaran webhook ${webhookRef}`,
				new Date().toISOString()
			]
		});

		await log('done', { order_id, reference });
		return json({ success: true, order_id });
	} catch (err) {
		await log('ERROR', err?.stack || String(err));
		return json({ error: 'Internal error' }, { status: 500 });
	}
}
