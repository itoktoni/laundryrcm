import * as server from '../entries/pages/dashboard/_page.server.js';

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/dashboard/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/dashboard/+page.server.js";
export const imports = ["_app/immutable/nodes/5.tYEgANJ_.js","_app/immutable/chunks/Bu7pAgVG.js","_app/immutable/chunks/HclGiUj8.js","_app/immutable/chunks/xihTtKlq.js","_app/immutable/chunks/0ZVepxnm.js"];
export const stylesheets = [];
export const fonts = [];
