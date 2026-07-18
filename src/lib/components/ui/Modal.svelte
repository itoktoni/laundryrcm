<script>
	let { open = $bindable(false), title = '', children } = $props();

	function close() {
		open = false;
	}

	function handleKeydown(e) {
		if (e.key === 'Escape') close();
	}

	function handleBackdropClick(e) {
		if (e.target === e.currentTarget) close();
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if open}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
		onclick={handleBackdropClick}
		role="dialog"
		aria-modal="true"
	>
		<div class="w-full max-w-lg rounded-xl bg-white shadow-xl dark:bg-gray-800">
			<div class="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-700">
				<h3 class="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
				<button onclick={close} class="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700">
					<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
			</div>
			<div class="p-4">
				{@render children()}
			</div>
		</div>
	</div>
{/if}
