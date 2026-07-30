<script>
	let { variant = 'default', children } = $props();

	const variants = {
		default: 'bg-surface-container-high text-on-surface-variant',
		primary: 'bg-primary/10 text-primary',
		success: 'bg-success/10 text-success',
		warning: 'bg-warning/10 text-warning',
		danger: 'bg-error/10 text-error'
	};
</script>

<span class="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold {variants[variant]}">
	{@render children()}
</span>
