import { invalidateSession, getSessionId, deleteSessionCookie } from '$lib/server/auth.js';
import { redirect } from '@sveltejs/kit';

export const actions = {
	default: async ({ cookies }) => {
		const sessionId = getSessionId(cookies);
		if (sessionId) {
			await invalidateSession(sessionId);
		}
		deleteSessionCookie(cookies);
		throw redirect(302, '/login');
	}
};
