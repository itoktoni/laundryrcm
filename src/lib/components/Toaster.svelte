<script>
	import { toasts, dismiss } from '$lib/stores/toast.js';

	const styles = {
		success: 'bg-success-container text-on-success-container',
		error: 'bg-error-container text-on-error-container',
		info: 'bg-surface-container-highest text-on-surface'
	};

	const icons = {
		success: 'check_circle',
		error: 'error',
		info: 'info'
	};
</script>

<div class="fixed top-0 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 w-full max-w-sm px-4 pt-[max(1rem,env(safe-area-inset-top))] pointer-events-none">
	{#each $toasts as t (t.id)}
		{@const type = t.type === 'success' || t.type === 'error' ? t.type : 'info'}
		<div
			class="pointer-events-auto flex items-center gap-3 px-4 min-h-12 py-2.5 rounded-2xl shadow-card-lg text-[13px] font-semibold animate-fade-slide-up {styles[type]}"
			role="alert"
		>
			<span class="material-symbols-outlined text-[20px] fill-icon shrink-0">{icons[type]}</span>
			<span class="flex-1">{t.message}</span>
			<button onclick={() => dismiss(t.id)} class="pressable-sm opacity-60 hover:opacity-100 -mr-1" aria-label="Tutup">
				<span class="material-symbols-outlined text-[18px]">close</span>
			</button>
		</div>
	{/each}
</div>
