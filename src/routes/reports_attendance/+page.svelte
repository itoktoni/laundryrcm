<script>
	import { formatDateTime } from '$lib/utils.js';

	let { data } = $props();

	let start = $state(data.filters.start || '');
	let end = $state(data.filters.end || '');

	const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

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

	function filterUser(userId) {
		const url = new URL(window.location.href);
		if (userId) {
			url.searchParams.set('user_id', userId);
		} else {
			url.searchParams.delete('user_id');
		}
		go(url);
	}

	function exportCSV() {
		let csv = 'Nama,Tipe,Tanggal,Jarak (m),Status,Lokasi\n';
		for (const r of data.records) {
			csv += `"${r.user_name}","${r.type === 'masuk' ? 'Masuk' : 'Keluar'}","${formatDateTime(r.created_at)}","${r.distance_meters}","${r.status === 'success' ? 'Berhasil' : 'Gagal'}","${r.location_name || ''}"\n`;
		}
		const blob = new Blob([csv], { type: 'text/csv' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `laporan_absensi_${data.filters.period}_${new Date().toISOString().split('T')[0]}.csv`;
		a.click();
		URL.revokeObjectURL(url);
	}
</script>

<svelte:head>
	<title>Laporan Absensi - LaundryKu</title>
</svelte:head>

<div class="space-y-stack-lg">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="font-headline-lg text-headline-lg text-on-surface">Laporan Absensi</h1>
			<p class="text-body-sm text-on-surface-variant">Rekap kehadiran staff</p>
		</div>
		<button
			onclick={exportCSV}
			class="inline-flex h-10 items-center gap-1 px-3 rounded-full bg-primary text-on-primary text-label-md font-medium active:scale-95 transition-transform"
		>
			<span class="material-symbols-outlined text-[18px]">download</span>
			CSV
		</button>
	</div>

	<div class="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 form-card">
		<h3 class="font-label-md text-label-md text-on-surface pb-3 mb-3 border-b border-outline-variant flex items-center gap-2">
			<span class="material-symbols-outlined text-primary text-xl">filter_alt</span>
			Filter Periode
		</h3>
		<div class="flex gap-2 overflow-x-auto pb-2">
			{#each ['today', 'week', 'month'] as period}
				<button
					onclick={() => filterPeriod(period)}
					class="whitespace-nowrap rounded-full px-4 py-1.5 text-label-md font-medium {data.filters.period === period ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface-variant'}"
				>
					{period === 'today' ? 'Hari Ini' : period === 'week' ? 'Minggu Ini' : 'Bulan Ini'}
				</button>
			{/each}
			<button
				onclick={() => filterPeriod('custom')}
				class="whitespace-nowrap rounded-full px-4 py-1.5 text-label-md font-medium {data.filters.period === 'custom' ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface-variant'}"
			>
				Custom
			</button>
		</div>

		{#if data.filters.period === 'custom'}
			<div class="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end">
				<div class="flex-1">
					<label class="mb-1 block text-label-sm text-on-surface-variant">Tanggal Mulai</label>
					<input type="date" bind:value={start} class="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-body-sm text-on-surface" />
				</div>
				<div class="flex-1">
					<label class="mb-1 block text-label-sm text-on-surface-variant">Tanggal Akhir</label>
					<input type="date" bind:value={end} class="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-body-sm text-on-surface" />
				</div>
				<button
					onclick={applyCustom}
					class="h-10 px-6 bg-primary text-on-primary rounded-lg font-bold text-label-md active:scale-95 transition-transform"
				>
					Terapkan
				</button>
			</div>
		{/if}

		<div class="mt-3 pt-3 border-t border-outline-variant">
			<label class="mb-1 block text-label-sm text-on-surface-variant">Filter Staff</label>
			<select
				onchange={(e) => filterUser(e.target.value)}
				class="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-body-sm text-on-surface"
			>
				<option value="">Semua Staff</option>
				{#each data.users as u}
					<option value={u.user_id} selected={data.filters.userId === u.user_id}>{u.user_name}</option>
				{/each}
			</select>
		</div>
	</div>

	<div class="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 form-card">
		<h3 class="font-label-md text-label-md text-on-surface pb-3 mb-3 border-b border-outline-variant flex items-center gap-2">
			<span class="material-symbols-outlined text-primary text-xl">analytics</span>
			Ringkasan
		</h3>
		<div class="grid grid-cols-2 md:grid-cols-5 gap-3">
			<div class="bg-surface-container-low rounded-lg p-3 text-center">
				<p class="text-label-sm text-on-surface-variant">Total</p>
				<p class="font-headline-md text-headline-md text-on-surface">{data.summary?.total || 0}</p>
			</div>
			<div class="bg-surface-container-low rounded-lg p-3 text-center">
				<p class="text-label-sm text-on-surface-variant">Masuk</p>
				<p class="font-headline-md text-headline-md text-primary">{data.summary?.total_masuk || 0}</p>
			</div>
			<div class="bg-surface-container-low rounded-lg p-3 text-center">
				<p class="text-label-sm text-on-surface-variant">Keluar</p>
				<p class="font-headline-md text-headline-md text-tertiary">{data.summary?.total_keluar || 0}</p>
			</div>
			<div class="bg-surface-container-low rounded-lg p-3 text-center">
				<p class="text-label-sm text-on-surface-variant">Berhasil</p>
				<p class="font-headline-md text-headline-md text-success">{data.summary?.total_success || 0}</p>
			</div>
			<div class="bg-surface-container-low rounded-lg p-3 text-center">
				<p class="text-label-sm text-on-surface-variant">Gagal</p>
				<p class="font-headline-md text-headline-md text-error">{data.summary?.total_failed || 0}</p>
			</div>
		</div>
	</div>

	{#if data.byUser.length > 0}
		<div class="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 form-card">
			<h3 class="font-label-md text-label-md text-on-surface pb-3 mb-3 border-b border-outline-variant flex items-center gap-2">
				<span class="material-symbols-outlined text-primary text-xl">group</span>
				Rekap per Staff
			</h3>
			<div class="space-y-2">
				{#each data.byUser as u}
					<div class="flex items-center justify-between bg-surface-container-low rounded-lg p-3">
						<div class="flex items-center gap-3">
							<div class="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold">
								{u.user_name?.charAt(0)?.toUpperCase() || 'U'}
							</div>
							<div>
								<p class="font-body-md text-on-surface font-semibold">{u.user_name}</p>
								<p class="text-label-sm text-on-surface-variant">
									{u.masuk} masuk &middot; {u.keluar} keluar
								</p>
							</div>
						</div>
						<div class="text-right">
							<p class="text-label-sm text-success">{u.success} berhasil</p>
							{#if u.failed > 0}
								<p class="text-label-sm text-error">{u.failed} gagal</p>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/if}

	<div class="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 form-card">
		<h3 class="font-label-md text-label-md text-on-surface pb-3 mb-3 border-b border-outline-variant flex items-center gap-2">
			<span class="material-symbols-outlined text-primary text-xl">list_alt</span>
			Detail Absensi ({data.records.length})
		</h3>

		{#if data.records.length === 0}
			<div class="text-center py-8">
				<span class="material-symbols-outlined text-5xl text-on-surface-variant opacity-40">event_busy</span>
				<p class="text-body-sm text-on-surface-variant mt-2">Tidak ada data absensi</p>
			</div>
		{:else}
			<div class="overflow-x-auto">
				<table class="w-full text-left">
					<thead>
						<tr class="border-b border-outline-variant text-label-sm text-on-surface-variant">
							<th class="py-2 pr-3 font-medium">Staff</th>
							<th class="py-2 pr-3 font-medium">Tipe</th>
							<th class="py-2 pr-3 font-medium">Waktu</th>
							<th class="py-2 pr-3 font-medium">Hari</th>
							<th class="py-2 pr-3 font-medium text-right">Jarak</th>
							<th class="py-2 font-medium">Status</th>
						</tr>
					</thead>
					<tbody>
						{#each data.records as r}
							<tr class="border-b border-outline-variant/50 text-body-sm">
								<td class="py-2.5 pr-3 text-on-surface font-medium">{r.user_name}</td>
								<td class="py-2.5 pr-3">
									<span class="inline-flex items-center gap-1 {r.type === 'masuk' ? 'text-primary' : 'text-tertiary'}">
										<span class="material-symbols-outlined text-[16px]">{r.type === 'masuk' ? 'login' : 'logout'}</span>
										{r.type === 'masuk' ? 'Masuk' : 'Keluar'}
									</span>
								</td>
								<td class="py-2.5 pr-3 text-on-surface-variant whitespace-nowrap">
									{new Date(r.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
								</td>
								<td class="py-2.5 pr-3 text-on-surface-variant whitespace-nowrap">
									{days[new Date(r.created_at).getDay()]}, {new Date(r.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
								</td>
								<td class="py-2.5 pr-3 text-right text-on-surface-variant whitespace-nowrap">
									{r.distance_meters}m
								</td>
								<td class="py-2.5">
									<span class="inline-block px-2 py-0.5 rounded-full text-label-sm font-medium {r.status === 'success' ? 'bg-success-container text-success' : 'bg-error-container text-error'}">
										{r.status === 'success' ? 'Berhasil' : 'Gagal'}
									</span>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</div>
</div>
