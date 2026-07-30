import { n as onDestroy } from "./index-server.js";
import { C as escape_html, S as attr, n as bind_props, r as derived, t as attr_class } from "./server.js";
import "./forms.js";
import { t as formatCurrency } from "./utils2.js";
//#region src/lib/components/ui/QrisModal.svelte
function QrisModal($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { open = false, amount = 0, orderId = null, onPaid, onConfirm } = $$props;
		let secondsLeft = 300;
		let pollTimer;
		let countdownTimer;
		let timeLabel = derived(() => `${String(Math.floor(secondsLeft / 60)).padStart(2, "0")}:${String(secondsLeft % 60).padStart(2, "0")}`);
		function stopTimers() {
			clearInterval(pollTimer);
			clearInterval(countdownTimer);
		}
		onDestroy(stopTimers);
		if (open) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="fixed inset-0 z-[60] bg-black/50 svelte-9dki9n"></div> <div class="fixed bottom-0 left-0 right-0 z-[60] bg-surface rounded-t-2xl shadow-lg animate-slide-up svelte-9dki9n" style="margin-bottom: -10px;"><div class="flex justify-center pt-3 pb-2 svelte-9dki9n"><div class="w-10 h-1 bg-outline-variant rounded-full svelte-9dki9n"></div></div> `);
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div class="px-container-margin pb-8 svelte-9dki9n"><div class="flex items-center justify-between pb-4 border-b border-outline-variant svelte-9dki9n"><h2 class="font-headline-md text-headline-md text-on-surface svelte-9dki9n">Pembayaran QRIS</h2> <button type="button" class="w-8 h-8 rounded-full flex items-center justify-center hover:bg-surface-container-high active:scale-95 transition-transform svelte-9dki9n"><span class="material-symbols-outlined text-on-surface-variant svelte-9dki9n">close</span></button></div> <div class="flex flex-col items-center py-6 mt-8 svelte-9dki9n">`);
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div class="w-40 h-40 bg-white border-2 border-outline-variant rounded-xl flex items-center justify-center p-2 svelte-9dki9n"><canvas class="svelte-9dki9n"></canvas></div>`);
			$$renderer.push(`<!--]--> <div class="text-center svelte-9dki9n"><p class="text-label-md text-on-surface-variant mt-12 svelte-9dki9n">Total Pembayaran</p> `);
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<p class="font-display text-display text-primary font-bold svelte-9dki9n">${escape_html(formatCurrency(amount))}</p>`);
			$$renderer.push(`<!--]--></div> <p class="mt-2 text-label-md text-on-surface-variant text-center svelte-9dki9n">Scan QRIS di atas menggunakan aplikasi pembayaran</p> <div${attr_class(`mt-4 flex items-center gap-2 text-on-surface-variant`, "svelte-9dki9n")}><span class="material-symbols-outlined text-[18px] svelte-9dki9n">timer</span> `);
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<span class="font-headline-md text-headline-md tabular-nums svelte-9dki9n">${escape_html(timeLabel())}</span>`);
			$$renderer.push(`<!--]--></div> `);
			if (orderId) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="mt-2 flex items-center gap-1 text-label-sm text-on-surface-variant svelte-9dki9n"><span class="material-symbols-outlined text-[14px] animate-spin svelte-9dki9n">progress_activity</span> Menunggu pembayaran otomatis...</div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div> <div class="flex gap-3 svelte-9dki9n"><button type="button" class="flex-1 h-12 bg-surface-container-high text-on-surface rounded-xl font-bold text-label-md active:scale-[0.98] transition-transform svelte-9dki9n">Batal</button> `);
			if (orderId) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<form method="POST"${attr("action", `/orders/${orderId}?/markPaid`)} class="flex-1 svelte-9dki9n"><input type="hidden" name="paid_amount"${attr("value", amount)} class="svelte-9dki9n"/> <input type="hidden" name="unique_code"${attr("value", "")} class="svelte-9dki9n"/> <input type="hidden" name="payment_method" value="qris" class="svelte-9dki9n"/> <button type="submit" class="w-full h-12 bg-success text-on-primary rounded-xl font-bold text-label-md active:scale-[0.98] transition-transform flex items-center justify-center gap-2 svelte-9dki9n"><span class="material-symbols-outlined text-[18px] svelte-9dki9n">check_circle</span> Sudah Bayar</button></form> <form method="POST"${attr("action", `/orders/${orderId}?/markPaid`)} class="flex-1 svelte-9dki9n"><input type="hidden" name="paid_amount"${attr("value", amount)} class="svelte-9dki9n"/> <input type="hidden" name="unique_code" value="" class="svelte-9dki9n"/> <input type="hidden" name="payment_method" value="cash" class="svelte-9dki9n"/> <button type="submit" class="w-full h-12 bg-primary text-on-primary rounded-xl font-bold text-label-md active:scale-[0.98] transition-transform flex items-center justify-center gap-2 svelte-9dki9n"><span class="material-symbols-outlined text-[18px] svelte-9dki9n">payments</span> Bayar Cash</button></form>`);
			} else {
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`<button type="button" class="flex-1 h-12 bg-success text-on-primary rounded-xl font-bold text-label-md active:scale-[0.98] transition-transform flex items-center justify-center gap-2 svelte-9dki9n"><span class="material-symbols-outlined text-[18px] svelte-9dki9n">check_circle</span> Sudah Bayar</button>`);
			}
			$$renderer.push(`<!--]--></div></div>`);
			$$renderer.push(`<!--]--></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
		bind_props($$props, { open });
	});
}
//#endregion
export { QrisModal as t };
