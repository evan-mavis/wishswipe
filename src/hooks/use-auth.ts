"use client";

import { authClient } from "@/lib/auth-client";

export function useAuth() {
	const { data, isPending, error } = authClient.useSession();

	const signOutUser = async () => {
		await authClient.signOut({
			fetchOptions: {
				onSuccess: () => {
					window.location.href = "/login";
				},
			},
		});
	};

	return {
		user: data?.user ?? null,
		loading: isPending,
		error: error?.message ?? null,
		signOutUser,
		clearError: () => {},
	};
}
