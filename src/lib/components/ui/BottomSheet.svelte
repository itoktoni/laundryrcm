<script>
	let { open = $bindable(false), title = '', children } = $props();

	function close() {
		open = false;
	}
</script>

{#if open}
	<!-- Backdrop -->
	<div class="fixed inset-0 z-[60] bg-black/50 backdrop-blur-[2px] animate-fade-in" onclick={close}></div>

	<!-- Sheet -->
	<div class="fixed bottom-0 left-0 right-0 z-[60] mx-auto max-w-lg bg-surface-container-lowest rounded-t-[1.75rem] shadow-2xl animate-slide-up">
		<!-- Handle -->
		<div class="flex justify-center pt-3 pb-1">
			<div class="w-10 h-1.5 bg-outline-variant rounded-full"></div>
		</div>

		<!-- Header -->
		<div class="flex items-center justify-between px-5 pb-3 pt-1 border-b border-outline-variant/70">
			<h2 class="text-[17px] font-extrabold text-on-surface tracking-tight">{title}</h2>
			<button type="button" onclick={close} class="pressable-sm w-9 h-9 -mr-2 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors" aria-label="Tutup">
				<span class="material-symbols-outlined text-[20px]">close</span>
			</button>
		</div>

		<!-- Content -->
		<div class="px-5 py-4 max-h-[70vh] overflow-y-auto pb-[max(2rem,env(safe-area-inset-bottom))]">
			{@render children()}
		</div>
	</div>
{/if}

<style>
	@keyframes slide-up {
		from { transform: translateY(100%); }
		to { transform: translateY(0); }
	}
	.animate-slide-up {
		animation: slide-up 0.32s cubic-bezier(0.22, 1, 0.36, 1);
	}
</style>
