import { C as attr, a as ensure_array_like, o as head, t as attr_class, w as escape_html } from "../../../chunks/server.js";
//#region src/routes/reports_attendance/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data } = $$props;
		let start = data.filters.start || "";
		let end = data.filters.end || "";
		const days = [
			"Min",
			"Sen",
			"Sel",
			"Rab",
			"Kam",
			"Jum",
			"Sab"
		];
		head("17rq1sc", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Laporan Absensi - LaundryKu</title>`);
			});
		});
		$$renderer.push(`<div class="space-y-stack-lg"><div class="flex items-center justify-between"><div><h1 class="font-headline-lg text-headline-lg text-on-surface">Laporan Absensi</h1> <p class="text-body-sm text-on-surface-variant">Rekap kehadiran staff</p></div> <button class="inline-flex h-10 items-center gap-1 px-3 rounded-full bg-primary text-on-primary text-label-md font-medium active:scale-95 transition-transform"><span class="material-symbols-outlined text-[18px]">download</span> CSV</button></div> <div class="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 form-card"><h3 class="font-label-md text-label-md text-on-surface pb-3 mb-3 border-b border-outline-variant flex items-center gap-2"><span class="material-symbols-outlined text-primary text-xl">filter_alt</span> Filter Periode</h3> <div class="flex gap-2 overflow-x-auto pb-2"><!--[-->`);
		const each_array = ensure_array_like([
			"today",
			"week",
			"month"
		]);
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let period = each_array[$$index];
			$$renderer.push(`<button${attr_class(`whitespace-nowrap rounded-full px-4 py-1.5 text-label-md font-medium ${data.filters.period === period ? "bg-primary text-on-primary" : "bg-surface-container-high text-on-surface-variant"}`)}>${escape_html(period === "today" ? "Hari Ini" : period === "week" ? "Minggu Ini" : "Bulan Ini")}</button>`);
		}
		$$renderer.push(`<!--]--> <button${attr_class(`whitespace-nowrap rounded-full px-4 py-1.5 text-label-md font-medium ${data.filters.period === "custom" ? "bg-primary text-on-primary" : "bg-surface-container-high text-on-surface-variant"}`)}>Custom</button></div> `);
		if (data.filters.period === "custom") {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end"><div class="flex-1"><label class="mb-1 block text-label-sm text-on-surface-variant">Tanggal Mulai</label> <input type="date"${attr("value", start)} class="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-body-sm text-on-surface"/></div> <div class="flex-1"><label class="mb-1 block text-label-sm text-on-surface-variant">Tanggal Akhir</label> <input type="date"${attr("value", end)} class="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-body-sm text-on-surface"/></div> <button class="h-10 px-6 bg-primary text-on-primary rounded-lg font-bold text-label-md active:scale-95 transition-transform">Terapkan</button></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <div class="mt-3 pt-3 border-t border-outline-variant"><label class="mb-1 block text-label-sm text-on-surface-variant">Filter Staff</label> <select class="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-body-sm text-on-surface">`);
		$$renderer.option({ value: "" }, ($$renderer) => {
			$$renderer.push(`Semua Staff`);
		});
		$$renderer.push(`<!--[-->`);
		const each_array_1 = ensure_array_like(data.users);
		for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
			let u = each_array_1[$$index_1];
			$$renderer.option({
				value: u.user_id,
				selected: data.filters.userId === u.user_id
			}, ($$renderer) => {
				$$renderer.push(`${escape_html(u.user_name)}`);
			});
		}
		$$renderer.push(`<!--]--></select></div></div> <div class="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 form-card"><h3 class="font-label-md text-label-md text-on-surface pb-3 mb-3 border-b border-outline-variant flex items-center gap-2"><span class="material-symbols-outlined text-primary text-xl">analytics</span> Ringkasan</h3> <div class="grid grid-cols-2 md:grid-cols-5 gap-3"><div class="bg-surface-container-low rounded-lg p-3 text-center"><p class="text-label-sm text-on-surface-variant">Total</p> <p class="font-headline-md text-headline-md text-on-surface">${escape_html(data.summary?.total || 0)}</p></div> <div class="bg-surface-container-low rounded-lg p-3 text-center"><p class="text-label-sm text-on-surface-variant">Masuk</p> <p class="font-headline-md text-headline-md text-primary">${escape_html(data.summary?.total_masuk || 0)}</p></div> <div class="bg-surface-container-low rounded-lg p-3 text-center"><p class="text-label-sm text-on-surface-variant">Keluar</p> <p class="font-headline-md text-headline-md text-tertiary">${escape_html(data.summary?.total_keluar || 0)}</p></div> <div class="bg-surface-container-low rounded-lg p-3 text-center"><p class="text-label-sm text-on-surface-variant">Berhasil</p> <p class="font-headline-md text-headline-md text-success">${escape_html(data.summary?.total_success || 0)}</p></div> <div class="bg-surface-container-low rounded-lg p-3 text-center"><p class="text-label-sm text-on-surface-variant">Gagal</p> <p class="font-headline-md text-headline-md text-error">${escape_html(data.summary?.total_failed || 0)}</p></div></div></div> `);
		if (data.byUser.length > 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 form-card"><h3 class="font-label-md text-label-md text-on-surface pb-3 mb-3 border-b border-outline-variant flex items-center gap-2"><span class="material-symbols-outlined text-primary text-xl">group</span> Rekap per Staff</h3> <div class="space-y-2"><!--[-->`);
			const each_array_2 = ensure_array_like(data.byUser);
			for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
				let u = each_array_2[$$index_2];
				$$renderer.push(`<div class="flex items-center justify-between bg-surface-container-low rounded-lg p-3"><div class="flex items-center gap-3"><div class="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold">${escape_html(u.user_name?.charAt(0)?.toUpperCase() || "U")}</div> <div><p class="font-body-md text-on-surface font-semibold">${escape_html(u.user_name)}</p> <p class="text-label-sm text-on-surface-variant">${escape_html(u.masuk)} masuk · ${escape_html(u.keluar)} keluar</p></div></div> <div class="text-right"><p class="text-label-sm text-success">${escape_html(u.success)} berhasil</p> `);
				if (u.failed > 0) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<p class="text-label-sm text-error">${escape_html(u.failed)} gagal</p>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></div></div>`);
			}
			$$renderer.push(`<!--]--></div></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <div class="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 form-card"><h3 class="font-label-md text-label-md text-on-surface pb-3 mb-3 border-b border-outline-variant flex items-center gap-2"><span class="material-symbols-outlined text-primary text-xl">list_alt</span> Detail Absensi (${escape_html(data.records.length)})</h3> `);
		if (data.records.length === 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="text-center py-8"><span class="material-symbols-outlined text-5xl text-on-surface-variant opacity-40">event_busy</span> <p class="text-body-sm text-on-surface-variant mt-2">Tidak ada data absensi</p></div>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div class="overflow-x-auto"><table class="w-full text-left"><thead><tr class="border-b border-outline-variant text-label-sm text-on-surface-variant"><th class="py-2 pr-3 font-medium">Staff</th><th class="py-2 pr-3 font-medium">Tipe</th><th class="py-2 pr-3 font-medium">Waktu</th><th class="py-2 pr-3 font-medium">Hari</th><th class="py-2 pr-3 font-medium text-right">Jarak</th><th class="py-2 font-medium">Status</th></tr></thead><tbody><!--[-->`);
			const each_array_3 = ensure_array_like(data.records);
			for (let $$index_3 = 0, $$length = each_array_3.length; $$index_3 < $$length; $$index_3++) {
				let r = each_array_3[$$index_3];
				$$renderer.push(`<tr class="border-b border-outline-variant/50 text-body-sm"><td class="py-2.5 pr-3 text-on-surface font-medium">${escape_html(r.user_name)}</td><td class="py-2.5 pr-3"><span${attr_class(`inline-flex items-center gap-1 ${r.type === "masuk" ? "text-primary" : "text-tertiary"}`)}><span class="material-symbols-outlined text-[16px]">${escape_html(r.type === "masuk" ? "login" : "logout")}</span> ${escape_html(r.type === "masuk" ? "Masuk" : "Keluar")}</span></td><td class="py-2.5 pr-3 text-on-surface-variant whitespace-nowrap">${escape_html(new Date(r.created_at).toLocaleTimeString("id-ID", {
					hour: "2-digit",
					minute: "2-digit"
				}))}</td><td class="py-2.5 pr-3 text-on-surface-variant whitespace-nowrap">${escape_html(days[new Date(r.created_at).getDay()])}, ${escape_html(new Date(r.created_at).toLocaleDateString("id-ID", {
					day: "numeric",
					month: "short"
				}))}</td><td class="py-2.5 pr-3 text-right text-on-surface-variant whitespace-nowrap">${escape_html(r.distance_meters)}m</td><td class="py-2.5"><span${attr_class(`inline-block px-2 py-0.5 rounded-full text-label-sm font-medium ${r.status === "success" ? "bg-success-container text-success" : "bg-error-container text-error"}`)}>${escape_html(r.status === "success" ? "Berhasil" : "Gagal")}</span></td></tr>`);
			}
			$$renderer.push(`<!--]--></tbody></table></div>`);
		}
		$$renderer.push(`<!--]--></div></div>`);
	});
}
//#endregion
export { _page as default };
