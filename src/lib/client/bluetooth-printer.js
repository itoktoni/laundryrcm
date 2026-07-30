/**
 * Bluetooth Thermal Printer Module
 * Supports: Web Bluetooth (Chrome) + Capacitor BLE (Android/iOS)
 */
import EscPosEncoder from "esc-pos-encoder";

const SERVICE_UUID = "000018f0-0000-1000-8000-00805f9b34fb";
const CHARACTERISTIC_UUID = "00002af1-0000-1000-8000-00805f9b34fb";
const COMMON_SERVICE_UUIDS = [
	"000018f0-0000-1000-8000-00805f9b34fb",
	"00001101-0000-1000-8000-00805f9b34fb",
	"49535343-fe7d-4ae5-8fa9-9fafd205e455",
	"e7810a71-73ae-499d-8c15-faa9aef0c3f2",
	"0000ff00-0000-1000-8000-00805f9b34fb"
];

let BleClient = null;
let _bleLoaded = false;

async function loadBle() {
	if (_bleLoaded) return BleClient !== null;
	_bleLoaded = true;
	try {
		const mod = await import("@capacitor-community/bluetooth-le");
		BleClient = mod.BleClient;
		await BleClient.initialize();
		return true;
	} catch { BleClient = null; return false; }
}

export class BluetoothPrinter {
	constructor() {
		this.device = null; this.server = null; this.service = null;
		this.characteristic = null; this.encoder = new EscPosEncoder();
		this._native = false; this._deviceId = null;
	}

	static isSupported() {
		if (navigator.bluetooth && navigator.bluetooth.requestDevice) return true;
		if (window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform()) return true;
		return false;
	}

	isConnected() {
		if (this._native) return this._deviceId !== null;
		return this.device && this.device.gatt && this.device.gatt.connected;
	}

	async connect(options = {}) {
		const hasNative = await loadBle();
		if (hasNative && window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform()) {
			return this._connectNative(options);
		}
		if (navigator.bluetooth && navigator.bluetooth.requestDevice) {
			return this._connectWeb(options);
		}
		throw new Error("Bluetooth tidak didukung. Gunakan aplikasi Android.");
	}

	async _connectNative(options = {}) {
		try {
			const device = await BleClient.requestDevice({
				services: [SERVICE_UUID],
				optionalServices: COMMON_SERVICE_UUIDS
			});
			this._deviceId = device.deviceId;
			this._native = true;
			this.device = { name: device.name || "Printer Bluetooth" };
			await BleClient.connect(device.deviceId);
			await this._findCharNative(device.deviceId);
			return true;
		} catch (err) {
			this._deviceId = null;
			throw new Error("Gagal menghubungkan: " + (err.message || "Unknown"));
		}
	}

	async _findCharNative(deviceId) {
		for (const uuid of COMMON_SERVICE_UUIDS) {
			try {
				const chars = await BleClient.getCharacteristics(deviceId, uuid);
				for (const c of chars) {
					if (c.properties && (c.properties.write || c.properties.writeWithoutResponse)) {
						this.characteristic = { serviceUuid: uuid, charUuid: c.uuid, writeWithoutResponse: !!(c.properties.writeWithoutResponse) };
						return;
					}
				}
			} catch {}
		}
		this.characteristic = { serviceUuid: SERVICE_UUID, charUuid: CHARACTERISTIC_UUID, writeWithoutResponse: true };
	}

	async _connectWeb(options = {}) {
		const filters = COMMON_SERVICE_UUIDS.map(u => ({ services: [u] }));
		if (options.nameFilter) { filters.push({ name: options.nameFilter }); filters.push({ namePrefix: options.nameFilter }); }
		this.device = await navigator.bluetooth.requestDevice({ filters, optionalServices: COMMON_SERVICE_UUIDS });
		this.device.addEventListener("gattserverdisconnected", () => { this.characteristic = this.service = this.server = null; });
		this.server = await this.device.gatt.connect();
		await this._findCharWeb();
		return true;
	}

	async _findCharWeb() {
		for (const uuid of COMMON_SERVICE_UUIDS) {
			try {
				this.service = await this.server.getPrimaryService(uuid);
				const chars = await this.service.getCharacteristics();
				for (const c of chars) { if (c.properties.write || c.properties.writeWithoutResponse) { this.characteristic = c; return; } }
			} catch {}
		}
		this.service = await this.server.getPrimaryService(SERVICE_UUID);
		this.characteristic = await this.service.getCharacteristic(CHARACTERISTIC_UUID);
	}

	async disconnect() {
		try {
			if (this._native && this._deviceId) await BleClient.disconnect(this._deviceId);
			else if (this.device && this.device.gatt && this.device.gatt.connected) this.device.gatt.disconnect();
		} catch {}
		this.device = this.server = this.service = this.characteristic = null;
		this._deviceId = null;
	}

