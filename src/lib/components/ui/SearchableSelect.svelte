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
	<button type="button" onclick={() => open = !open} class="w-full h-touch-target px-4 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary bg-surface-container-lowest text-left font-body-md text-body-md flex items-center justify-between gap-2">
		<div class="flex flex-wrap gap-1 flex-1 min-w-0">
			{#if multiple && selected?.length > 0}
				{#each selected as s}
					<span class="inline-flex items-center gap-1 px-2 py-0.5 bg-primary-container text-on-primary-container rounded text-label-md">
						{s.label}
							<span role="button" tabindex="0" onclick={(e) => { e.stopPropagation(); remove(s.value); }} onkeydown={(e) => { if (e.key === 'Enter') remove(s.value); }} class="material-symbols-outlined text-[14px] cursor-pointer">close</span>
					</span>
				{/each}
			{:else if !multiple && selected}
				<span class="truncate text-on-surface">{selected.label}</span>
			{:else}
				<span class="text-outline-variant">{placeholder}</span>
			{/if}
		</div>
		<span class="material-symbols-outlined text-outline text-[20px] flex-shrink-0 transition-transform {open ? 'rotate-180' : ''}">expand_more</span>
	</button>

	<!-- Dropdown -->
	{#if open}
		<div class="absolute top-full left-0 right-0 mt-1 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-lg z-50 max-h-64 overflow-hidden flex flex-col">
			{#if searchable}
				<div class="p-2 border-b border-outline-variant">
					<div class="relative">
						<span class="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-[18px]">search</span>
						<input bind:value={search} class="w-full pl-9 pr-3 h-9 rounded-lg bg-surface-container-low border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary text-body-sm outline-none" placeholder="Cari..." />
					</div>
				</div>
			{/if}
			<div class="overflow-y-auto">
				{#if filtered.length === 0}
					<p class="px-4 py-3 text-body-sm text-on-surface-variant">Tidak ditemukan</p>
				{:else}
					{#each filtered as opt}
						<button type="button" onclick={() => select(opt)} class="w-full px-4 py-3 text-left text-body-sm hover:bg-surface-container-low flex items-center justify-between {multiple && (value || []).includes(opt.value) ? 'bg-primary-container text-on-primary-container' : 'text-on-surface'}">
							<span>{opt.label}</span>
							{#if multiple && (value || []).includes(opt.value)}
								<span class="material-symbols-outlined text-primary text-[18px]">check</span>
							{:else if !multiple && value === opt.value}
								<span class="material-symbols-outlined text-primary text-[18px]">check</span>
							{/if}
						</button>
					{/each}
				{/if}
			</div>
		</div>
	{/if}
</div>
