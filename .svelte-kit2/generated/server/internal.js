
import root from '../root.js';
import { set_building, set_prerendering } from '$app/env/internal';
import { set_assets } from '$app/paths/internal/server';
import { set_manifest, set_read_implementation } from '__sveltekit/server';
import { set_private_env, set_public_env } from '../../../node_modules/@sveltejs/kit/src/runtime/shared-server.js';
import error from '../shared/error-template.js';

export const options = {
	app_template_contains_nonce: false,
	async: false,
	csp: {"mode":"auto","directives":{"upgrade-insecure-requests":false,"block-all-mixed-content":false},"reportOnly":{"upgrade-insecure-requests":false,"block-all-mixed-content":false}},
	csrf_check_origin: true,
	csrf_trusted_origins: [],
	embedded: false,
	env_public_prefix: 'PUBLIC_',
	env_private_prefix: '',
	hash_routing: false,
	hooks: null, // added lazily, via `get_hooks`
	preload_strategy: "modulepreload",
	root,
	service_worker: true,
	service_worker_options: undefined,
	server_error_boundaries: false,
	templates: {
		app: ({ head, body, assets, nonce, env }) => "<!doctype html>\r\n<html class=\"light\" lang=\"id\">\r\n\t<head>\r\n\t\t<meta charset=\"utf-8\" />\r\n\t\t<meta name=\"viewport\" content=\"width=device-width, initial-scale=1, viewport-fit=cover\" />\r\n\t\t<meta name=\"theme-color\" content=\"#2563eb\" />\r\n\t\t<meta name=\"description\" content=\"LaundryKu - Manajemen Laundry AI\" />\r\n\t\t<meta name=\"mobile-web-app-capable\" content=\"yes\" />\r\n\t\t<meta name=\"apple-mobile-web-app-capable\" content=\"yes\" />\r\n\t\t<meta name=\"apple-mobile-web-app-status-bar-style\" content=\"black-translucent\" />\r\n\t\t<link rel=\"manifest\" href=\"/manifest.json\" />\r\n\t\t<link rel=\"icon\" href=\"/favicon.png\" />\r\n\t\t<link rel=\"apple-touch-icon\" href=\"/icon-192.png\" />\r\n\t\t<link href=\"https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap\" rel=\"stylesheet\" />\r\n\t\t<link href=\"https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap\" rel=\"stylesheet\" />\r\n\t\t<style>\r\n\t\t\t.material-symbols-outlined {\r\n\t\t\t\tfont-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;\r\n\t\t\t}\r\n\t\t\t.fill-icon {\r\n\t\t\t\tfont-variation-settings: 'FILL' 1;\r\n\t\t\t}\r\n\t\t\tbody {\r\n\t\t\t\tfont-family: 'Inter', sans-serif;\r\n\t\t\t\t-webkit-tap-highlight-color: transparent;\r\n\t\t\t}\r\n\t\t</style>\r\n\t\t" + head + "\r\n\t</head>\r\n\t<body data-sveltekit-preload-data=\"hover\">\r\n\t\t<div style=\"display: contents\">" + body + "</div>\r\n\t</body>\r\n</html>\r\n",
		error
	},
	version_hash: "hgw639"
};

export async function get_hooks() {
	let handle;
	let handleFetch;
	let handleError;
	let handleValidationError;
	let init;
	({ handle, handleFetch, handleError, handleValidationError, init } = await import("../../../src/hooks.server.js"));

	let reroute;
	let transport;
	

	return {
		handle,
		handleFetch,
		handleError,
		handleValidationError,
		init,
		reroute,
		transport
	};
}

export { set_assets, set_building, set_manifest, set_prerendering, set_private_env, set_public_env, set_read_implementation };
