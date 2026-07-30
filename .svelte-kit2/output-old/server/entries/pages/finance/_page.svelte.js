import { C as escape_html, S as attr, a as head, c as stringify, i as ensure_array_like, t as attr_class } from "../../../chunks/server.js";
import "../../../chunks/forms.js";
import { n as formatDate, t as formatCurrency } from "../../../chunks/utils2.js";
//#region src/routes/finance/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data } = $$props;
		let showAdvanced = false;
		let startDateValue = data.filters.startDate || "";
		let endDateValue = data.filters.endDate || "";
		head("1v7szf9", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Keuangan - LaundryKu</title>`);
			});
		});
		$$renderer.push(`<div class="space-y-stack-lg"><div class="grid grid-cols-2 gap-3"><div class="bg-white dark:bg-gray-800 p-4 rounded-xl border-2 border-green-200 dark:border-green-800 shadow-sm"><div class="flex items-center gap-2 mb-2"><div class="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center"><span class="material-symbols-outlined text-success text-lg">arrow_downward</span></div> <p class="font-label-md text-label-md text-on-surface-variant">Pemasukan</p></div> <p class="font-headline-lg text-headline-lg text-success font-bold">${escape_html(formatCurrency(data.summary.income))}</p></div> <div class="bg-white dark:bg-gray-800 p-4 rounded-xl border-2 border-red-200 dark:border-red-800 shadow-sm"><div class="flex items-center gap-2 mb-2"><div class="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center"><span class="material-symbols-outlined text-error text-lg">arrow_upward</span></div> <p class="font-label-md text-label-md text-on-surface-variant">Pengeluaran</p></div> <p class="font-headline-lg text-headline-lg text-error font-bold">${escape_html(formatCurrency(data.summary.expense))}</p></div> <div class="col-span-2 bg-white dark:bg-gray-800 p-4 rounded-xl border-2 border-amber-200 dark:border-amber-800 shadow-sm"><div class="flex items-center gap-2 mb-2"><div class="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center"><span class="material-symbols-outlined text-amber-600 text-lg">schedule</span></div> <p class="font-label-md text-label-md text-on-surface-variant">Piutang (Belum Dibayar)</p></div> <p class="font-headline-lg text-headline-lg text-amber-600 dark:text-amber-400 font-bold">${escape_html(formatCurrency(data.summary.unpaid))}</p></div> <div class="col-span-2 bg-white dark:bg-gray-800 p-4 rounded-xl border-2 border-blue-200 dark:border-blue-800 shadow-sm"><div class="flex items-center gap-2 mb-2"><div class="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center"><span class="material-symbols-outlined text-blue-600 text-lg">trending_up</span></div> <p class="font-label-md text-label-md text-on-surface-variant">Laba Bersih</p></div> <p class="font-headline-lg text-headline-lg text-blue-600 dark:text-blue-400 font-bold">${escape_html(formatCurrency(data.summary.profit))}</p></div></div> <div class="space-y-2"><div class="flex gap-2 overflow-x-auto hide-scrollbar svelte-1v7szf9"><!--[-->`);
		const each_array = ensure_array_like([
			{
				id: "today",
				label: "Hari Ini"
			},
			{
				id: "week",
				label: "Minggu Ini"
			},
			{
				id: "month",
				label: "Bulan Ini"
			}
		]);
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let period = each_array[$$index];
			$$renderer.push(`<button${attr_class(`flex-shrink-0 px-4 py-2 ${!data.filters.startDate && data.filters.period === period.id ? "bg-primary text-on-primary" : "bg-surface-container-high text-on-surface-variant"} rounded-full font-label-md text-label-md active:scale-95 transition-transform`)}>${escape_html(period.label)}</button>`);
		}
		$$renderer.push(`<!--]--> <button${attr_class(`flex-shrink-0 px-4 py-2 ${data.filters.startDate || showAdvanced ? "bg-primary text-on-primary" : "bg-surface-container-high text-on-surface-variant"} rounded-full font-label-md text-label-md active:scale-95 transition-transform flex items-center gap-1`)}><span class="material-symbols-outlined text-[16px]">tune</span> Filter</button></div> `);
		if (data.filters.startDate) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="p-3 bg-surface-container-low rounded-xl border border-outline-variant space-y-3"><p class="font-label-md text-label-md text-on-surface-variant uppercase">Filter Tanggal</p> <div class="grid grid-cols-2 gap-2"><div><label class="text-label-sm text-on-surface-variant">Dari Tanggal</label> <input type="date"${attr("value", startDateValue)} class="w-full h-10 px-3 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-sm mt-1"/></div> <div><label class="text-label-sm text-on-surface-variant">Sampai Tanggal</label> <input type="date"${attr("value", endDateValue)} class="w-full h-10 px-3 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-sm mt-1"/></div></div> <div class="flex gap-2"><button${attr("disabled", !startDateValue || !endDateValue, true)} class="flex-1 h-10 bg-primary text-on-primary rounded-lg font-bold text-label-md active:scale-[0.98] transition-transform disabled:opacity-50">Terapkan</button> `);
			if (data.filters.startDate) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<button class="px-4 h-10 bg-surface-container-high text-on-surface rounded-lg font-bold text-label-md active:scale-[0.98] transition-transform">Reset</button>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div> <div class="flex gap-2"><button${attr_class(`flex-1 h-12 bg-primary text-on-primary rounded-xl font-bold text-label-md active:scale-[0.98] transition-transform flex items-center justify-center gap-2`)}><span class="material-symbols-outlined">${escape_html("add")}</span> ${escape_html("Catat Transaksi")}</button> <a${attr("href", `/api/finance/export?period=${stringify(data.filters.period)}&type=${stringify(data.filters.type)}&start_date=${stringify(data.filters.startDate)}&end_date=${stringify(data.filters.endDate)}`)} class="inline-flex h-12 items-center gap-1 px-4 rounded-xl bg-green-600 hover:bg-green-700 text-sm font-medium text-white transition-colors" download=""><span class="material-symbols-outlined text-[18px]">download</span> CSV</a></div> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <div class="flex gap-2"><button${attr_class(`px-4 py-2 ${data.filters.type === "" ? "bg-primary text-on-primary" : "bg-surface-container-high text-on-surface-variant"} rounded-full text-label-md font-label-md`)}>Semua</button> <button${attr_class(`px-4 py-2 ${data.filters.type === "income" ? "bg-success text-on-primary" : "bg-surface-container-high text-on-surface-variant"} rounded-full text-label-md font-label-md`)}>Masuk</button> <button${attr_class(`px-4 py-2 ${data.filters.type === "expense" ? "bg-error text-on-primary" : "bg-surface-container-high text-on-surface-variant"} rounded-full text-label-md font-label-md`)}>Keluar</button></div> <div class="space-y-3">`);
		if (data.transactions.length === 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<p class="text-body-sm text-on-surface-variant text-center py-8">Belum ada transaksi</p>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--[-->`);
			const each_array_2 = ensure_array_like(data.transactions);
			for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
				let trx = each_array_2[$$index_2];
				$$renderer.push(`<div class="flex items-center justify-between p-4 bg-surface-container-lowest rounded-xl border border-outline-variant"><div class="flex items-center gap-3 min-w-0 flex-1"><div${attr_class(`w-10 h-10 rounded-full ${trx.transaction_type === "income" ? "bg-success/10" : "bg-error-container"} flex items-center justify-center shrink-0`)}><span${attr_class(`material-symbols-outlined ${trx.transaction_type === "income" ? "text-success" : "text-error"}`)}>${escape_html(trx.transaction_type === "income" ? "arrow_downward" : "arrow_upward")}</span></div> <div class="min-w-0"><p class="font-body-md text-on-surface font-semibold truncate">${escape_html(trx.transaction_category)}</p> <p class="text-label-md text-on-surface-variant truncate">${escape_html(formatDate(trx.transaction_date))} ${escape_html(trx.transaction_description ? `· ${trx.transaction_description}` : "")}</p></div></div> <span${attr_class(`font-headline-md ${trx.transaction_type === "income" ? "text-success" : "text-error"} shrink-0 whitespace-nowrap ml-2`)}>${escape_html(trx.transaction_type === "income" ? "+" : "-")}${escape_html(formatCurrency(trx.transaction_amount))}</span></div>`);
			}
			$$renderer.push(`<!--]-->`);
		}
		$$renderer.push(`<!--]--></div></div>`);
	});
}
//#endregion
export { _page as default };
