import { AppSidebar } from "./components/appSidebar/AppSidebar";
import { ThemeProvider } from "./components/themeProvider/ThemeProvider";
import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar";
import { useAuth } from "./hooks/use-auth";
import Home from "./pages/home/Home";
import { Main } from "./pages/main/Main";

function App() {
  const { user } = useAuth();

  return (
    <ThemeProvider>
      {user ? (
        <SidebarProvider>
          <div className="flex h-screen">
            <AppSidebar />
            <Main />
          </div>
        </SidebarProvider>
      ) : (
        <Home />
      )}
    </ThemeProvider>
  );
}

export default App;
