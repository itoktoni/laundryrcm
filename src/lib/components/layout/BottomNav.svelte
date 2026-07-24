<script>
	let { user } = $props();

	const items = [
		{ href: '/dashboard', label: 'Home', icon: 'dashboard' },
		{ href: '/attendance', label: 'Absensi', icon: 'how_to_reg' },
		{ href: '/orders', label: 'Orders', icon: 'receipt_long' },
		{ href: '/orders/new', label: '', icon: 'add_circle', primary: true },
		{ href: '/tools', label: 'Tools', icon: 'build' },
		{ href: '/settings', label: 'Profile', icon: 'person' }
	];
</script>

<nav class="fixed bottom-0 w-full z-50 bg-surface dark:bg-dark-bg border-t border-outline-variant dark:border-outline flex justify-around items-center h-16 px-2 md:hidden">
	{#each items as item}
		<a
			href={item.href}
			class="flex flex-col items-center justify-center {item.primary ? 'text-primary dark:text-inverse-primary font-bold' : 'text-secondary dark:text-secondary-fixed-dim'} active:scale-95 transition-transform duration-150"
		>
			{#if item.primary}
				<div class="relative -top-3">
					<div class="w-14 h-14 bg-primary text-on-primary rounded-full shadow-lg flex items-center justify-center active:scale-90 transition-transform">
						<span class="material-symbols-outlined text-[28px]">{item.icon}</span>
					</div>
				</div>
			{:else}
				<span class="material-symbols-outlined">{item.icon}</span>
			{/if}
			<span class="font-label-sm text-label-sm">{item.label}</span>
		</a>
	{/each}
</nav>
