<script>
	import { login } from '$lib/client/auth.js';
	import { goto } from '$app/navigation';
	import Input from '$lib/components/ui/Input.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	let email = $state('');
	let password = $state('');
	let loading = $state(false);
	let error = $state('');

	async function handleLogin(e) {
		e.preventDefault();
		loading = true;
		error = '';

		const result = await login(email, password);

		if (result.success) {
			goto('/dashboard');
		} else {
			error = result.error;
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Login - LaundryKu</title>
</svelte:head>

<div class="flex min-h-dvh flex-col bg-surface">
	<!-- Brand hero -->
	<div class="relative overflow-hidden bg-brand-gradient px-6 pb-16 pt-[max(4rem,env(safe-area-inset-top))]">
		<div class="absolute -right-10 -top-14 w-48 h-48 rounded-full bg-white/10"></div>
		<div class="absolute right-16 top-24 w-20 h-20 rounded-full bg-white/10"></div>
		<div class="absolute -left-8 bottom-6 w-28 h-28 rounded-full bg-white/5"></div>

		<div class="relative animate-fade-slide-up">
			<div class="icon-tile w-16 h-16 rounded-2xl bg-white/15 backdrop-blur ring-1 ring-white/25 mb-5">
				<span class="material-symbols-outlined text-[36px] text-white fill-icon">local_laundry_service</span>
			</div>
			<h1 class="text-[32px] font-extrabold tracking-tight text-white">LaundryKu</h1>
			<p class="mt-1 text-[14px] font-medium text-white/80">Manajemen laundry modern dalam genggaman</p>
		</div>
	</div>

	<!-- Form card -->
	<div class="flex-1 px-5 pb-8 -mt-8">
		<form onsubmit={handleLogin} class="app-card shadow-card-lg rounded-3xl p-6 space-y-4 max-w-sm mx-auto w-full animate-fade-slide-up" style="animation-delay:0.08s">
			<div class="pb-1">
				<h2 class="text-[20px] font-extrabold text-on-surface tracking-tight">Selamat Datang 👋</h2>
				<p class="text-[13px] text-on-surface-variant mt-0.5">Masuk untuk mengelola laundry Anda</p>
			</div>

			{#if error}
				<div class="flex items-center gap-2.5 rounded-xl bg-error-container px-4 py-3 text-[13px] font-semibold text-on-error-container animate-fade-in">
					<span class="material-symbols-outlined text-[20px]">error</span>
					{error}
				</div>
			{/if}

			<Input
				label="Email"
				type="email"
				id="email"
				name="email"
				placeholder="email@laundry.com"
				required
				bind:value={email}
			/>

			<Input
				label="Password"
				type="password"
				id="password"
				name="password"
				placeholder="Masukkan password"
				required
				bind:value={password}
			/>

			<div class="pt-1">
				<Button type="submit" size="lg" disabled={loading} class="w-full">
					{loading ? 'Memproses...' : 'Masuk'}
				</Button>
			</div>

			<p class="text-center text-[13px] text-on-surface-variant pt-1">
				Belum punya akun?
				<a href="/register" class="font-bold text-primary">Daftar Gratis</a>
			</p>
		</form>

		<p class="text-center text-[11px] text-outline mt-6">LaundryKu v2.0 — Gratis untuk semua pemilik laundry</p>
	</div>
</div>
