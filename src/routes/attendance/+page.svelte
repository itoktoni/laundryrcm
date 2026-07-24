<script>
	import { onMount } from 'svelte';
	import { toast } from '$lib/stores/toast.js';

	let { data } = $props();
	let attendanceStatus = $derived(data.attendanceStatus);
	let todayRecords = $derived(data.todayRecords);
	let storeLocation = $derived(data.storeLocation);
	let userRole = $derived(data.userRole);

	let photoData = $state(null);
	let locationData = $state(null);
	let isSubmitting = $state(false);
	let resultMessage = $state('');
	let resultType = $state('');
	let isSavingLocation = $state(false);

	let videoRef = $state(null);
	let stream = $state(null);
	let cameraActive = $state(false);

	onMount(() => {
		return () => {
			if (stream) {
				stream.getTracks().forEach((t) => t.stop());
			}
		};
	});

	function getActionLabel() {
		if (attendanceStatus === 'need_masuk') return 'Absen Masuk';
		if (attendanceStatus === 'need_keluar') return 'Absen Keluar';
		return 'Absen';
	}

	function getStatusText() {
		if (attendanceStatus === 'complete') return 'Absensi hari ini selesai';
		if (attendanceStatus === 'need_masuk') return 'Belum absen masuk';
		if (attendanceStatus === 'need_keluar') return 'Silakan absen keluar';
		return 'Belum ada absensi';
	}

	function getStatusColor() {
		if (attendanceStatus === 'complete') return 'text-success';
		if (attendanceStatus === 'need_masuk') return 'text-error';
		return 'text-warning';
	}

	async function startCamera() {
		try {
			const mediaStream = await navigator.mediaDevices.getUserMedia({
				video: { facingMode: 'environment' },
				audio: false
			});
			stream = mediaStream;
			if (videoRef) {
				videoRef.srcObject = mediaStream;
			}
			cameraActive = true;
		} catch (err) {
			toast('Gagal mengakses kamera: ' + err.message, 'error');
		}
	}

	function capturePhoto() {
		if (!videoRef || !stream) return;
		const canvas = document.createElement('canvas');
		canvas.width = videoRef.videoWidth || 640;
		canvas.height = videoRef.videoHeight || 480;
		const ctx = canvas.getContext('2d');
		ctx.drawImage(videoRef, 0, 0, canvas.width, canvas.height);
		photoData = canvas.toDataURL('image/jpeg', 0.8);
		stream.getTracks().forEach((t) => t.stop());
		stream = null;
		cameraActive = false;
		toast('Foto berhasil diambil');
	}

	async function getLocation() {
		return new Promise((resolve, reject) => {
			if (!navigator.geolocation) {
				return reject(new Error('Geolocation tidak didukung'));
			}
			navigator.geolocation.getCurrentPosition(
				(pos) => {
					resolve({
						latitude: pos.coords.latitude,
						longitude: pos.coords.longitude,
						accuracy: pos.coords.accuracy
					});
				},
				(err) => reject(err),
				{ enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
			);
		});
	}

	async function setStoreLocation() {
		isSavingLocation = true;
		try {
			const loc = await getLocation();
			const res = await fetch('/api/attendance/location', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					latitude: loc.latitude,
					longitude: loc.longitude,
					name: 'Lokasi Laundry'
				})
			});
			const result = await res.json();
			if (res.ok && result.success) {
				toast('Lokasi toko berhasil disimpan', 'success');
				window.location.reload();
			} else {
				toast(result.error || 'Gagal menyimpan lokasi', 'error');
			}
		} catch (err) {
			toast('Gagal mendapatkan lokasi: ' + err.message, 'error');
		} finally {
			isSavingLocation = false;
		}
	}

	async function handleCapture() {
		if (!photoData) {
			toast('Ambil foto terlebih dahulu', 'error');
			return;
		}

		try {
			locationData = await getLocation();
		} catch (err) {
			toast('Gagal mendapatkan lokasi: ' + err.message, 'error');
			return;
		}

		isSubmitting = true;
		resultMessage = '';

		try {
			const type = attendanceStatus === 'need_keluar' ? 'keluar' : 'masuk';
			const res = await fetch('/api/attendance', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					type,
					photo: photoData,
					latitude: locationData.latitude,
					longitude: locationData.longitude,
					location_name: storeLocation.name || 'Lokasi absensi'
				})
			});

			const result = await res.json();

			if (res.ok && result.success) {
				resultMessage = result.message;
				resultType = result.status === 'success' ? 'success' : 'error';
				if (result.status === 'success') {
					toast(result.message, 'success');
				} else {
					toast(result.message, 'error');
				}
			} else {
				resultMessage = result.error || 'Gagal absen';
				resultType = 'error';
				toast(resultMessage, 'error');
			}
		} catch (err) {
			resultMessage = 'Terjadi kesalahan: ' + err.message;
			resultType = 'error';
			toast(resultMessage, 'error');
		} finally {
			isSubmitting = false;
		}
	}

	function reset() {
		photoData = null;
		locationData = null;
		resultMessage = '';
		resultType = '';
	}

	function canSubmit() {
		return !isSubmitting && photoData && locationData && attendanceStatus !== 'complete';
	}
