import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/protectedRoute/ProtectedRoute";
import { Layout } from "@/components/layout/Layout";
import { SwipeView } from "@/pages/swipeView/SwipeView";
import Login from "@/pages/login/Login";

export function AppRoutes() {
	return (
		<Routes>
			<Route
				path="/login"
				element={
					<ProtectedRoute requireAuth={false}>
						<Login />
					</ProtectedRoute>
				}
			/>
			<Route
				element={
					<ProtectedRoute>
						<Layout />
					</ProtectedRoute>
				}
			>
				<Route path="/" element={<SwipeView />} />
				<Route path="/wishlist" element={<div>Wishlist Page</div>} />
				<Route path="/settings" element={<div>Settings Page</div>} />
			</Route>
		</Routes>
	);
}
