<script>
	import { formatCurrency, formatDate } from '$lib/utils.js';
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { onDestroy } from 'svelte';
	import QrisModal from '$lib/components/ui/QrisModal.svelte';

	let { data } = $props();
	let order = $derived(data.order);
	let items = $derived(data.items);
	let showQris = $state(false);

	let timer;
	$effect(() => {
		clearInterval(timer);
		if (order.order_payment_status !== 'paid') {
			timer = setInterval(async () => {
				try {
					const res = await fetch(`/orders/${order.order_id}/status`);
					if (!res.ok) return;
					const s = await res.json();
					if (s.paid) {
						clearInterval(timer);
						invalidateAll();
					}
				} catch {}
			}, 5000);
		}
	});
	onDestroy(() => clearInterval(timer));

	const statusFlow = ['pending', 'cuci', 'kering', 'setrika', 'selesai', 'diambil'];
	const statusColors = { pending: 'bg-pending', cuci: 'bg-primary', kering: 'bg-kering', setrika: 'bg-setrika', selesai: 'bg-success', diambil: 'bg-secondary' };
	const statusLabels = { pending: 'Antre', cuci: 'Cuci', kering: 'Kering', setrika: 'Setrika', selesai: 'Selesai', diambil: 'Diambil' };

	function getNextStatus(current) {
		const idx = statusFlow.indexOf(current);
		return idx < statusFlow.length - 1 ? statusFlow[idx + 1] : null;
	}

	let nextStatus = $derived(getNextStatus(order.order_status));
</script>

<svelte:head>
	<title>Order #{order.order_id.slice(0, 8).toUpperCase()} - LaundryKu</title>
</svelte:head>

