import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";

interface ProtectedRouteProps {
	children: React.ReactNode;
	requireAuth?: boolean;
}

export function ProtectedRoute({
	children,
	requireAuth = true,
}: ProtectedRouteProps) {
	const { user, loading } = useAuth();

	useEffect(() => {
		console.log("ProtectedRoute state:", {
			loading,
			user: !!user,
			requireAuth,
		});
	}, [loading, user, requireAuth]);

	if (loading) {
		return <div>Loading...</div>;
	}

	if (requireAuth && !user) {
		console.log("Redirecting to login - no user");
		return <Navigate to="/login" replace />;
	}

	if (!requireAuth && user) {
		console.log("Redirecting to home - user exists");
		return <Navigate to="/" replace />;
	}

	return <>{children}</>;
}
