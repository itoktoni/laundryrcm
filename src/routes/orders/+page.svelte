<script>
	import { formatCurrency, formatDate } from '$lib/utils.js';

	let { data } = $props();
	let search = $derived(data.filters.search);
	let startDate = $state(data.filters.startDate || '');
	let endDate = $state(data.filters.endDate || '');
	let showDateFilter = $state(false);

	function filterByStatus(status) {
		const url = new URL(window.location.href);
		url.searchParams.set('status', status);
		if (startDate) url.searchParams.set('start_date', startDate);
		if (endDate) url.searchParams.set('end_date', endDate);
		window.location.href = url.toString();
	}

	function applyDateFilter() {
		const url = new URL(window.location.href);
		if (startDate) url.searchParams.set('start_date', startDate);
		if (endDate) url.searchParams.set('end_date', endDate);
		if (data.filters.status) url.searchParams.set('status', data.filters.status);
		window.location.href = url.toString();
	}

	function clearDateFilter() {
		startDate = '';
		endDate = '';
		const url = new URL(window.location.href);
		url.searchParams.delete('start_date');
		url.searchParams.delete('end_date');
		if (data.filters.status) url.searchParams.set('status', data.filters.status);
		window.location.href = url.toString();
	}

	function exportOrders() {
		const params = new URLSearchParams();
		if (data.filters.status) params.set('status', data.filters.status);
		if (data.filters.startDate) params.set('start_date', data.filters.startDate);
		if (data.filters.endDate) params.set('end_date', data.filters.endDate);
		window.location.href = `/api/orders/export?${params.toString()}`;
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
		<div class="flex items-center gap-2">
			<button onclick={() => showDateFilter = !showDateFilter} class="h-10 px-3 rounded-full bg-blue-600 hover:bg-blue-700 text-sm font-medium text-white transition-colors flex items-center gap-1">
				<span class="material-symbols-outlined text-[18px]">date_range</span>
				<span class="hidden sm:inline">Filter</span>
			</button>
			<a href="/api/orders/export?{new URLSearchParams(Object.fromEntries(Object.entries({status: data.filters.status, start_date: data.filters.startDate, end_date: data.filters.endDate}).filter(([k,v]) => v))).toString()}" class="inline-flex h-10 items-center gap-1 px-3 rounded-full bg-green-600 hover:bg-green-700 text-sm font-medium text-white transition-colors" download>
				<span class="material-symbols-outlined text-[18px]">download</span>
				CSV
			</a>
			<a href="/orders/new" class="hidden md:inline-flex items-center gap-2 h-11 px-4 bg-primary text-on-primary rounded-xl font-bold text-label-md active:scale-95 transition-transform">
				<span class="material-symbols-outlined text-[20px]">add</span>
				Tambah Order
			</a>
		</div>
	</div>

	<!-- Date Filter -->
	{#if showDateFilter}
		<div class="bg-surface-container-low p-3 rounded-xl border border-outline-variant space-y-2">
			<div class="flex items-center justify-between">
				<p class="text-label-md font-bold text-on-surface">Filter Tanggal</p>
				{#if data.filters.startDate || data.filters.endDate}
					<button onclick={clearDateFilter} class="text-xs text-red-600 hover:underline">Hapus Filter</button>
				{/if}
			</div>
			<div class="grid grid-cols-2 gap-2">
				<div>
					<label class="text-label-sm text-on-surface-variant mb-1 block">Tanggal Mulai</label>
					<input type="date" bind:value={startDate} class="w-full h-10 px-3 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-sm" />
				</div>
				<div>
					<label class="text-label-sm text-on-surface-variant mb-1 block">Tanggal Akhir</label>
					<input type="date" bind:value={endDate} class="w-full h-10 px-3 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-sm" />
				</div>
			</div>
			<button onclick={applyDateFilter} class="w-full h-10 bg-primary text-on-primary rounded-lg font-bold text-label-md">Terapkan Filter</button>
		</div>
	{/if}

	<!-- Active Date Filter Display -->
	{#if data.filters.startDate || data.filters.endDate}
		<div class="flex items-center gap-2 text-xs text-on-surface-variant bg-blue-50 dark:bg-blue-900/20 px-3 py-2 rounded-lg">
			<span class="material-symbols-outlined text-[14px]">filter_alt</span>
			<span>
				{#if data.filters.startDate && data.filters.endDate}
					{data.filters.startDate} s/d {data.filters.endDate}
				{:else if data.filters.startDate}
					Dari {data.filters.startDate}
				{:else}
					Sampai {data.filters.endDate}
				{/if}
			</span>
		</div>
	{/if}

	<div class="relative group">
		<span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
		<form method="GET">
			{#if startDate}<input type="hidden" name="start_date" value={startDate} />{/if}
			{#if endDate}<input type="hidden" name="end_date" value={endDate} />{/if}
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

<a href="/orders/new" class="hidden">
	<span class="material-symbols-outlined text-[32px]">add</span>
</a>

<style>
	.hide-scrollbar::-webkit-scrollbar { display: none; }
	.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>