<div class="space-y-stack-lg">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="font-headline-lg text-headline-lg text-on-surface">#{order.order_id.slice(0, 8).toUpperCase()}</h1>
			<p class="text-label-md text-on-surface-variant">{formatDate(order.order_created_at)}</p>
		</div>
		<div class="flex gap-2">
			<span class="px-3 py-1 {statusColors[order.order_status]} text-on-primary rounded-full text-label-md font-label-md">{statusLabels[order.order_status]}</span>
			<span class="px-3 py-1 {order.order_payment_status === 'paid' ? 'bg-success' : 'bg-error'} text-on-primary rounded-full text-label-md font-label-md">{order.order_payment_status === 'paid' ? 'Lunas' : 'Belum Bayar'}</span>
		</div>
	</div>

	<!-- Customer -->
	<div class="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant">
		<div class="flex items-center gap-3">
			<div class="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center text-on-primary-fixed font-bold text-headline-md">
				{order.customer_name.charAt(0)}
			</div>
			<div>
				<div class="flex items-center gap-2">
					<h3 class="font-headline-md text-headline-md text-on-surface">{order.customer_name}</h3>
					{#if order.customer_vip}
						<span class="px-2 py-0.5 bg-warning text-on-surface text-[10px] font-bold rounded uppercase tracking-wider">VIP</span>
					{/if}
				</div>
				<p class="text-body-sm text-on-surface-variant">{order.customer_phone}</p>
			</div>
		</div>
	</div>

	<!-- Items -->
	<div class="bg-surface-container-low p-4 rounded-xl border border-outline-variant space-y-3">
		<label class="font-label-md text-label-md text-on-surface-variant uppercase">Item</label>
		{#each items as item}
			<div class="flex items-center justify-between p-3 bg-surface-container-lowest rounded-lg border border-outline-variant">
				<div>
					<p class="font-body-md text-on-surface font-semibold">{item.product_name}</p>
					<p class="text-label-md text-on-surface-variant">{item.item_quantity} {item.product_unit} × {formatCurrency(item.item_price)}</p>
				</div>
				<span class="font-headline-md text-primary">{formatCurrency(item.item_subtotal)}</span>
			</div>
		{/each}

		<div class="pt-3 border-t border-outline-variant space-y-2">
			<div class="flex justify-between text-body-sm">
				<span class="text-on-surface-variant">Subtotal</span>
				<span class="text-on-surface">{formatCurrency(order.order_subtotal)}</span>
			</div>
			{#if order.order_discount_amount > 0}
				<div class="flex justify-between text-body-sm">
					<span class="text-on-surface-variant">Diskon {order.promo_name ? `(${order.promo_name})` : ''}</span>
					<span class="text-error">-{formatCurrency(order.order_discount_amount)}</span>
				</div>
			{/if}
			{#if order.order_unique_code}
				<div class="flex justify-between text-body-sm">
					<span class="text-on-surface-variant">Kode Unik</span>
					<span class="text-on-surface">+{formatCurrency(order.order_paid_amount - order.order_total_price)}</span>
				</div>
			{/if}
			<div class="flex justify-between pt-2 border-t border-outline-variant">
				<span class="font-headline-md text-on-surface">{order.order_unique_code ? 'Total Dibayar' : 'Total'}</span>
				<span class="font-display text-display text-primary">{formatCurrency(order.order_unique_code ? order.order_paid_amount : order.order_total_price)}</span>
			</div>
			{#if order.order_payment_status === 'paid'}
				<div class="flex justify-between text-body-sm pt-1">
					<span class="text-on-surface-variant">Status</span>
					<span class="text-success font-label-md">Lunas</span>
				</div>
			{/if}
		</div>
	</div>

	<!-- Notes -->
	{#if order.order_notes}
		<div class="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant">
			<p class="font-label-md text-label-md text-on-surface-variant uppercase mb-2">Catatan</p>
			<p class="text-body-sm text-on-surface">{order.order_notes}</p>
		</div>
	{/if}

	<!-- Status Timeline -->
	<div class="bg-surface-container-low p-4 rounded-xl border border-outline-variant">
		<p class="font-label-md text-label-md text-on-surface-variant uppercase mb-4">Status Order</p>
		<div class="flex justify-between">
			{#each statusFlow as status, i}
				<div class="flex flex-col items-center gap-1">
					<div class="w-8 h-8 rounded-full flex items-center justify-center {order.order_status === status ? 'bg-primary text-on-primary' : statusFlow.indexOf(status) < statusFlow.indexOf(order.order_status) ? 'bg-success text-on-primary' : 'bg-outline-variant text-on-surface-variant'}">
						{#if statusFlow.indexOf(status) < statusFlow.indexOf(order.order_status)}
							<span class="material-symbols-outlined text-[16px]">check</span>
						{:else}
							<span class="text-[10px] font-bold">{i + 1}</span>
						{/if}
					</div>
					<span class="text-[9px] {order.order_status === status ? 'text-primary font-bold' : 'text-on-surface-variant'}">{status}</span>
				</div>
			{/each}
		</div>
	</div>

	<!-- Actions -->
	<div class="flex gap-3">
		{#if nextStatus}
			<form method="POST" action="?/updateStatus" use:enhance class="flex-1">
				<input type="hidden" name="status" value={nextStatus} />
				<button type="submit" class="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-label-md active:scale-[0.98] transition-transform flex items-center justify-center gap-2">
					<span class="material-symbols-outlined text-[18px]">arrow_forward</span>
					Move to {nextStatus}
				</button>
			</form>
		{/if}
		{#if order.order_payment_status === 'unpaid'}
			<button type="button" onclick={() => (showQris = true)} class="flex-1 h-12 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-label-md active:scale-[0.98] transition-transform flex items-center justify-center gap-2">
				<span class="material-symbols-outlined text-[18px]">qr_code_2</span>
				Bayar
			</button>
		{/if}
	</div>
</div>

<QrisModal
	bind:open={showQris}
	amount={order.order_total_price}
	orderId={order.order_id}
	onPaid={() => invalidateAll()}
/>
