import * as server from '../entries/pages/promo/_page.server.js';

export const index = 16;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/promo/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/promo/+page.server.js";
export const imports = ["_app/immutable/nodes/16.CBCR3sE5.js","_app/immutable/chunks/Bu7pAgVG.js","_app/immutable/chunks/xihTtKlq.js","_app/immutable/chunks/Ba_iZ1Xa.js","_app/immutable/chunks/DFYh09zs.js","_app/immutable/chunks/0ZVepxnm.js","_app/immutable/chunks/CHgTXwnd.js","_app/immutable/chunks/B9--aYfp.js","_app/immutable/chunks/CKtia-Yp.js"];
export const stylesheets = [];
export const fonts = [];
