import { t as getSettings } from "../../../../../chunks/settings2.js";
import { a as summarizeBrand, i as sendTelegram, r as getBrandData, t as callAI } from "../../../../../chunks/ai.js";
import { json, text } from "@sveltejs/kit";
//#region src/lib/server/openwa.js
var BASE = process.env.OPENWA_URL || "http://100.81.90.140:2785/api";
async function getToken() {
	return (await getSettings()).wa_api_key || "";
}
async function getSessionId() {
	return (await getSettings()).wa_session_id || "";
}
async function openwaSendText(chatId, text) {
	const token = await getToken();
	if (!token) {
		console.error("[openwa] no token");
		return;
	}
	const sessionId = await getSessionId();
	try {
		const res = await fetch(`${BASE}/sessions/${sessionId}/messages/send-text`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"X-API-Key": token
			},
			body: JSON.stringify({
				chatId,
				text
			})
		});
		const json = await res.json().catch(() => ({}));
		console.log("[openwa] send", res.status, json?.messageId || "");
		return json;
	} catch (e) {
		console.error("[openwa] send error", e);
	}
}
//#endregion
//#region src/routes/api/wa/webhook/+server.js
async function GET({ url }) {
	const challenge = url.searchParams.get("hub.challenge") || url.searchParams.get("challenge") || "";
	if (challenge) return text(challenge);
	return text("ok");
}
async function POST({ request }) {
	const body = await request.json();
	console.log("[wa] webhook hit", JSON.stringify(body).slice(0, 300));
	const sender = body.sender || body.from || body.chatId || body.remote;
	const textMsg = body.body ?? body.message ?? body.text ?? body.caption ?? "";
	if (textMsg === "" && !body.location) return json({
		ok: true,
		ignored: "no message"
	});
	if (body.member || body.isGroup) return json({
		ok: true,
		ignored: "group"
	});
	const settings = await getSettings();
	const rawProvider = settings.provider || "whatsapp";
	const provider = rawProvider === "wa" ? "whatsapp" : rawProvider;
	const isProduction = provider === "whatsapp" || provider === "telegram";
	console.log("[wa] mode", {
		provider,
		isProduction,
		sender,
		textMsg
	});
	if (!sender || !textMsg) return json({
		ok: true,
		ignored: "no sender/text"
	});
	const reply = await callAI(textMsg, summarizeBrand(await getBrandData()));
	console.log("[wa] reply", reply?.slice(0, 80));
	if (isProduction) if (provider === "telegram") await sendTelegram(`💬 *Pesan Masuk:* "${textMsg}"\n\n🤖 *Jawaban AI:*\n${reply}`);
	else await openwaSendText(sender, reply);
	else {
		const report = `📊 *HASIL UJI COBA CHAT WA*\n\n👤 *Pengirim:* \`${sender}\`\n💬 *Pesan Masuk:* "${textMsg}"\n\n🤖 *Jawaban AI:*\n${reply}`;
		await sendTelegram(settings.telegram_user_id, report);
	}
	return json({
		ok: true,
		mode: isProduction ? "production" : "testing",
		provider
	});
}
//#endregion
export { GET, POST };
