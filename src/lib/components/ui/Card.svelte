<script>
	let { children, class: className = '' } = $props();
</script>

<div class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 {className}">
	{@render children()}
</div>
