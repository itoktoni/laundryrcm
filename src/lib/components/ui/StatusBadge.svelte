<script>
	let { status } = $props();

	const labels = {
		pending: 'Pending',
		cuci: 'Cuci',
		kering: 'Kering',
		setrika: 'Setrika',
		packing: 'Packing',
		selesai: 'Selesai',
		diambil: 'Diambil',
		unpaid: 'Belum Bayar',
		paid: 'Lunas'
	};

	const colors = {
		pending: 'bg-pending/15 text-secondary',
		cuci: 'bg-primary/10 text-primary',
		kering: 'bg-kering/10 text-kering',
		setrika: 'bg-setrika/10 text-setrika',
		packing: 'bg-packing/15 text-warning',
		selesai: 'bg-success/10 text-success',
		diambil: 'bg-surface-container-high text-on-surface-variant',
		unpaid: 'bg-error/10 text-error',
		paid: 'bg-success/10 text-success'
	};
</script>

<span class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold {colors[status] || colors.pending}">
	<span class="w-1.5 h-1.5 rounded-full bg-current"></span>
	{labels[status] || status}
</span>
