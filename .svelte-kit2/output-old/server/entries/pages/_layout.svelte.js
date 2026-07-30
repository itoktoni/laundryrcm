import "../../chunks/index-server.js";
import "../../chunks/exports.js";
import { C as escape_html, E as writable, S as attr, c as stringify, i as ensure_array_like, l as unsubscribe_stores, m as getContext, n as bind_props, r as derived, s as store_get, t as attr_class } from "../../chunks/server.js";
import "../../chunks/client.js";
import "../../chunks/forms.js";
import { t as toasts } from "../../chunks/toast.js";
//#region src/lib/stores/theme.js
function createThemeStore() {
	const { subscribe, set } = writable("light");
	return {
		subscribe,
		toggle() {
			set((current) => {
				return current === "dark" ? "light" : "dark";
			});
		},
		init() {}
	};
}
createThemeStore();
//#endregion
//#region node_modules/@sveltejs/kit/src/runtime/app/stores.js
/**
* A function that returns all of the contextual stores. On the server, this must be called during component initialization.
* Only use this if you need to defer store subscription until after the component has mounted, for some reason.
*
* @deprecated Use `$app/state` instead (requires Svelte 5, [see docs for more info](https://svelte.dev/docs/kit/migrating-to-sveltekit-2#SvelteKit-2.12:-$app-stores-deprecated))
*/
var getStores = () => {
	const stores$1 = getContext("__svelte__");
	return {
		/** @type {typeof page} */
		page: { subscribe: stores$1.page.subscribe },
		/** @type {typeof navigating} */
		navigating: { subscribe: stores$1.navigating.subscribe },
		/** @type {typeof updated} */
		updated: stores$1.updated
	};
};
/**
* A readable store whose value contains page data.
*
* On the server, this store can only be subscribed to during component initialization. In the browser, it can be subscribed to at any time.
*
* @deprecated Use `page` from `$app/state` instead (requires Svelte 5, [see docs for more info](https://svelte.dev/docs/kit/migrating-to-sveltekit-2#SvelteKit-2.12:-$app-stores-deprecated))
* @type {import('svelte/store').Readable<import('@sveltejs/kit').Page>}
*/
var page = { subscribe(fn) {
	return getStores().page.subscribe(fn);
} };
//#endregion
//#region src/lib/components/layout/Sidebar.svelte
function Sidebar($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		var $$store_subs;
		let { user } = $$props;
		const ownerMenu = [
			{
				href: "/dashboard",
				label: "Dashboard",
				icon: "dashboard"
			},
			{
				href: "/orders",
				label: "Order",
				icon: "receipt_long"
			},
			{
				href: "/products",
				label: "Produk",
				icon: "inventory_2"
			},
			{
				href: "/customers",
				label: "Pelanggan",
				icon: "people"
			},
			{
				href: "/finance",
				label: "Keuangan",
				icon: "payments"
			},
			{
				href: "/tools",
				label: "Tools",
				icon: "build"
			},
			{
				href: "/inventory",
				label: "Inventory",
				icon: "inventory_2"
			},
			{
				href: "/machines",
				label: "Mesin",
				icon: "local_laundry_service"
			},
			{
				href: "/promo",
				label: "Promo",
				icon: "sell"
			},
			{
				href: "/tools/sop",
				label: "Template SOP",
				icon: "description"
			},
			{
				href: "/tools/faq",
				label: "FAQ",
				icon: "quiz"
			},
			{
				href: "/reports",
				label: "Laporan",
				icon: "assessment"
			},
			{
				href: "/setting",
				label: "Pengaturan",
				icon: "settings"
			},
			{
				href: "/settings",
				label: "Profil",
				icon: "person"
			}
		];
		const karyawanMenu = [
			{
				href: "/orders",
				label: "Order",
				icon: "receipt_long"
			},
			{
				href: "/customers",
				label: "Pelanggan",
				icon: "people"
			},
			{
				href: "/tools",
				label: "Tools",
				icon: "build"
			},
			{
				href: "/tools/sop",
				label: "Template SOP",
				icon: "description"
			},
			{
				href: "/tools/faq",
				label: "FAQ",
				icon: "quiz"
			},
			{
				href: "/settings",
				label: "Profil",
				icon: "person"
			}
		];
		let menu = derived(() => user?.role === "owner" ? ownerMenu : karyawanMenu);
		$$renderer.push(`<aside class="hidden h-screen w-64 flex-col bg-surface-container-lowest dark:bg-dark-bg border-r border-outline-variant dark:border-outline md:flex"><div class="flex h-14 items-center gap-2 border-b border-outline-variant dark:border-outline px-4"><span class="material-symbols-outlined text-primary">local_laundry_service</span> <h1 class="font-headline-lg-mobile text-headline-lg-mobile text-primary tracking-tight">LaundryKu</h1></div> <nav class="flex-1 overflow-y-auto py-2"><!--[-->`);
		const each_array = ensure_array_like(menu());
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let item = each_array[$$index];
			$$renderer.push(`<a${attr("href", item.href)}${attr_class(`flex items-center gap-3 px-4 py-3 text-body-sm transition-colors ${store_get($$store_subs ??= {}, "$page", page).url.pathname === item.href || store_get($$store_subs ??= {}, "$page", page).url.pathname.startsWith(item.href + "/") ? "bg-primary text-on-primary hover:bg-primary" : "text-on-surface-variant hover:bg-surface-container-low dark:hover:bg-gray-800"}`)}><span class="material-symbols-outlined text-[20px]">${escape_html(item.icon)}</span> ${escape_html(item.label)}</a>`);
		}
		$$renderer.push(`<!--]--></nav> <div class="border-t border-outline-variant dark:border-outline p-4"><div class="flex items-center gap-3"><div class="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold">${escape_html(user?.name?.charAt(0)?.toUpperCase() || "U")}</div> <div><div class="font-body-md text-on-surface">${escape_html(user?.name)}</div> <div class="text-label-md text-on-surface-variant">${escape_html(user?.role)}</div></div></div></div></aside>`);
		if ($$store_subs) unsubscribe_stores($$store_subs);
	});
}
//#endregion
//#region src/lib/components/layout/Navbar.svelte
function Navbar($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { user, onMenu } = $$props;
		$$renderer.push(`<header class="fixed top-0 w-full z-50 bg-surface dark:bg-dark-bg border-b border-outline-variant dark:border-outline flex justify-between items-center px-container-margin h-14"><div class="flex items-center gap-2"><button class="active:opacity-70 mt-1 md:hidden" aria-label="Buka menu"><span class="material-symbols-outlined text-primary">menu_open</span></button> <h1 class="font-headline-lg-mobile text-headline-lg-mobile text-primary dark:text-inverse-primary tracking-tight">LaundryKu</h1></div> <div class="flex items-center gap-3"><div class="relative"><button class="active:opacity-70" aria-label="Menu akun"><span class="material-symbols-outlined text-on-surface-variant">person</span></button> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div></div></header>`);
	});
}
//#endregion
//#region src/lib/components/layout/BottomNav.svelte
function BottomNav($$renderer, $$props) {
	let { user } = $$props;
	const items = [
		{
			href: "/dashboard",
			label: "Home",
			icon: "dashboard"
		},
		{
			href: "/orders",
			label: "Orders",
			icon: "receipt_long"
		},
		{
			href: "/orders/new",
			label: "",
			icon: "add_circle",
			primary: true
		},
		{
			href: "/tools",
			label: "Tools",
			icon: "build"
		},
		{
			href: "/settings",
			label: "Profile",
			icon: "person"
		}
	];
	$$renderer.push(`<nav class="fixed bottom-0 w-full z-50 bg-surface dark:bg-dark-bg border-t border-outline-variant dark:border-outline flex justify-around items-center h-16 px-2 md:hidden"><!--[-->`);
	const each_array = ensure_array_like(items);
	for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
		let item = each_array[$$index];
		$$renderer.push(`<a${attr("href", item.href)}${attr_class(`flex flex-col items-center justify-center ${item.primary ? "text-primary dark:text-inverse-primary font-bold" : "text-secondary dark:text-secondary-fixed-dim"} active:scale-95 transition-transform duration-150`)}>`);
		if (item.primary) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="relative -top-3"><div class="w-14 h-14 bg-primary text-on-primary rounded-full shadow-lg flex items-center justify-center active:scale-90 transition-transform"><span class="material-symbols-outlined text-[28px]">${escape_html(item.icon)}</span></div></div>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<span class="material-symbols-outlined">${escape_html(item.icon)}</span>`);
		}
		$$renderer.push(`<!--]--> <span class="font-label-sm text-label-sm">${escape_html(item.label)}</span></a>`);
	}
	$$renderer.push(`<!--]--></nav>`);
}
//#endregion
//#region src/lib/components/layout/Drawer.svelte
function Drawer($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		var $$store_subs;
		let { user, open = false } = $$props;
		const ownerMenu = [
			{
				href: "/dashboard",
				label: "Dashboard",
				icon: "dashboard"
			},
			{
				href: "/orders",
				label: "Order",
				icon: "receipt_long"
			},
			{
				href: "/customers",
				label: "Pelanggan",
				icon: "people"
			},
			{
				href: "/finance",
				label: "Keuangan",
				icon: "payments"
			},
			{
				href: "/tools",
				label: "Tools",
				icon: "build"
			},
			{
				href: "/inventory",
				label: "Inventory",
				icon: "inventory_2"
			},
			{
				href: "/machines",
				label: "Mesin",
				icon: "settings"
			},
			{
				href: "/promo",
				label: "Promo",
				icon: "sell"
			},
			{
				href: "/tools/sop",
				label: "Template SOP",
				icon: "description"
			},
			{
				href: "/tools/faq",
				label: "FAQ",
				icon: "quiz"
			},
			{
				href: "/reports",
				label: "Laporan",
				icon: "assessment"
			},
			{
				href: "/setting",
				label: "Pengaturan",
				icon: "settings"
			},
			{
				href: "/settings",
				label: "Profil",
				icon: "person"
			}
		];
		const karyawanMenu = [
			{
				href: "/orders",
				label: "Order",
				icon: "receipt_long"
			},
			{
				href: "/customers",
				label: "Pelanggan",
				icon: "people"
			},
			{
				href: "/tools",
				label: "Tools",
				icon: "build"
			},
			{
				href: "/tools/sop",
				label: "Template SOP",
				icon: "description"
			},
			{
				href: "/tools/faq",
				label: "FAQ",
				icon: "quiz"
			},
			{
				href: "/settings",
				label: "Profil",
				icon: "person"
			}
		];
		let menu = derived(() => user?.role === "owner" ? ownerMenu : karyawanMenu);
		if (open) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="fixed inset-0 z-50 bg-black/40 md:hidden" role="button" tabindex="-1" aria-label="Tutup menu"></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <aside${attr_class(`fixed top-0 left-0 z-50 flex h-screen w-64 flex-col bg-surface-container-lowest dark:bg-dark-bg border-r border-outline-variant dark:border-outline transition-transform duration-200 md:hidden ${open ? "translate-x-0" : "-translate-x-full"}`)}><div class="flex h-14 items-center justify-between border-b border-outline-variant dark:border-outline px-4"><div class="flex items-center gap-2"><h1 class="font-headline-lg-mobile text-headline-lg-mobile text-primary tracking-tight">LaundryKu</h1></div> <button class="active:opacity-70" aria-label="Tutup menu"><span class="material-symbols-outlined text-on-surface-variant">close</span></button></div> <nav class="flex-1 overflow-y-auto py-2"><!--[-->`);
		const each_array = ensure_array_like(menu());
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let item = each_array[$$index];
			$$renderer.push(`<a${attr("href", item.href)}${attr_class(`flex items-center gap-3 px-4 py-3 text-body-sm transition-colors ${store_get($$store_subs ??= {}, "$page", page).url.pathname === item.href || store_get($$store_subs ??= {}, "$page", page).url.pathname.startsWith(item.href + "/") ? "bg-primary text-on-primary hover:bg-primary" : "text-on-surface-variant hover:bg-surface-container-low dark:hover:bg-gray-800"}`)}><span class="material-symbols-outlined text-[20px]">${escape_html(item.icon)}</span> ${escape_html(item.label)}</a>`);
		}
		$$renderer.push(`<!--]--></nav> <div class="border-t border-outline-variant dark:border-outline p-4"><div class="flex items-center gap-3"><div class="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold">${escape_html(user?.name?.charAt(0)?.toUpperCase() || "U")}</div> <div><div class="font-body-md text-on-surface">${escape_html(user?.name)}</div> <div class="text-label-md text-on-surface-variant capitalize">${escape_html(user?.role)}</div></div></div></div></aside>`);
		if ($$store_subs) unsubscribe_stores($$store_subs);
		bind_props($$props, { open });
	});
}
//#endregion
//#region src/lib/components/Toaster.svelte
function Toaster($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		var $$store_subs;
		const styles = {
			success: "bg-success-container text-success",
			error: "bg-error-container text-error",
			info: "bg-surface-container-high text-on-surface"
		};
		$$renderer.push(`<div class="fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 w-full max-w-sm px-4 pointer-events-none"><!--[-->`);
		const each_array = ensure_array_like(store_get($$store_subs ??= {}, "$toasts", toasts));
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let t = each_array[$$index];
			$$renderer.push(`<div${attr_class(`pointer-events-auto flex items-center justify-between gap-3 px-4 h-12 rounded-xl shadow-lg text-label-md font-medium animate-[fadeIn_0.2s_ease-out] ${stringify(styles[t.type] || styles.info)}`)} role="alert"><span>${escape_html(t.message)}</span> <button class="opacity-60 hover:opacity-100" aria-label="Tutup"><span class="material-symbols-outlined text-[18px]">close</span></button></div>`);
		}
		$$renderer.push(`<!--]--></div>`);
		if ($$store_subs) unsubscribe_stores($$store_subs);
	});
}
//#endregion
//#region src/routes/+layout.svelte
function _layout($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data, children } = $$props;
		let drawerOpen = false;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			$$renderer.push(`<div class="flex h-screen bg-surface dark:bg-dark-bg text-on-surface">`);
			if (data.user) {
				$$renderer.push("<!--[0-->");
				Sidebar($$renderer, { user: data.user });
				$$renderer.push(`<!----> `);
				Drawer($$renderer, {
					user: data.user,
					get open() {
						return drawerOpen;
					},
					set open($$value) {
						drawerOpen = $$value;
						$$settled = false;
					}
				});
				$$renderer.push(`<!---->`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> <div class="flex flex-1 flex-col overflow-hidden">`);
			if (data.user) {
				$$renderer.push("<!--[0-->");
				Navbar($$renderer, {
					user: data.user,
					onMenu: () => drawerOpen = true
				});
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> <main class="flex-1 overflow-y-auto pb-20 md:pb-0 pt-14"><div class="max-w-md mx-auto md:max-w-4xl px-container-margin py-stack-md">`);
			children($$renderer);
			$$renderer.push(`<!----></div></main> `);
			if (data.user) {
				$$renderer.push("<!--[0-->");
				BottomNav($$renderer, { user: data.user });
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div> `);
			Toaster($$renderer, {});
			$$renderer.push(`<!----></div>`);
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
export { _layout as default };
