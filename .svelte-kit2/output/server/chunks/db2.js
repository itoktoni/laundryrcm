import { t as private_env } from "./shared-server.js";
import { createClient } from "@libsql/client";
var db = createClient({
	url: private_env.TURSO_DATABASE_URL || "file:local.db",
	authToken: private_env.TURSO_AUTH_TOKEN || void 0
});
//#endregion
export { db as t };
