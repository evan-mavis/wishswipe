import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import { Spinner } from "@/components/ui/spinner";
import { ProtectedRoute } from "@/components/protectedRoute/ProtectedRoute";
import { Layout } from "@/components/layout/Layout";

const SwipeView = lazy(() =>
	import("@/pages/swipeView/SwipeView").then((m) => ({ default: m.SwipeView }))
);
const Login = lazy(() => import("@/pages/login/Login"));
const Wishlist = lazy(() =>
	import("@/pages/wishlist/Wishlist").then((m) => ({ default: m.Wishlist }))
);
const Feedback = lazy(() =>
	import("@/pages/feedback/Feedback").then((m) => ({ default: m.Feedback }))
);
const Preferences = lazy(() =>
	import("@/pages/preferences/Preferences").then((m) => ({
		default: m.Preferences,
	}))
);
const SwipeInsights = lazy(() =>
	import("@/pages/swipeInsights/SwipeInsights").then((m) => ({
		default: m.SwipeInsights,
	}))
);

export function AppRoutes() {
	return (
		<Suspense
			fallback={
				<div className="grid place-items-center p-6">
					<Spinner className="size-6" />
				</div>
			}
		>
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
					<Route path="/insights" element={<SwipeInsights />} />
				</Route>
				<Route path="*" element={<Navigate to="/" replace />} />
			</Routes>
		</Suspense>
	);
}
