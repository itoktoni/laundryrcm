import { C as escape_html, S as attr, a as head, i as ensure_array_like } from "../../../chunks/server.js";
import "../../../chunks/forms.js";
import { n as formatDate, t as formatCurrency } from "../../../chunks/utils2.js";
import { t as Button } from "../../../chunks/Button.js";
import { t as Card } from "../../../chunks/Card.js";
import { t as Badge } from "../../../chunks/Badge.js";
//#region src/routes/promo/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data } = $$props;
		let showAddForm = false;
		let editId = null;
		head("m0axm8", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Promo - LaundryKu</title>`);
			});
		});
		$$renderer.push(`<div class="space-y-4"><div class="flex items-center justify-between"><h1 class="text-2xl font-bold text-gray-900 dark:text-white">Promo</h1> <div class="flex gap-2"><a href="/promo/export" class="inline-flex h-9 items-center gap-1 px-3 rounded-lg bg-green-600 hover:bg-green-700 text-sm font-medium text-white transition-colors" download=""><span class="material-symbols-outlined text-[18px]">download</span> CSV</a> `);
		Button($$renderer, {
			onclick: () => showAddForm = !showAddForm,
			children: ($$renderer) => {
				$$renderer.push(`<!---->${escape_html(showAddForm ? "Tutup" : "Promo")}`);
			},
			$$slots: { default: true }
		});
		$$renderer.push(`<!----></div></div> `);
		if (showAddForm) {
			$$renderer.push("<!--[0-->");
			Card($$renderer, {
				class: "border-blue-200 dark:border-blue-800",
				children: ($$renderer) => {
					$$renderer.push(`<h2 class="mb-3 font-semibold text-gray-900 dark:text-white">Buat Promo Baru</h2> <form method="POST" action="?/add" class="space-y-3"><div><label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Nama Promo</label> <input type="text" name="name" required="" class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"/></div> <div class="grid grid-cols-2 gap-2"><div><label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Tipe</label> <select name="type" class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white">`);
					$$renderer.option({ value: "percent" }, ($$renderer) => {
						$$renderer.push(`Persen (%)`);
					});
					$$renderer.option({ value: "nominal" }, ($$renderer) => {
						$$renderer.push(`Nominal (Rp)`);
					});
					$$renderer.push(`</select></div> <div><label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Nilai</label> <input type="number" name="value" step="0.01" required="" class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"/></div></div> <div class="grid grid-cols-2 gap-2"><div><label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Min. Order (Rp)</label> <input type="number" name="min_order" class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"/></div> <div><label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Kode Voucher</label> <input type="text" name="code" class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"/></div></div> <div class="grid grid-cols-2 gap-2"><div><label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Mulai</label> <input type="date" name="start_date" required="" class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"/></div> <div><label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Berakhir</label> <input type="date" name="end_date" required="" class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"/></div></div> `);
					Button($$renderer, {
						type: "submit",
						class: "w-full",
						children: ($$renderer) => {
							$$renderer.push(`<!---->Simpan`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----></form>`);
				},
				$$slots: { default: true }
			});
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (data.promotions.length === 0) {
			$$renderer.push("<!--[0-->");
			Card($$renderer, {
				children: ($$renderer) => {
					$$renderer.push(`<p class="text-center text-sm text-gray-500 dark:text-gray-400">Belum ada promo</p>`);
				},
				$$slots: { default: true }
			});
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div class="space-y-3"><!--[-->`);
			const each_array = ensure_array_like(data.promotions);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let promo = each_array[$$index];
				Card($$renderer, {
					class: !promo.promo_is_active ? "opacity-60" : "",
					children: ($$renderer) => {
						$$renderer.push(`<div class="flex items-start justify-between"><div><div class="flex items-center gap-2"><span class="font-medium text-gray-900 dark:text-white">${escape_html(promo.promo_name)}</span> `);
						Badge($$renderer, {
							variant: promo.promo_is_active ? "success" : "default",
							children: ($$renderer) => {
								$$renderer.push(`<!---->${escape_html(promo.promo_is_active ? "Aktif" : "Nonaktif")}`);
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!----></div> <div class="text-xs text-gray-500 dark:text-gray-400">${escape_html(promo.promo_type === "percent" ? `${promo.promo_value}%` : formatCurrency(promo.promo_value))} `);
						if (promo.promo_min_order) {
							$$renderer.push("<!--[0-->");
							$$renderer.push(`· Min. ${escape_html(formatCurrency(promo.promo_min_order))}`);
						} else $$renderer.push("<!--[-1-->");
						$$renderer.push(`<!--]--> `);
						if (promo.promo_code) {
							$$renderer.push("<!--[0-->");
							$$renderer.push(`· Kode: ${escape_html(promo.promo_code)}`);
						} else $$renderer.push("<!--[-1-->");
						$$renderer.push(`<!--]--></div> <div class="text-xs text-gray-500 dark:text-gray-400">${escape_html(formatDate(promo.promo_start_date))} - ${escape_html(formatDate(promo.promo_end_date))}</div></div> <form method="POST" action="?/toggle"><input type="hidden" name="id"${attr("value", promo.promo_id)}/> `);
						Button($$renderer, {
							type: "submit",
							size: "sm",
							variant: "ghost",
							children: ($$renderer) => {
								$$renderer.push(`<!---->${escape_html(promo.promo_is_active ? "Nonaktifkan" : "Aktifkan")}`);
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!----></form></div> <div class="mt-2 flex gap-2">`);
						Button($$renderer, {
							size: "sm",
							variant: "secondary",
							onclick: () => editId = editId === promo.promo_id ? null : promo.promo_id,
							children: ($$renderer) => {
								$$renderer.push(`<!---->${escape_html(editId === promo.promo_id ? "Batal" : "Edit")}`);
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!----> <form method="POST" action="?/delete"><input type="hidden" name="id"${attr("value", promo.promo_id)}/> `);
						Button($$renderer, {
							type: "submit",
							size: "sm",
							variant: "danger",
							children: ($$renderer) => {
								$$renderer.push(`<!---->Hapus`);
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!----></form></div> `);
						if (editId === promo.promo_id) {
							$$renderer.push("<!--[0-->");
							$$renderer.push(`<form method="POST" action="?/edit" class="mt-3 space-y-2 border-t border-gray-200 dark:border-gray-700 pt-3"><input type="hidden" name="id"${attr("value", promo.promo_id)}/> <input type="text" name="name"${attr("value", promo.promo_name)} required="" placeholder="Nama Promo" class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"/> <div class="grid grid-cols-2 gap-2">`);
							$$renderer.select({
								name: "type",
								value: promo.promo_type,
								class: "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
							}, ($$renderer) => {
								$$renderer.option({ value: "percent" }, ($$renderer) => {
									$$renderer.push(`Persen (%)`);
								});
								$$renderer.option({ value: "nominal" }, ($$renderer) => {
									$$renderer.push(`Nominal (Rp)`);
								});
							});
							$$renderer.push(` <input type="number" name="value" step="0.01"${attr("value", promo.promo_value)} required="" placeholder="Nilai" class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"/></div> <div class="grid grid-cols-2 gap-2"><input type="number" name="min_order"${attr("value", promo.promo_min_order ?? "")} placeholder="Min. Order" class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"/> <input type="text" name="code"${attr("value", promo.promo_code ?? "")} placeholder="Kode Voucher" class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"/></div> <div class="grid grid-cols-2 gap-2"><input type="date" name="start_date"${attr("value", promo.promo_start_date)} required="" class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"/> <input type="date" name="end_date"${attr("value", promo.promo_end_date)} required="" class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"/></div> `);
							Button($$renderer, {
								type: "submit",
								class: "w-full",
								children: ($$renderer) => {
									$$renderer.push(`<!---->Simpan Perubahan`);
								},
								$$slots: { default: true }
							});
							$$renderer.push(`<!----></form>`);
						} else $$renderer.push("<!--[-1-->");
						$$renderer.push(`<!--]-->`);
					},
					$$slots: { default: true }
				});
			}
			$$renderer.push(`<!--]--></div>`);
		}
		$$renderer.push(`<!--]--></div>`);
	});
}
//#endregion
export { _page as default };
