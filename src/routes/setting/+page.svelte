<script>
	import { enhance } from '$app/forms';

	let { data, form } = $props();
	let showAdd = $state(false);

	function label(key) {
		return key
			.replace(/_/g, ' ')
			.replace(/\b\w/g, (c) => c.toUpperCase());
	}
</script>

<svelte:head>
	<title>Pengaturan - LaundryKu</title>
</svelte:head>

<div class="space-y-stack-lg">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="font-headline-lg text-headline-lg text-on-surface">Pengaturan</h1>
			<p class="text-body-sm text-on-surface-variant">Konfigurasi data laundry</p>
		</div>
		<button onclick={() => (showAdd = !showAdd)} class="px-4 h-11 bg-surface-container-high text-on-surface rounded-lg font-bold text-label-md active:scale-95 transition-transform">
			{showAdd ? 'Tutup' : '+ Setting'}
		</button>
	</div>

	{#if showAdd}
		<form method="POST" action="?/add" use:enhance={() => ({ update }) => update().then(() => (showAdd = false))} class="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant space-y-3">
			<input name="key" placeholder="Key (mis. nama_bank)" required class="w-full h-11 px-4 bg-surface-container-low border border-outline-variant rounded-lg text-body-sm" />
			<input name="value" placeholder="Value" class="w-full h-11 px-4 bg-surface-container-low border border-outline-variant rounded-lg text-body-sm" />
			<button type="submit" class="w-full h-11 bg-primary text-on-primary rounded-lg font-bold text-label-md">Tambah</button>
		</form>
	{/if}

	{#if form?.error}
		<p class="text-body-sm text-error">{form.error}</p>
	{/if}
	{#if form?.success}
		<p class="text-body-sm text-success">Pengaturan tersimpan</p>
	{/if}

	<form method="POST" action="?/save" use:enhance class="bg-surface-container-lowest p-stack-md rounded-xl border border-outline-variant space-y-4">
		{#if data.settings.length === 0}
			<p class="text-body-sm text-on-surface-variant text-center py-4">Belum ada pengaturan</p>
		{:else}
			{#each data.settings as s}
				<div>
					<div class="flex items-center justify-between mb-1">
						<label for={s.setting_key} class="text-label-md text-on-surface-variant">{label(s.setting_key)}</label>
						<button
							type="submit"
							formaction="?/delete"
							name="key"
							value={s.setting_key}
							onclick={(e) => { if (!confirm(`Hapus setting ${s.setting_key}?`)) e.preventDefault(); }}
							class="text-outline hover:text-error transition-colors"
							aria-label="Hapus setting"
						>
							<span class="material-symbols-outlined text-[16px]">delete</span>
						</button>
					</div>
					<input id={s.setting_key} name={`setting__${s.setting_key}`} value={s.setting_value ?? ''} class="w-full h-11 px-4 bg-surface-container-low border border-outline-variant rounded-lg text-body-sm" />
				</div>
			{/each}

			<button type="submit" class="w-full h-11 bg-primary text-on-primary rounded-lg font-bold text-label-md active:scale-[0.98] transition-transform">
				Simpan Semua
			</button>
		{/if}
	</form>
</div>
