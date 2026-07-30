import { a as ensure_array_like, l as stringify, o as head, t as attr_class, w as escape_html } from "../../chunks/server.js";
//#region src/routes/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data } = $$props;
		const features = [
			{
				icon: "receipt_long",
				title: "Order Management",
				desc: "Track order real-time",
				color: "bg-primary/10 text-primary"
			},
			{
				icon: "payments",
				title: "Keuangan",
				desc: "Laba bersih otomatis",
				color: "bg-success/10 text-success"
			},
			{
				icon: "manage_accounts",
				title: "CRM",
				desc: "Kelola pelanggan VIP",
				color: "bg-kering/10 text-kering"
			},
			{
				icon: "sell",
				title: "Promo",
				desc: "Diskon & voucher",
				color: "bg-warning/10 text-warning"
			},
			{
				icon: "calculate",
				title: "Kalkulator",
				desc: "Hitung harga & profit",
				color: "bg-setrika/10 text-setrika"
			},
			{
				icon: "assessment",
				title: "Laporan",
				desc: "Export CSV & PDF",
				color: "bg-packing/15 text-warning"
			}
		];
		head("1uha8ag", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>LaundryKu - Manajemen Laundry AI</title>`);
			});
		});
		$$renderer.push(`<div class="min-h-dvh bg-surface"><div class="relative overflow-hidden bg-brand-gradient px-6 pb-20 pt-[max(4.5rem,env(safe-area-inset-top))] text-center"><div class="absolute -right-12 -top-16 w-56 h-56 rounded-full bg-white/10"></div> <div class="absolute right-20 top-32 w-24 h-24 rounded-full bg-white/10"></div> <div class="absolute -left-10 bottom-10 w-32 h-32 rounded-full bg-white/5"></div> <div class="relative max-w-md mx-auto animate-fade-slide-up"><div class="icon-tile w-20 h-20 rounded-[1.5rem] bg-white/15 backdrop-blur ring-1 ring-white/25 mx-auto mb-6"><span class="material-symbols-outlined text-[44px] text-white fill-icon">local_laundry_service</span></div> <h1 class="text-[38px] font-extrabold tracking-tight text-white">LaundryKu</h1> <p class="mt-3 text-[17px] font-semibold text-white/95">Naikkan Omset Laundry dengan AI</p> <p class="mt-2 text-[13px] text-white/75 leading-relaxed">Solusi praktis untuk membuat laundry lebih rapi, cepat, dan menguntungkan</p> <div class="mt-8 flex flex-col gap-3">`);
		if (data.user) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<a href="/dashboard" class="pressable flex items-center justify-center gap-2 h-13 rounded-xl bg-white text-primary font-bold text-[15px] shadow-lg"><span class="material-symbols-outlined text-[20px]">dashboard</span> Buka Dashboard</a>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<a href="/login" class="pressable flex items-center justify-center gap-2 h-13 rounded-xl bg-white text-primary font-bold text-[15px] shadow-lg">Masuk <span class="material-symbols-outlined text-[20px]">arrow_forward</span></a> <a href="/register" class="pressable flex items-center justify-center gap-2 h-13 rounded-xl border-2 border-white/40 text-white font-bold text-[15px]">Daftar Gratis</a>`);
		}
		$$renderer.push(`<!--]--></div></div></div> <div class="px-5 -mt-10 pb-12"><div class="max-w-md mx-auto grid grid-cols-2 gap-3 stagger"><!--[-->`);
		const each_array = ensure_array_like(features);
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let f = each_array[$$index];
			$$renderer.push(`<div class="app-card shadow-card-lg p-4"><div${attr_class(`icon-tile w-11 h-11 rounded-xl ${stringify(f.color)}`)}><span class="material-symbols-outlined text-[22px]">${escape_html(f.icon)}</span></div> <div class="mt-3 text-[14px] font-bold text-on-surface">${escape_html(f.title)}</div> <div class="text-[12px] text-on-surface-variant mt-0.5">${escape_html(f.desc)}</div></div>`);
		}
		$$renderer.push(`<!--]--></div> <p class="text-center text-[11px] text-outline mt-10">LaundryKu v2.0 — Gratis untuk semua pemilik laundry</p></div></div>`);
	});
}
//#endregion
export { _page as default };
