import { json } from '@sveltejs/kit';
import { callAI, getBrandData, summarizeBrand, sendTelegram, estimatePickup } from '$lib/server/ai.js';

export async function POST({ request }) {
	const update = await request.json();
	console.log('[tg] update', JSON.stringify(update).slice(0, 200));

	const message = update.message;
	if (!message) {
		return json({ ok: true, ignored: 'no message' });
	}

	const chatId = message.chat.id;

	if (message.location) {
		const brandData = await getBrandData();
		const settings = Object.fromEntries(brandData.app_settings.map((s) => [s.key, s.value]));
		const est = estimatePickup(settings, {
			lat: message.location.latitude,
			lng: message.location.longitude
		});
		if (est) {
			const text =
				`📍 *Estimasi Antar-Jemput*\n\n` +
				`Jarak ke laundry: ${est.distanceKm.toFixed(2)} km\n` +
				`Radius gratis: ${est.freeRadiusKm} km\n` +
				`Dijemput dari: ${est.billableKm.toFixed(2)} km\n` +
				`Ongkos: Rp${est.fee.toLocaleString('id-ID')}`;
			await sendTelegram(chatId, text);
		} else {
			await sendTelegram(chatId, 'Maaf, lokasi laundry belum diatur.');
		}
		return json({ ok: true });
	}

	if (!message.text) {
		return json({ ok: true, ignored: 'no text' });
	}

	const text = message.text;
	console.log('[tg] chat', { chatId, text });

	if (text.startsWith('/start')) {
		await sendTelegram(chatId, 'Halo! Saya asisten virtual laundry. Ada yang bisa dibantu?');
		return json({ ok: true });
	}

	const brandData = await getBrandData();
	const brandDoc = summarizeBrand(brandData);
	const reply = await callAI(text, brandDoc);
	console.log('[tg] reply', reply?.slice(0, 80));

	await sendTelegram(chatId, reply);

	return json({ ok: true });
}
