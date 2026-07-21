/**
 * Bluetooth Thermal Printer Module
 *
 * Connects to ESC/POS Bluetooth thermal printers via Web Bluetooth API
 * and prints formatted laundry receipts.
 *
 * Usage:
 *   import { BluetoothPrinter } from '$lib/client/bluetooth-printer.js';
 *   const printer = new BluetoothPrinter();
 *   await printer.connect();
 *   await printer.printReceipt(orderData);
 */

import EscPosEncoder from 'esc-pos-encoder';

const SERVICE_UUID = '000018f0-0000-1000-8000-00805f9b34fb';
const CHARACTERISTIC_UUID = '00002af1-0000-1000-8000-00805f9b34fb';

// Fallback UUIDs for common thermal printers
const COMMON_SERVICE_UUIDS = [
	'000018f0-0000-1000-8000-00805f9b34fb',
	'00001101-0000-1000-8000-00805f9b34fb', // SPP
	'49535343-fe7d-4ae5-8fa9-9fafd205e455', // Moko
	'0000180a-0000-1000-8000-00805f9b34fb', // Device Information
	'e7810a71-73ae-499d-8c15-faa9aef0c3f2', // Zjiang
	'0000ff00-0000-1000-8000-00805f9b34fb'
];

export class BluetoothPrinter {
	constructor() {
		this.device = null;
		this.server = null;
		this.service = null;
		this.characteristic = null;
		this.encoder = new EscPosEncoder();
	}

	/**
	 * Check if Web Bluetooth is supported
	 */
	static isSupported() {
		return navigator.bluetooth && typeof navigator.bluetooth.requestDevice === 'function';
	}

	/**
	 * Check if a printer is currently connected
	 */
	isConnected() {
		return this.device !== null && this.device.gatt && this.device.gatt.connected;
	}

	/**
	 * Connect to a Bluetooth thermal printer
	 * @param {Object} options - optional filter options
	 * @param {string} options.nameFilter - filter printer name (e.g. "58mm", "Printer")
	 * @returns {Promise<boolean>}
	 */
	async connect(options = {}) {
		if (!BluetoothPrinter.isSupported()) {
			throw new Error('Web Bluetooth tidak didukung di browser ini. Gunakan Chrome/Edge/Opera.');
		}

		try {
			const filters = COMMON_SERVICE_UUIDS.map(uuid => ({ services: [uuid] }));

			if (options.nameFilter) {
				filters.push({ name: options.nameFilter });
				filters.push({ namePrefix: options.nameFilter });
			}

			// Also accept any device with standard service filter
			filters.push({ services: ['000018f0-0000-1000-8000-00805f9b34fb'] });
			filters.push({ services: ['00001101-0000-1000-8000-00805f9b34fb'] });

			this.device = await navigator.bluetooth.requestDevice({
				filters,
				optionalServices: COMMON_SERVICE_UUIDS
			});

			// Handle disconnect
			this.device.addEventListener('gattserverdisconnected', () => {
				console.log('Printer disconnected');
				this.characteristic = null;
				this.service = null;
				this.server = null;
			});

			this.server = await this.device.gatt.connect();

			// Try to find the right service and characteristic
			await this._findServiceAndCharacteristic();

			return true;
		} catch (err) {
			if (err.name === 'NotFoundError') {
				throw new Error('Tidak ada printer Bluetooth yang ditemukan. Pastikan printer dalam mode pairing.');
			}
			throw err;
		}
	}

