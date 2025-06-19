import { Outlet } from "react-router-dom";
import { AppSidebar } from "../appSidebar/AppSidebar";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "../ui/sidebar";

export function Layout() {
	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset>
				<div className="fixed top-4 left-4 z-50 md:hidden">
					<SidebarTrigger />
				</div>
				<div className="fixed top-1/2 z-50 hidden -translate-y-1/2 transition-all duration-200 ease-linear peer-data-[state=collapsed]:left-2 peer-data-[state=expanded]:left-[calc(var(--sidebar-width)-24px)] md:flex">
					<SidebarTrigger />
				</div>
				<div className="pl-8 md:p-0">
					<Outlet />
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
