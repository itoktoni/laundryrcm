/**
 * Bluetooth Printer Store
 * Reactive state management for Bluetooth printer connection
 *
 * This is a simple module-level store. Components should import
 * the functions and use their own local state to track changes.
 */
import { getPrinter, BluetoothPrinter } from '$lib/client/bluetooth-printer.js';

// Module-level state
const _state = {
	connected: false,
	connecting: false,
	supported: false,
	deviceName: '',
	error: ''
};

let _printer = null;

// List of subscribers (callback functions)
const _subscribers = new Set();

function notify() {
	const state = { ..._state };
	_subscribers.forEach(fn => {
		try { fn(state); } catch {}
	});
}

/**
 * Subscribe to printer state changes
 * @param {Function} callback - receives new state object
 * @returns {Function} unsubscribe function
 */
export function subscribe(callback) {
	_subscribers.add(callback);
	callback({ ..._state });
	return () => _subscribers.delete(callback);
}

/**
 * Get current printer state snapshot
 */
export function getPrinterState() {
	return { ..._state };
}

/**
 * Connect to Bluetooth printer
 */
export async function connectPrinter(options = {}) {
	_state.connecting = true;
	_state.error = '';
	notify();

	try {
		if (!BluetoothPrinter.isSupported()) {
			_state.connecting = false;
			_state.supported = false;
			_state.error = 'Web Bluetooth tidak didukung. Gunakan Chrome/Edge terbaru.';
			notify();
			return false;
		}

		_state.supported = true;
		notify();

		_printer = getPrinter();
		await _printer.connect(options);

		_state.connected = true;
		_state.connecting = false;
		_state.deviceName = _printer.device?.name || 'Printer Bluetooth';
		_state.error = '';
		notify();

		return true;
	} catch (err) {
		_state.connected = false;
		_state.connecting = false;
		_state.error = err.message || 'Gagal menghubungkan printer';
		notify();
		return false;
	}
}

/**
 * Disconnect from Bluetooth printer
 */
export function disconnectPrinter() {
	if (_printer) {
		_printer.disconnect();
	}
	_printer = null;
	_state.connected = false;
	_state.connecting = false;
	_state.deviceName = '';
	_state.error = '';
	notify();
}

/**
 * Print a receipt / nota
 */
export async function printReceipt(order, items, options = {}) {
	_state.error = '';
	notify();

	try {
		if (!_printer || !_printer.isConnected()) {
			const connected = await connectPrinter();
			if (!connected) {
				throw new Error('Printer tidak terhubung');
			}
		}

		await _printer.printReceipt(order, items, options);
		return true;
	} catch (err) {
		_state.error = err.message || 'Gagal mencetak';
		notify();
		return false;
	}
}

/**
 * Print work order (simplified for kitchen/workshop)
 */
export async function printWorkOrder(order, items) {
	_state.error = '';
	notify();

	try {
		if (!_printer || !_printer.isConnected()) {
			const connected = await connectPrinter();
			if (!connected) {
				throw new Error('Printer tidak terhubung');
			}
		}

		await _printer.printWorkOrder(order, items);
		return true;
	} catch (err) {
		_state.error = err.message || 'Gagal mencetak';
		notify();
		return false;
	}
}

/**
 * Print test page
 */
export async function printTest() {
	_state.error = '';
	notify();

	try {
		if (!_printer || !_printer.isConnected()) {
			const connected = await connectPrinter();
			if (!connected) {
				throw new Error('Printer tidak terhubung');
			}
		}

		await _printer.printTest();
		return true;
	} catch (err) {
		_state.error = err.message || 'Gagal mencetak test';
		notify();
		return false;
	}
}

export { BluetoothPrinter };