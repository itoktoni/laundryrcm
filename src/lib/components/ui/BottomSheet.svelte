<script>
	let { open = $bindable(false), title = '', children } = $props();

	function close() {
		open = false;
	}
</script>

{#if open}
	<!-- Backdrop -->
	<div class="fixed inset-0 z-[60] bg-black/50" onclick={close}></div>

	<!-- Sheet -->
	<div class="fixed bottom-0 left-0 right-0 z-[60] bg-surface rounded-t-2xl shadow-lg animate-slide-up" style="margin-bottom: -10px;">
		<!-- Handle -->
		<div class="flex justify-center pt-3 pb-2">
			<div class="w-10 h-1 bg-outline-variant rounded-full"></div>
		</div>

		<!-- Header -->
		<div class="flex items-center justify-between px-container-margin pb-3 border-b border-outline-variant">
			<h2 class="font-headline-md text-headline-md text-on-surface">{title}</h2>
			<button type="button" onclick={close} class="w-8 h-8 rounded-full flex items-center justify-center hover:bg-surface-container-high active:scale-95 transition-transform">
				<span class="material-symbols-outlined text-on-surface-variant">close</span>
			</button>
		</div>

		<!-- Content -->
		<div class="px-container-margin py-stack-md pb-8 max-h-[70vh] overflow-y-auto">
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
		animation: slide-up 0.3s ease-out;
	}
</style>
