<script>
	import { formatCurrency, formatDate } from '$lib/utils.js';
	import { onMount, onDestroy } from 'svelte';

	let { data } = $props();
	let stats = $derived(data.stats);
	let recentOrders = $derived(data.recentOrders);
	let weeklyTotal = $derived(data.weekly.data.reduce((sum, v) => sum + Number(v), 0));

	const hour = new Date().getHours();
	const greeting = hour < 11 ? 'Selamat Pagi' : hour < 15 ? 'Selamat Siang' : hour < 19 ? 'Selamat Sore' : 'Selamat Malam';
	const todayLabel = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' });

	const orderStatusMeta = {
		pending: { dot: 'bg-pending', label: 'Antre' },
		cuci: { dot: 'bg-primary', label: 'Cuci' },
		kering: { dot: 'bg-kering', label: 'Kering' },
		setrika: { dot: 'bg-setrika', label: 'Setrika' },
		packing: { dot: 'bg-packing', label: 'Packing' },
		selesai: { dot: 'bg-success', label: 'Selesai' },
		diambil: { dot: 'bg-secondary', label: 'Diambil' }
	};

	/** @param {unknown} status */
	function statusMetaFor(status) {
		const key = String(status);
		return orderStatusMeta[/** @type {keyof typeof orderStatusMeta} */ (key)] || orderStatusMeta.pending;
	}

	const ownerActions = [
		{ href: '/orders/new', icon: 'add_circle', label: 'Order Baru', color: 'bg-primary/10 text-primary' },
		{ href: '/customers', icon: 'group', label: 'Pelanggan', color: 'bg-kering/10 text-kering' },
		{ href: '/finance', icon: 'outbox', label: 'Pengeluaran', color: 'bg-warning/10 text-warning' },
		{ href: '/reports', icon: 'assessment', label: 'Laporan', color: 'bg-success/10 text-success' }
	];
	const staffActions = [
		{ href: '/orders/new', icon: 'add_circle', label: 'Order Baru', color: 'bg-primary/10 text-primary' },
		{ href: '/orders', icon: 'receipt_long', label: 'Order', color: 'bg-kering/10 text-kering' },
		{ href: '/attendance', icon: 'how_to_reg', label: 'Absensi', color: 'bg-warning/10 text-warning' },
		{ href: '/customers', icon: 'group', label: 'Pelanggan', color: 'bg-success/10 text-success' }
	];
	let quickActions = $derived(data.user?.role === 'owner' ? ownerActions : staffActions);

	let canvasEl = $state(null);
	let chart;

	onMount(async () => {
		const { Chart, registerables } = await import('chart.js');
		Chart.register(...registerables);

		const styles = getComputedStyle(document.documentElement);
		const primary = styles.getPropertyValue('--color-primary')?.trim() || '#2563eb';

		chart = new Chart(canvasEl, {
			type: 'bar',
			data: {
				labels: data.weekly.labels,
				datasets: [
					{
						label: 'Omset',
						data: data.weekly.data,
						backgroundColor: primary,
						borderRadius: 8,
						borderSkipped: false,
						maxBarThickness: 28
					}
				]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
					legend: { display: false },
					tooltip: {
						callbacks: {
							label: (ctx) => formatCurrency(ctx.parsed.y)
						}
					}
				},
				scales: {
					x: { grid: { display: false } },
					y: {
						beginAtZero: true,
						ticks: {
							callback: (v) => (v >= 1000 ? v / 1000 + 'k' : v)
						}
					}
				}
			}
		});
	});

	onDestroy(() => chart?.destroy());
</script>

<svelte:head>
	<title>Dashboard - LaundryKu</title>
</svelte:head>

<!-- Greeting -->
<section class="mb-5 animate-fade-slide-up">
	<p class="text-[12px] font-semibold text-on-surface-variant capitalize">{todayLabel}</p>
	<h2 class="mt-0.5 text-[24px] font-extrabold tracking-tight text-on-surface">{greeting}, {data.user?.name?.split(' ')[0]} 👋</h2>
</section>

