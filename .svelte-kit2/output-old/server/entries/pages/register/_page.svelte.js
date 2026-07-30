import { C as escape_html, a as head } from "../../../chunks/server.js";
import { t as Input } from "../../../chunks/Input.js";
import { t as Button } from "../../../chunks/Button.js";
//#region src/routes/register/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { form } = $$props;
		let name = "";
		let email = "";
		let password = "";
		let loading = false;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			head("52fghe", $$renderer, ($$renderer) => {
				$$renderer.title(($$renderer) => {
					$$renderer.push(`<title>Daftar - LaundryKu</title>`);
				});
			});
			$$renderer.push(`<div class="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-gray-950"><div class="w-full max-w-sm"><div class="mb-8 text-center"><h1 class="text-3xl font-bold text-blue-600">LaundryKu</h1> <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">Buat akun baru</p></div> <form method="POST" class="space-y-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">`);
			if (form?.error) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/30 dark:text-red-400">${escape_html(form.error)}</div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			Input($$renderer, {
				label: "Nama Lengkap",
				type: "text",
				id: "name",
				name: "name",
				placeholder: "Nama Anda",
				required: true,
				get value() {
					return name;
				},
				set value($$value) {
					name = $$value;
					$$settled = false;
				}
			});
			$$renderer.push(`<!----> `);
			Input($$renderer, {
				label: "Email",
				type: "email",
				id: "email",
				name: "email",
				placeholder: "email@laundry.com",
				required: true,
				get value() {
					return email;
				},
				set value($$value) {
					email = $$value;
					$$settled = false;
				}
			});
			$$renderer.push(`<!----> `);
			Input($$renderer, {
				label: "Password",
				type: "password",
				id: "password",
				name: "password",
				placeholder: "Minimal 6 karakter",
				required: true,
				get value() {
					return password;
				},
				set value($$value) {
					password = $$value;
					$$settled = false;
				}
			});
			$$renderer.push(`<!----> `);
			Button($$renderer, {
				type: "submit",
				size: "lg",
				disabled: loading,
				children: ($$renderer) => {
					$$renderer.push(`<!---->Daftar`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----> <p class="text-center text-sm text-gray-500 dark:text-gray-400">Sudah punya akun? <a href="/login" class="font-medium text-blue-600 hover:text-blue-500">Masuk</a></p></form></div></div>`);
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
	});
}
//#endregion
export { _page as default };
