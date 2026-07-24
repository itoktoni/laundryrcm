import { createClient } from '@libsql/client';
import { readFileSync } from 'fs';

const db = createClient({
	url: 'file:laundry-app.db'
});

const schema = readFileSync(new URL('./schema.sql', import.meta.url).pathname, 'utf8');
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
console.log('Tables created: sessions, users, customers, categories, products, promotions, orders, order_items, transactions, inventory, machines, machine_services, templates, faqs, app_settings, stock_movements, whatsapp_schedules, whatsapp_schedule_logs, whatsapp_pending_messages, attendance');
