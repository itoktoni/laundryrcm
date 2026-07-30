import * as server from '../entries/pages/schedule/_page.server.js';

export const index = 19;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/schedule/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/schedule/+page.server.js";
export const imports = ["_app/immutable/nodes/19.Ctz-3Al9.js","_app/immutable/chunks/Bu7pAgVG.js","_app/immutable/chunks/xihTtKlq.js","_app/immutable/chunks/Ba_iZ1Xa.js","_app/immutable/chunks/DFYh09zs.js"];
export const stylesheets = [];
export const fonts = [];
