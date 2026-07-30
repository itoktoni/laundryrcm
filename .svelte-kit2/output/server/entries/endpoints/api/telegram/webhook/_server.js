import { a as summarizeBrand, i as sendTelegram, n as estimatePickup, r as getBrandData, t as callAI } from "../../../../../chunks/ai.js";
import { json } from "@sveltejs/kit";
//#region src/routes/api/telegram/webhook/+server.js
async function POST({ request }) {
	const update = await request.json();
	console.log("[tg] update", JSON.stringify(update).slice(0, 200));
	const message = update.message;
	if (!message) return json({
		ok: true,
		ignored: "no message"
	});
	const chatId = message.chat.id;
	if (message.location) {
		const brandData = await getBrandData();
		const est = estimatePickup(Object.fromEntries(brandData.app_settings.map((s) => [s.key, s.value])), {
			lat: message.location.latitude,
			lng: message.location.longitude
		});
		if (est) await sendTelegram(chatId, `📍 *Estimasi Antar-Jemput*\n\nJarak ke laundry: ${est.distanceKm.toFixed(2)} km\nRadius gratis: ${est.freeRadiusKm} km\nDijemput dari: ${est.billableKm.toFixed(2)} km\nOngkos: Rp${est.fee.toLocaleString("id-ID")}`);
		else await sendTelegram(chatId, "Maaf, lokasi laundry belum diatur.");
		return json({ ok: true });
	}
	if (!message.text) return json({
		ok: true,
		ignored: "no text"
	});
	const text = message.text;
	console.log("[tg] chat", {
		chatId,
		text
	});
	if (text.startsWith("/start")) {
		await sendTelegram(chatId, "Halo! Saya asisten virtual laundry. Ada yang bisa dibantu?");
		return json({ ok: true });
	}
	const reply = await callAI(text, summarizeBrand(await getBrandData()));
	console.log("[tg] reply", reply?.slice(0, 80));
	await sendTelegram(chatId, reply);
	return json({ ok: true });
}
//#endregion
export { POST };
