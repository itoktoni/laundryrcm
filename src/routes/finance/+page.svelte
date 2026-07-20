<script>
	import { formatCurrency, formatDate } from '$lib/utils.js';
	import { enhance } from '$app/forms';

	let { data } = $props();
	let showAddForm = $state(false);
	let showAdvanced = $state(false);
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

	function applyDateFilter() {
		const url = new URL(window.location.href);
		url.searchParams.delete('period');
		url.searchParams.set('start_date', startDateValue);
		url.searchParams.set('end_date', endDateValue);
		window.location.href = url.toString();
	}

	function clearDateFilter() {
		const url = new URL(window.location.href);
		url.searchParams.delete('start_date');
		url.searchParams.delete('end_date');
		url.searchParams.set('period', 'month');
		window.location.href = url.toString();
	}

	let startDateValue = $state(data.filters.startDate || '');
	let endDateValue = $state(data.filters.endDate || '');
</script>

<svelte:head>
	<title>Keuangan - LaundryKu</title>
</svelte:head>

<div class="space-y-stack-lg">
	<!-- Summary Cards -->
	<div class="grid grid-cols-2 gap-3">
		<div class="bg-white dark:bg-gray-800 p-4 rounded-xl border-2 border-green-200 dark:border-green-800 shadow-sm">
			<div class="flex items-center gap-2 mb-2">
				<div class="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
					<span class="material-symbols-outlined text-success text-lg">arrow_downward</span>
				</div>
				<p class="font-label-md text-label-md text-on-surface-variant">Pemasukan</p>
			</div>
			<p class="font-headline-lg text-headline-lg text-success font-bold">{formatCurrency(data.summary.income)}</p>
		</div>
		<div class="bg-white dark:bg-gray-800 p-4 rounded-xl border-2 border-red-200 dark:border-red-800 shadow-sm">
			<div class="flex items-center gap-2 mb-2">
				<div class="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
					<span class="material-symbols-outlined text-error text-lg">arrow_upward</span>
				</div>
				<p class="font-label-md text-label-md text-on-surface-variant">Pengeluaran</p>
			</div>
			<p class="font-headline-lg text-headline-lg text-error font-bold">{formatCurrency(data.summary.expense)}</p>
		</div>
		<div class="col-span-2 bg-white dark:bg-gray-800 p-4 rounded-xl border-2 border-amber-200 dark:border-amber-800 shadow-sm">
			<div class="flex items-center gap-2 mb-2">
				<div class="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
					<span class="material-symbols-outlined text-amber-600 text-lg">schedule</span>
				</div>
				<p class="font-label-md text-label-md text-on-surface-variant">Piutang (Belum Dibayar)</p>
			</div>
			<p class="font-headline-lg text-headline-lg text-amber-600 dark:text-amber-400 font-bold">{formatCurrency(data.summary.unpaid)}</p>
		</div>
		<div class="col-span-2 bg-white dark:bg-gray-800 p-4 rounded-xl border-2 border-blue-200 dark:border-blue-800 shadow-sm">
			<div class="flex items-center gap-2 mb-2">
				<div class="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
					<span class="material-symbols-outlined text-blue-600 text-lg">trending_up</span>
				</div>
				<p class="font-label-md text-label-md text-on-surface-variant">Laba Bersih</p>
			</div>
			<p class="font-headline-lg text-headline-lg text-blue-600 dark:text-blue-400 font-bold">{formatCurrency(data.summary.profit)}</p>
		</div>
	</div>

	<!-- Period Filter -->
	<div class="space-y-2">
		<div class="flex gap-2 overflow-x-auto hide-scrollbar">
			{#each [{id: 'today', label: 'Hari Ini'}, {id: 'week', label: 'Minggu Ini'}, {id: 'month', label: 'Bulan Ini'}] as period}
				<button onclick={() => filterPeriod(period.id)} class="flex-shrink-0 px-4 py-2 {!data.filters.startDate && data.filters.period === period.id ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface-variant'} rounded-full font-label-md text-label-md active:scale-95 transition-transform">
					{period.label}
				</button>
			{/each}
			<button onclick={() => showAdvanced = !showAdvanced} class="flex-shrink-0 px-4 py-2 {data.filters.startDate || showAdvanced ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface-variant'} rounded-full font-label-md text-label-md active:scale-95 transition-transform flex items-center gap-1">
				<span class="material-symbols-outlined text-[16px]">tune</span>
				Filter
			</button>
		</div>
		{#if showAdvanced || data.filters.startDate}
			<div class="p-3 bg-surface-container-low rounded-xl border border-outline-variant space-y-3">
				<p class="font-label-md text-label-md text-on-surface-variant uppercase">Filter Tanggal</p>
				<div class="grid grid-cols-2 gap-2">
					<div>
						<label class="text-label-sm text-on-surface-variant">Dari Tanggal</label>
						<input type="date" bind:value={startDateValue} class="w-full h-10 px-3 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-sm mt-1" />
					</div>
					<div>
						<label class="text-label-sm text-on-surface-variant">Sampai Tanggal</label>
						<input type="date" bind:value={endDateValue} class="w-full h-10 px-3 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-sm mt-1" />
					</div>
				</div>
				<div class="flex gap-2">
					<button onclick={applyDateFilter} disabled={!startDateValue || !endDateValue} class="flex-1 h-10 bg-primary text-on-primary rounded-lg font-bold text-label-md active:scale-[0.98] transition-transform disabled:opacity-50">Terapkan</button>
					{#if data.filters.startDate}
						<button onclick={clearDateFilter} class="px-4 h-10 bg-surface-container-high text-on-surface rounded-lg font-bold text-label-md active:scale-[0.98] transition-transform">Reset</button>
					{/if}
				</div>
			</div>
		{/if}
	</div>

	<!-- Action Buttons -->
	<div class="flex gap-2">
		<button onclick={() => showAddForm = !showAddForm} class="flex-1 h-12 {showAddForm ? 'bg-surface-container-highest text-on-surface border border-outline-variant' : 'bg-primary text-on-primary'} rounded-xl font-bold text-label-md active:scale-[0.98] transition-transform flex items-center justify-center gap-2">
			<span class="material-symbols-outlined">{showAddForm ? 'close' : 'add'}</span>
			{showAddForm ? 'Tutup' : 'Catat Transaksi'}
		</button>
		<a href="/api/finance/export?period={data.filters.period}&type={data.filters.type}&start_date={data.filters.startDate}&end_date={data.filters.endDate}" class="inline-flex h-12 items-center gap-1 px-4 rounded-xl bg-green-600 hover:bg-green-700 text-sm font-medium text-white transition-colors" download>
			<span class="material-symbols-outlined text-[18px]">download</span>
			CSV
		</a>
	</div>

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
					<div class="flex items-center gap-3 min-w-0 flex-1">
						<div class="w-10 h-10 rounded-full {trx.transaction_type === 'income' ? 'bg-success/10' : 'bg-error-container'} flex items-center justify-center shrink-0">
							<span class="material-symbols-outlined {trx.transaction_type === 'income' ? 'text-success' : 'text-error'}">{trx.transaction_type === 'income' ? 'arrow_downward' : 'arrow_upward'}</span>
						</div>
						<div class="min-w-0">
							<p class="font-body-md text-on-surface font-semibold truncate">{trx.transaction_category}</p>
							<p class="text-label-md text-on-surface-variant truncate">{formatDate(trx.transaction_date)} {trx.transaction_description ? `· ${trx.transaction_description}` : ''}</p>
						</div>
					</div>
					<span class="font-headline-md {trx.transaction_type === 'income' ? 'text-success' : 'text-error'} shrink-0 whitespace-nowrap ml-2">{trx.transaction_type === 'income' ? '+' : '-'}{formatCurrency(trx.transaction_amount)}</span>
				</div>
			{/each}
		{/if}
	</div>
</div>

<style>
	.hide-scrollbar::-webkit-scrollbar { display: none; }
	.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
