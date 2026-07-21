import { db } from '$lib/server/db.js';

export async function load() {
	const schedules = await db.execute(`
		SELECT * FROM whatsapp_schedules ORDER BY schedule_type
	`);

	const logs = await db.execute(`
		SELECT l.*, s.schedule_type, s.schedule_name
		FROM whatsapp_schedule_logs l
		JOIN whatsapp_schedules s ON l.schedule_id = s.schedule_id
		ORDER BY l.log_created_at DESC LIMIT 50
	`);

	return {
		schedules: schedules.rows,
		logs: logs.rows
	};
}

export const actions = {
	updateSchedule: async ({ request }) => {
		const formData = await request.formData();
		const scheduleId = formData.get('schedule_id')?.toString();
		const enabled = formData.get('enabled') === 'on' ? 1 : 0;
		const template = formData.get('template')?.toString().trim();
		const daysThreshold = formData.get('days_threshold') ? parseInt(formData.get('days_threshold')) : null;

		if (!scheduleId) {
			return { error: 'Schedule ID missing' };
		}

		await db.execute({
			sql: `UPDATE whatsapp_schedules
				SET schedule_enabled = ?, schedule_template = ?, schedule_days_threshold = ?, schedule_updated_at = ?
				WHERE schedule_id = ?`,
			args: [enabled, template, daysThreshold, new Date().toISOString(), scheduleId]
		});

		return { success: true };
	},

	testSchedule: async ({ request }) => {
		const formData = await request.formData();
		const scheduleType = formData.get('schedule_type')?.toString();

		if (!scheduleType) {
			return { error: 'Schedule type missing' };
		}

		// Get webhook key from settings
		const settings = await db.execute({
			sql: 'SELECT setting_value FROM app_settings WHERE setting_key = ?',
			args: ['webhook_schedule_key']
		});

		const webhookKey = settings.rows[0]?.setting_value || '';

		// Call the webhook
		try {
			const res = await fetch('http://localhost:5173/api/webhook/schedule', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${webhookKey}`
				},
				body: JSON.stringify({ schedule_type: scheduleType })
			});

			const data = await res.json();
			return { success: true, result: data };
		} catch (err) {
			return { error: err.message };
		}
	},

	saveWebhookKey: async ({ request }) => {
		const formData = await request.formData();
		const key = formData.get('webhook_key')?.toString().trim();

		if (!key) {
			return { error: 'Webhook key required' };
		}

		await db.execute({
			sql: `INSERT INTO app_settings (setting_key, setting_value, setting_updated_at)
				VALUES (?, ?, ?)
				ON CONFLICT(setting_key) DO UPDATE SET setting_value = ?, setting_updated_at = ?`,
			args: ['webhook_schedule_key', key, new Date().toISOString(), key, new Date().toISOString()]
		});

		return { success: true };
	}
};