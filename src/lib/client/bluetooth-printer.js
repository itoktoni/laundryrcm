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

		const MTU = 200; // Smaller chunk size for better compatibility
		for (let i = 0; i < data.length; i += MTU) {
			const chunk = data.slice(i, Math.min(i + MTU, data.length));
			try {
				if (this.characteristic.properties.writeWithoutResponse) {
					await this.characteristic.writeValueWithoutResponse(chunk);
				} else {
					await this.characteristic.writeValue(chunk);
				}
			} catch (err) {
				console.warn('Chunk write failed, retrying...', err.message);
				await new Promise(r => setTimeout(r, 100));
				try {
					if (this.characteristic.properties.writeWithoutResponse) {
						await this.characteristic.writeValueWithoutResponse(chunk);
					} else {
						await this.characteristic.writeValue(chunk);
					}
				} catch (retryErr) {
					console.error('Chunk write failed after retry:', retryErr.message);
					throw new Error('Gagal mengirim data ke printer: ' + retryErr.message);
				}
			}
			// Small delay between chunks to prevent buffer overflow
			await new Promise(r => setTimeout(r, 30));
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
		const storeName = options.storeName || 'LaundryKu';
		const storeAddress = options.storeAddress || '';
		const storePhone = options.storePhone || '';
		const orderId = String(order.order_id || '').slice(0, 8).toUpperCase();
		const orderDate = order.order_created_at
			? new Date(order.order_created_at).toLocaleString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
			: '-';
		const customerName = String(order.customer_name || '-');
		const customerPhone = String(order.customer_phone || '-');
		const subtotal = Math.round(Number(order.order_subtotal) || 0);
		const discount = Math.round(Number(order.order_discount_amount) || 0);
		const total = Math.round(Number(order.order_paid_amount) || Number(order.order_total_price) || 0);
		const paymentStatus = order.order_payment_status === 'paid' ? 'LUNAS' : 'BELUM BAYAR';
		const statusLabels = { pending: 'Antre', cuci: 'Cuci', kering: 'Kering', setrika: 'Setrika', selesai: 'Selesai', diambil: 'Diambil' };
		const currentStatus = statusLabels[order.order_status] || String(order.order_status || '-');

		const encoder = new EscPosEncoder();
		const receipt = encoder
			.initialize()
			.align('center')
			.line(storeName)
			.line(storeAddress || ' ')
			.line(storePhone ? `Telp: ${storePhone}` : ' ')
			.line('================================')
			.line('NOTA LAUNDRY')
			.line('================================')
			.align('left')
			.line(`No: #${orderId}`)
			.line(`Tgl: ${orderDate}`)
			.line(`Pelanggan: ${customerName}`)
			.line(`Telp: ${customerPhone}`)
			.line('--------------------------------');

		// Items
		for (const item of items) {
			const name = String(item.product_name || '').substring(0, 18);
			const qty = Number(item.item_quantity) || 0;
			const price = Math.round(Number(item.item_price) || 0);
			receipt.line(`${name}`);
			receipt.line(`  ${qty} x Rp${price.toLocaleString('id-ID')}`);
		}

		receipt
			.line('--------------------------------')
			.line(`Subtotal : Rp${subtotal.toLocaleString('id-ID')}`);

		if (discount > 0) {
			receipt.line(`Diskon   : -Rp${discount.toLocaleString('id-ID')}`);
		}

		receipt
			.line('================================')
			.align('center')
			.line(`TOTAL: Rp${total.toLocaleString('id-ID')}`)
			.line(`Status: ${paymentStatus}`)
			.line('================================')
			.line(`Order: ${currentStatus}`)
			.line(' ');

		if (order.order_notes) {
			receipt.line(`Catatan: ${String(order.order_notes)}`);
			receipt.line(' ');
		}

		receipt
			.line('Terima kasih')
			.line(' ')
			.line(new Date().toLocaleString('id-ID'))
			.newline()
			.cut()
			.encode();

		await this.sendData(receipt);
	}

	/**
	 * Print a simplified order summary (for kitchen/workshop)
	 * @param {Object} order
	 * @param {Array} items
	 */
	async printWorkOrder(order, items) {
		const orderId = String(order.order_id || '').slice(0, 8).toUpperCase();
		const orderDate = order.order_created_at
			? new Date(order.order_created_at).toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
			: '-';
		const customerName = String(order.customer_name || '-');
		const statusLabels = { pending: 'Antre', cuci: 'Cuci', kering: 'Kering', setrika: 'Setrika', selesai: 'Selesai', diambil: 'Diambil' };
		const currentStatus = statusLabels[order.order_status] || String(order.order_status || '-');

		const encoder = new EscPosEncoder();
		const data = encoder
			.initialize()
			.align('center')
			.line('=== ORDER KERJA ===')
			.line('================================')
			.align('left')
			.line(`Order: #${orderId}`)
			.line(`Tgl: ${orderDate}`)
			.line(`Pelanggan: ${customerName}`)
			.line('--------------------------------');

		// Items
		for (const item of items) {
			const name = String(item.product_name || '').substring(0, 20);
			const qty = Number(item.item_quantity) || 0;
			data.line(`${name}  x${qty}`);
		}

		data
			.line('--------------------------------')
			.line(`Status: ${currentStatus}`);

		if (order.order_notes) {
			data.line(`Catatan: ${String(order.order_notes)}`);
		}

		data
			.line(' ')
			.align('center')
			.line('================================')
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