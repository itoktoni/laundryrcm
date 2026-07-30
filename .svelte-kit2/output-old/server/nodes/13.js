import * as server from '../entries/pages/orders/_id_/_page.server.js';

export const index = 13;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/orders/_id_/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/orders/[id]/+page.server.js";
export const imports = ["_app/immutable/nodes/13.Ct82Tsk5.js","_app/immutable/chunks/Bu7pAgVG.js","_app/immutable/chunks/DFYh09zs.js","_app/immutable/chunks/xihTtKlq.js","_app/immutable/chunks/Ba_iZ1Xa.js","_app/immutable/chunks/0ZVepxnm.js","_app/immutable/chunks/D_B29K2O.js","_app/immutable/chunks/HclGiUj8.js"];
export const stylesheets = ["_app/immutable/assets/QrisModal.DVynI11U.css","_app/immutable/assets/13.D2Q2F8tQ.css"];
export const fonts = [];
