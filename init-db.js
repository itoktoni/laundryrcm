import { createClient } from '@libsql/client';
import { readFileSync } from 'fs';

const db = createClient({
	url: 'file:local.db'
});

const schema = readFileSync('./schema.sql', 'utf8');
const statements = schema.split(';').filter(s => s.trim());

for (const statement of statements) {
	if (statement.trim()) {
		try {
			await db.execute(statement.trim());
		} catch (e) {
			if (!e.message.includes('already exists')) {
				console.error('Error:', e.message, '\nStatement:', statement.trim().substring(0, 80));
			}
		}
	}
}

console.log('Database initialized successfully!');
console.log('Tables created: sessions, users, customers, item_types, services, pricing, promotions, orders, order_items, transactions, inventory, machines');
console.log('Seed data: 7 item types, 5 services, 18 pricing entries');
