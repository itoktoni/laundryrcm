<script>
	import '../app.css';
	import { theme } from '$lib/stores/theme.js';
	import { onMount } from 'svelte';
	import Sidebar from '$lib/components/layout/Sidebar.svelte';
	import Navbar from '$lib/components/layout/Navbar.svelte';
	import BottomNav from '$lib/components/layout/BottomNav.svelte';
	import Drawer from '$lib/components/layout/Drawer.svelte';
	import Toaster from '$lib/components/Toaster.svelte';

	let { data, children } = $props();
	let drawerOpen = $state(false);

	onMount(() => {
		theme.init();
	});
</script>

<div class="flex h-screen bg-surface dark:bg-dark-bg text-on-surface">
	{#if data.user}
		<Sidebar user={data.user} />
		<Drawer user={data.user} bind:open={drawerOpen} />
	{/if}

	<div class="flex flex-1 flex-col overflow-hidden">
		{#if data.user}
			<Navbar user={data.user} onMenu={() => (drawerOpen = true)} />
		{/if}

		<main class="flex-1 overflow-y-auto pb-20 md:pb-0 pt-14">
			<div class="max-w-md mx-auto md:max-w-4xl px-container-margin py-stack-md">
				{@render children()}
			</div>
		</main>

		{#if data.user}
			<BottomNav user={data.user} />
		{/if}
	</div>

	<Toaster />
</div>
