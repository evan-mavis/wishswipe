export interface LoginOrCreateUserPayload {
	firebase_uid: string;
	email: string;
	display_name?: string | null;
	photo_url?: string | null;
}

export interface LoginOrCreateUserResponse {
	user: {
		id: string;
		firebase_uid: string;
		email: string;
		display_name?: string | null;
		photo_url?: string | null;
		created_at: string;
		updated_at: string;
		last_login?: string | null;
	};
	created: boolean;
}
