import { i as getSessionId, n as deleteSessionCookie, o as invalidateSession } from "../../../chunks/auth.js";
import { redirect } from "@sveltejs/kit";
//#region src/routes/logout/+page.server.js
var actions = { default: async ({ cookies }) => {
	const sessionId = getSessionId(cookies);
	if (sessionId) await invalidateSession(sessionId);
	deleteSessionCookie(cookies);
	throw redirect(302, "/login");
} };
//#endregion
export { actions };
