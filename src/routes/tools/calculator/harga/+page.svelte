<script>
	import { formatCurrency } from '$lib/utils.js';

	let hargaListrik = $state(500000);
	let hargaAir = $state(300000);
	let hargaChemical = $state(200000);
	let hargaSewa = $state(2000000);
	let hargaGaji = $state(4000000);
	let hargaLain = $state(500000);
	let targetKg = $state(500);

	let totalBiaya = $derived(hargaListrik + hargaAir + hargaChemical + hargaSewa + hargaGaji + hargaLain);
	let hargaJual = $derived(targetKg > 0 ? Math.ceil(totalBiaya / targetKg) : 0);
	let hargaJualProfit = $derived(Math.ceil(hargaJual * 1.3));

	const biaya = [
		{ label: 'Listrik', get: () => hargaListrik, set: (v) => (hargaListrik = v) },
		{ label: 'Air', get: () => hargaAir, set: (v) => (hargaAir = v) },
		{ label: 'Chemical', get: () => hargaChemical, set: (v) => (hargaChemical = v) },
		{ label: 'Sewa', get: () => hargaSewa, set: (v) => (hargaSewa = v) },
		{ label: 'Gaji Karyawan', get: () => hargaGaji, set: (v) => (hargaGaji = v) },
		{ label: 'Biaya Lain', get: () => hargaLain, set: (v) => (hargaLain = v) }
	];
</script>

<svelte:head>
	<title>Kalkulator Harga Jual - LaundryKu</title>
</svelte:head>

<div class="space-y-stack-lg">
	<div class="flex items-center gap-2">
		<a href="/tools/calculator" class="text-on-surface-variant" aria-label="Kembali">
			<span class="material-symbols-outlined">arrow_back</span>
		</a>
		<h1 class="font-headline-lg text-headline-lg text-on-surface">Harga Jual per Kg</h1>
	</div>

	<div class="bg-surface-container-low p-4 rounded-xl border border-outline-variant space-y-4">
		<p class="font-label-md text-label-md text-on-surface-variant uppercase">Biaya Operasional / Bulan</p>
		{#each biaya as item}
			<div>
				<label class="text-label-md text-on-surface-variant">{item.label}</label>
				<input type="number" value={item.get()} oninput={(e) => item.set(+e.currentTarget.value)} class="w-full h-11 px-4 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-sm mt-1" />
			</div>
		{/each}
		<div>
			<label class="text-label-md text-on-surface-variant">Target Volume (kg/bulan)</label>
			<input type="number" bind:value={targetKg} class="w-full h-11 px-4 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-sm mt-1" />
		</div>
	</div>

	<div class="bg-primary-container p-4 rounded-xl space-y-3">
		<div class="flex justify-between">
			<span class="text-body-sm text-on-primary-container">Total Biaya</span>
			<span class="font-bold text-on-primary-container">{formatCurrency(totalBiaya)}</span>
		</div>
		<div class="flex justify-between">
			<span class="text-body-sm text-on-primary-container">Harga Jual Minimum/kg</span>
			<span class="font-headline-md text-on-primary-container">{formatCurrency(hargaJual)}</span>
		</div>
		<div class="flex justify-between border-t border-on-primary-container/20 pt-3">
			<span class="text-body-sm text-on-primary-container">Harga Jual + 30% Profit/kg</span>
			<span class="font-display text-display text-on-primary-container">{formatCurrency(hargaJualProfit)}</span>
		</div>
	</div>
</div>
