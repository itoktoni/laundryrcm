import { C as escape_html, a as head, i as ensure_array_like, r as derived, t as attr_class } from "../../../../chunks/server.js";
import { t as formatCurrency } from "../../../../chunks/utils2.js";
//#region src/routes/inventory/[id]/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data } = $$props;
		let item = derived(() => data.item);
		let movements = derived(() => data.movements);
		head("wnumrz", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Kartu Stok - ${escape_html(item().inventory_name)} - LaundryKu</title>`);
			});
		});
		$$renderer.push(`<div class="space-y-stack-lg"><div class="flex items-center gap-3"><a href="/inventory" class="w-10 h-10 bg-surface-container-low rounded-full flex items-center justify-center hover:bg-surface-container transition-colors"><span class="material-symbols-outlined">arrow_back</span></a> <div><h1 class="font-headline-lg text-headline-lg text-on-surface">Kartu Stok</h1> <p class="text-body-sm text-on-surface-variant">${escape_html(item().inventory_name)}</p></div></div> <div class="grid grid-cols-3 gap-3"><div class="bg-surface-container-low p-4 rounded-xl border border-outline-variant text-center"><p class="text-label-sm text-on-surface-variant mb-1">Stok Tersedia</p> <p class="text-headline-sm text-on-surface font-bold">${escape_html(item().currentQty)}</p> <p class="text-body-xs text-on-surface-variant">${escape_html(item().inventory_unit)}</p></div> <div class="bg-surface-container-low p-4 rounded-xl border border-outline-variant text-center"><p class="text-label-sm text-on-surface-variant mb-1">Hrg Rata-rata</p> <p class="text-headline-sm text-on-surface font-bold">${escape_html(formatCurrency(item().currentAvg))}</p> <p class="text-body-xs text-on-surface-variant">per ${escape_html(item().inventory_unit)}</p></div> <div class="bg-surface-container-low p-4 rounded-xl border border-outline-variant text-center"><p class="text-label-sm text-on-surface-variant mb-1">Hrg Total</p> <p class="text-headline-sm text-primary font-bold">${escape_html(formatCurrency(item().currentValue))}</p> <p class="text-body-xs text-on-surface-variant">${escape_html(item().currentQty)} × ${escape_html(formatCurrency(item().currentAvg))}</p></div></div> <div class="bg-surface-container-low rounded-xl border border-outline-variant overflow-hidden"><div class="p-4 border-b border-outline-variant"><h2 class="font-title-md text-title-md text-on-surface">Riwayat Pergerakan Stok</h2></div> `);
		if (movements().length === 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="p-8 text-center"><span class="material-symbols-outlined text-4xl text-on-surface-variant">inventory_2</span> <p class="text-body-md text-on-surface-variant mt-2">Belum ada riwayat pergerakan stok</p></div>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div class="overflow-x-auto"><table class="w-full text-sm"><thead><tr class="border-b border-outline-variant bg-surface-container"><th class="px-4 py-3 text-left text-label-sm text-on-surface-variant font-medium">#</th><th class="px-4 py-3 text-left text-label-sm text-on-surface-variant font-medium">Tanggal</th><th class="px-4 py-3 text-left text-label-sm text-on-surface-variant font-medium">UOM</th><th class="px-4 py-3 text-left text-label-sm text-on-surface-variant font-medium">Tipe</th><th class="px-4 py-3 text-right text-label-sm text-on-surface-variant font-medium">Qty</th><th class="px-4 py-3 text-right text-label-sm text-on-surface-variant font-medium">Nominal</th><th class="px-4 py-3 text-right text-label-sm text-on-surface-variant font-medium">Rata-rata</th><th class="px-4 py-3 text-right text-label-sm text-on-surface-variant font-medium">Saldo</th></tr></thead><tbody><!--[-->`);
			const each_array = ensure_array_like(movements());
			for (let i = 0, $$length = each_array.length; i < $$length; i++) {
				let m = each_array[i];
				$$renderer.push(`<tr class="border-b border-outline-variant last:border-0 hover:bg-surface-container-lowest transition-colors"><td class="px-4 py-3 text-body-sm text-on-surface">${escape_html(movements().length - i)}</td><td class="px-4 py-3 text-body-sm text-on-surface">${escape_html(new Date(m.movement_date).toLocaleDateString("id-ID"))}</td><td class="px-4 py-3 text-body-sm text-on-surface-variant">${escape_html(item().inventory_unit)}</td><td class="px-4 py-3"><span${attr_class(`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-label-xs font-medium ${m.movement_type === "in" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`)}><span class="material-symbols-outlined text-[14px]">${escape_html(m.movement_type === "in" ? "add_circle" : "remove_circle")}</span> ${escape_html(m.movement_type === "in" ? "Masuk" : "Keluar")}</span></td><td${attr_class(`px-4 py-3 text-right text-body-sm font-medium ${m.movement_type === "in" ? "text-green-600" : "text-red-600"}`)}>${escape_html(m.movement_type === "in" ? "+" : "-")}${escape_html(parseFloat(m.movement_qty))}</td><td class="px-4 py-3 text-right text-body-sm text-on-surface">${escape_html(formatCurrency(parseFloat(m.nominal)))}</td><td class="px-4 py-3 text-right text-body-sm text-on-surface-variant">${escape_html(formatCurrency(m.rata_rata))}</td><td class="px-4 py-3 text-right text-body-sm font-medium text-on-surface">${escape_html(m.running_qty)}</td></tr>`);
			}
			$$renderer.push(`<!--]--></tbody></table></div>`);
		}
		$$renderer.push(`<!--]--></div></div>`);
	});
}
//#endregion
export { _page as default };
