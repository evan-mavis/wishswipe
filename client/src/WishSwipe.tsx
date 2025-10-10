import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./components/themeProvider/ThemeProvider";
import { AuthProvider } from "./contexts/AuthContext";
import { AppRoutes } from "./routes/AppRoutes";
import { getAuth, getRedirectResult } from "firebase/auth";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";

function WishSwipe() {
	useEffect(() => {
		const auth = getAuth();
		getRedirectResult(auth).catch((error) => {
			console.error("Auth redirect error:", error);
		});
	}, []);

	return (
		<TooltipProvider>
			<ThemeProvider>
				<AuthProvider>
					<BrowserRouter>
						<AppRoutes />
						<Toaster position="top-center" richColors />
					</BrowserRouter>
				</AuthProvider>
			</ThemeProvider>
		</TooltipProvider>
	);
}

export default WishSwipe;
