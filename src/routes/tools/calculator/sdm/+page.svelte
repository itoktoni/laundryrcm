<script>
	let volumeHari = $state(100);
	let kapasitasKaryawan = $state(30);
	let jumlahKaryawan = $derived(kapasitasKaryawan > 0 ? Math.ceil(volumeHari / kapasitasKaryawan) : 0);
</script>

<svelte:head>
	<title>Kalkulator SDM - LaundryKu</title>
</svelte:head>

<div class="space-y-stack-lg">
	<div class="flex items-center gap-2">
		<a href="/tools/calculator" class="text-on-surface-variant" aria-label="Kembali">
			<span class="material-symbols-outlined">arrow_back</span>
		</a>
		<h1 class="font-headline-lg text-headline-lg text-on-surface">SDM Ideal</h1>
	</div>

	<div class="bg-surface-container-low p-4 rounded-xl border border-outline-variant space-y-4">
		<div>
			<label class="text-label-md text-on-surface-variant">Volume Cucian / Hari (kg)</label>
			<input type="number" bind:value={volumeHari} class="w-full h-11 px-4 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-sm mt-1" />
		</div>
		<div>
			<label class="text-label-md text-on-surface-variant">Kapasitas per Karyawan (kg/hari)</label>
			<input type="number" bind:value={kapasitasKaryawan} class="w-full h-11 px-4 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-sm mt-1" />
		</div>
	</div>

	<div class="bg-primary-container p-8 rounded-xl text-center">
		<p class="font-display text-display text-on-primary-container font-bold">{jumlahKaryawan}</p>
		<p class="text-body-md text-on-primary-container">Karyawan Ideal</p>
	</div>
</div>
