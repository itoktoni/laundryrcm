import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	server: {
		port: 3000,
		strictPort: false,
		allowedHosts: process.env.WEBHOOK
			? process.env.WEBHOOK.split(',').map((h) => h.trim()).filter(Boolean)
			: true
	},
	plugins: [tailwindcss(), sveltekit()]
});
