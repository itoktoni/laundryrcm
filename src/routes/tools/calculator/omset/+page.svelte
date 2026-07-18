<script>
	import { formatCurrency } from '$lib/utils.js';

	let targetOmset = $state(15000000);
	let rataHarga = $state(15000);
	let targetKgBulan = $derived(rataHarga > 0 ? Math.ceil(targetOmset / rataHarga) : 0);
	let targetKgHari = $derived(Math.ceil(targetKgBulan / 30));
	let targetOrderHari = $derived(Math.ceil(targetKgHari / 5));
</script>

<svelte:head>
	<title>Kalkulator Target Omset - LaundryKu</title>
</svelte:head>

<div class="space-y-stack-lg">
	<div class="flex items-center gap-2">
		<a href="/tools/calculator" class="text-on-surface-variant" aria-label="Kembali">
			<span class="material-symbols-outlined">arrow_back</span>
		</a>
		<h1 class="font-headline-lg text-headline-lg text-on-surface">Target Omset</h1>
	</div>

	<div class="bg-surface-container-low p-4 rounded-xl border border-outline-variant space-y-4">
		<div>
			<label class="text-label-md text-on-surface-variant">Target Omset / Bulan</label>
			<input type="number" bind:value={targetOmset} class="w-full h-11 px-4 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-sm mt-1" />
		</div>
		<div>
			<label class="text-label-md text-on-surface-variant">Rata-rata Harga / kg</label>
			<input type="number" bind:value={rataHarga} class="w-full h-11 px-4 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-sm mt-1" />
		</div>
	</div>

	<div class="grid grid-cols-3 gap-stack-sm">
		<div class="bg-surface-container-highest p-4 rounded-xl border border-outline-variant text-center">
			<p class="font-headline-lg text-primary">{targetKgBulan}</p>
			<p class="text-label-md text-on-surface-variant">kg/bulan</p>
		</div>
		<div class="bg-surface-container-highest p-4 rounded-xl border border-outline-variant text-center">
			<p class="font-headline-lg text-primary">{targetKgHari}</p>
			<p class="text-label-md text-on-surface-variant">kg/hari</p>
		</div>
		<div class="bg-surface-container-highest p-4 rounded-xl border border-outline-variant text-center">
			<p class="font-headline-lg text-primary">{targetOrderHari}</p>
			<p class="text-label-md text-on-surface-variant">order/hari</p>
		</div>
	</div>
</div>
