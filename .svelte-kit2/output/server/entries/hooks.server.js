import { c as validateSession, i as getSessionId } from "../chunks/auth.js";
//#region src/hooks.server.js
var publicRoutes = [
	"/login",
	"/register",
	"/api/wa/webhook",
	"/api/telegram/webhook",
	"/api/telegram/setwebhook",
	"/api/webhook",
	"/api/webhook/schedule",
	"/api/ai"
];
async function handle({ event, resolve }) {
	const sessionId = getSessionId(event.cookies);
	const session = sessionId ? await validateSession(sessionId) : null;
	if (session) {
		event.locals.user = session.user;
		event.locals.sessionId = session.sessionId;
	} else {
		event.locals.user = null;
		event.locals.sessionId = null;
	}
	const path = event.url.pathname;
	if (!(publicRoutes.some((r) => path.startsWith(r)) || path === "/") && !event.locals.user) return new Response(null, {
		status: 302,
		headers: { location: "/login" }
	});
	if (event.locals.user && (path === "/login" || path === "/register")) return new Response(null, {
		status: 302,
		headers: { location: "/dashboard" }
	});
	return resolve(event);
}
//#endregion
export { handle };
