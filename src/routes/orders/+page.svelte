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
		packing: 'bg-packing',
		selesai: 'bg-success',
		diambil: 'bg-secondary'
	};

	const statusLabels = {
		pending: 'Antre',
		cuci: 'Cuci',
		kering: 'Kering',
		setrika: 'Setrika',
		packing: 'Packing',
		selesai: 'Selesai',
		diambil: 'Diambil'
	};

	/** @param {unknown} status */
	function statusColorFor(status) {
		const key = String(status);
		return statusColors[/** @type {keyof typeof statusColors} */ (key)] || statusColors.pending;
	}

	/** @param {unknown} status */
	function statusLabelFor(status) {
		const key = String(status);
		return statusLabels[/** @type {keyof typeof statusLabels} */ (key)] || key;
	}
</script>

<svelte:head>
	<title>Order - LaundryKu</title>
</svelte:head>

<!-- Header + Search -->
<div class="sticky top-0 bg-surface/90 backdrop-blur-xl z-40 -mx-container-margin px-container-margin pt-2 pb-3 space-y-3.5">
	<div class="flex items-center justify-between gap-3">
		<div>
			<h1 class="text-[24px] font-extrabold tracking-tight text-on-surface">Order</h1>
			<p class="text-[12px] font-medium text-on-surface-variant">{data.orders.length} order ditemukan</p>
		</div>
		<div class="flex items-center gap-2">
			<button onclick={() => showDateFilter = !showDateFilter} class="pressable-sm icon-tile w-10 h-10 rounded-xl {showDateFilter ? 'bg-primary/10 text-primary' : 'bg-surface-container-high text-on-surface-variant'}" aria-label="Filter tanggal">
				<span class="material-symbols-outlined text-[20px]">date_range</span>
			</button>
			<a href="/api/orders/export?{new URLSearchParams(Object.fromEntries(Object.entries({status: data.filters.status, start_date: data.filters.startDate, end_date: data.filters.endDate}).filter(([k,v]) => v))).toString()}" class="pressable-sm icon-tile w-10 h-10 rounded-xl bg-surface-container-high text-on-surface-variant" aria-label="Export CSV" download>
				<span class="material-symbols-outlined text-[20px]">download</span>
			</a>
			<a href="/orders/new" class="hidden md:inline-flex pressable items-center gap-2 h-11 px-5 bg-primary bg-brand-gradient text-white rounded-xl font-bold text-[13px] shadow-fab">
				<span class="material-symbols-outlined text-[20px]">add</span>
				Tambah Order
			</a>
		</div>
	</div>

	<!-- Date Filter -->
	{#if showDateFilter}
		<div class="app-card p-4 space-y-3 animate-fade-slide-up">
			<div class="flex items-center justify-between">
				<p class="text-[13px] font-extrabold text-on-surface">Filter Tanggal</p>
				{#if data.filters.startDate || data.filters.endDate}
					<button onclick={clearDateFilter} class="text-[12px] font-bold text-error pressable-sm">Hapus Filter</button>
				{/if}
			</div>
			<div class="grid grid-cols-2 gap-2">
				<div>
					<label for="start_date" class="text-[11px] font-semibold text-on-surface-variant mb-1 block">Tanggal Mulai</label>
					<input id="start_date" type="date" bind:value={startDate} class="w-full h-11 px-3 bg-surface-container-low border border-outline-variant rounded-xl text-[13px] focus:border-primary focus:ring-4 focus:ring-primary/15 outline-none transition-all" />
				</div>
				<div>
					<label for="end_date" class="text-[11px] font-semibold text-on-surface-variant mb-1 block">Tanggal Akhir</label>
					<input id="end_date" type="date" bind:value={endDate} class="w-full h-11 px-3 bg-surface-container-low border border-outline-variant rounded-xl text-[13px] focus:border-primary focus:ring-4 focus:ring-primary/15 outline-none transition-all" />
				</div>
			</div>
			<button onclick={applyDateFilter} class="pressable w-full h-11 bg-primary bg-brand-gradient text-white rounded-xl font-bold text-[13px] shadow-fab">Terapkan Filter</button>
		</div>
	{/if}

	<!-- Active Date Filter Display -->
	{#if data.filters.startDate || data.filters.endDate}
		<div class="flex items-center gap-2 text-[12px] font-semibold text-primary bg-primary/8 px-3 py-2 rounded-xl animate-fade-in">
			<span class="material-symbols-outlined text-[16px]">filter_alt</span>
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

	<!-- Search -->
	<div class="relative">
		<span class="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-[20px]">search</span>
		<form method="GET">
			{#if startDate}<input type="hidden" name="start_date" value={startDate} />{/if}
			{#if endDate}<input type="hidden" name="end_date" value={endDate} />{/if}
			<input name="search" value={search} class="w-full h-12 pl-11 pr-4 bg-surface-container-lowest border border-outline-variant rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/15 text-[14px] placeholder:text-outline-variant outline-none transition-all" placeholder="Cari order atau nama pelanggan..." type="text" />
		</form>
	</div>

	<!-- Status Tabs -->
	<div class="flex gap-2 overflow-x-auto hide-scrollbar -mx-container-margin px-container-margin">
		{#each [{id: '', label: 'Semua'}, {id: 'pending', label: 'Proses'}, {id: 'selesai', label: 'Selesai'}, {id: 'diambil', label: 'Diambil'}] as tab}
			<button
				onclick={() => filterByStatus(tab.id)}
				class="chip {data.filters.status === tab.id ? 'chip-active' : ''}"
			>
				{tab.label}
			</button>
		{/each}
	</div>
</div>

<!-- Orders List -->
<div class="pt-4 space-y-2.5 stagger">
	{#if data.orders.length === 0}
		<div class="app-card p-10 text-center">
			<div class="icon-tile w-16 h-16 rounded-2xl bg-surface-container-high mx-auto">
				<span class="material-symbols-outlined text-[32px] text-outline-variant">receipt_long</span>
			</div>
			<p class="mt-3 text-[14px] font-bold text-on-surface">Tidak ada order ditemukan</p>
			<p class="mt-1 text-[12px] font-medium text-on-surface-variant">Coba ubah filter atau buat order baru</p>
			<a href="/orders/new" class="pressable inline-flex items-center gap-2 mt-5 h-11 px-5 bg-primary bg-brand-gradient text-white rounded-xl font-bold text-[13px] shadow-fab">
				<span class="material-symbols-outlined text-[18px]">add</span>
				Order Baru
			</a>
		</div>
	{:else}
		{#each data.orders as order}
			<a href="/orders/{order.order_id}" class="app-card pressable block p-4">
				<div class="flex items-start justify-between gap-3">
					<div class="flex items-center gap-3 min-w-0">
						<div class="icon-tile w-11 h-11 rounded-xl bg-primary-fixed text-on-primary-fixed font-extrabold text-[15px]">
							{String(order.customer_name || '?').charAt(0).toUpperCase()}
						</div>
						<div class="min-w-0">
							<h3 class="font-bold text-[15px] text-on-surface truncate">{order.customer_name}</h3>
							<p class="text-[11px] font-medium text-on-surface-variant">
								#{String(order.order_id || '').slice(0, 8).toUpperCase()}{#if order.order_unique_code} · Kode {order.order_unique_code}{/if}
							</p>
						</div>
					</div>
					<div class="text-right shrink-0">
						<p class="font-extrabold text-[15px] text-primary">{formatCurrency(order.order_total_price)}</p>
						<p class="text-[10px] font-medium text-on-surface-variant mt-0.5">{formatDate(order.order_created_at)}</p>
					</div>
				</div>
				<div class="flex justify-between items-center mt-3 pt-3 border-t border-outline-variant/70">
					<div class="flex items-center gap-2">
						<span class="w-2 h-2 rounded-full {statusColorFor(order.order_status)} {order.order_status === 'cuci' || order.order_status === 'setrika' ? 'animate-pulse' : ''}"></span>
						<span class="text-[12px] font-bold text-on-surface-variant">{statusLabelFor(order.order_status)}</span>
					</div>
					{#if order.order_payment_status === 'unpaid'}
						<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-error/10 text-error text-[10px] font-bold">
							<span class="material-symbols-outlined text-[13px]">schedule</span>
							Belum Bayar
						</span>
					{:else}
						<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-success/10 text-success text-[10px] font-bold">
							<span class="material-symbols-outlined text-[13px] fill-icon">check_circle</span>
							Lunas
						</span>
					{/if}
				</div>
			</a>
		{/each}
	{/if}
</div>