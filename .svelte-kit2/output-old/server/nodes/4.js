import * as server from '../entries/pages/customers/_id_/_page.server.js';

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/customers/_id_/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/customers/[id]/+page.server.js";
export const imports = ["_app/immutable/nodes/4.6IC74iPG.js","_app/immutable/chunks/Bu7pAgVG.js","_app/immutable/chunks/xihTtKlq.js","_app/immutable/chunks/Ba_iZ1Xa.js","_app/immutable/chunks/DFYh09zs.js","_app/immutable/chunks/0ZVepxnm.js"];
export const stylesheets = [];
export const fonts = [];
