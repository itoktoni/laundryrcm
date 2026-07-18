<script>
	import { formatCurrency } from '$lib/utils.js';
	import { enhance } from '$app/forms';
	import { invalidateAll, goto } from '$app/navigation';
	import SearchableSelect from '$lib/components/ui/SearchableSelect.svelte';
	import BottomSheet from '$lib/components/ui/BottomSheet.svelte';
	import QrisModal from '$lib/components/ui/QrisModal.svelte';

	let { data, form } = $props();

	const defaultCustomer = data.customers.find(
		(c) => c.customer_id === 'cust-walk-in' || c.customer_name === 'Walk Customer'
	);

	let customerId = $state(defaultCustomer?.customer_id ?? '');
	let notes = $state('');
	let items = $state([]);
	let showNewCustomer = $state(false);
	let showQris = $state(false);
	let paymentStatus = $state('unpaid');
	let pendingOrderId = $state(null);
	let creatingPending = $state(false);
	let newCustomerName = $state('');
	let newCustomerPhone = $state('');
	let newCustomerAddress = $state('');
	let activeCategory = $state('all');
	let searchQuery = $state('');
	let promoCode = $state('');
	let promoApplied = $state(null);
	let promoError = $state('');

	let subtotal = $derived(items.reduce((sum, i) => sum + i.subtotal, 0));

	let discount = $derived.by(() => {
		if (promoApplied) {
			if (promoApplied.type === 'percent') {
				return Math.round(subtotal * (promoApplied.value / 100));
			} else if (promoApplied.type === 'nominal') {
				return promoApplied.value;
			}
		}
		return 0;
	});

	let total = $derived(subtotal - discount);

	let filteredProducts = $derived(
		data.products.filter(p => {
			const matchCategory = activeCategory === 'all' || p.category_id === activeCategory;
			const matchSearch = !searchQuery || p.product_name.toLowerCase().includes(searchQuery.toLowerCase());
			return matchCategory && matchSearch;
		})
	);

	function applyPromo() {
		promoError = '';
		promoApplied = null;

		if (!promoCode.trim()) return;

		const promo = data.promotions.find(p => p.promo_code?.toLowerCase() === promoCode.trim().toLowerCase());
		if (!promo) {
			promoError = 'Kode promo tidak ditemukan';
			return;
		}
		if (promo.promo_min_order && subtotal < promo.promo_min_order) {
			promoError = `Min. order ${formatCurrency(promo.promo_min_order)}`;
			return;
		}
		promoApplied = { id: promo.promo_id, type: promo.promo_type, value: promo.promo_value, name: promo.promo_name };
	}

	function removePromo() {
		promoCode = '';
		promoApplied = null;
		promoError = '';
	}

	function addProduct(productId) {
		const p = data.products.find(pr => pr.product_id === productId);
		if (!p) return;

		const existing = items.find(i => i.productId === productId);
		if (existing) {
			existing.quantity += (p.product_unit === 'kg' ? 0.5 : 1);
			existing.subtotal = existing.quantity * existing.price;
			items = [...items];
		} else {
			items = [...items, {
				id: crypto.randomUUID(),
				productId: p.product_id,
				name: p.product_name,
				unit: p.product_unit,
				quantity: p.product_unit === 'kg' ? 1 : 1,
				price: p.product_price,
				subtotal: 1 * p.product_price
			}];
		}
	}

	function removeItem(index) {
		items = items.filter((_, i) => i !== index);
	}

	function updateQty(index, delta) {
		const item = items[index];
		const step = item.unit === 'kg' ? 0.5 : 1;
		item.quantity = Math.max(step, item.quantity + (delta * step));
		item.subtotal = item.quantity * item.price;
		items = [...items];
	}

	function setQty(index, value) {
		const item = items[index];
		const n = parseFloat(String(value).replace(',', '.'));
		if (Number.isNaN(n) || n <= 0) return;
		const min = item.unit === 'kg' ? 0.1 : 1;
		item.quantity = Math.max(min, Math.round(n * 100) / 100);
		item.subtotal = item.quantity * item.price;
		items = [...items];
	}
</script>

<svelte:head>
	<title>Order Baru - LaundryKu</title>
</svelte:head>

