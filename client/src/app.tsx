import { AppSidebar } from "./components/appSidebar/AppSidebar";
import { ThemeProvider } from "./components/themeProvider/ThemeProvider";
import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar";

function App({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <ThemeProvider>
          <SidebarTrigger />
          {children}
        </ThemeProvider>
      </main>
    </SidebarProvider>
  );
}

export default App;
