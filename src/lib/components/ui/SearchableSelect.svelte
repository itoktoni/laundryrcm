<script>
	let { options = [], value = $bindable(''), placeholder = 'Pilih...', multiple = false, searchable = true } = $props();

	let open = $state(false);
	let search = $state('');
	let ref = $state(null);

	let filtered = $derived(
		options.filter(o => !search || o.label.toLowerCase().includes(search.toLowerCase()))
	);

	let selected = $derived(
		multiple
			? options.filter(o => (value || []).includes(o.value))
			: options.find(o => o.value === value)
	);

	function select(opt) {
		if (multiple) {
			let arr = value || [];
			if (arr.includes(opt.value)) {
				arr = arr.filter(v => v !== opt.value);
			} else {
				arr = [...arr, opt.value];
			}
			value = arr;
		} else {
			value = opt.value;
			open = false;
			search = '';
		}
	}

	function remove(val) {
		if (multiple) {
			value = (value || []).filter(v => v !== val);
		}
	}

	function handleClickOutside(e) {
		if (ref && !ref.contains(e.target)) {
			open = false;
			search = '';
		}
	}
</script>

<svelte:window onclick={handleClickOutside} />

<div class="relative" bind:this={ref}>
	<!-- Trigger -->
	<button type="button" onclick={() => open = !open} class="pressable w-full min-h-12 px-4 rounded-xl border bg-surface-container-lowest text-left text-[15px] flex items-center justify-between gap-2 transition-all {open ? 'border-primary ring-4 ring-primary/15' : 'border-outline-variant'}">
		<div class="flex flex-wrap gap-1.5 flex-1 min-w-0 py-1.5">
			{#if multiple && selected?.length > 0}
				{#each selected as s}
					<span class="inline-flex items-center gap-1 px-2.5 py-1 bg-primary/10 text-primary rounded-lg text-[12px] font-bold">
						{s.label}
							<span role="button" tabindex="0" onclick={(e) => { e.stopPropagation(); remove(s.value); }} onkeydown={(e) => { if (e.key === 'Enter') remove(s.value); }} class="material-symbols-outlined text-[14px] cursor-pointer">close</span>
					</span>
				{/each}
			{:else if !multiple && selected}
				<span class="truncate font-medium text-on-surface">{selected.label}</span>
			{:else}
				<span class="text-outline-variant">{placeholder}</span>
			{/if}
		</div>
		<span class="material-symbols-outlined text-outline text-[22px] flex-shrink-0 transition-transform duration-200 {open ? 'rotate-180' : ''}">expand_more</span>
	</button>

	<!-- Dropdown -->
	{#if open}
		<div class="absolute top-full left-0 right-0 mt-2 app-card shadow-card-lg z-50 max-h-64 overflow-hidden flex flex-col animate-fade-slide-up">
			{#if searchable}
				<div class="p-2.5 border-b border-outline-variant/70">
					<div class="relative">
						<span class="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-[18px]">search</span>
						<input bind:value={search} class="w-full pl-9 pr-3 h-10 rounded-xl bg-surface-container-low border border-transparent focus:border-primary focus:ring-4 focus:ring-primary/15 text-[14px] outline-none transition-all" placeholder="Cari..." />
					</div>
				</div>
			{/if}
			<div class="overflow-y-auto">
				{#if filtered.length === 0}
					<div class="px-4 py-6 text-center">
						<span class="material-symbols-outlined text-[28px] text-outline-variant">search_off</span>
						<p class="mt-1 text-[13px] text-on-surface-variant">Tidak ditemukan</p>
					</div>
				{:else}
					{#each filtered as opt}
						<button type="button" onclick={() => select(opt)} class="w-full px-4 py-3 text-left text-[14px] font-medium hover:bg-surface-container-low flex items-center justify-between gap-2 transition-colors {(multiple ? (value || []).includes(opt.value) : value === opt.value) ? 'bg-primary/8 text-primary font-bold' : 'text-on-surface'}">
							<span class="truncate">{opt.label}</span>
							{#if multiple && (value || []).includes(opt.value)}
								<span class="material-symbols-outlined text-primary text-[20px] shrink-0">check_circle</span>
							{:else if !multiple && value === opt.value}
								<span class="material-symbols-outlined text-primary text-[20px] shrink-0">check_circle</span>
							{/if}
						</button>
					{/each}
				{/if}
			</div>
		</div>
	{/if}
</div>
