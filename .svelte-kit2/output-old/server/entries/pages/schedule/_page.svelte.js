import { C as escape_html, S as attr, c as stringify, i as ensure_array_like, r as derived, t as attr_class } from "../../../chunks/server.js";
import "../../../chunks/forms.js";
//#region src/routes/schedule/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data, form } = $$props;
		let selectedSchedule = null;
		derived(() => data.schedules.find((s) => s.schedule_id === selectedSchedule) || null);
		const typeColors = {
			pending_pickup: "bg-blue-50 border-blue-200",
			inactive_customer: "bg-yellow-50 border-yellow-200",
			low_stock: "bg-red-50 border-red-200",
			machine_service: "bg-purple-50 border-purple-200",
			ready_delivery: "bg-green-50 border-green-200"
		};
		const typeIcons = {
			pending_pickup: "📦",
			inactive_customer: "👤",
			low_stock: "⚠️",
			machine_service: "🔧",
			ready_delivery: "🚚"
		};
		$$renderer.push(`<div class="min-h-screen bg-surface p-6"><div class="max-w-6xl mx-auto"><div class="mb-8"><h1 class="text-3xl font-bold text-on-surface mb-2">WhatsApp Pengiriman Terjadwal</h1> <p class="text-on-surface-variant">Kelola notifikasi otomatis WhatsApp untuk berbagai kondisi laundry</p></div> <div class="bg-surface-container-lowest rounded-lg border border-outline-variant p-6 mb-6"><h2 class="text-lg font-semibold text-on-surface mb-4">Konfigurasi Webhook</h2> <form method="POST" action="?/saveWebhookKey" class="flex gap-2"><input type="password" name="webhook_key" placeholder="Masukkan webhook key untuk cron-job.org" class="flex-1 px-4 py-2 border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-surface-container-lowest text-on-surface"/> <button type="submit" class="px-6 py-2 bg-primary text-on-primary rounded-lg hover:opacity-90">Simpan Key</button></form> <p class="text-sm text-on-surface-variant mt-3">URL Webhook: <code class="bg-surface-container-high px-2 py-1 rounded">https://yourdomain.com/api/webhook/schedule</code></p></div> <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"><!--[-->`);
		const each_array = ensure_array_like(data.schedules);
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let schedule = each_array[$$index];
			$$renderer.push(`<div${attr_class(`bg-surface-container-lowest rounded-lg border ${stringify(typeColors[schedule.schedule_type])} p-6`)}><div class="flex items-start justify-between mb-4"><div><div class="text-3xl mb-2">${escape_html(typeIcons[schedule.schedule_type])}</div> <h3 class="text-lg font-semibold text-on-surface">${escape_html(schedule.schedule_name)}</h3> <p class="text-sm text-on-surface-variant mt-1">${escape_html(schedule.schedule_description)}</p></div> <form method="POST" action="?/updateSchedule"><input type="hidden" name="schedule_id"${attr("value", schedule.schedule_id)}/> <label class="flex items-center gap-2 cursor-pointer"><input type="checkbox" name="enabled"${attr("checked", schedule.schedule_enabled === 1, true)} class="w-4 h-4 rounded"/> <span class="text-sm text-on-surface-variant">${escape_html(schedule.schedule_enabled ? "Aktif" : "Nonaktif")}</span></label></form></div> <form method="POST" action="?/updateSchedule" class="mb-4"><input type="hidden" name="schedule_id"${attr("value", schedule.schedule_id)}/> <label class="text-sm font-medium text-on-surface block mb-2">Template Pesan</label> <textarea name="template" placeholder="Template WhatsApp message" rows="3" class="w-full px-3 py-2 border border-outline-variant rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-surface-container-lowest text-on-surface font-mono">`);
			const $$body = escape_html(schedule.schedule_template || "");
			if ($$body) $$renderer.push(`${$$body}`);
			$$renderer.push(`</textarea> <p class="text-xs text-on-surface-variant mt-1">Gunakan: {{customer_name}} {{item_name}} {{current_qty}} {{min_qty}} dll</p> <button type="submit" class="mt-2 px-3 py-1 bg-surface-container-high text-on-surface rounded text-xs hover:bg-surface-container-higher">Simpan Template</button></form> <div class="grid grid-cols-2 gap-2 text-xs text-on-surface-variant mb-4">`);
			if (schedule.schedule_last_success) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="flex items-center gap-1"><span>✓</span> <span>Last: ${escape_html(new Date(schedule.schedule_last_success).toLocaleDateString())}</span></div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			if (schedule.schedule_last_error) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="flex items-center gap-1 text-red-600"><span>✗</span> <span>Error: ${escape_html(schedule.schedule_last_error)}</span></div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div> <form method="POST" action="?/testSchedule" class="flex gap-2"><input type="hidden" name="schedule_type"${attr("value", schedule.schedule_type)}/> <button type="submit" class="flex-1 px-3 py-2 bg-success text-white rounded-lg hover:opacity-90 text-sm font-medium">Test Now</button></form></div>`);
		}
		$$renderer.push(`<!--]--></div> <div class="bg-surface-container-lowest rounded-lg border border-outline-variant p-6"><h2 class="text-lg font-semibold text-on-surface mb-4">Execution Logs</h2> <div class="overflow-x-auto"><table class="w-full text-sm"><thead class="bg-surface-container-high border-b border-outline-variant"><tr><th class="text-left px-4 py-2 text-on-surface-variant">Schedule</th><th class="text-left px-4 py-2 text-on-surface-variant">Status</th><th class="text-left px-4 py-2 text-on-surface-variant">Messages</th><th class="text-left px-4 py-2 text-on-surface-variant">Time</th></tr></thead><tbody><!--[-->`);
		const each_array_1 = ensure_array_like(data.logs);
		for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
			let log = each_array_1[$$index_1];
			$$renderer.push(`<tr class="border-b border-outline-variant/50 hover:bg-surface-container-low"><td class="px-4 py-2 font-medium text-on-surface">${escape_html(log.schedule_name)}</td><td class="px-4 py-2"><span${attr_class(`px-2 py-1 rounded text-xs font-medium ${log.log_status === "success" ? "bg-success-container text-success" : "bg-error-container text-error"}`)}>${escape_html(log.log_status)}</span></td><td class="px-4 py-2 text-on-surface">${escape_html(log.log_message_count)}</td><td class="px-4 py-2 text-on-surface-variant">${escape_html(new Date(log.log_created_at).toLocaleString())}</td></tr>`);
		}
		$$renderer.push(`<!--]--></tbody></table></div></div></div></div>`);
	});
}
//#endregion
export { _page as default };
