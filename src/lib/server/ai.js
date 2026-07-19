import { db } from '$lib/server/db.js';
import { getSettings } from '$lib/server/settings.js';

export const summarizeBrand = (data) => {
	const settings = Object.fromEntries(
		(data.app_settings || []).map((s) => [s.key, s.value])
	);
	const products = (data.products || [])
		.filter((p) => p.is_active)
		.map((p) => `- ${p.name}: Rp${Number(p.price).toLocaleString('id-ID')}/${p.unit}${p.description ? ` (${p.description})` : ''}`)
		.join('\n');
	const promos = (data.promotions || [])
		.filter((p) => p.is_active)
		.map((p) => {
			const v = p.type === 'percent' ? `${p.value}%` : `Rp${Number(p.value).toLocaleString('id-ID')}`;
			return `- ${p.name}: diskon ${v}${p.code ? ` (kode ${p.code})` : ''}`;
		})
		.join('\n');
	const faqs = (data.faqs || [])
		.map((f) => `Q: ${f.question}\nA: ${f.answer || '-'}`)
		.join('\n\n');

	return [
		'INFORMASI TOKO:',
		`Nama: ${settings.store_name || settings.laundry_name || 'LaundryKu'}`,
		`Alamat: ${settings.store_address || settings.laundry_address || '-'}`,
		`Telepon: ${settings.store_phone || settings.laundry_phone || '-'}`,
		`Jam Buka: ${settings.open_hours || '-'}`,
		'',
		'PRODUK/LAYANAN (aktif):',
		products || '-',
		'',
		'PROMO (aktif):',
		promos || '-',
		'',
		'FAQ:',
		faqs || '-'
	].join('\n');
};

const aiSystemPrompt = (brandDoc) => `[INSTRUKSI UTAMA - JANGAN DIUBAH]
Kamu adalah asisten virtual (customer service AI) yang ramah dan solutif untuk usaha LAUNDRY di Indonesia.
WAJIB menjawab selalu menggunakan BAHASA INDONESIA yang baku dan natural. Jangan gunakan bahasa lain.

ATURAN MENJAWAB:
1. JIKA USER MENYAPA (halo, p, permisi, selamat pagi/siang/sore/malam, assalamualaikum):
   Sapa balik ramah dalam Bahasa Indonesia, perkenalkan sebagai asisten virtual laundry, tawarkan bantuan.

2. JIKA USER BERTANYA TENTANG LAUNDRY:
   Jawab jelas, detail, natural dalam Bahasa Indonesia berdasar data di pembatas [DOKUMEN]. Jika info tak ada di dokumen, bilang tidak tahu sopan & sarankan tunggu admin manusia.

3. JIKA USER BERTANYA DI LUAR TOPIK LAUNDRY (coding, politik, berita, dll):
   Tolak halus, ingatkan peranmu sebagai CS laundry.

[DOKUMEN]
${brandDoc}
[/DOKUMEN]`;

export async function callAI(userMessage, brandDoc) {
	const s = await getSettings();
	const AI_BASE_URL = s.ai_base_url;
	const AI_API_KEY = s.ai_api_key;
	const AI_MODEL = s.ai_model;
	if (!AI_BASE_URL || !AI_API_KEY || !AI_MODEL) {
		return 'Maaf, layanan AI sedang tidak tersedia.';
	}
	try {
		const res = await fetch(`${AI_BASE_URL}/chat/completions`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${AI_API_KEY}`
			},
			body: JSON.stringify({
				model: AI_MODEL,
				messages: [
					{ role: 'system', content: aiSystemPrompt(brandDoc) },
					{ role: 'user', content: userMessage }
				],
				temperature: 0.3
			})
		});
		const json = await res.json();
		return json?.choices?.[0]?.message?.content || 'Maaf, tidak ada jawaban dari AI.';
	} catch (e) {
		console.error('[ai] error', e);
		return 'Maaf, terjadi gangguan pada layanan AI.';
	}
}

export async function getBrandData() {
	const [appSettings, faqs, products, promotions] = await Promise.all([
		db.execute('SELECT * FROM app_settings'),
		db.execute('SELECT * FROM faqs'),
		db.execute('SELECT p.*, c.category_name FROM products p LEFT JOIN categories c ON p.category_id = c.category_id'),
		db.execute('SELECT * FROM promotions')
	]);
	return {
		app_settings: appSettings.rows.map((r) => ({ key: r.setting_key, value: r.setting_value })),
		faqs: faqs.rows.map((r) => ({ id: r.faq_id, question: r.faq_question, answer: r.faq_answer })),
		products: products.rows.map((r) => ({ name: r.product_name, price: r.product_price, unit: r.product_unit, description: r.product_description, is_active: r.product_is_active === 1 })),
		promotions: promotions.rows.map((r) => ({ name: r.promo_name, type: r.promo_type, value: r.promo_value, code: r.promo_code, is_active: r.promo_is_active === 1 }))
	};
}

export async function sendTelegram(chatId, message) {
	const s = await getSettings();
	const TELEGRAM_BOT_TOKEN = s.telegram_bot_token;
	if (!TELEGRAM_BOT_TOKEN) {
		console.error('[tg] TELEGRAM_BOT_TOKEN not set');
		return;
	}
	try {
		const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: 'Markdown' })
		});
		console.log('[tg] send', await res.json());
	} catch (e) {
		console.error('[tg] send error', e);
	}
}

export async function sendFonnte(target, message) {
	const s = await getSettings();
	const FONNTE_TOKEN = s.fonnte_token;
	if (!FONNTE_TOKEN) {
		console.error('[wa] FONNTE_TOKEN not set');
		return;
	}
	try {
		const res = await fetch('https://api.fonnte.com/send', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: FONNTE_TOKEN
			},
			body: JSON.stringify({ target, message })
		});
		console.log('[wa] fonnte', await res.json());
	} catch (e) {
		console.error('[wa] fonnte error', e);
	}
}

const toRad = (d) => (d * Math.PI) / 180;

export function haversineKm(a, b) {
	const R = 6371;
	const dLat = toRad(b.lat - a.lat);
	const dLng = toRad(b.lng - a.lng);
	const lat1 = toRad(a.lat);
	const lat2 = toRad(b.lat);
	const h =
		Math.sin(dLat / 2) ** 2 +
		Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
	return 2 * R * Math.asin(Math.sqrt(h));
}

export function estimatePickup(settings, userLoc) {
	const store = { lat: Number(settings.store_lat), lng: Number(settings.store_lng) };
	const radius = Number(settings.pickup_radius_km) || 0;
	const perKm = Number(settings.pickup_price_per_km) || 0;
	if (!store.lat || !store.lng || !userLoc) return null;
	const dist = haversineKm(store, userLoc);
	const billable = Math.max(0, dist - radius);
	const fee = Math.round(billable * perKm);
	return { distanceKm: dist, freeRadiusKm: radius, billableKm: billable, fee };
}
