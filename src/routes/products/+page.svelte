<script>
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import { formatCurrency } from '$lib/utils.js';
	import { enhance } from '$app/forms';

	let { data, form } = $props();
	let showAddForm = $state(false);
	let editId = $state(null);
	let activeFilter = $state('all');
	let searchValue = $state(data.filters.search);

	$effect(() => {
		if (form?.success) {
			showAddForm = false;
			editId = null;
		}
	});

	const categoryFilters = [
		{ id: 'all', label: 'Semua' },
		...data.categories.map((c) => ({ id: c.category_id, label: c.category_name }))
	];

	let filtered = $derived(
		data.products.filter((p) => {
			if (activeFilter === 'all') return true;
			return p.category_id === activeFilter;
		})
	);

	let stats = $derived({
		total: data.products.length,
		active: data.products.filter((p) => p.product_is_active).length,
		categories: new Set(data.products.map((p) => p.category_id)).size
	});
</script>

<svelte:head>
	<title>Produk - LaundryKu</title>
</svelte:head>

<div class="space-y-stack-lg">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<h1 class="font-headline-lg text-headline-lg text-on-surface">Produk</h1>
		<button onclick={() => { showAddForm = !showAddForm; editId = null; }} class="w-10 h-10 bg-primary text-on-primary rounded-full flex items-center justify-center active:scale-95 transition-transform">
			<span class="material-symbols-outlined">{showAddForm ? 'close' : 'add'}</span>
		</button>
	</div>

	<!-- Stats -->
	<div class="grid grid-cols-3 gap-stack-sm">
		<div class="bg-surface-container-highest p-4 rounded-xl border border-outline-variant">
			<p class="font-display text-display text-primary font-bold">{stats.total}</p>
			<p class="text-label-md text-on-surface-variant">Total</p>
		</div>
		<div class="bg-surface-container-highest p-4 rounded-xl border border-outline-variant">
			<p class="font-display text-display text-success font-bold">{stats.active}</p>
			<p class="text-label-md text-on-surface-variant">Aktif</p>
		</div>
		<div class="bg-surface-container-highest p-4 rounded-xl border border-outline-variant">
			<p class="font-display text-display text-secondary font-bold">{stats.categories}</p>
			<p class="text-label-md text-on-surface-variant">Kategori</p>
		</div>
	</div>

	<!-- Add Form -->
	{#if showAddForm}
		<div class="bg-surface-container-low p-4 rounded-xl border border-outline-variant space-y-3">
			<p class="font-label-md text-label-md text-on-surface-variant uppercase">Tambah Produk Baru</p>
			<form method="POST" action="?/add" use:enhance class="space-y-3">
				<input type="text" name="name" placeholder="Nama Produk" required class="w-full h-11 px-4 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-sm" />
				<div class="grid grid-cols-2 gap-2">
					<input type="number" name="price" step="0.01" placeholder="Harga (Rp)" required class="h-11 px-4 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-sm" />
					<select name="unit" class="h-11 px-4 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-sm">
						<option value="kg">Kg</option>
						<option value="pcs">Pcs</option>
						<option value="liter">Liter</option>
						<option value="unit">Unit</option>
					</select>
				</div>
				<div class="grid grid-cols-2 gap-2">
					<select name="category_id" class="h-11 px-4 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-sm">
						<option value="">Pilih kategori</option>
						{#each data.categories as cat}
							<option value={cat.category_id}>{cat.category_name}</option>
						{/each}
					</select>
					<select name="is_active" class="h-11 px-4 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-sm">
						<option value="1">Aktif</option>
						<option value="0">Nonaktif</option>
					</select>
				</div>
				<input type="text" name="description" placeholder="Deskripsi (opsional)" class="w-full h-11 px-4 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-sm" />
				<button type="submit" class="w-full h-11 bg-primary text-on-primary rounded-lg font-bold text-label-md">Simpan Produk</button>
			</form>
		</div>
	{/if}

	<!-- Search -->
	<div class="relative w-full">
		<span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant">search</span>
		<form method="GET">
			<input
				name="search"
				value={searchValue}
				class="w-full h-12 pl-10 pr-4 bg-surface-container-low border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-body-md placeholder-outline-variant transition-all"
				placeholder="Cari nama, kategori, atau deskripsi..."
				type="text"
			/>
		</form>
	</div>

	<!-- Category Filter -->
	<div class="flex gap-2 overflow-x-auto hide-scrollbar">
		{#each categoryFilters as f}
			<button
				onclick={() => (activeFilter = f.id)}
				class="flex-shrink-0 px-5 py-2 rounded-full font-label-md text-label-md active:scale-95 transition-all {activeFilter === f.id
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

	<!-- Products -->
	<div class="space-y-3">
		{#if filtered.length === 0}
			<div class="flex flex-col items-center py-16 text-center">
				<div class="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center">
					<span class="material-symbols-outlined text-[32px] text-outline-variant">inventory_2</span>
				</div>
				<p class="mt-3 text-body-sm text-on-surface-variant">Tidak ada produk</p>
			</div>
		{:else}
			{#each filtered as product}
				<div class="bg-surface-container-lowest p-4 rounded-xl border {!product.product_is_active ? 'border-outline-variant opacity-60' : 'border-outline-variant'}">
					<div class="flex items-start justify-between">
						<div class="flex-1 min-w-0">
							<div class="flex items-center gap-2 flex-wrap">
								<span class="font-body-md text-on-surface font-semibold truncate">{product.product_name}</span>
								<span class="px-2 py-0.5 rounded-full text-[10px] font-bold {product.product_is_active ? 'bg-success/10 text-success' : 'bg-surface-container-high text-on-surface-variant'}">
									{product.product_is_active ? 'Aktif' : 'Nonaktif'}
								</span>
							</div>
							<div class="text-body-sm mt-1">
								<span class="font-headline-md text-primary">{formatCurrency(product.product_price)}</span>
								<span class="text-on-surface-variant">/ {product.product_unit}</span>
							</div>
							{#if product.category_name}
								<span class="inline-block mt-1.5 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold">
									{product.category_name}
								</span>
							{/if}
							{#if product.product_description}
								<p class="text-label-sm text-on-surface-variant mt-1 line-clamp-2">{product.product_description}</p>
							{/if}
						</div>
					</div>

					<!-- Actions -->
					<div class="mt-3 flex items-center gap-2 border-t border-outline-variant pt-3">
						<form method="POST" action="?/toggle" use:enhance>
							<input type="hidden" name="id" value={product.product_id} />
							<button type="submit" class="h-9 px-3 rounded-lg text-label-md font-bold {product.product_is_active ? 'bg-error-container text-error' : 'bg-success/10 text-success'} active:scale-95 transition-transform">
								{product.product_is_active ? 'Nonaktifkan' : 'Aktifkan'}
							</button>
						</form>
						<button onclick={() => { editId = editId === product.product_id ? null : product.product_id; showAddForm = false; }} class="h-9 px-3 rounded-lg bg-surface-container-high text-on-surface-variant text-label-md font-bold active:scale-95 transition-transform">
							{editId === product.product_id ? 'Batal' : 'Edit'}
						</button>
						<form method="POST" action="?/delete" use:enhance={({ cancel }) => { if (!confirm(`Hapus produk ${product.product_name}?`)) cancel(); }}>
							<input type="hidden" name="id" value={product.product_id} />
							<button type="submit" class="h-9 px-3 rounded-lg bg-red-600 text-white text-label-md font-bold active:scale-95 transition-transform">Hapus</button>
						</form>
					</div>

					<!-- Edit Form -->
					{#if editId === product.product_id}
						<form method="POST" action="?/edit" use:enhance={() => ({ update }) => update().then(() => (editId = null))} class="mt-3 space-y-2 border-t border-outline-variant pt-3">
							<input type="hidden" name="id" value={product.product_id} />
							<input type="text" name="name" value={product.product_name} required placeholder="Nama Produk" class="w-full h-11 px-4 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-sm" />
							<div class="grid grid-cols-2 gap-2">
								<input type="number" name="price" step="0.01" value={product.product_price} required placeholder="Harga" class="h-11 px-4 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-sm" />
								<select name="unit" value={product.product_unit} class="h-11 px-4 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-sm">
									<option value="kg">Kg</option>
									<option value="pcs">Pcs</option>
									<option value="liter">Liter</option>
									<option value="unit">Unit</option>
								</select>
							</div>
							<div class="grid grid-cols-2 gap-2">
								<select name="category_id" value={product.category_id || ''} class="h-11 px-4 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-sm">
									<option value="">Pilih kategori</option>
									{#each data.categories as cat}
										<option value={cat.category_id}>{cat.category_name}</option>
									{/each}
								</select>
								<select name="is_active" value={String(product.product_is_active)} class="h-11 px-4 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-sm">
									<option value="1">Aktif</option>
									<option value="0">Nonaktif</option>
								</select>
							</div>
							<input type="text" name="description" value={product.product_description ?? ''} placeholder="Deskripsi" class="w-full h-11 px-4 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-sm" />
							<button type="submit" class="w-full h-11 bg-primary text-on-primary rounded-lg font-bold text-label-md">Simpan Perubahan</button>
						</form>
					{/if}
				</div>
			{/each}
		{/if}
	</div>
</div>

<style>
	.hide-scrollbar::-webkit-scrollbar { display: none; }
	.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>