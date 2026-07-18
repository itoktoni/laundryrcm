<script>
	let { label = '', value = $bindable(''), options = [], required = false, disabled = false, id = '' } = $props();
</script>

<div class="space-y-1">
	{#if label}
		<label for={id} class="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
	{/if}
	<select
		{id}
		{required}
		{disabled}
		bind:value
		class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
	>
		{#each options as opt}
			<option value={opt.value}>{opt.label}</option>
		{/each}
	</select>
</div>
