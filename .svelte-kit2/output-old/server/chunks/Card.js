import { c as stringify, t as attr_class } from "./server.js";
//#region src/lib/components/ui/Card.svelte
function Card($$renderer, $$props) {
	let { children, class: className = "" } = $$props;
	$$renderer.push(`<div${attr_class(`rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 ${stringify(className)}`)}>`);
	children($$renderer);
	$$renderer.push(`<!----></div>`);
}
//#endregion
export { Card as t };
