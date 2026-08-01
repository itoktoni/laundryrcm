<script>
	let { data } = $props();

	const flow = $derived(data.statuses);
</script>

<svelte:head>
	<title>Status Order - LaundryKu</title>
</svelte:head>

<div class="space-y-stack-lg">
	<!-- Header -->
	<div>
		<h1 class="font-headline-lg text-headline-lg text-on-surface">Status Order</h1>
		<p class="text-body-sm text-on-surface-variant">Alur proses status order laundry</p>
	</div>

	<!-- Timeline ringkas (referensi urutan) -->
	<div class="app-card p-4">
		<p class="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant mb-4">Urutan Proses</p>
		<div class="relative flex justify-between px-1">
			<div class="absolute top-4 left-7 right-7 h-1 bg-surface-container-highest rounded-full"></div>
			{#each flow as s}
				<div class="relative flex flex-col items-center gap-1.5 z-10">
					<div class="w-8 h-8 rounded-full flex items-center justify-center bg-surface-container-highest text-on-surface-variant">
						<span class="text-[10px] font-bold">{s.no}</span>
					</div>
					<span class="text-[9px] font-bold text-on-surface-variant">{s.label}</span>
				</div>
			{/each}
		</div>
		<p class="mt-4 text-center text-[10px] font-medium text-outline">Ketuk status untuk mengubah</p>
	</div>

	<!-- Tabel Status -->
	<div class="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden">
		<!-- Header Tabel -->
		<div class="hidden md:grid grid-cols-12 gap-2 px-4 py-3 bg-surface-container-high text-label-md text-on-surface-variant font-bold">
			<div class="col-span-1">No</div>
			<div class="col-span-4">Status</div>
			<div class="col-span-4">Kode</div>
			<div class="col-span-3 text-right">Jumlah Order</div>
		</div>

		{#each flow as s}
			<!-- Baris desktop -->
			<div class="hidden md:grid grid-cols-12 gap-2 px-4 py-3 items-center border-t border-outline-variant text-body-sm">
				<div class="col-span-1">
					<span class="w-7 h-7 inline-flex items-center justify-center rounded-full bg-surface-container-high text-on-surface-variant text-[12px] font-bold">{s.no}</span>
				</div>
				<div class="col-span-4">
					<div class="flex items-center gap-2">
						<span class="w-3 h-3 rounded-full {s.color}"></span>
						<span class="font-semibold text-on-surface">{s.label}</span>
					</div>
				</div>
				<div class="col-span-4">
					<span class="px-2 py-0.5 rounded-md bg-surface-container-high text-on-surface-variant text-[11px] font-mono">{s.value}</span>
				</div>
				<div class="col-span-3 text-right">
					<span class="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-bold">{s.count}</span>
				</div>
			</div>

			<!-- Baris mobile -->
			<div class="md:hidden flex items-center justify-between gap-2 px-4 py-3 border-t border-outline-variant">
				<div class="flex items-center gap-3">
					<span class="w-7 h-7 flex items-center justify-center rounded-full bg-surface-container-high text-on-surface-variant text-[12px] font-bold">{s.no}</span>
					<span class="w-3 h-3 rounded-full {s.color}"></span>
					<span class="font-semibold text-on-surface">{s.label}</span>
				</div>
				<div class="flex items-center gap-2">
					<span class="px-2 py-0.5 rounded-md bg-surface-container-high text-on-surface-variant text-[11px] font-mono">{s.value}</span>
					<span class="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-bold">{s.count}</span>
				</div>
			</div>
		{/each}
	</div>

	<!-- Referensi keterangan warna -->
	<div class="app-card p-4">
		<p class="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant mb-3">Keterangan Warna</p>
		<div class="flex flex-wrap gap-x-4 gap-y-2">
			{#each flow as s}
				<span class="inline-flex items-center gap-1.5 text-[11px] font-medium text-on-surface-variant">
					<span class="w-3 h-3 rounded-full {s.color}"></span>
					{s.label}
				</span>
			{/each}
		</div>
	</div>
</div>
