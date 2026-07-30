import { C as escape_html, S as attr, a as head, c as stringify, i as ensure_array_like, r as derived, t as attr_class } from "../../../chunks/server.js";
import "../../../chunks/forms.js";
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
		$$renderer.push(`<div class="space-y-stack-lg"><div class="flex items-end justify-between gap-3"><div><h1 class="font-headline-lg text-headline-lg text-on-surface">Pelanggan</h1> <p class="text-body-sm text-on-surface-variant">Kelola data pelanggan laundry</p></div> <button type="button" class="inline-flex items-center gap-2 h-11 px-4 bg-primary text-on-primary rounded-xl font-bold text-label-md active:scale-95 transition-transform shrink-0"><span class="material-symbols-outlined text-[20px]">${escape_html("add")}</span> <span class="hidden sm:inline">${escape_html("Tambah Customer")}</span></button></div> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <div class="grid grid-cols-3 gap-stack-sm"><div class="bg-surface-container-lowest border border-outline-variant rounded-xl p-3 text-center"><p class="font-display text-display text-primary font-bold">${escape_html(stats().total)}</p> <p class="text-label-sm text-on-surface-variant">Total</p></div> <div class="bg-surface-container-lowest border border-outline-variant rounded-xl p-3 text-center"><p class="font-display text-display text-warning font-bold">${escape_html(stats().vip)}</p> <p class="text-label-sm text-on-surface-variant">VIP</p></div> <div class="bg-surface-container-lowest border border-outline-variant rounded-xl p-3 text-center"><p class="font-display text-display text-success font-bold">${escape_html(stats().orders)}</p> <p class="text-label-sm text-on-surface-variant">Order</p></div></div> <div class="relative w-full"><span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span> <form method="GET"><input name="search"${attr("value", search())} class="w-full h-12 pl-10 pr-4 bg-surface-container-low dark:bg-gray-800 border border-outline-variant dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-body-md placeholder-outline-variant transition-all" placeholder="Cari nama atau HP..." type="text"/></form></div> <div class="flex gap-2 overflow-x-auto no-scrollbar svelte-hmlmb2"><!--[-->`);
		const each_array = ensure_array_like(filters);
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let f = each_array[$$index];
			$$renderer.push(`<button${attr_class(`px-5 py-2 rounded-full font-label-md text-label-md whitespace-nowrap active:scale-95 transition-all ${activeFilter === f.id ? "bg-primary text-on-primary" : "bg-surface-container-high text-on-surface-variant"}`)}>${escape_html(f.label)}</button>`);
		}
		$$renderer.push(`<!--]--></div> `);
		if (form?.error) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<p class="text-body-sm text-error">${escape_html(form.error)}</p>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-stack-md">`);
		if (filtered().length === 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="col-span-full flex flex-col items-center py-16 text-center"><div class="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center"><span class="material-symbols-outlined text-[32px] text-outline-variant">group</span></div> <p class="mt-3 text-body-sm text-on-surface-variant">Tidak ada pelanggan</p></div>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--[-->`);
			const each_array_1 = ensure_array_like(filtered());
			for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
				let customer = each_array_1[$$index_1];
				$$renderer.push(`<div class="group relative bg-surface-container-lowest rounded-2xl border border-outline-variant hover:border-primary hover:shadow-md transition-all p-4"><a${attr("href", `/customers/${stringify(customer.customer_id)}`)} class="flex items-center gap-3"><div class="relative shrink-0"><div${attr_class(`w-12 h-12 rounded-2xl ${customer.customer_vip ? "bg-warning/20 text-warning" : "bg-primary-fixed text-on-primary-fixed"} flex items-center justify-center font-bold text-headline-md`)}>${escape_html(initials(customer.customer_name))}</div> `);
				if (customer.customer_vip) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<span class="absolute -top-1 -right-1 w-5 h-5 bg-warning rounded-full flex items-center justify-center ring-2 ring-surface-container-lowest"><span class="material-symbols-outlined text-[12px] text-on-surface fill-icon">star</span></span>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></div> <div class="flex-1 min-w-0"><h3 class="font-headline-md text-on-surface leading-tight truncate">${escape_html(customer.customer_name)}</h3> <div class="flex items-center gap-1 text-on-surface-variant mt-0.5"><span class="text-body-sm truncate">${escape_html(customer.customer_phone)}</span></div></div> <span class="material-symbols-outlined text-outline group-hover:text-primary transition-colors">chevron_right</span></a> <div class="mt-3 flex items-center justify-between border-t border-outline-variant pt-3"><div${attr_class(`inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container-high ${customer.customer_total_orders === 0 ? "text-outline" : "text-secondary"}`)}><span class="material-symbols-outlined text-[13px]">receipt_long</span> <span class="text-label-sm font-label-md">${escape_html(customer.customer_total_orders)} order</span></div> <form method="POST" action="?/deleteCustomer"><input type="hidden" name="customer_id"${attr("value", customer.customer_id)}/> <button type="submit" class="p-1.5 rounded-lg text-outline hover:bg-error-container hover:text-error transition-colors" aria-label="Hapus pelanggan"><span class="material-symbols-outlined text-[18px]">delete</span></button></form></div></div>`);
			}
			$$renderer.push(`<!--]-->`);
		}
		$$renderer.push(`<!--]--></div></div>`);
	});
}
//#endregion
export { _page as default };
