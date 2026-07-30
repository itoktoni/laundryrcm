import { C as escape_html, S as attr, a as head, i as ensure_array_like, t as attr_class } from "../../../chunks/server.js";
import { t as formatCurrency } from "../../../chunks/utils2.js";
import { t as Button } from "../../../chunks/Button.js";
import { t as Card } from "../../../chunks/Card.js";
//#region src/routes/reports/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data } = $$props;
		let start = data.filters.start || "";
		let end = data.filters.end || "";
		function go(url) {
			window.location.href = url.toString();
		}
		function applyCustom() {
			if (!start || !end) return;
			const url = new URL(window.location.href);
			url.searchParams.set("period", "custom");
			url.searchParams.set("start", start);
			url.searchParams.set("end", end);
			go(url);
		}
		head("2pp8mk", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Laporan - LaundryKu</title>`);
			});
		});
		$$renderer.push(`<div class="space-y-4"><div class="flex items-center justify-between"><h1 class="text-2xl font-bold text-gray-900 dark:text-white">Laporan</h1> <button class="inline-flex h-10 items-center gap-1 px-3 rounded-full bg-green-600 hover:bg-green-700 text-sm font-medium text-white transition-colors"><span class="material-symbols-outlined text-[18px]">download</span> CSV</button></div> <div class="flex gap-2 overflow-x-auto pb-2"><!--[-->`);
		const each_array = ensure_array_like([
			"today",
			"week",
			"month"
		]);
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let period = each_array[$$index];
			$$renderer.push(`<button${attr_class(`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium ${data.filters.period === period ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"}`)}>${escape_html(period === "today" ? "Hari Ini" : period === "week" ? "Minggu Ini" : "Bulan Ini")}</button>`);
		}
		$$renderer.push(`<!--]--> <button${attr_class(`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium ${data.filters.period === "custom" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"}`)}>Custom</button></div> `);
		if (data.filters.period === "custom") {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="flex flex-col gap-2 rounded-xl border border-gray-200 p-3 dark:border-gray-700 sm:flex-row sm:items-end"><div class="flex-1"><label class="mb-1 block text-xs text-gray-500 dark:text-gray-400">Tanggal Mulai</label> <input type="date"${attr("value", start)} class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"/></div> <div class="flex-1"><label class="mb-1 block text-xs text-gray-500 dark:text-gray-400">Tanggal Akhir</label> <input type="date"${attr("value", end)} class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"/></div> `);
			Button($$renderer, {
				variant: "secondary",
				onclick: applyCustom,
				children: ($$renderer) => {
					$$renderer.push(`<!---->Terapkan`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		Card($$renderer, {
			class: "border border-outline-variant",
			children: ($$renderer) => {
				$$renderer.push(`<h2 class="mb-3 font-semibold text-gray-900 dark:text-white">Ringkasan Order</h2> <div class="space-y-2"><div class="flex justify-between text-sm"><span class="text-gray-500 dark:text-gray-400">Total Order</span> <span class="font-medium text-gray-900 dark:text-white">${escape_html(data.orders.count)}</span></div> <div class="flex justify-between text-sm"><span class="text-gray-500 dark:text-gray-400">Total Omset</span> <span class="font-medium text-gray-900 dark:text-white">${escape_html(formatCurrency(data.orders.total))}</span></div> <div class="flex justify-between text-sm"><span class="text-gray-500 dark:text-gray-400">Sudah Terbayar</span> <span class="font-medium text-green-600">${escape_html(formatCurrency(data.orders.paid))}</span></div> <div class="flex justify-between border-t border-gray-200 pt-2 text-sm dark:border-gray-700"><span class="text-gray-500 dark:text-gray-400">Belum Terbayar</span> <span class="font-semibold text-red-600">${escape_html(formatCurrency(data.orders.total - data.orders.paid))}</span></div></div>`);
			},
			$$slots: { default: true }
		});
		$$renderer.push(`<!----> `);
		Card($$renderer, {
			class: "border border-outline-variant",
			children: ($$renderer) => {
				$$renderer.push(`<h2 class="mb-3 font-semibold text-gray-900 dark:text-white">Ringkasan Keuangan</h2> <div class="space-y-2"><div class="flex justify-between text-sm"><span class="text-gray-500 dark:text-gray-400">Pemasukan</span> <span class="font-medium text-green-600">${escape_html(formatCurrency(data.finance.income))}</span></div> <div class="flex justify-between text-sm"><span class="text-gray-500 dark:text-gray-400">Pengeluaran</span> <span class="font-medium text-red-600">${escape_html(formatCurrency(data.finance.expense))}</span></div> <div class="flex justify-between border-t border-gray-200 pt-2 dark:border-gray-700"><span class="font-semibold text-gray-900 dark:text-white">Laba Bersih</span> <span${attr_class(`font-bold ${data.finance.income - data.finance.expense >= 0 ? "text-green-600" : "text-red-600"}`)}>${escape_html(formatCurrency(data.finance.income - data.finance.expense))}</span></div></div>`);
			},
			$$slots: { default: true }
		});
		$$renderer.push(`<!----> `);
		Card($$renderer, {
			class: "border border-outline-variant",
			children: ($$renderer) => {
				$$renderer.push(`<h2 class="mb-3 font-semibold text-gray-900 dark:text-white">Pelanggan</h2> <div class="flex justify-between text-sm"><span class="text-gray-500 dark:text-gray-400">Pelanggan Baru</span> <span class="font-medium text-gray-900 dark:text-white">${escape_html(data.customers.count)}</span></div>`);
			},
			$$slots: { default: true }
		});
		$$renderer.push(`<!----></div>`);
	});
}
//#endregion
export { _page as default };
