<script>
	import { enhance } from '$app/forms';

	let { data, form } = $props();
	let showAdd = $state(false);
	let editId = $state(null);

	function downloadTxt(t) {
		const text = `${t.template_name}\n${'='.repeat(t.template_name.length)}\n\n${t.template_description || ''}\n\nDicetak: ${new Date().toLocaleDateString('id-ID')}\nLaundryKu - Sistem Manajemen Laundry`;
		const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `${t.template_name.replace(/\s+/g, '_')}.txt`;
		a.click();
		URL.revokeObjectURL(url);
	}

	async function downloadPdf(t) {
		const { jsPDF } = await import('jspdf');
		const doc = new jsPDF();
		const margin = 15;
		let y = margin;
		doc.setFontSize(16);
		doc.text(t.template_name, margin, y);
		y += 8;
		doc.setDrawColor(200);
		doc.line(margin, y, 210 - margin, y);
		y += 10;
		doc.setFontSize(12);
		const lines = (t.template_description || '').split('\n');
		for (const line of lines) {
			const wrapped = doc.splitTextToSize(line || ' ', 180);
			doc.text(wrapped, margin, y);
			y += wrapped.length * 7;
		}
		y += 10;
		doc.setFontSize(9);
		doc.setTextColor(150);
		doc.text(`Dicetak: ${new Date().toLocaleDateString('id-ID')} - LaundryKu`, margin, y);
		doc.save(`${t.template_name.replace(/\s+/g, '_')}.pdf`);
	}
</script>

<svelte:head>
	<title>Template SOP - LaundryKu</title>
</svelte:head>

<div class="space-y-stack-lg">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="font-headline-lg text-headline-lg text-on-surface">Template SOP</h1>
			<p class="text-body-sm text-on-surface-variant">Kelola & download SOP operasional</p>
		</div>
		<button onclick={() => (showAdd = !showAdd)} class="px-4 h-11 bg-primary text-on-primary rounded-lg font-bold text-label-md active:scale-95 transition-transform">
			{showAdd ? 'Tutup' : '+ Template'}
		</button>
	</div>

	{#if showAdd}
		<form method="POST" action="?/add" use:enhance class="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant space-y-3">
			<input name="name" placeholder="Nama template (mis. SOP Cuci)" required class="w-full h-11 px-4 bg-surface-container-low border border-outline-variant rounded-lg text-body-sm" />
			<textarea name="description" rows="8" placeholder="1. Langkah satu&#10;2. Langkah dua&#10;3. ..." class="w-full p-4 bg-surface-container-low border border-outline-variant rounded-lg text-body-sm font-mono"></textarea>
			<button type="submit" class="w-full h-11 bg-primary text-on-primary rounded-lg font-bold text-label-md">Simpan</button>
		</form>
	{/if}

	{#if form?.error}
		<p class="text-body-sm text-error">{form.error}</p>
	{/if}

	{#if data.templates.length === 0}
		<p class="text-body-sm text-on-surface-variant text-center py-8">Belum ada template</p>
	{:else}
		<div class="grid grid-cols-1 md:grid-cols-2 gap-stack-md">
			{#each data.templates as t}
				<div class="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant">
					{#if editId === t.template_id}
						<form method="POST" action="?/edit" use:enhance={() => ({ update }) => update().then(() => (editId = null))} class="space-y-3">
							<input type="hidden" name="id" value={t.template_id} />
							<input name="name" value={t.template_name} required class="w-full h-11 px-3 bg-surface-container-low border border-outline-variant rounded-lg text-body-sm" />
							<textarea name="description" rows="8" class="w-full p-3 bg-surface-container-low border border-outline-variant rounded-lg text-body-sm font-mono">{t.template_description}</textarea>
							<div class="flex gap-2">
								<button type="submit" class="flex-1 h-10 bg-primary text-on-primary rounded-lg font-bold text-label-md">Simpan</button>
								<button type="button" onclick={() => (editId = null)} class="px-4 h-10 bg-surface-container-high text-on-surface-variant rounded-lg text-label-md">Batal</button>
							</div>
						</form>
					{:else}
						<div class="flex items-start justify-between gap-2">
							<h2 class="font-headline-md text-headline-md text-on-surface">{t.template_name}</h2>
							<div class="flex gap-1 shrink-0">
								<button onclick={() => (editId = t.template_id)} class="p-1.5 rounded-lg text-outline hover:bg-surface-container-high transition-colors" aria-label="Edit">
									<span class="material-symbols-outlined text-[18px]">edit</span>
								</button>
								<form method="POST" action="?/delete" use:enhance={({ cancel }) => { if (!confirm(`Hapus template ${t.template_name}?`)) cancel(); }}>
									<input type="hidden" name="id" value={t.template_id} />
									<button type="submit" class="p-1.5 rounded-lg text-outline hover:bg-error-container hover:text-error transition-colors" aria-label="Hapus">
										<span class="material-symbols-outlined text-[18px]">delete</span>
									</button>
								</form>
							</div>
						</div>
						<pre class="mt-2 whitespace-pre-wrap text-body-sm text-on-surface-variant bg-surface-container-low rounded-lg p-3 max-h-48 overflow-auto">{t.template_description}</pre>
						<div class="mt-3 flex gap-2">
							<button onclick={() => downloadTxt(t)} class="flex-1 h-10 bg-surface-container-high text-on-surface rounded-lg text-label-md font-bold active:scale-[0.98] transition-transform">TXT</button>
							<button onclick={() => downloadPdf(t)} class="flex-1 h-10 bg-red-600 hover:bg-red-700 text-white rounded-lg text-label-md font-bold active:scale-[0.98] transition-transform">PDF</button>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	{/if}
</div>
