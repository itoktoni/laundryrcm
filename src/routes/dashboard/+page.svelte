<script>
	import { formatCurrency, formatDate } from '$lib/utils.js';
	import { onMount, onDestroy } from 'svelte';

	let { data } = $props();
	let stats = $derived(data.stats);
	let recentOrders = $derived(data.recentOrders);

	let canvasEl = $state(null);
	let chart;

	onMount(async () => {
		const { Chart, registerables } = await import('chart.js');
		Chart.register(...registerables);

		const styles = getComputedStyle(document.documentElement);
		const primary = styles.getPropertyValue('--color-primary')?.trim() || '#004ac6';

		chart = new Chart(canvasEl, {
			type: 'bar',
			data: {
				labels: data.weekly.labels,
				datasets: [
					{
						label: 'Omset',
						data: data.weekly.data,
						backgroundColor: primary,
						borderRadius: 6,
						maxBarThickness: 36
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

<!-- Welcome Section -->
<section class="mb-stack-lg">
	<p class="font-label-md text-label-md text-on-surface-variant">Halo, {data.user?.name} 👋</p>
	<h2 class="font-headline-md text-headline-md text-on-surface">Statistik Toko Anda</h2>
</section>

<!-- Summary Bento Grid -->
<section class="grid grid-cols-2 gap-stack-sm mb-stack-lg">
	<div class="col-span-2 bg-primary-container p-4 rounded-xl text-on-primary-container flex justify-between items-center overflow-hidden relative">
		<div class="relative z-10">
			<p class="font-label-md text-label-md opacity-90">Omset Hari Ini</p>
			<p class="font-display text-display font-bold">{formatCurrency(stats.revenueToday)}</p>
		</div>
		<div class="absolute -right-4 -bottom-4 opacity-10">
			<span class="material-symbols-outlined text-[120px]">payments</span>
		</div>
	</div>
	<div class="bg-surface-container-highest p-4 rounded-xl border border-outline-variant">
		<div class="flex items-center gap-2 mb-1">
			<span class="material-symbols-outlined text-primary text-sm">receipt_long</span>
			<p class="font-label-md text-label-md text-on-surface-variant">Order Aktif</p>
		</div>
		<p class="font-headline-lg text-headline-lg text-on-surface">{stats.activeOrders}</p>
	</div>
	<div class="bg-surface-container-highest p-4 rounded-xl border border-outline-variant">
		<div class="flex items-center gap-2 mb-1">
			<span class="material-symbols-outlined text-success text-sm">person_add</span>
			<p class="font-label-md text-label-md text-on-surface-variant">Pelanggan Baru</p>
		</div>
		<p class="font-headline-lg text-headline-lg text-on-surface">{stats.newCustomers}</p>
	</div>
</section>

<!-- Charts Section -->
<section class="mb-stack-lg bg-surface-container-low p-4 rounded-xl border border-outline-variant">
	<div class="flex justify-between items-center mb-4">
		<h3 class="font-label-md text-label-md text-on-surface font-bold uppercase tracking-wider">Omset 7 Hari Terakhir</h3>
	</div>
	<div class="h-48">
		<canvas bind:this={canvasEl}></canvas>
	</div>
</section>

<!-- Quick Actions -->
<section class="mb-stack-lg">
	<h3 class="font-label-md text-label-md mb-stack-sm text-on-surface font-bold uppercase tracking-wider">Aksi Cepat</h3>
	<div class="grid grid-cols-2 gap-stack-sm">
		<a href="/orders/new" class="flex items-center justify-center gap-2 py-4 bg-primary text-on-primary rounded-xl font-bold active:scale-95 transition-transform">
			<span class="material-symbols-outlined">add_circle</span>
			Order Baru
		</a>
		<a href="/finance" class="flex items-center justify-center gap-2 py-4 bg-surface-container-highest text-on-surface border border-outline-variant rounded-xl font-bold active:scale-95 transition-transform">
			<span class="material-symbols-outlined">outbox</span>
			Pengeluaran
		</a>
	</div>
</section>

<!-- Recent Orders -->
<section class="mb-stack-lg">
	<h3 class="font-label-md text-label-md mb-stack-sm text-on-surface font-bold uppercase tracking-wider">Order Terbaru</h3>
	{#if recentOrders.length === 0}
		<p class="text-body-sm text-on-surface-variant">Belum ada order</p>
	{:else}
		<div class="space-y-3">
			{#each recentOrders as order}
				<a href="/orders/{order.order_id}" class="block bg-surface-container-lowest p-4 rounded-xl border border-outline-variant active:scale-[0.98] transition-transform">
					<div class="flex justify-between items-start mb-2">
						<div>
							<h3 class="font-headline-md text-headline-md text-on-surface">{order.customer_name}</h3>
							<p class="text-label-md font-label-md text-outline">{formatDate(order.order_created_at)}</p>
						</div>
						<div class="text-right">
							<span class="block font-headline-md text-headline-md text-primary">{formatCurrency(order.order_total_price)}</span>
						</div>
					</div>
					<div class="flex justify-between items-center pt-3 border-t border-outline-variant">
						<div class="flex items-center gap-2">
							<div class="w-2 h-2 rounded-full {order.order_status === 'pending' ? 'bg-pending' : order.order_status === 'cuci' ? 'bg-primary' : order.order_status === 'setrika' ? 'bg-setrika' : 'bg-success'}"></div>
							<span class="text-label-md font-label-md text-primary capitalize">{order.order_status}</span>
						</div>
						<span class="text-label-md font-label-md text-outline">Lihat Detail</span>
					</div>
				</a>
			{/each}
		</div>
	{/if}
</section>