	async sendData(encoderOrData) {
		const data = encoderOrData instanceof Uint8Array ? encoderOrData : encoderOrData.encode();
		if (!this.characteristic) throw new Error("Printer tidak terhubung");
		const CHUNK = 20;
		for (let i = 0; i < data.length; i += CHUNK) {
			const chunk = data.slice(i, i + CHUNK);
			if (this._native) {
				const hex = Array.from(chunk).map(b => b.toString(16).padStart(2, "0")).join("");
				const { serviceUuid, charUuid, writeWithoutResponse } = this.characteristic;
				if (writeWithoutResponse) await BleClient.writeWithoutResponse(this._deviceId, serviceUuid, charUuid, hex);
				else await BleClient.write(this._deviceId, serviceUuid, charUuid, hex);
			} else {
				if (this.characteristic.properties.writeWithoutResponse) await this.characteristic.writeValueWithoutResponse(chunk);
				else await this.characteristic.writeValue(chunk);
			}
		}
	}

	async printTest() {
		const d = new EscPosEncoder().initialize().align("center")
			.line("================================").line("TEST PRINT").line("================================")
			.line("Printer terhubung!").line(new Date().toLocaleString("id-ID"))
			.line(" ").line("Thermal Printer 58mm/80mm").line("================================")
			.newline().cut().encode();
		await this.sendData(d);
	}

	async printReceipt(order, items, options = {}) {
		const oid = String(order.order_id || "").slice(0, 8).toUpperCase();
		const dt = order.order_created_at ? new Date(order.order_created_at).toLocaleString("id-ID") : "-";
		const sub = Math.round(Number(order.order_subtotal) || 0);
		const disc = Math.round(Number(order.order_discount_amount) || 0);
		const tot = Math.round(Number(order.order_total_price) || 0);
		const pay = order.order_payment_status === "paid" ? "LUNAS" : "BELUM BAYAR";
		const sl = { pending: "Antre", cuci: "Cuci", kering: "Kering", setrika: "Setrika", packing: "Packing", selesai: "Selesai", diambil: "Diambil" };
		const st = sl[order.order_status] || String(order.order_status || "-");
		const r = new EscPosEncoder().initialize().align("center")
			.line(options.storeName || "LaundryKu").line(options.storeAddress || " ")
			.line(options.storePhone ? "Telp: " + options.storePhone : " ")
			.line("================================").line("NOTA LAUNDRY").line("================================")
			.align("left").line("No: #" + oid).line("Tgl: " + dt)
			.line("Pelanggan: " + (order.customer_name || "-")).line("Telp: " + (order.customer_phone || "-"))
			.line("--------------------------------");
		for (const it of items) { r.line(String(it.product_name || "").substring(0, 18)); r.line("  " + (Number(it.item_quantity) || 0) + " x Rp" + Math.round(Number(it.item_price) || 0).toLocaleString("id-ID")); }
		r.line("--------------------------------").line("Subtotal : Rp" + sub.toLocaleString("id-ID"));
		if (disc > 0) r.line("Diskon   : -Rp" + disc.toLocaleString("id-ID"));
		r.line("================================").align("center").line("TOTAL: Rp" + tot.toLocaleString("id-ID")).line("Status: " + pay).line("================================").line("Order: " + st).line(" ");
		if (order.order_notes) { r.line("Catatan: " + String(order.order_notes)); r.line(" "); }
		r.line("Terima kasih").line(" ").line(new Date().toLocaleString("id-ID")).newline().cut().encode();
		await this.sendData(r);
	}

	async printWorkOrder(order, items) {
		const oid = String(order.order_id || "").slice(0, 8).toUpperCase();
		const dt = order.order_created_at ? new Date(order.order_created_at).toLocaleString("id-ID") : "-";
		const sl = { pending: "Antre", cuci: "Cuci", kering: "Kering", setrika: "Setrika", selesai: "Selesai", diambil: "Diambil" };
		const d = new EscPosEncoder().initialize().align("center").line("=== ORDER KERJA ===").line("================================")
			.align("left").line("Order: #" + oid).line("Tgl: " + dt).line("Pelanggan: " + (order.customer_name || "-")).line("--------------------------------");
		for (const it of items) d.line(String(it.product_name || "").substring(0, 20) + "  x" + (Number(it.item_quantity) || 0));
		d.line("--------------------------------").line("Status: " + (sl[order.order_status] || order.order_status));
		if (order.order_notes) d.line("Catatan: " + String(order.order_notes));
		d.line(" ").align("center").line("================================").newline().cut().encode();
		await this.sendData(d);
	}
}

let printerInstance = null;
export function getPrinter() { if (!printerInstance) printerInstance = new BluetoothPrinter(); return printerInstance; }
