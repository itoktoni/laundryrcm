import * as server from '../entries/pages/inventory/_page.server.js';

export const index = 7;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/inventory/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/inventory/+page.server.js";
export const imports = ["_app/immutable/nodes/7.JANCnh6w.js","_app/immutable/chunks/Bu7pAgVG.js","_app/immutable/chunks/xihTtKlq.js","_app/immutable/chunks/Ba_iZ1Xa.js","_app/immutable/chunks/DFYh09zs.js","_app/immutable/chunks/0ZVepxnm.js"];
export const stylesheets = [];
export const fonts = [];
