<script>
	import { formatDate } from '$lib/utils.js';
	import { enhance } from '$app/forms';

	let { data } = $props();
	let showAddForm = $state(false);
	let editId = $state(null);
	let editQty = $state(0);
</script>

<svelte:head>
	<title>Inventory - LaundryKu</title>
</svelte:head>

<div class="space-y-stack-lg">
	<div class="flex justify-between items-center">
		<h1 class="font-headline-lg text-headline-lg text-on-surface">Inventory</h1>
		<div class="flex items-center gap-2">
			<a href="/inventory/export" class="inline-flex h-10 items-center gap-1 px-3 rounded-full bg-green-600 hover:bg-green-700 text-sm font-medium text-white transition-colors" download>
				<span class="material-symbols-outlined text-[18px]">download</span>
				CSV
			</a>
			<button onclick={() => showAddForm = !showAddForm} class="w-10 h-10 bg-primary text-on-primary rounded-full flex items-center justify-center active:scale-95 transition-transform">
				<span class="material-symbols-outlined">{showAddForm ? 'close' : 'add'}</span>
			</button>
		</div>
	</div>

	{#if showAddForm}
		<form method="POST" action="?/add" use:enhance class="bg-surface-container-low p-4 rounded-xl border border-outline-variant space-y-3">
			<input type="text" name="name" placeholder="Nama Item" required class="w-full h-11 px-4 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-sm" />
			<div class="grid grid-cols-3 gap-2">
				<input type="number" name="quantity" step="0.1" placeholder="Jumlah" required class="h-11 px-4 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-sm" />
				<select name="unit" class="h-11 px-4 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-sm">
					<option value="liter">Liter</option>
					<option value="kg">Kg</option>
					<option value="pcs">Pcs</option>
				</select>
				<input type="number" name="min_stock" step="0.1" placeholder="Min Stok" required class="h-11 px-4 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-sm" />
			</div>
			<button type="submit" class="w-full h-11 bg-primary text-on-primary rounded-lg font-bold text-label-md">Simpan</button>
		</form>
	{/if}

	<div class="space-y-3">
		{#if data.inventory.length === 0}
			<p class="text-body-sm text-on-surface-variant text-center py-8">Belum ada inventory</p>
		{:else}
			{#each data.inventory as item}
				<div class="bg-surface-container-lowest p-4 rounded-xl border {item.inventory_quantity < item.inventory_min_stock ? 'border-error' : 'border-outline-variant'}">
					<div class="flex justify-between items-start">
						<div>
							<div class="flex items-center gap-2">
								<p class="font-body-md text-on-surface font-semibold">{item.inventory_name}</p>
								{#if item.inventory_quantity < item.inventory_min_stock}
									<span class="px-2 py-0.5 bg-error-container text-error text-[10px] font-bold rounded">Stok Rendah</span>
								{/if}
							</div>
							<p class="text-label-md text-on-surface-variant">Min: {item.inventory_min_stock} {item.inventory_unit} · Restock: {formatDate(item.inventory_last_restocked)}</p>
						</div>
						<div class="text-right">
							<p class="font-headline-lg text-on-surface">{item.inventory_quantity}</p>
							<p class="text-label-md text-on-surface-variant">{item.inventory_unit}</p>
						</div>
					</div>
					{#if editId === item.inventory_id}
						<form method="POST" action="?/updateStock" use:enhance class="mt-3 flex gap-2">
							<input type="hidden" name="id" value={item.inventory_id} />
							<input type="number" name="quantity" step="0.1" bind:value={editQty} class="flex-1 h-10 px-4 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-sm" />
							<button type="submit" class="px-4 h-10 bg-primary text-on-primary rounded-lg text-label-md font-bold">Update</button>
							<button type="button" onclick={() => editId = null} class="px-4 h-10 bg-surface-container-high text-on-surface-variant rounded-lg text-label-md font-bold">Batal</button>
						</form>
					{:else}
						<button onclick={() => { editId = item.inventory_id; editQty = item.inventory_quantity; }} class="mt-3 text-label-md text-primary font-bold">Update Stok</button>
					{/if}
				</div>
			{/each}
		{/if}
	</div>
</div>
