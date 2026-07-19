import { json, text } from '@sveltejs/kit';
import { getSettings } from '$lib/server/settings.js';
import { callAI, getBrandData, summarizeBrand, sendTelegram } from '$lib/server/ai.js';
import { openwaSendText as sendOpenWA } from '$lib/server/openwa.js';

export async function GET({ url }) {
	const challenge = url.searchParams.get('hub.challenge') || url.searchParams.get('challenge') || '';
	if (challenge) return text(challenge);
	return text('ok');
}

export async function POST({ request }) {
	const body = await request.json();
	console.log('[wa] webhook hit', JSON.stringify(body).slice(0, 300));

	const sender = body.sender || body.from || body.chatId || body.remote;
	const textMsg = body.body ?? body.message ?? body.text ?? body.caption ?? '';
	if (textMsg === '' && !body.location) return json({ ok: true, ignored: 'no message' });
	if (body.member || body.isGroup) return json({ ok: true, ignored: 'group' });

	const settings = await getSettings();
	const rawProvider = settings.provider || 'whatsapp';
	const provider = rawProvider === 'wa' ? 'whatsapp' : rawProvider;
	const isProduction = provider === 'whatsapp' || provider === 'telegram';
	console.log('[wa] mode', { provider, isProduction, sender, textMsg });

	if (!sender || !textMsg) return json({ ok: true, ignored: 'no sender/text' });

	const brandData = await getBrandData();
	const brandDoc = summarizeBrand(brandData);
	const reply = await callAI(textMsg, brandDoc);
	console.log('[wa] reply', reply?.slice(0, 80));

	if (isProduction) {
		if (provider === 'telegram') {
			await sendTelegram(`💬 *Pesan Masuk:* "${textMsg}"\n\n🤖 *Jawaban AI:*\n${reply}`);
		} else {
			await sendOpenWA(sender, reply);
		}
	} else {
		const report =
			`📊 *HASIL UJI COBA CHAT WA*\n\n` +
			`👤 *Pengirim:* \`${sender}\`\n` +
			`💬 *Pesan Masuk:* "${textMsg}"\n\n` +
			`🤖 *Jawaban AI:*\n${reply}`;
		await sendTelegram(settings.telegram_user_id, report);
	}

	return json({ ok: true, mode: isProduction ? 'production' : 'testing', provider });
}
