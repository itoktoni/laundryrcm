<script>
	const tools = [
		{ href: '/tools/calculator/omset', icon: 'trending_up', title: 'Kalkulator Omset', description: 'Hitung target omset, harga jual, dan profit', color: 'bg-primary-fixed text-on-primary-fixed' },
		{ href: '/tools/calculator/harga', icon: 'sell', title: 'Kalkulator Harga', description: 'Tentukan harga jual per kg', color: 'bg-warning/10 text-warning' },
		{ href: '/tools/calculator/sdm', icon: 'group', title: 'Kalkulator SDM', description: 'Hitung jumlah karyawan ideal', color: 'bg-tertiary-fixed text-on-tertiary-fixed' },
		{ href: '/tools/calculator/profit', icon: 'account_balance', title: 'Kalkulator Profit', description: 'Laba bersih, BEP, margin', color: 'bg-success/10 text-success' }
	];
</script>

<svelte:head>
	<title>Tools - LaundryKu</title>
</svelte:head>

<div class="space-y-stack-lg">
	<div>
		<h1 class="font-headline-lg text-headline-lg text-on-surface">Tools</h1>
		<p class="text-body-sm text-on-surface-variant">Kalkulator & estimasi bisnis laundry</p>
	</div>

	<div class="grid grid-cols-2 gap-stack-sm">
		{#each tools as tool}
			<a href={tool.href} class="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant active:scale-[0.98] transition-transform hover:bg-surface-container-low">
				<div class="w-10 h-10 rounded-lg {tool.color} flex items-center justify-center mb-3">
					<span class="material-symbols-outlined text-[20px]">{tool.icon}</span>
				</div>
				<h3 class="font-body-md text-on-surface font-semibold mb-1">{tool.title}</h3>
				<p class="text-label-md text-on-surface-variant leading-tight">{tool.description}</p>
			</a>
		{/each}
	</div>
</div>
