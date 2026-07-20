<script>
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import { formatCurrency, formatDate } from '$lib/utils.js';
	import { enhance } from '$app/forms';

	let { data } = $props();
	let showAddForm = $state(false);
	let editId = $state(null);
</script>

<svelte:head>
	<title>Promo - LaundryKu</title>
</svelte:head>

<div class="space-y-4">
	<div class="flex items-center justify-between">
		<h1 class="text-2xl font-bold text-gray-900 dark:text-white">Promo</h1>
		<div class="flex gap-2">
			<a href="/promo/export" class="inline-flex h-9 items-center gap-1 px-3 rounded-lg bg-green-600 hover:bg-green-700 text-sm font-medium text-white transition-colors" download>
				<span class="material-symbols-outlined text-[18px]">download</span>
				CSV
			</a>
			<Button onclick={() => showAddForm = !showAddForm}>
				{showAddForm ? 'Tutup' : 'Promo'}
			</Button>
		</div>
	</div>

	{#if showAddForm}
		<Card class="border-blue-200 dark:border-blue-800">
			<h2 class="mb-3 font-semibold text-gray-900 dark:text-white">Buat Promo Baru</h2>
			<form method="POST" action="?/add" use:enhance class="space-y-3">
				<div>
					<label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Nama Promo</label>
					<input type="text" name="name" required class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white" />
				</div>
				<div class="grid grid-cols-2 gap-2">
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Tipe</label>
						<select name="type" class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white">
							<option value="percent">Persen (%)</option>
							<option value="nominal">Nominal (Rp)</option>
						</select>
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Nilai</label>
						<input type="number" name="value" step="0.01" required class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white" />
					</div>
				</div>
				<div class="grid grid-cols-2 gap-2">
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Min. Order (Rp)</label>
						<input type="number" name="min_order" class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white" />
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Kode Voucher</label>
						<input type="text" name="code" class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white" />
					</div>
				</div>
				<div class="grid grid-cols-2 gap-2">
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Mulai</label>
						<input type="date" name="start_date" required class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white" />
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Berakhir</label>
						<input type="date" name="end_date" required class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white" />
					</div>
				</div>
				<Button type="submit" class="w-full">Simpan</Button>
			</form>
		</Card>
	{/if}

	{#if data.promotions.length === 0}
		<Card>
			<p class="text-center text-sm text-gray-500 dark:text-gray-400">Belum ada promo</p>
		</Card>
	{:else}
		<div class="space-y-3">
			{#each data.promotions as promo}
				<Card class={!promo.promo_is_active ? 'opacity-60' : ''}>
					<div class="flex items-start justify-between">
						<div>
							<div class="flex items-center gap-2">
								<span class="font-medium text-gray-900 dark:text-white">{promo.promo_name}</span>
								<Badge variant={promo.promo_is_active ? 'success' : 'default'}>
									{promo.promo_is_active ? 'Aktif' : 'Nonaktif'}
								</Badge>
							</div>
							<div class="text-xs text-gray-500 dark:text-gray-400">
								{promo.promo_type === 'percent' ? `${promo.promo_value}%` : formatCurrency(promo.promo_value)}
								{#if promo.promo_min_order}
									· Min. {formatCurrency(promo.promo_min_order)}
								{/if}
								{#if promo.promo_code}
									· Kode: {promo.promo_code}
								{/if}
							</div>
							<div class="text-xs text-gray-500 dark:text-gray-400">
								{formatDate(promo.promo_start_date)} - {formatDate(promo.promo_end_date)}
							</div>
						</div>
						<form method="POST" action="?/toggle" use:enhance>
							<input type="hidden" name="id" value={promo.promo_id} />
							<Button type="submit" size="sm" variant="ghost">
								{promo.promo_is_active ? 'Nonaktifkan' : 'Aktifkan'}
							</Button>
						</form>
					</div>

					<div class="mt-2 flex gap-2">
						<Button size="sm" variant="secondary" onclick={() => (editId = editId === promo.promo_id ? null : promo.promo_id)}>
							{editId === promo.promo_id ? 'Batal' : 'Edit'}
						</Button>
						<form method="POST" action="?/delete" use:enhance={({ cancel }) => { if (!confirm(`Hapus promo ${promo.promo_name}?`)) cancel(); }}>
							<input type="hidden" name="id" value={promo.promo_id} />
							<Button type="submit" size="sm" variant="danger">Hapus</Button>
						</form>
					</div>

					{#if editId === promo.promo_id}
						<form method="POST" action="?/edit" use:enhance={() => ({ update }) => update().then(() => (editId = null))} class="mt-3 space-y-2 border-t border-gray-200 dark:border-gray-700 pt-3">
							<input type="hidden" name="id" value={promo.promo_id} />
							<input type="text" name="name" value={promo.promo_name} required placeholder="Nama Promo" class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white" />
							<div class="grid grid-cols-2 gap-2">
								<select name="type" value={promo.promo_type} class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white">
									<option value="percent">Persen (%)</option>
									<option value="nominal">Nominal (Rp)</option>
								</select>
								<input type="number" name="value" step="0.01" value={promo.promo_value} required placeholder="Nilai" class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white" />
							</div>
							<div class="grid grid-cols-2 gap-2">
								<input type="number" name="min_order" value={promo.promo_min_order ?? ''} placeholder="Min. Order" class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white" />
								<input type="text" name="code" value={promo.promo_code ?? ''} placeholder="Kode Voucher" class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white" />
							</div>
							<div class="grid grid-cols-2 gap-2">
								<input type="date" name="start_date" value={promo.promo_start_date} required class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white" />
								<input type="date" name="end_date" value={promo.promo_end_date} required class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white" />
							</div>
							<Button type="submit" class="w-full">Simpan Perubahan</Button>
						</form>
					{/if}
				</Card>
			{/each}
		</div>
	{/if}
</div>
