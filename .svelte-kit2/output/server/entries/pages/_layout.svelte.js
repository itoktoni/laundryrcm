import "../../chunks/index-server.js";
import { C as attr, D as writable, a as ensure_array_like, c as store_get, i as derived, l as stringify, r as bind_props, t as attr_class, u as unsubscribe_stores, w as escape_html } from "../../chunks/server.js";
import "../../chunks/index-server2.js";
import { t as page } from "../../chunks/stores.js";
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
var theme = createThemeStore();
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
				href: "/attendance",
				label: "Absensi",
				icon: "how_to_reg"
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
				href: "/categories",
				label: "Kategori",
				icon: "category"
			},
			{
				href: "/customers",
				label: "Pelanggan",
				icon: "people"
			},
			{
				href: "/crm",
				label: "CRM",
				icon: "manage_accounts"
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
				href: "/users",
				label: "User",
				icon: "group"
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
				href: "/reports_attendance",
				label: "Laporan Absensi",
				icon: "how_to_reg"
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
				href: "/dashboard",
				label: "Dashboard",
				icon: "dashboard"
			},
			{
				href: "/attendance",
				label: "Absensi",
				icon: "how_to_reg"
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
		let activeHref = derived(() => {
			const path = store_get($$store_subs ??= {}, "$page", page).url.pathname;
			let best = "";
			for (const item of menu()) if (path === item.href || path.startsWith(item.href + "/")) {
				if (item.href.length > best.length) best = item.href;
			}
			return best;
		});
		$$renderer.push(`<aside class="hidden h-dvh w-64 flex-col bg-surface-container-lowest border-r border-outline-variant md:flex select-none"><div class="flex h-16 items-center gap-2.5 px-5"><span class="icon-tile w-9 h-9 bg-brand-gradient text-white shadow-fab"><span class="material-symbols-outlined text-[20px] fill-icon">local_laundry_service</span></span> <h1 class="text-[19px] font-extrabold tracking-tight text-on-surface">Laundry<span class="text-brand-gradient">Ku</span></h1></div> <nav class="flex-1 overflow-y-auto hide-scrollbar px-3 py-4 space-y-0.5"><!--[-->`);
		const each_array = ensure_array_like(menu());
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let item = each_array[$$index];
			const active = activeHref() === item.href;
			$$renderer.push(`<a${attr("href", item.href)}${attr_class(`pressable-sm flex items-center gap-3 px-4 h-11 rounded-xl text-[13.5px] transition-colors ${active ? "bg-primary/10 text-primary font-bold" : "text-on-surface-variant font-medium hover:bg-surface-container-low"}`)}><span${attr_class(`material-symbols-outlined text-[22px] ${active ? "fill-icon" : ""}`)}>${escape_html(item.icon)}</span> ${escape_html(item.label)}</a>`);
		}
		$$renderer.push(`<!--]--></nav> <div class="p-3"><div class="flex items-center gap-3 rounded-2xl bg-surface-container-low p-3"><div class="w-10 h-10 rounded-full bg-brand-gradient flex items-center justify-center text-white font-bold shadow-fab">${escape_html(user?.name?.charAt(0)?.toUpperCase() || "U")}</div> <div class="min-w-0"><div class="font-bold text-body-sm text-on-surface truncate">${escape_html(user?.name)}</div> <div class="text-label-sm text-on-surface-variant capitalize">${escape_html(user?.role)}</div></div></div></div></aside>`);
		if ($$store_subs) unsubscribe_stores($$store_subs);
	});
}
//#endregion
//#region src/lib/components/layout/Navbar.svelte
function Navbar($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		var $$store_subs;
		let { user, onMenu } = $$props;
		$$renderer.push(`<header class="sticky top-0 z-40 bg-surface/85 backdrop-blur-xl border-b border-outline-variant/60 pt-safe select-none"><div class="flex items-center justify-between h-16 px-container-margin"><div class="flex items-center gap-3"><button class="pressable-sm w-10 h-10 -ml-2 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors md:hidden" aria-label="Buka menu"><span class="material-symbols-outlined">menu</span></button> <a href="/dashboard" class="flex items-center gap-2.5"><span class="icon-tile w-9 h-9 bg-brand-gradient text-white shadow-fab"><span class="material-symbols-outlined text-[20px] fill-icon">local_laundry_service</span></span> <h1 class="text-[19px] font-extrabold tracking-tight text-on-surface">Laundry<span class="text-brand-gradient">Ku</span></h1></a></div> <div class="flex items-center gap-1.5"><button class="pressable-sm w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors" aria-label="Ganti tema"><span class="material-symbols-outlined text-[22px]">${escape_html(store_get($$store_subs ??= {}, "$theme", theme) === "dark" ? "light_mode" : "dark_mode")}</span></button> <div class="relative"><button class="pressable-sm w-10 h-10 rounded-full bg-brand-gradient text-white flex items-center justify-center font-bold text-[15px] shadow-fab" aria-label="Menu akun">${escape_html(user?.name?.charAt(0)?.toUpperCase() || "U")}</button> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div></div></div></header>`);
		if ($$store_subs) unsubscribe_stores($$store_subs);
	});
}
//#endregion
//#region src/lib/components/layout/BottomNav.svelte
function BottomNav($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		var $$store_subs;
		let { user } = $$props;
		const items = [
			{
				href: "/dashboard",
				label: "Home",
				icon: "home"
			},
			{
				href: "/orders",
				label: "Order",
				icon: "receipt_long"
			},
			{
				href: "/orders/new",
				label: "Order Baru",
				icon: "add",
				fab: true
			},
			{
				href: "/customers",
				label: "Pelanggan",
				icon: "group"
			},
			{
				href: "/settings",
				label: "Profil",
				icon: "person"
			}
		];
		/** @param {string} href */
		function isActive(href) {
			const p = store_get($$store_subs ??= {}, "$page", page).url.pathname;
			if (href === "/orders/new") return p === "/orders/new";
			if (href === "/orders") return p.startsWith("/orders");
			return p === href || p.startsWith(href + "/");
		}
		$$renderer.push(`<nav class="fixed bottom-0 inset-x-0 z-50 md:hidden px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] select-none"><div class="mx-auto max-w-md h-[4.25rem] bg-surface-container-lowest/95 backdrop-blur-xl border border-outline-variant rounded-[1.75rem] shadow-[0_12px_32px_-8px_rgba(21,24,41,0.28)] flex items-stretch justify-around px-1"><!--[-->`);
		const each_array = ensure_array_like(items);
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let item = each_array[$$index];
			if (item.fab) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<a${attr("href", item.href)} class="pressable-sm flex flex-col items-center justify-center w-16"${attr("aria-label", item.label)}><span class="icon-tile w-13 h-13 -mt-7 rounded-[1.25rem] bg-brand-gradient text-white shadow-fab ring-4 ring-surface" style="width:3.25rem;height:3.25rem"><span class="material-symbols-outlined text-[30px]">add</span></span></a>`);
			} else {
				$$renderer.push("<!--[-1-->");
				const active = isActive(item.href);
				$$renderer.push(`<a${attr("href", item.href)}${attr_class(`pressable-sm flex flex-col items-center justify-center gap-0.5 w-16 transition-colors ${active ? "text-primary" : "text-on-surface-variant"}`)}><span${attr_class(`flex items-center justify-center h-8 w-14 rounded-full transition-all duration-200 ${active ? "bg-primary/12" : ""}`)}><span${attr_class(`material-symbols-outlined text-[24px] ${active ? "fill-icon" : ""}`)}>${escape_html(item.icon)}</span></span> <span${attr_class(`text-[10px] leading-none ${active ? "font-bold" : "font-medium"}`)}>${escape_html(item.label)}</span></a>`);
			}
			$$renderer.push(`<!--]-->`);
		}
		$$renderer.push(`<!--]--></div></nav>`);
		if ($$store_subs) unsubscribe_stores($$store_subs);
	});
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
				href: "/categories",
				label: "Kategori",
				icon: "category"
			},
			{
				href: "/customers",
				label: "Pelanggan",
				icon: "people"
			},
			{
				href: "/crm",
				label: "CRM",
				icon: "manage_accounts"
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
				href: "/users",
				label: "User",
				icon: "group"
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
				href: "/reports_attendance",
				label: "Laporan Absensi",
				icon: "how_to_reg"
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
		let activeHref = derived(() => {
			const path = store_get($$store_subs ??= {}, "$page", page).url.pathname;
			let best = "";
			for (const item of menu()) if (path === item.href || path.startsWith(item.href + "/")) {
				if (item.href.length > best.length) best = item.href;
			}
			return best;
		});
		if (open) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="fixed inset-0 z-50 bg-black/50 backdrop-blur-[2px] animate-fade-in md:hidden" role="button" tabindex="-1" aria-label="Tutup menu"></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <aside${attr_class(`fixed top-0 left-0 z-50 flex h-dvh w-76 max-w-[85vw] flex-col bg-surface-container-lowest transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] rounded-r-[1.75rem] md:hidden select-none ${open ? "translate-x-0 shadow-2xl" : "-translate-x-full"}`)} style="width:19rem"><div class="pt-safe"><div class="flex h-16 items-center justify-between px-5"><div class="flex items-center gap-2.5"><span class="icon-tile w-9 h-9 bg-brand-gradient text-white shadow-fab"><span class="material-symbols-outlined text-[20px] fill-icon">local_laundry_service</span></span> <h1 class="text-[19px] font-extrabold tracking-tight text-on-surface">Laundry<span class="text-brand-gradient">Ku</span></h1></div> <button class="pressable-sm w-9 h-9 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors" aria-label="Tutup menu"><span class="material-symbols-outlined text-[20px]">close</span></button></div> <div class="mx-4 mb-4 rounded-2xl bg-brand-gradient p-4 text-white relative overflow-hidden"><div class="absolute -right-6 -top-8 w-28 h-28 rounded-full bg-white/10"></div> <div class="absolute -right-2 top-10 w-16 h-16 rounded-full bg-white/10"></div> <div class="relative flex items-center gap-3"><div class="w-11 h-11 rounded-full bg-white/20 backdrop-blur flex items-center justify-center font-extrabold text-[17px] ring-2 ring-white/30">${escape_html(user?.name?.charAt(0)?.toUpperCase() || "U")}</div> <div class="min-w-0"><div class="font-bold truncate">${escape_html(user?.name)}</div> <div class="text-[11px] text-white/80 capitalize flex items-center gap-1"><span class="material-symbols-outlined text-[13px]">badge</span> ${escape_html(user?.role)}</div></div></div></div></div> <nav class="flex-1 overflow-y-auto hide-scrollbar px-3 pb-4 space-y-0.5"><!--[-->`);
		const each_array = ensure_array_like(menu());
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let item = each_array[$$index];
			const active = activeHref() === item.href;
			$$renderer.push(`<a${attr("href", item.href)}${attr_class(`pressable-sm flex items-center gap-3 px-4 h-11 rounded-xl text-[13.5px] transition-colors ${active ? "bg-primary/10 text-primary font-bold" : "text-on-surface-variant font-medium hover:bg-surface-container-low"}`)}><span${attr_class(`material-symbols-outlined text-[22px] ${active ? "fill-icon" : ""}`)}>${escape_html(item.icon)}</span> ${escape_html(item.label)}</a>`);
		}
		$$renderer.push(`<!--]--></nav> <div class="px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-2"><p class="text-center text-[10px] font-medium text-outline">LaundryKu v2.0 — Manajemen Laundry AI</p></div></aside>`);
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
			success: "bg-success-container text-on-success-container",
			error: "bg-error-container text-on-error-container",
			info: "bg-surface-container-highest text-on-surface"
		};
		const icons = {
			success: "check_circle",
			error: "error",
			info: "info"
		};
		$$renderer.push(`<div class="fixed top-0 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 w-full max-w-sm px-4 pt-[max(1rem,env(safe-area-inset-top))] pointer-events-none"><!--[-->`);
		const each_array = ensure_array_like(store_get($$store_subs ??= {}, "$toasts", toasts));
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let t = each_array[$$index];
			const type = t.type === "success" || t.type === "error" ? t.type : "info";
			$$renderer.push(`<div${attr_class(`pointer-events-auto flex items-center gap-3 px-4 min-h-12 py-2.5 rounded-2xl shadow-card-lg text-[13px] font-semibold animate-fade-slide-up ${stringify(styles[type])}`)} role="alert"><span class="material-symbols-outlined text-[20px] fill-icon shrink-0">${escape_html(icons[type])}</span> <span class="flex-1">${escape_html(t.message)}</span> <button class="pressable-sm opacity-60 hover:opacity-100 -mr-1" aria-label="Tutup"><span class="material-symbols-outlined text-[18px]">close</span></button></div>`);
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
			$$renderer.push(`<div class="flex h-dvh bg-surface text-on-surface">`);
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
			$$renderer.push(`<!--]--> <main${attr_class(`flex-1 overflow-y-auto ${data.user ? "pb-28 md:pb-8" : ""}`)}><div class="max-w-md mx-auto md:max-w-4xl px-container-margin py-stack-md">`);
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
