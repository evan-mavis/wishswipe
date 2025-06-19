import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./components/themeProvider/ThemeProvider";
import { AppRoutes } from "./routes/AppRoutes";
import { getAuth, getRedirectResult } from "firebase/auth";

function App() {
	useEffect(() => {
		const auth = getAuth();
		getRedirectResult(auth).catch((error) => {
			console.error("Auth redirect error:", error);
		});
	}, []);

	return (
		<ThemeProvider>
			<BrowserRouter>
				<AppRoutes />
			</BrowserRouter>
		</ThemeProvider>
	);
}

export default App;
