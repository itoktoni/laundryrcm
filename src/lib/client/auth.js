/**
 * Client-side auth module for Capacitor SPA.
 * Handles login, register, and session management via localStorage + Turso HTTP API.
 */
import { dbExecute } from './db.js';

const SESSION_KEY = 'laundry_session';
const USER_KEY = 'laundry_user';

/**
 * Hash password using SHA-256 (same as server-side @oslojs/crypto)
 */
async function hashPassword(password) {
	const data = new TextEncoder().encode(password);
	const hashBuffer = await crypto.subtle.digest('SHA-256', data);
	const hashArray = new Uint8Array(hashBuffer);
	return Array.from(hashArray)
		.map((b) => b.toString(16).padStart(2, '0'))
		.join('');
}

/**
 * Generate a random session ID (base32)
 */
function generateId() {
	const bytes = new Uint8Array(20);
	crypto.getRandomValues(bytes);
	const alphabet = 'abcdefghijklmnopqrstuvwxyz234567';
	let result = '';
	for (let i = 0; i < bytes.length; i++) {
		result += alphabet[bytes[i] % 32];
	}
	return result;
}

/**
 * Login with email and password
 * @returns {{ success: boolean, error?: string, user?: object }}
 */
export async function login(email, password) {
	try {
		const result = await dbExecute(
			'SELECT user_id, user_name, user_email, user_password, user_role, user_status FROM users WHERE user_email = ?',
			[email]
		);

		if (result.rows.length === 0) {
			return { success: false, error: 'Email atau password salah' };
		}

		const user = result.rows[0];
		const hashed = await hashPassword(password);

		if (hashed !== user.user_password) {
			return { success: false, error: 'Email atau password salah' };
		}

		if (user.user_status === 'pending') {
			return { success: false, error: 'Akun Anda menunggu persetujuan Owner' };
		}

		if (user.user_status === 'rejected') {
			return { success: false, error: 'Akun Anda ditolak. Hubungi Owner.' };
		}

		// Create session
		const sessionId = generateId();
		const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

		await dbExecute(
			'INSERT INTO sessions (session_id, user_id, expires_at) VALUES (?, ?, ?)',
			[sessionId, user.user_id, expiresAt]
		);

		const userData = {
			id: user.user_id,
			name: user.user_name,
			email: user.user_email,
			role: user.user_role,
			status: user.user_status
		};

		// Store in localStorage
		localStorage.setItem(SESSION_KEY, sessionId);
		localStorage.setItem(USER_KEY, JSON.stringify(userData));

		return { success: true, user: userData };
	} catch (err) {
		console.error('[Auth] Login error:', err);
		return { success: false, error: 'Terjadi kesalahan. Coba lagi.' };
	}
}

/**
 * Register a new user
 * @returns {{ success: boolean, error?: string }}
 */
export async function register(name, email, password) {
	try {
		if (!name || !email || !password) {
			return { success: false, error: 'Semua field wahib diisi' };
		}

		if (password.length < 6) {
			return { success: false, error: 'Password minimal 6 karakter' };
		}

		// Check if email exists
		const existing = await dbExecute(
			'SELECT user_id FROM users WHERE user_email = ?',
			[email]
		);

		if (existing.rows.length > 0) {
			return { success: false, error: 'Email sudah terdaftar' };
		}

		// Create user
		const userId = generateId();
		const hashed = await hashPassword(password);

		await dbExecute(
			'INSERT INTO users (user_id, user_name, user_email, user_password, user_role, user_status) VALUES (?, ?, ?, ?, ?, ?)',
			[userId, name, email, hashed, 'staff', 'pending']
		);

		return { success: true };
	} catch (err) {
		console.error('[Auth] Register error:', err);
		return { success: false, error: 'Terjadi kesalahan. Coba lagi.' };
	}
}

/**
 * Get the current user from localStorage
 */
export function getCurrentUser() {
	try {
		const data = localStorage.getItem(USER_KEY);
		return data ? JSON.parse(data) : null;
	} catch {
		return null;
	}
}

/**
 * Get the current session ID
 */
export function getSessionId() {
	return localStorage.getItem(SESSION_KEY);
}

/**
 * Validate session against the database
 * @returns {Promise<object|null>} User object or null if invalid
 */
export async function validateSession() {
	const sessionId = getSessionId();
	if (!sessionId) return null;

	try {
		const result = await dbExecute(
			`SELECT s.session_id, s.expires_at, u.user_id, u.user_name, u.user_email, u.user_role, u.user_status 
			 FROM sessions s JOIN users u ON s.user_id = u.user_id 
			 WHERE s.session_id = ? AND s.expires_at > datetime('now')`,
			[sessionId]
		);

		if (result.rows.length === 0) {
			logout();
			return null;
		}

		const row = result.rows[0];
		if (row.user_status !== 'approved') {
			logout();
			return null;
		}

		const userData = {
			id: row.user_id,
			name: row.user_name,
			email: row.user_email,
			role: row.user_role,
			status: row.user_status
		};

		// Update localStorage
		localStorage.setItem(USER_KEY, JSON.stringify(userData));
		return userData;
	} catch (err) {
		console.error('[Auth] Session validation error:', err);
		// On network error, return cached user
		return getCurrentUser();
	}
}

/**
 * Logout - clear session
 */
export function logout() {
	localStorage.removeItem(SESSION_KEY);
	localStorage.removeItem(USER_KEY);
}
