import { Search, Settings, MessageSquare, Scroll } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { AppHeader } from "../appHeader/AppHeader";
import { SidebarFooterContent } from "./components/sidebarFooterContent/SidebarFooterContent";
import { useIsMobile } from "@/hooks/use-mobile";

const items = [
	{
		title: "Explore",
		url: "/",
		icon: Search,
	},
	{
		title: "My WishLists",
		url: "/wishlist",
		icon: Scroll,
	},
	{
		title: "Feedback",
		url: "/feedback",
		icon: MessageSquare,
	},
	{
		title: "Preferences",
		url: "/preferences",
		icon: Settings,
	},
];

export function AppSidebar() {
	const isMobile = useIsMobile();
	const location = useLocation();

	return (
		<Sidebar side={isMobile ? "bottom" : "left"}>
			<SidebarHeader>
				<AppHeader />
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Navigation</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{items.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton
										asChild
										isActive={location.pathname === item.url}
									>
										<Link to={item.url}>
											<item.icon />
											<span>{item.title}</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<SidebarFooterContent />
			</SidebarFooter>
		</Sidebar>
	);
}
