import { C as attr, a as ensure_array_like, i as derived, o as head, w as escape_html } from "../../../../../chunks/server.js";
import { t as formatCurrency } from "../../../../../chunks/utils2.js";
//#region src/routes/tools/calculator/harga/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let hargaListrik = 5e5;
		let hargaAir = 3e5;
		let hargaChemical = 2e5;
		let hargaSewa = 2e6;
		let hargaGaji = 4e6;
		let hargaLain = 5e5;
		let targetKg = 500;
		let totalBiaya = derived(() => hargaListrik + hargaAir + hargaChemical + hargaSewa + hargaGaji + hargaLain);
		let hargaJual = derived(() => Math.ceil(totalBiaya() / targetKg));
		let hargaJualProfit = derived(() => Math.ceil(hargaJual() * 1.3));
		const biaya = [
			{
				label: "Listrik",
				get: () => hargaListrik,
				set: (v) => hargaListrik = v
			},
			{
				label: "Air",
				get: () => hargaAir,
				set: (v) => hargaAir = v
			},
			{
				label: "Chemical",
				get: () => hargaChemical,
				set: (v) => hargaChemical = v
			},
			{
				label: "Sewa",
				get: () => hargaSewa,
				set: (v) => hargaSewa = v
			},
			{
				label: "Gaji Karyawan",
				get: () => hargaGaji,
				set: (v) => hargaGaji = v
			},
			{
				label: "Biaya Lain",
				get: () => hargaLain,
				set: (v) => hargaLain = v
			}
		];
		head("wv22h5", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Kalkulator Harga Jual - LaundryKu</title>`);
			});
		});
		$$renderer.push(`<div class="space-y-stack-lg"><div class="flex items-center gap-2"><a href="/tools/calculator" class="text-on-surface-variant" aria-label="Kembali"><span class="material-symbols-outlined">arrow_back</span></a> <h1 class="font-headline-lg text-headline-lg text-on-surface">Harga Jual per Kg</h1></div> <div class="bg-surface-container-low p-4 rounded-xl border border-outline-variant space-y-4"><p class="font-label-md text-label-md text-on-surface-variant uppercase">Biaya Operasional / Bulan</p> <!--[-->`);
		const each_array = ensure_array_like(biaya);
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let item = each_array[$$index];
			$$renderer.push(`<div><label class="text-label-md text-on-surface-variant">${escape_html(item.label)}</label> <input type="number"${attr("value", item.get())} class="w-full h-11 px-4 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-sm mt-1"/></div>`);
		}
		$$renderer.push(`<!--]--> <div><label class="text-label-md text-on-surface-variant">Target Volume (kg/bulan)</label> <input type="number"${attr("value", targetKg)} class="w-full h-11 px-4 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-sm mt-1"/></div></div> <div class="bg-primary-container p-4 rounded-xl space-y-3"><div class="flex justify-between"><span class="text-body-sm text-on-primary-container">Total Biaya</span> <span class="font-bold text-on-primary-container">${escape_html(formatCurrency(totalBiaya()))}</span></div> <div class="flex justify-between"><span class="text-body-sm text-on-primary-container">Harga Jual Minimum/kg</span> <span class="font-headline-md text-on-primary-container">${escape_html(formatCurrency(hargaJual()))}</span></div> <div class="flex justify-between border-t border-on-primary-container/20 pt-3"><span class="text-body-sm text-on-primary-container">Harga Jual + 30% Profit/kg</span> <span class="font-display text-display text-on-primary-container">${escape_html(formatCurrency(hargaJualProfit()))}</span></div></div></div>`);
	});
}
//#endregion
export { _page as default };
