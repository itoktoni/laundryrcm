<script>
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { formatDate } from '$lib/utils.js';

	let { data, form } = $props();

	let editRoleId = $state(null);

	const statusColor = {
		pending: 'bg-pending-container text-pending',
		approved: 'bg-success-container text-success',
		rejected: 'bg-error-container text-error'
	};

	const statusLabel = {
		pending: 'Menunggu',
		approved: 'Aktif',
		rejected: 'Ditolak'
	};
</script>

<svelte:head>
	<title>Manajemen User - LaundryKu</title>
</svelte:head>

<section class="mb-stack-lg">
	<h2 class="font-headline-md text-headline-md text-on-surface">Manajemen User</h2>
	<p class="font-body-sm text-on-surface-variant">Kelola akun karyawan & persetujuan pendaftar</p>
</section>

{#if form?.error}
	<div class="mb-stack-md rounded-lg bg-error-container p-3 text-body-sm text-error">{form.error}</div>
{/if}

<section class="space-y-3">
	{#each data.users as user (user.user_id)}
		<div class="bg-surface-container-lowest rounded-xl border border-outline-variant p-4">
			<div class="flex items-start justify-between gap-3">
				<div class="min-w-0 flex-1">
					<div class="flex items-center gap-2">
						<h3 class="font-body-lg text-on-surface font-semibold truncate">{user.user_name}</h3>
						<span class="shrink-0 rounded-full px-2 py-0.5 text-label-sm font-medium {statusColor[user.user_status]}">
							{statusLabel[user.user_status]}
						</span>
					</div>
					<p class="text-body-sm text-on-surface-variant truncate">{user.user_email}</p>
					<div class="mt-1 flex items-center gap-3">
						<span class="text-label-sm text-on-surface-variant capitalize">Role: {user.user_role}</span>
						<span class="text-label-sm text-outline">·</span>
						<span class="text-label-sm text-on-surface-variant">{formatDate(user.user_created_at)}</span>
					</div>
				</div>
			</div>

			<div class="mt-3 flex flex-wrap gap-2 border-t border-outline-variant pt-3">
				{#if user.user_status === 'pending'}
					<form method="POST" action="?/approve" use:enhance={() => async ({ result }) => { if (result.type === 'success') await invalidateAll(); }}>
						<input type="hidden" name="id" value={user.user_id} />
						<button type="submit" class="flex items-center gap-1.5 rounded-lg bg-success text-on-success px-3 py-2 text-label-md font-bold active:scale-95 transition-transform">
							<span class="material-symbols-outlined text-[18px]">check</span>
							Setujui
						</button>
					</form>
					<form method="POST" action="?/reject" use:enhance={() => async ({ result }) => { if (result.type === 'success') await invalidateAll(); }}>
						<input type="hidden" name="id" value={user.user_id} />
						<button type="submit" class="flex items-center gap-1.5 rounded-lg bg-error-container text-error px-3 py-2 text-label-md font-bold active:scale-95 transition-transform">
							<span class="material-symbols-outlined text-[18px]">close</span>
							Tolak
						</button>
					</form>
				{:else if user.user_status === 'rejected'}
					<form method="POST" action="?/approve" use:enhance={() => async ({ result }) => { if (result.type === 'success') await invalidateAll(); }}>
						<input type="hidden" name="id" value={user.user_id} />
						<button type="submit" class="flex items-center gap-1.5 rounded-lg bg-success text-on-success px-3 py-2 text-label-md font-bold active:scale-95 transition-transform">
							<span class="material-symbols-outlined text-[18px]">check</span>
							Aktifkan
						</button>
					</form>
				{/if}

				{#if user.user_status === 'approved'}
					{#if editRoleId === user.user_id}
						<form method="POST" action="?/setRole" use:enhance={() => async ({ result }) => { if (result.type === 'success') { editRoleId = null; await invalidateAll(); } }} class="flex items-center gap-2">
							<input type="hidden" name="id" value={user.user_id} />
							<select name="role" class="h-9 rounded-lg border border-outline-variant bg-surface px-2 text-body-sm text-on-surface">
								<option value="staff" selected={user.user_role === 'staff'}>Staff</option>
								<option value="admin" selected={user.user_role === 'admin'}>Admin</option>
								<option value="owner" selected={user.user_role === 'owner'}>Owner</option>
							</select>
							<button type="submit" class="rounded-lg bg-primary text-on-primary px-3 py-2 text-label-md font-bold active:scale-95 transition-transform">Simpan</button>
							<button type="button" onclick={() => (editRoleId = null)} class="rounded-lg bg-surface-container-high text-on-surface-variant px-3 py-2 text-label-md font-bold">Batal</button>
						</form>
					{:else}
						<button onclick={() => (editRoleId = user.user_id)} class="flex items-center gap-1.5 rounded-lg bg-surface-container-high text-on-surface-variant px-3 py-2 text-label-md font-bold active:scale-95 transition-transform">
							<span class="material-symbols-outlined text-[18px]">edit</span>
							Ubah Role
						</button>
						{#if user.user_id !== data.user?.id}
							<form method="POST" action="?/reject" use:enhance={() => async ({ result }) => { if (result.type === 'success') await invalidateAll(); }}>
								<input type="hidden" name="id" value={user.user_id} />
								<button type="submit" class="flex items-center gap-1.5 rounded-lg bg-error-container text-error px-3 py-2 text-label-md font-bold active:scale-95 transition-transform">
									<span class="material-symbols-outlined text-[18px]">block</span>
									Blokir
								</button>
							</form>
						{/if}
					{/if}
				{/if}
			</div>
		</div>
	{/each}

	{#if data.users.length === 0}
		<p class="text-body-sm text-on-surface-variant">Belum ada user terdaftar</p>
	{/if}
</section>
