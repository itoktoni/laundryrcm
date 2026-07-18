<script>
	let { status } = $props();

	const labels = {
		pending: 'Pending',
		cuci: 'Cuci',
		kering: 'Kering',
		setrika: 'Setrika',
		selesai: 'Selesai',
		diambil: 'Diambil',
		unpaid: 'Belum Bayar',
		paid: 'Lunas'
	};

	const colors = {
		pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
		cuci: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
		kering: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
		setrika: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
		selesai: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
		diambil: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
		unpaid: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
		paid: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
	};
</script>

<span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium {colors[status] || colors.pending}">
	{labels[status] || status}
</span>