<form
	method="POST"
	action="?/createOrder"
	use:enhance={({ action }) => {
		const isPending = action.search.includes('createPending');
		if (isPending) creatingPending = true;
		return async ({ result, update }) => {
			if (isPending) {
				creatingPending = false;
				if (result.type === 'success' && result.data?.orderId) {
					pendingOrderId = result.data.orderId;
					showQris = true;
				} else if (result.type === 'failure') {
					await update();
				}
				return;
			}
			await update();
		};
	}}
	class="space-y-stack-lg pb-32"
>
	<input type="hidden" name="customer_id" value={customerId} />
	<input type="hidden" name="notes" value={notes} />
	<input type="hidden" name="promo_code" value={promoCode} />
	<input type="hidden" name="promo_id" value={promoApplied?.id || ''} />
	<input type="hidden" name="items" value={JSON.stringify(items.map(i => ({productId: i.productId, quantity: i.quantity, price: i.price})))} />

	<!-- Customer Selection -->
	<section class="space-y-stack-sm">
		<label class="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Pelanggan</label>
		<div class="flex gap-2 items-start">
			<div class="flex-1">
				<SearchableSelect
					options={data.customers.map(c => ({ value: c.customer_id, label: `${c.customer_name} (${c.customer_phone})` }))}
					bind:value={customerId}
					placeholder="Cari & pilih pelanggan..."
				/>
			</div>
			<button type="button" onclick={() => showNewCustomer = true} class="w-touch-target h-touch-target rounded-lg bg-primary text-on-primary flex items-center justify-center active:scale-95 transition-transform flex-shrink-0">
				<span class="material-symbols-outlined">add</span>
			</button>
		</div>
	</section>

	<!-- Add Customer BottomSheet -->
	<BottomSheet bind:open={showNewCustomer} title="Pelanggan Baru">
		<form method="POST" action="?/createCustomer" use:enhance={() => {
			return async ({ result }) => {
				if (result.type === 'success' && result.data?.newCustomerId) {
					await invalidateAll();
					customerId = result.data.newCustomerId;
					showNewCustomer = false;
					newCustomerName = '';
					newCustomerPhone = '';
					newCustomerAddress = '';
				}
			};
		}} class="space-y-3">
			<div>
				<label class="font-label-md text-label-md text-on-surface">Nama</label>
				<input name="customer_name" bind:value={newCustomerName} placeholder="Nama pelanggan" required class="w-full h-12 px-4 bg-surface-container-lowest border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary text-body-md mt-1" />
			</div>
			<div>
				<label class="font-label-md text-label-md text-on-surface">No. HP</label>
				<input name="customer_phone" bind:value={newCustomerPhone} placeholder="08xxxxxxxxxx" required class="w-full h-12 px-4 bg-surface-container-lowest border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary text-body-md mt-1" />
			</div>
			<div>
				<label class="font-label-md text-label-md text-on-surface">Alamat <span class="text-on-surface-variant">(opsional)</span></label>
				<input name="customer_address" bind:value={newCustomerAddress} placeholder="Alamat pelanggan" class="w-full h-12 px-4 bg-surface-container-lowest border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary text-body-md mt-1" />
			</div>
			<div class="flex gap-3 pt-2">
				<button type="button" onclick={() => showNewCustomer = false} class="flex-1 h-12 bg-surface-container-high text-on-surface rounded-xl font-bold text-label-md active:scale-[0.98] transition-transform">
					Batal
				</button>
				<button type="submit" class="flex-1 h-12 bg-primary text-on-primary rounded-xl font-bold text-label-md active:scale-[0.98] transition-transform">
					Simpan
				</button>
			</div>
		</form>
	</BottomSheet>

	<!-- Product Selection -->
	<section class="bg-surface-container-low p-4 rounded-xl border border-outline-variant space-y-stack-md">
		<label class="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Pilih Produk & Layanan</label>

		<div class="flex gap-2 overflow-x-auto hide-scrollbar pb-2 mt-2">
			<button type="button" onclick={() => activeCategory = 'all'} class="flex-shrink-0 px-4 py-1.5 {activeCategory === 'all' ? 'bg-primary text-on-primary' : 'border border-outline-variant text-secondary'} rounded-full text-label-md font-label-md active:scale-95 transition-transform">
				Semua
			</button>
			{#each data.categories as cat}
				<button type="button" onclick={() => activeCategory = cat.category_id} class="flex-shrink-0 px-4 py-1.5 {activeCategory === cat.category_id ? 'bg-primary text-on-primary' : 'border border-outline-variant text-secondary'} rounded-full text-label-md font-label-md active:scale-95 transition-transform">
					{cat.category_name}
				</button>
			{/each}
		</div>

		<div class="relative">
			<span class="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-[20px]">search</span>
			<input bind:value={searchQuery} class="w-full pl-10 pr-4 h-10 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary bg-surface-container-lowest outline-none transition-all font-body-sm text-body-sm" placeholder="Cari produk..." type="text" />
		</div>

		<div class="grid grid-cols-2 gap-2">
			{#each filteredProducts as p}
				<button type="button" onclick={() => addProduct(p.product_id)} class="cursor-pointer block active:scale-95 transition-transform">
					<div class="flex flex-col items-center text-center p-3 border border-outline-variant rounded-lg bg-surface-container-lowest transition-all h-full justify-center hover:bg-secondary-container hover:border-primary">
						<span class="text-label-md font-bold text-on-surface leading-tight">{p.product_name}</span>
						<span class="text-[10px] text-secondary">{formatCurrency(p.product_price)}/{p.product_unit}</span>
					</div>
				</button>
			{/each}
		</div>
	</section>

	<!-- Order Items -->
	{#if items.length > 0}
		<section class="space-y-stack-sm">
			<label class="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Order Items</label>
			{#each items as item, i}
				<div class="p-3 bg-surface-container-lowest rounded-xl border border-outline-variant">
					<div class="flex items-center justify-between gap-2 mb-2">
						<p class="text-sm font-semibold text-on-surface min-w-0 truncate">
							{item.name} <span class="font-normal text-on-surface-variant">- {formatCurrency(item.price)}/{item.unit}</span>
						</p>
						<button type="button" onclick={() => removeItem(i)} class="w-7 h-7 shrink-0 rounded-full bg-error-container flex items-center justify-center" aria-label="Hapus">
							<span class="material-symbols-outlined text-error text-[16px]">close</span>
						</button>
					</div>
					<div class="flex items-center justify-between gap-2">
						<div class="flex items-center gap-1.5">
							<button type="button" onclick={() => updateQty(i, -1)} class="w-8 h-8 rounded-full bg-outline-variant flex items-center justify-center" aria-label="Kurangi">
								<span class="material-symbols-outlined text-[18px]">remove</span>
							</button>
							<input
								type="number"
								inputmode="decimal"
								step={item.unit === 'kg' ? '0.1' : '1'}
								min={item.unit === 'kg' ? '0.1' : '1'}
								value={item.quantity}
								oninput={(e) => setQty(i, e.currentTarget.value)}
								class="w-20 h-8 text-center text-sm font-semibold text-on-surface bg-surface-container-low border border-outline-variant rounded-lg"
							/>
							<button type="button" onclick={() => updateQty(i, 1)} class="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center" aria-label="Tambah">
								<span class="material-symbols-outlined text-[18px]">add</span>
							</button>
						</div>
						<span class="text-sm font-bold text-primary whitespace-nowrap">{formatCurrency(item.subtotal)}</span>
					</div>
				</div>
			{/each}
		</section>
	{/if}

	<!-- Promo Code -->
	<section class="space-y-2">
		<label class="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Promo</label>
		{#if promoApplied}
			<div class="flex items-center justify-between p-3 bg-success/10 border border-success rounded-lg">
				<div class="flex items-center gap-2">
					<span class="material-symbols-outlined text-success text-[20px]">check_circle</span>
					<div>
						<p class="font-body-md text-success font-semibold">{promoApplied.name}</p>
						<p class="text-label-md text-success">-{promoApplied.type === 'percent' ? promoApplied.value + '%' : formatCurrency(promoApplied.value)}</p>
					</div>
				</div>
				<button type="button" onclick={removePromo} class="text-error font-label-md">Hapus</button>
			</div>
		{:else}
			<div class="flex gap-2">
				<div class="relative flex-1">
					<span class="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-primary text-[20px]">sell</span>
					<input bind:value={promoCode} class="w-full pl-10 pr-4 h-11 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary bg-surface-container-lowest outline-none text-body-md" placeholder="Kode promo..." type="text" />
				</div>
				<button type="button" onclick={applyPromo} class="px-4 h-11 bg-primary text-on-primary rounded-lg font-bold text-label-md active:scale-[0.98] transition-transform">PAKAI</button>
			</div>
			{#if promoError}
				<p class="text-label-md text-error">{promoError}</p>
			{/if}
			{#if data.promotions.length > 0}
				<div class="flex flex-wrap gap-2">
					{#each data.promotions.filter(p => p.promo_code) as promo}
						<button type="button" onclick={() => { promoCode = promo.promo_code; applyPromo(); }} class="px-3 py-1 border border-outline-variant rounded-full text-label-md text-secondary hover:bg-secondary-container active:scale-95 transition-transform">
							{promo.promo_code}
						</button>
					{/each}
				</div>
			{/if}
		{/if}
	</section>

	<!-- Summary -->
	<section class="bg-surface-container-low p-4 rounded-xl border border-outline-variant space-y-3">
		<div class="flex justify-between text-body-sm">
			<span class="text-on-surface-variant">Subtotal</span>
			<span class="font-medium text-on-surface">{formatCurrency(subtotal)}</span>
		</div>
		{#if discount > 0}
			<div class="flex justify-between text-body-sm">
				<span class="text-success flex items-center gap-1">
					<span class="material-symbols-outlined text-[16px]">sell</span>
					Diskon {promoApplied?.name || ''}
				</span>
				<span class="font-medium text-success">-{formatCurrency(discount)}</span>
			</div>
		{/if}
		{#if items.length > 0}
			<div class="flex justify-between text-label-md text-on-surface-variant">
				<span>{items.length} item</span>
				<span>{items.reduce((sum, i) => sum + (i.unit === 'kg' ? i.quantity : 0), 0)} kg · {items.filter(i => i.unit === 'pcs').length} pcs</span>
			</div>
		{/if}
		<div class="border-t border-outline-variant pt-3">
			<div class="flex justify-between items-end">
				<div>
					<p class="text-label-sm text-secondary uppercase tracking-wider">Total Tagihan</p>
					<p class="font-headline-lg text-headline-lg text-primary tracking-tight mt-1">{formatCurrency(total)}</p>
				</div>
				{#if paymentStatus === 'paid'}
					<span class="flex items-center gap-1 px-3 py-1 bg-success/10 text-success rounded-full text-label-md font-bold">
						<span class="material-symbols-outlined text-[16px]">check_circle</span>
						Lunas
					</span>
				{/if}
			</div>
		</div>
	</section>

	{#if form?.error}
		<div class="flex items-center gap-3 p-3 bg-error-container border border-error/20 rounded-lg">
			<span class="material-symbols-outlined text-error text-[20px]">error</span>
			<p class="text-body-sm text-error">{form.error}</p>
		</div>
	{/if}

	<!-- Action Buttons -->
	<input type="hidden" name="payment_status" value={paymentStatus} />

	<div class="grid grid-cols-2 gap-3">
		<button type="submit" class="h-14 bg-surface-container-high text-on-surface rounded-xl border border-outline-variant font-headline-md text-headline-md active:scale-[0.98] transition-transform flex items-center justify-center gap-2">
			<span class="material-symbols-outlined text-[20px]">save</span>
			Simpan
		</button>
		<button type="submit" formaction="?/createPending" disabled={creatingPending} class="h-14 bg-primary text-on-primary rounded-xl font-headline-md text-headline-md shadow-lg shadow-primary/25 active:scale-[0.98] transition-transform flex items-center justify-center gap-2 disabled:opacity-60">
			<span class="material-symbols-outlined text-[20px]">qr_code_2</span>
			{creatingPending ? 'Memproses...' : 'Bayar'}
		</button>
	</div>
</form>

<QrisModal
	bind:open={showQris}
	amount={total}
	orderId={pendingOrderId}
	onPaid={() => { if (pendingOrderId) goto(`/orders/${pendingOrderId}`); }}
/>

<style>
	.hide-scrollbar::-webkit-scrollbar { display: none; }
	.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
