import { createClient } from "@libsql/client/http";
import { readFileSync } from "fs";

const env = readFileSync(".env", "utf-8");
const vars = {};
for (const line of env.split("\n")) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const idx = trimmed.indexOf("=");
  if (idx > 0) {
    vars[trimmed.slice(0, idx)] = trimmed.slice(idx + 1);
  }
}

const db = createClient({
  url: vars.TURSO_DATABASE_URL,
  authToken: vars.TURSO_AUTH_TOKEN
});

try {
  const [records, summary, byUser] = await Promise.all([
    db.execute({
      sql: "SELECT a.attendance_id, a.user_id, u.user_name, a.type, a.latitude, a.longitude, a.location_name, a.distance_meters, a.status, a.created_at FROM attendance a JOIN users u ON a.user_id = u.user_id WHERE 1=1 AND strftime('%Y-%m', a.created_at) = strftime('%Y-%m', 'now') ORDER BY a.created_at DESC",
      args: []
    }),
    db.execute({
      sql: "SELECT COUNT(*) as total, COUNT(CASE WHEN type = 'masuk' THEN 1 END) as total_masuk, COUNT(CASE WHEN type = 'keluar' THEN 1 END) as total_keluar, COUNT(CASE WHEN status = 'success' THEN 1 END) as total_success, COUNT(CASE WHEN status = 'failed' THEN 1 END) as total_failed FROM attendance a WHERE 1=1 AND strftime('%Y-%m', a.created_at) = strftime('%Y-%m', 'now')",
      args: []
    }),
    db.execute({
      sql: "SELECT u.user_name, COUNT(*) as total, COUNT(CASE WHEN a.type = 'masuk' THEN 1 END) as masuk, COUNT(CASE WHEN a.type = 'keluar' THEN 1 END) as keluar, COUNT(CASE WHEN a.status = 'success' THEN 1 END) as success, COUNT(CASE WHEN a.status = 'failed' THEN 1 END) as failed FROM attendance a JOIN users u ON a.user_id = u.user_id WHERE 1=1 AND strftime('%Y-%m', a.created_at) = strftime('%Y-%m', 'now') GROUP BY a.user_id ORDER BY u.user_name ASC",
      args: []
    })
  ]);
  console.log("records:", records.rows.length, JSON.stringify(records.rows.slice(0, 2)));
  console.log("summary:", JSON.stringify(summary.rows[0]));
  console.log("byUser:", JSON.stringify(byUser.rows));
} catch (e) {
  console.error("Error:", e.message);
  console.error("Stack:", e.stack);
}