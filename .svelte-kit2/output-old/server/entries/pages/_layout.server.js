//#region src/routes/+layout.server.js
async function load({ locals }) {
	return { user: locals.user };
}
//#endregion
export { load };
