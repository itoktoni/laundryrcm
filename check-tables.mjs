import { createClient } from '@libsql/client';
const db = createClient({ url: 'file:local.db' });

const tables = (await db.execute(`SELECT name FROM sqlite_master WHERE type='table' ORDER BY name`)).rows;
console.log('Tables:', tables.map(r => r.name).join(', '));

for (const t of tables) {
  try {
    const cols = (await db.execute({ sql: `PRAGMA table_info(${t.name})`, args: [] })).rows;
    console.log(`\n${t.name}:`, cols.map(r => r.name).join(', '));
  } catch(e) {}
}

// Show data in relevant tables
for (const t of ['customers', 'orders', 'order_items', 'inventory', 'machines']) {
  try {
    const rows = (await db.execute(`SELECT * FROM ${t} LIMIT 2`)).rows;
    console.log(`\n--- ${t} (${rows.length} rows) ---`);
    rows.forEach(r => console.log(JSON.stringify(r)));
  } catch(e) { console.log(`\n${t}: ${e.message}`); }
}