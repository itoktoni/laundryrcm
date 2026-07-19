import { db } from '$lib/server/db.js';
import { json } from '@sveltejs/kit';

export async function GET({ request }) {
	const { getSettings } = await import('$lib/server/settings.js');
	const settings = await getSettings();
	const expectedKey = settings.ai_api_key || '';
	const authHeader = request.headers.get('authorization') || '';

	if (!expectedKey || !authHeader.startsWith('Bearer ') || authHeader.slice(7) !== expectedKey) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}
	const [appSettings, faqs, products, promotions, templates] = await Promise.all([
		db.execute('SELECT * FROM app_settings ORDER BY setting_key ASC'),
		db.execute('SELECT * FROM faqs ORDER BY faq_created_at DESC'),
		db.execute(`SELECT p.*, c.category_name FROM products p LEFT JOIN categories c ON p.category_id = c.category_id ORDER BY p.product_created_at DESC`),
		db.execute('SELECT * FROM promotions ORDER BY promo_created_at DESC'),
		db.execute('SELECT * FROM templates ORDER BY template_created_at DESC')
	]);

	return json({
		app_settings: appSettings.rows
			.filter(row => row.status !== 'private')
			.map(row => ({
				key: row.setting_key,
				value: row.setting_value,
				updated_at: row.setting_updated_at
			})),
		faqs: faqs.rows.map(row => ({
			id: row.faq_id,
			question: row.faq_question,
			answer: row.faq_answer,
			created_at: row.faq_created_at
		})),
		products: products.rows.map(row => ({
			id: row.product_id,
			name: row.product_name,
			price: row.product_price,
			unit: row.product_unit,
			description: row.product_description,
			is_active: row.product_is_active === 1,
			category_id: row.category_id,
			category_name: row.category_name,
			created_at: row.product_created_at
		})),
		promotions: promotions.rows.map(row => ({
			id: row.promo_id,
			name: row.promo_name,
			type: row.promo_type,
			value: row.promo_value,
			min_order: row.promo_min_order,
			code: row.promo_code,
			start_date: row.promo_start_date,
			end_date: row.promo_end_date,
			is_active: row.promo_is_active === 1,
			created_at: row.promo_created_at
		})),
		templates: templates.rows.map(row => ({
			id: row.template_id,
			name: row.template_name,
			description: row.template_description,
			created_at: row.template_created_at
		}))
	});
}
