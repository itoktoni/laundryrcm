<script>
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import { formatDate } from '$lib/utils.js';
	import { enhance } from '$app/forms';

	let { data } = $props();
	let showAddForm = $state(false);
	let serviceForm = $state({ id: null, description: '', cost: '', notes: '', nextService: '' });
	let historyVisible = $state({});

	const statusColors = {
		active: 'success',
		broken: 'danger',
		maintenance: 'warning'
	};

	const statusLabels = {
		active: 'Aktif',
		broken: 'Rusak',
		maintenance: 'Maintenance'
	};

	const types = ['Mesin Cuci', 'Pengering', 'Setrika Uap', 'Setrika Biasa', 'Lainnya'];
</script>

<svelte:head>
	<title>Mesin & Aset - LaundryKu</title>
</svelte:head>

<div class="space-y-4">
	<div class="flex items-center justify-between">
		<h1 class="text-2xl font-bold text-gray-900 dark:text-white">Mesin</h1>
		<div class="flex gap-2">
			<a href="/machines/export" class="inline-flex h-9 items-center gap-1 px-3 rounded-lg bg-green-600 hover:bg-green-700 text-sm font-medium text-white transition-colors" download>
				<span class="material-symbols-outlined text-[18px]">download</span>
				CSV
			</a>
			<Button onclick={() => showAddForm = !showAddForm}>
				{showAddForm ? 'Tutup' : '+ Tambah'}
			</Button>
		</div>
	</div>

	{#if showAddForm}
		<Card class="border-blue-200 dark:border-blue-800">
			<h2 class="mb-3 font-semibold text-gray-900 dark:text-white">Tambah Mesin</h2>
			<form method="POST" action="?/add" use:enhance class="space-y-3">
				<div>
					<label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Nama Mesin</label>
					<input type="text" name="name" required class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white" />
				</div>
				<div>
					<label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Tipe</label>
					<select name="type" class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white">
						{#each types as t}
							<option value={t}>{t}</option>
						{/each}
					</select>
				</div>
				<div>
					<label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Jadwal Servis Berikutnya</label>
					<input type="date" name="next_service" class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white" />
				</div>
				<Button type="submit" class="w-full">Simpan</Button>
			</form>
		</Card>
	{/if}

	{#if data.machines.length === 0}
		<Card>
			<p class="text-center text-sm text-gray-500 dark:text-gray-400">Belum ada mesin terdaftar</p>
		</Card>
	{:else}
		<div class="space-y-3">
			{#each data.machines as machine}
				<Card>
					<div class="flex items-start justify-between">
						<div>
							<div class="flex items-center gap-2">
								<span class="font-medium text-gray-900 dark:text-white">{machine.machine_name}</span>
								<Badge variant={statusColors[machine.machine_status]}>{statusLabels[machine.machine_status]}</Badge>
							</div>
							<div class="text-xs text-gray-500 dark:text-gray-400">{machine.machine_type}</div>
							<div class="mt-1 text-xs text-gray-500 dark:text-gray-400">
								Servis terakhir: {formatDate(machine.machine_last_service) || 'Belum ada'}
							</div>
							{#if machine.machine_next_service}
								<div class="text-xs text-gray-500 dark:text-gray-400">
									Servis berikutnya: {formatDate(machine.machine_next_service)}
								</div>
							{/if}
						</div>
					</div>

					<div class="mt-3 flex gap-2">
						{#if machine.machine_status !== 'active'}
							<form method="POST" action="?/updateStatus" use:enhance>
								<input type="hidden" name="id" value={machine.machine_id} />
								<input type="hidden" name="status" value="active" />
								<Button type="submit" size="sm" variant="success">Aktifkan</Button>
							</form>
						{/if}
						{#if machine.machine_status !== 'broken'}
							<form method="POST" action="?/updateStatus" use:enhance>
								<input type="hidden" name="id" value={machine.machine_id} />
								<input type="hidden" name="status" value="broken" />
								<Button type="submit" size="sm" variant="danger">Rusak</Button>
							</form>
						{/if}
						{#if machine.machine_status !== 'maintenance'}
							<form method="POST" action="?/updateStatus" use:enhance>
								<input type="hidden" name="id" value={machine.machine_id} />
								<input type="hidden" name="status" value="maintenance" />
								<Button type="submit" size="sm" variant="secondary">Perbaikan</Button>
							</form>
						{/if}
						<Button type="button" size="sm" variant="warning" onclick={() => serviceForm = { id: machine.machine_id, description: '', cost: '', notes: '', nextService: machine.machine_next_service || '' } }>Service</Button>
						<Button type="button" size="sm" variant="secondary" onclick={() => historyVisible[machine.machine_id] = !historyVisible[machine.machine_id] }>Log</Button>
					</div>

					{#if historyVisible[machine.machine_id]}
						<div class="mt-3 border-t border-outline-variant pt-3">
							<h3 class="text-label-md font-semibold text-on-surface-variant mb-2">Riwayat Servis</h3>
							{#if data.services.filter(s => s.machine_id === machine.machine_id).length === 0}
								<p class="text-xs text-gray-500 dark:text-gray-400">Belum ada riwayat servis</p>
							{:else}
								<div class="space-y-2">
									{#each data.services.filter(s => s.machine_id === machine.machine_id) as service}
										<div class="p-3 bg-surface-container-lowest rounded-lg border border-outline-variant">
											<div class="flex items-start justify-between">
												<div class="flex-1">
													<p class="text-body-sm font-medium text-on-surface">{service.service_description}</p>
													<div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
														{new Date(service.service_date).toLocaleString('id-ID')}
													</div>
													{#if service.service_cost > 0}
														<div class="text-xs text-gray-500 dark:text-gray-400">
															Biaya: Rp {service.service_cost.toLocaleString('id-ID')}
														</div>
													{/if}
													{#if service.service_notes}
														<div class="text-xs text-gray-500 dark:text-gray-400">
															Catatan: {service.service_notes}
														</div>
													{/if}
												</div>
											</div>
										</div>
									{/each}
								</div>
							{/if}
						</div>
					{/if}

					{#if serviceForm.id === machine.machine_id}
						<form method="POST" action="?/recordService" use:enhance class="mt-3 space-y-2 border-t border-outline-variant pt-3">
							<input type="hidden" name="id" value={machine.machine_id} />
							<div>
								<p class="text-label-sm text-on-surface-variant mb-1">Keterangan Kerusakan / Pekerjaan</p>
								<textarea name="description" required rows="2" bind:value={serviceForm.description} class="w-full px-3 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-sm"></textarea>
							</div>
							<div class="grid grid-cols-2 gap-2">
								<div>
									<p class="text-label-sm text-on-surface-variant mb-1">Biaya (Rp)</p>
									<input type="number" name="cost" step="0.01" bind:value={serviceForm.cost} class="w-full h-10 px-3 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-sm" />
								</div>
								<div>
									<p class="text-label-sm text-on-surface-variant mb-1">Servis Berikutnya</p>
									<input type="date" name="next_service" bind:value={serviceForm.nextService} class="w-full h-10 px-3 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-sm" />
								</div>
							</div>
							<div>
								<p class="text-label-sm text-on-surface-variant mb-1">Catatan Tambahan</p>
								<input type="text" name="notes" bind:value={serviceForm.notes} class="w-full h-10 px-3 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-sm" />
							</div>
							<div class="flex gap-2">
								<button type="submit" class="flex-1 h-10 bg-warning text-on-warning rounded-lg font-bold text-label-md">Simpan</button>
								<button type="button" onclick={() => serviceForm = { id: null, description: '', cost: '', notes: '', nextService: '' }} class="px-4 h-10 bg-surface-container-high text-on-surface-variant rounded-lg text-label-md font-bold">Batal</button>
							</div>
						</form>
					{/if}
				</Card>
			{/each}
		</div>
	{/if}
</div>