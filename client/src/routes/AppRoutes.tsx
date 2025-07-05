import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/protectedRoute/ProtectedRoute";
import { Layout } from "@/components/layout/Layout";
import { SwipeView } from "@/pages/swipeView/SwipeView";
import Login from "@/pages/login/Login";
import { Wishlist } from "@/pages/wishlist/Wishlist";
import { Feedback } from "@/pages/feedback/Feedback";
import { Preferences } from "@/pages/preferences/Preferences";

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
				<Route path="/wishlist" element={<Wishlist />} />
				<Route path="/feedback" element={<Feedback />} />
				<Route path="/preferences" element={<Preferences />} />
			</Route>
		</Routes>
	);
}
