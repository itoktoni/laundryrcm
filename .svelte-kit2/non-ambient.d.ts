
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	type MatcherParam<M> = M extends (param : string) => param is (infer U extends string) ? U : string;

	export interface AppTypes {
		RouteId(): "/" | "/api" | "/api/ai" | "/api/attendance" | "/api/attendance/location" | "/api/crm" | "/api/finance" | "/api/finance/export" | "/api/orders" | "/api/orders/export" | "/api/qris" | "/api/telegram" | "/api/telegram/setwebhook" | "/api/telegram/webhook" | "/api/wa" | "/api/wa/webhook" | "/api/webhook" | "/api/webhook/payment" | "/api/webhook/schedule" | "/attendance" | "/categories" | "/crm" | "/customers" | "/customers/[id]" | "/dashboard" | "/finance" | "/inventory" | "/inventory/export" | "/inventory/[id]" | "/login" | "/logout" | "/machines" | "/machines/export" | "/orders" | "/orders/new" | "/orders/[id]" | "/orders/[id]/status" | "/products" | "/promo" | "/promo/export" | "/register" | "/reports_attendance" | "/reports" | "/schedule" | "/settings" | "/setting" | "/tools" | "/tools/calculator" | "/tools/calculator/harga" | "/tools/calculator/omset" | "/tools/calculator/profit" | "/tools/calculator/sdm" | "/tools/faq" | "/tools/sop" | "/users";
		RouteParams(): {
			"/customers/[id]": { id: string };
			"/inventory/[id]": { id: string };
			"/orders/[id]": { id: string };
			"/orders/[id]/status": { id: string }
		};
		LayoutParams(): {
			"/": { id?: string | undefined };
			"/api": Record<string, never>;
			"/api/ai": Record<string, never>;
			"/api/attendance": Record<string, never>;
			"/api/attendance/location": Record<string, never>;
			"/api/crm": Record<string, never>;
			"/api/finance": Record<string, never>;
			"/api/finance/export": Record<string, never>;
			"/api/orders": Record<string, never>;
			"/api/orders/export": Record<string, never>;
			"/api/qris": Record<string, never>;
			"/api/telegram": Record<string, never>;
			"/api/telegram/setwebhook": Record<string, never>;
			"/api/telegram/webhook": Record<string, never>;
			"/api/wa": Record<string, never>;
			"/api/wa/webhook": Record<string, never>;
			"/api/webhook": Record<string, never>;
			"/api/webhook/payment": Record<string, never>;
			"/api/webhook/schedule": Record<string, never>;
			"/attendance": Record<string, never>;
			"/categories": Record<string, never>;
			"/crm": Record<string, never>;
			"/customers": { id?: string | undefined };
			"/customers/[id]": { id: string };
			"/dashboard": Record<string, never>;
			"/finance": Record<string, never>;
			"/inventory": { id?: string | undefined };
			"/inventory/export": Record<string, never>;
			"/inventory/[id]": { id: string };
			"/login": Record<string, never>;
			"/logout": Record<string, never>;
			"/machines": Record<string, never>;
			"/machines/export": Record<string, never>;
			"/orders": { id?: string | undefined };
			"/orders/new": Record<string, never>;
			"/orders/[id]": { id: string };
			"/orders/[id]/status": { id: string };
			"/products": Record<string, never>;
			"/promo": Record<string, never>;
			"/promo/export": Record<string, never>;
			"/register": Record<string, never>;
			"/reports_attendance": Record<string, never>;
			"/reports": Record<string, never>;
			"/schedule": Record<string, never>;
			"/settings": Record<string, never>;
			"/setting": Record<string, never>;
			"/tools": Record<string, never>;
			"/tools/calculator": Record<string, never>;
			"/tools/calculator/harga": Record<string, never>;
			"/tools/calculator/omset": Record<string, never>;
			"/tools/calculator/profit": Record<string, never>;
			"/tools/calculator/sdm": Record<string, never>;
			"/tools/faq": Record<string, never>;
			"/tools/sop": Record<string, never>;
			"/users": Record<string, never>
		};
		Pathname(): "/" | "/api/ai" | "/api/attendance" | "/api/attendance/location" | "/api/crm" | "/api/finance/export" | "/api/orders/export" | "/api/qris" | "/api/telegram/setwebhook" | "/api/telegram/webhook" | "/api/wa/webhook" | "/api/webhook/payment" | "/api/webhook/schedule" | "/attendance" | "/categories" | "/crm" | "/customers" | `/customers/${string}` & {} | "/dashboard" | "/finance" | "/inventory" | "/inventory/export" | `/inventory/${string}` & {} | "/login" | "/logout" | "/machines" | "/machines/export" | "/orders" | "/orders/new" | `/orders/${string}` & {} | `/orders/${string}/status` & {} | "/products" | "/promo" | "/promo/export" | "/register" | "/reports_attendance" | "/reports" | "/schedule" | "/settings" | "/setting" | "/tools" | "/tools/calculator" | "/tools/calculator/harga" | "/tools/calculator/omset" | "/tools/calculator/profit" | "/tools/calculator/sdm" | "/tools/faq" | "/tools/sop" | "/users";
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/favicon.png" | "/icon-192.png" | "/icon-512.png" | "/icon.png" | "/manifest.json" | "/robots.txt" | string & {};
	}
}