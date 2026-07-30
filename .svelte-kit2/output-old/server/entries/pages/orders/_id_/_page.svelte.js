import { n as onDestroy } from "../../../../chunks/index-server.js";
import { C as escape_html, S as attr, a as head, c as stringify, i as ensure_array_like, r as derived, t as attr_class } from "../../../../chunks/server.js";
import { t as invalidateAll } from "../../../../chunks/client.js";
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
			"selesai",
			"diambil"
		];
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
			$$renderer.push(`<div class="space-y-stack-lg"><div class="flex items-center justify-between"><div><h1 class="font-headline-lg text-headline-lg text-on-surface">#${escape_html(order().order_id.slice(0, 8).toUpperCase())}</h1> <p class="text-label-md text-on-surface-variant">${escape_html(formatDate(order().order_created_at))}</p></div> <div class="flex items-center gap-2">`);
			PrintButton($$renderer, {
				order: order(),
				items: items(),
				storeName: store().store_name || "LaundryKu",
				storeAddress: store().store_address || "",
				storePhone: store().store_phone || ""
			});
			$$renderer.push(`<!----> <span${attr_class(`px-3 py-1 ${stringify(statusColors[order().order_status])} text-on-primary rounded-full text-label-md font-label-md`)}>${escape_html(statusLabels[order().order_status])}</span> <span${attr_class(`px-3 py-1 ${order().order_payment_status === "paid" ? "bg-success" : "bg-error"} text-on-primary rounded-full text-label-md font-label-md`)}>${escape_html(order().order_payment_status === "paid" ? "Lunas" : "Belum Bayar")}</span></div></div> <div class="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant"><div class="flex items-center gap-3"><div class="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center text-on-primary-fixed font-bold text-headline-md">${escape_html(order().customer_name.charAt(0))}</div> <div><div class="flex items-center gap-2"><h3 class="font-headline-md text-headline-md text-on-surface">${escape_html(order().customer_name)}</h3> `);
			if (order().customer_vip) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<span class="px-2 py-0.5 bg-warning text-on-surface text-[10px] font-bold rounded uppercase tracking-wider">VIP</span>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div> <p class="text-body-sm text-on-surface-variant">${escape_html(order().customer_phone)}</p></div></div></div> <div class="bg-surface-container-low p-4 rounded-xl border border-outline-variant space-y-3"><label class="font-label-md text-label-md text-on-surface-variant uppercase">Item</label> <!--[-->`);
			const each_array = ensure_array_like(items());
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let item = each_array[$$index];
				$$renderer.push(`<div class="flex items-center justify-between p-3 bg-surface-container-lowest rounded-lg border border-outline-variant"><div><p class="font-body-md text-on-surface font-semibold">${escape_html(item.product_name)}</p> <p class="text-label-md text-on-surface-variant">${escape_html(item.item_quantity)} ${escape_html(item.product_unit)} × ${escape_html(formatCurrency(item.item_price))}</p></div> <span class="font-headline-md text-primary">${escape_html(formatCurrency(item.item_subtotal))}</span></div>`);
			}
			$$renderer.push(`<!--]--> <div class="pt-3 border-t border-outline-variant space-y-2"><div class="flex justify-between text-body-sm"><span class="text-on-surface-variant">Subtotal</span> <span class="text-on-surface">${escape_html(formatCurrency(order().order_subtotal))}</span></div> `);
			if (order().order_discount_amount > 0) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="flex justify-between text-body-sm"><span class="text-on-surface-variant">Diskon ${escape_html(order().promo_name ? `(${order().promo_name})` : "")}</span> <span class="text-error">-${escape_html(formatCurrency(order().order_discount_amount))}</span></div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			if (order().order_unique_code) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="flex justify-between text-body-sm"><span class="text-on-surface-variant">Kode Unik</span> <span class="text-on-surface">+${escape_html(formatCurrency(order().order_paid_amount - order().order_total_price))}</span></div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> <div class="flex justify-between pt-2 border-t border-outline-variant"><span class="font-headline-md text-on-surface">${escape_html(order().order_unique_code ? "Total Dibayar" : "Total")}</span> <span class="font-display text-display text-primary">${escape_html(formatCurrency(order().order_unique_code ? order().order_paid_amount : order().order_total_price))}</span></div> `);
			if (order().order_payment_status === "paid") {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="flex justify-between text-body-sm pt-1"><span class="text-on-surface-variant">Status</span> <span class="text-success font-label-md">Lunas</span></div> `);
				if (order().order_payment_code) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<div class="flex justify-between text-body-sm pt-1"><span class="text-on-surface-variant">Kode Pembayaran</span> <span class="text-on-surface font-mono">${escape_html(order().order_payment_code)}</span></div>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]-->`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div></div> `);
			if (order().order_notes) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant"><p class="font-label-md text-label-md text-on-surface-variant uppercase mb-2">Catatan</p> <p class="text-body-sm text-on-surface">${escape_html(order().order_notes)}</p></div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> <div class="bg-surface-container-low p-4 rounded-xl border border-outline-variant"><p class="font-label-md text-label-md text-on-surface-variant uppercase mb-4">Status Order</p> <div class="flex justify-between"><!--[-->`);
			const each_array_1 = ensure_array_like(statusFlow);
			for (let i = 0, $$length = each_array_1.length; i < $$length; i++) {
				let status = each_array_1[i];
				$$renderer.push(`<button type="button" class="flex flex-col items-center gap-1 cursor-pointer"${attr("title", `Set status ke ${stringify(status)}`)}><div${attr_class(`w-8 h-8 rounded-full flex items-center justify-center ${order().order_status === status ? "bg-primary text-on-primary" : statusFlow.indexOf(status) < statusFlow.indexOf(order().order_status) ? "bg-success text-on-primary" : "bg-outline-variant text-on-surface-variant"}`)}>`);
				if (statusFlow.indexOf(status) < statusFlow.indexOf(order().order_status)) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<span class="material-symbols-outlined text-[16px]">check</span>`);
				} else {
					$$renderer.push("<!--[-1-->");
					$$renderer.push(`<span class="text-[10px] font-bold">${escape_html(i + 1)}</span>`);
				}
				$$renderer.push(`<!--]--></div> <span${attr_class(`text-[9px] ${order().order_status === status ? "text-primary font-bold" : "text-on-surface-variant"}`)}>${escape_html(status)}</span></button>`);
			}
			$$renderer.push(`<!--]--></div></div> <div class="flex gap-3">`);
			if (canDelete()) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<form method="POST" action="?/deleteOrder" class="flex-1"><button type="submit" class="w-full h-12 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-label-md active:scale-[0.98] transition-transform flex items-center justify-center gap-2"><span class="material-symbols-outlined text-[18px]">delete</span> Hapus</button></form>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			if (nextStatus()) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<form method="POST" action="?/updateStatus" class="flex-1"><input type="hidden" name="status"${attr("value", nextStatus())}/> <button type="submit" class="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-label-md active:scale-[0.98] transition-transform flex items-center justify-center gap-2">Move to ${escape_html(nextStatus())}</button></form>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			if (order().order_payment_status === "unpaid") {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<button type="button" class="flex-1 h-12 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-label-md active:scale-[0.98] transition-transform flex items-center justify-center gap-2"><span class="material-symbols-outlined text-[18px]">qr_code_2</span> Bayar</button>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div></div> `);
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
	});
}
//#endregion
export { _page as default };