	/**
	 * Find the correct service and characteristic for printing
	 */
	async _findServiceAndCharacteristic() {
		for (const uuid of COMMON_SERVICE_UUIDS) {
			try {
				this.service = await this.server.getPrimaryService(uuid);
				const characteristics = await this.service.getCharacteristics();

				for (const char of characteristics) {
					const props = char.properties;
					if (props.write || props.writeWithoutResponse) {
						// Check if it can write without response (typical for printers)
						if (props.writeWithoutResponse) {
							this.characteristic = char;
							return;
						}
						// Fallback to write
						this.characteristic = char;
						return;
					}
				}
			} catch {
				continue;
			}
		}

		// Last resort: get all services and find any writable characteristic
		try {
			const services = await this.server.getPrimaryServices();
			for (const svc of services) {
				const characteristics = await svc.getCharacteristics();
				for (const char of characteristics) {
					const props = char.properties;
					if (props.write || props.writeWithoutResponse) {
						this.service = svc;
						this.characteristic = char;
						return;
					}
				}
			}
		} catch {}

		if (!this.characteristic) {
			throw new Error('Tidak dapat menemukan port cetak pada printer. Pastikan printer mendukung ESC/POS.');
		}
	}

	/**
	 * Disconnect from the printer
	 */
	disconnect() {
		if (this.device && this.device.gatt) {
			this.device.gatt.disconnect();
		}
		this.device = null;
		this.server = null;
		this.service = null;
		this.characteristic = null;
	}

	/**
	 * Send raw data to the printer
	 * @param {Uint8Array} data
	 */
	async sendData(data) {
		if (!this.isConnected() || !this.characteristic) {
			throw new Error('Printer tidak terhubung. Silakan sambungkan printer terlebih dahulu.');
		}

		const MTU = 512; // Max bytes per write
		for (let i = 0; i < data.length; i += MTU) {
			const chunk = data.slice(i, Math.min(i + MTU, data.length));
			try {
				if (this.characteristic.properties.writeWithoutResponse) {
					await this.characteristic.writeValueWithoutResponse(chunk);
				} else {
					await this.characteristic.writeValue(chunk);
				}
			} catch (err) {
				// Small delay between chunks
				await new Promise(r => setTimeout(r, 50));
				// Retry once
				if (this.characteristic.properties.writeWithoutResponse) {
					await this.characteristic.writeValueWithoutResponse(chunk);
				} else {
					await this.characteristic.writeValue(chunk);
				}
			}
		}
	}

	/**
	 * Print a test page
	 */
	async printTest() {
		const encoder = new EscPosEncoder();
		const data = encoder
			.initialize()
			.align('center')
			.size(2, 2)
			.text('PRINTER TEST')
			.size(1, 1)
			.text('LaundryKu')
			.newline()
			.text(new Date().toLocaleString('id-ID'))
			.newline()
			.text('================================')
			.newline()
			.line('Jika Anda melihat teks ini,')
			.line('printer berfungsi dengan baik!')
			.newline()
			.text('================================')
			.newline()
			.newline()
			.text('Terima kasih')
			.newline()
			.cut()
			.encode();

		await this.sendData(data);
	}

