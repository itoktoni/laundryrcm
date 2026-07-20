<script>
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { formatCurrency } from '$lib/utils.js';

	let { data } = $props();

	let start = $state(data.filters.start || '');
	let end = $state(data.filters.end || '');

	function go(url) {
		window.location.href = url.toString();
	}

	function filterPeriod(period) {
		const url = new URL(window.location.href);
		url.searchParams.set('period', period);
		if (period !== 'custom') {
			url.searchParams.delete('start');
			url.searchParams.delete('end');
		}
		go(url);
	}

	function applyCustom() {
		if (!start || !end) return;
		const url = new URL(window.location.href);
		url.searchParams.set('period', 'custom');
		url.searchParams.set('start', start);
		url.searchParams.set('end', end);
		go(url);
	}

	function exportCSV() {
		let csv = 'Laporan,Nilai\n';
		csv += `Total Order,${data.orders.count}\n`;
		csv += `Omset,${data.orders.total}\n`;
		csv += `Terkumpul,${data.orders.paid}\n`;
		csv += `Belum Terbayar,${data.orders.total - data.orders.paid}\n`;
		csv += `Pemasukan,${data.finance.income}\n`;
		csv += `Pengeluaran,${data.finance.expense}\n`;
		csv += `Laba Bersih,${data.finance.income - data.finance.expense}\n`;
		csv += `Pelanggan Baru,${data.customers.count}\n`;

		const blob = new Blob([csv], { type: 'text/csv' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `laporan_${data.filters.period}_${new Date().toISOString().split('T')[0]}.csv`;
		a.click();
		URL.revokeObjectURL(url);
	}
</script>

<svelte:head>
	<title>Laporan - LaundryKu</title>
</svelte:head>

<div class="space-y-4">
	<div class="flex items-center justify-between">
		<h1 class="text-2xl font-bold text-gray-900 dark:text-white">Laporan</h1>
		<button onclick={exportCSV} class="inline-flex h-10 items-center gap-1 px-3 rounded-full bg-green-600 hover:bg-green-700 text-sm font-medium text-white transition-colors">
			<span class="material-symbols-outlined text-[18px]">download</span>
			CSV
		</button>
	</div>

	<div class="flex gap-2 overflow-x-auto pb-2">
		{#each ['today', 'week', 'month'] as period}
			<button
				onclick={() => filterPeriod(period)}
				class="whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium {data.filters.period === period ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'}"
			>
				{period === 'today' ? 'Hari Ini' : period === 'week' ? 'Minggu Ini' : 'Bulan Ini'}
			</button>
		{/each}
		<button
			onclick={() => filterPeriod('custom')}
			class="whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium {data.filters.period === 'custom' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'}"
		>
			Custom
		</button>
	</div>

	{#if data.filters.period === 'custom'}
		<div class="flex flex-col gap-2 rounded-xl border border-gray-200 p-3 dark:border-gray-700 sm:flex-row sm:items-end">
			<div class="flex-1">
				<label class="mb-1 block text-xs text-gray-500 dark:text-gray-400">Tanggal Mulai</label>
				<input type="date" bind:value={start} class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white" />
			</div>
			<div class="flex-1">
				<label class="mb-1 block text-xs text-gray-500 dark:text-gray-400">Tanggal Akhir</label>
				<input type="date" bind:value={end} class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white" />
			</div>
			<Button variant="secondary" onclick={applyCustom}>Terapkan</Button>
		</div>
	{/if}

	<Card class="border border-outline-variant">
		<h2 class="mb-3 font-semibold text-gray-900 dark:text-white">Ringkasan Order</h2>
		<div class="space-y-2">
			<div class="flex justify-between text-sm">
				<span class="text-gray-500 dark:text-gray-400">Total Order</span>
				<span class="font-medium text-gray-900 dark:text-white">{data.orders.count}</span>
			</div>
			<div class="flex justify-between text-sm">
				<span class="text-gray-500 dark:text-gray-400">Total Omset</span>
				<span class="font-medium text-gray-900 dark:text-white">{formatCurrency(data.orders.total)}</span>
			</div>
			<div class="flex justify-between text-sm">
				<span class="text-gray-500 dark:text-gray-400">Sudah Terbayar</span>
				<span class="font-medium text-green-600">{formatCurrency(data.orders.paid)}</span>
			</div>
			<div class="flex justify-between border-t border-gray-200 pt-2 text-sm dark:border-gray-700">
				<span class="text-gray-500 dark:text-gray-400">Belum Terbayar</span>
				<span class="font-semibold text-red-600">{formatCurrency(data.orders.total - data.orders.paid)}</span>
			</div>
		</div>
	</Card>

	<Card class="border border-outline-variant">
		<h2 class="mb-3 font-semibold text-gray-900 dark:text-white">Ringkasan Keuangan</h2>
		<div class="space-y-2">
			<div class="flex justify-between text-sm">
				<span class="text-gray-500 dark:text-gray-400">Pemasukan</span>
				<span class="font-medium text-green-600">{formatCurrency(data.finance.income)}</span>
			</div>
			<div class="flex justify-between text-sm">
				<span class="text-gray-500 dark:text-gray-400">Pengeluaran</span>
				<span class="font-medium text-red-600">{formatCurrency(data.finance.expense)}</span>
			</div>
			<div class="flex justify-between border-t border-gray-200 pt-2 dark:border-gray-700">
				<span class="font-semibold text-gray-900 dark:text-white">Laba Bersih</span>
				<span class="font-bold {(data.finance.income - data.finance.expense) >= 0 ? 'text-green-600' : 'text-red-600'}">
					{formatCurrency(data.finance.income - data.finance.expense)}
				</span>
			</div>
		</div>
	</Card>

	<Card class="border border-outline-variant">
		<h2 class="mb-3 font-semibold text-gray-900 dark:text-white">Pelanggan</h2>
		<div class="flex justify-between text-sm">
			<span class="text-gray-500 dark:text-gray-400">Pelanggan Baru</span>
			<span class="font-medium text-gray-900 dark:text-white">{data.customers.count}</span>
		</div>
	</Card>
</div>
