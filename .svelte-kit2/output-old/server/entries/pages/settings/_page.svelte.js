import { C as escape_html, a as head, i as ensure_array_like } from "../../../chunks/server.js";
import "../../../chunks/forms.js";
//#region src/routes/settings/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data, form } = $$props;
		const roles = [
			{
				value: "owner",
				label: "Owner"
			},
			{
				value: "admin",
				label: "Admin"
			},
			{
				value: "staff",
				label: "Staff"
			}
		];
		head("1i19ct2", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Profil - LaundryKu</title>`);
			});
		});
		$$renderer.push(`<div class="space-y-stack-lg"><section class="bg-surface-container-lowest border border-outline-variant rounded-xl p-stack-md shadow-sm"><h2 class="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-4">Informasi Akun</h2> <div class="space-y-3"><div class="flex items-center gap-3 p-3 bg-surface rounded-lg border border-outline-variant"><span class="material-symbols-outlined text-on-surface-variant">person</span> <div><p class="font-body-md text-on-surface">Nama</p> <p class="text-label-md text-on-surface-variant">${escape_html(data.user?.name)}</p></div></div> <div class="flex items-center gap-3 p-3 bg-surface rounded-lg border border-outline-variant"><span class="material-symbols-outlined text-on-surface-variant">email</span> <div><p class="font-body-md text-on-surface">Email</p> <p class="text-label-md text-on-surface-variant">${escape_html(data.user?.email)}</p></div></div> <div class="flex items-center gap-3 p-3 bg-surface rounded-lg border border-outline-variant"><span class="material-symbols-outlined text-on-surface-variant">shield</span> <div><p class="font-body-md text-on-surface">Role</p> <p class="text-label-md text-on-surface-variant capitalize">${escape_html(data.user?.role)}</p></div></div></div> `);
		if (data.user?.role === "owner") {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<form method="POST" action="?/changeRole" class="mt-3"><label for="role" class="text-label-md text-on-surface-variant">Ganti Role</label> <div class="mt-2 flex gap-2"><select id="role" name="role" class="flex-1 h-11 px-3 bg-surface rounded-lg border border-outline-variant text-body-md"><!--[-->`);
			const each_array = ensure_array_like(roles);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let r = each_array[$$index];
				$$renderer.option({
					value: r.value,
					selected: data.user?.role === r.value
				}, ($$renderer) => {
					$$renderer.push(`${escape_html(r.label)}`);
				});
			}
			$$renderer.push(`<!--]--></select> <button type="submit" class="px-4 h-11 bg-primary text-on-primary rounded-lg font-bold text-label-md">Simpan</button></div> `);
			if (form?.roleSuccess) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<p class="mt-2 text-body-sm text-success">Role berhasil diubah</p>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			if (form?.roleError) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<p class="mt-2 text-body-sm text-error">${escape_html(form.roleError)}</p>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></form>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></section> <section class="bg-surface-container-lowest border border-outline-variant rounded-xl p-stack-md shadow-sm"><div class="flex items-center justify-between mb-4"><h2 class="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Keamanan</h2> <button type="button" class="text-label-md text-primary font-bold">${escape_html("Ubah Password")}</button></div> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></section> <section class="bg-surface-container-lowest border border-outline-variant rounded-xl p-stack-md shadow-sm"><h2 class="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-4">Tentang</h2> <div class="space-y-2 text-body-sm text-on-surface-variant"><p>LaundryKu v1.0</p> <p>Sistem Manajemen Laundry berbasis AI</p> <p>Gratis untuk semua pemilik laundry</p></div></section> <form method="POST" action="/logout"><button type="submit" class="w-full h-12 flex items-center justify-center gap-2 bg-error-container text-error rounded-xl font-bold text-label-md active:scale-[0.98] transition-transform"><span class="material-symbols-outlined">logout</span> Keluar dari Akun</button></form></div>`);
	});
}
//#endregion
export { _page as default };
