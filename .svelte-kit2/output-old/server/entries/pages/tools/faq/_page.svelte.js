import { C as escape_html, S as attr, a as head, i as ensure_array_like, t as attr_class } from "../../../../chunks/server.js";
import "../../../../chunks/forms.js";
//#region src/routes/tools/faq/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data, form } = $$props;
		let editId = null;
		let openId = null;
		head("1s98p2v", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>FAQ - LaundryKu</title>`);
			});
		});
		$$renderer.push(`<div class="space-y-stack-lg"><div class="flex items-center justify-between"><div><h1 class="font-headline-lg text-headline-lg text-on-surface">FAQ</h1> <p class="text-body-sm text-on-surface-variant">Pertanyaan yang sering diajukan</p></div> <button class="px-4 h-11 bg-primary text-on-primary rounded-lg font-bold text-label-md active:scale-95 transition-transform">${escape_html("+ FAQ")}</button></div> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (form?.error) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<p class="text-body-sm text-error">${escape_html(form.error)}</p>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (data.faqs.length === 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<p class="text-body-sm text-on-surface-variant text-center py-8">Belum ada FAQ</p>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div class="space-y-3"><!--[-->`);
			const each_array = ensure_array_like(data.faqs);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let f = each_array[$$index];
				$$renderer.push(`<div class="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden">`);
				if (editId === f.faq_id) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<form method="POST" action="?/edit" class="p-4 space-y-3"><input type="hidden" name="id"${attr("value", f.faq_id)}/> <input name="question"${attr("value", f.faq_question)} required="" class="w-full h-11 px-3 bg-surface-container-low border border-outline-variant rounded-lg text-body-sm"/> <textarea name="answer" rows="4" class="w-full p-3 bg-surface-container-low border border-outline-variant rounded-lg text-body-sm">`);
					const $$body = escape_html(f.faq_answer);
					if ($$body) $$renderer.push(`${$$body}`);
					$$renderer.push(`</textarea> <div class="flex gap-2"><button type="submit" class="flex-1 h-10 bg-primary text-on-primary rounded-lg font-bold text-label-md">Simpan</button> <button type="button" class="px-4 h-10 bg-surface-container-high text-on-surface-variant rounded-lg text-label-md">Batal</button></div></form>`);
				} else {
					$$renderer.push("<!--[-1-->");
					$$renderer.push(`<div class="flex items-center"><button class="flex-1 flex items-center justify-between gap-2 p-4 text-left"><span class="font-body-md text-on-surface font-semibold">${escape_html(f.faq_question)}</span> <span${attr_class(`material-symbols-outlined text-on-surface-variant transition-transform ${openId === f.faq_id ? "rotate-180" : ""}`)}>expand_more</span></button> <div class="flex gap-1 pr-3 shrink-0"><button class="p-1.5 rounded-lg text-outline hover:bg-surface-container-high transition-colors" aria-label="Edit"><span class="material-symbols-outlined text-[18px]">edit</span></button> <form method="POST" action="?/delete"><input type="hidden" name="id"${attr("value", f.faq_id)}/> <button type="submit" class="p-1.5 rounded-lg text-outline hover:bg-error-container hover:text-error transition-colors" aria-label="Hapus"><span class="material-symbols-outlined text-[18px]">delete</span></button></form></div></div> `);
					if (openId === f.faq_id) {
						$$renderer.push("<!--[0-->");
						$$renderer.push(`<p class="px-4 pb-4 -mt-1 whitespace-pre-wrap text-body-sm text-on-surface-variant">${escape_html(f.faq_answer)}</p>`);
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]-->`);
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
