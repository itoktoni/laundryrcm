import * as server from '../entries/pages/settings/_page.server.js';

export const index = 21;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/settings/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/settings/+page.server.js";
export const imports = ["_app/immutable/nodes/21.C1p1UJ09.js","_app/immutable/chunks/Bu7pAgVG.js","_app/immutable/chunks/xihTtKlq.js","_app/immutable/chunks/Ba_iZ1Xa.js","_app/immutable/chunks/DFYh09zs.js"];
export const stylesheets = [];
export const fonts = [];
