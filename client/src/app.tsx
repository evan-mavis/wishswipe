import { AppSidebar } from "./components/appSidebar/AppSidebar";
import { ThemeProvider } from "./components/themeProvider/ThemeProvider";
import { SidebarProvider } from "./components/ui/sidebar";
import { useAuth } from "./hooks/use-auth";
import Home from "./pages/home/Home";
import { Engine } from "./pages/engine/Engine";

function App() {
  const { user } = useAuth();

  return (
    <ThemeProvider>
      {!user ? (
        <SidebarProvider>
          <div className="flex h-screen">
            <AppSidebar />
            <Engine />
          </div>
        </SidebarProvider>
      ) : (
        <Home />
      )}
    </ThemeProvider>
  );
}

export default App;
