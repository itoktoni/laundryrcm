import { writable } from 'svelte/store';

export const toasts = writable([]);

let id = 0;

export function toast(message, type = 'success', timeout = 3000) {
	const tid = ++id;
	toasts.update((t) => [...t, { id: tid, message, type }]);
	if (timeout) setTimeout(() => dismiss(tid), timeout);
	return tid;
}

export function dismiss(tid) {
	toasts.update((t) => t.filter((x) => x.id !== tid));
}
