// Generate a short payment code: prefix (Q=QRIS, C=cash) + 9 alphanumeric chars.
const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export function generatePaymentCode(prefix) {
	/** @type {'Q' | 'C' | string} */
	const p = (prefix === 'Q' || prefix === 'C') ? prefix : 'C';
	let code = p;
	for (let i = 0; i < 9; i++) {
		code += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
	}
	return code;
}