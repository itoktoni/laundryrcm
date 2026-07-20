import { validateSession, getSessionId } from '$lib/server/auth.js';

const publicRoutes = ['/login', '/register', '/api/wa/webhook', '/api/telegram/webhook', '/api/telegram/setwebhook', '/api/webhook', '/api/ai'];

export async function handle({ event, resolve }) {
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
	const isPublic = publicRoutes.some((r) => path.startsWith(r)) || path === '/';

	if (!isPublic && !event.locals.user) {
		return new Response(null, {
			status: 302,
			headers: { location: '/login' }
		});
	}

	if (event.locals.user && (path === '/login' || path === '/register')) {
		return new Response(null, {
			status: 302,
			headers: { location: '/dashboard' }
		});
	}

	return resolve(event);
}
