import "../../../chunks/index-server.js";
import { C as attr, a as ensure_array_like, i as derived, l as stringify, o as head, t as attr_class, w as escape_html } from "../../../chunks/server.js";
import "../../../chunks/toast.js";
//#region src/routes/attendance/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data } = $$props;
		let attendanceStatus = derived(() => data.attendanceStatus);
		let todayRecords = derived(() => data.todayRecords);
		let storeLocation = derived(() => data.storeLocation);
		let userRole = derived(() => data.userRole);
		let photoData = null;
		let isSavingLocation = false;
		function getActionLabel() {
			if (attendanceStatus() === "need_masuk") return "Absen Masuk";
			if (attendanceStatus() === "need_keluar") return "Absen Keluar";
			return "Absen";
		}
		function getStatusText() {
			if (attendanceStatus() === "complete") return "Absensi hari ini selesai";
			if (attendanceStatus() === "need_masuk") return "Belum absen masuk";
			if (attendanceStatus() === "need_keluar") return "Silakan absen keluar";
			return "Belum ada absensi";
		}
		function getStatusColor() {
			if (attendanceStatus() === "complete") return "text-success";
			if (attendanceStatus() === "need_masuk") return "text-error";
			return "text-warning";
		}
		function canSubmit() {
			return photoData;
		}
		head("12uchig", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Absensi - LaundryKu</title>`);
			});
		});
		$$renderer.push(`<div class="space-y-stack-lg"><div><h1 class="font-headline-lg text-headline-lg text-on-surface">Absensi</h1> <p class="text-body-sm text-on-surface-variant">Ambil foto dan lokasi untuk absen</p></div> `);
		if (storeLocation().latitude && storeLocation().longitude) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant flex items-center justify-between"><div class="flex items-center gap-3"><span class="material-symbols-outlined text-primary text-2xl">location_on</span> <div><p class="text-label-sm text-on-surface-variant">Lokasi toko</p> <p class="font-body-md text-on-surface">${escape_html(storeLocation().name || "Toko")}</p> <p class="text-label-sm text-on-surface-variant">${escape_html(storeLocation().latitude)}, ${escape_html(storeLocation().longitude)}</p></div></div> `);
			if (userRole() !== "staff") {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<button type="button"${attr("disabled", isSavingLocation, true)} class="flex items-center gap-1 px-3 h-9 bg-surface-container-high text-on-surface rounded-lg text-label-md font-medium active:scale-95 transition-transform disabled:opacity-50"><span class="material-symbols-outlined text-[16px]">my_location</span> ${escape_html("Update")}</button>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div class="bg-warning-container border border-warning rounded-xl p-4"><div class="flex items-center gap-3"><span class="material-symbols-outlined text-warning text-2xl">warning</span> <div class="flex-1"><p class="text-body-sm text-warning font-semibold">Lokasi toko belum dikonfigurasi</p> `);
			if (userRole() !== "staff") {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<p class="text-label-sm text-warning mt-1">Tekan tombol di bawah untuk set lokasi toko ke posisi Anda saat ini</p>`);
			} else {
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`<p class="text-label-sm text-warning mt-1">Hubungi owner/admin untuk mengatur lokasi toko</p>`);
			}
			$$renderer.push(`<!--]--></div></div> `);
			if (userRole() !== "staff") {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<button type="button"${attr("disabled", isSavingLocation, true)} class="mt-3 w-full h-11 bg-primary text-on-primary rounded-lg font-bold text-label-md active:scale-95 transition-transform disabled:opacity-50 flex items-center justify-center gap-2"><span class="material-symbols-outlined text-[18px]">my_location</span> ${escape_html("Set Lokasi Toko Saat Ini")}</button>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div>`);
		}
		$$renderer.push(`<!--]--> <div class="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant"><div class="flex items-center gap-3 mb-2"><span${attr_class(`material-symbols-outlined text-2xl ${stringify(getStatusColor())}`)}>${escape_html(attendanceStatus() === "complete" ? "check_circle" : attendanceStatus() === "need_keluar" ? "login" : "logout")}</span> <div><p class="font-body-md text-on-surface font-semibold">${escape_html(getStatusText())}</p> <p class="text-label-sm text-on-surface-variant">${escape_html(attendanceStatus() === "complete" ? "Anda sudah absen masuk dan keluar hari ini" : attendanceStatus() === "need_keluar" ? "Anda perlu absen keluar" : "Anda perlu absen masuk hari ini")}</p></div></div></div> `);
		if (todayRecords().length > 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="space-y-2"><!--[-->`);
			const each_array = ensure_array_like(todayRecords());
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let record = each_array[$$index];
				$$renderer.push(`<div class="bg-surface-container-low p-3 rounded-lg border border-outline-variant flex justify-between items-center"><div><p class="font-body-md text-on-surface capitalize">${escape_html(record.type === "masuk" ? "Masuk" : "Keluar")}</p> <p class="text-label-sm text-on-surface-variant">${escape_html(new Date(record.created_at).toLocaleTimeString("id-ID"))}</p></div> <span${attr_class(`text-label-sm ${record.status === "success" ? "text-success" : "text-error"}`)}>${escape_html(record.status === "success" ? "Berhasil" : "Gagal")} (${escape_html(record.distance_meters)}m)</span></div>`);
			}
			$$renderer.push(`<!--]--></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (attendanceStatus() !== "complete") {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="space-y-stack-md"><div class="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant space-y-4"><h3 class="font-label-md text-label-md text-on-surface font-bold">1. Ambil Foto</h3> `);
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div class="flex flex-col gap-3"><button type="button" class="w-full h-11 bg-primary text-on-primary rounded-lg font-bold text-label-md active:scale-95 transition-transform">Buka Kamera</button></div>`);
			$$renderer.push(`<!--]--></div> <div class="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant space-y-4"><h3 class="font-label-md text-label-md text-on-surface font-bold">2. Lokasi</h3> `);
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<button type="button" class="w-full h-11 bg-primary text-on-primary rounded-lg font-bold text-label-md active:scale-95 transition-transform">Dapatkan Lokasi</button>`);
			$$renderer.push(`<!--]--></div> <button type="button"${attr("disabled", !canSubmit(), true)} class="w-full h-12 bg-success text-on-primary rounded-xl font-bold text-label-md active:scale-95 transition-transform disabled:opacity-50 disabled:active:scale-100">${escape_html(getActionLabel())}</button> `);
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div class="bg-success-container border border-success rounded-xl p-4"><div class="flex items-center gap-3"><span class="material-symbols-outlined text-success text-3xl">check_circle</span> <div><p class="font-body-md text-success font-semibold">Absensi hari ini selesai</p> <p class="text-label-sm text-success">Anda sudah melakukan absen masuk dan keluar</p></div></div></div>`);
		}
		$$renderer.push(`<!--]--></div>`);
	});
}
//#endregion
export { _page as default };
