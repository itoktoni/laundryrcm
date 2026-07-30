import * as server from '../entries/pages/_layout.server.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/+layout.server.js";
export const imports = ["_app/immutable/nodes/0.BhKTkeNu.js","_app/immutable/chunks/Bu7pAgVG.js","_app/immutable/chunks/DFYh09zs.js","_app/immutable/chunks/xihTtKlq.js","_app/immutable/chunks/Ba_iZ1Xa.js","_app/immutable/chunks/BSokn74_.js"];
export const stylesheets = ["_app/immutable/assets/0.DOlPupoH.css"];
export const fonts = [];
