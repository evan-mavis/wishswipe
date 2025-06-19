import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./components/themeProvider/ThemeProvider";
import { AppRoutes } from "./routes/AppRoutes";

function App() {
	return (
		<ThemeProvider>
			<BrowserRouter>
				<AppRoutes />
			</BrowserRouter>
		</ThemeProvider>
	);
}

export default App;
