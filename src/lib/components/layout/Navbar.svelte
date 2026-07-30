<script>
	import { enhance } from '$app/forms';
	import { theme } from '$lib/stores/theme.js';

	let { user, onMenu } = $props();
	let showMenu = $state(false);
</script>

<header class="sticky top-0 z-40 bg-surface/85 backdrop-blur-xl border-b border-outline-variant/60 pt-safe select-none">
	<div class="flex items-center justify-between h-16 px-container-margin">
		<div class="flex items-center gap-3">
			<button
				onclick={onMenu}
				class="pressable-sm w-10 h-10 -ml-2 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors md:hidden"
				aria-label="Buka menu"
			>
				<span class="material-symbols-outlined">menu</span>
			</button>
			<a href="/dashboard" class="flex items-center gap-2.5">
				<span class="icon-tile w-9 h-9 bg-brand-gradient text-white shadow-fab">
					<span class="material-symbols-outlined text-[20px] fill-icon">local_laundry_service</span>
				</span>
				<h1 class="text-[19px] font-extrabold tracking-tight text-on-surface">
					Laundry<span class="text-brand-gradient">Ku</span>
				</h1>
			</a>
		</div>

		<div class="flex items-center gap-1.5">
			<button
				onclick={() => theme.toggle()}
				class="pressable-sm w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors"
				aria-label="Ganti tema"
			>
				<span class="material-symbols-outlined text-[22px]">{$theme === 'dark' ? 'light_mode' : 'dark_mode'}</span>
			</button>

			<div class="relative">
				<button
					onclick={() => (showMenu = !showMenu)}
					class="pressable-sm w-10 h-10 rounded-full bg-brand-gradient text-white flex items-center justify-center font-bold text-[15px] shadow-fab"
					aria-label="Menu akun"
				>
					{user?.name?.charAt(0)?.toUpperCase() || 'U'}
				</button>

				{#if showMenu}
					<button class="fixed inset-0 z-40 cursor-default" onclick={() => (showMenu = false)} aria-label="Tutup menu"></button>
					<div class="absolute right-0 top-12 z-50 w-56 app-card shadow-card-lg p-1.5 animate-fade-slide-up">
						<div class="px-3.5 py-3 border-b border-outline-variant/70 mb-1">
							<p class="font-bold text-on-surface truncate">{user?.name}</p>
							<p class="text-label-sm text-on-surface-variant truncate">{user?.email}</p>
							<span class="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider capitalize">
								{user?.role}
							</span>
						</div>
						<a href="/settings" onclick={() => (showMenu = false)} class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-body-sm font-medium text-on-surface hover:bg-surface-container-low transition-colors">
							<span class="material-symbols-outlined text-[20px] text-on-surface-variant">person</span>
							Profil Saya
						</a>
						<form method="POST" action="/logout" use:enhance>
							<button type="submit" class="flex w-full items-center gap-3 px-3.5 py-2.5 rounded-xl text-body-sm font-medium text-error hover:bg-error-container transition-colors">
								<span class="material-symbols-outlined text-[20px]">logout</span>
								Keluar
							</button>
						</form>
					</div>
				{/if}
			</div>
		</div>
	</div>
</header>
