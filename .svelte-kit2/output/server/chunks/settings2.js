import { t as db } from "./db2.js";
//#region src/lib/server/settings.js
var cache = null;
var cacheTime = 0;
var TTL = 5e3;
async function getSettings() {
	const now = Date.now();
	if (cache && now - cacheTime < TTL) return cache;
	const res = await db.execute("SELECT setting_key, setting_value FROM app_settings WHERE status IN ('public', 'private')");
	cache = Object.fromEntries(res.rows.map((r) => [r.setting_key, r.setting_value]));
	cacheTime = now;
	return cache;
}
//#endregion
export { getSettings as t };
