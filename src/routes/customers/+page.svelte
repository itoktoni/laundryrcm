<script>
	import { enhance } from '$app/forms';

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
	<div class="flex items-end justify-between gap-3">
		<div>
			<h1 class="font-headline-lg text-headline-lg text-on-surface">Pelanggan</h1>
			<p class="text-body-sm text-on-surface-variant">Kelola data pelanggan laundry</p>
		</div>
		<button
			type="button"
			onclick={() => (showAdd = !showAdd)}
			class="inline-flex items-center gap-2 h-11 px-4 bg-primary text-on-primary rounded-xl font-bold text-label-md active:scale-95 transition-transform shrink-0"
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
			class="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant space-y-3"
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
			<button type="submit" class="w-full h-11 bg-primary text-on-primary rounded-lg font-bold text-label-md active:scale-[0.98] transition-transform">
				Simpan Customer
			</button>
		</form>
	{/if}

	<!-- Stat cards -->
	<div class="grid grid-cols-3 gap-stack-sm">
		<div class="bg-surface-container-lowest border border-outline-variant rounded-xl p-3 text-center">
			<p class="font-display text-display text-primary font-bold">{stats.total}</p>
			<p class="text-label-sm text-on-surface-variant">Total</p>
		</div>
		<div class="bg-surface-container-lowest border border-outline-variant rounded-xl p-3 text-center">
			<p class="font-display text-display text-warning font-bold">{stats.vip}</p>
			<p class="text-label-sm text-on-surface-variant">VIP</p>
		</div>
		<div class="bg-surface-container-lowest border border-outline-variant rounded-xl p-3 text-center">
			<p class="font-display text-display text-success font-bold">{stats.orders}</p>
			<p class="text-label-sm text-on-surface-variant">Order</p>
		</div>
	</div>

	<!-- Search -->
	<div class="relative w-full">
		<span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
		<form method="GET">
			<input
				name="search"
				value={search}
				class="w-full h-12 pl-10 pr-4 bg-surface-container-low dark:bg-gray-800 border border-outline-variant dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-body-md placeholder-outline-variant transition-all"
				placeholder="Cari nama atau HP..."
				type="text"
			/>
		</form>
	</div>

	<!-- Filter Chips -->
	<div class="flex gap-2 overflow-x-auto no-scrollbar">
		{#each filters as f}
			<button
				onclick={() => (activeFilter = f.id)}
				class="px-5 py-2 rounded-full font-label-md text-label-md whitespace-nowrap active:scale-95 transition-all {activeFilter === f.id
					? 'bg-primary text-on-primary'
					: 'bg-surface-container-high text-on-surface-variant'}"
			>
				{f.label}
			</button>
		{/each}
	</div>

	{#if form?.error}
		<p class="text-body-sm text-error">{form.error}</p>
	{/if}

	<!-- Customer List -->
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-stack-md">
		{#if filtered.length === 0}
			<div class="col-span-full flex flex-col items-center py-16 text-center">
				<div class="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center">
					<span class="material-symbols-outlined text-[32px] text-outline-variant">group</span>
				</div>
				<p class="mt-3 text-body-sm text-on-surface-variant">Tidak ada pelanggan</p>
			</div>
		{:else}
			{#each filtered as customer}
				<div class="group relative bg-surface-container-lowest rounded-2xl border border-outline-variant hover:border-primary hover:shadow-md transition-all p-4">
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
						<div class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container-high {customer.customer_total_orders === 0 ? 'text-outline' : 'text-secondary'}">
							<span class="material-symbols-outlined text-[13px]">receipt_long</span>
							<span class="text-label-sm font-label-md">{customer.customer_total_orders} order</span>
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

<style>
	.no-scrollbar::-webkit-scrollbar { display: none; }
	.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
