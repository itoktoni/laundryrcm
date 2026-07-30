import * as server from '../entries/pages/customers/_page.server.js';

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/customers/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/customers/+page.server.js";
export const imports = ["_app/immutable/nodes/3.DAz2CRhf.js","_app/immutable/chunks/Bu7pAgVG.js","_app/immutable/chunks/xihTtKlq.js","_app/immutable/chunks/Ba_iZ1Xa.js","_app/immutable/chunks/DFYh09zs.js"];
export const stylesheets = ["_app/immutable/assets/3.BYt9ojtP.css"];
export const fonts = [];
