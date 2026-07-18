import { db } from './db.js';
import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from '@oslojs/encoding';
import { sha256 } from '@oslojs/crypto/sha2';

const SESSION_COOKIE = 'session';

export function generateId() {
	const bytes = new Uint8Array(20);
	crypto.getRandomValues(bytes);
	return encodeBase32LowerCaseNoPadding(bytes);
}

export async function hashPassword(password) {
	const data = new TextEncoder().encode(password);
	const hash = sha256(data);
	return encodeHexLowerCase(hash);
}

export async function verifyPassword(password, hash) {
	const hashed = await hashPassword(password);
	return hashed === hash;
}

export async function createSession(userId) {
	const sessionId = generateId();
	const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

	await db.execute({
		sql: 'INSERT INTO sessions (session_id, user_id, expires_at) VALUES (?, ?, ?)',
		args: [sessionId, userId, expiresAt.toISOString()]
	});

	return { id: sessionId, expiresAt };
}

export async function validateSession(sessionId) {
	if (!sessionId) return null;

	const result = await db.execute({
		sql: `SELECT s.*, u.user_id, u.user_name, u.user_email, u.user_role FROM sessions s JOIN users u ON s.user_id = u.user_id WHERE s.session_id = ? AND s.expires_at > datetime('now')`,
		args: [sessionId]
	});

	if (result.rows.length === 0) return null;

	const row = result.rows[0];
	return {
		sessionId: row.session_id,
		user: {
			id: row.user_id,
			name: row.user_name,
			email: row.user_email,
			role: row.user_role
		}
	};
}

export async function invalidateSession(sessionId) {
	await db.execute({
		sql: 'DELETE FROM sessions WHERE session_id = ?',
		args: [sessionId]
	});
}

export function setSessionCookie(cookies, sessionId, expiresAt) {
	cookies.set(SESSION_COOKIE, sessionId, {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		expires: expiresAt
	});
}

export function deleteSessionCookie(cookies) {
	cookies.delete(SESSION_COOKIE, { path: '/' });
}

export function getSessionId(cookies) {
	return cookies.get(SESSION_COOKIE);
}
