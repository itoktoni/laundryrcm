import * as server from '../entries/pages/reports/_page.server.js';

export const index = 18;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/reports/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/reports/+page.server.js";
export const imports = ["_app/immutable/nodes/18.Byu8EpjY.js","_app/immutable/chunks/Bu7pAgVG.js","_app/immutable/chunks/xihTtKlq.js","_app/immutable/chunks/0ZVepxnm.js","_app/immutable/chunks/CHgTXwnd.js","_app/immutable/chunks/B9--aYfp.js"];
export const stylesheets = [];
export const fonts = [];
