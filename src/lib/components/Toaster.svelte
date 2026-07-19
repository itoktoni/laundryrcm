<script>
	import { toasts, dismiss } from '$lib/stores/toast.js';

	const styles = {
		success: 'bg-success-container text-success',
		error: 'bg-error-container text-error',
		info: 'bg-surface-container-high text-on-surface'
	};
</script>

<div class="fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 w-full max-w-sm px-4 pointer-events-none">
	{#each $toasts as t (t.id)}
		<div
			class="pointer-events-auto flex items-center justify-between gap-3 px-4 h-12 rounded-xl shadow-lg text-label-md font-medium animate-[fadeIn_0.2s_ease-out] {styles[t.type] || styles.info}"
			role="alert"
		>
			<span>{t.message}</span>
			<button onclick={() => dismiss(t.id)} class="opacity-60 hover:opacity-100" aria-label="Tutup">
				<span class="material-symbols-outlined text-[18px]">close</span>
			</button>
		</div>
	{/each}
</div>

<style>
	@keyframes fadeIn {
		from { opacity: 0; transform: translateY(-8px); }
		to { opacity: 1; transform: translateY(0); }
	}
</style>
