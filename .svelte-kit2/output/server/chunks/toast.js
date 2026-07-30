import { D as writable } from "./server.js";
import "./index-server2.js";
//#region src/lib/stores/toast.js
var toasts = writable([]);
//#endregion
export { toasts as t };
