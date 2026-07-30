import { t as getSettings } from "../../../../../chunks/settings2.js";
import { json } from "@sveltejs/kit";
//#region src/routes/api/telegram/setwebhook/+server.js
async function POST() {
	const s = await getSettings();
	const base = (s.webhook || "").replace(/\/+$/, "");
	const token = s.telegram_bot_token;
	if (!base || !token) return json({ error: "webhook atau telegram_bot_token belum diatur" }, { status: 400 });
	const url = `${base}/api/telegram/webhook`;
	return json({
		url,
		data: await (await fetch(`https://api.telegram.org/bot${token}/setWebhook?url=${encodeURIComponent(url)}`, { method: "POST" })).json()
	});
}
//#endregion
export { POST };
