import { l as stringify, t as attr_class } from "./server.js";
//#region src/lib/components/ui/Card.svelte
function Card($$renderer, $$props) {
	let { children, class: className = "", padding = "p-4" } = $$props;
	$$renderer.push(`<div${attr_class(`app-card ${stringify(padding)} ${stringify(className)}`)}>`);
	children($$renderer);
	$$renderer.push(`<!----></div>`);
}
//#endregion
export { Card as t };
