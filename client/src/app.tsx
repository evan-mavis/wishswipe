import { AppSidebar } from "./components/appSidebar/AppSidebar";
import { ThemeProvider } from "./components/themeProvider/ThemeProvider";
import { SidebarProvider } from "./components/ui/sidebar";
import { useAuth } from "./hooks/use-auth";
import Login from "./pages/login/Login";
import { SwipeView } from "./pages/swipeView/SwipeView";

function App() {
	const { user } = useAuth();

	return (
		<ThemeProvider>
			{user ? (
				<SidebarProvider>
					<AppSidebar />
					<SwipeView />
				</SidebarProvider>
			) : (
				<Login />
			)}
		</ThemeProvider>
	);
}

export default App;
