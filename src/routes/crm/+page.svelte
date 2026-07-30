<script>
	import { formatCurrency, formatDate, formatDateTime } from '$lib/utils.js';
	import { enhance } from '$app/forms';

	let { data, form } = $props();
	let activeTab = $state('all');
	let showFilter = $state(false);

	const tabs = [
		{ id: 'all', label: 'Semua' },
		{ id: 'inactive', label: 'Tidak Aktif' },
		{ id: 'pending', label: 'Belum Diambil' }
	];

	const statusColors = {
		pending: 'bg-pending',
		cuci: 'bg-primary',
		kering: 'bg-kering',
		setrika: 'bg-setrika',
		selesai: 'bg-success',
		diambil: 'bg-secondary'
	};

	function initials(name) {
		return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
	}

	const filteredInactive = $derived(
		data.inactiveCustomers.filter((c) => {
			if (activeTab === 'inactive') return c.days_since_last_order >= 7;
			if (activeTab === 'all') return true;
			return false;
		})
	);

	const filteredPending = $derived(
		data.pendingPickupOrders.filter((o) => {
			if (activeTab === 'pending') return o.order_status !== 'diambil';
			if (activeTab === 'all') return true;
			return false;
		})
	);

	const filteredActivity = $derived(
		data.recentActivity.filter((a) => {
			if (activeTab === 'all') return true;
			if (activeTab === 'inactive') return a.activity_type === 'customer_inactive';
			if (activeTab === 'pending') return a.activity_type === 'pending_pickup';
			return false;
		})
	);
</script>

<svelte:head>
	<title>CRM - LaundryKu</title>
</svelte:head>

