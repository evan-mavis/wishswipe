import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./components/themeProvider/ThemeProvider";
import { AppRoutes } from "./routes/AppRoutes";
import { getAuth, getRedirectResult } from "firebase/auth";
import { TooltipProvider } from "@/components/ui/tooltip";

function MyApp() {
	useEffect(() => {
		const auth = getAuth();
		getRedirectResult(auth).catch((error) => {
			console.error("Auth redirect error:", error);
		});
	}, []);

	return (
		<TooltipProvider>
			<ThemeProvider>
				<BrowserRouter>
					<AppRoutes />
				</BrowserRouter>
			</ThemeProvider>
		</TooltipProvider>
	);
}

export default MyApp;
