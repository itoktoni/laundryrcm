import { C as escape_html, S as attr, a as head, c as stringify, i as ensure_array_like, r as derived, t as attr_class } from "../../../chunks/server.js";
import { n as formatDate, t as formatCurrency } from "../../../chunks/utils2.js";
//#region src/routes/orders/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data } = $$props;
		let search = derived(() => data.filters.search);
		let startDate = data.filters.startDate || "";
		let endDate = data.filters.endDate || "";
		const statusColors = {
			pending: "bg-pending",
			cuci: "bg-primary",
			kering: "bg-kering",
			setrika: "bg-setrika",
			selesai: "bg-success",
			diambil: "bg-secondary"
		};
		const statusLabels = {
			pending: "Antre",
			cuci: "Cuci",
			kering: "Kering",
			setrika: "Setrika",
			selesai: "Selesai",
			diambil: "Diambil"
		};
		head("1c7g62i", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Order - LaundryKu</title>`);
			});
		});
		$$renderer.push(`<div class="sticky bg-surface/95 dark:bg-dark-bg/95 backdrop-blur-md z-40 pt-stack-md pb-stack-sm space-y-4"><div class="flex items-center justify-between gap-3"><h1 class="font-headline-lg text-headline-lg text-on-surface">Order</h1> <div class="flex items-center gap-2"><button class="h-10 px-3 rounded-full bg-blue-600 hover:bg-blue-700 text-sm font-medium text-white transition-colors flex items-center gap-1"><span class="material-symbols-outlined text-[18px]">date_range</span> <span class="hidden sm:inline">Filter</span></button> <a${attr("href", `/api/orders/export?${stringify(new URLSearchParams(Object.fromEntries(Object.entries({
			status: data.filters.status,
			start_date: data.filters.startDate,
			end_date: data.filters.endDate
		}).filter(([k, v]) => v))).toString())}`)} class="inline-flex h-10 items-center gap-1 px-3 rounded-full bg-green-600 hover:bg-green-700 text-sm font-medium text-white transition-colors" download=""><span class="material-symbols-outlined text-[18px]">download</span> CSV</a> <a href="/orders/new" class="hidden md:inline-flex items-center gap-2 h-11 px-4 bg-primary text-on-primary rounded-xl font-bold text-label-md active:scale-95 transition-transform"><span class="material-symbols-outlined text-[20px]">add</span> Tambah Order</a></div></div> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (data.filters.startDate || data.filters.endDate) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="flex items-center gap-2 text-xs text-on-surface-variant bg-blue-50 dark:bg-blue-900/20 px-3 py-2 rounded-lg"><span class="material-symbols-outlined text-[14px]">filter_alt</span> <span>`);
			if (data.filters.startDate && data.filters.endDate) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`${escape_html(data.filters.startDate)} s/d ${escape_html(data.filters.endDate)}`);
			} else if (data.filters.startDate) {
				$$renderer.push("<!--[1-->");
				$$renderer.push(`Dari ${escape_html(data.filters.startDate)}`);
			} else {
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`Sampai ${escape_html(data.filters.endDate)}`);
			}
			$$renderer.push(`<!--]--></span></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <div class="relative group"><span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span> <form method="GET">`);
		if (startDate) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<input type="hidden" name="start_date"${attr("value", startDate)}/>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (endDate) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<input type="hidden" name="end_date"${attr("value", endDate)}/>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <input name="search"${attr("value", search())} class="w-full h-11 pl-10 pr-4 bg-surface-container-low dark:bg-gray-800 border border-outline-variant dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-body-md placeholder-outline-variant transition-all" placeholder="Cari order atau nama..." type="text"/></form></div> <div class="flex items-center justify-between border-b border-outline-variant dark:border-outline overflow-x-auto hide-scrollbar svelte-1c7g62i"><!--[-->`);
		const each_array = ensure_array_like([
			{
				id: "",
				label: "Semua"
			},
			{
				id: "pending",
				label: "Proses"
			},
			{
				id: "selesai",
				label: "Selesai"
			},
			{
				id: "diambil",
				label: "Diambil"
			}
		]);
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let tab = each_array[$$index];
			$$renderer.push(`<button${attr_class(`px-4 py-2 font-label-md text-label-md whitespace-nowrap ${data.filters.status === tab.id ? "text-primary border-b-2 border-primary" : "text-on-surface-variant"}`)}>${escape_html(tab.label)}</button>`);
		}
		$$renderer.push(`<!--]--></div></div> <div class="py-stack-md space-y-4">`);
		if (data.orders.length === 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="text-center py-12"><span class="material-symbols-outlined text-[48px] text-outline-variant">receipt_long</span> <p class="mt-2 text-body-sm text-on-surface-variant">Tidak ada order ditemukan</p></div>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--[-->`);
			const each_array_1 = ensure_array_like(data.orders);
			for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
				let order = each_array_1[$$index_1];
				$$renderer.push(`<a${attr("href", `/orders/${stringify(order.order_id)}`)} class="block bg-surface-container-lowest dark:bg-dark-card p-4 rounded-xl border border-outline-variant dark:border-gray-700 shadow-[0px_1px_3px_rgba(0,0,0,0.05)] active:scale-[0.98] transition-transform duration-150"><div class="flex justify-between items-start mb-2"><div><h3 class="font-headline-md text-headline-md text-on-surface">${escape_html(order.customer_name)}</h3> <p class="text-label-md font-label-md text-outline">#${escape_html(order.order_id.slice(0, 8).toUpperCase())}`);
				if (order.order_unique_code) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`· Kode ${escape_html(order.order_unique_code)}`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></p></div> <div class="text-right"><span class="block font-headline-md text-headline-md text-primary">${escape_html(formatCurrency(order.order_total_price))}</span> <p class="text-label-sm font-label-sm text-outline">${escape_html(formatDate(order.order_created_at))}</p></div></div> <div class="flex justify-between items-center pt-3 border-t border-outline-variant dark:border-gray-700"><div class="flex items-center gap-2"><div${attr_class(`w-2 h-2 rounded-full ${stringify(statusColors[order.order_status])} ${order.order_status === "cuci" || order.order_status === "setrika" ? "animate-pulse" : ""}`, "svelte-1c7g62i")}></div> <span class="text-label-md font-label-md text-primary">${escape_html(statusLabels[order.order_status])}</span></div> `);
				if (order.order_payment_status === "unpaid") {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<span class="px-2 py-1 bg-error-container text-on-error-container text-label-sm font-label-md rounded">Belum Bayar</span>`);
				} else {
					$$renderer.push("<!--[-1-->");
					$$renderer.push(`<span class="px-2 py-1 bg-success/10 text-success text-label-sm font-label-md rounded">Lunas</span>`);
				}
				$$renderer.push(`<!--]--></div></a>`);
			}
			$$renderer.push(`<!--]-->`);
		}
		$$renderer.push(`<!--]--></div> <a href="/orders/new" class="hidden"><span class="material-symbols-outlined text-[32px]">add</span></a>`);
	});
}
//#endregion
export { _page as default };
