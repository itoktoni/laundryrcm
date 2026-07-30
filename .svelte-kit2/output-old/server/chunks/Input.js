import { C as escape_html, S as attr, n as bind_props, t as attr_class } from "./server.js";
//#region src/lib/components/ui/Input.svelte
function Input($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { label = "", type = "text", name = "", value = "", placeholder = "", required = false, disabled = false, error = "", id = "" } = $$props;
		$$renderer.push(`<div class="space-y-1">`);
		if (label) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<label${attr("for", id)} class="block text-sm font-medium text-gray-700 dark:text-gray-300">${escape_html(label)}</label>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <input${attr("type", type)}${attr("id", id)}${attr("name", name)}${attr("placeholder", placeholder)}${attr("required", required, true)}${attr("disabled", disabled, true)}${attr("value", value)}${attr_class(`w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 ${error ? "border-red-500" : ""}`)}/> `);
		if (error) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<p class="text-xs text-red-500">${escape_html(error)}</p>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div>`);
		bind_props($$props, { value });
	});
}
//#endregion
export { Input as t };
