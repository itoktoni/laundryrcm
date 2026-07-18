<script>
	import { formatCurrency, formatDate } from '$lib/utils.js';

	let { data } = $props();
	let search = $derived(data.filters.search);

	function filterByStatus(status) {
		const url = new URL(window.location.href);
		url.searchParams.set('status', status);
		window.location.href = url.toString();
	}

	const statusColors = {
		pending: 'bg-pending',
		cuci: 'bg-primary',
		kering: 'bg-kering',
		setrika: 'bg-setrika',
		selesai: 'bg-success',
		diambil: 'bg-secondary'
	};

	const statusLabels = {
		pending: 'Antre',
		cuci: 'Cuci',
		kering: 'Kering',
		setrika: 'Setrika',
		selesai: 'Selesai',
		diambil: 'Diambil'
	};
</script>

<svelte:head>
	<title>Order - LaundryKu</title>
</svelte:head>

<!-- Header + Search -->
<div class="sticky bg-surface/95 dark:bg-dark-bg/95 backdrop-blur-md z-40 pt-stack-md pb-stack-sm space-y-4">
	<div class="flex items-center justify-between gap-3">
		<h1 class="font-headline-lg text-headline-lg text-on-surface">Order</h1>
		<a href="/orders/new" class="hidden md:inline-flex items-center gap-2 h-11 px-4 bg-primary text-on-primary rounded-xl font-bold text-label-md active:scale-95 transition-transform">
			<span class="material-symbols-outlined text-[20px]">add</span>
			Tambah Order
		</a>
	</div>
	<div class="relative group">
		<span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
		<form method="GET">
			<input name="search" value={search} class="w-full h-11 pl-10 pr-4 bg-surface-container-low dark:bg-gray-800 border border-outline-variant dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-body-md placeholder-outline-variant transition-all" placeholder="Cari order atau nama..." type="text" />
		</form>
	</div>
	<div class=" flex items-center justify-between border-b border-outline-variant dark:border-outline overflow-x-auto hide-scrollbar">
		{#each [{id: '', label: 'Semua'}, {id: 'pending', label: 'Proses'}, {id: 'selesai', label: 'Selesai'}, {id: 'diambil', label: 'Diambil'}] as tab}
			<button
				onclick={() => filterByStatus(tab.id)}
				class="px-4 py-2 font-label-md text-label-md whitespace-nowrap {data.filters.status === tab.id ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant'}"
			>
				{tab.label}
			</button>
		{/each}
	</div>
</div>

<!-- Orders List -->
<div class="py-stack-md space-y-4">
	{#if data.orders.length === 0}
		<div class="text-center py-12">
			<span class="material-symbols-outlined text-[48px] text-outline-variant">receipt_long</span>
			<p class="mt-2 text-body-sm text-on-surface-variant">Tidak ada order ditemukan</p>
		</div>
	{:else}
		{#each data.orders as order}
			<a href="/orders/{order.order_id}" class="block bg-surface-container-lowest dark:bg-dark-card p-4 rounded-xl border border-outline-variant dark:border-gray-700 shadow-[0px_1px_3px_rgba(0,0,0,0.05)] active:scale-[0.98] transition-transform duration-150">
				<div class="flex justify-between items-start mb-2">
					<div>
						<h3 class="font-headline-md text-headline-md text-on-surface">{order.customer_name}</h3>
						<p class="text-label-md font-label-md text-outline">
							#{order.order_id.slice(0, 8).toUpperCase()}{#if order.order_unique_code} · Kode {order.order_unique_code}{/if}
						</p>
					</div>
					<div class="text-right">
						<span class="block font-headline-md text-headline-md text-primary">{formatCurrency(order.order_total_price)}</span>
						<p class="text-label-sm font-label-sm text-outline">{formatDate(order.order_created_at)}</p>
					</div>
				</div>
				<div class="flex justify-between items-center pt-3 border-t border-outline-variant dark:border-gray-700">
					<div class="flex items-center gap-2">
						<div class="w-2 h-2 rounded-full {statusColors[order.order_status]} {order.order_status === 'cuci' || order.order_status === 'setrika' ? 'animate-pulse' : ''}"></div>
						<span class="text-label-md font-label-md text-primary">{statusLabels[order.order_status]}</span>
					</div>
					{#if order.order_payment_status === 'unpaid'}
						<span class="px-2 py-1 bg-error-container text-on-error-container text-label-sm font-label-md rounded">Belum Bayar</span>
					{:else}
						<span class="px-2 py-1 bg-success/10 text-success text-label-sm font-label-md rounded">Lunas</span>
					{/if}
				</div>
			</a>
		{/each}
	{/if}
</div>

<a href="/orders/new" class="fixed bottom-20 right-4 w-14 h-14 bg-primary text-on-primary rounded-2xl shadow-lg flex items-center justify-center active:scale-95 transition-transform z-40 md:hidden">
	<span class="material-symbols-outlined text-[32px]">add</span>
</a>

<style>
	.hide-scrollbar::-webkit-scrollbar { display: none; }
	.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
