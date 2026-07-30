import { C as attr, a as ensure_array_like, o as head, w as escape_html } from "../../../chunks/server.js";
import "../../../chunks/forms.js";
//#region src/routes/categories/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data, form } = $$props;
		let editId = null;
		head("13grsjl", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Kategori - LaundryKu</title>`);
			});
		});
		$$renderer.push(`<div class="space-y-stack-lg"><div class="flex items-center justify-between"><h1 class="font-headline-lg text-headline-lg text-on-surface">Kategori</h1> <button class="w-10 h-10 bg-primary text-on-primary rounded-full flex items-center justify-center active:scale-95 transition-transform"><span class="material-symbols-outlined">${escape_html("add")}</span></button></div> <div class="grid grid-cols-2 gap-stack-sm"><div class="bg-surface-container-highest p-4 rounded-xl border border-outline-variant"><p class="font-display text-display text-primary font-bold">${escape_html(data.categories.length)}</p> <p class="text-label-md text-on-surface-variant">Total Kategori</p></div> <div class="bg-surface-container-highest p-4 rounded-xl border border-outline-variant"><p class="font-display text-display text-secondary font-bold">${escape_html(data.categories.reduce((sum, c) => sum + (c.product_count || 0), 0))}</p> <p class="text-label-md text-on-surface-variant">Total Produk</p></div></div> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (form?.error) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<p class="text-body-sm text-error">${escape_html(form.error)}</p>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <div class="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden"><div class="grid grid-cols-12 gap-2 px-4 py-3 bg-surface-container-high text-label-md text-on-surface-variant font-bold"><div class="col-span-5">Nama Kategori</div> <div class="col-span-4 text-center">Produk</div> <div class="col-span-3 text-right">Aksi</div></div> `);
		if (data.categories.length === 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="flex flex-col items-center py-16 text-center"><div class="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center"><span class="material-symbols-outlined text-[32px] text-outline-variant">category</span></div> <p class="mt-3 text-body-sm text-on-surface-variant">Belum ada kategori</p></div>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--[-->`);
			const each_array = ensure_array_like(data.categories);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let cat = each_array[$$index];
				$$renderer.push(`<div class="grid grid-cols-12 gap-2 px-4 py-3 items-center border-t border-outline-variant text-body-sm"><div class="col-span-5">`);
				if (editId === cat.category_id) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<form method="POST" action="?/edit" class="flex gap-1"><input type="hidden" name="id"${attr("value", cat.category_id)}/> <input type="text" name="name"${attr("value", cat.category_name)} required="" class="flex-1 h-9 px-3 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-sm"/> <button type="submit" class="h-9 px-2 bg-success text-white rounded-lg text-label-sm font-bold active:scale-95 transition-transform"><span class="material-symbols-outlined text-[16px]">check</span></button></form>`);
				} else {
					$$renderer.push("<!--[-1-->");
					$$renderer.push(`<span class="font-body-md text-on-surface font-semibold">${escape_html(cat.category_name)}</span>`);
				}
				$$renderer.push(`<!--]--></div> <div class="col-span-4 text-center"><span class="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-bold">${escape_html(cat.product_count || 0)}</span></div> <div class="col-span-3 flex items-end justify-end gap-1">`);
				if (editId === cat.category_id) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<button class="h-8 px-2 rounded-lg bg-surface-container-high text-on-surface-variant text-label-sm font-bold active:scale-95 transition-transform">Batal</button>`);
				} else {
					$$renderer.push("<!--[-1-->");
					$$renderer.push(`<button class="h-8 px-2 rounded-lg bg-surface-container-high text-on-surface-variant text-label-sm font-bold active:scale-95 transition-transform"><span class="material-symbols-outlined text-[16px]">edit</span></button> <form method="POST" action="?/delete"><input type="hidden" name="id"${attr("value", cat.category_id)}/> <button type="submit" class="h-8 px-2 rounded-lg bg-error-container text-error text-label-sm font-bold active:scale-95 transition-transform"><span class="material-symbols-outlined text-[16px]">delete</span></button></form>`);
				}
				$$renderer.push(`<!--]--></div></div>`);
			}
			$$renderer.push(`<!--]-->`);
		}
		$$renderer.push(`<!--]--></div></div>`);
	});
}
//#endregion
export { _page as default };
