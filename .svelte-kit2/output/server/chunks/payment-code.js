//#region src/lib/server/payment-code.js
var CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
function generatePaymentCode(prefix) {
	let code = prefix === "Q" || prefix === "C" ? prefix : "C";
	for (let i = 0; i < 9; i++) code += CHARS.charAt(Math.floor(Math.random() * 32));
	return code;
}
//#endregion
export { generatePaymentCode as t };
