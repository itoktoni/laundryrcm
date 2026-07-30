import * as server from '../entries/pages/setting/_page.server.js';

export const index = 20;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/setting/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/setting/+page.server.js";
export const imports = ["_app/immutable/nodes/20.DGBiKoL0.js","_app/immutable/chunks/Bu7pAgVG.js","_app/immutable/chunks/DFYh09zs.js","_app/immutable/chunks/xihTtKlq.js","_app/immutable/chunks/Ba_iZ1Xa.js","_app/immutable/chunks/BSokn74_.js"];
export const stylesheets = [];
export const fonts = [];
