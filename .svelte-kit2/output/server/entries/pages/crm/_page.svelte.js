import { C as attr, a as ensure_array_like, i as derived, l as stringify, o as head, t as attr_class, w as escape_html } from "../../../chunks/server.js";
import "../../../chunks/forms.js";
import { r as formatDateTime, t as formatCurrency } from "../../../chunks/utils2.js";
//#region src/routes/crm/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data, form } = $$props;
		let activeTab = "all";
		const tabs = [
			{
				id: "all",
				label: "Semua"
			},
			{
				id: "inactive",
				label: "Tidak Aktif"
			},
			{
				id: "pending",
				label: "Belum Diambil"
			}
		];
		const statusColors = {
			pending: "bg-pending",
			cuci: "bg-primary",
			kering: "bg-kering",
			setrika: "bg-setrika",
			selesai: "bg-success",
			diambil: "bg-secondary"
		};
		function initials(name) {
			return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
		}
		const filteredInactive = derived(() => data.inactiveCustomers.filter((c) => {
			return true;
		}));
		const filteredPending = derived(() => data.pendingPickupOrders.filter((o) => {
			return true;
		}));
		const filteredActivity = derived(() => data.recentActivity.filter((a) => {
			return true;
		}));
		head("8nqzdj", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>CRM - LaundryKu</title>`);
			});
		});
		$$renderer.push(`<div class="space-y-stack-lg"><div class="flex items-end justify-between gap-3"><div><h1 class="font-headline-lg text-headline-lg text-on-surface">CRM</h1> <p class="text-body-sm text-on-surface-variant">Customer Relationship Management</p></div> <button type="button" class="inline-flex items-center gap-2 h-11 px-4 bg-surface-container-low border border-outline-variant rounded-xl font-bold text-label-md active:scale-95 transition-transform shrink-0"><span class="material-symbols-outlined text-[20px]">filter_list</span> <span class="hidden sm:inline">${escape_html("Filter")}</span></button></div> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <div class="grid grid-cols-2 md:grid-cols-4 gap-stack-sm"><div class="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 text-center"><p class="font-display text-display text-primary font-bold">${escape_html(data.stats.total_customers)}</p> <p class="text-label-sm text-on-surface-variant">Total Pelanggan</p></div> <div class="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 text-center"><p class="font-display text-display text-warning font-bold">${escape_html(data.stats.vip_count)}</p> <p class="text-label-sm text-on-surface-variant">VIP</p></div> <div class="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 text-center"><p class="font-display text-display text-success font-bold">${escape_html(data.stats.new_customers)}</p> <p class="text-label-sm text-on-surface-variant">Baru</p></div> <div class="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 text-center"><p class="font-display text-display text-secondary font-bold">${escape_html(Math.round(data.stats.vip_percentage))}%</p> <p class="text-label-sm text-on-surface-variant">Persentase VIP</p></div></div> <div class="flex gap-2 overflow-x-auto no-scrollbar svelte-8nqzdj"><!--[-->`);
		const each_array = ensure_array_like(tabs);
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let tab = each_array[$$index];
			$$renderer.push(`<button${attr_class(`px-5 py-2.5 rounded-full font-label-md text-label-md whitespace-nowrap active:scale-95 transition-all ${activeTab === tab.id ? "bg-primary text-on-primary" : "bg-surface-container-high text-on-surface-variant"}`)}>${escape_html(tab.label)}</button>`);
		}
		$$renderer.push(`<!--]--></div> `);
		if (filteredPending().length > 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div><h2 class="font-label-md text-label-md text-on-surface font-bold uppercase tracking-wider mb-stack-sm">Pesanan Belum Diambil</h2> <div class="space-y-3"><!--[-->`);
			const each_array_1 = ensure_array_like(filteredPending());
			for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
				let order = each_array_1[$$index_1];
				$$renderer.push(`<a${attr("href", `/orders/${stringify(order.order_id)}`)} class="block bg-surface-container-lowest p-4 rounded-xl border border-outline-variant hover:border-primary hover:shadow-md transition-all"><div class="flex justify-between items-start"><div class="flex-1"><div class="flex items-center gap-2 mb-1"><span class="font-headline-md text-primary">${escape_html(formatCurrency(order.order_total_price))}</span> <span${attr_class(`w-2 h-2 rounded-full ${stringify(statusColors[order.order_status])}`, "svelte-8nqzdj")}></span></div> <p class="text-label-sm text-on-surface-variant">${escape_html(order.customer_name)}</p> <p class="text-label-sm text-on-surface-variant">${escape_html(order.order_unique_code || order.order_id.slice(-6))}</p> `);
				if (order.order_notes) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<p class="text-body-sm text-secondary mt-1">${escape_html(order.order_notes)}</p>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></div> <div class="flex flex-col items-end gap-1 ml-3"><span class="text-label-sm text-on-surface-variant">${escape_html(formatDateTime(order.order_created_at))}</span> <span class="px-2 py-1 bg-surface-container-high rounded-full text-label-sm text-secondary">Lihat Detail</span></div></div></a>`);
			}
			$$renderer.push(`<!--]--></div></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (filteredInactive().length > 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div><h2 class="font-label-md text-label-md text-on-surface font-bold uppercase tracking-wider mb-stack-sm">Pelanggan Tidak Aktif</h2> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-stack-md"><!--[-->`);
			const each_array_2 = ensure_array_like(filteredInactive());
			for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
				let customer = each_array_2[$$index_2];
				$$renderer.push(`<a${attr("href", `/customers/${stringify(customer.customer_id)}`)} class="block bg-surface-container-lowest p-4 rounded-xl border border-outline-variant hover:border-primary hover:shadow-md transition-all"><div class="flex items-center gap-3 mb-3"><div${attr_class(`w-12 h-12 rounded-full ${customer.customer_vip ? "bg-warning/20 text-warning" : "bg-primary-fixed text-on-primary-fixed"} flex items-center justify-center font-bold text-headline-md shrink-0`)}>${escape_html(initials(customer.customer_name))}</div> <div class="flex-1 min-w-0"><h3 class="font-headline-md text-on-surface leading-tight truncate">${escape_html(customer.customer_name)}</h3> <p class="text-label-sm text-on-surface-variant truncate">${escape_html(customer.customer_phone)}</p></div></div> <div class="border-t border-outline-variant pt-3"><div class="flex items-center justify-between"><div class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container-high text-secondary"><span class="text-label-sm font-label-md">${escape_html(Math.round(customer.days_since_last_order))} hari</span></div> <span class="material-symbols-outlined text-outline">chevron_right</span></div></div></a>`);
			}
			$$renderer.push(`<!--]--></div></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (filteredActivity().length > 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div><h2 class="font-label-md text-label-md text-on-surface font-bold uppercase tracking-wider mb-stack-sm">Aktivitas Terkini</h2> <div class="space-y-3"><!--[-->`);
			const each_array_3 = ensure_array_like(filteredActivity());
			for (let $$index_3 = 0, $$length = each_array_3.length; $$index_3 < $$length; $$index_3++) {
				let activity = each_array_3[$$index_3];
				$$renderer.push(`<div class="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant"><div class="flex items-center justify-between"><div class="flex items-center gap-3"><div class="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center shrink-0"><span class="material-symbols-outlined text-[20px] text-secondary">${escape_html(activity.activity_type === "customer_inactive" ? "timer_off" : "schedule")}</span></div> <div><p class="text-label-md text-on-surface font-bold">${escape_html(activity.activity_type === "customer_inactive" ? "Pelanggan Tidak Aktif" : "Pesanan Belum Diambil")}</p> <p class="text-body-sm text-on-surface-variant">`);
				if (activity.activity_type === "customer_inactive") {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`${escape_html(activity.customer_name)} - ${escape_html(Math.round(activity.days_diff))} hari`);
				} else if (activity.activity_type === "pending_pickup") {
					$$renderer.push("<!--[1-->");
					$$renderer.push(`${escape_html(activity.customer_name)} <br/> ${escape_html(activity.customer_phone)}`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></p></div></div> <div class="text-right"><p class="text-label-sm text-on-surface-variant">${escape_html(formatDateTime(activity.created_at))}</p> `);
				if (activity.activity_type === "customer_inactive") {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<a${attr("href", `/customers/${stringify(activity.customer_id)}`)} class="text-label-sm text-primary hover:underline">Lihat Pelanggan</a>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></div></div></div>`);
			}
			$$renderer.push(`<!--]--></div></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (filteredInactive().length === 0 && filteredPending().length === 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="flex flex-col items-center py-16 text-center"><div class="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center"><span class="material-symbols-outlined text-[32px] text-outline-variant">check_circle</span></div> <p class="mt-3 text-body-sm text-on-surface-variant">Semua pelanggan aktif</p></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div>`);
	});
}
//#endregion
export { _page as default };
