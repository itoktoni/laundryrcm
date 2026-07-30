import { n as onDestroy } from "../../../../chunks/index-server.js";
import { C as attr, a as ensure_array_like, i as derived, l as stringify, n as attr_style, o as head, t as attr_class, u as unsubscribe_stores, w as escape_html } from "../../../../chunks/server.js";
import { t as invalidateAll } from "../../../../chunks/client.js";
import "../../../../chunks/stores.js";
import "../../../../chunks/forms.js";
import { n as formatDate, t as formatCurrency } from "../../../../chunks/utils2.js";
import { t as QrisModal } from "../../../../chunks/QrisModal.js";
import "esc-pos-encoder";
//#region src/lib/stores/printer.js
var _state = {
	connected: false,
	connecting: false,
	supported: false,
	deviceName: "",
	error: ""
};
/**
* Get current printer state snapshot
*/
function getPrinterState() {
	return { ..._state };
}
//#endregion
//#region src/lib/components/ui/PrintButton.svelte
function PrintButton($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { order = null, items = [], storeName = "LaundryKu", storeAddress = "", storePhone = "", variant = "icon" } = $$props;
		let printerState = getPrinterState();
		let statusTimeout = null;
		onDestroy(() => {
			clearTimeout(statusTimeout);
		});
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (variant === "full") {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<button type="button" class="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-label-md active:scale-[0.98] transition-transform flex items-center justify-center gap-2 relative"><span class="material-symbols-outlined text-[18px]">print</span> ${escape_html(printerState.connected ? "Cetak Nota" : "Hubungkan & Cetak")} `);
			if (printerState.connected) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<span class="ml-1 text-[10px] opacity-70">▼</span>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></button>`);
		} else if (variant === "icon") {
			$$renderer.push("<!--[1-->");
			$$renderer.push(`<div class="relative"><button type="button"${attr_class(`w-10 h-10 rounded-xl flex items-center justify-center ${printerState.connected ? "bg-primary text-on-primary" : "bg-surface-container-high text-on-surface-variant"} hover:brightness-95 active:scale-90 transition-all`)}${attr("title", printerState.connected ? "Printer terhubung" : "Hubungkan printer")}><span class="material-symbols-outlined text-[20px]">print</span></button> `);
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
	});
}
//#endregion
//#region src/routes/orders/[id]/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		var $$store_subs;
		let { data } = $$props;
		let order = derived(() => data.order);
		let items = derived(() => data.items);
		let store = derived(() => data.store || {});
		let user = derived(() => data.user);
		let canDelete = derived(() => user() && (user().role === "owner" || user().role === "admin"));
		let showQris = false;
		let timer;
		onDestroy(() => clearInterval(timer));
		const statusFlow = [
			"pending",
			"cuci",
			"kering",
			"setrika",
			"packing",
			"selesai",
			"diambil"
		];
		const statusLabels = {
			pending: "Antre",
			cuci: "Cuci",
			kering: "Kering",
			setrika: "Setrika",
			packing: "Packing",
			selesai: "Selesai",
			diambil: "Diambil"
		};
		let currentIdx = derived(() => statusFlow.indexOf(String(order().order_status)));
		function getNextStatus(current) {
			const idx = statusFlow.indexOf(current);
			return idx < statusFlow.length - 1 ? statusFlow[idx + 1] : null;
		}
		let nextStatus = derived(() => getNextStatus(order().order_status));
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			head("1vi81lu", $$renderer, ($$renderer) => {
				$$renderer.title(($$renderer) => {
					$$renderer.push(`<title>Order #${escape_html(order().order_id.slice(0, 8).toUpperCase())} - LaundryKu</title>`);
				});
			});
			$$renderer.push(`<div class="space-y-stack-lg"><div class="flex items-center justify-between gap-3 animate-fade-slide-up"><div class="flex items-center gap-2.5 min-w-0"><a href="/orders" class="pressable-sm icon-tile w-10 h-10 rounded-full bg-surface-container-high text-on-surface-variant shrink-0" aria-label="Kembali"><span class="material-symbols-outlined text-[20px]">arrow_back</span></a> <div class="min-w-0"><h1 class="text-[20px] font-extrabold tracking-tight text-on-surface">#${escape_html(order().order_id.slice(0, 8).toUpperCase())}</h1> <p class="text-[11px] font-medium text-on-surface-variant">${escape_html(formatDate(order().order_created_at))}</p></div></div> <div class="flex items-center gap-2 shrink-0"><button type="button" class="pressable-sm icon-tile w-10 h-10 rounded-full bg-success text-white shadow-[0_4px_12px_-4px_rgb(22_163_74/0.5)]" title="Kirim Invoice ke WhatsApp"><span class="material-symbols-outlined text-[20px]">chat</span></button> `);
			PrintButton($$renderer, {
				order: order(),
				items: items(),
				storeName: store().store_name || "LaundryKu",
				storeAddress: store().store_address || "",
				storePhone: store().store_phone || ""
			});
			$$renderer.push(`<!----></div></div> <div class="app-card p-4 animate-fade-slide-up"><div class="flex items-center gap-3"><div class="icon-tile w-12 h-12 rounded-2xl bg-primary-fixed text-on-primary-fixed font-extrabold text-[18px]">${escape_html(order().customer_name.charAt(0))}</div> <div class="flex-1"><div class="flex items-center gap-2 flex-wrap"><h3 class="text-[16px] font-extrabold text-on-surface">${escape_html(order().customer_name)}</h3> `);
			if (order().customer_vip) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<span class="inline-flex items-center gap-0.5 px-2 py-0.5 bg-warning/15 text-warning text-[10px] font-bold rounded-full uppercase tracking-wider"><span class="material-symbols-outlined text-[12px] fill-icon">star</span> VIP</span>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div> <p class="text-body-sm text-on-surface-variant">${escape_html(order().customer_phone)}</p> `);
			if (order().customer_address) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<p class="text-label-md text-on-surface-variant mt-1">${escape_html(order().customer_address)}</p>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			if (order().customer_est_freq_days || order().customer_est_weight) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="flex items-center gap-3 mt-2 flex-wrap">`);
				if (order().customer_est_freq_days) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<div class="flex items-center gap-1"><span class="text-body-sm text-on-surface-variant">Freq:</span> <span class="text-body-sm font-semibold text-on-surface">`);
					if (order().customer_est_freq_days == 7) {
						$$renderer.push("<!--[0-->");
						$$renderer.push(`1 minggu`);
					} else if (order().customer_est_freq_days == 14) {
						$$renderer.push("<!--[1-->");
						$$renderer.push(`2 minggu`);
					} else if (order().customer_est_freq_days == 3) {
						$$renderer.push("<!--[2-->");
						$$renderer.push(`3 hari`);
					} else {
						$$renderer.push("<!--[-1-->");
						$$renderer.push(`${escape_html(order().customer_est_freq_days)} hari`);
					}
					$$renderer.push(`<!--]--></span></div>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--> `);
				if (order().customer_est_weight) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<div class="flex items-center gap-1"><span class="text-body-sm text-on-surface-variant">Weight:</span> <span class="text-body-sm font-semibold text-on-surface">${escape_html(order().customer_est_weight)} kg</span></div>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div></div></div> <div class="app-card p-4 space-y-3 animate-fade-slide-up"><label class="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">Item</label> <!--[-->`);
			const each_array = ensure_array_like(items());
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let item = each_array[$$index];
				$$renderer.push(`<div class="flex items-center justify-between p-3 bg-surface-container-low rounded-xl"><div><p class="text-[14px] text-on-surface font-bold">${escape_html(item.product_name)}</p> <p class="text-[11px] font-medium text-on-surface-variant">${escape_html(item.item_quantity)} ${escape_html(item.product_unit)} × ${escape_html(formatCurrency(item.item_price))}</p></div> <span class="text-[14px] font-extrabold text-primary">${escape_html(formatCurrency(item.item_subtotal))}</span></div>`);
			}
			$$renderer.push(`<!--]--> <div class="pt-3 border-t border-outline-variant space-y-2"><div class="flex justify-between text-body-sm"><span class="text-on-surface-variant">Subtotal</span> <span class="text-on-surface">${escape_html(formatCurrency(order().order_subtotal))}</span></div> `);
			if (order().order_discount_amount > 0) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="flex justify-between text-body-sm"><span class="text-on-surface-variant">Diskon ${escape_html(order().promo_name ? `(${order().promo_name})` : "")}</span> <span class="text-error">-${escape_html(formatCurrency(order().order_discount_amount))}</span></div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			if (order().order_unique_code) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="flex justify-between text-body-sm"><span class="text-on-surface-variant">Kode Unik</span> <span class="text-on-surface">+${escape_html(formatCurrency(order().order_unique_code))}</span></div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> <div class="flex justify-between items-end pt-2 border-t border-outline-variant"><span class="text-[14px] font-bold text-on-surface">${escape_html(order().order_unique_code ? "Total Dibayar" : "Total")}</span> <span class="text-[26px] font-extrabold tracking-tight text-primary leading-none">${escape_html(formatCurrency(order().order_unique_code ? order().order_paid_amount : order().order_total_price))}</span></div> <div class="flex justify-between text-body-sm pt-1"><span class="text-on-surface-variant">Status</span> <span${attr_class(`font-bold ${order().order_payment_status === "paid" ? "text-success" : "text-error"}`)}>${escape_html(order().order_payment_status === "paid" ? "Lunas" : "Belum Bayar")}</span></div> `);
			if (order().order_payment_code) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="flex justify-between text-body-sm pt-1"><span class="text-on-surface-variant">Kode Pembayaran</span> <span class="text-on-surface font-mono">${escape_html(order().order_payment_code)}</span></div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div></div> `);
			if (order().order_notes || order().customer_notes) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="app-card p-4 animate-fade-slide-up"><p class="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant mb-2">Catatan</p> `);
				if (order().order_notes) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<p class="text-body-sm text-on-surface mb-2">Order: ${escape_html(order().order_notes)}</p>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--> `);
				if (order().customer_notes) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<p class="text-body-sm text-on-surface">Pelanggan: ${escape_html(order().customer_notes)}</p>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> <div class="app-card p-4 animate-fade-slide-up"><div class="flex items-center justify-between mb-5"><p class="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">Status Order</p> <span class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold bg-primary/10 text-primary"><span class="w-1.5 h-1.5 rounded-full bg-current"></span> ${escape_html(statusLabels[order().order_status])}</span></div> <div class="relative flex justify-between px-1"><div class="absolute top-4 left-7 right-7 h-1 bg-surface-container-highest rounded-full"></div> <div class="absolute top-4 left-7 h-1 bg-brand-gradient rounded-full transition-all duration-500"${attr_style(`width: calc((100% - 3.5rem) * ${stringify(currentIdx() / (statusFlow.length - 1))});`)}></div> <!--[-->`);
			const each_array_1 = ensure_array_like(statusFlow);
			for (let i = 0, $$length = each_array_1.length; i < $$length; i++) {
				let status = each_array_1[i];
				$$renderer.push(`<button type="button" class="pressable-sm relative flex flex-col items-center gap-1.5 cursor-pointer z-10"${attr("title", `Set status ke ${stringify(statusLabels[status])}`)}><div${attr_class(`w-8 h-8 rounded-full flex items-center justify-center transition-all ${i === currentIdx() ? "bg-brand-gradient text-white ring-4 ring-primary/20 shadow-fab" : i < currentIdx() ? "bg-success text-white" : "bg-surface-container-highest text-on-surface-variant"}`)}>`);
				if (i < currentIdx()) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<span class="material-symbols-outlined text-[16px]">check</span>`);
				} else {
					$$renderer.push("<!--[-1-->");
					$$renderer.push(`<span class="text-[10px] font-bold">${escape_html(i + 1)}</span>`);
				}
				$$renderer.push(`<!--]--></div> <span${attr_class(`text-[9px] font-bold ${i === currentIdx() ? "text-primary" : "text-on-surface-variant"}`)}>${escape_html(statusLabels[status])}</span></button>`);
			}
			$$renderer.push(`<!--]--></div> <p class="mt-4 text-center text-[10px] font-medium text-outline">Ketuk status untuk mengubah</p></div> <div class="space-y-2.5">`);
			if (nextStatus()) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<form method="POST" action="?/updateStatus"><input type="hidden" name="status"${attr("value", nextStatus())}/> <button type="submit" class="pressable w-full h-13 bg-primary bg-brand-gradient text-white rounded-2xl font-bold text-[15px] shadow-fab flex items-center justify-center gap-2">Proses ke ${escape_html(statusLabels[nextStatus()])} <span class="material-symbols-outlined text-[20px]">arrow_forward</span></button></form>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> <div class="flex gap-2.5">`);
			if (canDelete()) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<form method="POST" action="?/deleteOrder" class="flex-1"><button type="submit" class="pressable w-full h-12 bg-error/10 text-error border border-error/20 rounded-2xl font-bold text-[13px] flex items-center justify-center gap-2"><span class="material-symbols-outlined text-[18px]">delete</span> Hapus</button></form>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			if (order().order_payment_status === "unpaid") {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<button type="button" class="pressable flex-1 h-12 bg-success text-white rounded-2xl font-bold text-[13px] shadow-[0_6px_16px_-6px_rgb(22_163_74/0.5)] flex items-center justify-center gap-2"><span class="material-symbols-outlined text-[18px]">qr_code_2</span> Bayar Sekarang</button>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div></div></div> `);
			QrisModal($$renderer, {
				amount: order().order_total_price,
				orderId: order().order_id,
				onPaid: () => invalidateAll(),
				get open() {
					return showQris;
				},
				set open($$value) {
					showQris = $$value;
					$$settled = false;
				}
			});
			$$renderer.push(`<!---->`);
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
		if ($$store_subs) unsubscribe_stores($$store_subs);
	});
}
//#endregion
export { _page as default };
