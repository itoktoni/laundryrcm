import { writable } from 'svelte/store';
import { browser } from '$app/environment';

function createThemeStore() {
	const initial = 'light';
	const { subscribe, set } = writable(initial);

	return {
		subscribe,
		toggle() {
			set((current) => {
				const next = current === 'dark' ? 'light' : 'dark';
				if (browser) {
					localStorage.setItem('theme', next);
					document.documentElement.classList.toggle('dark', next === 'dark');
					document.documentElement.classList.toggle('light', next === 'light');
				}
				return next;
			});
		},
		init() {
			if (browser) {
				const stored = localStorage.getItem('theme') || 'light';
				document.documentElement.classList.toggle('dark', stored === 'dark');
				document.documentElement.classList.toggle('light', stored === 'light');
			}
		}
	};
}

export const theme = createThemeStore();
