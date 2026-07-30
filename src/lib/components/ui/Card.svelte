<script>
	let { children, class: className = '', padding = 'p-4' } = $props();
</script>

<div class="app-card {padding} {className}">
	{@render children()}
</div>