	/**
	 * Print a laundry order receipt / nota
	 * @param {Object} order - order data from the database
	 * @param {Array} items - order items
	 * @param {Object} options - additional options
	 * @param {string} options.storeName - store name
	 * @param {string} options.storeAddress - store address
	 * @param {string} options.storePhone - store phone
	 * @param {boolean} options.copies - number of copies (default 1)
	 */
	async printReceipt(order, items, options = {}) {
		const encoder = new EscPosEncoder();
		const storeName = options.storeName || 'LaundryKu';
		const storeAddress = options.storeAddress || '';
		const storePhone = options.storePhone || '';
		const copies = options.copies || 1;
		const orderDate = new Date(order.order_created_at).toLocaleString('id-ID', {
			day: 'numeric',
			month: 'long',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});

		// Build receipt data
		const receiptData = encoder
			.initialize()
			// Header
			.align('center')
			.size(2, 2)
			.text(storeName)
			.size(1, 1)
			.text(storeAddress)
			.text(`Telp: ${storePhone}`)
			.text('==============================')
			.newline()
			.size(1, 1)
			.text('NOTA LAUNDRY')
			.text('==============================')
			.newline()
			.align('left')
			.text(`No. Order  : #${order.order_id.slice(0, 8).toUpperCase()}`)
			.text(`Tanggal    : ${orderDate}`)
			.text(`Pelanggan  : ${order.customer_name}`)
			.text(`No. Telp   : ${order.customer_phone || '-'}`)
			.text('------------------------------')
			.newline();

		// Items table header
		receiptData
			.bold(true)
			.text(`${'Item'.padEnd(20)} ${'Qty'.padStart(4)} ${'Harga'.padStart(8)}`)
			.bold(false)
			.text('-'.repeat(36));

		// Items
		for (const item of items) {
			const name = item.product_name.length > 18
				? item.product_name.substring(0, 17) + '.'
				: item.product_name;
			const qty = item.item_quantity;
			const price = Math.round(item.item_price);
			receiptData.text(
				`${name.padEnd(20)} ${qty.toString().padStart(4)} ${price.toLocaleString('id-ID').padStart(8)}`
			);
		}

		// Totals
		receiptData
			.text('-'.repeat(36))
			.bold(true)
			.text(`Subtotal     : Rp ${Math.round(order.order_subtotal).toLocaleString('id-ID')}`)
			.bold(false);

		if (order.order_discount_amount > 0) {
			receiptData
				.text(`Diskon       : -Rp ${Math.round(order.order_discount_amount).toLocaleString('id-ID')}`);
		}

		if (order.order_unique_code && Number(order.order_unique_code) > 0) {
			receiptData
				.text(`Kode Unik    : +${Number(order.order_unique_code).toLocaleString('id-ID')}`);
		}

		receiptData
			.text('==============================')
			.bold(true)
			.size(1, 1)
			.align('center')
			.text(`TOTAL: Rp ${Math.round(order.order_paid_amount || order.order_total_price).toLocaleString('id-ID')}`)
			.bold(false)
			.size(1, 1)
			.newline();

		// Payment status
		const paymentStatus = order.order_payment_status === 'paid' ? 'LUNAS' : 'BELUM BAYAR';
		receiptData
			.align('center')
			.text(`Status: ${paymentStatus}`)
			.text('==============================')
			.newline();

		// Order status timeline
		const statusLabels = {
			pending: 'Antre',
			cuci: 'Cuci',
			kering: 'Kering',
			setrika: 'Setrika',
			selesai: 'Selesai',
			diambil: 'Diambil'
		};
		const currentStatus = statusLabels[order.order_status] || order.order_status;
		receiptData
			.text(`Status Order: ${currentStatus}`)
			.newline();

		// Notes
		if (order.order_notes) {
			receiptData
				.text(`Catatan: ${order.order_notes}`)
				.newline();
		}

		// Footer
		receiptData
			.text('==============================')
			.align('center')
			.text('Terima kasih telah menggunakan')
			.text('jasa laundry kami')
			.newline()
			.text('Barang yang sudah dicuci')
			.text('tidak dapat dikembalikan')
			.newline()
			.text('==============================')
			.newline()
			.newline()
			.text('Dicetak: ' + new Date().toLocaleString('id-ID'))
			.newline()
			.cut()
			.encode();

		// Print copies
		for (let i = 0; i < copies; i++) {
			if (copies > 1) {
				// For multiple copies, re-encode
				const copyData = encoder
					.initialize()
					.align('center')
					.size(2, 2)
					.text(storeName)
					.size(1, 1)
					.text(storeAddress)
					.text(`Telp: ${storePhone}`)
					.text('==============================')
					.newline()
					.size(1, 1)
					.text('NOTA LAUNDRY')
					.text('==============================')
					.newline()
					.align('left')
					.text(`No. Order  : #${order.order_id.slice(0, 8).toUpperCase()}`)
					.text(`Tanggal    : ${orderDate}`)
					.text(`Pelanggan  : ${order.customer_name}`)
					.text(`No. Telp   : ${order.customer_phone || '-'}`)
					.text('------------------------------')
					.newline()
					.bold(true)
					.text(`${'Item'.padEnd(20)} ${'Qty'.padStart(4)} ${'Harga'.padStart(8)}`)
					.bold(false)
					.text('-'.repeat(36));

				for (const item of items) {
					const name = item.product_name.length > 18
						? item.product_name.substring(0, 17) + '.'
						: item.product_name;
					copyData.text(
						`${name.padEnd(20)} ${item.item_quantity.toString().padStart(4)} ${Math.round(item.item_price).toLocaleString('id-ID').padStart(8)}`
					);
				}

				copyData
					.text('-'.repeat(36))
					.bold(true)
					.text(`Subtotal     : Rp ${Math.round(order.order_subtotal).toLocaleString('id-ID')}`)
					.bold(false);

				if (order.order_discount_amount > 0) {
					copyData.text(`Diskon       : -Rp ${Math.round(order.order_discount_amount).toLocaleString('id-ID')}`);
				}

				copyData
					.text('==============================')
					.bold(true)
					.align('center')
					.text(`TOTAL: Rp ${Math.round(order.order_paid_amount || order.order_total_price).toLocaleString('id-ID')}`)
					.bold(false)
					.size(1, 1)
					.newline()
					.align('center')
					.text(`Status: ${paymentStatus}`)
					.text('==============================')
					.newline()
					.text(`Status Order: ${currentStatus}`)
					.newline()
					.text('==============================')
					.align('center')
					.text('Terima kasih')
					.newline()
					.newline()
					.cut()
					.encode();
				await this.sendData(copyData);
			}
		}

		// Send first copy
		await this.sendData(receiptData);
	}

