export interface LoginOrCreateUserPayload {
	firebase_uid: string;
	email: string;
	display_name?: string | null;
	photo_url?: string | null;
}

export interface LoginOrCreateUserResponse {
	user: {
		email: string;
		displayName?: string | null;
		photoUrl?: string | null;
	};
	created: boolean;
}