<div class="space-y-stack-lg">
	<!-- Header -->
	<div class="flex items-end justify-between gap-3">
		<div>
			<h1 class="font-headline-lg text-headline-lg text-on-surface">CRM</h1>
			<p class="text-body-sm text-on-surface-variant">Customer Relationship Management</p>
		</div>
		<button
			type="button"
			onclick={() => (showFilter = !showFilter)}
			class="inline-flex items-center gap-2 h-11 px-4 bg-surface-container-low border border-outline-variant rounded-xl font-bold text-label-md active:scale-95 transition-transform shrink-0"
		>
			<span class="material-symbols-outlined text-[20px]">filter_list</span>
			<span class="hidden sm:inline">{showFilter ? 'Tutup' : 'Filter'}</span>
		</button>
	</div>

	{#if showFilter}
		<form method="GET" class="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant space-y-3">
			<div class="grid grid-cols-2 gap-3">
				<div>
					<label for="inactive_days" class="text-label-md text-on-surface-variant">Hari Tidak Aktif</label>
					<input
						id="inactive_days"
						name="inactive_days"
						type="number"
						value={data.filters.inactiveDays}
						class="w-full h-11 px-4 bg-surface-container-low border border-outline-variant rounded-lg text-body-sm mt-1"
						placeholder="7"
					/>
				</div>
			</div>
			<button type="submit" class="w-full h-11 bg-primary text-on-primary rounded-lg font-bold text-label-md">
				Terapkan Filter
			</button>
		</form>
	{/if}

	<!-- Stats Cards -->
	<div class="grid grid-cols-2 md:grid-cols-4 gap-stack-sm">
		<div class="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 text-center">
			<p class="font-display text-display text-primary font-bold">{data.stats.total_customers}</p>
			<p class="text-label-sm text-on-surface-variant">Total Pelanggan</p>
		</div>
		<div class="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 text-center">
			<p class="font-display text-display text-warning font-bold">{data.stats.vip_count}</p>
			<p class="text-label-sm text-on-surface-variant">VIP</p>
		</div>
		<div class="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 text-center">
			<p class="font-display text-display text-success font-bold">{data.stats.new_customers}</p>
			<p class="text-label-sm text-on-surface-variant">Baru</p>
		</div>
		<div class="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 text-center">
			<p class="font-display text-display text-secondary font-bold">{Math.round(data.stats.vip_percentage)}%</p>
			<p class="text-label-sm text-on-surface-variant">Persentase VIP</p>
		</div>
	</div>

	<!-- Tabs -->
	<div class="flex gap-2 overflow-x-auto no-scrollbar">
		{#each tabs as tab}
			<button
				onclick={() => (activeTab = tab.id)}
				class="px-5 py-2.5 rounded-full font-label-md text-label-md whitespace-nowrap active:scale-95 transition-all {activeTab === tab.id
					? 'bg-primary text-on-primary'
					: 'bg-surface-container-high text-on-surface-variant'}"
			>
				{tab.label}
			</button>
		{/each}
	</div>

	<!-- Pending Pickup Orders -->
	{#if filteredPending.length > 0}
		<div>
			<h2 class="font-label-md text-label-md text-on-surface font-bold uppercase tracking-wider mb-stack-sm">
				Pesanan Belum Diambil
			</h2>
			<div class="space-y-3">
				{#each filteredPending as order}
					<a
						href="/orders/{order.order_id}"
						class="block bg-surface-container-lowest p-4 rounded-xl border border-outline-variant hover:border-primary hover:shadow-md transition-all"
					>
						<div class="flex justify-between items-start">
							<div class="flex-1">
								<div class="flex items-center gap-2 mb-1">
									<span class="font-headline-md text-primary">{formatCurrency(order.order_total_price)}</span>
									<span class="w-2 h-2 rounded-full {statusColors[order.order_status]}"></span>
								</div>
								<p class="text-label-sm text-on-surface-variant">{order.customer_name}</p>
								<p class="text-label-sm text-on-surface-variant">{order.order_unique_code || order.order_id.slice(-6)}</p>
								{#if order.order_notes}
									<p class="text-body-sm text-secondary mt-1">{order.order_notes}</p>
								{/if}
							</div>
							<div class="flex flex-col items-end gap-1 ml-3">
								<span class="text-label-sm text-on-surface-variant">{formatDateTime(order.order_created_at)}</span>
								<span class="px-2 py-1 bg-surface-container-high rounded-full text-label-sm text-secondary">
									Lihat Detail
								</span>
							</div>
						</div>
					</a>
				{/each}
			</div>
		</div>
	{/if}

	<!-- Inactive Customers -->
	{#if filteredInactive.length > 0}
		<div>
			<h2 class="font-label-md text-label-md text-on-surface font-bold uppercase tracking-wider mb-stack-sm">
				Pelanggan Tidak Aktif
			</h2>
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-stack-md">
				{#each filteredInactive as customer}
					<a
						href="/customers/{customer.customer_id}"
						class="block bg-surface-container-lowest p-4 rounded-xl border border-outline-variant hover:border-primary hover:shadow-md transition-all"
					>
						<div class="flex items-center gap-3 mb-3">
							<div class="w-12 h-12 rounded-full {customer.customer_vip ? 'bg-warning/20 text-warning' : 'bg-primary-fixed text-on-primary-fixed'} flex items-center justify-center font-bold text-headline-md shrink-0">
								{initials(customer.customer_name)}
							</div>
							<div class="flex-1 min-w-0">
								<h3 class="font-headline-md text-on-surface leading-tight truncate">{customer.customer_name}</h3>
								<p class="text-label-sm text-on-surface-variant truncate">{customer.customer_phone}</p>
							</div>
						</div>
						<div class="border-t border-outline-variant pt-3">
							<div class="flex items-center justify-between">
								<div class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container-high text-secondary">
									<span class="text-label-sm font-label-md">{Math.round(customer.days_since_last_order)} hari</span>
								</div>
								<span class="material-symbols-outlined text-outline">chevron_right</span>
							</div>
						</div>
					</a>
				{/each}
			</div>
		</div>
	{/if}

	<!-- Recent Activity -->
	{#if filteredActivity.length > 0}
		<div>
			<h2 class="font-label-md text-label-md text-on-surface font-bold uppercase tracking-wider mb-stack-sm">
				Aktivitas Terkini
			</h2>
			<div class="space-y-3">
				{#each filteredActivity as activity}
					<div class="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant">
						<div class="flex items-center justify-between">
							<div class="flex items-center gap-3">
								<div class="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center shrink-0">
									<span class="material-symbols-outlined text-[20px] text-secondary">
										{activity.activity_type === 'customer_inactive' ? 'timer_off' : 'schedule'}
									</span>
								</div>
								<div>
									<p class="text-label-md text-on-surface font-bold">
										{activity.activity_type === 'customer_inactive' ? 'Pelanggan Tidak Aktif' : 'Pesanan Belum Diambil'}
									</p>
								<p class="text-body-sm text-on-surface-variant">
									{#if activity.activity_type === 'customer_inactive'}
										{activity.customer_name} - {Math.round(activity.days_diff)} hari
									{:else if activity.activity_type === 'pending_pickup'}
										{activity.customer_name}
										<br>
										{activity.customer_phone}
									{/if}
								</p>
								</div>
							</div>
							<div class="text-right">
								<p class="text-label-sm text-on-surface-variant">{formatDateTime(activity.created_at)}</p>
								{#if activity.activity_type === 'customer_inactive'}
									<a
										href="/customers/{activity.customer_id}"
										class="text-label-sm text-primary hover:underline"
									>
										Lihat Pelanggan
									</a>
								{/if}
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/if}

	{#if filteredInactive.length === 0 && filteredPending.length === 0}
		<div class="flex flex-col items-center py-16 text-center">
			<div class="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center">
				<span class="material-symbols-outlined text-[32px] text-outline-variant">check_circle</span>
			</div>
			<p class="mt-3 text-body-sm text-on-surface-variant">Semua pelanggan aktif</p>
		</div>
	{/if}
</div>

<style>
	.no-scrollbar::-webkit-scrollbar { display: none; }
	.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
