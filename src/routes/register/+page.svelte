<script>
	import { register } from '$lib/client/auth.js';
	import Input from '$lib/components/ui/Input.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	let name = $state('');
	let email = $state('');
	let password = $state('');
	let loading = $state(false);
	let error = $state('');
	let success = $state(false);

	async function handleRegister(e) {
		e.preventDefault();
		loading = true;
		error = '';

		const result = await register(name, email, password);

		if (result.success) {
			success = true;
		} else {
			error = result.error;
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Daftar - LaundryKu</title>
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
			<p class="mt-1 text-[14px] font-medium text-white/80">Mulai kelola laundry Anda hari ini</p>
		</div>
	</div>

	<!-- Form card -->
	<div class="flex-1 px-5 pb-8 -mt-8">
		{#if success}
			<div class="app-card shadow-card-lg rounded-3xl p-6 max-w-sm mx-auto w-full animate-fade-slide-up">
				<div class="mb-4 flex justify-center">
					<div class="icon-tile w-20 h-20 rounded-full bg-success/10 animate-pop-in">
						<span class="material-symbols-outlined text-[44px] text-success fill-icon">check_circle</span>
					</div>
				</div>
				<h2 class="mb-2 text-center text-[20px] font-extrabold text-on-surface tracking-tight">Pendaftaran Berhasil 🎉</h2>
				<p class="mb-6 text-center text-[13px] text-on-surface-variant leading-relaxed">
					Akun Anda menunggu persetujuan dari Owner. Silakan hubungi Owner untuk mengaktifkan akun Anda.
				</p>
				<a href="/login" class="pressable flex items-center justify-center gap-2 h-13 rounded-xl bg-primary bg-brand-gradient text-white font-bold text-[15px] shadow-[0_6px_16px_-6px_rgb(37_99_235/0.5)]">
					<span class="material-symbols-outlined text-[20px]">login</span>
					Kembali ke Login
				</a>
			</div>
		{:else}
			<form onsubmit={handleRegister} class="app-card shadow-card-lg rounded-3xl p-6 space-y-4 max-w-sm mx-auto w-full animate-fade-slide-up" style="animation-delay:0.08s">
				<div class="pb-1">
					<h2 class="text-[20px] font-extrabold text-on-surface tracking-tight">Buat Akun Baru</h2>
					<p class="text-[13px] text-on-surface-variant mt-0.5">Daftar gratis, tanpa kartu kredit</p>
				</div>

				{#if error}
					<div class="flex items-center gap-2.5 rounded-xl bg-error-container px-4 py-3 text-[13px] font-semibold text-on-error-container animate-fade-in">
						<span class="material-symbols-outlined text-[20px]">error</span>
						{error}
					</div>
				{/if}

				<Input
					label="Nama Lengkap"
					type="text"
					id="name"
					name="name"
					placeholder="Nama Anda"
					required
					bind:value={name}
				/>

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
					placeholder="Minimal 6 karakter"
					required
					bind:value={password}
				/>

				<div class="pt-1">
					<Button type="submit" size="lg" disabled={loading} class="w-full">
						{loading ? 'Mendaftar...' : 'Daftar Sekarang'}
					</Button>
				</div>

				<p class="text-center text-[13px] text-on-surface-variant pt-1">
					Sudah punya akun?
					<a href="/login" class="font-bold text-primary">Masuk</a>
				</p>
			</form>
		{/if}

		<p class="text-center text-[11px] text-outline mt-6">LaundryKu v2.0 — Gratis untuk semua pemilik laundry</p>
	</div>
</div>
