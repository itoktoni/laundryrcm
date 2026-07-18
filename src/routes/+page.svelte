<script>
	let { data } = $props();
</script>

<svelte:head>
	<title>LaundryKu - Manajemen Laundry AI</title>
</svelte:head>

<div class="flex py-10 flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 dark:from-gray-900 dark:to-gray-800">
	<div class="text-center">
		<h1 class="text-5xl font-bold text-blue-600">LaundryKu</h1>
		<p class="mt-4 text-lg text-gray-600 dark:text-gray-300">Naikkan Omset Laundry dengan AI</p>
		<p class="mt-2 text-sm text-gray-500 dark:text-gray-400">Solusi praktis untuk membuat laundry lebih rapi, cepat, dan menguntungkan</p>

		<div class="mt-8 flex flex-col gap-3 sm:flex-row">
			{#if data.user}
				<a href="/dashboard" class="rounded-lg bg-blue-600 px-6 py-3 text-center font-medium text-white hover:bg-blue-700">
					Buka Dashboard
				</a>
			{:else}
				<a href="/login" class="rounded-lg bg-blue-600 px-6 py-3 text-center font-medium text-white hover:bg-blue-700">
					Masuk
				</a>
				<a href="/register" class="rounded-lg border border-blue-600 px-6 py-3 text-center font-medium text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-800">
					Daftar Gratis
				</a>
			{/if}
		</div>

		<div class="mt-12 grid grid-cols-2 gap-4 text-left sm:grid-cols-3">
			<div class="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
				<div class="text-2xl">📋</div>
				<div class="mt-2 text-sm font-medium text-gray-900 dark:text-white">Order Management</div>
				<div class="text-xs text-gray-500 dark:text-gray-400">Track order real-time</div>
			</div>
			<div class="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
				<div class="text-2xl">💰</div>
				<div class="mt-2 text-sm font-medium text-gray-900 dark:text-white">Keuangan</div>
				<div class="text-xs text-gray-500 dark:text-gray-400">Laba bersih otomatis</div>
			</div>
			<div class="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
				<div class="text-2xl">👥</div>
				<div class="mt-2 text-sm font-medium text-gray-900 dark:text-white">CRM</div>
				<div class="text-xs text-gray-500 dark:text-gray-400">Kelola pelanggan VIP</div>
			</div>
			<div class="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
				<div class="text-2xl">🎁</div>
				<div class="mt-2 text-sm font-medium text-gray-900 dark:text-white">Promo</div>
				<div class="text-xs text-gray-500 dark:text-gray-400">Diskon & voucher</div>
			</div>
			<div class="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
				<div class="text-2xl">🧮</div>
				<div class="mt-2 text-sm font-medium text-gray-900 dark:text-white">Kalkulator</div>
				<div class="text-xs text-gray-500 dark:text-gray-400">Hitung harga & profit</div>
			</div>
			<div class="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
				<div class="text-2xl">📊</div>
				<div class="mt-2 text-sm font-medium text-gray-900 dark:text-white">Laporan</div>
				<div class="text-xs text-gray-500 dark:text-gray-400">Export CSV & PDF</div>
			</div>
		</div>
	</div>
</div>
