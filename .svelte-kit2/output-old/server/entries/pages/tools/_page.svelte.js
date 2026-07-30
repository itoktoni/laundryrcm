import { C as escape_html, S as attr, a as head, c as stringify, i as ensure_array_like, t as attr_class } from "../../../chunks/server.js";
//#region src/routes/tools/+page.svelte
function _page($$renderer) {
	const tools = [
		{
			href: "/tools/calculator/omset",
			icon: "trending_up",
			title: "Kalkulator Omset",
			description: "Hitung target omset, harga jual, dan profit",
			color: "bg-primary-fixed text-on-primary-fixed"
		},
		{
			href: "/tools/calculator/harga",
			icon: "sell",
			title: "Kalkulator Harga",
			description: "Tentukan harga jual per kg",
			color: "bg-warning/10 text-warning"
		},
		{
			href: "/tools/calculator/sdm",
			icon: "group",
			title: "Kalkulator SDM",
			description: "Hitung jumlah karyawan ideal",
			color: "bg-tertiary-fixed text-on-tertiary-fixed"
		},
		{
			href: "/tools/calculator/profit",
			icon: "account_balance",
			title: "Kalkulator Profit",
			description: "Laba bersih, BEP, margin",
			color: "bg-success/10 text-success"
		}
	];
	head("171l7w4", $$renderer, ($$renderer) => {
		$$renderer.title(($$renderer) => {
			$$renderer.push(`<title>Tools - LaundryKu</title>`);
		});
	});
	$$renderer.push(`<div class="space-y-stack-lg"><div><h1 class="font-headline-lg text-headline-lg text-on-surface">Tools</h1> <p class="text-body-sm text-on-surface-variant">Kalkulator &amp; estimasi bisnis laundry</p></div> <div class="grid grid-cols-2 gap-stack-sm"><!--[-->`);
	const each_array = ensure_array_like(tools);
	for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
		let tool = each_array[$$index];
		$$renderer.push(`<a${attr("href", tool.href)} class="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant active:scale-[0.98] transition-transform hover:bg-surface-container-low"><div${attr_class(`w-10 h-10 rounded-lg ${stringify(tool.color)} flex items-center justify-center mb-3`)}><span class="material-symbols-outlined text-[20px]">${escape_html(tool.icon)}</span></div> <h3 class="font-body-md text-on-surface font-semibold mb-1">${escape_html(tool.title)}</h3> <p class="text-label-md text-on-surface-variant leading-tight">${escape_html(tool.description)}</p></a>`);
	}
	$$renderer.push(`<!--]--></div></div>`);
}
//#endregion
export { _page as default };
