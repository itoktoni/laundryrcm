import { C as escape_html, S as attr, a as head, c as stringify, i as ensure_array_like, r as derived, t as attr_class } from "../../../chunks/server.js";
import "../../../chunks/forms.js";
import { n as formatDate, t as formatCurrency } from "../../../chunks/utils2.js";
//#region src/routes/inventory/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data } = $$props;
		let editDetailId = null;
		let stockInId = null;
		let stockOutId = null;
		derived(() => data.inventory.filter((i) => (i.total_qty ?? 0) < i.inventory_min_stock));
		head("13oakev", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Inventory - LaundryKu</title>`);
			});
		});
		$$renderer.push(`<div class="space-y-stack-lg"><div class="flex justify-between items-center"><h1 class="font-headline-lg text-headline-lg text-on-surface">Inventory</h1> <div class="flex items-center gap-2"><button class="h-10 px-3 rounded-full bg-blue-600 hover:bg-blue-700 text-sm font-medium text-white transition-colors">${escape_html("Riwayat")}</button> <a href="/inventory/export" class="inline-flex h-10 items-center gap-1 px-3 rounded-full bg-green-600 hover:bg-green-700 text-sm font-medium text-white transition-colors" download=""><span class="material-symbols-outlined text-[18px]">download</span> CSV</a> <button class="w-10 h-10 bg-primary text-on-primary rounded-full flex items-center justify-center active:scale-95 transition-transform"><span class="material-symbols-outlined">${escape_html("add")}</span></button></div></div> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <div class="space-y-3">`);
		if (data.inventory.length === 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<p class="text-body-sm text-on-surface-variant text-center py-8">Belum ada inventory</p>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--[-->`);
			const each_array_1 = ensure_array_like(data.inventory);
			for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
				let item = each_array_1[$$index_1];
				$$renderer.push(`<div${attr_class(`bg-surface-container-lowest p-4 rounded-xl border ${(item.total_qty ?? 0) < item.inventory_min_stock ? "border-error" : "border-outline-variant"}`)}><div class="flex justify-between items-start"><div><div class="flex items-center gap-2"><p class="font-body-md text-on-surface font-semibold">${escape_html(item.inventory_name)}</p> `);
				if ((item.total_qty ?? 0) < item.inventory_min_stock) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<span class="px-2 py-0.5 bg-error-container text-error text-[10px] font-bold rounded">Stok Rendah</span>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></div> <p class="text-label-md text-on-surface-variant">Min: ${escape_html(item.inventory_min_stock)} ${escape_html(item.inventory_unit)} · Restock: ${escape_html(formatDate(item.inventory_last_restocked))}</p> `);
				if (item.inventory_avg_cost > 0) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<p class="text-label-sm text-on-surface-variant">Harga Rata-rata: ${escape_html(formatCurrency(item.inventory_avg_cost))}/${escape_html(item.inventory_unit)}</p>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></div> <div class="text-right"><p class="font-headline-lg text-on-surface">${escape_html(item.total_qty ?? 0)}</p> <p class="text-label-md text-on-surface-variant">${escape_html(item.inventory_unit)}</p> `);
				if (item.inventory_avg_cost > 0) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<p class="text-label-sm text-on-surface-variant">${escape_html(formatCurrency((item.total_qty ?? 0) * item.inventory_avg_cost))}</p>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></div></div> <div class="mt-3 flex items-center gap-2 border-t border-outline-variant pt-3 flex-wrap"><button class="h-9 px-3 rounded-lg bg-green-600 text-white text-label-md font-bold active:scale-95 transition-transform">${escape_html(stockInId === item.inventory_id ? "Batal" : "Masuk")}</button> <button class="h-9 px-3 rounded-lg bg-red-600 text-white text-label-md font-bold active:scale-95 transition-transform">${escape_html(stockOutId === item.inventory_id ? "Batal" : "Keluar")}</button> <button class="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center active:scale-95 transition-transform" title="Edit"><span class="material-symbols-outlined text-[20px]">edit</span></button> <a${attr("href", `/inventory/${stringify(item.inventory_id)}`)} class="w-9 h-9 rounded-lg bg-tertiary/10 text-tertiary flex items-center justify-center active:scale-95 transition-transform" title="Kartu Stok"><span class="material-symbols-outlined text-[20px]">list_alt</span></a> <form method="POST" action="?/delete"><input type="hidden" name="id"${attr("value", item.inventory_id)}/> <button type="submit" class="w-9 h-9 rounded-lg bg-red-600 text-white flex items-center justify-center active:scale-95 transition-transform" title="Hapus"><span class="material-symbols-outlined text-[20px]">delete</span></button></form></div> `);
				if (stockInId === item.inventory_id) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<form method="POST" action="?/stockIn" class="mt-3 space-y-2 bg-green-50 p-3 rounded-lg border border-green-200"><input type="hidden" name="id"${attr("value", item.inventory_id)}/> <p class="text-label-md font-bold text-green-700">Stock In</p> <div class="grid grid-cols-2 gap-2"><div><p class="text-label-sm text-on-surface-variant mb-1">Jumlah (Qty)</p> <input type="number" name="qty" step="0.1" min="0.1" required="" class="w-full h-10 px-4 bg-white border border-outline-variant rounded-lg text-body-sm"/></div> <div><p class="text-label-sm text-on-surface-variant mb-1">Total Harga (Rp)</p> <input type="number" name="cost" step="1" min="0" placeholder="0" class="w-full h-10 px-4 bg-white border border-outline-variant rounded-lg text-body-sm"/></div></div> <div><p class="text-label-sm text-on-surface-variant mb-1">Keterangan</p> <input type="text" name="description" placeholder="Contoh: Beli dari supplier" class="w-full h-10 px-4 bg-white border border-outline-variant rounded-lg text-body-sm"/></div> <button type="submit" class="w-full h-10 bg-green-600 text-white rounded-lg font-bold text-label-md">Simpan Stock In</button></form>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--> `);
				if (stockOutId === item.inventory_id) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<form method="POST" action="?/stockOut" class="mt-3 space-y-2 bg-red-50 p-3 rounded-lg border border-red-200"><input type="hidden" name="id"${attr("value", item.inventory_id)}/> <p class="text-label-md font-bold text-red-700">Stock Out</p> <div><p class="text-label-sm text-on-surface-variant mb-1">Jumlah (Qty)</p> <input type="number" name="qty" step="0.1" min="0.1"${attr("max", item.inventory_quantity)} required="" class="w-full h-10 px-4 bg-white border border-outline-variant rounded-lg text-body-sm"/> <p class="text-label-sm text-on-surface-variant mt-1">Stok tersedia: ${escape_html(item.inventory_quantity)} ${escape_html(item.inventory_unit)}</p></div> <div><p class="text-label-sm text-on-surface-variant mb-1">Keterangan</p> <input type="text" name="description" placeholder="Contoh: Digunakan untuk produksi" class="w-full h-10 px-4 bg-white border border-outline-variant rounded-lg text-body-sm"/></div> <button type="submit" class="w-full h-10 bg-red-600 text-white rounded-lg font-bold text-label-md">Simpan Stock Out</button></form>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--> `);
				if (editDetailId === item.inventory_id) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<form method="POST" action="?/edit" class="mt-3 space-y-2 border-t border-outline-variant pt-3"><input type="hidden" name="id"${attr("value", item.inventory_id)}/> <div><p class="text-label-sm text-on-surface-variant mb-1">Nama Item</p> <input type="text" name="name"${attr("value", item.inventory_name)} required="" class="w-full h-10 px-4 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-sm"/></div> <div class="grid grid-cols-2 gap-2"><div><p class="text-label-sm text-on-surface-variant mb-1">Satuan</p> `);
					$$renderer.select({
						name: "unit",
						value: item.inventory_unit,
						class: "w-full h-10 px-4 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-sm"
					}, ($$renderer) => {
						$$renderer.option({ value: "liter" }, ($$renderer) => {
							$$renderer.push(`Liter`);
						});
						$$renderer.option({ value: "kg" }, ($$renderer) => {
							$$renderer.push(`Kg`);
						});
						$$renderer.option({ value: "pcs" }, ($$renderer) => {
							$$renderer.push(`Pcs`);
						});
					});
					$$renderer.push(`</div> <div><p class="text-label-sm text-on-surface-variant mb-1">Minimum Stok</p> <input type="number" name="min_stock" step="0.1"${attr("value", item.inventory_min_stock)} required="" class="w-full h-10 px-4 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-sm"/></div></div> <button type="submit" class="w-full h-10 bg-primary text-on-primary rounded-lg font-bold text-label-md">Simpan Perubahan</button></form>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></div>`);
			}
			$$renderer.push(`<!--]-->`);
		}
		$$renderer.push(`<!--]--></div></div>`);
	});
}
//#endregion
export { _page as default };
