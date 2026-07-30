import { C as attr, a as ensure_array_like, i as derived, l as stringify, o as head, t as attr_class, w as escape_html } from "../../../chunks/server.js";
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
			packing: "bg-packing",
			selesai: "bg-success",
			diambil: "bg-secondary"
		};
		const statusLabels = {
			pending: "Antre",
			cuci: "Cuci",
			kering: "Kering",
			setrika: "Setrika",
			packing: "Packing",
			selesai: "Selesai",
			diambil: "Diambil"
		};
		/** @param {unknown} status */
		function statusColorFor(status) {
			return statusColors[String(status)] || statusColors.pending;
		}
		/** @param {unknown} status */
		function statusLabelFor(status) {
			const key = String(status);
			return statusLabels[key] || key;
		}
		head("1c7g62i", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Order - LaundryKu</title>`);
			});
		});
		$$renderer.push(`<div class="sticky top-0 bg-surface/90 backdrop-blur-xl z-40 -mx-container-margin px-container-margin pt-2 pb-3 space-y-3.5"><div class="flex items-center justify-between gap-3"><div><h1 class="text-[24px] font-extrabold tracking-tight text-on-surface">Order</h1> <p class="text-[12px] font-medium text-on-surface-variant">${escape_html(data.orders.length)} order ditemukan</p></div> <div class="flex items-center gap-2"><button${attr_class(`pressable-sm icon-tile w-10 h-10 rounded-xl bg-surface-container-high text-on-surface-variant`)} aria-label="Filter tanggal"><span class="material-symbols-outlined text-[20px]">date_range</span></button> <a${attr("href", `/api/orders/export?${stringify(new URLSearchParams(Object.fromEntries(Object.entries({
			status: data.filters.status,
			start_date: data.filters.startDate,
			end_date: data.filters.endDate
		}).filter(([k, v]) => v))).toString())}`)} class="pressable-sm icon-tile w-10 h-10 rounded-xl bg-surface-container-high text-on-surface-variant" aria-label="Export CSV" download=""><span class="material-symbols-outlined text-[20px]">download</span></a> <a href="/orders/new" class="hidden md:inline-flex pressable items-center gap-2 h-11 px-5 bg-primary bg-brand-gradient text-white rounded-xl font-bold text-[13px] shadow-fab"><span class="material-symbols-outlined text-[20px]">add</span> Tambah Order</a></div></div> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (data.filters.startDate || data.filters.endDate) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="flex items-center gap-2 text-[12px] font-semibold text-primary bg-primary/8 px-3 py-2 rounded-xl animate-fade-in"><span class="material-symbols-outlined text-[16px]">filter_alt</span> <span>`);
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
		$$renderer.push(`<!--]--> <div class="relative"><span class="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-[20px]">search</span> <form method="GET">`);
		if (startDate) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<input type="hidden" name="start_date"${attr("value", startDate)}/>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (endDate) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<input type="hidden" name="end_date"${attr("value", endDate)}/>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <input name="search"${attr("value", search())} class="w-full h-12 pl-11 pr-4 bg-surface-container-lowest border border-outline-variant rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/15 text-[14px] placeholder:text-outline-variant outline-none transition-all" placeholder="Cari order atau nama pelanggan..." type="text"/></form></div> <div class="flex gap-2 overflow-x-auto hide-scrollbar -mx-container-margin px-container-margin"><!--[-->`);
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
			$$renderer.push(`<button${attr_class(`chip ${data.filters.status === tab.id ? "chip-active" : ""}`)}>${escape_html(tab.label)}</button>`);
		}
		$$renderer.push(`<!--]--></div></div> <div class="pt-4 space-y-2.5 stagger">`);
		if (data.orders.length === 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="app-card p-10 text-center"><div class="icon-tile w-16 h-16 rounded-2xl bg-surface-container-high mx-auto"><span class="material-symbols-outlined text-[32px] text-outline-variant">receipt_long</span></div> <p class="mt-3 text-[14px] font-bold text-on-surface">Tidak ada order ditemukan</p> <p class="mt-1 text-[12px] font-medium text-on-surface-variant">Coba ubah filter atau buat order baru</p> <a href="/orders/new" class="pressable inline-flex items-center gap-2 mt-5 h-11 px-5 bg-primary bg-brand-gradient text-white rounded-xl font-bold text-[13px] shadow-fab"><span class="material-symbols-outlined text-[18px]">add</span> Order Baru</a></div>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--[-->`);
			const each_array_1 = ensure_array_like(data.orders);
			for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
				let order = each_array_1[$$index_1];
				$$renderer.push(`<a${attr("href", `/orders/${stringify(order.order_id)}`)} class="app-card pressable block p-4"><div class="flex items-start justify-between gap-3"><div class="flex items-center gap-3 min-w-0"><div class="icon-tile w-11 h-11 rounded-xl bg-primary-fixed text-on-primary-fixed font-extrabold text-[15px]">${escape_html(String(order.customer_name || "?").charAt(0).toUpperCase())}</div> <div class="min-w-0"><h3 class="font-bold text-[15px] text-on-surface truncate">${escape_html(order.customer_name)}</h3> <p class="text-[11px] font-medium text-on-surface-variant">#${escape_html(String(order.order_id || "").slice(0, 8).toUpperCase())}`);
				if (order.order_unique_code) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`· Kode ${escape_html(order.order_unique_code)}`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></p></div></div> <div class="text-right shrink-0"><p class="font-extrabold text-[15px] text-primary">${escape_html(formatCurrency(order.order_total_price))}</p> <p class="text-[10px] font-medium text-on-surface-variant mt-0.5">${escape_html(formatDate(order.order_created_at))}</p></div></div> <div class="flex justify-between items-center mt-3 pt-3 border-t border-outline-variant/70"><div class="flex items-center gap-2"><span${attr_class(`w-2 h-2 rounded-full ${stringify(statusColorFor(order.order_status))} ${order.order_status === "cuci" || order.order_status === "setrika" ? "animate-pulse" : ""}`)}></span> <span class="text-[12px] font-bold text-on-surface-variant">${escape_html(statusLabelFor(order.order_status))}</span></div> `);
				if (order.order_payment_status === "unpaid") {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-error/10 text-error text-[10px] font-bold"><span class="material-symbols-outlined text-[13px]">schedule</span> Belum Bayar</span>`);
				} else {
					$$renderer.push("<!--[-1-->");
					$$renderer.push(`<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-success/10 text-success text-[10px] font-bold"><span class="material-symbols-outlined text-[13px] fill-icon">check_circle</span> Lunas</span>`);
				}
				$$renderer.push(`<!--]--></div></a>`);
			}
			$$renderer.push(`<!--]-->`);
		}
		$$renderer.push(`<!--]--></div>`);
	});
}
//#endregion
export { _page as default };
