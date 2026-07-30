import * as server from '../entries/pages/register/_page.server.js';

export const index = 17;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/register/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/register/+page.server.js";
export const imports = ["_app/immutable/nodes/17.CZL3hqOk.js","_app/immutable/chunks/Bu7pAgVG.js","_app/immutable/chunks/xihTtKlq.js","_app/immutable/chunks/KY4BGOgI.js","_app/immutable/chunks/CHgTXwnd.js"];
export const stylesheets = [];
export const fonts = [];
