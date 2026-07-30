<script>
	let { label = '', value = $bindable(''), options = [], required = false, disabled = false, id = '' } = $props();
</script>

<div class="space-y-1.5">
	{#if label}
		<label for={id} class="block text-[13px] font-semibold text-on-surface-variant">{label}</label>
	{/if}
	<div class="relative">
		<select
			{id}
			{required}
			{disabled}
			bind:value
			class="w-full h-12 appearance-none rounded-xl border border-outline-variant bg-surface-container-lowest px-4 pr-10 text-[15px] text-on-surface focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15 disabled:opacity-50 transition-all"
		>
			{#each options as opt}
				<option value={opt.value}>{opt.label}</option>
			{/each}
		</select>
		<span class="material-symbols-outlined pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">expand_more</span>
	</div>
</div>
