import { json } from '@sveltejs/kit';
import { getSettings } from '$lib/server/settings.js';

export async function POST() {
	const s = await getSettings();
	const base = (s.webhook || '').replace(/\/+$/, '');
	const token = s.telegram_bot_token;
	if (!base || !token) {
		return json({ error: 'webhook atau telegram_bot_token belum diatur' }, { status: 400 });
	}
	const url = `${base}/api/telegram/webhook`;
	const res = await fetch(`https://api.telegram.org/bot${token}/setWebhook?url=${encodeURIComponent(url)}`, { method: 'POST' });
	const data = await res.json();
	return json({ url, data });
}
