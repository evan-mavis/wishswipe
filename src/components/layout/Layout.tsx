"use client";

import { AppSidebar } from "../appSidebar/AppSidebar";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "../ui/sidebar";
import { usePathname } from "next/navigation";

export function Layout({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();
	const isSwipeRoute = pathname === "/swipe";

	return (
		<SidebarProvider>
			<div className="pointer-events-none fixed top-[calc(env(safe-area-inset-top)+1rem)] left-[calc(env(safe-area-inset-left)+1rem)] z-50 md:hidden">
				<div className="pointer-events-auto">
					<SidebarTrigger />
				</div>
			</div>
			<AppSidebar />
			<SidebarInset>
				<div
					className="fixed top-1/2 z-50 hidden -translate-y-1/2 peer-data-[state=collapsed]:left-2 peer-data-[state=expanded]:left-[calc(var(--sidebar-width)-24px)] md:flex"
					style={{ isolation: "isolate" }}
				>
					<SidebarTrigger />
				</div>
				<div className={`ml-2 ${isSwipeRoute ? "" : "pt-14 md:pt-0"}`}>
					{children}
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
