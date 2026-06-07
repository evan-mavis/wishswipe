"use client";

import { AppSidebar } from "../appSidebar/AppSidebar";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "../ui/sidebar";

export function Layout({ children }: { children: React.ReactNode }) {
	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset>
				<div className="flex h-14 shrink-0 items-center px-4 pt-[env(safe-area-inset-top)] md:hidden">
					<SidebarTrigger />
				</div>
				<div
					className="fixed top-1/2 z-50 hidden -translate-y-1/2 peer-data-[state=collapsed]:left-2 peer-data-[state=expanded]:left-[calc(var(--sidebar-width)-24px)] md:flex"
					style={{ isolation: "isolate" }}
				>
					<SidebarTrigger />
				</div>
				<div className="ml-2 flex min-h-0 flex-1 flex-col">
					{children}
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
