export const prerender = false;
export const ssr = false;

export function load() {
	try {
		if (typeof localStorage !== 'undefined') {
			const data = localStorage.getItem('laundry_user');
			return {
				user: data ? JSON.parse(data) : null
			};
		}
	} catch {
		// ignore
	}
	return { user: null };
}