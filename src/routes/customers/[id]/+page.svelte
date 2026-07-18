<script>
	import { formatCurrency, formatDate } from '$lib/utils.js';
	import { enhance } from '$app/forms';

	let { data, form } = $props();
	let customer = $derived(data.customer);
	let orders = $derived(data.orders);
	let totalSpent = $derived(data.totalSpent);
	let editing = $state(false);

	const statusColors = { pending: 'bg-pending', cuci: 'bg-primary', kering: 'bg-kering', setrika: 'bg-setrika', selesai: 'bg-success', diambil: 'bg-secondary' };
</script>

<svelte:head>
	<title>{customer.customer_name} - LaundryKu</title>
</svelte:head>

<div class="space-y-stack-lg">
	<!-- Profile -->
	<div class="flex items-center gap-4">
		<div class="w-16 h-16 rounded-full {customer.customer_vip ? 'bg-warning/20 text-warning' : 'bg-primary-fixed text-on-primary-fixed'} flex items-center justify-center font-bold text-display">
			{customer.customer_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
		</div>
		<div class="flex-1">
			<div class="flex items-center gap-2">
				<h1 class="font-headline-lg text-headline-lg text-on-surface">{customer.customer_name}</h1>
				{#if customer.customer_vip}
					<span class="px-2 py-0.5 bg-warning text-on-surface text-[10px] font-bold rounded uppercase tracking-wider">VIP</span>
				{/if}
			</div>
			<p class="text-body-sm text-on-surface-variant">{customer.customer_phone}</p>
			{#if customer.customer_address}
				<p class="text-label-md text-on-surface-variant">{customer.customer_address}</p>
			{/if}
		</div>
		<button onclick={() => (editing = !editing)} class="active:opacity-70" aria-label="Edit pelanggan">
			<span class="material-symbols-outlined text-on-surface-variant">{editing ? 'close' : 'edit'}</span>
		</button>
	</div>

	{#if editing}
		<form
			method="POST"
			action="?/updateCustomer"
			use:enhance={() =>
				({ update }) =>
					update().then(() => (editing = false))}
			class="space-y-stack-sm bg-surface-container-lowest p-4 rounded-xl border border-outline-variant"
		>
			{#if form?.error}
				<p class="text-body-sm text-error">{form.error}</p>
			{/if}
			<div>
				<label for="edit_name" class="text-label-md text-on-surface-variant">Nama</label>
				<input id="edit_name" name="customer_name" value={customer.customer_name} required class="w-full h-12 px-4 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary text-body-md" type="text" />
			</div>
			<div>
				<label for="edit_phone" class="text-label-md text-on-surface-variant">No. HP</label>
				<input id="edit_phone" name="customer_phone" value={customer.customer_phone} required class="w-full h-12 px-4 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary text-body-md" type="tel" />
			</div>
			<div>
				<label for="edit_address" class="text-label-md text-on-surface-variant">Alamat</label>
				<input id="edit_address" name="customer_address" value={customer.customer_address || ''} class="w-full h-12 px-4 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary text-body-md" type="text" />
			</div>
			<button type="submit" class="w-full h-12 bg-primary text-on-primary rounded-xl font-bold text-label-md active:scale-[0.98] transition-transform">Simpan Perubahan</button>
		</form>
	{/if}

	<!-- Stats -->
	<div class="grid grid-cols-2 gap-stack-sm">
		<div class="bg-surface-container-highest p-4 rounded-xl border border-outline-variant text-center">
			<p class="font-display text-display text-primary font-bold">{customer.customer_total_orders}</p>
			<p class="text-label-md text-on-surface-variant">Total Order</p>
		</div>
		<div class="bg-surface-container-highest p-4 rounded-xl border border-outline-variant text-center">
			<p class="font-display text-display text-success font-bold">{formatCurrency(totalSpent)}</p>
			<p class="text-label-md text-on-surface-variant">Total Belanja</p>
		</div>
	</div>

	<!-- Actions -->
	<form method="POST" action="?/toggleVip" use:enhance>
		<button type="submit" class="w-full h-12 {customer.customer_vip ? 'bg-surface-container-highest text-on-surface border border-outline-variant' : 'bg-warning text-on-surface'} rounded-xl font-bold text-label-md active:scale-[0.98] transition-transform">
			{customer.customer_vip ? 'Hapus VIP' : 'Jadikan VIP'}
		</button>
	</form>

	{#if form?.error}
		<p class="text-body-sm text-error text-center">{form.error}</p>
	{/if}

	<form
		method="POST"
		action="?/deleteCustomer"
		use:enhance={({ cancel }) => {
			if (!confirm('Hapus pelanggan ini?')) cancel();
		}}
	>
		<button type="submit" class="w-full h-12 bg-error-container text-error rounded-xl font-bold text-label-md active:scale-[0.98] transition-transform flex items-center justify-center gap-2">
			<span class="material-symbols-outlined">delete</span>
			Hapus Pelanggan
		</button>
	</form>

	<!-- Order History -->
	<div>
		<h2 class="font-label-md text-label-md text-on-surface font-bold uppercase tracking-wider mb-stack-sm">Riwayat Order</h2>
		{#if orders.length === 0}
			<p class="text-body-sm text-on-surface-variant text-center py-8">Belum ada order</p>
		{:else}
			<div class="space-y-3">
				{#each orders as order}
					<a href="/orders/{order.order_id}" class="block bg-surface-container-lowest p-4 rounded-xl border border-outline-variant active:scale-[0.98] transition-transform">
						<div class="flex justify-between items-center">
							<div>
								<p class="text-label-md text-on-surface-variant">{formatDate(order.order_created_at)}</p>
							</div>
							<div class="flex items-center gap-3">
								<span class="font-headline-md text-primary">{formatCurrency(order.order_total_price)}</span>
								<div class="w-2 h-2 rounded-full {statusColors[order.order_status]}"></div>
							</div>
						</div>
					</a>
				{/each}
			</div>
		{/if}
	</div>
</div>
