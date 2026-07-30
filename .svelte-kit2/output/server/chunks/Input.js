import { C as attr, r as bind_props, t as attr_class, w as escape_html } from "./server.js";
//#region src/lib/components/ui/Input.svelte
function Input($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { label = "", type = "text", name = "", value = "", placeholder = "", required = false, disabled = false, error = "", id = "" } = $$props;
		$$renderer.push(`<div class="space-y-1.5">`);
		if (label) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<label${attr("for", id)} class="block text-[13px] font-semibold text-on-surface-variant">${escape_html(label)}</label>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <input${attr("type", type)}${attr("id", id)}${attr("name", name)}${attr("placeholder", placeholder)}${attr("required", required, true)}${attr("disabled", disabled, true)}${attr("value", value)}${attr_class(`w-full h-12 rounded-xl border bg-surface-container-lowest px-4 text-[15px] text-on-surface placeholder:text-outline-variant focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15 disabled:opacity-50 transition-all ${error ? "border-error focus:ring-error/15 focus:border-error" : "border-outline-variant"}`)}/> `);
		if (error) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<p class="text-xs font-medium text-error flex items-center gap-1"><span class="material-symbols-outlined text-[14px]">error</span> ${escape_html(error)}</p>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div>`);
		bind_props($$props, { value });
	});
}
//#endregion
export { Input as t };
