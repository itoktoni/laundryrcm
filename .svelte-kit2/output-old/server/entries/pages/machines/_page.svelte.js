import { C as escape_html, S as attr, a as head, i as ensure_array_like } from "../../../chunks/server.js";
import "../../../chunks/forms.js";
import { n as formatDate } from "../../../chunks/utils2.js";
import { t as Button } from "../../../chunks/Button.js";
import { t as Card } from "../../../chunks/Card.js";
import { t as Badge } from "../../../chunks/Badge.js";
//#region src/routes/machines/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data } = $$props;
		let showAddForm = false;
		let serviceForm = {
			id: null,
			description: "",
			cost: "",
			notes: "",
			nextService: ""
		};
		let historyVisible = {};
		const statusColors = {
			active: "success",
			broken: "danger",
			maintenance: "warning"
		};
		const statusLabels = {
			active: "Aktif",
			broken: "Rusak",
			maintenance: "Maintenance"
		};
		const types = [
			"Mesin Cuci",
			"Pengering",
			"Setrika Uap",
			"Setrika Biasa",
			"Lainnya"
		];
		head("cmni6b", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Mesin &amp; Aset - LaundryKu</title>`);
			});
		});
		$$renderer.push(`<div class="space-y-4"><div class="flex items-center justify-between"><h1 class="text-2xl font-bold text-gray-900 dark:text-white">Mesin</h1> <div class="flex gap-2"><a href="/machines/export" class="inline-flex h-9 items-center gap-1 px-3 rounded-lg bg-green-600 hover:bg-green-700 text-sm font-medium text-white transition-colors" download=""><span class="material-symbols-outlined text-[18px]">download</span> CSV</a> `);
		Button($$renderer, {
			onclick: () => showAddForm = !showAddForm,
			children: ($$renderer) => {
				$$renderer.push(`<!---->${escape_html(showAddForm ? "Tutup" : "+ Tambah")}`);
			},
			$$slots: { default: true }
		});
		$$renderer.push(`<!----></div></div> `);
		if (showAddForm) {
			$$renderer.push("<!--[0-->");
			Card($$renderer, {
				class: "border-blue-200 dark:border-blue-800",
				children: ($$renderer) => {
					$$renderer.push(`<h2 class="mb-3 font-semibold text-gray-900 dark:text-white">Tambah Mesin</h2> <form method="POST" action="?/add" class="space-y-3"><div><label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Nama Mesin</label> <input type="text" name="name" required="" class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"/></div> <div><label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Tipe</label> <select name="type" class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"><!--[-->`);
					const each_array = ensure_array_like(types);
					for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
						let t = each_array[$$index];
						$$renderer.option({ value: t }, ($$renderer) => {
							$$renderer.push(`${escape_html(t)}`);
						});
					}
					$$renderer.push(`<!--]--></select></div> <div><label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Jadwal Servis Berikutnya</label> <input type="date" name="next_service" class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"/></div> `);
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
		if (data.machines.length === 0) {
			$$renderer.push("<!--[0-->");
			Card($$renderer, {
				children: ($$renderer) => {
					$$renderer.push(`<p class="text-center text-sm text-gray-500 dark:text-gray-400">Belum ada mesin terdaftar</p>`);
				},
				$$slots: { default: true }
			});
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div class="space-y-3"><!--[-->`);
			const each_array_1 = ensure_array_like(data.machines);
			for (let $$index_2 = 0, $$length = each_array_1.length; $$index_2 < $$length; $$index_2++) {
				let machine = each_array_1[$$index_2];
				Card($$renderer, {
					children: ($$renderer) => {
						$$renderer.push(`<div class="flex items-start justify-between"><div><div class="flex items-center gap-2"><span class="font-medium text-gray-900 dark:text-white">${escape_html(machine.machine_name)}</span> `);
						Badge($$renderer, {
							variant: statusColors[machine.machine_status],
							children: ($$renderer) => {
								$$renderer.push(`<!---->${escape_html(statusLabels[machine.machine_status])}`);
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!----></div> <div class="text-xs text-gray-500 dark:text-gray-400">${escape_html(machine.machine_type)}</div> <div class="mt-1 text-xs text-gray-500 dark:text-gray-400">Servis terakhir: ${escape_html(formatDate(machine.machine_last_service) || "Belum ada")}</div> `);
						if (machine.machine_next_service) {
							$$renderer.push("<!--[0-->");
							$$renderer.push(`<div class="text-xs text-gray-500 dark:text-gray-400">Servis berikutnya: ${escape_html(formatDate(machine.machine_next_service))}</div>`);
						} else $$renderer.push("<!--[-1-->");
						$$renderer.push(`<!--]--></div></div> <div class="mt-3 flex gap-2">`);
						if (machine.machine_status !== "active") {
							$$renderer.push("<!--[0-->");
							$$renderer.push(`<form method="POST" action="?/updateStatus"><input type="hidden" name="id"${attr("value", machine.machine_id)}/> <input type="hidden" name="status" value="active"/> `);
							Button($$renderer, {
								type: "submit",
								size: "sm",
								variant: "success",
								children: ($$renderer) => {
									$$renderer.push(`<!---->Aktifkan`);
								},
								$$slots: { default: true }
							});
							$$renderer.push(`<!----></form>`);
						} else $$renderer.push("<!--[-1-->");
						$$renderer.push(`<!--]--> `);
						if (machine.machine_status !== "broken") {
							$$renderer.push("<!--[0-->");
							$$renderer.push(`<form method="POST" action="?/updateStatus"><input type="hidden" name="id"${attr("value", machine.machine_id)}/> <input type="hidden" name="status" value="broken"/> `);
							Button($$renderer, {
								type: "submit",
								size: "sm",
								variant: "danger",
								children: ($$renderer) => {
									$$renderer.push(`<!---->Rusak`);
								},
								$$slots: { default: true }
							});
							$$renderer.push(`<!----></form>`);
						} else $$renderer.push("<!--[-1-->");
						$$renderer.push(`<!--]--> `);
						if (machine.machine_status !== "maintenance") {
							$$renderer.push("<!--[0-->");
							$$renderer.push(`<form method="POST" action="?/updateStatus"><input type="hidden" name="id"${attr("value", machine.machine_id)}/> <input type="hidden" name="status" value="maintenance"/> `);
							Button($$renderer, {
								type: "submit",
								size: "sm",
								variant: "secondary",
								children: ($$renderer) => {
									$$renderer.push(`<!---->Perbaikan`);
								},
								$$slots: { default: true }
							});
							$$renderer.push(`<!----></form>`);
						} else $$renderer.push("<!--[-1-->");
						$$renderer.push(`<!--]--> `);
						Button($$renderer, {
							type: "button",
							size: "sm",
							variant: "warning",
							onclick: () => serviceForm = {
								id: machine.machine_id,
								description: "",
								cost: "",
								notes: "",
								nextService: machine.machine_next_service || ""
							},
							children: ($$renderer) => {
								$$renderer.push(`<!---->Service`);
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!----> `);
						Button($$renderer, {
							type: "button",
							size: "sm",
							variant: "secondary",
							onclick: () => historyVisible[machine.machine_id] = !historyVisible[machine.machine_id],
							children: ($$renderer) => {
								$$renderer.push(`<!---->Log`);
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!----></div> `);
						if (historyVisible[machine.machine_id]) {
							$$renderer.push("<!--[0-->");
							$$renderer.push(`<div class="mt-3 border-t border-outline-variant pt-3"><h3 class="text-label-md font-semibold text-on-surface-variant mb-2">Riwayat Servis</h3> `);
							if (data.services.filter((s) => s.machine_id === machine.machine_id).length === 0) {
								$$renderer.push("<!--[0-->");
								$$renderer.push(`<p class="text-xs text-gray-500 dark:text-gray-400">Belum ada riwayat servis</p>`);
							} else {
								$$renderer.push("<!--[-1-->");
								$$renderer.push(`<div class="space-y-2"><!--[-->`);
								const each_array_2 = ensure_array_like(data.services.filter((s) => s.machine_id === machine.machine_id));
								for (let $$index_1 = 0, $$length = each_array_2.length; $$index_1 < $$length; $$index_1++) {
									let service = each_array_2[$$index_1];
									$$renderer.push(`<div class="p-3 bg-surface-container-lowest rounded-lg border border-outline-variant"><div class="flex items-start justify-between"><div class="flex-1"><p class="text-body-sm font-medium text-on-surface">${escape_html(service.service_description)}</p> <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">${escape_html(new Date(service.service_date).toLocaleString("id-ID"))}</div> `);
									if (service.service_cost > 0) {
										$$renderer.push("<!--[0-->");
										$$renderer.push(`<div class="text-xs text-gray-500 dark:text-gray-400">Biaya: Rp ${escape_html(service.service_cost.toLocaleString("id-ID"))}</div>`);
									} else $$renderer.push("<!--[-1-->");
									$$renderer.push(`<!--]--> `);
									if (service.service_notes) {
										$$renderer.push("<!--[0-->");
										$$renderer.push(`<div class="text-xs text-gray-500 dark:text-gray-400">Catatan: ${escape_html(service.service_notes)}</div>`);
									} else $$renderer.push("<!--[-1-->");
									$$renderer.push(`<!--]--></div></div></div>`);
								}
								$$renderer.push(`<!--]--></div>`);
							}
							$$renderer.push(`<!--]--></div>`);
						} else $$renderer.push("<!--[-1-->");
						$$renderer.push(`<!--]--> `);
						if (serviceForm.id === machine.machine_id) {
							$$renderer.push("<!--[0-->");
							$$renderer.push(`<form method="POST" action="?/recordService" class="mt-3 space-y-2 border-t border-outline-variant pt-3"><input type="hidden" name="id"${attr("value", machine.machine_id)}/> <div><p class="text-label-sm text-on-surface-variant mb-1">Keterangan Kerusakan / Pekerjaan</p> <textarea name="description" required="" rows="2" class="w-full px-3 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-sm">`);
							const $$body = escape_html(serviceForm.description);
							if ($$body) $$renderer.push(`${$$body}`);
							$$renderer.push(`</textarea></div> <div class="grid grid-cols-2 gap-2"><div><p class="text-label-sm text-on-surface-variant mb-1">Biaya (Rp)</p> <input type="number" name="cost" step="0.01"${attr("value", serviceForm.cost)} class="w-full h-10 px-3 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-sm"/></div> <div><p class="text-label-sm text-on-surface-variant mb-1">Servis Berikutnya</p> <input type="date" name="next_service"${attr("value", serviceForm.nextService)} class="w-full h-10 px-3 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-sm"/></div></div> <div><p class="text-label-sm text-on-surface-variant mb-1">Catatan Tambahan</p> <input type="text" name="notes"${attr("value", serviceForm.notes)} class="w-full h-10 px-3 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-sm"/></div> <div class="flex gap-2"><button type="submit" class="flex-1 h-10 bg-warning text-on-warning rounded-lg font-bold text-label-md">Simpan</button> <button type="button" class="px-4 h-10 bg-surface-container-high text-on-surface-variant rounded-lg text-label-md font-bold">Batal</button></div></form>`);
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
