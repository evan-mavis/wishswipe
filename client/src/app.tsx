import { AppSidebar } from "./components/appSidebar/AppSidebar";
import { ThemeProvider } from "./components/themeProvider/ThemeProvider";
import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar";

function App({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <ThemeProvider>
        <AppSidebar />
        <main className="flex w-full">
          <div className="flex items-center justify-center">
            <SidebarTrigger />
          </div>
          <div>{children}</div>
        </main>
      </ThemeProvider>
    </SidebarProvider>
  );
}

export default App;