{#if data.attendanceNeeded === 'masuk'}
	<section class="mb-4 animate-fade-slide-up">
		<a href="/attendance" class="pressable flex items-center gap-3 rounded-2xl bg-warning-container border border-warning/40 p-4">
			<span class="icon-tile w-11 h-11 rounded-xl bg-warning/15 text-warning">
				<span class="material-symbols-outlined text-[24px]">fingerprint</span>
			</span>
			<div class="flex-1">
				<p class="font-bold text-[14px] text-on-warning-container">Belum Absen Masuk</p>
				<p class="text-[11px] font-medium text-on-warning-container/80">Ketuk untuk absen sekarang</p>
			</div>
			<span class="material-symbols-outlined text-on-warning-container/60">chevron_right</span>
		</a>
	</section>
{:else if data.attendanceNeeded === 'keluar'}
	<section class="mb-4 animate-fade-slide-up">
		<a href="/attendance" class="pressable flex items-center gap-3 rounded-2xl bg-warning-container border border-warning/40 p-4">
			<span class="icon-tile w-11 h-11 rounded-xl bg-warning/15 text-warning">
				<span class="material-symbols-outlined text-[24px]">logout</span>
			</span>
			<div class="flex-1">
				<p class="font-bold text-[14px] text-on-warning-container">Belum Absen Keluar</p>
				<p class="text-[11px] font-medium text-on-warning-container/80">Ketuk untuk absen keluar</p>
			</div>
			<span class="material-symbols-outlined text-on-warning-container/60">chevron_right</span>
		</a>
	</section>
{/if}

<!-- Revenue Hero -->
<section class="mb-4 animate-fade-slide-up" style="animation-delay:0.05s">
	<div class="relative overflow-hidden rounded-3xl bg-brand-gradient p-5 text-white shadow-fab">
		<div class="absolute -right-8 -top-10 w-36 h-36 rounded-full bg-white/10"></div>
		<div class="absolute right-14 -bottom-8 w-24 h-24 rounded-full bg-white/10"></div>
		<div class="relative">
			<div class="flex items-start justify-between">
				<div>
					<p class="text-[11px] font-bold uppercase tracking-widest text-white/70">Omset Hari Ini</p>
					<p class="mt-1.5 text-[32px] leading-none font-extrabold tracking-tight">{formatCurrency(stats.revenueToday)}</p>
				</div>
				<span class="icon-tile w-11 h-11 rounded-xl bg-white/15 ring-1 ring-white/20">
					<span class="material-symbols-outlined text-[22px]">payments</span>
				</span>
			</div>
			<div class="mt-4 flex flex-wrap gap-2">
				<span class="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-[11px] font-bold ring-1 ring-white/10">
					<span class="material-symbols-outlined text-[14px]">receipt_long</span>
					{stats.ordersToday} order hari ini
				</span>
				<span class="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-[11px] font-bold ring-1 ring-white/10">
					<span class="material-symbols-outlined text-[14px]">calendar_month</span>
					{formatCurrency(stats.monthlyRevenue)} bulan ini
				</span>
			</div>
		</div>
	</div>
</section>

<!-- Stat Tiles -->
<section class="grid grid-cols-3 gap-2.5 mb-6 animate-fade-slide-up" style="animation-delay:0.1s">
	<div class="app-card p-3.5">
		<span class="icon-tile w-9 h-9 rounded-xl bg-primary/10 text-primary mb-2.5">
			<span class="material-symbols-outlined text-[20px]">autorenew</span>
		</span>
		<p class="text-[22px] font-extrabold text-on-surface leading-none">{stats.activeOrders}</p>
		<p class="mt-1.5 text-[10.5px] font-semibold text-on-surface-variant leading-tight">Order Aktif</p>
	</div>
	<div class="app-card p-3.5">
		<span class="icon-tile w-9 h-9 rounded-xl bg-kering/10 text-kering mb-2.5">
			<span class="material-symbols-outlined text-[20px]">today</span>
		</span>
		<p class="text-[22px] font-extrabold text-on-surface leading-none">{stats.ordersToday}</p>
		<p class="mt-1.5 text-[10.5px] font-semibold text-on-surface-variant leading-tight">Order Hari Ini</p>
	</div>
	<div class="app-card p-3.5">
		<span class="icon-tile w-9 h-9 rounded-xl bg-success/10 text-success mb-2.5">
			<span class="material-symbols-outlined text-[20px]">person_add</span>
		</span>
		<p class="text-[22px] font-extrabold text-on-surface leading-none">{stats.newCustomers}</p>
		<p class="mt-1.5 text-[10.5px] font-semibold text-on-surface-variant leading-tight">Pelanggan Baru</p>
	</div>
</section>

<!-- Weekly Chart -->
<section class="app-card p-4 mb-6 animate-fade-slide-up" style="animation-delay:0.15s">
	<div class="flex justify-between items-center mb-4">
		<div>
			<h3 class="text-[14px] font-extrabold text-on-surface">Omset 7 Hari Terakhir</h3>
			<p class="text-[11px] font-medium text-on-surface-variant mt-0.5">Total {formatCurrency(weeklyTotal)}</p>
		</div>
		<span class="icon-tile w-9 h-9 rounded-xl bg-primary/10 text-primary">
			<span class="material-symbols-outlined text-[20px]">bar_chart</span>
		</span>
	</div>
	<div class="h-44">
		<canvas bind:this={canvasEl}></canvas>
	</div>
</section>

<!-- Low Stock Alert -->
{#if data.lowStock.length > 0}
	<section class="mb-6 animate-fade-slide-up" style="animation-delay:0.2s">
		<div class="rounded-2xl bg-warning-container border border-warning/40 p-4">
			<div class="flex items-center gap-2 mb-3">
				<span class="material-symbols-outlined text-warning fill-icon">warning</span>
				<h3 class="text-[12px] font-bold uppercase tracking-wider text-on-warning-container">Stok Menipis</h3>
			</div>
			<div class="space-y-2">
				{#each data.lowStock as item}
					<a href="/inventory" class="pressable flex justify-between items-center bg-surface-container-lowest rounded-xl p-3">
						<div>
							<p class="text-[14px] text-on-surface font-bold">{item.inventory_name}</p>
							<p class="text-[11px] text-on-surface-variant">Min: {item.inventory_min_stock} {item.inventory_unit}</p>
						</div>
						<div class="text-right">
							<p class="text-[18px] font-extrabold text-error leading-none">{item.inventory_quantity}</p>
							<p class="text-[10px] font-semibold text-on-surface-variant mt-0.5">{item.inventory_unit}</p>
						</div>
					</a>
				{/each}
			</div>
		</div>
	</section>
{/if}

<!-- Quick Actions -->
<section class="mb-6 animate-fade-slide-up" style="animation-delay:0.2s">
	<h3 class="text-[12px] font-bold uppercase tracking-wider text-on-surface-variant mb-3">Aksi Cepat</h3>
	<div class="grid grid-cols-4 gap-3">
		{#each quickActions as action}
			<a href={action.href} class="pressable flex flex-col items-center gap-2">
				<span class="icon-tile w-14 h-14 rounded-2xl {action.color} shadow-card">
					<span class="material-symbols-outlined text-[26px]">{action.icon}</span>
				</span>
				<span class="text-[11px] font-semibold text-on-surface-variant text-center leading-tight">{action.label}</span>
			</a>
		{/each}
	</div>
</section>

<!-- Recent Orders -->
<section class="mb-6 animate-fade-slide-up" style="animation-delay:0.25s">
	<div class="flex items-center justify-between mb-3">
		<h3 class="text-[12px] font-bold uppercase tracking-wider text-on-surface-variant">Order Terbaru</h3>
		<a href="/orders" class="flex items-center gap-0.5 text-[12px] font-bold text-primary pressable-sm">
			Lihat Semua
			<span class="material-symbols-outlined text-[16px]">chevron_right</span>
		</a>
	</div>
	{#if recentOrders.length === 0}
		<div class="app-card p-8 text-center">
			<span class="material-symbols-outlined text-[40px] text-outline-variant">receipt_long</span>
			<p class="mt-2 text-[13px] font-medium text-on-surface-variant">Belum ada order hari ini</p>
			<a href="/orders/new" class="pressable inline-flex items-center gap-2 mt-4 h-11 px-5 bg-primary bg-brand-gradient text-white rounded-xl font-bold text-[13px] shadow-fab">
				<span class="material-symbols-outlined text-[18px]">add</span>
				Buat Order Pertama
			</a>
		</div>
	{:else}
		<div class="space-y-2.5 stagger">
			{#each recentOrders as order}
				{@const meta = statusMetaFor(order.order_status)}
				<a href="/orders/{order.order_id}" class="app-card pressable flex items-center gap-3 p-3.5">
					<div class="icon-tile w-11 h-11 rounded-xl bg-primary-fixed text-on-primary-fixed font-extrabold text-[15px]">
						{String(order.customer_name || '?').charAt(0).toUpperCase()}
					</div>
					<div class="flex-1 min-w-0">
						<h3 class="font-bold text-[14px] text-on-surface truncate">{order.customer_name}</h3>
						<p class="text-[11px] font-medium text-on-surface-variant">{formatDate(order.order_created_at)}</p>
					</div>
					<div class="text-right shrink-0">
						<p class="font-extrabold text-[14px] text-primary">{formatCurrency(order.order_total_price)}</p>
						<div class="mt-1 inline-flex items-center gap-1.5">
							<span class="w-1.5 h-1.5 rounded-full {meta.dot} {order.order_status === 'cuci' || order.order_status === 'setrika' ? 'animate-pulse' : ''}"></span>
							<span class="text-[11px] font-bold text-on-surface-variant">{meta.label}</span>
						</div>
					</div>
				</a>
			{/each}
		</div>
	{/if}
</section>


