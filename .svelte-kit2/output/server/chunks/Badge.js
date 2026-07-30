import { l as stringify, t as attr_class } from "./server.js";
//#region src/lib/components/ui/Badge.svelte
function Badge($$renderer, $$props) {
	let { variant = "default", children } = $$props;
	$$renderer.push(`<span${attr_class(`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${stringify({
		default: "bg-surface-container-high text-on-surface-variant",
		primary: "bg-primary/10 text-primary",
		success: "bg-success/10 text-success",
		warning: "bg-warning/10 text-warning",
		danger: "bg-error/10 text-error"
	}[variant])}`)}>`);
	children($$renderer);
	$$renderer.push(`<!----></span>`);
}
//#endregion
export { Badge as t };
