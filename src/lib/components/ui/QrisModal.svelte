<script>
	import { formatCurrency } from '$lib/utils.js';
	import { tick, onDestroy } from 'svelte';
	import { enhance } from '$app/forms';

	let { open = $bindable(false), amount = 0, orderId = null, onPaid, onConfirm } = $props();

	let qrisData = $state(null);
	let loading = $state(false);
	let canvasEl = $state(null);
	let paid = $state(false);

	function handlePaid() {
		stopTimers();
		paid = true;
		setTimeout(() => {
			open = false;
			if (onPaid) onPaid();
		}, 1800);
	}

	const EXPIRE_SECONDS = 300;
	let secondsLeft = $state(EXPIRE_SECONDS);
	let pollTimer;
	let countdownTimer;

	let timeLabel = $derived(
		`${String(Math.floor(secondsLeft / 60)).padStart(2, '0')}:${String(secondsLeft % 60).padStart(2, '0')}`
	);

	function stopTimers() {
		clearInterval(pollTimer);
		clearInterval(countdownTimer);
	}

	function startTimers() {
		stopTimers();
		secondsLeft = EXPIRE_SECONDS;

		countdownTimer = setInterval(() => {
			secondsLeft -= 1;
			if (secondsLeft <= 0) stopTimers();
		}, 1000);

		if (orderId) {
			pollTimer = setInterval(async () => {
				try {
					const res = await fetch(`/orders/${orderId}/status`);
					if (!res.ok) return;
					const s = await res.json();
					if (s.paid) {
						handlePaid();
					}
				} catch {}
			}, 1000);
		}
	}

	onDestroy(stopTimers);

	async function fetchQris() {
		if (!amount) return;
		loading = true;
		qrisData = null;
		try {
			const resp = await fetch(`/api/qris?amount=${amount}${orderId ? `&orderId=${orderId}` : ''}`);
			const data = await resp.json();
			qrisData = data;
			loading = false;

			if (data.qris) {
				await tick();
				await generateQR(data.qris);
			}
		} catch (e) {
			console.error('Failed to fetch QRIS:', e);
			loading = false;
		}
	}

	async function generateQR(text) {
		try {
			const QRCode = await import('qrcode');
			if (canvasEl) {
				await QRCode.toCanvas(canvasEl, text, {
					width: 256,
					margin: 2,
					color: { dark: '#000000', light: '#FFFFFF' }
				});
			}
		} catch (e) {
			console.error('Failed to generate QR:', e);
		}
	}

	$effect(() => {
		if (open && amount > 0) {
			paid = false;
			fetchQris();
			startTimers();
		}
		if (!open) {
			qrisData = null;
			paid = false;
			stopTimers();
		}
	});
</script>

