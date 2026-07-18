<script>
	import { formatCurrency, formatDate } from '$lib/utils.js';
	import { enhance } from '$app/forms';

	let { data } = $props();
	let showAddForm = $state(false);
	let newType = $state('expense');
	let newAmount = $state('');
	let newCategory = $state('');
	let newDescription = $state('');

	const categories = {
		income: ['Pembayaran Order', 'Pendapatan Lain'],
		expense: ['Gaji Karyawan', 'Chemical', 'Listrik', 'Air', 'Sewa', 'Perawatan Mesin', 'Lainnya']
	};

	function filterPeriod(period) {
		const url = new URL(window.location.href);
		url.searchParams.set('period', period);
		window.location.href = url.toString();
	}

	function filterType(type) {
		const url = new URL(window.location.href);
		url.searchParams.set('type', type);
		window.location.href = url.toString();
	}
</script>

<svelte:head>
	<title>Keuangan - LaundryKu</title>
</svelte:head>

<div class="space-y-stack-lg">
	<!-- Summary Cards -->
	<div class="grid grid-cols-2 gap-stack-sm">
		<div class="bg-surface-container-highest p-4 rounded-xl border border-outline-variant">
			<div class="flex items-center gap-2 mb-1">
				<span class="material-symbols-outlined text-success text-sm">arrow_downward</span>
				<p class="font-label-md text-label-md text-on-surface-variant">Pemasukan</p>
			</div>
			<p class="font-headline-lg text-headline-lg text-success">{formatCurrency(data.summary.income)}</p>
		</div>
		<div class="bg-surface-container-highest p-4 rounded-xl border border-outline-variant">
			<div class="flex items-center gap-2 mb-1">
				<span class="material-symbols-outlined text-error text-sm">arrow_upward</span>
				<p class="font-label-md text-label-md text-on-surface-variant">Pengeluaran</p>
			</div>
			<p class="font-headline-lg text-headline-lg text-error">{formatCurrency(data.summary.expense)}</p>
		</div>
		<div class="col-span-2 bg-primary-container p-4 rounded-xl text-on-primary-container">
			<p class="font-label-md text-label-md opacity-90">Laba Bersih</p>
			<p class="font-display text-display font-bold">{formatCurrency(data.summary.profit)}</p>
		</div>
	</div>

	<!-- Period Filter -->
	<div class="flex gap-2 overflow-x-auto hide-scrollbar">
		{#each [{id: 'today', label: 'Hari Ini'}, {id: 'week', label: 'Minggu Ini'}, {id: 'month', label: 'Bulan Ini'}] as period}
			<button onclick={() => filterPeriod(period.id)} class="flex-shrink-0 px-4 py-2 {data.filters.period === period.id ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface-variant'} rounded-full font-label-md text-label-md active:scale-95 transition-transform">
				{period.label}
			</button>
		{/each}
	</div>

	<!-- Add Transaction -->
	<button onclick={() => showAddForm = !showAddForm} class="w-full h-12 {showAddForm ? 'bg-surface-container-highest text-on-surface border border-outline-variant' : 'bg-primary text-on-primary'} rounded-xl font-bold text-label-md active:scale-[0.98] transition-transform flex items-center justify-center gap-2">
		<span class="material-symbols-outlined">{showAddForm ? 'close' : 'add'}</span>
		{showAddForm ? 'Tutup' : 'Catat Transaksi'}
	</button>

	{#if showAddForm}
		<form method="POST" action="?/addTransaction" use:enhance class="bg-surface-container-low p-4 rounded-xl border border-outline-variant space-y-3">
			<div class="flex gap-2">
				<button type="button" onclick={() => newType = 'expense'} class="flex-1 py-2 {newType === 'expense' ? 'bg-error-container text-error' : 'bg-surface-container-high text-on-surface-variant'} rounded-lg text-label-md font-bold">Pengeluaran</button>
				<button type="button" onclick={() => newType = 'income'} class="flex-1 py-2 {newType === 'income' ? 'bg-success/10 text-success' : 'bg-surface-container-high text-on-surface-variant'} rounded-lg text-label-md font-bold">Pemasukan</button>
			</div>
			<input type="hidden" name="type" value={newType} />
			<select name="category" bind:value={newCategory} class="w-full h-11 px-4 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-sm">
				{#each categories[newType] as cat}
					<option value={cat}>{cat}</option>
				{/each}
			</select>
			<input type="number" name="amount" bind:value={newAmount} placeholder="Jumlah (Rp)" required class="w-full h-11 px-4 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-sm" />
			<input type="text" name="description" bind:value={newDescription} placeholder="Keterangan (opsional)" class="w-full h-11 px-4 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-sm" />
			<button type="submit" class="w-full h-11 bg-primary text-on-primary rounded-lg font-bold text-label-md">Simpan</button>
		</form>
	{/if}

	<!-- Type Filter -->
	<div class="flex gap-2">
		<button onclick={() => filterType('')} class="px-4 py-2 {data.filters.type === '' ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface-variant'} rounded-full text-label-md font-label-md">Semua</button>
		<button onclick={() => filterType('income')} class="px-4 py-2 {data.filters.type === 'income' ? 'bg-success text-on-primary' : 'bg-surface-container-high text-on-surface-variant'} rounded-full text-label-md font-label-md">Masuk</button>
		<button onclick={() => filterType('expense')} class="px-4 py-2 {data.filters.type === 'expense' ? 'bg-error text-on-primary' : 'bg-surface-container-high text-on-surface-variant'} rounded-full text-label-md font-label-md">Keluar</button>
	</div>

	<!-- Transactions -->
	<div class="space-y-3">
		{#if data.transactions.length === 0}
			<p class="text-body-sm text-on-surface-variant text-center py-8">Belum ada transaksi</p>
		{:else}
			{#each data.transactions as trx}
				<div class="flex items-center justify-between p-4 bg-surface-container-lowest rounded-xl border border-outline-variant">
					<div class="flex items-center gap-3">
						<div class="w-10 h-10 rounded-full {trx.transaction_type === 'income' ? 'bg-success/10' : 'bg-error-container'} flex items-center justify-center">
							<span class="material-symbols-outlined {trx.transaction_type === 'income' ? 'text-success' : 'text-error'}">{trx.transaction_type === 'income' ? 'arrow_downward' : 'arrow_upward'}</span>
						</div>
						<div>
							<p class="font-body-md text-on-surface font-semibold">{trx.transaction_category}</p>
							<p class="text-label-md text-on-surface-variant">{formatDate(trx.transaction_date)} {trx.transaction_description ? `· ${trx.transaction_description}` : ''}</p>
						</div>
					</div>
					<span class="font-headline-md {trx.transaction_type === 'income' ? 'text-success' : 'text-error'}">{trx.transaction_type === 'income' ? '+' : '-'}{formatCurrency(trx.transaction_amount)}</span>
				</div>
			{/each}
		{/if}
	</div>
</div>

<style>
	.hide-scrollbar::-webkit-scrollbar { display: none; }
	.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
