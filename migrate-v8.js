import { createClient } from '@libsql/client';

const db = createClient({ url: 'file:local.db' });

await db.execute(`CREATE TABLE IF NOT EXISTS faqs (
	faq_id TEXT PRIMARY KEY,
	faq_question TEXT NOT NULL,
	faq_answer TEXT,
	faq_created_at TEXT NOT NULL DEFAULT (datetime('now'))
)`);

const seed = [
	['Berapa lama proses cucian selesai?', 'Reguler 2-3 hari, Express 4-8 jam. Estimasi tepatnya diberikan saat order dibuat.'],
	['Apakah bisa antar-jemput?', 'Bisa. Hubungi kami untuk jadwal antar-jemput sesuai area layanan.'],
	['Bagaimana cara pembayaran?', 'Tunai, transfer, atau QRIS. Bisa bayar di muka (DP) atau saat pengambilan.'],
	['Apakah ada garansi cuci ulang?', 'Ya. Jika hasil kurang bersih, cuci ulang gratis dengan menunjukkan nota order.'],
	['Bagaimana jika pakaian hilang/rusak?', 'Laporkan dalam 1x24 jam dengan nota order. Kami akan investigasi & beri kompensasi sesuai kebijakan.']
];

for (const [q, a] of seed) {
	await db.execute({
		sql: 'INSERT OR IGNORE INTO faqs (faq_id, faq_question, faq_answer) VALUES (?, ?, ?)',
		args: [crypto.randomUUID(), q, a]
	});
}

const rows = await db.execute('SELECT faq_question FROM faqs');
console.log('FAQs:');
rows.rows.forEach((f) => console.log('  ' + f.faq_question));
