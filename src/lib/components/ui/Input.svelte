<script>
	let { label = '', type = 'text', name = '', value = $bindable(''), placeholder = '', required = false, disabled = false, error = '', id = '' } = $props();
</script>

<div class="space-y-1">
	{#if label}
		<label for={id} class="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
	{/if}
	<input
		{type}
		{id}
		{name}
		{placeholder}
		{required}
		{disabled}
		bind:value
		class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 {error ? 'border-red-500' : ''}"
	/>
	{#if error}
		<p class="text-xs text-red-500">{error}</p>
	{/if}
</div>
