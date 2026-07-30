import * as server from '../entries/pages/orders/_page.server.js';

export const index = 12;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/orders/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/orders/+page.server.js";
export const imports = ["_app/immutable/nodes/12.BxzWh6Jg.js","_app/immutable/chunks/Bu7pAgVG.js","_app/immutable/chunks/xihTtKlq.js","_app/immutable/chunks/0ZVepxnm.js"];
export const stylesheets = ["_app/immutable/assets/12.AZhEz_81.css"];
export const fonts = [];
