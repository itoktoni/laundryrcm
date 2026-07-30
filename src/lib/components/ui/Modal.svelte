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
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-[2px] p-4 animate-fade-in"
		onclick={handleBackdropClick}
		role="dialog"
		aria-modal="true"
	>
		<div class="w-full max-w-lg app-card shadow-card-lg animate-pop-in overflow-hidden">
			<div class="flex items-center justify-between border-b border-outline-variant/70 px-5 py-4">
				<h3 class="text-[17px] font-extrabold text-on-surface tracking-tight">{title}</h3>
				<button onclick={close} class="pressable-sm w-9 h-9 -mr-2 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors" aria-label="Tutup">
					<span class="material-symbols-outlined text-[20px]">close</span>
				</button>
			</div>
			<div class="p-5 max-h-[75vh] overflow-y-auto">
				{@render children()}
			</div>
		</div>
	</div>
{/if}
