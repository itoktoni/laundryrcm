import * as server from '../entries/pages/tools/sop/_page.server.js';

export const index = 29;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/tools/sop/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/tools/sop/+page.server.js";
export const imports = ["_app/immutable/nodes/29.q1GARhm2.js","_app/immutable/chunks/Bu7pAgVG.js","_app/immutable/chunks/HclGiUj8.js","_app/immutable/chunks/xihTtKlq.js","_app/immutable/chunks/Ba_iZ1Xa.js","_app/immutable/chunks/DFYh09zs.js"];
export const stylesheets = [];
export const fonts = [];
