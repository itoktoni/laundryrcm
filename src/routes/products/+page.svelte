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

<div class="space-y-4">
	<div class="flex items-center justify-between">
		<h1 class="text-2xl font-bold text-gray-900 dark:text-white">Produk</h1>
		<Button onclick={() => (showAddForm = !showAddForm)}>
			{showAddForm ? 'Tutup' : '+ Tambah Produk'}
		</Button>
	</div>

	{#if showAddForm}
		<Card class="border-blue-200 dark:border-blue-800">
			<h2 class="mb-3 font-semibold text-gray-900 dark:text-white">Tambah Produk Baru</h2>
			<form method="POST" action="?/add" use:enhance class="space-y-3">
				<div>
					<label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Nama Produk</label>
					<input type="text" name="name" required class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white" placeholder="Contoh: Cuci Lipat" />
				</div>
				<div class="grid grid-cols-2 gap-2">
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Harga (Rp)</label>
						<input type="number" name="price" step="0.01" required class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white" placeholder="7000" />
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Satuan</label>
						<select name="unit" class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white">
							<option value="kg">Kg</option>
							<option value="pcs">Pcs</option>
							<option value="liter">Liter</option>
							<option value="unit">Unit</option>
						</select>
					</div>
				</div>
				<div class="grid grid-cols-2 gap-2">
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Kategori</label>
						<select name="category_id" class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white">
							<option value="">Pilih kategori</option>
							{#each data.categories as cat}
								<option value={cat.category_id}>{cat.category_name}</option>
							{/each}
						</select>
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
						<select name="is_active" class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white">
							<option value="1">Aktif</option>
							<option value="0">Nonaktif</option>
						</select>
					</div>
				</div>
				<div>
					<label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Deskripsi</label>
					<input type="text" name="description" class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white" placeholder="Opsional" />
				</div>
				<Button type="submit" class="w-full">Simpan Produk</Button>
			</form>
		</Card>
	{/if}

	<div class="grid grid-cols-3 gap-3">
		<Card>
			<p class="font-display text-display text-primary font-bold">{stats.total}</p>
			<p class="text-label-sm text-gray-500 dark:text-gray-400">Total Produk</p>
		</Card>
		<Card>
			<p class="font-display text-display text-success font-bold">{stats.active}</p>
			<p class="text-label-sm text-gray-500 dark:text-gray-400">Aktif</p>
		</Card>
		<Card>
			<p class="font-display text-display text-secondary font-bold">{stats.categories}</p>
			<p class="text-label-sm text-gray-500 dark:text-gray-400">Kategori</p>
		</Card>
	</div>

	<div class="relative w-full">
		<span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant dark:text-gray-500">search</span>
		<form method="GET">
			<input
				name="search"
				value={data.filters.search}
				class="w-full h-12 pl-10 pr-4 bg-surface-container-low dark:bg-gray-800 border border-outline-variant dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-body-md placeholder-outline-variant dark:text-white dark:placeholder-gray-500 transition-all"
				placeholder="Cari nama, kategori, atau deskripsi..."
				type="text"
			/>
		</form>
	</div>

	<div class="flex gap-2 overflow-x-auto no-scrollbar">
		{#each categoryFilters as f}
			<button
				onclick={() => (activeFilter = f.id)}
				class="px-5 py-2 rounded-full font-label-md text-label-md whitespace-nowrap active:scale-95 transition-all {activeFilter === f.id
					? 'bg-primary text-on-primary'
					: 'bg-surface-container-high text-on-surface-variant dark:bg-gray-800 dark:text-gray-300'}"
			>
				{f.label}
			</button>
		{/each}
	</div>

	{#if form?.error}
		<p class="text-body-sm text-error">{form.error}</p>
	{/if}

	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
		{#if filtered.length === 0}
			<div class="col-span-full flex flex-col items-center py-16 text-center">
				<div class="w-16 h-16 rounded-full bg-surface-container-high dark:bg-gray-800 flex items-center justify-center">
					<span class="material-symbols-outlined text-[32px] text-outline-variant dark:text-gray-600">inventory_2</span>
				</div>
				<p class="mt-3 text-body-sm text-on-surface-variant dark:text-gray-400">Tidak ada produk</p>
			</div>
		{:else}
			{#each filtered as product}
				<Card class={!product.product_is_active ? 'opacity-60 dark:border-gray-700' : 'dark:border-gray-700'}>
					<div class="flex items-start justify-between">
						<div class="flex-1 min-w-0">
							<div class="flex items-center gap-2 flex-wrap">
								<span class="font-medium text-gray-900 dark:text-white truncate">{product.product_name}</span>
								<Badge variant={product.product_is_active ? 'success' : 'default'}>
									{product.product_is_active ? 'Aktif' : 'Nonaktif'}
								</Badge>
							</div>
							<div class="text-sm text-gray-500 dark:text-gray-400 mt-1">
								<span class="font-semibold text-primary dark:text-primary-fixed">{formatCurrency(product.product_price)}</span>
								<span class="text-gray-400 dark:text-gray-500">/ {product.product_unit}</span>
							</div>
							{#if product.category_name}
								<span class="inline-block mt-1.5 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold">
									{product.category_name}
								</span>
							{/if}
							{#if product.product_description}
								<p class="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{product.product_description}</p>
							{/if}
						</div>
					</div>

					<div class="mt-3 flex items-center gap-2 border-t border-gray-200 dark:border-gray-700 pt-3">
						<form method="POST" action="?/toggle" use:enhance>
							<input type="hidden" name="id" value={product.product_id} />
							<Button type="submit" size="sm" variant="ghost">
								{product.product_is_active ? 'Nonaktifkan' : 'Aktifkan'}
							</Button>
						</form>
						<Button size="sm" variant="secondary" onclick={() => (editId = editId === product.product_id ? null : product.product_id)}>
							{editId === product.product_id ? 'Batal' : 'Edit'}
						</Button>
						<form method="POST" action="?/delete" use:enhance={({ cancel }) => { if (!confirm(`Hapus produk ${product.product_name}?`)) cancel(); }}>
							<input type="hidden" name="id" value={product.product_id} />
							<Button type="submit" size="sm" variant="danger">Hapus</Button>
						</form>
					</div>

					{#if editId === product.product_id}
						<form method="POST" action="?/edit" use:enhance={() => ({ update }) => update().then(() => (editId = null))} class="mt-3 space-y-2 border-t border-gray-200 dark:border-gray-700 pt-3">
							<input type="hidden" name="id" value={product.product_id} />
							<input type="text" name="name" value={product.product_name} required placeholder="Nama Produk" class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white" />
							<div class="grid grid-cols-2 gap-2">
								<input type="number" name="price" step="0.01" value={product.product_price} required placeholder="Harga" class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white" />
								<select name="unit" value={product.product_unit} class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white">
									<option value="kg">Kg</option>
									<option value="pcs">Pcs</option>
									<option value="liter">Liter</option>
									<option value="unit">Unit</option>
								</select>
							</div>
							<div class="grid grid-cols-2 gap-2">
								<select name="category_id" value={product.category_id || ''} class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white">
									<option value="">Pilih kategori</option>
									{#each data.categories as cat}
										<option value={cat.category_id}>{cat.category_name}</option>
									{/each}
								</select>
								<select name="is_active" value={String(product.product_is_active)} class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white">
									<option value="1">Aktif</option>
									<option value="0">Nonaktif</option>
								</select>
							</div>
							<input type="text" name="description" value={product.product_description ?? ''} placeholder="Deskripsi" class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white" />
							<Button type="submit" class="w-full">Simpan Perubahan</Button>
						</form>
					{/if}
				</Card>
			{/each}
		{/if}
	</div>
</div>

<style>
	.no-scrollbar::-webkit-scrollbar { display: none; }
	.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>
