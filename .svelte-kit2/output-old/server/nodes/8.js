import * as server from '../entries/pages/inventory/_id_/_page.server.js';

export const index = 8;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/inventory/_id_/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/inventory/[id]/+page.server.js";
export const imports = ["_app/immutable/nodes/8.C0CbL3HR.js","_app/immutable/chunks/Bu7pAgVG.js","_app/immutable/chunks/xihTtKlq.js","_app/immutable/chunks/0ZVepxnm.js"];
export const stylesheets = [];
export const fonts = [];
