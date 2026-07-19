import { getSettings } from '$lib/server/settings.js';

const BASE = process.env.OPENWA_URL || 'http://100.81.90.140:2785/api';

async function getToken() {
	const s = await getSettings();
	return s.wa_api_key || '';
}

async function getSessionId() {
	const s = await getSettings();
	return s.wa_session_id || '';
}

export async function openwaSendText(chatId, text) {
	const token = await getToken();
	if (!token) {
		console.error('[openwa] no token');
		return;
	}
	const sessionId = await getSessionId();
	try {
		const res = await fetch(`${BASE}/sessions/${sessionId}/messages/send-text`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json', 'X-API-Key': token },
			body: JSON.stringify({ chatId, text })
		});
		const json = await res.json().catch(() => ({}));
		console.log('[openwa] send', res.status, json?.messageId || '');
		return json;
	} catch (e) {
		console.error('[openwa] send error', e);
	}
}

export async function openwaSetWebhook(url) {
	const token = await getToken();
	if (!token) return console.error('[openwa] no token');
	try {
		const res = await fetch(`${BASE}/webhooks`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json', 'X-API-Key': token },
			body: JSON.stringify({ url, events: ['message.received'], retryCount: 3 })
		});
		console.log('[openwa] setWebhook', res.status, await res.text());
	} catch (e) {
		console.error('[openwa] setWebhook error', e);
	}
}
