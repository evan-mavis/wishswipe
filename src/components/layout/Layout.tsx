"use client";

import { BarChart, MessageSquare, Scroll, Search, Settings } from "lucide-react";
import { usePathname } from "next/navigation";
import { AppSidebar } from "../appSidebar/AppSidebar";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "../ui/sidebar";

export function Layout({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();

	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset>
				<div className="flex h-14 shrink-0 items-center gap-3 px-4 pt-[env(safe-area-inset-top)] md:hidden">
					<SidebarTrigger />
					<MobilePageTitle pathname={pathname} />
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

function MobilePageTitle({ pathname }: { pathname: string }) {
	const titleClassName =
		"text-foreground flex min-w-0 items-center gap-2 text-xl leading-none font-bold";
	const iconClassName = "h-5 w-5 shrink-0";

	if (pathname === "/wishlists") {
		return (
			<h1 className={titleClassName}>
				<Scroll className={iconClassName} />
				<span className="truncate">My Wishlists</span>
			</h1>
		);
	}

	if (pathname === "/insights") {
		return (
			<h1 className={titleClassName}>
				<BarChart className={iconClassName} />
				<span className="truncate">Swipe Insights</span>
			</h1>
		);
	}

	if (pathname === "/settings") {
		return (
			<h1 className={titleClassName}>
				<Settings className={iconClassName} />
				<span className="truncate">Settings</span>
			</h1>
		);
	}

	if (pathname === "/feedback") {
		return (
			<h1 className={titleClassName}>
				<MessageSquare className={iconClassName} />
				<span className="truncate">Feedback</span>
			</h1>
		);
	}

	if (pathname === "/swipe") {
		return (
			<h1 className={titleClassName}>
				<Search className={iconClassName} />
				<span className="truncate">WishSwipe</span>
			</h1>
		);
	}

	return (
		<h1 className={titleClassName}>
			<Search className={iconClassName} />
			<span className="truncate">WishSwipe</span>
		</h1>
	);
}
