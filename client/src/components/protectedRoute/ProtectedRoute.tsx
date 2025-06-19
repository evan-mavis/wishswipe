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

	useEffect(() => {}, [loading, user, requireAuth]);

	if (loading) {
		return <div>Loading...</div>;
	}

	if (requireAuth && !user) {
		return <Navigate to="/login" replace />;
	}

	if (!requireAuth && user) {
		return <Navigate to="/" replace />;
	}

	return <>{children}</>;
}
