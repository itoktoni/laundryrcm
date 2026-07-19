import { db } from '$lib/server/db.js';

let cache = null;
let cacheTime = 0;
const TTL = 5000;

export async function getSettings() {
	const now = Date.now();
	if (cache && now - cacheTime < TTL) return cache;
	const res = await db.execute('SELECT setting_key, setting_value FROM app_settings WHERE status IN (\'public\', \'private\')');
	cache = Object.fromEntries(res.rows.map((r) => [r.setting_key, r.setting_value]));
	cacheTime = now;
	return cache;
}

export async function getSetting(key, fallback = '') {
	const s = await getSettings();
	return s[key] ?? fallback;
}
