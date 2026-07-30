import { C as escape_html, S as attr, a as head, c as stringify, i as ensure_array_like, r as derived, t as attr_class } from "../../../../chunks/server.js";
import "../../../../chunks/forms.js";
import { n as formatDate, t as formatCurrency } from "../../../../chunks/utils2.js";
//#region src/routes/customers/[id]/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data, form } = $$props;
		let customer = derived(() => data.customer);
		let orders = derived(() => data.orders);
		let totalSpent = derived(() => data.totalSpent);
		const statusColors = {
			pending: "bg-pending",
			cuci: "bg-primary",
			kering: "bg-kering",
			setrika: "bg-setrika",
			selesai: "bg-success",
			diambil: "bg-secondary"
		};
		head("9iyriu", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>${escape_html(customer().customer_name)} - LaundryKu</title>`);
			});
		});
		$$renderer.push(`<div class="space-y-stack-lg"><div class="flex items-center gap-4"><div${attr_class(`w-16 h-16 rounded-full ${customer().customer_vip ? "bg-warning/20 text-warning" : "bg-primary-fixed text-on-primary-fixed"} flex items-center justify-center font-bold text-display`)}>${escape_html(customer().customer_name.split(" ").map((n) => n[0]).join("").slice(0, 2))}</div> <div class="flex-1"><div class="flex items-center gap-2"><h1 class="font-headline-lg text-headline-lg text-on-surface">${escape_html(customer().customer_name)}</h1> `);
		if (customer().customer_vip) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<span class="px-2 py-0.5 bg-warning text-on-surface text-[10px] font-bold rounded uppercase tracking-wider">VIP</span>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div> <p class="text-body-sm text-on-surface-variant">${escape_html(customer().customer_phone)}</p> `);
		if (customer().customer_address) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<p class="text-label-md text-on-surface-variant">${escape_html(customer().customer_address)}</p>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div> <button class="active:opacity-70" aria-label="Edit pelanggan"><span class="material-symbols-outlined text-on-surface-variant">${escape_html("edit")}</span></button></div> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <div class="grid grid-cols-2 gap-stack-sm"><div class="bg-surface-container-highest p-4 rounded-xl border border-outline-variant text-center"><p class="font-display text-display text-primary font-bold">${escape_html(customer().customer_total_orders)}</p> <p class="text-label-md text-on-surface-variant">Total Order</p></div> <div class="bg-surface-container-highest p-4 rounded-xl border border-outline-variant text-center"><p class="font-display text-display text-success font-bold">${escape_html(formatCurrency(totalSpent()))}</p> <p class="text-label-md text-on-surface-variant">Total Belanja</p></div></div> <form method="POST" action="?/toggleVip"><button type="submit"${attr_class(`w-full h-12 ${customer().customer_vip ? "bg-surface-container-highest text-on-surface border border-outline-variant" : "bg-warning text-on-surface"} rounded-xl font-bold text-label-md active:scale-[0.98] transition-transform`)}>${escape_html(customer().customer_vip ? "Hapus VIP" : "Jadikan VIP")}</button></form> `);
		if (form?.error) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<p class="text-body-sm text-error text-center">${escape_html(form.error)}</p>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <form method="POST" action="?/deleteCustomer"><button type="submit" class="w-full h-12 bg-error-container text-error rounded-xl font-bold text-label-md active:scale-[0.98] transition-transform flex items-center justify-center gap-2"><span class="material-symbols-outlined">delete</span> Hapus Pelanggan</button></form> <div><h2 class="font-label-md text-label-md text-on-surface font-bold uppercase tracking-wider mb-stack-sm">Riwayat Order</h2> `);
		if (orders().length === 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<p class="text-body-sm text-on-surface-variant text-center py-8">Belum ada order</p>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div class="space-y-3"><!--[-->`);
			const each_array = ensure_array_like(orders());
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let order = each_array[$$index];
				$$renderer.push(`<a${attr("href", `/orders/${stringify(order.order_id)}`)} class="block bg-surface-container-lowest p-4 rounded-xl border border-outline-variant active:scale-[0.98] transition-transform"><div class="flex justify-between items-center"><div><p class="text-label-md text-on-surface-variant">${escape_html(formatDate(order.order_created_at))}</p></div> <div class="flex items-center gap-3"><span class="font-headline-md text-primary">${escape_html(formatCurrency(order.order_total_price))}</span> <div${attr_class(`w-2 h-2 rounded-full ${stringify(statusColors[order.order_status])}`)}></div></div></div></a>`);
			}
			$$renderer.push(`<!--]--></div>`);
		}
		$$renderer.push(`<!--]--></div></div>`);
	});
}
//#endregion
export { _page as default };
