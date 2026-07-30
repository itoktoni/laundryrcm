<script>
	import { enhance } from '$app/forms';
	import { formatDate } from '$lib/utils.js';

	let { data, form } = $props();
	let search = $derived(data.filters.search);
	let activeFilter = $state('all');
	let showAdd = $state(false);

	let filtered = $derived(
		data.customers.filter((c) => {
			if (activeFilter === 'vip') return c.customer_vip;
			if (activeFilter === 'new') return c.customer_total_orders === 0;
			return true;
		})
	);

	let stats = $derived({
		total: data.customers.length,
		vip: data.customers.filter((c) => c.customer_vip).length,
		orders: data.customers.reduce((s, c) => s + c.customer_total_orders, 0)
	});

	const filters = [
		{ id: 'all', label: 'Semua' },
		{ id: 'vip', label: 'VIP' },
		{ id: 'new', label: 'Baru' }
	];

	function initials(name) {
		return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
	}
</script>

<svelte:head>
	<title>Pelanggan - LaundryKu</title>
</svelte:head>

<div class="space-y-stack-lg">
	<!-- Header -->
	<div class="flex items-end justify-between gap-3 animate-fade-slide-up">
		<div>
			<h1 class="text-[24px] font-extrabold tracking-tight text-on-surface">Pelanggan</h1>
			<p class="text-[12px] font-medium text-on-surface-variant">Kelola data pelanggan laundry</p>
		</div>
		<button
			type="button"
			onclick={() => (showAdd = !showAdd)}
			class="pressable inline-flex items-center gap-2 h-11 px-4 bg-primary bg-brand-gradient text-white rounded-xl font-bold text-[13px] shadow-fab shrink-0"
		>
			<span class="material-symbols-outlined text-[20px]">{showAdd ? 'close' : 'add'}</span>
			<span class="hidden sm:inline">{showAdd ? 'Tutup' : 'Tambah Customer'}</span>
		</button>
	</div>

	{#if showAdd}
		<form
			method="POST"
			action="?/addCustomer"
			use:enhance={() => {
				return async ({ result, update }) => {
					await update();
					if (result.type === 'success') showAdd = false;
				};
			}}
			class="app-card p-4 space-y-3 animate-fade-slide-up"
		>
			<div>
				<label for="cust_name" class="text-label-md text-on-surface-variant">Nama</label>
				<input id="cust_name" name="customer_name" required class="w-full h-11 px-4 bg-surface-container-low border border-outline-variant rounded-lg text-body-sm mt-1" type="text" placeholder="Nama pelanggan" />
			</div>
			<div>
				<label for="cust_phone" class="text-label-md text-on-surface-variant">No. HP</label>
				<input id="cust_phone" name="customer_phone" required class="w-full h-11 px-4 bg-surface-container-low border border-outline-variant rounded-lg text-body-sm mt-1" type="tel" placeholder="08xxxxxxxxxx" />
			</div>
			<div>
				<label for="cust_address" class="text-label-md text-on-surface-variant">Alamat</label>
				<input id="cust_address" name="customer_address" class="w-full h-11 px-4 bg-surface-container-low border border-outline-variant rounded-lg text-body-sm mt-1" type="text" placeholder="Opsional" />
			</div>
			<button type="submit" class="pressable w-full h-12 bg-primary bg-brand-gradient text-white rounded-xl font-bold text-[13px] shadow-fab">
				Simpan Customer
			</button>
		</form>
	{/if}

	<!-- Stat cards -->
	<div class="grid grid-cols-3 gap-2.5 animate-fade-slide-up" style="animation-delay:0.05s">
		<div class="app-card p-3.5">
			<span class="icon-tile w-9 h-9 rounded-xl bg-primary/10 text-primary mb-2">
				<span class="material-symbols-outlined text-[20px]">group</span>
			</span>
			<p class="text-[22px] font-extrabold text-on-surface leading-none">{stats.total}</p>
			<p class="mt-1 text-[10.5px] font-semibold text-on-surface-variant">Total</p>
		</div>
		<div class="app-card p-3.5">
			<span class="icon-tile w-9 h-9 rounded-xl bg-warning/10 text-warning mb-2">
				<span class="material-symbols-outlined text-[20px] fill-icon">star</span>
			</span>
			<p class="text-[22px] font-extrabold text-on-surface leading-none">{stats.vip}</p>
			<p class="mt-1 text-[10.5px] font-semibold text-on-surface-variant">VIP</p>
		</div>
		<div class="app-card p-3.5">
			<span class="icon-tile w-9 h-9 rounded-xl bg-success/10 text-success mb-2">
				<span class="material-symbols-outlined text-[20px]">receipt_long</span>
			</span>
			<p class="text-[22px] font-extrabold text-on-surface leading-none">{stats.orders}</p>
			<p class="mt-1 text-[10.5px] font-semibold text-on-surface-variant">Order</p>
		</div>
	</div>

	<!-- Search -->
	<div class="relative w-full">
		<span class="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-[20px]">search</span>
		<form method="GET">
			<input
				name="search"
				value={search}
				class="w-full h-12 pl-11 pr-4 bg-surface-container-lowest border border-outline-variant rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/15 text-[14px] placeholder:text-outline-variant outline-none transition-all"
				placeholder="Cari nama atau HP..."
				type="text"
			/>
		</form>
	</div>

	<!-- Filter Chips -->
	<div class="flex gap-2 overflow-x-auto hide-scrollbar">
		{#each filters as f}
			<button
				onclick={() => (activeFilter = f.id)}
				class="chip {activeFilter === f.id ? 'chip-active' : ''}"
			>
				{f.label}
			</button>
		{/each}
	</div>

	{#if form?.error}
		<p class="text-body-sm text-error">{form.error}</p>
	{/if}

	<!-- Customer List -->
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-stack-md">
		{#if filtered.length === 0}
			<div class="col-span-full flex flex-col items-center py-16 text-center">
				<div class="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center">
					<span class="material-symbols-outlined text-[32px] text-outline-variant">group</span>
				</div>
				<p class="mt-3 text-body-sm text-on-surface-variant">Tidak ada pelanggan</p>
			</div>
		{:else}
			{#each filtered as customer}
				<div class="group relative app-card p-4 hover:shadow-card-lg transition-shadow">
					<a href="/customers/{customer.customer_id}" class="flex items-center gap-3">
						<div class="relative shrink-0">
							<div class="w-12 h-12 rounded-2xl {customer.customer_vip ? 'bg-warning/20 text-warning' : 'bg-primary-fixed text-on-primary-fixed'} flex items-center justify-center font-bold text-headline-md">
								{initials(customer.customer_name)}
							</div>
							{#if customer.customer_vip}
								<span class="absolute -top-1 -right-1 w-5 h-5 bg-warning rounded-full flex items-center justify-center ring-2 ring-surface-container-lowest">
									<span class="material-symbols-outlined text-[12px] text-on-surface fill-icon">star</span>
								</span>
							{/if}
						</div>

						<div class="flex-1 min-w-0">
							<h3 class="font-headline-md text-on-surface leading-tight truncate">{customer.customer_name}</h3>
							<div class="flex items-center gap-1 text-on-surface-variant mt-0.5">
								<span class="text-body-sm truncate">{customer.customer_phone}</span>
							</div>
						</div>

						<span class="material-symbols-outlined text-outline group-hover:text-primary transition-colors">chevron_right</span>
					</a>

					<div class="mt-3 flex items-center justify-between border-t border-outline-variant pt-3">
						<div class="flex flex-col gap-1">
							<div class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container-high {customer.total_orders === 0 ? 'text-outline' : 'text-secondary'}">
								<span class="material-symbols-outlined text-[13px]">receipt_long</span>
								<span class="text-label-sm font-label-md">{customer.total_orders || 0} order</span>
							</div>
							{#if customer.total_kg > 0}
								<div class="text-label-sm text-on-surface-variant">
									{customer.total_kg} kg terakhir pesan tanggal {formatDate(customer.last_order)}
								</div>
							{/if}
						</div>

						<form
							method="POST"
							action="?/deleteCustomer"
							use:enhance={({ cancel }) => {
								if (!confirm(`Hapus pelanggan ${customer.customer_name}?`)) cancel();
							}}
						>
							<input type="hidden" name="customer_id" value={customer.customer_id} />
							<button type="submit" class="p-1.5 rounded-lg text-outline hover:bg-error-container hover:text-error transition-colors" aria-label="Hapus pelanggan">
								<span class="material-symbols-outlined text-[18px]">delete</span>
							</button>
						</form>
					</div>
				</div>
			{/each}
		{/if}
	</div>
</div>

