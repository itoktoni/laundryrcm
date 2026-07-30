import { o as head, w as escape_html } from "../../../chunks/server.js";
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
			$$renderer.push(`<div class="flex min-h-dvh flex-col bg-surface"><div class="relative overflow-hidden bg-brand-gradient px-6 pb-16 pt-[max(4rem,env(safe-area-inset-top))]"><div class="absolute -right-10 -top-14 w-48 h-48 rounded-full bg-white/10"></div> <div class="absolute right-16 top-24 w-20 h-20 rounded-full bg-white/10"></div> <div class="absolute -left-8 bottom-6 w-28 h-28 rounded-full bg-white/5"></div> <div class="relative animate-fade-slide-up"><div class="icon-tile w-16 h-16 rounded-2xl bg-white/15 backdrop-blur ring-1 ring-white/25 mb-5"><span class="material-symbols-outlined text-[36px] text-white fill-icon">local_laundry_service</span></div> <h1 class="text-[32px] font-extrabold tracking-tight text-white">LaundryKu</h1> <p class="mt-1 text-[14px] font-medium text-white/80">Mulai kelola laundry Anda hari ini</p></div></div> <div class="flex-1 px-5 pb-8 -mt-8">`);
			if (form?.success) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="app-card shadow-card-lg rounded-3xl p-6 max-w-sm mx-auto w-full animate-fade-slide-up"><div class="mb-4 flex justify-center"><div class="icon-tile w-20 h-20 rounded-full bg-success/10 animate-pop-in"><span class="material-symbols-outlined text-[44px] text-success fill-icon">check_circle</span></div></div> <h2 class="mb-2 text-center text-[20px] font-extrabold text-on-surface tracking-tight">Pendaftaran Berhasil 🎉</h2> <p class="mb-6 text-center text-[13px] text-on-surface-variant leading-relaxed">Akun Anda menunggu persetujuan dari Owner. Silakan hubungi Owner untuk mengaktifkan akun Anda.</p> <a href="/login" class="pressable flex items-center justify-center gap-2 h-13 rounded-xl bg-primary bg-brand-gradient text-white font-bold text-[15px] shadow-[0_6px_16px_-6px_rgb(37_99_235/0.5)]"><span class="material-symbols-outlined text-[20px]">login</span> Kembali ke Login</a></div>`);
			} else {
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`<form method="POST" class="app-card shadow-card-lg rounded-3xl p-6 space-y-4 max-w-sm mx-auto w-full animate-fade-slide-up" style="animation-delay:0.08s"><div class="pb-1"><h2 class="text-[20px] font-extrabold text-on-surface tracking-tight">Buat Akun Baru</h2> <p class="text-[13px] text-on-surface-variant mt-0.5">Daftar gratis, tanpa kartu kredit</p></div> `);
				if (form?.error) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<div class="flex items-center gap-2.5 rounded-xl bg-error-container px-4 py-3 text-[13px] font-semibold text-on-error-container animate-fade-in"><span class="material-symbols-outlined text-[20px]">error</span> ${escape_html(form.error)}</div>`);
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
				$$renderer.push(`<!----> <div class="pt-1">`);
				Button($$renderer, {
					type: "submit",
					size: "lg",
					disabled: loading,
					class: "w-full",
					children: ($$renderer) => {
						$$renderer.push(`<!---->Daftar Sekarang`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----></div> <p class="text-center text-[13px] text-on-surface-variant pt-1">Sudah punya akun? <a href="/login" class="font-bold text-primary">Masuk</a></p></form>`);
			}
			$$renderer.push(`<!--]--> <p class="text-center text-[11px] text-outline mt-6">LaundryKu v2.0 — Gratis untuk semua pemilik laundry</p></div></div>`);
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
