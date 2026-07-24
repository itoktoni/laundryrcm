<script>
	import { enhance } from '$app/forms';

	let { user, onMenu } = $props();
	let showMenu = $state(false);
</script>

<header class="fixed top-0 w-full z-50 bg-surface dark:bg-dark-bg border-b border-outline-variant dark:border-outline flex justify-between items-center px-container-margin h-14 relative">
	<div class="flex items-center gap-2">
		<button onclick={onMenu} class="active:opacity-70 mt-1 md:hidden" aria-label="Buka menu">
			<span class="material-symbols-outlined text-primary">menu_open</span>
		</button>
		<h1 class="font-headline-lg-mobile text-headline-lg-mobile text-primary dark:text-inverse-primary tracking-tight">LaundryKu</h1>
	</div>
	<div class="flex items-center gap-3">
		<div class="relative">
			<button onclick={() => (showMenu = !showMenu)} class="active:opacity-70" aria-label="Menu akun">
				<span class="material-symbols-outlined text-on-surface-variant">person</span>
			</button>

			{#if showMenu}
				<button class="fixed inset-0 z-40" onclick={() => (showMenu = false)} aria-label="Tutup menu"></button>
				<div class="absolute right-0 top-12 z-50 w-48 bg-surface-container-lowest rounded-xl border border-outline-variant shadow-lg py-2">
					<div class="px-4 py-2 border-b border-outline-variant">
						<p class="font-body-md text-on-surface truncate">{user?.name}</p>
						<p class="text-label-sm text-on-surface-variant truncate">{user?.email}</p>
					</div>
					<a href="/settings" onclick={() => (showMenu = false)} class="flex items-center gap-3 px-4 py-2.5 text-body-sm text-on-surface hover:bg-surface-container-low transition-colors">
						<span class="material-symbols-outlined text-[18px] text-on-surface-variant">person</span>
						Profil
					</a>
					<form method="POST" action="/logout" use:enhance>
						<button type="submit" class="flex w-full items-center gap-3 px-4 py-2.5 text-body-sm text-error hover:bg-error-container transition-colors">
							<span class="material-symbols-outlined text-[18px]">logout</span>
							Logout
						</button>
					</form>
				</div>
			{/if}
		</div>
	</div>
</header>
