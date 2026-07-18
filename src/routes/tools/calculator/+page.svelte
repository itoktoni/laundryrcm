<script>
	const calculators = [
		{ href: '/tools/calculator/omset', icon: 'trending_up', title: 'Target Omset', description: 'Hitung target kg & order harian', color: 'bg-primary-fixed text-on-primary-fixed' },
		{ href: '/tools/calculator/harga', icon: 'sell', title: 'Harga Jual', description: 'Tentukan harga jual per kg', color: 'bg-warning/10 text-warning' },
		{ href: '/tools/calculator/sdm', icon: 'group', title: 'SDM Ideal', description: 'Hitung jumlah karyawan ideal', color: 'bg-tertiary-fixed text-on-tertiary-fixed' },
		{ href: '/tools/calculator/profit', icon: 'account_balance', title: 'Profit & BEP', description: 'Laba bersih, margin, BEP', color: 'bg-success/10 text-success' }
	];
</script>

<svelte:head>
	<title>Kalkulator - LaundryKu</title>
</svelte:head>

<div class="space-y-stack-lg">
	<div class="flex items-center gap-2">
		<a href="/tools" class="text-on-surface-variant" aria-label="Kembali">
			<span class="material-symbols-outlined">arrow_back</span>
		</a>
		<div>
			<h1 class="font-headline-lg text-headline-lg text-on-surface">Kalkulator</h1>
			<p class="text-body-sm text-on-surface-variant">Pilih kalkulator estimasi</p>
		</div>
	</div>

	<div class="grid grid-cols-2 gap-stack-sm">
		{#each calculators as c}
			<a href={c.href} class="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant active:scale-[0.98] transition-transform hover:bg-surface-container-low">
				<div class="w-10 h-10 rounded-lg {c.color} flex items-center justify-center mb-3">
					<span class="material-symbols-outlined text-[20px]">{c.icon}</span>
				</div>
				<h3 class="font-body-md text-on-surface font-semibold mb-1">{c.title}</h3>
				<p class="text-label-md text-on-surface-variant leading-tight">{c.description}</p>
			</a>
		{/each}
	</div>
</div>
