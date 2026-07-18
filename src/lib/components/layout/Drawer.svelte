<script>
	import { page } from '$app/stores';

	let { user, open = $bindable(false) } = $props();

	const ownerMenu = [
		{ href: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
		{ href: '/orders', label: 'Order', icon: 'receipt_long' },
		{ href: '/customers', label: 'Pelanggan', icon: 'people' },
		{ href: '/finance', label: 'Keuangan', icon: 'payments' },
		{ href: '/tools', label: 'Tools', icon: 'build' },
		{ href: '/inventory', label: 'Inventory', icon: 'inventory_2' },
		{ href: '/machines', label: 'Mesin', icon: 'settings' },
		{ href: '/promo', label: 'Promo', icon: 'sell' },
		{ href: '/tools/sop', label: 'Template SOP', icon: 'description' },
		{ href: '/tools/faq', label: 'FAQ', icon: 'quiz' },
		{ href: '/reports', label: 'Laporan', icon: 'assessment' },
		{ href: '/setting', label: 'Pengaturan', icon: 'settings' },
		{ href: '/settings', label: 'Profil', icon: 'person' }
	];

	const karyawanMenu = [
		{ href: '/orders', label: 'Order', icon: 'receipt_long' },
		{ href: '/customers', label: 'Pelanggan', icon: 'people' },
		{ href: '/tools', label: 'Tools', icon: 'build' },
		{ href: '/tools/sop', label: 'Template SOP', icon: 'description' },
		{ href: '/tools/faq', label: 'FAQ', icon: 'quiz' },
		{ href: '/settings', label: 'Profil', icon: 'person' }
	];

	let menu = $derived(user?.role === 'owner' ? ownerMenu : karyawanMenu);
</script>

{#if open}
	<div
		class="fixed inset-0 z-50 bg-black/40 md:hidden"
		onclick={() => (open = false)}
		onkeydown={(e) => e.key === 'Escape' && (open = false)}
		role="button"
		tabindex="-1"
		aria-label="Tutup menu"
	></div>
{/if}

<aside
	class="fixed top-0 left-0 z-50 flex h-screen w-64 flex-col bg-surface-container-lowest dark:bg-dark-bg border-r border-outline-variant dark:border-outline transition-transform duration-200 md:hidden {open
		? 'translate-x-0'
		: '-translate-x-full'}"
>
	<div class="flex h-14 items-center justify-between border-b border-outline-variant dark:border-outline px-4">
		<div class="flex items-center gap-2">
			<h1 class="font-headline-lg-mobile text-headline-lg-mobile text-primary tracking-tight">LaundryKu</h1>
		</div>
		<button onclick={() => (open = false)} class="active:opacity-70" aria-label="Tutup menu">
			<span class="material-symbols-outlined text-on-surface-variant">close</span>
		</button>
	</div>
	<nav class="flex-1 overflow-y-auto py-2">
		{#each menu as item}
			<a
				href={item.href}
				onclick={() => (open = false)}
				class="flex items-center gap-3 px-4 py-3 text-body-sm transition-colors {$page.url.pathname === item.href || $page.url.pathname.startsWith(item.href + '/')
					? 'bg-primary text-on-primary hover:bg-primary'
					: 'text-on-surface-variant hover:bg-surface-container-low dark:hover:bg-gray-800'}"
			>
				<span class="material-symbols-outlined text-[20px]">{item.icon}</span>
				{item.label}
			</a>
		{/each}
	</nav>
	<div class="border-t border-outline-variant dark:border-outline p-4">
		<div class="flex items-center gap-3">
			<div class="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold">
				{user?.name?.charAt(0)?.toUpperCase() || 'U'}
			</div>
			<div>
				<div class="font-body-md text-on-surface">{user?.name}</div>
				<div class="text-label-md text-on-surface-variant capitalize">{user?.role}</div>
			</div>
		</div>
	</div>
</aside>
