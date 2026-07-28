<script>
	import { enhance } from '$app/forms';

	let { data, form } = $props();
	let showAddForm = $state(false);
	let editId = $state(null);

	$effect(() => {
		if (form?.success) {
			showAddForm = false;
			editId = null;
		}
	});
</script>

<svelte:head>
	<title>Kategori - LaundryKu</title>
</svelte:head>

<div class="space-y-stack-lg">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<h1 class="font-headline-lg text-headline-lg text-on-surface">Kategori</h1>
		<button onclick={() => { showAddForm = !showAddForm; editId = null; }} class="w-10 h-10 bg-primary text-on-primary rounded-full flex items-center justify-center active:scale-95 transition-transform">
			<span class="material-symbols-outlined">{showAddForm ? 'close' : 'add'}</span>
		</button>
	</div>

	<!-- Stats -->
	<div class="grid grid-cols-2 gap-stack-sm">
		<div class="bg-surface-container-highest p-4 rounded-xl border border-outline-variant">
			<p class="font-display text-display text-primary font-bold">{data.categories.length}</p>
			<p class="text-label-md text-on-surface-variant">Total Kategori</p>
		</div>
		<div class="bg-surface-container-highest p-4 rounded-xl border border-outline-variant">
			<p class="font-display text-display text-secondary font-bold">{data.categories.reduce((sum, c) => sum + (c.product_count || 0), 0)}</p>
			<p class="text-label-md text-on-surface-variant">Total Produk</p>
		</div>
	</div>

	<!-- Add Form -->
	{#if showAddForm}
		<div class="bg-surface-container-low p-4 rounded-xl border border-outline-variant space-y-3">
			<p class="font-label-md text-label-md text-on-surface-variant uppercase">Tambah Kategori Baru</p>
			<form method="POST" action="?/add" use:enhance class="flex gap-2">
				<input type="text" name="name" placeholder="Nama Kategori" required class="flex-1 h-11 px-4 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-sm" />
				<button type="submit" class="h-11 px-5 bg-primary text-on-primary rounded-lg font-bold text-label-md active:scale-95 transition-transform">Simpan</button>
			</form>
		</div>
	{/if}

	{#if form?.error}
		<p class="text-body-sm text-error">{form.error}</p>
	{/if}

	<!-- Categories Table -->
	<div class="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden">
		<!-- Table Header -->
		<div class="grid grid-cols-12 gap-2 px-4 py-3 bg-surface-container-high text-label-md text-on-surface-variant font-bold">
			<div class="col-span-5">Nama Kategori</div>
			<div class="col-span-2 text-center">Produk</div>
			<div class="col-span-2 text-center">Dibuat</div>
			<div class="col-span-3 text-right">Aksi</div>
		</div>

		{#if data.categories.length === 0}
			<div class="flex flex-col items-center py-16 text-center">
				<div class="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center">
					<span class="material-symbols-outlined text-[32px] text-outline-variant">category</span>
				</div>
				<p class="mt-3 text-body-sm text-on-surface-variant">Belum ada kategori</p>
			</div>
		{:else}
			{#each data.categories as cat}
				<!-- Row -->
				<div class="grid grid-cols-12 gap-2 px-4 py-3 items-center border-t border-outline-variant text-body-sm">
					<div class="col-span-5">
						{#if editId === cat.category_id}
							<form method="POST" action="?/edit" use:enhance={() => ({ update }) => update().then(() => (editId = null))} class="flex gap-1">
								<input type="hidden" name="id" value={cat.category_id} />
								<input type="text" name="name" value={cat.category_name} required class="flex-1 h-9 px-3 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-sm" />
								<button type="submit" class="h-9 px-2 bg-success text-white rounded-lg text-label-sm font-bold active:scale-95 transition-transform">
									<span class="material-symbols-outlined text-[16px]">check</span>
								</button>
							</form>
						{:else}
							<span class="font-body-md text-on-surface font-semibold">{cat.category_name}</span>
						{/if}
					</div>
					<div class="col-span-2 text-center">
						<span class="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-bold">{cat.product_count || 0} produk</span>
					</div>
					<div class="col-span-2 text-center text-label-sm text-on-surface-variant">
						{new Date(cat.category_created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
					</div>
					<div class="col-span-3 flex items-center justify-end gap-1">
						{#if editId === cat.category_id}
							<button onclick={() => (editId = null)} class="h-8 px-2 rounded-lg bg-surface-container-high text-on-surface-variant text-label-sm font-bold active:scale-95 transition-transform">
								Batal
							</button>
						{:else}
							<button onclick={() => { editId = cat.category_id; showAddForm = false; }} class="h-8 px-2 rounded-lg bg-surface-container-high text-on-surface-variant text-label-sm font-bold active:scale-95 transition-transform">
								<span class="material-symbols-outlined text-[16px]">edit</span>
							</button>
							<form method="POST" action="?/delete" use:enhance={({ cancel }) => { if (!confirm(`Hapus kategori "${cat.category_name}"?`)) cancel(); }}>
								<input type="hidden" name="id" value={cat.category_id} />
								<button type="submit" class="h-8 px-2 rounded-lg bg-error-container text-error text-label-sm font-bold active:scale-95 transition-transform">
									<span class="material-symbols-outlined text-[16px]">delete</span>
								</button>
							</form>
						{/if}
					</div>
				</div>
			{/each}
		{/if}
	</div>
</div>
