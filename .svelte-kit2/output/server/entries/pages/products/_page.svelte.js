import { C as attr, a as ensure_array_like, i as derived, o as head, t as attr_class, w as escape_html } from "../../../chunks/server.js";
import "../../../chunks/forms.js";
import { t as formatCurrency } from "../../../chunks/utils2.js";
import "../../../chunks/Button.js";
import "../../../chunks/Card.js";
import "../../../chunks/Badge.js";
//#region src/routes/products/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data, form } = $$props;
		let editId = null;
		let activeFilter = "all";
		let searchValue = data.filters.search;
		const categoryFilters = [{
			id: "all",
			label: "Semua"
		}, ...data.categories.map((c) => ({
			id: c.category_id,
			label: c.category_name
		}))];
		let filtered = derived(() => data.products.filter((p) => {
			return true;
		}));
		let stats = derived(() => ({
			total: data.products.length,
			active: data.products.filter((p) => p.product_is_active).length,
			categories: new Set(data.products.map((p) => p.category_id)).size
		}));
		head("1dj9mz1", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Produk - LaundryKu</title>`);
			});
		});
		$$renderer.push(`<div class="space-y-stack-lg"><div class="flex items-center justify-between"><h1 class="font-headline-lg text-headline-lg text-on-surface">Produk</h1> <button class="w-10 h-10 bg-primary text-on-primary rounded-full flex items-center justify-center active:scale-95 transition-transform"><span class="material-symbols-outlined">${escape_html("add")}</span></button></div> <div class="grid grid-cols-3 gap-stack-sm"><div class="bg-surface-container-highest p-4 rounded-xl border border-outline-variant"><p class="font-display text-display text-primary font-bold">${escape_html(stats().total)}</p> <p class="text-label-md text-on-surface-variant">Total</p></div> <div class="bg-surface-container-highest p-4 rounded-xl border border-outline-variant"><p class="font-display text-display text-success font-bold">${escape_html(stats().active)}</p> <p class="text-label-md text-on-surface-variant">Aktif</p></div> <div class="bg-surface-container-highest p-4 rounded-xl border border-outline-variant"><p class="font-display text-display text-secondary font-bold">${escape_html(stats().categories)}</p> <p class="text-label-md text-on-surface-variant">Kategori</p></div></div> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <div class="relative w-full"><span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant">search</span> <form method="GET"><input name="search"${attr("value", searchValue)} class="w-full h-12 pl-10 pr-4 bg-surface-container-low border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-body-md placeholder-outline-variant transition-all" placeholder="Cari nama, kategori, atau deskripsi..." type="text"/></form></div> <div class="flex gap-2 overflow-x-auto hide-scrollbar svelte-1dj9mz1"><!--[-->`);
		const each_array_1 = ensure_array_like(categoryFilters);
		for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
			let f = each_array_1[$$index_1];
			$$renderer.push(`<button${attr_class(`flex-shrink-0 px-5 py-2 rounded-full font-label-md text-label-md active:scale-95 transition-all ${activeFilter === f.id ? "bg-primary text-on-primary" : "bg-surface-container-high text-on-surface-variant"}`)}>${escape_html(f.label)}</button>`);
		}
		$$renderer.push(`<!--]--></div> `);
		if (form?.error) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<p class="text-body-sm text-error">${escape_html(form.error)}</p>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <div class="space-y-3">`);
		if (filtered().length === 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="flex flex-col items-center py-16 text-center"><div class="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center"><span class="material-symbols-outlined text-[32px] text-outline-variant">inventory_2</span></div> <p class="mt-3 text-body-sm text-on-surface-variant">Tidak ada produk</p></div>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--[-->`);
			const each_array_2 = ensure_array_like(filtered());
			for (let $$index_3 = 0, $$length = each_array_2.length; $$index_3 < $$length; $$index_3++) {
				let product = each_array_2[$$index_3];
				$$renderer.push(`<div${attr_class(`bg-surface-container-lowest p-4 rounded-xl border ${!product.product_is_active ? "border-outline-variant opacity-60" : "border-outline-variant"}`)}><div class="flex items-start justify-between"><div class="flex-1 min-w-0"><div class="flex items-center gap-2 flex-wrap"><span class="font-body-md text-on-surface font-semibold truncate">${escape_html(product.product_name)}</span> <span${attr_class(`px-2 py-0.5 rounded-full text-[10px] font-bold ${product.product_is_active ? "bg-success/10 text-success" : "bg-surface-container-high text-on-surface-variant"}`)}>${escape_html(product.product_is_active ? "Aktif" : "Nonaktif")}</span></div> <div class="text-body-sm mt-1"><span class="font-headline-md text-primary">${escape_html(formatCurrency(product.product_price))}</span> <span class="text-on-surface-variant">/ ${escape_html(product.product_unit)}</span></div> `);
				if (product.category_name) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<span class="inline-block mt-1.5 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold">${escape_html(product.category_name)}</span>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--> `);
				if (product.product_description) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<p class="text-label-sm text-on-surface-variant mt-1 line-clamp-2 svelte-1dj9mz1">${escape_html(product.product_description)}</p>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></div></div> <div class="mt-3 flex items-center gap-2 border-t border-outline-variant pt-3"><form method="POST" action="?/toggle"><input type="hidden" name="id"${attr("value", product.product_id)}/> <button type="submit"${attr_class(`h-9 px-3 rounded-lg text-label-md font-bold ${product.product_is_active ? "bg-error-container text-error" : "bg-success/10 text-success"} active:scale-95 transition-transform`)}>${escape_html(product.product_is_active ? "Nonaktifkan" : "Aktifkan")}</button></form> <button class="h-9 px-3 rounded-lg bg-surface-container-high text-on-surface-variant text-label-md font-bold active:scale-95 transition-transform">${escape_html(editId === product.product_id ? "Batal" : "Edit")}</button> <form method="POST" action="?/delete"><input type="hidden" name="id"${attr("value", product.product_id)}/> <button type="submit" class="h-9 px-3 rounded-lg bg-red-600 text-white text-label-md font-bold active:scale-95 transition-transform">Hapus</button></form></div> `);
				if (editId === product.product_id) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<form method="POST" action="?/edit" class="mt-3 space-y-2 border-t border-outline-variant pt-3"><input type="hidden" name="id"${attr("value", product.product_id)}/> <input type="text" name="name"${attr("value", product.product_name)} required="" placeholder="Nama Produk" class="w-full h-11 px-4 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-sm"/> <div class="grid grid-cols-2 gap-2"><input type="number" name="price" step="0.01"${attr("value", product.product_price)} required="" placeholder="Harga" class="h-11 px-4 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-sm"/> <input type="text" name="unit"${attr("value", product.product_unit)} required="" placeholder="Satuan" class="h-11 px-4 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-sm"/></div> <div class="grid grid-cols-2 gap-2">`);
					$$renderer.select({
						name: "category_id",
						value: product.category_id || "",
						class: "h-11 px-4 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-sm"
					}, ($$renderer) => {
						$$renderer.option({ value: "" }, ($$renderer) => {
							$$renderer.push(`Pilih kategori`);
						});
						$$renderer.push(`<!--[-->`);
						const each_array_3 = ensure_array_like(data.categories);
						for (let $$index_2 = 0, $$length = each_array_3.length; $$index_2 < $$length; $$index_2++) {
							let cat = each_array_3[$$index_2];
							$$renderer.option({ value: cat.category_id }, ($$renderer) => {
								$$renderer.push(`${escape_html(cat.category_name)}`);
							});
						}
						$$renderer.push(`<!--]-->`);
					});
					$$renderer.push(` `);
					$$renderer.select({
						name: "is_active",
						value: String(product.product_is_active),
						class: "h-11 px-4 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-sm"
					}, ($$renderer) => {
						$$renderer.option({ value: "1" }, ($$renderer) => {
							$$renderer.push(`Aktif`);
						});
						$$renderer.option({ value: "0" }, ($$renderer) => {
							$$renderer.push(`Nonaktif`);
						});
					});
					$$renderer.push(`</div> <input type="text" name="description"${attr("value", product.product_description ?? "")} placeholder="Deskripsi" class="w-full h-11 px-4 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-sm"/> <button type="submit" class="w-full h-11 bg-primary text-on-primary rounded-lg font-bold text-label-md">Simpan Perubahan</button></form>`);
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
