import { createClient } from '@libsql/client';
const db = createClient({ url: process.env.TURSO_DATABASE_URL || 'file:local.db' });
await db.execute({ sql: "UPDATE app_settings SET setting_value = ? WHERE setting_key = 'ai_model'", args: ['anthropic/claude-sonnet-4-20250514'] });
console.log('ai_model -> sonnet');
