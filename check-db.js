import { createClient } from '@libsql/client';
const db = createClient({ url: 'file:local.db' });
const r = await db.execute("SELECT name FROM sqlite_master WHERE type='table'");
console.log(r.rows.map(r => r.name));
