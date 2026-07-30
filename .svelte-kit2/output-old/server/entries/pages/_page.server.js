import { redirect } from "@sveltejs/kit";
//#region src/routes/+page.server.js
function load({ locals }) {
	throw redirect(302, locals.user ? "/dashboard" : "/login");
}
//#endregion
export { load };