	/**
	 * Print a simplified order summary (for kitchen/workshop)
	 * @param {Object} order
	 * @param {Array} items
	 */
	async printWorkOrder(order, items) {
		const encoder = new EscPosEncoder();
		const orderDate = new Date(order.order_created_at).toLocaleString('id-ID', {
			day: 'numeric',
			month: 'short',
			hour: '2-digit',
			minute: '2-digit'
		});

		const data = encoder
			.initialize()
			.align('center')
			.size(1, 1)
			.text('=== ORDER KERJA ===')
			.text('==============================')
			.newline()
			.align('left')
			.size(1, 1)
			.text(`Order: #${order.order_id.slice(0, 8).toUpperCase()}`)
			.text(`Tgl: ${orderDate}`)
			.text(`Pelanggan: ${order.customer_name}`)
			.text('------------------------------')
			.newline()
			.bold(true)
			.text(`${'Item'.padEnd(20)} ${'Qty'.padStart(4)}`)
			.bold(false)
			.text('-'.repeat(26));

		for (const item of items) {
			const name = item.product_name.length > 18
				? item.product_name.substring(0, 17) + '.'
				: item.product_name;
			data.text(
				`${name.padEnd(20)} ${item.item_quantity.toString().padStart(4)}`
			);
		}

		const statusLabels = {
			pending: 'Antre',
			cuci: 'Cuci',
			kering: 'Kering',
			setrika: 'Setrika',
			selesai: 'Selesai',
			diambil: 'Diambil'
		};

		data
			.text('-'.repeat(26))
			.text(`Status: ${statusLabels[order.order_status] || order.order_status}`)
			.newline();

		if (order.order_notes) {
			data.text(`Catatan: ${order.order_notes}`);
		}

		data
			.newline()
			.align('center')
			.text('==============================')
			.newline()
			.cut()
			.encode();

		await this.sendData(data);
	}
}

/**
 * Global printer instance (singleton)
 */
let printerInstance = null;

export function getPrinter() {
	if (!printerInstance) {
		printerInstance = new BluetoothPrinter();
	}
	return printerInstance;
}