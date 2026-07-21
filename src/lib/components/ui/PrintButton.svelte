<script>
	import { onMount, onDestroy } from 'svelte';
	import { connectPrinter, disconnectPrinter, printReceipt, printWorkOrder, printTest, getPrinterState, subscribe, BluetoothPrinter } from '$lib/stores/printer.js';

	let {
		order = null,
		items = [],
		storeName = 'LaundryKu',
		storeAddress = '',
		storePhone = '',
		variant = 'icon' // 'icon' | 'full'
	} = $props();

	let printerState = $state(getPrinterState());
	let showMenu = $state(false);
	let showConnectDialog = $state(false);
	let statusTimeout = $state(null);
	let statusMessage = $state('');
	let statusType = $state(''); // 'success' | 'error'

	let unsubscribe;

	onMount(() => {
		unsubscribe = subscribe((state) => {
			printerState = state;
		});
	});

	onDestroy(() => {
		if (unsubscribe) unsubscribe();
		clearTimeout(statusTimeout);
	});

	function setStatus(msg, type) {
		statusMessage = msg;
		statusType = type;
		clearTimeout(statusTimeout);
		statusTimeout = setTimeout(() => {
			statusMessage = '';
			statusType = '';
		}, 3000);
	}

	async function doConnect() {
		const ok = await connectPrinter();
		if (ok) {
			setStatus(`Terhubung ke ${printerState.deviceName}`, 'success');
		} else {
			setStatus(printerState.error || 'Gagal terhubung', 'error');
		}
		showConnectDialog = false;
	}

	function handleDisconnect() {
		disconnectPrinter();
		setStatus('Printer terputus', 'success');
	}

	async function handlePrintReceipt() {
		if (!order) return;

		if (!printerState.connected) {
			showConnectDialog = true;
			return;
		}
		showMenu = false;

		const ok = await printReceipt(order, items, {
			storeName,
			storeAddress,
			storePhone,
			copies: 1
		});

		if (ok) {
			setStatus('Nota berhasil dicetak', 'success');
		} else {
			setStatus(getPrinterState().error || 'Gagal mencetak', 'error');
		}
	}

	async function handlePrintWorkOrder() {
		if (!order) return;

		if (!printerState.connected) {
			showConnectDialog = true;
			return;
		}
		showMenu = false;

		const ok = await printWorkOrder(order, items);
		if (ok) {
			setStatus('Order kerja berhasil dicetak', 'success');
		} else {
			setStatus(getPrinterState().error || 'Gagal mencetak', 'error');
		}
	}

	async function handleTestPrint() {
		if (!printerState.connected) {
			showConnectDialog = true;
			return;
		}
		showMenu = false;

		const ok = await printTest();
		if (ok) {
			setStatus('Test print berhasil', 'success');
		} else {
			setStatus(getPrinterState().error || 'Gagal test print', 'error');
		}
	}
</script>

