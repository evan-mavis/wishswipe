import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/themeProvider/ThemeProvider";
import { ProtectedRoute } from "./components/protectedRoute/ProtectedRoute";
import Login from "./pages/login/Login";
import { SwipeView } from "./pages/swipeView/SwipeView";
import { Layout } from "./components/layout/Layout";

function App() {
	return (
		<ThemeProvider>
			<BrowserRouter>
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
			</BrowserRouter>
		</ThemeProvider>
	);
}

export default App;
