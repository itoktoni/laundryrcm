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
	</div>
</div>
