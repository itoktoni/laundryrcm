declare global {
	namespace App {
		interface Locals {
			user: {
				id: string;
				name: string;
				email: string;
				role: 'owner' | 'admin' | 'staff';
			} | null;
			sessionId: string | null;
		}
	}
}

export {};
