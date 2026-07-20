<script>
	import { formatDate, formatCurrency } from '$lib/utils.js';
	import { enhance } from '$app/forms';

	let { data } = $props();
	let showAddForm = $state(false);
	let editId = $state(null);
	let editQty = $state(0);
	let editDetailId = $state(null);
	let stockInId = $state(null);
	let stockOutId = $state(null);
	let showMovements = $state(false);
	let lowStockItems = $derived(data.inventory.filter((i) => i.inventory_quantity < i.inventory_min_stock));
</script>

<svelte:head>
	<title>Inventory - LaundryKu</title>
</svelte:head>

<div class="space-y-stack-lg">
	<div class="flex justify-between items-center">
		<h1 class="font-headline-lg text-headline-lg text-on-surface">Inventory</h1>
		<div class="flex items-center gap-2">
			<button onclick={() => showMovements = !showMovements} class="h-10 px-3 rounded-full bg-blue-600 hover:bg-blue-700 text-sm font-medium text-white transition-colors">
				{showMovements ? 'Tutup Riwayat' : 'Riwayat'}
			</button>
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
			<div>
				<p class="text-label-sm text-on-surface-variant mb-1">Nama Item</p>
				<input type="text" name="name" placeholder="Nama Item" required class="w-full h-11 px-4 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-sm" />
			</div>
			<div class="grid grid-cols-3 gap-2">
				<div>
					<p class="text-label-sm text-on-surface-variant mb-1">Jumlah</p>
					<input type="number" name="quantity" step="0.1" placeholder="Jumlah" required class="w-full h-11 px-4 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-sm" />
				</div>
				<div>
					<p class="text-label-sm text-on-surface-variant mb-1">Satuan</p>
					<select name="unit" class="w-full h-11 px-4 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-sm">
						<option value="liter">Liter</option>
						<option value="kg">Kg</option>
						<option value="pcs">Pcs</option>
					</select>
				</div>
				<div>
					<p class="text-label-sm text-on-surface-variant mb-1">Min Stok</p>
					<input type="number" name="min_stock" step="0.1" placeholder="Min Stok" required class="w-full h-11 px-4 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-sm" />
				</div>
			</div>
			<button type="submit" class="w-full h-11 bg-primary text-on-primary rounded-lg font-bold text-label-md">Simpan</button>
		</form>
	{/if}

	{#if showMovements}
		<div class="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant">
			<h2 class="font-body-md text-on-surface font-semibold mb-3">Riwayat Pergerakan Stok</h2>
			{#if data.movements.length === 0}
				<p class="text-body-sm text-on-surface-variant text-center py-4">Belum ada pergerakan stok</p>
			{:else}
				<div class="overflow-x-auto">
					<table class="w-full text-sm">
						<thead>
							<tr class="border-b border-outline-variant">
								<th class="text-left py-2 px-2 text-on-surface-variant">Tanggal</th>
								<th class="text-left py-2 px-2 text-on-surface-variant">Item</th>
								<th class="text-left py-2 px-2 text-on-surface-variant">Tipe</th>
								<th class="text-right py-2 px-2 text-on-surface-variant">Qty</th>
								<th class="text-right py-2 px-2 text-on-surface-variant">Nilai</th>
								<th class="text-left py-2 px-2 text-on-surface-variant">Keterangan</th>
							</tr>
						</thead>
						<tbody>
							{#each data.movements as m}
								<tr class="border-b border-outline-variant/50">
									<td class="py-2 px-2 text-on-surface">{formatDate(m.movement_date)}</td>
									<td class="py-2 px-2 text-on-surface">{m.inventory_name}</td>
									<td class="py-2 px-2">
										<span class="px-2 py-0.5 rounded text-xs font-bold {m.movement_type === 'in' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}">
											{m.movement_type === 'in' ? 'Masuk' : 'Keluar'}
										</span>
									</td>
									<td class="py-2 px-2 text-right text-on-surface">{m.movement_qty} {m.inventory_unit}</td>
									<td class="py-2 px-2 text-right text-on-surface">{formatCurrency(m.movement_cost)}</td>
									<td class="py-2 px-2 text-on-surface-variant">{m.movement_description || '-'}</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{/if}
		</div>
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
							{#if item.inventory_avg_cost > 0}
								<p class="text-label-sm text-on-surface-variant">Harga Rata-rata: {formatCurrency(item.inventory_avg_cost)}/{item.inventory_unit}</p>
							{/if}
						</div>
						<div class="text-right">
							<p class="font-headline-lg text-on-surface">{item.inventory_quantity}</p>
							<p class="text-label-md text-on-surface-variant">{item.inventory_unit}</p>
							{#if item.inventory_avg_cost > 0}
								<p class="text-label-sm text-on-surface-variant">{formatCurrency(item.inventory_quantity * item.inventory_avg_cost)}</p>
							{/if}
						</div>
					</div>

					<!-- Actions -->
					<div class="mt-3 flex items-center gap-2 border-t border-outline-variant pt-3 flex-wrap">
						<button onclick={() => { stockInId = stockInId === item.inventory_id ? null : item.inventory_id; stockOutId = null; editId = null; editDetailId = null; }} class="h-9 px-3 rounded-lg bg-green-600 text-white text-label-md font-bold active:scale-95 transition-transform">
							{stockInId === item.inventory_id ? 'Batal' : 'Masuk'}
						</button>
						<button onclick={() => { stockOutId = stockOutId === item.inventory_id ? null : item.inventory_id; stockInId = null; editId = null; editDetailId = null; }} class="h-9 px-3 rounded-lg bg-red-600 text-white text-label-md font-bold active:scale-95 transition-transform">
							{stockOutId === item.inventory_id ? 'Batal' : 'Keluar'}
						</button>
						<button onclick={() => { editId = editId === item.inventory_id ? null : item.inventory_id; editDetailId = null; stockInId = null; stockOutId = null; editQty = item.inventory_quantity; }} class="h-9 px-3 rounded-lg bg-blue-600 text-white text-label-md font-bold active:scale-95 transition-transform">
							{editId === item.inventory_id ? 'Batal' : 'Stok'}
						</button>
						<button onclick={() => { editDetailId = editDetailId === item.inventory_id ? null : item.inventory_id; editId = null; stockInId = null; stockOutId = null; }} class="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center active:scale-95 transition-transform" title="Edit">
							<span class="material-symbols-outlined text-[20px]">edit</span>
						</button>
						<form method="POST" action="?/delete" use:enhance={({ cancel }) => { if (!confirm(`Hapus ${item.inventory_name}?`)) cancel(); }}>
							<input type="hidden" name="id" value={item.inventory_id} />
							<button type="submit" class="w-9 h-9 rounded-lg bg-red-600 text-white flex items-center justify-center active:scale-95 transition-transform" title="Hapus">
								<span class="material-symbols-outlined text-[20px]">delete</span>
							</button>
						</form>
					</div>

					<!-- Stock In Form -->
					{#if stockInId === item.inventory_id}
						<form method="POST" action="?/stockIn" use:enhance class="mt-3 space-y-2 bg-green-50 p-3 rounded-lg border border-green-200">
							<input type="hidden" name="id" value={item.inventory_id} />
							<p class="text-label-md font-bold text-green-700">Stock In</p>
							<div class="grid grid-cols-2 gap-2">
								<div>
									<p class="text-label-sm text-on-surface-variant mb-1">Jumlah (Qty)</p>
									<input type="number" name="qty" step="0.1" min="0.1" required class="w-full h-10 px-4 bg-white border border-outline-variant rounded-lg text-body-sm" />
								</div>
								<div>
									<p class="text-label-sm text-on-surface-variant mb-1">Total Harga (Rp)</p>
									<input type="number" name="cost" step="1" min="0" placeholder="0" class="w-full h-10 px-4 bg-white border border-outline-variant rounded-lg text-body-sm" />
								</div>
							</div>
							<div>
								<p class="text-label-sm text-on-surface-variant mb-1">Keterangan</p>
								<input type="text" name="description" placeholder="Contoh: Beli dari supplier" class="w-full h-10 px-4 bg-white border border-outline-variant rounded-lg text-body-sm" />
							</div>
							<button type="submit" class="w-full h-10 bg-green-600 text-white rounded-lg font-bold text-label-md">Simpan Stock In</button>
						</form>
					{/if}

					<!-- Stock Out Form -->
					{#if stockOutId === item.inventory_id}
						<form method="POST" action="?/stockOut" use:enhance class="mt-3 space-y-2 bg-red-50 p-3 rounded-lg border border-red-200">
							<input type="hidden" name="id" value={item.inventory_id} />
							<p class="text-label-md font-bold text-red-700">Stock Out</p>
							<div>
								<p class="text-label-sm text-on-surface-variant mb-1">Jumlah (Qty)</p>
								<input type="number" name="qty" step="0.1" min="0.1" max={item.inventory_quantity} required class="w-full h-10 px-4 bg-white border border-outline-variant rounded-lg text-body-sm" />
								<p class="text-label-sm text-on-surface-variant mt-1">Stok tersedia: {item.inventory_quantity} {item.inventory_unit}</p>
							</div>
							<div>
								<p class="text-label-sm text-on-surface-variant mb-1">Keterangan</p>
								<input type="text" name="description" placeholder="Contoh: Digunakan untuk produksi" class="w-full h-10 px-4 bg-white border border-outline-variant rounded-lg text-body-sm" />
							</div>
							<button type="submit" class="w-full h-10 bg-red-600 text-white rounded-lg font-bold text-label-md">Simpan Stock Out</button>
						</form>
					{/if}

					<!-- Update Stock Form -->
					{#if editId === item.inventory_id}
						<form method="POST" action="?/updateStock" use:enhance class="mt-3 space-y-2">
							<input type="hidden" name="id" value={item.inventory_id} />
							<div class="grid grid-cols-2 gap-2">
								<div>
									<p class="text-label-sm text-on-surface-variant mb-1">Jumlah Stok</p>
									<input type="number" name="quantity" step="0.1" bind:value={editQty} class="w-full h-10 px-4 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-sm" />
								</div>
								<div>
									<p class="text-label-sm text-on-surface-variant mb-1">Minimum Stok</p>
									<input type="number" name="min_stock" step="0.1" value={item.inventory_min_stock} class="w-full h-10 px-4 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-sm" />
								</div>
							</div>
							<button type="submit" class="w-full h-10 bg-primary text-on-primary rounded-lg font-bold text-label-md">Simpan</button>
						</form>
					{/if}

					<!-- Edit Detail Form -->
					{#if editDetailId === item.inventory_id}
						<form method="POST" action="?/edit" use:enhance class="mt-3 space-y-2 border-t border-outline-variant pt-3">
							<input type="hidden" name="id" value={item.inventory_id} />
							<div>
								<p class="text-label-sm text-on-surface-variant mb-1">Nama Item</p>
								<input type="text" name="name" value={item.inventory_name} required class="w-full h-10 px-4 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-sm" />
							</div>
							<div class="grid grid-cols-2 gap-2">
								<div>
									<p class="text-label-sm text-on-surface-variant mb-1">Satuan</p>
									<select name="unit" value={item.inventory_unit} class="w-full h-10 px-4 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-sm">
										<option value="liter">Liter</option>
										<option value="kg">Kg</option>
										<option value="pcs">Pcs</option>
									</select>
								</div>
								<div>
									<p class="text-label-sm text-on-surface-variant mb-1">Minimum Stok</p>
									<input type="number" name="min_stock" step="0.1" value={item.inventory_min_stock} required class="w-full h-10 px-4 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-sm" />
								</div>
							</div>
							<button type="submit" class="w-full h-10 bg-primary text-on-primary rounded-lg font-bold text-label-md">Simpan Perubahan</button>
						</form>
					{/if}
				</div>
			{/each}
		{/if}
	</div>
</div>