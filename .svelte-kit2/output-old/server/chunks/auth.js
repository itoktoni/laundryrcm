import { t as db } from "./db2.js";
import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";
//#region src/lib/server/auth.js
var SESSION_COOKIE = "session";
function generateId() {
	const bytes = /* @__PURE__ */ new Uint8Array(20);
	crypto.getRandomValues(bytes);
	return encodeBase32LowerCaseNoPadding(bytes);
}
async function hashPassword(password) {
	return encodeHexLowerCase(sha256(new TextEncoder().encode(password)));
}
async function createSession(userId) {
	const sessionId = generateId();
	const expiresAt = new Date(Date.now() + 720 * 60 * 60 * 1e3);
	await db.execute({
		sql: "INSERT INTO sessions (session_id, user_id, expires_at) VALUES (?, ?, ?)",
		args: [
			sessionId,
			userId,
			expiresAt.toISOString()
		]
	});
	return {
		id: sessionId,
		expiresAt
	};
}
async function validateSession(sessionId) {
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
async function invalidateSession(sessionId) {
	await db.execute({
		sql: "DELETE FROM sessions WHERE session_id = ?",
		args: [sessionId]
	});
}
function setSessionCookie(cookies, sessionId, expiresAt) {
	cookies.set(SESSION_COOKIE, sessionId, {
		path: "/",
		httpOnly: true,
		sameSite: "lax",
		expires: expiresAt
	});
}
function deleteSessionCookie(cookies) {
	cookies.delete(SESSION_COOKIE, { path: "/" });
}
function getSessionId(cookies) {
	return cookies.get(SESSION_COOKIE);
}
//#endregion
export { hashPassword as a, validateSession as c, getSessionId as i, deleteSessionCookie as n, invalidateSession as o, generateId as r, setSessionCookie as s, createSession as t };
