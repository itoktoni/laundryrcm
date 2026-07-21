<script>
	import { formatCurrency } from '$lib/utils.js';

	let { data } = $props();
	let item = $derived(data.item);
	let movements = $derived(data.movements);
</script>

<svelte:head>
	<title>Kartu Stok - {item.inventory_name} - LaundryKu</title>
</svelte:head>

<div class="space-y-stack-lg">
	<div class="flex items-center gap-3">
		<a href="/inventory" class="w-10 h-10 bg-surface-container-low rounded-full flex items-center justify-center hover:bg-surface-container transition-colors">
			<span class="material-symbols-outlined">arrow_back</span>
		</a>
		<div>
			<h1 class="font-headline-lg text-headline-lg text-on-surface">Kartu Stok</h1>
			<p class="text-body-sm text-on-surface-variant">{item.inventory_name}</p>
		</div>
	</div>

	<!-- Summary Cards -->
	<div class="grid grid-cols-3 gap-3">
		<div class="bg-surface-container-low p-4 rounded-xl border border-outline-variant text-center">
			<p class="text-label-sm text-on-surface-variant mb-1">Stok Tersedia</p>
			<p class="text-headline-sm text-on-surface font-bold">{item.currentQty}</p>
			<p class="text-body-xs text-on-surface-variant">{item.inventory_unit}</p>
		</div>
		<div class="bg-surface-container-low p-4 rounded-xl border border-outline-variant text-center">
			<p class="text-label-sm text-on-surface-variant mb-1">Hrg Rata-rata</p>
			<p class="text-headline-sm text-on-surface font-bold">{formatCurrency(item.currentAvg)}</p>
			<p class="text-body-xs text-on-surface-variant">per {item.inventory_unit}</p>
		</div>
		<div class="bg-surface-container-low p-4 rounded-xl border border-outline-variant text-center">
			<p class="text-label-sm text-on-surface-variant mb-1">Hrg Total</p>
			<p class="text-headline-sm text-primary font-bold">{formatCurrency(item.currentValue)}</p>
			<p class="text-body-xs text-on-surface-variant">{item.currentQty} × {formatCurrency(item.currentAvg)}</p>
		</div>
	</div>

	<!-- Movements Table -->
	<div class="bg-surface-container-low rounded-xl border border-outline-variant overflow-hidden">
		<div class="p-4 border-b border-outline-variant">
			<h2 class="font-title-md text-title-md text-on-surface">Riwayat Pergerakan Stok</h2>
		</div>
		
		{#if movements.length === 0}
			<div class="p-8 text-center">
				<span class="material-symbols-outlined text-4xl text-on-surface-variant">inventory_2</span>
				<p class="text-body-md text-on-surface-variant mt-2">Belum ada riwayat pergerakan stok</p>
			</div>
		{:else}
			<div class="overflow-x-auto">
				<table class="w-full text-sm">
					<thead>
						<tr class="border-b border-outline-variant bg-surface-container">
							<th class="px-4 py-3 text-left text-label-sm text-on-surface-variant font-medium">#</th>
							<th class="px-4 py-3 text-left text-label-sm text-on-surface-variant font-medium">Tanggal</th>
							<th class="px-4 py-3 text-left text-label-sm text-on-surface-variant font-medium">UOM</th>
							<th class="px-4 py-3 text-left text-label-sm text-on-surface-variant font-medium">Tipe</th>
							<th class="px-4 py-3 text-right text-label-sm text-on-surface-variant font-medium">Qty</th>
							<th class="px-4 py-3 text-right text-label-sm text-on-surface-variant font-medium">Nominal</th>
							<th class="px-4 py-3 text-right text-label-sm text-on-surface-variant font-medium">Rata-rata</th>
							<th class="px-4 py-3 text-right text-label-sm text-on-surface-variant font-medium">Saldo</th>
						</tr>
					</thead>
					<tbody>
						{#each movements as m, i}
							<tr class="border-b border-outline-variant last:border-0 hover:bg-surface-container-lowest transition-colors">
								<td class="px-4 py-3 text-body-sm text-on-surface">{movements.length - i}</td>
								<td class="px-4 py-3 text-body-sm text-on-surface">{new Date(m.movement_date).toLocaleDateString('id-ID')}</td>
								<td class="px-4 py-3 text-body-sm text-on-surface-variant">{item.inventory_unit}</td>
								<td class="px-4 py-3">
									<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-label-xs font-medium
										{m.movement_type === 'in' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}">
										<span class="material-symbols-outlined text-[14px]">{m.movement_type === 'in' ? 'add_circle' : 'remove_circle'}</span>
										{m.movement_type === 'in' ? 'Masuk' : 'Keluar'}
									</span>
								</td>
								<td class="px-4 py-3 text-right text-body-sm font-medium {m.movement_type === 'in' ? 'text-green-600' : 'text-red-600'}">
									{m.movement_type === 'in' ? '+' : '-'}{parseFloat(m.movement_qty)}
								</td>
								<td class="px-4 py-3 text-right text-body-sm text-on-surface">{formatCurrency(parseFloat(m.nominal))}</td>
								<td class="px-4 py-3 text-right text-body-sm text-on-surface-variant">{formatCurrency(m.rata_rata)}</td>
								<td class="px-4 py-3 text-right text-body-sm font-medium text-on-surface">{m.running_qty}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</div>
</div>