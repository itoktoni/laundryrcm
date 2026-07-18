<script>
	import { enhance } from '$app/forms';

	let { data, form } = $props();
	let showAdd = $state(false);
	let editId = $state(null);
	let openId = $state(null);
</script>

<svelte:head>
	<title>FAQ - LaundryKu</title>
</svelte:head>

<div class="space-y-stack-lg">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="font-headline-lg text-headline-lg text-on-surface">FAQ</h1>
			<p class="text-body-sm text-on-surface-variant">Pertanyaan yang sering diajukan</p>
		</div>
		<button onclick={() => (showAdd = !showAdd)} class="px-4 h-11 bg-primary text-on-primary rounded-lg font-bold text-label-md active:scale-95 transition-transform">
			{showAdd ? 'Tutup' : '+ FAQ'}
		</button>
	</div>

	{#if showAdd}
		<form method="POST" action="?/add" use:enhance={() => ({ update }) => update().then(() => (showAdd = false))} class="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant space-y-3">
			<input name="question" placeholder="Pertanyaan" required class="w-full h-11 px-4 bg-surface-container-low border border-outline-variant rounded-lg text-body-sm" />
			<textarea name="answer" rows="4" placeholder="Jawaban" class="w-full p-4 bg-surface-container-low border border-outline-variant rounded-lg text-body-sm"></textarea>
			<button type="submit" class="w-full h-11 bg-primary text-on-primary rounded-lg font-bold text-label-md">Simpan</button>
		</form>
	{/if}

	{#if form?.error}
		<p class="text-body-sm text-error">{form.error}</p>
	{/if}

	{#if data.faqs.length === 0}
		<p class="text-body-sm text-on-surface-variant text-center py-8">Belum ada FAQ</p>
	{:else}
		<div class="space-y-3">
			{#each data.faqs as f}
				<div class="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden">
					{#if editId === f.faq_id}
						<form method="POST" action="?/edit" use:enhance={() => ({ update }) => update().then(() => (editId = null))} class="p-4 space-y-3">
							<input type="hidden" name="id" value={f.faq_id} />
							<input name="question" value={f.faq_question} required class="w-full h-11 px-3 bg-surface-container-low border border-outline-variant rounded-lg text-body-sm" />
							<textarea name="answer" rows="4" class="w-full p-3 bg-surface-container-low border border-outline-variant rounded-lg text-body-sm">{f.faq_answer}</textarea>
							<div class="flex gap-2">
								<button type="submit" class="flex-1 h-10 bg-primary text-on-primary rounded-lg font-bold text-label-md">Simpan</button>
								<button type="button" onclick={() => (editId = null)} class="px-4 h-10 bg-surface-container-high text-on-surface-variant rounded-lg text-label-md">Batal</button>
							</div>
						</form>
					{:else}
						<div class="flex items-center">
							<button onclick={() => (openId = openId === f.faq_id ? null : f.faq_id)} class="flex-1 flex items-center justify-between gap-2 p-4 text-left">
								<span class="font-body-md text-on-surface font-semibold">{f.faq_question}</span>
								<span class="material-symbols-outlined text-on-surface-variant transition-transform {openId === f.faq_id ? 'rotate-180' : ''}">expand_more</span>
							</button>
							<div class="flex gap-1 pr-3 shrink-0">
								<button onclick={() => (editId = f.faq_id)} class="p-1.5 rounded-lg text-outline hover:bg-surface-container-high transition-colors" aria-label="Edit">
									<span class="material-symbols-outlined text-[18px]">edit</span>
								</button>
								<form method="POST" action="?/delete" use:enhance={({ cancel }) => { if (!confirm('Hapus FAQ ini?')) cancel(); }}>
									<input type="hidden" name="id" value={f.faq_id} />
									<button type="submit" class="p-1.5 rounded-lg text-outline hover:bg-error-container hover:text-error transition-colors" aria-label="Hapus">
										<span class="material-symbols-outlined text-[18px]">delete</span>
									</button>
								</form>
							</div>
						</div>
						{#if openId === f.faq_id}
							<p class="px-4 pb-4 -mt-1 whitespace-pre-wrap text-body-sm text-on-surface-variant">{f.faq_answer}</p>
						{/if}
					{/if}
				</div>
			{/each}
		</div>
	{/if}
</div>