</script>

<svelte:head>
	<title>Absensi - LaundryKu</title>
</svelte:head>

<div class="space-y-stack-lg">
	<div>
		<h1 class="font-headline-lg text-headline-lg text-on-surface">Absensi</h1>
		<p class="text-body-sm text-on-surface-variant">Ambil foto dan lokasi untuk absen</p>
	</div>

	{#if storeLocation.latitude && storeLocation.longitude}
		<div class="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant flex items-center justify-between">
			<div class="flex items-center gap-3">
				<span class="material-symbols-outlined text-primary text-2xl">location_on</span>
				<div>
					<p class="text-label-sm text-on-surface-variant">Lokasi toko</p>
					<p class="font-body-md text-on-surface">{storeLocation.name || 'Toko'}</p>
					<p class="text-label-sm text-on-surface-variant">{storeLocation.latitude}, {storeLocation.longitude}</p>
				</div>
			</div>
			{#if userRole !== 'staff'}
				<button
					type="button"
					onclick={setStoreLocation}
					disabled={isSavingLocation}
					class="flex items-center gap-1 px-3 h-9 bg-surface-container-high text-on-surface rounded-lg text-label-md font-medium active:scale-95 transition-transform disabled:opacity-50"
				>
					<span class="material-symbols-outlined text-[16px]">my_location</span>
					{isSavingLocation ? 'Menyimpan...' : 'Update'}
				</button>
			{/if}
		</div>
	{:else}
		<div class="bg-warning-container border border-warning rounded-xl p-4">
			<div class="flex items-center gap-3">
				<span class="material-symbols-outlined text-warning text-2xl">warning</span>
				<div class="flex-1">
					<p class="text-body-sm text-warning font-semibold">Lokasi toko belum dikonfigurasi</p>
					{#if userRole !== 'staff'}
						<p class="text-label-sm text-warning mt-1">Tekan tombol di bawah untuk set lokasi toko ke posisi Anda saat ini</p>
					{:else}
						<p class="text-label-sm text-warning mt-1">Hubungi owner/admin untuk mengatur lokasi toko</p>
					{/if}
				</div>
			</div>
			{#if userRole !== 'staff'}
				<button
					type="button"
					onclick={setStoreLocation}
					disabled={isSavingLocation}
					class="mt-3 w-full h-11 bg-primary text-on-primary rounded-lg font-bold text-label-md active:scale-95 transition-transform disabled:opacity-50 flex items-center justify-center gap-2"
				>
					<span class="material-symbols-outlined text-[18px]">my_location</span>
					{isSavingLocation ? 'Menyimpan lokasi...' : 'Set Lokasi Toko Saat Ini'}
				</button>
			{/if}
		</div>
	{/if}

	<div class="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant">
		<div class="flex items-center gap-3 mb-2">
			<span class="material-symbols-outlined text-2xl {getStatusColor()}">
				{attendanceStatus === 'complete' ? 'check_circle' : attendanceStatus === 'need_keluar' ? 'login' : 'logout'}
			</span>
			<div>
				<p class="font-body-md text-on-surface font-semibold">{getStatusText()}</p>
				<p class="text-label-sm text-on-surface-variant">
					{attendanceStatus === 'complete' ? 'Anda sudah absen masuk dan keluar hari ini' : attendanceStatus === 'need_keluar' ? 'Anda perlu absen keluar' : 'Anda perlu absen masuk hari ini'}
				</p>
			</div>
		</div>
	</div>

	{#if todayRecords.length > 0}
		<div class="space-y-2">
			{#each todayRecords as record}
				<div class="bg-surface-container-low p-3 rounded-lg border border-outline-variant flex justify-between items-center">
					<div>
						<p class="font-body-md text-on-surface capitalize">{record.type === 'masuk' ? 'Masuk' : 'Keluar'}</p>
						<p class="text-label-sm text-on-surface-variant">{new Date(record.created_at).toLocaleTimeString('id-ID')}</p>
					</div>
					<span class="text-label-sm {record.status === 'success' ? 'text-success' : 'text-error'}">
						{record.status === 'success' ? 'Berhasil' : 'Gagal'} ({record.distance_meters}m)
					</span>
				</div>
			{/each}
		</div>
	{/if}

	{#if attendanceStatus !== 'complete'}
		<div class="space-y-stack-md">
			<div class="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant space-y-4">
				<h3 class="font-label-md text-label-md text-on-surface font-bold">1. Ambil Foto</h3>

				{#if cameraActive}
					<div class="relative rounded-lg overflow-hidden bg-black">
						<video bind:this={videoRef} autoplay playsinline class="w-full h-64 object-cover"></video>
						<div class="absolute bottom-4 left-0 right-0 flex justify-center gap-3">
							<button
								type="button"
								onclick={capturePhoto}
								class="px-6 h-12 bg-primary text-on-primary rounded-full font-bold active:scale-95 transition-transform"
							>
								Ambil Foto
							</button>
							<button
								type="button"
								onclick={() => { stream?.getTracks().forEach(t => t.stop()); stream = null; cameraActive = false; }}
								class="px-6 h-12 bg-surface-container-high text-on-surface rounded-full font-bold active:scale-95 transition-transform"
							>
								Batal
							</button>
						</div>
					</div>
				{:else if photoData}
					<div class="relative rounded-lg overflow-hidden bg-black">
						<img src={photoData} alt="Foto absensi" class="w-full h-64 object-cover" />
					</div>
					<button
						type="button"
						onclick={reset}
						class="w-full h-11 bg-surface-container-high text-on-surface rounded-lg font-bold text-label-md active:scale-95 transition-transform"
					>
						Ambil Ulang Foto
					</button>
				{:else}
					<div class="flex flex-col gap-3">
						<button
							type="button"
							onclick={startCamera}
							class="w-full h-11 bg-primary text-on-primary rounded-lg font-bold text-label-md active:scale-95 transition-transform"
						>
							Buka Kamera
						</button>
					</div>
				{/if}
			</div>

			<div class="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant space-y-4">
				<h3 class="font-label-md text-label-md text-on-surface font-bold">2. Lokasi</h3>

				{#if locationData}
					<div class="bg-surface-container-low p-3 rounded-lg">
						<p class="text-body-sm text-on-surface">
							Lat: {locationData.latitude.toFixed(6)}, Lng: {locationData.longitude.toFixed(6)}
						</p>
						{#if storeLocation.latitude && storeLocation.longitude}
							{@const R = 6371e3}
							{@const toRad = (deg) => deg * (Math.PI / 180)}
							{@const dLat = toRad(locationData.latitude - parseFloat(storeLocation.latitude))}
							{@const dLon = toRad(locationData.longitude - parseFloat(storeLocation.longitude))}
							{@const a = Math.sin(dLat/2)*Math.sin(dLat/2) + Math.cos(toRad(parseFloat(storeLocation.latitude)))*Math.cos(toRad(locationData.latitude))*Math.sin(dLon/2)*Math.sin(dLon/2)}
							{@const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))}
							{@const dist = Math.round(R * c)}
							<p class="text-label-sm {dist <= 500 ? 'text-success' : 'text-error'}">
								Jarak dari toko: {dist}m {dist <= 500 ? '(dalam radius)' : '(di luar radius 500m)'}
							</p>
						{/if}
					</div>
					<button
						type="button"
						onclick={() => { locationData = null; }}
						class="w-full h-11 bg-surface-container-high text-on-surface rounded-lg font-bold text-label-md active:scale-95 transition-transform"
					>
						Ambil Ulang Lokasi
					</button>
				{:else}
					<button
						type="button"
						onclick={async () => {
							try {
								locationData = await getLocation();
								toast('Lokasi berhasil diambil', 'success');
							} catch (err) {
								toast('Gagal mendapatkan lokasi: ' + err.message, 'error');
							}
						}}
						class="w-full h-11 bg-primary text-on-primary rounded-lg font-bold text-label-md active:scale-95 transition-transform"
					>
						Dapatkan Lokasi
					</button>
				{/if}
			</div>

			<button
				type="button"
				onclick={handleCapture}
				disabled={!canSubmit()}
				class="w-full h-12 bg-success text-on-primary rounded-xl font-bold text-label-md active:scale-95 transition-transform disabled:opacity-50 disabled:active:scale-100"
			>
				{isSubmitting ? 'Menyimpan...' : getActionLabel()}
			</button>

			{#if resultMessage}
				<div class="p-4 rounded-xl border {resultType === 'success' ? 'bg-success-container border-success text-success' : 'bg-error-container border-error text-error'}">
					<p class="font-body-md font-semibold">{resultMessage}</p>
				</div>
			{/if}
		</div>
	{:else}
		<div class="bg-success-container border border-success rounded-xl p-4">
			<div class="flex items-center gap-3">
				<span class="material-symbols-outlined text-success text-3xl">check_circle</span>
				<div>
					<p class="font-body-md text-success font-semibold">Absensi hari ini selesai</p>
					<p class="text-label-sm text-success">Anda sudah melakukan absen masuk dan keluar</p>
				</div>
			</div>
		</div>
	{/if}
</div>
