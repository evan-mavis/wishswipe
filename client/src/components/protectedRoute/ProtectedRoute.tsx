import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";

interface ProtectedRouteProps {
	children: React.ReactNode;
	requireAuth?: boolean;
}

export function ProtectedRoute({
	children,
	requireAuth = true,
}: ProtectedRouteProps) {
	const { user } = useAuth();

	if (requireAuth && !user) {
		return <Navigate to="/login" replace />;
	}

	if (!requireAuth && user) {
		return <Navigate to="/" replace />;
	}

	return <>{children}</>;
}
