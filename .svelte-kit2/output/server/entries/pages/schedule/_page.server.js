import { t as db } from "../../../chunks/db2.js";
//#region src/routes/schedule/+page.server.js
async function load() {
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
var actions = {
	updateSchedule: async ({ request }) => {
		const formData = await request.formData();
		const scheduleId = formData.get("schedule_id")?.toString();
		const enabled = formData.get("enabled") === "on" ? 1 : 0;
		const template = formData.get("template")?.toString().trim();
		const daysThreshold = formData.get("days_threshold") ? parseInt(formData.get("days_threshold")) : null;
		if (!scheduleId) return { error: "Schedule ID missing" };
		await db.execute({
			sql: `UPDATE whatsapp_schedules
				SET schedule_enabled = ?, schedule_template = ?, schedule_days_threshold = ?, schedule_updated_at = ?
				WHERE schedule_id = ?`,
			args: [
				enabled,
				template,
				daysThreshold,
				(/* @__PURE__ */ new Date()).toISOString(),
				scheduleId
			]
		});
		return { success: true };
	},
	testSchedule: async ({ request }) => {
		const scheduleType = (await request.formData()).get("schedule_type")?.toString();
		if (!scheduleType) return { error: "Schedule type missing" };
		const webhookKey = (await db.execute({
			sql: "SELECT setting_value FROM app_settings WHERE setting_key = ?",
			args: ["webhook_schedule_key"]
		})).rows[0]?.setting_value || "";
		try {
			return {
				success: true,
				result: await (await fetch("http://localhost:5173/api/webhook/schedule", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"Authorization": `Bearer ${webhookKey}`
					},
					body: JSON.stringify({ schedule_type: scheduleType })
				})).json()
			};
		} catch (err) {
			return { error: err.message };
		}
	},
	saveWebhookKey: async ({ request }) => {
		const key = (await request.formData()).get("webhook_key")?.toString().trim();
		if (!key) return { error: "Webhook key required" };
		await db.execute({
			sql: `INSERT INTO app_settings (setting_key, setting_value, setting_updated_at)
				VALUES (?, ?, ?)
				ON CONFLICT(setting_key) DO UPDATE SET setting_value = ?, setting_updated_at = ?`,
			args: [
				"webhook_schedule_key",
				key,
				(/* @__PURE__ */ new Date()).toISOString(),
				key,
				(/* @__PURE__ */ new Date()).toISOString()
			]
		});
		return { success: true };
	}
};
//#endregion
export { actions, load };
