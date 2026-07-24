<script>
	import Input from '$lib/components/ui/Input.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	let { form } = $props();
	let name = $state('');
	let email = $state('');
	let password = $state('');
	let loading = $state(false);
</script>

<svelte:head>
	<title>Daftar - LaundryKu</title>
</svelte:head>

<div class="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-gray-950">
	<div class="w-full max-w-sm">
		<div class="mb-8 text-center">
			<h1 class="text-3xl font-bold text-blue-600">LaundryKu</h1>
			<p class="mt-2 text-sm text-gray-500 dark:text-gray-400">Buat akun baru</p>
		</div>

		{#if form?.success}
			<div class="rounded-xl border border-green-200 bg-white p-6 shadow-sm dark:border-green-800 dark:bg-gray-800">
				<div class="mb-4 flex justify-center">
					<div class="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
						<span class="material-symbols-outlined text-4xl text-green-600 dark:text-green-400">check_circle</span>
					</div>
				</div>
				<h2 class="mb-2 text-center text-lg font-bold text-gray-900 dark:text-white">Pendaftaran Berhasil</h2>
				<p class="mb-4 text-center text-sm text-gray-500 dark:text-gray-400">
					Akun Anda menunggu persetujuan dari Owner. Silakan hubungi Owner untuk mengaktifkan akun Anda.
				</p>
				<a href="/login" class="block rounded-lg bg-blue-600 px-4 py-3 text-center font-medium text-white hover:bg-blue-700">
					Kembali ke Login
				</a>
			</div>
		{:else}
			<form method="POST" class="space-y-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
				{#if form?.error}
					<div class="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/30 dark:text-red-400">
						{form.error}
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

				<Button type="submit" size="lg" disabled={loading}>
					{loading ? 'Mendaftar...' : 'Daftar'}
				</Button>

				<p class="text-center text-sm text-gray-500 dark:text-gray-400">
					Sudah punya akun?
					<a href="/login" class="font-medium text-blue-600 hover:text-blue-500">Masuk</a>
				</p>
			</form>
		{/if}
	</div>
</div>
