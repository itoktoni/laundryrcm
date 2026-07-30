<script>
	let { label = '', type = 'text', name = '', value = $bindable(''), placeholder = '', required = false, disabled = false, error = '', id = '' } = $props();
</script>

<div class="space-y-1.5">
	{#if label}
		<label for={id} class="block text-[13px] font-semibold text-on-surface-variant">{label}</label>
	{/if}
	<input
		{type}
		{id}
		{name}
		{placeholder}
		{required}
		{disabled}
		bind:value
		class="w-full h-12 rounded-xl border bg-surface-container-lowest px-4 text-[15px] text-on-surface placeholder:text-outline-variant focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15 disabled:opacity-50 transition-all {error ? 'border-error focus:ring-error/15 focus:border-error' : 'border-outline-variant'}"
	/>
	{#if error}
		<p class="text-xs font-medium text-error flex items-center gap-1">
			<span class="material-symbols-outlined text-[14px]">error</span>
			{error}
		</p>
	{/if}
</div>