{#if open}
	<!-- Backdrop -->
	<div class="fixed inset-0 z-[60] bg-black/50" onclick={() => open = false}></div>

	<!-- Modal -->
	<div class="fixed bottom-0 left-0 right-0 z-[60] bg-surface rounded-t-2xl shadow-lg animate-slide-up" style="margin-bottom: -10px;">
		<!-- Handle -->
		<div class="flex justify-center pt-3 pb-2">
			<div class="w-10 h-1 bg-outline-variant rounded-full"></div>
		</div>

		{#if paid}
			<div class="px-container-margin pb-10 pt-6 flex flex-col items-center text-center">
				<div class="w-20 h-20 rounded-full bg-success/15 flex items-center justify-center animate-pop">
					<span class="material-symbols-outlined text-[48px] text-success fill-icon">check_circle</span>
				</div>
				<h2 class="mt-4 font-headline-lg text-headline-lg text-on-surface">Pembayaran Berhasil</h2>
				<p class="mt-1 text-body-sm text-on-surface-variant">
					{formatCurrency(qrisData?.finalAmount ?? amount)} telah dibayar
				</p>
			</div>
		{:else}
		<div class="px-container-margin pb-8">
			<!-- Header -->
			<div class="flex items-center justify-between pb-4 border-b border-outline-variant">
				<h2 class="font-headline-md text-headline-md text-on-surface">Pembayaran QRIS</h2>
				<button type="button" onclick={() => open = false} class="w-8 h-8 rounded-full flex items-center justify-center hover:bg-surface-container-high active:scale-95 transition-transform">
					<span class="material-symbols-outlined text-on-surface-variant">close</span>
				</button>
			</div>

			<!-- QR Code -->
			<div class="flex flex-col items-center py-6 mt-8">
				{#if loading}
					<div class="w-48 h-48 flex items-center justify-center">
						<span class="material-symbols-outlined text-[48px] text-primary animate-spin">progress_activity</span>
					</div>
				{:else}
					<div class="w-40 h-40 bg-white border-2 border-outline-variant rounded-xl flex items-center justify-center p-2">
						<canvas bind:this={canvasEl}></canvas>
					</div>
				{/if}

				<div class="text-center">
					<p class="text-label-md text-on-surface-variant mt-12">Total Pembayaran</p>
					{#if qrisData}
						<p class="font-display text-display text-primary font-bold">{formatCurrency(qrisData.finalAmount)}</p>
						{#if qrisData.uniq !== 0}
							<p class="text-label-sm text-on-surface-variant mt-1">Kode unik: {qrisData.uniq > 0 ? '+' : ''}{formatCurrency(Math.abs(qrisData.uniq))}</p>
						{/if}
					{:else}
						<p class="font-display text-display text-primary font-bold">{formatCurrency(amount)}</p>
					{/if}
				</div>

				<p class="mt-2 text-label-md text-on-surface-variant text-center">Scan QRIS di atas menggunakan aplikasi pembayaran</p>

				<!-- Timer -->
				<div class="mt-4 flex items-center gap-2 {secondsLeft <= 30 ? 'text-error' : 'text-on-surface-variant'}">
					<span class="material-symbols-outlined text-[18px]">timer</span>
					{#if secondsLeft > 0}
						<span class="font-headline-md text-headline-md tabular-nums">{timeLabel}</span>
					{:else}
						<span class="font-label-md text-label-md">Waktu habis, buat ulang pembayaran</span>
					{/if}
				</div>

				{#if orderId}
					<div class="mt-2 flex items-center gap-1 text-label-sm text-on-surface-variant">
						<span class="material-symbols-outlined text-[14px] animate-spin">progress_activity</span>
						Menunggu pembayaran otomatis...
					</div>
				{/if}
			</div>

			<!-- Actions -->
			<div class="flex gap-3">
				<button type="button" onclick={() => open = false} class="flex-1 h-12 bg-surface-container-high text-on-surface rounded-xl font-bold text-label-md active:scale-[0.98] transition-transform">
					Batal
				</button>
			{#if orderId}
				<form
					method="POST"
					action={`/orders/${orderId}?/markPaid`}
					use:enhance={() => {
						return async ({ result }) => {
							if (result.type === 'success') handlePaid();
						};
					}}
					class="flex-1"
				>
					<input type="hidden" name="paid_amount" value={qrisData?.finalAmount ?? amount} />
					<input type="hidden" name="unique_code" value={qrisData?.uniq ?? ''} />
					<button type="submit" class="w-full h-12 bg-success text-on-primary rounded-xl font-bold text-label-md active:scale-[0.98] transition-transform flex items-center justify-center gap-2">
						<span class="material-symbols-outlined text-[18px]">check_circle</span>
						Sudah Bayar
					</button>
				</form>
				<form
					method="POST"
					action={`/orders/${orderId}?/markPaid`}
					use:enhance={() => {
						return async ({ result }) => {
							if (result.type === 'success') handlePaid();
						};
					}}
					class="flex-1"
				>
					<input type="hidden" name="paid_amount" value={amount} />
					<input type="hidden" name="unique_code" value="" />
					<button type="submit" class="w-full h-12 bg-primary text-on-primary rounded-xl font-bold text-label-md active:scale-[0.98] transition-transform flex items-center justify-center gap-2">
						<span class="material-symbols-outlined text-[18px]">payments</span>
						Bayar Cash
					</button>
				</form>
			{:else}
					<button type="button" onclick={() => { open = false; if (onConfirm) onConfirm(); }} class="flex-1 h-12 bg-success text-on-primary rounded-xl font-bold text-label-md active:scale-[0.98] transition-transform flex items-center justify-center gap-2">
						<span class="material-symbols-outlined text-[18px]">check_circle</span>
						Sudah Bayar
					</button>
				{/if}
			</div>
		</div>
		{/if}
	</div>
{/if}

<style>
	@keyframes slide-up {
		from { transform: translateY(100%); }
		to { transform: translateY(0); }
	}
	.animate-slide-up {
		animation: slide-up 0.3s ease-out;
	}
	@keyframes pop {
		0% { transform: scale(0.6); opacity: 0; }
		60% { transform: scale(1.1); opacity: 1; }
		100% { transform: scale(1); }
	}
	.animate-pop {
		animation: pop 0.4s ease-out;
	}
</style>
