import { C as attr, a as ensure_array_like, i as derived, l as stringify, o as head, t as attr_class, w as escape_html } from "../../../chunks/server.js";
import "../../../chunks/forms.js";
import { n as formatDate } from "../../../chunks/utils2.js";
//#region src/routes/customers/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data, form } = $$props;
		let search = derived(() => data.filters.search);
		let activeFilter = "all";
		let filtered = derived(() => data.customers.filter((c) => {
			return true;
		}));
		let stats = derived(() => ({
			total: data.customers.length,
			vip: data.customers.filter((c) => c.customer_vip).length,
			orders: data.customers.reduce((s, c) => s + c.customer_total_orders, 0)
		}));
		const filters = [
			{
				id: "all",
				label: "Semua"
			},
			{
				id: "vip",
				label: "VIP"
			},
			{
				id: "new",
				label: "Baru"
			}
		];
		function initials(name) {
			return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
		}
		head("hmlmb2", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Pelanggan - LaundryKu</title>`);
			});
		});
		$$renderer.push(`<div class="space-y-stack-lg"><div class="flex items-end justify-between gap-3 animate-fade-slide-up"><div><h1 class="text-[24px] font-extrabold tracking-tight text-on-surface">Pelanggan</h1> <p class="text-[12px] font-medium text-on-surface-variant">Kelola data pelanggan laundry</p></div> <button type="button" class="pressable inline-flex items-center gap-2 h-11 px-4 bg-primary bg-brand-gradient text-white rounded-xl font-bold text-[13px] shadow-fab shrink-0"><span class="material-symbols-outlined text-[20px]">${escape_html("add")}</span> <span class="hidden sm:inline">${escape_html("Tambah Customer")}</span></button></div> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <div class="grid grid-cols-3 gap-2.5 animate-fade-slide-up" style="animation-delay:0.05s"><div class="app-card p-3.5"><span class="icon-tile w-9 h-9 rounded-xl bg-primary/10 text-primary mb-2"><span class="material-symbols-outlined text-[20px]">group</span></span> <p class="text-[22px] font-extrabold text-on-surface leading-none">${escape_html(stats().total)}</p> <p class="mt-1 text-[10.5px] font-semibold text-on-surface-variant">Total</p></div> <div class="app-card p-3.5"><span class="icon-tile w-9 h-9 rounded-xl bg-warning/10 text-warning mb-2"><span class="material-symbols-outlined text-[20px] fill-icon">star</span></span> <p class="text-[22px] font-extrabold text-on-surface leading-none">${escape_html(stats().vip)}</p> <p class="mt-1 text-[10.5px] font-semibold text-on-surface-variant">VIP</p></div> <div class="app-card p-3.5"><span class="icon-tile w-9 h-9 rounded-xl bg-success/10 text-success mb-2"><span class="material-symbols-outlined text-[20px]">receipt_long</span></span> <p class="text-[22px] font-extrabold text-on-surface leading-none">${escape_html(stats().orders)}</p> <p class="mt-1 text-[10.5px] font-semibold text-on-surface-variant">Order</p></div></div> <div class="relative w-full"><span class="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-[20px]">search</span> <form method="GET"><input name="search"${attr("value", search())} class="w-full h-12 pl-11 pr-4 bg-surface-container-lowest border border-outline-variant rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/15 text-[14px] placeholder:text-outline-variant outline-none transition-all" placeholder="Cari nama atau HP..." type="text"/></form></div> <div class="flex gap-2 overflow-x-auto hide-scrollbar"><!--[-->`);
		const each_array = ensure_array_like(filters);
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let f = each_array[$$index];
			$$renderer.push(`<button${attr_class(`chip ${activeFilter === f.id ? "chip-active" : ""}`)}>${escape_html(f.label)}</button>`);
		}
		$$renderer.push(`<!--]--></div> `);
		if (form?.error) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<p class="text-body-sm text-error">${escape_html(form.error)}</p>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-stack-md">`);
		if (filtered().length === 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="col-span-full flex flex-col items-center py-16 text-center"><div class="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center"><span class="material-symbols-outlined text-[32px] text-outline-variant">group</span></div> <p class="mt-3 text-body-sm text-on-surface-variant">Tidak ada pelanggan</p></div>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--[-->`);
			const each_array_1 = ensure_array_like(filtered());
			for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
				let customer = each_array_1[$$index_1];
				$$renderer.push(`<div class="group relative app-card p-4 hover:shadow-card-lg transition-shadow"><a${attr("href", `/customers/${stringify(customer.customer_id)}`)} class="flex items-center gap-3"><div class="relative shrink-0"><div${attr_class(`w-12 h-12 rounded-2xl ${customer.customer_vip ? "bg-warning/20 text-warning" : "bg-primary-fixed text-on-primary-fixed"} flex items-center justify-center font-bold text-headline-md`)}>${escape_html(initials(customer.customer_name))}</div> `);
				if (customer.customer_vip) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<span class="absolute -top-1 -right-1 w-5 h-5 bg-warning rounded-full flex items-center justify-center ring-2 ring-surface-container-lowest"><span class="material-symbols-outlined text-[12px] text-on-surface fill-icon">star</span></span>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></div> <div class="flex-1 min-w-0"><h3 class="font-headline-md text-on-surface leading-tight truncate">${escape_html(customer.customer_name)}</h3> <div class="flex items-center gap-1 text-on-surface-variant mt-0.5"><span class="text-body-sm truncate">${escape_html(customer.customer_phone)}</span></div></div> <span class="material-symbols-outlined text-outline group-hover:text-primary transition-colors">chevron_right</span></a> <div class="mt-3 flex items-center justify-between border-t border-outline-variant pt-3"><div class="flex flex-col gap-1"><div${attr_class(`inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container-high ${customer.total_orders === 0 ? "text-outline" : "text-secondary"}`)}><span class="material-symbols-outlined text-[13px]">receipt_long</span> <span class="text-label-sm font-label-md">${escape_html(customer.total_orders || 0)} order</span></div> `);
				if (customer.total_kg > 0) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<div class="text-label-sm text-on-surface-variant">${escape_html(customer.total_kg)} kg terakhir pesan tanggal ${escape_html(formatDate(customer.last_order))}</div>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></div> <form method="POST" action="?/deleteCustomer"><input type="hidden" name="customer_id"${attr("value", customer.customer_id)}/> <button type="submit" class="p-1.5 rounded-lg text-outline hover:bg-error-container hover:text-error transition-colors" aria-label="Hapus pelanggan"><span class="material-symbols-outlined text-[18px]">delete</span></button></form></div></div>`);
			}
			$$renderer.push(`<!--]-->`);
		}
		$$renderer.push(`<!--]--></div></div>`);
	});
}
//#endregion
export { _page as default };
