import { createClient } from '@libsql/client';
const db = createClient({ url: process.env.TURSO_DATABASE_URL || 'file:local.db' });
const res = await db.execute('SELECT setting_key, setting_value, status, mandatory, urutan FROM app_settings ORDER BY urutan ASC');
console.log(JSON.stringify(res.rows, null, 2));
