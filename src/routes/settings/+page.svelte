<script>
	import { enhance } from '$app/forms';

	let { data, form } = $props();

	const roles = [
		{ value: 'owner', label: 'Owner' },
		{ value: 'admin', label: 'Admin' },
		{ value: 'staff', label: 'Staff' }
	];

	let showPw = $state(false);
</script>

<svelte:head>
	<title>Profil - LaundryKu</title>
</svelte:head>

<div class="space-y-stack-lg">

	<!-- Profile Info -->
	<section class="bg-surface-container-lowest border border-outline-variant rounded-xl p-stack-md shadow-sm">
		<h2 class="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-4">Informasi Akun</h2>
		<div class="space-y-3">
			<div class="flex items-center gap-3 p-3 bg-surface rounded-lg border border-outline-variant">
				<span class="material-symbols-outlined text-on-surface-variant">person</span>
				<div>
					<p class="font-body-md text-on-surface">Nama</p>
					<p class="text-label-md text-on-surface-variant">{data.user?.name}</p>
				</div>
			</div>
			<div class="flex items-center gap-3 p-3 bg-surface rounded-lg border border-outline-variant">
				<span class="material-symbols-outlined text-on-surface-variant">email</span>
				<div>
					<p class="font-body-md text-on-surface">Email</p>
					<p class="text-label-md text-on-surface-variant">{data.user?.email}</p>
				</div>
			</div>
			<div class="flex items-center gap-3 p-3 bg-surface rounded-lg border border-outline-variant">
				<span class="material-symbols-outlined text-on-surface-variant">shield</span>
				<div>
					<p class="font-body-md text-on-surface">Role</p>
					<p class="text-label-md text-on-surface-variant capitalize">{data.user?.role}</p>
				</div>
			</div>
		</div>

		{#if data.user?.role === 'owner'}
			<form method="POST" action="?/changeRole" use:enhance class="mt-3">
				<label for="role" class="text-label-md text-on-surface-variant">Ganti Role</label>
				<div class="mt-2 flex gap-2">
					<select id="role" name="role" class="flex-1 h-11 px-3 bg-surface rounded-lg border border-outline-variant text-body-md">
						{#each roles as r}
							<option value={r.value} selected={data.user?.role === r.value}>{r.label}</option>
						{/each}
					</select>
					<button type="submit" class="px-4 h-11 bg-primary text-on-primary rounded-lg font-bold text-label-md">Simpan</button>
				</div>
				{#if form?.roleSuccess}
					<p class="mt-2 text-body-sm text-success">Role berhasil diubah</p>
				{/if}
				{#if form?.roleError}
					<p class="mt-2 text-body-sm text-error">{form.roleError}</p>
				{/if}
			</form>
		{/if}
	</section>

	<!-- Change Password -->
	<section class="bg-surface-container-lowest border border-outline-variant rounded-xl p-stack-md shadow-sm">
		<div class="flex items-center justify-between mb-4">
			<h2 class="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Keamanan</h2>
			<button type="button" onclick={() => (showPw = !showPw)} class="text-label-md text-primary font-bold">
				{showPw ? 'Tutup' : 'Ubah Password'}
			</button>
		</div>

		{#if showPw}
			<form method="POST" action="?/changePassword" use:enhance class="space-y-3">
				<div>
					<label for="cp" class="text-label-md text-on-surface-variant">Password Saat Ini</label>
					<input id="cp" name="current_password" type="password" required class="w-full h-11 px-4 bg-surface rounded-lg border border-outline-variant text-body-md" />
				</div>
				<div>
					<label for="np" class="text-label-md text-on-surface-variant">Password Baru</label>
					<input id="np" name="new_password" type="password" required minlength="6" class="w-full h-11 px-4 bg-surface rounded-lg border border-outline-variant text-body-md" />
				</div>
				<div>
					<label for="cf" class="text-label-md text-on-surface-variant">Konfirmasi Password</label>
					<input id="cf" name="confirm_password" type="password" required minlength="6" class="w-full h-11 px-4 bg-surface rounded-lg border border-outline-variant text-body-md" />
				</div>
				{#if form?.pwError}
					<p class="text-body-sm text-error">{form.pwError}</p>
				{/if}
				{#if form?.pwSuccess}
					<p class="text-body-sm text-success">Password berhasil diubah</p>
				{/if}
				<button type="submit" class="w-full h-11 bg-primary text-on-primary rounded-lg font-bold text-label-md active:scale-[0.98] transition-transform">
					Simpan Password
				</button>
			</form>
		{/if}
	</section>

	<!-- About -->
	<section class="bg-surface-container-lowest border border-outline-variant rounded-xl p-stack-md shadow-sm">
		<h2 class="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-4">Tentang</h2>
		<div class="space-y-2 text-body-sm text-on-surface-variant">
			<p>LaundryKu v1.0</p>
			<p>Sistem Manajemen Laundry berbasis AI</p>
			<p>Gratis untuk semua pemilik laundry</p>
		</div>
	</section>

	<!-- Logout -->
	<form method="POST" action="/logout" use:enhance>
		<button type="submit" class="w-full h-12 flex items-center justify-center gap-2 bg-error-container text-error rounded-xl font-bold text-label-md active:scale-[0.98] transition-transform">
			<span class="material-symbols-outlined">logout</span>
			Keluar dari Akun
		</button>
	</form>
</div>
