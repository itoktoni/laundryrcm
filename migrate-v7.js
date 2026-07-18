import { createClient } from '@libsql/client';

const db = createClient({ url: 'file:local.db' });

await db.execute(`CREATE TABLE IF NOT EXISTS templates (
	template_id TEXT PRIMARY KEY,
	template_name TEXT NOT NULL,
	template_description TEXT,
	template_created_at TEXT NOT NULL DEFAULT (datetime('now'))
)`);

const seed = [
	['SOP Penerimaan Order', [
		'Sapa pelanggan dengan ramah',
		'Catat data pelanggan (nama, HP, alamat)',
		'Periksa dan hitung jumlah cucian',
		'Pisahkan berdasarkan jenis dan warna',
		'Isi form order dengan lengkap',
		'Berikan estimasi waktu selesai',
		'Terima pembayaran DP (jika ada)'
	]],
	['SOP Pencucian', [
		'Pisahkan cucian berdasarkan warna dan jenis',
		'Periksa label perawatan pada pakaian',
		'Gunakan deterjen sesuai takaran',
		'Atur mesin cuci sesuai jenis kain',
		'Periksa noda dan lakukan pre-treatment',
		'Jalankan mesin cuci',
		'Periksa hasil cucian sebelum dikeringkan'
	]],
	['SOP Penyetrikaan', [
		'Atur suhu setrika sesuai jenis kain',
		'Gunakan spray untuk kain yang kering',
		'Setrika bagian dalam untuk kain sensitif',
		'Lipat dengan rapi sesuai standar',
		'Periksa hasil setrika',
		'Gantung pakaian yang perlu digantung'
	]]
];

for (const [name, steps] of seed) {
	const desc = steps.map((s, i) => `${i + 1}. ${s}`).join('\n');
	await db.execute({
		sql: 'INSERT OR IGNORE INTO templates (template_id, template_name, template_description) VALUES (?, ?, ?)',
		args: [crypto.randomUUID(), name, desc]
	});
}

const rows = await db.execute('SELECT template_name FROM templates');
console.log('Templates:');
rows.rows.forEach((t) => console.log('  ' + t.template_name));
