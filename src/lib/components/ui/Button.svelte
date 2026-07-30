<script>
	let { variant = 'primary', size = 'md', type = 'button', disabled = false, onclick = undefined, children, class: className = '' } = $props();

	const variants = {
		primary: 'bg-primary bg-brand-gradient text-white shadow-[0_6px_16px_-6px_rgb(37_99_235/0.5)]',
		secondary: 'bg-surface-container-high text-on-surface border border-outline-variant',
		danger: 'bg-error text-white shadow-[0_6px_16px_-6px_rgb(220_38_38/0.5)]',
		ghost: 'bg-transparent text-primary hover:bg-primary/10',
		success: 'bg-success text-white shadow-[0_6px_16px_-6px_rgb(22_163_74/0.5)]',
		warning: 'bg-warning text-white shadow-[0_6px_16px_-6px_rgb(217_119_6/0.5)]'
	};

	const sizes = {
		sm: 'h-9 px-4 text-[13px] rounded-lg gap-1.5',
		md: 'h-11 px-5 text-[14px] rounded-xl gap-2',
		lg: 'h-13 px-6 text-[15px] rounded-xl gap-2'
	};
</script>

<button
	{type}
	{disabled}
	{onclick}
	class="pressable inline-flex items-center justify-center font-bold focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:opacity-50 disabled:pointer-events-none {variants[variant]} {sizes[size]} {className}"
>
	{@render children()}
</button>
