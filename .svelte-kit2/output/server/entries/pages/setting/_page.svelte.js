import { C as attr, a as ensure_array_like, i as derived, o as head, t as attr_class, w as escape_html } from "../../../chunks/server.js";
import "../../../chunks/forms.js";
import "../../../chunks/toast.js";
//#region src/routes/setting/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data, form } = $$props;
		let activeTab = "toko";
		function label(key) {
			return key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
		}
		function category(key) {
			if (key.startsWith("laundry_") || key.startsWith("store_") || key === "open_hours" || key.startsWith("pickup_")) return "toko";
			if (key.startsWith("ai_") || key.startsWith("qris") || key.startsWith("fonnte") || key.startsWith("telegram_") || key.startsWith("wa_") || key === "provider") return "integrasi";
			if (key.startsWith("webhook_")) return "webhook";
			if (key.startsWith("printer_")) return "printer";
			if (key.startsWith("crm_")) return "crm";
			return "lainnya";
		}
		const tabs = [
			{
				id: "toko",
				label: "Toko"
			},
			{
				id: "integrasi",
				label: "Integrasi"
			},
			{
				id: "webhook",
				label: "Webhook"
			},
			{
				id: "printer",
				label: "Printer"
			},
			{
				id: "crm",
				label: "CRM"
			},
			{
				id: "lainnya",
				label: "Lainnya"
			}
		];
		const grouped = derived(() => data.settings.reduce((acc, s) => {
			const c = category(s.setting_key);
			(acc[c] ||= []).push(s);
			return acc;
		}, {}));
		head("1qghcj7", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Pengaturan - LaundryKu</title>`);
			});
		});
		$$renderer.push(`<div class="space-y-stack-lg"><div class="flex items-center justify-between"><div><h1 class="font-headline-lg text-headline-lg text-on-surface">Pengaturan</h1> <p class="text-body-sm text-on-surface-variant">Konfigurasi data laundry</p></div> <button class="px-4 h-11 bg-surface-container-high text-on-surface rounded-lg font-bold text-label-md active:scale-95 transition-transform">${escape_html("+ Setting")}</button></div> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (form?.error) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<p class="text-body-sm text-error">${escape_html(form.error)}</p>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <div class="flex gap-1 border-b border-outline-variant overflow-x-auto"><!--[-->`);
		const each_array = ensure_array_like(tabs);
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let t = each_array[$$index];
			if (grouped()[t.id]?.length) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<button${attr_class(`px-4 h-11 whitespace-nowrap text-label-md font-bold transition-colors ${activeTab === t.id ? "text-primary border-b-2 border-primary" : "text-on-surface-variant hover:text-on-surface"}`)}>${escape_html(t.label)}</button>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]-->`);
		}
		$$renderer.push(`<!--]--></div> <form method="POST" action="?/save" class="bg-surface-container-lowest p-stack-md rounded-xl border border-outline-variant space-y-4">`);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (grouped()[activeTab]?.length) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<!--[-->`);
			const each_array_1 = ensure_array_like(grouped()[activeTab]);
			for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
				let s = each_array_1[$$index_1];
				$$renderer.push(`<div><div class="flex items-center justify-between mb-1"><label${attr("for", s.setting_key)} class="text-label-md text-on-surface-variant">${escape_html(label(s.setting_key))}</label> <div class="flex items-center gap-2">`);
				if (s.status === "private") {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<span class="text-[11px] px-1.5 py-0.5 rounded bg-error-container text-error">private</span>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--> `);
				if (s.mandatory !== 1) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<button type="button" class="text-outline hover:text-error transition-colors" aria-label="Hapus setting"><span class="material-symbols-outlined text-[16px]">delete</span></button>`);
				} else {
					$$renderer.push("<!--[-1-->");
					$$renderer.push(`<span class="text-[11px] text-on-surface-variant">wajib</span>`);
				}
				$$renderer.push(`<!--]--></div></div> <input${attr("id", s.setting_key)}${attr("name", `setting__${s.setting_key}`)}${attr("value", s.setting_value ?? "")} class="w-full h-11 px-4 bg-surface-container-low border border-outline-variant rounded-lg text-body-sm"/> `);
				if (s.setting_key === "provider") {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<p class="text-[11px] text-on-surface-variant mt-1">Nilai: <code>telegram</code> (balas ke Telegram), <code>whatsapp</code> / <code>wa</code> (balas ke Fonnte), lainnya = mode testing (laporan ke admin).</p>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--> `);
				if (s.setting_key === "crm_inactive_days") {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<p class="text-[11px] text-on-surface-variant mt-1">Pelanggan dianggap tidak aktif setelah X hari tanpa order. Default: 7 hari.</p>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--> `);
				if (s.setting_key === "crm_pending_pickup_days") {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<p class="text-[11px] text-on-surface-variant mt-1">Pengingat di kirim setelah X hari pesanan selesai tapi belum diambil. Default: 3 hari.</p>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--> `);
				if (s.setting_key === "crm_auto_reminder") {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<p class="text-[11px] text-on-surface-variant mt-1">1 = aktif, 0 = nonaktif. Otomatisasi pengingat via WhatsApp.</p>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--> `);
				if (s.setting_key === "crm_reminder_template_inactive") {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<textarea${attr("id", s.setting_key)}${attr("name", `setting__${s.setting_key}`)} rows="3" class="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg text-body-sm">`);
					const $$body = escape_html(s.setting_value ?? "");
					if ($$body) $$renderer.push(`${$$body}`);
					$$renderer.push(`</textarea> <p class="text-[11px] text-on-surface-variant mt-1">Placeholder: <code>{customer_name}</code>, <code>{days}</code></p>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--> `);
				if (s.setting_key === "crm_reminder_template_pending") {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<textarea${attr("id", s.setting_key)}${attr("name", `setting__${s.setting_key}`)} rows="3" class="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg text-body-sm">`);
					const $$body_1 = escape_html(s.setting_value ?? "");
					if ($$body_1) $$renderer.push(`${$$body_1}`);
					$$renderer.push(`</textarea> <p class="text-[11px] text-on-surface-variant mt-1">Placeholder: <code>{customer_name}</code>, <code>{order_id}</code>, <code>{days}</code></p>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></div>`);
			}
			$$renderer.push(`<!--]--> <button type="submit" class="w-full h-11 bg-primary text-on-primary rounded-lg font-bold text-label-md active:scale-[0.98] transition-transform">Simpan ${escape_html(tabs.find((t) => t.id === activeTab)?.label)}</button>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<p class="text-body-sm text-on-surface-variant text-center py-4">Belum ada pengaturan</p>`);
		}
		$$renderer.push(`<!--]--></form></div>`);
	});
}
//#endregion
export { _page as default };
