import { C as escape_html, S as attr, a as head, i as ensure_array_like, n as bind_props, r as derived, t as attr_class } from "../../../../chunks/server.js";
import "../../../../chunks/forms.js";
import { t as formatCurrency } from "../../../../chunks/utils2.js";
import { t as QrisModal } from "../../../../chunks/QrisModal.js";
//#region src/lib/components/ui/SearchableSelect.svelte
function SearchableSelect($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { options = [], value = "", placeholder = "Pilih...", multiple = false, searchable = true } = $$props;
		derived(() => options.filter((o) => true));
		let selected = derived(() => multiple ? options.filter((o) => (value || []).includes(o.value)) : options.find((o) => o.value === value));
		$$renderer.push(`<div class="relative"><button type="button" class="w-full h-touch-target px-4 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary bg-surface-container-lowest text-left font-body-md text-body-md flex items-center justify-between gap-2"><div class="flex flex-wrap gap-1 flex-1 min-w-0">`);
		if (multiple && selected()?.length > 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<!--[-->`);
			const each_array = ensure_array_like(selected());
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let s = each_array[$$index];
				$$renderer.push(`<span class="inline-flex items-center gap-1 px-2 py-0.5 bg-primary-container text-on-primary-container rounded text-label-md">${escape_html(s.label)} <span role="button" tabindex="0" class="material-symbols-outlined text-[14px] cursor-pointer">close</span></span>`);
			}
			$$renderer.push(`<!--]-->`);
		} else if (!multiple && selected()) {
			$$renderer.push("<!--[1-->");
			$$renderer.push(`<span class="truncate text-on-surface">${escape_html(selected().label)}</span>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<span class="text-outline-variant">${escape_html(placeholder)}</span>`);
		}
		$$renderer.push(`<!--]--></div> <span${attr_class(`material-symbols-outlined text-outline text-[20px] flex-shrink-0 transition-transform `)}>expand_more</span></button> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div>`);
		bind_props($$props, { value });
	});
}
//#endregion
//#region src/lib/components/ui/BottomSheet.svelte
function BottomSheet($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { open = false, title = "", children } = $$props;
		if (open) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="fixed inset-0 z-[60] bg-black/50"></div> <div class="fixed bottom-0 left-0 right-0 z-[60] bg-surface rounded-t-2xl shadow-lg animate-slide-up svelte-7vgo1t" style="margin-bottom: -10px;"><div class="flex justify-center pt-3 pb-2"><div class="w-10 h-1 bg-outline-variant rounded-full"></div></div> <div class="flex items-center justify-between px-container-margin pb-3 border-b border-outline-variant"><h2 class="font-headline-md text-headline-md text-on-surface">${escape_html(title)}</h2> <button type="button" class="w-8 h-8 rounded-full flex items-center justify-center hover:bg-surface-container-high active:scale-95 transition-transform"><span class="material-symbols-outlined text-on-surface-variant">close</span></button></div> <div class="px-container-margin py-stack-md pb-8 max-h-[70vh] overflow-y-auto">`);
			children($$renderer);
			$$renderer.push(`<!----></div></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
		bind_props($$props, { open });
	});
}
//#endregion
//#region src/routes/orders/new/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data, form } = $$props;
		let customerId = data.customers.find((c) => c.customer_id === "cust-walk-in" || c.customer_name === "Walk Customer")?.customer_id ?? "";
		let notes = "";
		let items = [];
		let showNewCustomer = false;
		let showQris = false;
		let paymentStatus = "unpaid";
		let pendingOrderId = null;
		let creatingPending = false;
		let newCustomerName = "";
		let newCustomerPhone = "";
		let newCustomerAddress = "";
		let activeCategory = "all";
		let searchQuery = "";
		let promoCode = "";
		let subtotal = derived(() => items.reduce((sum, i) => sum + i.subtotal, 0));
		let discount = derived(() => {
			return 0;
		});
		let total = derived(() => subtotal() - discount());
		let filteredProducts = derived(() => data.products.filter((p) => {
			return true;
		}));
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			head("118ezj5", $$renderer, ($$renderer) => {
				$$renderer.title(($$renderer) => {
					$$renderer.push(`<title>Order Baru - LaundryKu</title>`);
				});
			});
			$$renderer.push(`<form method="POST" action="?/createOrder" class="space-y-stack-lg pb-32"><input type="hidden" name="customer_id"${attr("value", customerId)}/> <input type="hidden" name="notes"${attr("value", notes)}/> <input type="hidden" name="promo_code"${attr("value", promoCode)}/> <input type="hidden" name="promo_id"${attr("value", "")}/> <input type="hidden" name="items"${attr("value", JSON.stringify(items.map((i) => ({
				productId: i.productId,
				quantity: i.quantity,
				price: i.price
			}))))}/> <section class="space-y-stack-sm"><label class="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Pelanggan</label> <div class="flex gap-2 items-start"><div class="flex-1">`);
			SearchableSelect($$renderer, {
				options: data.customers.map((c) => ({
					value: c.customer_id,
					label: `${c.customer_name} (${c.customer_phone})`
				})),
				placeholder: "Cari & pilih pelanggan...",
				get value() {
					return customerId;
				},
				set value($$value) {
					customerId = $$value;
					$$settled = false;
				}
			});
			$$renderer.push(`<!----></div> <button type="button" class="w-touch-target h-touch-target rounded-lg bg-primary text-on-primary flex items-center justify-center active:scale-95 transition-transform flex-shrink-0"><span class="material-symbols-outlined">add</span></button></div></section> `);
			BottomSheet($$renderer, {
				title: "Pelanggan Baru",
				get open() {
					return showNewCustomer;
				},
				set open($$value) {
					showNewCustomer = $$value;
					$$settled = false;
				},
				children: ($$renderer) => {
					$$renderer.push(`<form method="POST" action="?/createCustomer" class="space-y-3"><div><label class="font-label-md text-label-md text-on-surface">Nama</label> <input name="customer_name"${attr("value", newCustomerName)} placeholder="Nama pelanggan" required="" class="w-full h-12 px-4 bg-surface-container-lowest border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary text-body-md mt-1"/></div> <div><label class="font-label-md text-label-md text-on-surface">No. HP</label> <input name="customer_phone"${attr("value", newCustomerPhone)} placeholder="08xxxxxxxxxx" required="" class="w-full h-12 px-4 bg-surface-container-lowest border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary text-body-md mt-1"/></div> <div><label class="font-label-md text-label-md text-on-surface">Alamat <span class="text-on-surface-variant">(opsional)</span></label> <input name="customer_address"${attr("value", newCustomerAddress)} placeholder="Alamat pelanggan" class="w-full h-12 px-4 bg-surface-container-lowest border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary text-body-md mt-1"/></div> <div class="flex gap-3 pt-2"><button type="button" class="flex-1 h-12 bg-surface-container-high text-on-surface rounded-xl font-bold text-label-md active:scale-[0.98] transition-transform">Batal</button> <button type="submit" class="flex-1 h-12 bg-primary text-on-primary rounded-xl font-bold text-label-md active:scale-[0.98] transition-transform">Simpan</button></div></form>`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----> <section class="bg-surface-container-low p-4 rounded-xl border border-outline-variant space-y-stack-md"><label class="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Pilih Produk &amp; Layanan</label> <div class="flex gap-2 overflow-x-auto hide-scrollbar pb-2 mt-2 svelte-118ezj5"><button type="button"${attr_class(`flex-shrink-0 px-4 py-1.5 bg-primary text-on-primary rounded-full text-label-md font-label-md active:scale-95 transition-transform`)}>Semua</button> <!--[-->`);
			const each_array = ensure_array_like(data.categories);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let cat = each_array[$$index];
				$$renderer.push(`<button type="button"${attr_class(`flex-shrink-0 px-4 py-1.5 ${activeCategory === cat.category_id ? "bg-primary text-on-primary" : "border border-outline-variant text-secondary"} rounded-full text-label-md font-label-md active:scale-95 transition-transform`)}>${escape_html(cat.category_name)}</button>`);
			}
			$$renderer.push(`<!--]--></div> <div class="relative"><span class="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-[20px]">search</span> <input${attr("value", searchQuery)} class="w-full pl-10 pr-4 h-10 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary bg-surface-container-lowest outline-none transition-all font-body-sm text-body-sm" placeholder="Cari produk..." type="text"/></div> <div class="grid grid-cols-2 gap-2"><!--[-->`);
			const each_array_1 = ensure_array_like(filteredProducts());
			for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
				let p = each_array_1[$$index_1];
				$$renderer.push(`<button type="button" class="cursor-pointer block active:scale-95 transition-transform"><div class="flex flex-col items-center text-center p-3 border border-outline-variant rounded-lg bg-surface-container-lowest transition-all h-full justify-center hover:bg-secondary-container hover:border-primary"><span class="text-label-md font-bold text-on-surface leading-tight">${escape_html(p.product_name)}</span> <span class="text-[10px] text-secondary">${escape_html(formatCurrency(p.product_price))}/${escape_html(p.product_unit)}</span></div></button>`);
			}
			$$renderer.push(`<!--]--></div></section> `);
			if (items.length > 0) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<section class="space-y-stack-sm"><label class="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Order Items</label> <!--[-->`);
				const each_array_2 = ensure_array_like(items);
				for (let i = 0, $$length = each_array_2.length; i < $$length; i++) {
					let item = each_array_2[i];
					$$renderer.push(`<div class="p-3 bg-surface-container-lowest rounded-xl border border-outline-variant"><div class="flex items-center justify-between gap-2 mb-2"><p class="text-sm font-semibold text-on-surface min-w-0 truncate">${escape_html(item.name)} <span class="font-normal text-on-surface-variant">- ${escape_html(formatCurrency(item.price))}/${escape_html(item.unit)}</span></p> <button type="button" class="w-7 h-7 shrink-0 rounded-full bg-error-container flex items-center justify-center" aria-label="Hapus"><span class="material-symbols-outlined text-error text-[16px]">close</span></button></div> <div class="flex items-center justify-between gap-2"><div class="flex items-center gap-1.5"><button type="button" class="w-8 h-8 rounded-full bg-outline-variant flex items-center justify-center" aria-label="Kurangi"><span class="material-symbols-outlined text-[18px]">remove</span></button> <input type="number" inputmode="decimal"${attr("step", item.unit === "kg" ? "0.1" : "1")}${attr("min", item.unit === "kg" ? "0.1" : "1")}${attr("value", item.quantity)} class="w-20 h-8 text-center text-sm font-semibold text-on-surface bg-surface-container-low border border-outline-variant rounded-lg"/> <button type="button" class="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center" aria-label="Tambah"><span class="material-symbols-outlined text-[18px]">add</span></button></div> <span class="text-sm font-bold text-primary whitespace-nowrap">${escape_html(formatCurrency(item.subtotal))}</span></div></div>`);
				}
				$$renderer.push(`<!--]--></section>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> <section class="space-y-2"><label class="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Promo</label> `);
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div class="flex gap-2"><div class="relative flex-1"><span class="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-primary text-[20px]">sell</span> <input${attr("value", promoCode)} class="w-full pl-10 pr-4 h-11 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary bg-surface-container-lowest outline-none text-body-md" placeholder="Kode promo..." type="text"/></div> <button type="button" class="px-4 h-11 bg-primary text-on-primary rounded-lg font-bold text-label-md active:scale-[0.98] transition-transform">PAKAI</button></div> `);
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			if (data.promotions.length > 0) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="flex flex-wrap gap-2"><!--[-->`);
				const each_array_3 = ensure_array_like(data.promotions.filter((p) => p.promo_code));
				for (let $$index_3 = 0, $$length = each_array_3.length; $$index_3 < $$length; $$index_3++) {
					let promo = each_array_3[$$index_3];
					$$renderer.push(`<button type="button" class="px-3 py-1 border border-outline-variant rounded-full text-label-md text-secondary hover:bg-secondary-container active:scale-95 transition-transform">${escape_html(promo.promo_code)}</button>`);
				}
				$$renderer.push(`<!--]--></div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]-->`);
			$$renderer.push(`<!--]--></section> <section class="bg-surface-container-low p-4 rounded-xl border border-outline-variant space-y-3"><div class="flex justify-between text-body-sm"><span class="text-on-surface-variant">Subtotal</span> <span class="font-medium text-on-surface">${escape_html(formatCurrency(subtotal()))}</span></div> `);
			if (discount() > 0) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="flex justify-between text-body-sm"><span class="text-success flex items-center gap-1"><span class="material-symbols-outlined text-[16px]">sell</span> Diskon ${escape_html("")}</span> <span class="font-medium text-success">-${escape_html(formatCurrency(discount()))}</span></div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			if (items.length > 0) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="flex justify-between text-label-md text-on-surface-variant"><span>${escape_html(items.length)} item</span> <span>${escape_html(items.reduce((sum, i) => sum + (i.unit === "kg" ? i.quantity : 0), 0))} kg · ${escape_html(items.filter((i) => i.unit === "pcs").length)} pcs</span></div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> <div class="border-t border-outline-variant pt-3"><div class="flex justify-between items-end"><div><p class="text-label-sm text-secondary uppercase tracking-wider">Total Tagihan</p> <p class="font-headline-lg text-headline-lg text-primary tracking-tight mt-1">${escape_html(formatCurrency(total()))}</p></div> `);
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div></div></section> `);
			if (form?.error) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="flex items-center gap-3 p-3 bg-error-container border border-error/20 rounded-lg"><span class="material-symbols-outlined text-error text-[20px]">error</span> <p class="text-body-sm text-error">${escape_html(form.error)}</p></div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> <input type="hidden" name="payment_status"${attr("value", paymentStatus)}/> <div class="grid grid-cols-2 gap-3"><button type="submit" class="h-14 bg-surface-container-high text-on-surface rounded-xl border border-outline-variant font-headline-md text-headline-md active:scale-[0.98] transition-transform flex items-center justify-center gap-2"><span class="material-symbols-outlined text-[20px]">save</span> Simpan</button> <button type="submit" formaction="?/createPending"${attr("disabled", creatingPending, true)} class="h-14 bg-primary text-on-primary rounded-xl font-headline-md text-headline-md shadow-lg shadow-primary/25 active:scale-[0.98] transition-transform flex items-center justify-center gap-2 disabled:opacity-60"><span class="material-symbols-outlined text-[20px]">qr_code_2</span> ${escape_html("Bayar")}</button></div></form> `);
			QrisModal($$renderer, {
				amount: total(),
				orderId: pendingOrderId,
				onPaid: () => {},
				get open() {
					return showQris;
				},
				set open($$value) {
					showQris = $$value;
					$$settled = false;
				}
			});
			$$renderer.push(`<!---->`);
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
	});
}
//#endregion
export { _page as default };
