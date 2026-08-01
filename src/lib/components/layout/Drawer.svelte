<script>
	import { page } from '$app/stores';

	let { user, open = $bindable(false) } = $props();

	const ownerMenu = [
		{ href: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
		{ href: '/attendance', label: 'Absensi', icon: 'how_to_reg' },
		{ href: '/orders', label: 'Order', icon: 'receipt_long' },
		{ href: '/order-status', label: 'Status Order', icon: 'flag' },
		{ href: '/products', label: 'Produk', icon: 'inventory_2' },
		{ href: '/categories', label: 'Kategori', icon: 'category' },
		{ href: '/customers', label: 'Pelanggan', icon: 'people' },
		{ href: '/crm', label: 'CRM', icon: 'manage_accounts' },
		{ href: '/finance', label: 'Keuangan', icon: 'payments' },
		{ href: '/tools', label: 'Tools', icon: 'build' },
		{ href: '/inventory', label: 'Inventory', icon: 'inventory_2' },
		{ href: '/machines', label: 'Mesin', icon: 'settings' },
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
		{ href: '/order-status', label: 'Status Order', icon: 'flag' },
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

{#if open}
	<div
		class="fixed inset-0 z-50 bg-black/50 backdrop-blur-[2px] animate-fade-in md:hidden"
		onclick={() => (open = false)}
		onkeydown={(e) => e.key === 'Escape' && (open = false)}
		role="button"
		tabindex="-1"
		aria-label="Tutup menu"
	></div>
{/if}

<aside
	class="fixed top-0 left-0 z-50 flex h-dvh w-76 max-w-[85vw] flex-col bg-surface-container-lowest transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] rounded-r-[1.75rem] md:hidden select-none {open
		? 'translate-x-0 shadow-2xl'
		: '-translate-x-full'}"
	style="width:19rem"
>
	<div class="pt-safe">
		<div class="flex h-16 items-center justify-between px-5">
			<div class="flex items-center gap-2.5">
				<span class="icon-tile w-9 h-9 bg-brand-gradient text-white shadow-fab">
					<span class="material-symbols-outlined text-[20px] fill-icon">local_laundry_service</span>
				</span>
				<h1 class="text-[19px] font-extrabold tracking-tight text-on-surface">
					Laundry<span class="text-brand-gradient">Ku</span>
				</h1>
			</div>
			<button
				onclick={() => (open = false)}
				class="pressable-sm w-9 h-9 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors"
				aria-label="Tutup menu"
			>
				<span class="material-symbols-outlined text-[20px]">close</span>
			</button>
		</div>

		<!-- User card -->
		<div class="mx-4 mb-4 rounded-2xl bg-brand-gradient p-4 text-white relative overflow-hidden">
			<div class="absolute -right-6 -top-8 w-28 h-28 rounded-full bg-white/10"></div>
			<div class="absolute -right-2 top-10 w-16 h-16 rounded-full bg-white/10"></div>
			<div class="relative flex items-center gap-3">
				<div class="w-11 h-11 rounded-full bg-white/20 backdrop-blur flex items-center justify-center font-extrabold text-[17px] ring-2 ring-white/30">
					{user?.name?.charAt(0)?.toUpperCase() || 'U'}
				</div>
				<div class="min-w-0">
					<div class="font-bold truncate">{user?.name}</div>
					<div class="text-[11px] text-white/80 capitalize flex items-center gap-1">
						<span class="material-symbols-outlined text-[13px]">badge</span>
						{user?.role}
					</div>
				</div>
			</div>
		</div>
	</div>

	<nav class="flex-1 overflow-y-auto hide-scrollbar px-3 pb-4 space-y-0.5">
		{#each menu as item}
			{@const active = activeHref === item.href}
			<a
				href={item.href}
				onclick={() => (open = false)}
				class="pressable-sm flex items-center gap-3 px-4 h-11 rounded-xl text-[13.5px] transition-colors {active
					? 'bg-primary/10 text-primary font-bold'
					: 'text-on-surface-variant font-medium hover:bg-surface-container-low'}"
			>
				<span class="material-symbols-outlined text-[22px] {active ? 'fill-icon' : ''}">{item.icon}</span>
				{item.label}
			</a>
		{/each}
	</nav>

	<div class="px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-2">
		<p class="text-center text-[10px] font-medium text-outline">LaundryKu v2.0 — Manajemen Laundry AI</p>
	</div>
</aside>
