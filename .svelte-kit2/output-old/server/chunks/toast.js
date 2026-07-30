import "./exports.js";
import { E as writable } from "./server.js";
//#region src/lib/stores/toast.js
var toasts = writable([]);
//#endregion
export { toasts as t };
