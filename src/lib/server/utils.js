export function formatCurrency(amount) {
	return new Intl.NumberFormat('id-ID', {
		style: 'currency',
		currency: 'IDR',
		minimumFractionDigits: 0,
		maximumFractionDigits: 0
	}).format(amount);
}

export function formatDate(dateStr) {
	if (!dateStr) return '-';
	const d = new Date(dateStr);
	return d.toLocaleDateString('id-ID', {
		day: 'numeric',
		month: 'short',
		year: 'numeric'
	});
}

export function formatDateTime(dateStr) {
	if (!dateStr) return '-';
	const d = new Date(dateStr);
	return d.toLocaleDateString('id-ID', {
		day: 'numeric',
		month: 'short',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit'
	});
}

export function statusLabel(status) {
	const labels = {
		pending: 'Pending',
		cuci: 'Cuci',
		kering: 'Kering',
		setrika: 'Setrika',
		selesai: 'Selesai',
		diambil: 'Diambil'
	};
	return labels[status] || status;
}

export function statusColor(status) {
	const colors = {
		pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
		cuci: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
		kering: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
		setrika: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
		selesai: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
		diambil: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
	};
	return colors[status] || 'bg-gray-100 text-gray-800';
}

export function paymentColor(status) {
	return status === 'paid'
		? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
		: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
}

export function getDateRange(period) {
	const now = new Date();
	let start, end;

	switch (period) {
		case 'today':
			start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
			end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
			break;
		case 'week':
			const day = now.getDay();
			start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - day);
			end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
			break;
		case 'month':
			start = new Date(now.getFullYear(), now.getMonth(), 1);
			end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
			break;
		default:
			start = new Date(now.getFullYear(), now.getMonth(), 1);
			end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
	}

	return {
		start: start.toISOString(),
		end: end.toISOString()
	};
}
