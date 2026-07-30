import { C as attr, a as ensure_array_like, o as head, w as escape_html } from "../../../../chunks/server.js";
import "../../../../chunks/forms.js";
//#region src/routes/tools/sop/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data, form } = $$props;
		let editId = null;
		head("1de7pa1", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Template SOP - LaundryKu</title>`);
			});
		});
		$$renderer.push(`<div class="space-y-stack-lg"><div class="flex items-center justify-between"><div><h1 class="font-headline-lg text-headline-lg text-on-surface">Template SOP</h1> <p class="text-body-sm text-on-surface-variant">Kelola &amp; download SOP operasional</p></div> <button class="px-4 h-11 bg-primary text-on-primary rounded-lg font-bold text-label-md active:scale-95 transition-transform">${escape_html("+ Template")}</button></div> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (form?.error) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<p class="text-body-sm text-error">${escape_html(form.error)}</p>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (data.templates.length === 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<p class="text-body-sm text-on-surface-variant text-center py-8">Belum ada template</p>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div class="grid grid-cols-1 md:grid-cols-2 gap-stack-md"><!--[-->`);
			const each_array = ensure_array_like(data.templates);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let t = each_array[$$index];
				$$renderer.push(`<div class="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant">`);
				if (editId === t.template_id) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<form method="POST" action="?/edit" class="space-y-3"><input type="hidden" name="id"${attr("value", t.template_id)}/> <input name="name"${attr("value", t.template_name)} required="" class="w-full h-11 px-3 bg-surface-container-low border border-outline-variant rounded-lg text-body-sm"/> <textarea name="description" rows="8" class="w-full p-3 bg-surface-container-low border border-outline-variant rounded-lg text-body-sm font-mono">`);
					const $$body = escape_html(t.template_description);
					if ($$body) $$renderer.push(`${$$body}`);
					$$renderer.push(`</textarea> <div class="flex gap-2"><button type="submit" class="flex-1 h-10 bg-primary text-on-primary rounded-lg font-bold text-label-md">Simpan</button> <button type="button" class="px-4 h-10 bg-surface-container-high text-on-surface-variant rounded-lg text-label-md">Batal</button></div></form>`);
				} else {
					$$renderer.push("<!--[-1-->");
					$$renderer.push(`<div class="flex items-start justify-between gap-2"><h2 class="font-headline-md text-headline-md text-on-surface">${escape_html(t.template_name)}</h2> <div class="flex gap-1 shrink-0"><button class="p-1.5 rounded-lg text-outline hover:bg-surface-container-high transition-colors" aria-label="Edit"><span class="material-symbols-outlined text-[18px]">edit</span></button> <form method="POST" action="?/delete"><input type="hidden" name="id"${attr("value", t.template_id)}/> <button type="submit" class="p-1.5 rounded-lg text-outline hover:bg-error-container hover:text-error transition-colors" aria-label="Hapus"><span class="material-symbols-outlined text-[18px]">delete</span></button></form></div></div> <pre class="mt-2 whitespace-pre-wrap text-body-sm text-on-surface-variant bg-surface-container-low rounded-lg p-3 max-h-48 overflow-auto">${escape_html(t.template_description)}</pre> <div class="mt-3 flex gap-2"><button class="flex-1 h-10 bg-surface-container-high text-on-surface rounded-lg text-label-md font-bold active:scale-[0.98] transition-transform">TXT</button> <button class="flex-1 h-10 bg-red-600 hover:bg-red-700 text-white rounded-lg text-label-md font-bold active:scale-[0.98] transition-transform">PDF</button></div>`);
				}
				$$renderer.push(`<!--]--></div>`);
			}
			$$renderer.push(`<!--]--></div>`);
		}
		$$renderer.push(`<!--]--></div>`);
	});
}
//#endregion
export { _page as default };
