import { S as attr, c as stringify, t as attr_class } from "./server.js";
//#region src/lib/components/ui/Button.svelte
function Button($$renderer, $$props) {
	let { variant = "primary", size = "md", type = "button", disabled = false, onclick, children } = $$props;
	$$renderer.push(`<button${attr("type", type)}${attr("disabled", disabled, true)}${attr_class(`inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${stringify({
		primary: "bg-blue-600 hover:bg-blue-700 text-white",
		secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white",
		danger: "bg-red-600 hover:bg-red-700 text-white",
		ghost: "bg-transparent hover:bg-gray-100 text-gray-700 dark:hover:bg-gray-800 dark:text-gray-300",
		success: "bg-green-600 hover:bg-green-700 text-white",
		warning: "bg-orange-500 hover:bg-orange-600 text-white"
	}[variant])} ${stringify({
		sm: "px-3 py-1.5 text-sm",
		md: "px-4 py-2 text-sm",
		lg: "px-6 py-3 text-base"
	}[size])}`)}>`);
	children($$renderer);
	$$renderer.push(`<!----></button>`);
}
//#endregion
export { Button as t };
