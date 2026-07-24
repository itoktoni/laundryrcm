import { db } from '$lib/server/db.js';
import { json } from '@sveltejs/kit';
import { getSettings } from '$lib/server/settings.js';

function deg2rad(deg) {
	return deg * (Math.PI / 180);
}

function getDistanceFromLatLonInMeters(lat1, lon1, lat2, lon2) {
	const R = 6371e3;
	const dLat = deg2rad(lat2 - lat1);
	const dLon = deg2rad(lon2 - lon1);
	const a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
		Math.sin(dLon / 2) * Math.sin(dLon / 2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	return R * c;
}

export async function POST({ request, locals }) {
	if (!locals.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const body = await request.json();
	const { type, photo, latitude, longitude, location_name } = body;

	if (!type || !photo || latitude == null || longitude == null) {
		return json({ error: 'Data tidak lengkap' }, { status: 400 });
	}

	if (!['masuk', 'keluar'].includes(type)) {
		return json({ error: 'Tipe absensi tidak valid' }, { status: 400 });
	}

	const settings = await getSettings();
	const storeLat = parseFloat(settings.store_lat || '');
	const storeLng = parseFloat(settings.store_lng || '');

	if (isNaN(storeLat) || isNaN(storeLng)) {
		return json({ error: 'Lokasi toko belum dikonfigurasi di pengaturan' }, { status: 400 });
	}

	const distance = getDistanceFromLatLonInMeters(storeLat, storeLng, latitude, longitude);
	const isWithinRadius = distance <= 500;

	const attendanceId = crypto.randomUUID();
	await db.execute({
		sql: `INSERT INTO attendance (attendance_id, user_id, type, latitude, longitude, photo, location_name, distance_meters, status)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
		args: [
			attendanceId,
			locals.user.id,
			type,
			latitude,
			longitude,
			photo,
			location_name || null,
			Math.round(distance),
			isWithinRadius ? 'success' : 'failed'
		]
	});

	return json({
		success: true,
		status: isWithinRadius ? 'success' : 'failed',
		distance: Math.round(distance),
		message: isWithinRadius
			? `Absen ${type} berhasil (jarak ${Math.round(distance)}m)`
			: `Absen gagal: Anda berada di luar radius 500m (jarak ${Math.round(distance)}m)`
	});
}
