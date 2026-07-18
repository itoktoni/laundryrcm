import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	server: {
		port: 3000,
		strictPort: false
	},
	plugins: [tailwindcss(), sveltekit()]
});
