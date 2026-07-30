import { C as escape_html, S as attr, a as head, r as derived } from "../../../../../chunks/server.js";
//#region src/routes/tools/calculator/sdm/+page.svelte
function _page($$renderer) {
	let volumeHari = 100;
	let kapasitasKaryawan = 30;
	let jumlahKaryawan = derived(() => Math.ceil(volumeHari / kapasitasKaryawan));
	head("lj3cei", $$renderer, ($$renderer) => {
		$$renderer.title(($$renderer) => {
			$$renderer.push(`<title>Kalkulator SDM - LaundryKu</title>`);
		});
	});
	$$renderer.push(`<div class="space-y-stack-lg"><div class="flex items-center gap-2"><a href="/tools/calculator" class="text-on-surface-variant" aria-label="Kembali"><span class="material-symbols-outlined">arrow_back</span></a> <h1 class="font-headline-lg text-headline-lg text-on-surface">SDM Ideal</h1></div> <div class="bg-surface-container-low p-4 rounded-xl border border-outline-variant space-y-4"><div><label class="text-label-md text-on-surface-variant">Volume Cucian / Hari (kg)</label> <input type="number"${attr("value", volumeHari)} class="w-full h-11 px-4 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-sm mt-1"/></div> <div><label class="text-label-md text-on-surface-variant">Kapasitas per Karyawan (kg/hari)</label> <input type="number"${attr("value", kapasitasKaryawan)} class="w-full h-11 px-4 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-sm mt-1"/></div></div> <div class="bg-primary-container p-8 rounded-xl text-center"><p class="font-display text-display text-on-primary-container font-bold">${escape_html(jumlahKaryawan())}</p> <p class="text-body-md text-on-primary-container">Karyawan Ideal</p></div></div>`);
}
//#endregion
export { _page as default };
