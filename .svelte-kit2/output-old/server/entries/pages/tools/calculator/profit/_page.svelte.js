import { C as escape_html, S as attr, a as head, r as derived, t as attr_class } from "../../../../../chunks/server.js";
import { t as formatCurrency } from "../../../../../chunks/utils2.js";
//#region src/routes/tools/calculator/profit/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let omsetBulan = 15e6;
		let totalBiayaProfit = 1e7;
		let labaBersih = derived(() => omsetBulan - totalBiayaProfit);
		let margin = derived(() => (labaBersih() / omsetBulan * 100).toFixed(1));
		let bep = derived(() => labaBersih() > 0 ? Math.ceil(totalBiayaProfit / (labaBersih() / omsetBulan)) : 0);
		head("1b7bc24", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Kalkulator Profit - LaundryKu</title>`);
			});
		});
		$$renderer.push(`<div class="space-y-stack-lg"><div class="flex items-center gap-2"><a href="/tools/calculator" class="text-on-surface-variant" aria-label="Kembali"><span class="material-symbols-outlined">arrow_back</span></a> <h1 class="font-headline-lg text-headline-lg text-on-surface">Profit &amp; BEP</h1></div> <div class="bg-surface-container-low p-4 rounded-xl border border-outline-variant space-y-4"><div><label class="text-label-md text-on-surface-variant">Omset / Bulan</label> <input type="number"${attr("value", omsetBulan)} class="w-full h-11 px-4 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-sm mt-1"/></div> <div><label class="text-label-md text-on-surface-variant">Total Biaya / Bulan</label> <input type="number"${attr("value", totalBiayaProfit)} class="w-full h-11 px-4 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-sm mt-1"/></div></div> <div class="grid grid-cols-2 gap-stack-sm"><div${attr_class(`bg-${labaBersih() >= 0 ? "success" : "error"}/10 p-4 rounded-xl border border-outline-variant text-center`)}><p${attr_class(`font-headline-lg ${labaBersih() >= 0 ? "text-success" : "text-error"}`)}>${escape_html(formatCurrency(labaBersih()))}</p> <p class="text-label-md text-on-surface-variant">Laba Bersih</p></div> <div class="bg-surface-container-highest p-4 rounded-xl border border-outline-variant text-center"><p class="font-headline-lg text-on-surface">${escape_html(margin())}%</p> <p class="text-label-md text-on-surface-variant">Margin</p></div> <div class="col-span-2 bg-warning/10 p-4 rounded-xl border border-outline-variant text-center"><p class="font-headline-lg text-warning">${escape_html(formatCurrency(bep()))}</p> <p class="text-label-md text-on-surface-variant">BEP (Omset Impas)</p></div></div></div>`);
	});
}
//#endregion
export { _page as default };
