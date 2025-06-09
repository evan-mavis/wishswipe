import { AppSidebar } from "./components/appSidebar/AppSidebar";
import { ThemeProvider } from "./components/themeProvider/ThemeProvider";
import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar";

function App({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <ThemeProvider>
        <AppSidebar />
        <main className="w-full">
          <SidebarTrigger />
          {children}
        </main>
      </ThemeProvider>
    </SidebarProvider>
  );
}

export default App;
