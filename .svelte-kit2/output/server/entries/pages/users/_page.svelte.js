import { C as attr, a as ensure_array_like, l as stringify, o as head, t as attr_class, w as escape_html } from "../../../chunks/server.js";
import "../../../chunks/forms.js";
import { n as formatDate } from "../../../chunks/utils2.js";
//#region src/routes/users/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data, form } = $$props;
		let editRoleId = null;
		const statusColor = {
			pending: "bg-pending-container text-pending",
			approved: "bg-success-container text-success",
			rejected: "bg-error-container text-error"
		};
		const statusLabel = {
			pending: "Menunggu",
			approved: "Aktif",
			rejected: "Ditolak"
		};
		head("9fk07v", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Manajemen User - LaundryKu</title>`);
			});
		});
		$$renderer.push(`<section class="mb-stack-lg"><h2 class="font-headline-md text-headline-md text-on-surface">Manajemen User</h2> <p class="font-body-sm text-on-surface-variant">Kelola akun karyawan &amp; persetujuan pendaftar</p></section> `);
		if (form?.error) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="mb-stack-md rounded-lg bg-error-container p-3 text-body-sm text-error">${escape_html(form.error)}</div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <section class="space-y-3"><!--[-->`);
		const each_array = ensure_array_like(data.users);
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let user = each_array[$$index];
			$$renderer.push(`<div class="bg-surface-container-lowest rounded-xl border border-outline-variant p-4"><div class="flex items-start justify-between gap-3"><div class="min-w-0 flex-1"><div class="flex items-center gap-2"><h3 class="font-body-lg text-on-surface font-semibold truncate">${escape_html(user.user_name)}</h3> <span${attr_class(`shrink-0 rounded-full px-2 py-0.5 text-label-sm font-medium ${stringify(statusColor[user.user_status])}`)}>${escape_html(statusLabel[user.user_status])}</span></div> <p class="text-body-sm text-on-surface-variant truncate">${escape_html(user.user_email)}</p> <div class="mt-1 flex items-center gap-3"><span class="text-label-sm text-on-surface-variant capitalize">Role: ${escape_html(user.user_role)}</span> <span class="text-label-sm text-outline">·</span> <span class="text-label-sm text-on-surface-variant">${escape_html(formatDate(user.user_created_at))}</span></div></div></div> <div class="mt-3 flex flex-wrap gap-2 border-t border-outline-variant pt-3">`);
			if (user.user_status === "pending") {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<form method="POST" action="?/approve"><input type="hidden" name="id"${attr("value", user.user_id)}/> <button type="submit" class="flex items-center gap-1.5 rounded-lg bg-success text-on-success px-3 py-2 text-label-md font-bold active:scale-95 transition-transform"><span class="material-symbols-outlined text-[18px]">check</span> Setujui</button></form> <form method="POST" action="?/reject"><input type="hidden" name="id"${attr("value", user.user_id)}/> <button type="submit" class="flex items-center gap-1.5 rounded-lg bg-error-container text-error px-3 py-2 text-label-md font-bold active:scale-95 transition-transform"><span class="material-symbols-outlined text-[18px]">close</span> Tolak</button></form>`);
			} else if (user.user_status === "rejected") {
				$$renderer.push("<!--[1-->");
				$$renderer.push(`<form method="POST" action="?/approve"><input type="hidden" name="id"${attr("value", user.user_id)}/> <button type="submit" class="flex items-center gap-1.5 rounded-lg bg-success text-on-success px-3 py-2 text-label-md font-bold active:scale-95 transition-transform"><span class="material-symbols-outlined text-[18px]">check</span> Aktifkan</button></form>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			if (user.user_status === "approved") {
				$$renderer.push("<!--[0-->");
				if (editRoleId === user.user_id) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<form method="POST" action="?/setRole" class="flex items-center gap-2"><input type="hidden" name="id"${attr("value", user.user_id)}/> <select name="role" class="h-9 rounded-lg border border-outline-variant bg-surface px-2 text-body-sm text-on-surface">`);
					$$renderer.option({
						value: "staff",
						selected: user.user_role === "staff"
					}, ($$renderer) => {
						$$renderer.push(`Staff`);
					});
					$$renderer.option({
						value: "admin",
						selected: user.user_role === "admin"
					}, ($$renderer) => {
						$$renderer.push(`Admin`);
					});
					$$renderer.option({
						value: "owner",
						selected: user.user_role === "owner"
					}, ($$renderer) => {
						$$renderer.push(`Owner`);
					});
					$$renderer.push(`</select> <button type="submit" class="rounded-lg bg-primary text-on-primary px-3 py-2 text-label-md font-bold active:scale-95 transition-transform">Simpan</button> <button type="button" class="rounded-lg bg-surface-container-high text-on-surface-variant px-3 py-2 text-label-md font-bold">Batal</button></form>`);
				} else {
					$$renderer.push("<!--[-1-->");
					$$renderer.push(`<button class="flex items-center gap-1.5 rounded-lg bg-surface-container-high text-on-surface-variant px-3 py-2 text-label-md font-bold active:scale-95 transition-transform"><span class="material-symbols-outlined text-[18px]">edit</span> Ubah Role</button> `);
					if (user.user_id !== data.user?.id) {
						$$renderer.push("<!--[0-->");
						$$renderer.push(`<form method="POST" action="?/reject"><input type="hidden" name="id"${attr("value", user.user_id)}/> <button type="submit" class="flex items-center gap-1.5 rounded-lg bg-error-container text-error px-3 py-2 text-label-md font-bold active:scale-95 transition-transform"><span class="material-symbols-outlined text-[18px]">block</span> Blokir</button></form>`);
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]-->`);
				}
				$$renderer.push(`<!--]-->`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div></div>`);
		}
		$$renderer.push(`<!--]--> `);
		if (data.users.length === 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<p class="text-body-sm text-on-surface-variant">Belum ada user terdaftar</p>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></section>`);
	});
}
//#endregion
export { _page as default };
