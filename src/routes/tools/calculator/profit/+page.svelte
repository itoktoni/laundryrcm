<script>
	import { formatCurrency } from '$lib/utils.js';

	let omsetBulan = $state(15000000);
	let totalBiayaProfit = $state(10000000);
	let labaBersih = $derived(omsetBulan - totalBiayaProfit);
	let margin = $derived(omsetBulan > 0 ? ((labaBersih / omsetBulan) * 100).toFixed(1) : 0);
	let bep = $derived(labaBersih > 0 ? Math.ceil(totalBiayaProfit / (labaBersih / omsetBulan)) : 0);
</script>

<svelte:head>
	<title>Kalkulator Profit - LaundryKu</title>
</svelte:head>

<div class="space-y-stack-lg">
	<div class="flex items-center gap-2">
		<a href="/tools/calculator" class="text-on-surface-variant" aria-label="Kembali">
			<span class="material-symbols-outlined">arrow_back</span>
		</a>
		<h1 class="font-headline-lg text-headline-lg text-on-surface">Profit & BEP</h1>
	</div>

	<div class="bg-surface-container-low p-4 rounded-xl border border-outline-variant space-y-4">
		<div>
			<label class="text-label-md text-on-surface-variant">Omset / Bulan</label>
			<input type="number" bind:value={omsetBulan} class="w-full h-11 px-4 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-sm mt-1" />
		</div>
		<div>
			<label class="text-label-md text-on-surface-variant">Total Biaya / Bulan</label>
			<input type="number" bind:value={totalBiayaProfit} class="w-full h-11 px-4 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-sm mt-1" />
		</div>
	</div>

	<div class="grid grid-cols-2 gap-stack-sm">
		<div class="bg-{labaBersih >= 0 ? 'success' : 'error'}/10 p-4 rounded-xl border border-outline-variant text-center">
			<p class="font-headline-lg {labaBersih >= 0 ? 'text-success' : 'text-error'}">{formatCurrency(labaBersih)}</p>
			<p class="text-label-md text-on-surface-variant">Laba Bersih</p>
		</div>
		<div class="bg-surface-container-highest p-4 rounded-xl border border-outline-variant text-center">
			<p class="font-headline-lg text-on-surface">{margin}%</p>
			<p class="text-label-md text-on-surface-variant">Margin</p>
		</div>
		<div class="col-span-2 bg-warning/10 p-4 rounded-xl border border-outline-variant text-center">
			<p class="font-headline-lg text-warning">{formatCurrency(bep)}</p>
			<p class="text-label-md text-on-surface-variant">BEP (Omset Impas)</p>
		</div>
	</div>
</div>
