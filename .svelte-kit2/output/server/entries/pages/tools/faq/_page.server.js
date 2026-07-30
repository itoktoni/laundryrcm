import { t as db } from "../../../../chunks/db2.js";
import { fail } from "@sveltejs/kit";
//#region src/routes/tools/faq/+page.server.js
async function load() {
	return { faqs: (await db.execute("SELECT * FROM faqs ORDER BY faq_created_at DESC")).rows };
}
var actions = {
	add: async ({ request }) => {
		const formData = await request.formData();
		const question = formData.get("question")?.toString().trim();
		const answer = formData.get("answer")?.toString() ?? "";
		if (!question) return fail(400, { error: "Pertanyaan wajib diisi" });
		await db.execute({
			sql: "INSERT INTO faqs (faq_id, faq_question, faq_answer) VALUES (?, ?, ?)",
			args: [
				crypto.randomUUID(),
				question,
				answer
			]
		});
		return { success: true };
	},
	edit: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get("id")?.toString();
		const question = formData.get("question")?.toString().trim();
		const answer = formData.get("answer")?.toString() ?? "";
		if (!id || !question) return fail(400, { error: "Data tidak valid" });
		await db.execute({
			sql: "UPDATE faqs SET faq_question = ?, faq_answer = ? WHERE faq_id = ?",
			args: [
				question,
				answer,
				id
			]
		});
		return { success: true };
	},
	delete: async ({ request }) => {
		const id = (await request.formData()).get("id")?.toString();
		if (!id) return fail(400, { error: "ID tidak valid" });
		await db.execute({
			sql: "DELETE FROM faqs WHERE faq_id = ?",
			args: [id]
		});
		return { success: true };
	}
};
//#endregion
export { actions, load };
