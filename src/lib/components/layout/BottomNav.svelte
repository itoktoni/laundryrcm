<script>
	import { page } from '$app/stores';

	let { user } = $props();

	const items = [
		{ href: '/dashboard', label: 'Home', icon: 'home' },
		{ href: '/orders', label: 'Order', icon: 'receipt_long' },
		{ href: '/orders/new', label: 'Order Baru', icon: 'add', fab: true },
		{ href: '/customers', label: 'Pelanggan', icon: 'group' },
		{ href: '/settings', label: 'Profil', icon: 'person' }
	];

	/** @param {string} href */
	function isActive(href) {
		const p = $page.url.pathname;
		if (href === '/orders/new') return p === '/orders/new';
		if (href === '/orders') return p.startsWith('/orders');
		return p === href || p.startsWith(href + '/');
	}
</script>

<nav class="fixed bottom-0 inset-x-0 z-50 md:hidden px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] select-none">
	<div class="mx-auto max-w-md h-[4.25rem] bg-surface-container-lowest/95 backdrop-blur-xl border border-outline-variant rounded-[1.75rem] shadow-[0_12px_32px_-8px_rgba(21,24,41,0.28)] flex items-stretch justify-around px-1">
		{#each items as item}
			{#if item.fab}
				<a href={item.href} class="pressable-sm flex flex-col items-center justify-center w-16" aria-label={item.label}>
					<span class="icon-tile w-13 h-13 -mt-7 rounded-[1.25rem] bg-brand-gradient text-white shadow-fab ring-4 ring-surface" style="width:3.25rem;height:3.25rem">
						<span class="material-symbols-outlined text-[30px]">add</span>
					</span>
				</a>
			{:else}
				{@const active = isActive(item.href)}
				<a
					href={item.href}
					class="pressable-sm flex flex-col items-center justify-center gap-0.5 w-16 transition-colors {active ? 'text-primary' : 'text-on-surface-variant'}"
				>
					<span class="flex items-center justify-center h-8 w-14 rounded-full transition-all duration-200 {active ? 'bg-primary/12' : ''}">
						<span class="material-symbols-outlined text-[24px] {active ? 'fill-icon' : ''}">{item.icon}</span>
					</span>
					<span class="text-[10px] leading-none {active ? 'font-bold' : 'font-medium'}">{item.label}</span>
				</a>
			{/if}
		{/each}
	</div>
</nav>
