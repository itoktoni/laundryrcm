import * as server from '../entries/pages/products/_page.server.js';

export const index = 15;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/products/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/products/+page.server.js";
export const imports = ["_app/immutable/nodes/15.B0AWs4l4.js","_app/immutable/chunks/Bu7pAgVG.js","_app/immutable/chunks/xihTtKlq.js","_app/immutable/chunks/Ba_iZ1Xa.js","_app/immutable/chunks/DFYh09zs.js","_app/immutable/chunks/0ZVepxnm.js","_app/immutable/chunks/CHgTXwnd.js","_app/immutable/chunks/B9--aYfp.js","_app/immutable/chunks/CKtia-Yp.js"];
export const stylesheets = ["_app/immutable/assets/15.PRrVcZTp.css"];
export const fonts = [];
