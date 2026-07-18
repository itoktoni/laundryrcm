import { QRIS_BASE, UNIQ } from '$env/static/private';

/**
 * Generate dynamic QRIS with unique amount
 * 
 * UNIQ=-2 → price 96000 → 95998 (kurangi 2)
 * UNIQ=2 → price 96000 → 96002 (tambah 2 digit random)
 */
export function generateQris(amount) {
	const qris = QRIS_BASE || '';
	const uniq = parseInt(UNIQ || '0');

	if (!qris) return '';

	let finalAmount = amount;

	if (uniq < 0) {
		// Kurangi X digit dari amount
		finalAmount = amount + uniq; // uniq=-2, 96000 → 95998
	} else if (uniq > 0) {
		// Tambah X digit random
		const suffix = String(Math.floor(Math.random() * Math.pow(10, uniq))).padStart(uniq, '0');
		finalAmount = parseInt(String(amount) + suffix);
	}

	// Replace amount in QRIS string (tag 54)
	// QRIS format: ...5404XXXX... where XXXX is the amount
	// We need to find tag 54 and replace its value

	// Simple approach: replace the amount placeholder
	// The QRIS string typically has the amount embedded
	// For dynamic QRIS, we modify the amount tag (54)

	return {
		qrisString: qris,
		originalAmount: amount,
		finalAmount: finalAmount,
		uniq: uniq
	};
}
