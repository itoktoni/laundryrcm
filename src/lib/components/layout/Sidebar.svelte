<script>
	import { page } from '$app/stores';

	let { user } = $props();

	const ownerMenu = [
		{ href: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
		{ href: '/attendance', label: 'Absensi', icon: 'how_to_reg' },
		{ href: '/orders', label: 'Order', icon: 'receipt_long' },
		{ href: '/products', label: 'Produk', icon: 'inventory_2' },
		{ href: '/categories', label: 'Kategori', icon: 'category' },
		{ href: '/customers', label: 'Pelanggan', icon: 'people' },
		{ href: '/crm', label: 'CRM', icon: 'manage_accounts' },
		{ href: '/finance', label: 'Keuangan', icon: 'payments' },
		{ href: '/tools', label: 'Tools', icon: 'build' },
		{ href: '/inventory', label: 'Inventory', icon: 'inventory_2' },
		{ href: '/machines', label: 'Mesin', icon: 'local_laundry_service' },
		{ href: '/promo', label: 'Promo', icon: 'sell' },
		{ href: '/users', label: 'User', icon: 'group' },
		{ href: '/tools/sop', label: 'Template SOP', icon: 'description' },
		{ href: '/tools/faq', label: 'FAQ', icon: 'quiz' },
		{ href: '/reports', label: 'Laporan', icon: 'assessment' },
		{ href: '/reports_attendance', label: 'Laporan Absensi', icon: 'how_to_reg' },
		{ href: '/setting', label: 'Pengaturan', icon: 'settings' },
		{ href: '/settings', label: 'Profil', icon: 'person' }
	];

	const karyawanMenu = [
		{ href: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
		{ href: '/attendance', label: 'Absensi', icon: 'how_to_reg' },
		{ href: '/orders', label: 'Order', icon: 'receipt_long' },
		{ href: '/customers', label: 'Pelanggan', icon: 'people' },
		{ href: '/tools/sop', label: 'Template SOP', icon: 'description' },
		{ href: '/tools/faq', label: 'FAQ', icon: 'quiz' },
		{ href: '/settings', label: 'Profil', icon: 'person' }
	];

	let menu = $derived(user?.role === 'owner' ? ownerMenu : karyawanMenu);

	let activeHref = $derived.by(() => {
		const path = $page.url.pathname;
		let best = '';
		for (const item of menu) {
			if (path === item.href || path.startsWith(item.href + '/')) {
				if (item.href.length > best.length) best = item.href;
			}
		}
		return best;
	});
</script>

<aside class="hidden h-dvh w-64 flex-col bg-surface-container-lowest border-r border-outline-variant md:flex select-none">
	<div class="flex h-16 items-center gap-2.5 px-5">
		<span class="icon-tile w-9 h-9 bg-brand-gradient text-white shadow-fab">
			<span class="material-symbols-outlined text-[20px] fill-icon">local_laundry_service</span>
		</span>
		<h1 class="text-[19px] font-extrabold tracking-tight text-on-surface">
			Laundry<span class="text-brand-gradient">Ku</span>
		</h1>
	</div>
	<nav class="flex-1 overflow-y-auto hide-scrollbar px-3 py-4 space-y-0.5">
		{#each menu as item}
			{@const active = activeHref === item.href}
			<a
				href={item.href}
				class="pressable-sm flex items-center gap-3 px-4 h-11 rounded-xl text-[13.5px] transition-colors {active
					? 'bg-primary/10 text-primary font-bold'
					: 'text-on-surface-variant font-medium hover:bg-surface-container-low'}"
			>
				<span class="material-symbols-outlined text-[22px] {active ? 'fill-icon' : ''}">{item.icon}</span>
				{item.label}
			</a>
		{/each}
	</nav>
	<div class="p-3">
		<div class="flex items-center gap-3 rounded-2xl bg-surface-container-low p-3">
			<div class="w-10 h-10 rounded-full bg-brand-gradient flex items-center justify-center text-white font-bold shadow-fab">
				{user?.name?.charAt(0)?.toUpperCase() || 'U'}
			</div>
			<div class="min-w-0">
				<div class="font-bold text-body-sm text-on-surface truncate">{user?.name}</div>
				<div class="text-label-sm text-on-surface-variant capitalize">{user?.role}</div>
			</div>
		</div>
	</div>
</aside>
