<script>
	import { enhance, applyAction } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { toast } from '$lib/stores/toast.js';

	let { data, form } = $props();
	let showAdd = $state(false);
	let activeTab = $state('toko');

	function label(key) {
		return key
			.replace(/_/g, ' ')
			.replace(/\b\w/g, (c) => c.toUpperCase());
	}

	function category(key) {
		if (key.startsWith('laundry_') || key.startsWith('store_') || key === 'open_hours' || key.startsWith('pickup_')) return 'toko';
		if (key.startsWith('ai_') || key.startsWith('qris') || key.startsWith('fonnte') || key.startsWith('telegram_') || key.startsWith('wa_') || key === 'provider') return 'integrasi';
		if (key.startsWith('webhook_')) return 'webhook';
		if (key.startsWith('printer_')) return 'printer';
		if (key.startsWith('crm_')) return 'crm';
		return 'lainnya';
	}

	const tabs = [
		{ id: 'toko', label: 'Toko' },
		{ id: 'integrasi', label: 'Integrasi' },
		{ id: 'webhook', label: 'Webhook' },
		{ id: 'printer', label: 'Printer' },
		{ id: 'crm', label: 'CRM' },
		{ id: 'lainnya', label: 'Lainnya' }
	];

	const grouped = $derived(
		data.settings.reduce((acc, s) => {
			const c = category(s.setting_key);
			(acc[c] ||= []).push(s);
			return acc;
		}, {})
	);
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
		<form method="POST" action="?/add" use:enhance={() => async ({ result }) => { await applyAction(result); await invalidateAll(); if (result.type === 'success') { toast('Setting ditambah'); showAdd = false; } }} class="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant space-y-3">
			<input name="key" placeholder="Key (mis. nama_bank)" required class="w-full h-11 px-4 bg-surface-container-low border border-outline-variant rounded-lg text-body-sm" />
			<input name="value" placeholder="Value" class="w-full h-11 px-4 bg-surface-container-low border border-outline-variant rounded-lg text-body-sm" />
			<button type="submit" class="w-full h-11 bg-primary text-on-primary rounded-lg font-bold text-label-md">Tambah</button>
		</form>
	{/if}

	{#if form?.error}
		<p class="text-body-sm text-error">{form.error}</p>
	{/if}

	<div class="flex gap-1 border-b border-outline-variant overflow-x-auto">
		{#each tabs as t}
			{#if grouped[t.id]?.length}
				<button
					onclick={() => (activeTab = t.id)}
					class="px-4 h-11 whitespace-nowrap text-label-md font-bold transition-colors {activeTab === t.id ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant hover:text-on-surface'}"
				>
					{t.label}
				</button>
			{/if}
		{/each}
	</div>

	<form method="POST" action="?/save" use:enhance={() => async ({ result }) => { await applyAction(result); await invalidateAll(); if (result.type === 'success') toast('Pengaturan tersimpan'); }} class="bg-surface-container-lowest p-stack-md rounded-xl border border-outline-variant space-y-4">
		{#if activeTab === 'crm'}
			<div class="bg-surface-container-high p-4 rounded-xl space-y-3">
				<h3 class="font-label-md text-label-md text-on-surface font-bold">Pengaturan CRM</h3>
				<div class="space-y-2 text-body-sm text-on-surface-variant">
					<div>
						<p class="font-medium text-on-surface">Crm Inactive Days</p>
						<p>Jumlah hari sejak pelanggan terakhir order. Pelanggan dianggap tidak aktif setelah X hari.</p>
					</div>
					<div>
						<p class="font-medium text-on-surface">Crm Pending Pickup Days</p>
						<p>Jumlah hari sejak pesanan selesai (paid) sebelum pengingat di kirim.</p>
					</div>
					<div>
						<p class="font-medium text-on-surface">Crm Auto Reminder</p>
						<p>Enable otomatisasi pengingat WhatsApp untuk pelanggan tidak aktif dan pesanan belum diambil.</p>
					</div>
					<div>
						<p class="font-medium text-on-surface">Crm Reminder Template Inactive</p>
						<p>Template pesan WhatsApp untuk pelanggan tidak aktif. Gunakan {customer_name} dan {days} untuk dinamis.</p>
					</div>
					<div>
						<p class="font-medium text-on-surface">Crm Reminder Template Pending</p>
						<p>Template pesan WhatsApp untuk pesanan belum diambil. Gunakan {customer_name}, {order_id}, dan {days} untuk dinamis.</p>
					</div>
				</div>
			</div>
		{/if}

		{#if grouped[activeTab]?.length}
			{#each grouped[activeTab] as s}
				<div>
					<div class="flex items-center justify-between mb-1">
						<label for={s.setting_key} class="text-label-md text-on-surface-variant">{label(s.setting_key)}</label>
						<div class="flex items-center gap-2">
							{#if s.status === 'private'}
								<span class="text-[11px] px-1.5 py-0.5 rounded bg-error-container text-error">private</span>
							{/if}
							{#if s.mandatory !== 1}
								<button
									type="button"
									onclick={async () => {
										if (!confirm(`Hapus setting ${s.setting_key}?`)) return;
										const fd = new FormData();
										fd.set('key', s.setting_key);
										const res = await fetch('?/delete', { method: 'POST', body: fd });
										const result = await res.json();
										if (res.ok && !result.error) { toast('Setting dihapus'); await invalidateAll(); }
										else toast(result.error || 'Gagal hapus', 'error');
									}}
									class="text-outline hover:text-error transition-colors"
									aria-label="Hapus setting"
								>
									<span class="material-symbols-outlined text-[16px]">delete</span>
								</button>
							{:else}
								<span class="text-[11px] text-on-surface-variant">wajib</span>
							{/if}
						</div>
					</div>
					<input id={s.setting_key} name={`setting__${s.setting_key}`} value={s.setting_value ?? ''} class="w-full h-11 px-4 bg-surface-container-low border border-outline-variant rounded-lg text-body-sm" />
					{#if s.setting_key === 'provider'}
						<p class="text-[11px] text-on-surface-variant mt-1">Nilai: <code>telegram</code> (balas ke Telegram), <code>whatsapp</code> / <code>wa</code> (balas ke Fonnte), lainnya = mode testing (laporan ke admin).</p>
					{/if}
					{#if s.setting_key === 'crm_inactive_days'}
						<p class="text-[11px] text-on-surface-variant mt-1">Pelanggan dianggap tidak aktif setelah X hari tanpa order. Default: 7 hari.</p>
					{/if}
					{#if s.setting_key === 'crm_pending_pickup_days'}
						<p class="text-[11px] text-on-surface-variant mt-1">Pengingat di kirim setelah X hari pesanan selesai tapi belum diambil. Default: 3 hari.</p>
					{/if}
					{#if s.setting_key === 'crm_auto_reminder'}
						<p class="text-[11px] text-on-surface-variant mt-1">1 = aktif, 0 = nonaktif. Otomatisasi pengingat via WhatsApp.</p>
					{/if}
					{#if s.setting_key === 'crm_reminder_template_inactive'}
						<textarea id={s.setting_key} name={`setting__${s.setting_key}`} rows="3" class="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg text-body-sm">{s.setting_value ?? ''}</textarea>
						<p class="text-[11px] text-on-surface-variant mt-1">Placeholder: <code>{'{customer_name}'}</code>, <code>{'{days}'}</code></p>
					{/if}
					{#if s.setting_key === 'crm_reminder_template_pending'}
						<textarea id={s.setting_key} name={`setting__${s.setting_key}`} rows="3" class="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg text-body-sm">{s.setting_value ?? ''}</textarea>
						<p class="text-[11px] text-on-surface-variant mt-1">Placeholder: <code>{'{customer_name}'}</code>, <code>{'{order_id}'}</code>, <code>{'{days}'}</code></p>
					{/if}
				</div>
			{/each}

			<button type="submit" class="w-full h-11 bg-primary text-on-primary rounded-lg font-bold text-label-md active:scale-[0.98] transition-transform">
				Simpan {tabs.find((t) => t.id === activeTab)?.label}
			</button>
		{:else}
			<p class="text-body-sm text-on-surface-variant text-center py-4">Belum ada pengaturan</p>
		{/if}
	</form>
</div>