<!-- Status toast -->
{#if statusMessage}
	<div class="fixed top-4 left-1/2 -translate-x-1/2 z-[100] px-4 py-2 rounded-xl shadow-lg text-label-md font-bold text-on-primary {statusType === 'success' ? 'bg-success' : 'bg-error'} animate-slide-down">
		{statusMessage}
	</div>
{/if}

<!-- Connect Dialog -->
{#if showConnectDialog}
	<div class="fixed inset-0 z-[80] bg-black/50 flex items-center justify-center p-4" onclick={() => showConnectDialog = false}>
		<div class="bg-surface rounded-2xl p-6 w-full max-w-sm shadow-xl" onclick={(e) => e.stopPropagation()}>
			<div class="text-center">
				<div class="w-16 h-16 mx-auto rounded-full bg-primary/15 flex items-center justify-center mb-4">
					<span class="material-symbols-outlined text-[36px] text-primary">print</span>
				</div>
				<h3 class="font-headline-md text-headline-md text-on-surface mb-2">Printer Bluetooth</h3>
				<p class="text-body-sm text-on-surface-variant mb-6">
					{#if BluetoothPrinter.isSupported()}
						Pastikan printer thermal Bluetooth dalam mode pairing (biasanya tekan tombol power sampai lampu biru berkedip).
					{:else}
						Browser ini tidak mendukung Web Bluetooth. Gunakan Google Chrome atau Microsoft Edge terbaru di Android/Windows.
					{/if}
				</p>
			</div>

			<div class="space-y-3">
				<button
					type="button"
					onclick={doConnect}
					disabled={printerState.connecting || !BluetoothPrinter.isSupported()}
					class="w-full h-12 bg-primary text-on-primary rounded-xl font-bold text-label-md active:scale-[0.98] transition-transform flex items-center justify-center gap-2 disabled:opacity-50"
				>
					{#if printerState.connecting}
						<span class="material-symbols-outlined animate-spin">progress_activity</span>
						Menghubungkan...
					{:else}
						<span class="material-symbols-outlined">link</span>
						Cari & Hubungkan Printer
					{/if}
				</button>
				<button
					type="button"
					onclick={() => showConnectDialog = false}
					class="w-full h-12 bg-surface-container-high text-on-surface rounded-xl font-bold text-label-md active:scale-[0.98] transition-transform"
				>
					Batal
				</button>
			</div>
		</div>
	</div>
{/if}

<!-- Printer button variants -->
{#if variant === 'full'}
	<button
		type="button"
		onclick={() => {
			if (printerState.connected) {
				showMenu = !showMenu;
			} else {
				showConnectDialog = true;
			}
		}}
		class="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-label-md active:scale-[0.98] transition-transform flex items-center justify-center gap-2 relative"
	>
		<span class="material-symbols-outlined text-[18px]">print</span>
		{printerState.connected ? 'Cetak Nota' : 'Hubungkan & Cetak'}
		{#if printerState.connected}
			<span class="ml-1 text-[10px] opacity-70">▼</span>
		{/if}
	</button>
{:else if variant === 'icon'}
	<div class="relative">
		<button
			type="button"
			onclick={() => {
				if (printerState.connected) {
					showMenu = !showMenu;
				} else {
					showConnectDialog = true;
				}
			}}
			class="w-10 h-10 rounded-xl flex items-center justify-center {printerState.connected ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface-variant'} hover:brightness-95 active:scale-90 transition-all"
			title={printerState.connected ? 'Printer terhubung' : 'Hubungkan printer'}
		>
			<span class="material-symbols-outlined text-[20px]">print</span>
		</button>

		<!-- Dropdown menu when printer is connected -->
		{#if showMenu && printerState.connected}
			<div class="absolute right-0 top-full mt-1 z-50 w-56 bg-surface-container-low rounded-xl shadow-lg border border-outline-variant overflow-hidden" onclick={() => showMenu = false}>
				<div class="px-3 py-2 text-label-sm text-on-surface-variant border-b border-outline-variant flex items-center gap-2">
					<span class="w-2 h-2 rounded-full bg-success"></span>
					{printerState.deviceName}
				</div>

				<button type="button" onclick={handlePrintReceipt} class="w-full px-4 py-3 flex items-center gap-3 text-body-sm text-on-surface hover:bg-surface-container-high transition-colors text-left">
					<span class="material-symbols-outlined text-[18px] text-primary">receipt_long</span>
					Cetak Nota
				</button>

				<button type="button" onclick={handlePrintWorkOrder} class="w-full px-4 py-3 flex items-center gap-3 text-body-sm text-on-surface hover:bg-surface-container-high transition-colors text-left">
					<span class="material-symbols-outlined text-[18px] text-kering">assignment</span>
					Cetak Order Kerja
				</button>

				<button type="button" onclick={handleTestPrint} class="w-full px-4 py-3 flex items-center gap-3 text-body-sm text-on-surface hover:bg-surface-container-high transition-colors text-left">
					<span class="material-symbols-outlined text-[18px] text-on-surface-variant">check</span>
					Test Print
				</button>

				<div class="border-t border-outline-variant">
					<button type="button" onclick={handleDisconnect} class="w-full px-4 py-3 flex items-center gap-3 text-body-sm text-error hover:bg-surface-container-high transition-colors text-left">
						<span class="material-symbols-outlined text-[18px]">link_off</span>
						Putuskan Koneksi
					</button>
				</div>
			</div>
		{/if}
	</div>
{/if}

<style>
	@keyframes slide-down {
		from { transform: translate(-50%, -100%); opacity: 0; }
		to { transform: translate(-50%, 0); opacity: 1; }
	}
	.animate-slide-down {
		animation: slide-down 0.3s ease-out;
	}
</style>