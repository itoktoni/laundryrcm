<script>
	import { formatCurrency, formatDate } from '$lib/utils.js';
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import { onDestroy, tick } from 'svelte';
	import QrisModal from '$lib/components/ui/QrisModal.svelte';
	import PrintButton from '$lib/components/ui/PrintButton.svelte';

	let { data } = $props();
	let order = $derived(data.order);
	let items = $derived(data.items);
	let store = $derived(data.store || {});
	let user = $derived(data.user);
	let canDelete = $derived(user && (user.role === 'owner' || user.role === 'admin'));
	let showQris = $state(false);

	// Auto-open QRIS from WhatsApp payment link
	$effect(() => {
		if ($page.url.searchParams.get('bayar') === '1' && order.order_payment_status === 'unpaid') {
			showQris = true;
		}
	});

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
			}, 1000);
		}
	});
	onDestroy(() => clearInterval(timer));

	const statusFlow = ['pending', 'cuci', 'kering', 'setrika', 'packing', 'selesai', 'diambil'];
	const statusColors = { pending: 'bg-pending', cuci: 'bg-primary', kering: 'bg-kering', setrika: 'bg-setrika', packing: 'bg-packing', selesai: 'bg-success', diambil: 'bg-secondary' };
	const statusLabels = { pending: 'Antre', cuci: 'Cuci', kering: 'Kering', setrika: 'Setrika', packing: 'Packing', selesai: 'Selesai', diambil: 'Diambil' };

	function getNextStatus(current) {
		const idx = statusFlow.indexOf(current);
		return idx < statusFlow.length - 1 ? statusFlow[idx + 1] : null;
	}

	async function generateInvoiceImage() {
		try {
			const w = 480;
			const pad = 24;
			let y = 0;

			// Pre-calc QR
			let qrCanvas = null;
			if (order.order_payment_status !== 'paid') {
				const resp = await fetch(`/api/qris?amount=${order.order_total_price}&orderId=${order.order_id}`);
				const data = await resp.json();
				if (data.qris) {
					const QRCode = await import('qrcode');
					qrCanvas = document.createElement('canvas');
					await QRCode.toCanvas(qrCanvas, data.qris, { width: 200, margin: 2, color: { dark: '#000000', light: '#FFFFFF' } });
				}
			}

			// Measure text helper
			const tmpCanvas = document.createElement('canvas');
			const tmpCtx = tmpCanvas.getContext('2d');
			function measure(text, font) {
				tmpCtx.font = font;
				return tmpCtx.measureText(text).width;
			}
			function wrap(text, font, maxW) {
				const words = text.split(' ');
				const lines = [];
				let cur = '';
				for (const word of words) {
					const test = cur ? cur + ' ' + word : word;
					if (measure(test, font) > maxW && cur) { lines.push(cur); cur = word; }
					else cur = test;
				}
				if (cur) lines.push(cur);
				return lines;
			}

			// Calc height
			const bold = 'bold 14px Arial, sans-serif';
			const reg = '13px Arial, sans-serif';
			const sm = '11px Arial, sans-serif';
			const big = 'bold 20px Arial, sans-serif';
			const lineH = 20;
			const maxTextW = w - pad * 2;
			let h = pad;

			// Store name
			h += 24 + 6;
			// Store info
			if (store.store_address) h += lineH;
			if (store.store_phone) h += lineH;
			h += 12;
			// Nota line
			h += lineH + 4;
			// Date
			h += lineH + 12;
			// Customer
			h += lineH;
			h += lineH;
			if (order.customer_address) h += lineH;
			h += 16;
			// Separator
			h += 2 + 12;
			// Items
			for (const item of items) {
				h += lineH;
				h += lineH + 6;
			}
			h += 12;
			// Separator
			h += 2 + 8;
			// Subtotal
			h += lineH;
			if (order.order_discount_amount > 0) h += lineH;
			if (order.order_unique_code) h += lineH;
			// Total
			h += 8 + lineH + 8;
			// Status
			h += lineH + 8;
			// QR
			if (qrCanvas) { h += 200 + 16 + lineH; }
			// Notes
			if (order.order_notes) { h += 12 + lineH + wrap(order.order_notes, sm, maxTextW).length * 16; }
			// Footer
			h += 16 + lineH + pad;

			// Draw
			const canvas = document.createElement('canvas');
			canvas.width = w;
			canvas.height = h;
			const ctx = canvas.getContext('2d');

			// Background
			ctx.fillStyle = '#FFFFFF';
			ctx.fillRect(0, 0, w, h);

			// Border
			ctx.strokeStyle = '#E0E0E0';
			ctx.lineWidth = 1;
			ctx.strokeRect(0.5, 0.5, w - 1, h - 1);

			function drawText(text, x, yPos, font, color = '#212121', align = 'left') {
				ctx.font = font;
				ctx.fillStyle = color;
				ctx.textAlign = align;
				ctx.textBaseline = 'top';
				ctx.fillText(text, x, yPos);
			}

			function drawLine(yPos) {
				ctx.strokeStyle = '#E0E0E0';
				ctx.lineWidth = 1;
				ctx.beginPath();
				ctx.moveTo(pad, yPos);
				ctx.lineTo(w - pad, yPos);
				ctx.stroke();
			}

			y = pad;
			// Store name
			drawText(store.store_name || 'LaundryKu', w / 2, y, big, '#212121', 'center');
			y += 28;
			if (store.store_address) { drawText(store.store_address, w / 2, y, sm, '#757575', 'center'); y += lineH; }
			if (store.store_phone) { drawText('Telp: ' + store.store_phone, w / 2, y, sm, '#757575', 'center'); y += lineH; }
			y += 12;

			// Nota
			drawText('Nota #' + String(order.order_id).slice(0, 8).toUpperCase(), pad, y, bold);
			y += lineH + 4;
			drawText(formatDate(order.order_created_at), pad, y, sm, '#757575');
			y += lineH + 12;

			// Customer
			drawText(order.customer_name + (order.customer_vip ? ' ⭐ VIP' : ''), pad, y, bold);
			y += lineH;
			drawText(String(order.customer_phone), pad, y, reg, '#757575');
			y += lineH;
			if (order.customer_address) { drawText(order.customer_address, pad, y, sm, '#757575'); y += lineH; }
			y += 16;

			drawLine(y); y += 12;

			// Items
			for (const item of items) {
				drawText(item.product_name + ' ' + item.item_quantity + item.product_unit, pad, y, bold);
				drawText(formatCurrency(item.item_subtotal), w - pad, y, bold, '#212121', 'right');
				y += lineH;
				drawText(formatCurrency(item.item_price) + ' x ' + item.item_quantity, pad, y, sm, '#757575');
				y += lineH + 6;
			}
			y += 12;

			drawLine(y); y += 8;

			// Totals
			function row(label, value, color = '#212121', font = reg) {
				drawText(label, pad, y, font, '#757575');
				drawText(value, w - pad, y, font, color, 'right');
				y += lineH;
			}

			row('Subtotal', formatCurrency(order.order_subtotal));
			if (order.order_discount_amount > 0) row('Diskon' + (order.promo_name ? ' (' + order.promo_name + ')' : ''), '-' + formatCurrency(order.order_discount_amount), '#D32F2F');
			if (order.order_unique_code) row('Kode Unik', '+' + formatCurrency(order.order_paid_amount - order.order_total_price));
			y += 8;
			drawLine(y); y += 8;

			const totalLabel = order.order_unique_code ? 'Total Dibayar' : 'Total';
			const totalVal = formatCurrency(order.order_unique_code ? order.order_paid_amount : order.order_total_price);
			drawText(totalLabel, pad, y, bold);
			drawText(totalVal, w - pad, y, bold, '#1565C0', 'right');
			y += lineH + 8;

			// Status
			if (order.order_payment_status === 'paid') {
				drawText('Status: LUNAS', pad, y, bold, '#2E7D32');
				y += lineH;
				if (order.order_payment_code) {
					drawText('Kode Bayar: ' + order.order_payment_code, pad, y, sm, '#757575');
					y += lineH;
				}
			} else {
				drawText('Status: BELUM BAYAR', pad, y, bold, '#D32F2F');
				y += lineH;
			}
			y += 8;

			// QR Code
			if (qrCanvas) {
				const qrX = (w - 200) / 2;
				// White bg for QR
				ctx.fillStyle = '#FFFFFF';
				ctx.fillRect(qrX - 8, y, 216, 216);
				ctx.strokeStyle = '#E0E0E0';
				ctx.strokeRect(qrX - 8, y, 216, 216);
				ctx.drawImage(qrCanvas, qrX, y + 8, 200, 200);
				y += 216;
				drawText('Scan untuk membayar', w / 2, y, sm, '#757575', 'center');
				y += lineH + 8;
			}

			// Notes
			if (order.order_notes) {
				y += 8;
				drawText('Catatan: ' + order.order_notes, pad, y, sm, '#757575');
				y += lineH;
			}

			y += 16;
			drawText('Terima kasih 🙏', w / 2, y, reg, '#757575', 'center');

			return new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
		} catch (e) {
			console.error('Invoice image failed:', e);
			return null;
		}
	}

	async function generateQrBlob() {
		try {
			const resp = await fetch(`/api/qris?amount=${order.order_total_price}&orderId=${order.order_id}`);
			const data = await resp.json();
			if (!data.qris) return null;

			const QRCode = await import('qrcode');
			const canvas = document.createElement('canvas');
			await QRCode.toCanvas(canvas, data.qris, { width: 400, margin: 2, color: { dark: '#000000', light: '#FFFFFF' } });
			return new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
		} catch (e) {
			console.error('QR generate failed:', e);
			return null;
		}
	}

	async function shareInvoice() {
		const id = String(order.order_id).slice(0, 8);
		const [imageBlob, qrBlob] = await Promise.all([
			generateInvoiceImage(),
			order.order_payment_status !== 'paid' ? generateQrBlob() : Promise.resolve(null)
		]);

		const files = [];
		if (imageBlob) files.push(new File([imageBlob], `Nota-${id}.png`, { type: 'image/png' }));
		if (qrBlob) files.push(new File([qrBlob], `QRIS-${id}.png`, { type: 'image/png' }));

		if (files.length && navigator.share && navigator.canShare) {
			const shareData = { title: `Nota ${id}`, files };
			if (navigator.canShare(shareData)) {
				try {
					await navigator.share(shareData);
					return;
				} catch {}
			}
		}

		// Fallback: download images
		for (const file of files) {
			const url = URL.createObjectURL(file);
			const a = document.createElement('a');
			a.href = url;
			a.download = file.name;
			a.click();
			URL.revokeObjectURL(url);
		}
	}

	let nextStatus = $derived(getNextStatus(order.order_status));

	async function setStatus(status) {
		if (status === order.order_status) return;
		await fetch('?/updateStatus', {
			method: 'POST',
			body: new URLSearchParams({ status })
		});
		invalidateAll();
	}
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
		<div class="flex items-center gap-2">
			<button type="button" onclick={shareInvoice} class="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center active:scale-[0.95] transition-transform" title="Kirim Invoice ke WhatsApp">
				<span class="material-symbols-outlined text-[20px]">chat</span>
			</button>
			<PrintButton {order} {items} storeName={store.store_name || 'LaundryKu'} storeAddress={store.store_address || ''} storePhone={store.store_phone || ''} />
		</div>
	</div>

	<!-- Customer -->
	<div class="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant">
		<div class="flex items-center gap-3">
			<div class="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center text-on-primary-fixed font-bold text-headline-md">
				{order.customer_name.charAt(0)}
			</div>
			<div class="flex-1">
				<div class="flex items-center gap-2 flex-wrap">
					<h3 class="font-headline-md text-headline-md text-on-surface">{order.customer_name}</h3>
					{#if order.customer_vip}
						<span class="px-2 py-0.5 bg-warning text-on-surface text-[10px] font-bold rounded uppercase tracking-wider">VIP</span>
					{/if}
				</div>
				<p class="text-body-sm text-on-surface-variant">{order.customer_phone}</p>
				{#if order.customer_address}
					<p class="text-label-md text-on-surface-variant mt-1">{order.customer_address}</p>
				{/if}
				{#if order.customer_est_freq_days || order.customer_est_weight}
					<div class="flex items-center gap-3 mt-2 flex-wrap">
						{#if order.customer_est_freq_days}
							<div class="flex items-center gap-1">
								<span class="text-body-sm text-on-surface-variant">Freq:</span>
								<span class="text-body-sm font-semibold text-on-surface">
									{#if order.customer_est_freq_days == 7}1 minggu
									{:else if order.customer_est_freq_days == 14}2 minggu
									{:else if order.customer_est_freq_days == 3}3 hari
									{:else}{order.customer_est_freq_days} hari
									{/if}
								</span>
							</div>
						{/if}
						{#if order.customer_est_weight}
							<div class="flex items-center gap-1">
								<span class="text-body-sm text-on-surface-variant">Weight:</span>
								<span class="text-body-sm font-semibold text-on-surface">{order.customer_est_weight} kg</span>
							</div>
						{/if}
					</div>
				{/if}
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
					<span class="text-on-surface">+{formatCurrency(order.order_unique_code)}</span>
				</div>
			{/if}
			<div class="flex justify-between pt-2 border-t border-outline-variant">
				<span class="font-headline-md text-on-surface">{order.order_unique_code ? 'Total Dibayar' : 'Total'}</span>
				<span class="font-display text-display text-primary">{formatCurrency(order.order_unique_code ? order.order_paid_amount : order.order_total_price)}</span>
			</div>
			<div class="flex justify-between text-body-sm pt-1">
				<span class="text-on-surface-variant">Status</span>
				<span class="text-success font-label-md">{order.order_payment_status === 'paid' ? 'Lunas' : 'Belum Bayar'}</span>
			</div>
			{#if order.order_payment_code}
				<div class="flex justify-between text-body-sm pt-1">
					<span class="text-on-surface-variant">Kode Pembayaran</span>
					<span class="text-on-surface font-mono">{order.order_payment_code}</span>
				</div>
			{/if}
		</div>
	</div>

	<!-- Notes -->
	{#if order.order_notes || order.customer_notes}
		<div class="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant">
			<p class="font-label-md text-label-md text-on-surface-variant uppercase mb-2">Catatan</p>
			{#if order.order_notes}
				<p class="text-body-sm text-on-surface mb-2">Order: {order.order_notes}</p>
			{/if}
			{#if order.customer_notes}
				<p class="text-body-sm text-on-surface">Pelanggan: {order.customer_notes}</p>
			{/if}
		</div>
	{/if}

	<!-- Status Timeline -->
	<div class="bg-surface-container-low p-4 rounded-xl border border-outline-variant">
		<p class="font-label-md text-label-md text-on-surface-variant uppercase mb-4">Status Order</p>
		<div class="flex justify-between">
			{#each statusFlow as status, i}
				<button type="button" onclick={() => setStatus(status)} class="flex flex-col items-center gap-1 cursor-pointer" title="Set status ke {status}">
					<div class="w-8 h-8 rounded-full flex items-center justify-center {order.order_status === status ? 'bg-primary text-on-primary' : statusFlow.indexOf(status) < statusFlow.indexOf(order.order_status) ? 'bg-success text-on-primary' : 'bg-outline-variant text-on-surface-variant'}">
						{#if statusFlow.indexOf(status) < statusFlow.indexOf(order.order_status)}
							<span class="material-symbols-outlined text-[16px]">check</span>
						{:else}
							<span class="text-[10px] font-bold">{i + 1}</span>
						{/if}
					</div>
					<span class="text-[9px] {order.order_status === status ? 'text-primary font-bold' : 'text-on-surface-variant'}">{status}</span>
				</button>
			{/each}
		</div>
	</div>

	<!-- Actions -->
	<div class="flex gap-3">
		{#if canDelete}
			<form method="POST" action="?/deleteOrder" use:enhance class="flex-1" onsubmit={() => confirm(`Yakin ingin menghapus order #${order.order_id.slice(0, 8).toUpperCase()}? Data yang sudah dihapus tidak bisa dikembalikan.`)}>
				<button type="submit" class="w-full h-12 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-label-md active:scale-[0.98] transition-transform flex items-center justify-center gap-2">
					<span class="material-symbols-outlined text-[18px]">delete</span>
					Hapus
				</button>
			</form>
		{/if}
		{#if nextStatus}
			<form method="POST" action="?/updateStatus" use:enhance class="flex-1">
				<input type="hidden" name="status" value={nextStatus} />
				<button type="submit" class="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-label-md active:scale-[0.98] transition-transform flex items-center justify-center gap-2">
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
