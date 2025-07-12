import {
	Search,
	Settings,
	MessageSquare,
	Scroll,
	BarChart,
} from "lucide-react";
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
	useSidebar,
} from "@/components/ui/sidebar";
import { AppHeader } from "../appHeader/AppHeader";
import { SidebarFooterContent } from "./components/sidebarFooterContent/SidebarFooterContent";
import { useIsMobile } from "@/hooks/use-mobile";
import { userInteractionService } from "@/services/userInteractionService";
import { useRef, useEffect } from "react";

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
		title: "Swipe Insights",
		url: "/insights",
		icon: BarChart,
	},
	{
		title: "Preferences",
		url: "/preferences",
		icon: Settings,
	},
	{
		title: "Feedback",
		url: "/feedback",
		icon: MessageSquare,
	},
];

export function AppSidebar() {
	const isMobile = useIsMobile();
	const location = useLocation();
	const { setOpenMobile } = useSidebar();
	const flushTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	// Cleanup timeout on unmount
	useEffect(() => {
		return () => {
			if (flushTimeoutRef.current) {
				clearTimeout(flushTimeoutRef.current);
			}
		};
	}, []);

	const handleNavigationClick = () => {
		// Close mobile sidebar when navigation item is clicked
		if (isMobile) {
			setOpenMobile(false);
		}
	};

	const debouncedFlush = () => {
		// Clear any existing timeout
		if (flushTimeoutRef.current) {
			clearTimeout(flushTimeoutRef.current);
		}

		// Set a new timeout to flush after a short delay
		flushTimeoutRef.current = setTimeout(() => {
			userInteractionService.forceFlush();
		}, 100); // 100ms delay
	};

	const handleSidebarHover = () => {
		// Flush interactions when user hovers over sidebar (indicating potential navigation)
		debouncedFlush();
	};

	const handleMenuItemHover = () => {
		// Flush interactions when user hovers over menu items
		debouncedFlush();
	};

	return (
		<Sidebar
			side={isMobile ? "bottom" : "left"}
			onMouseEnter={handleSidebarHover}
		>
			<SidebarHeader>
				<AppHeader />
			</SidebarHeader>
			<SidebarContent onMouseEnter={handleSidebarHover}>
				<SidebarGroup>
					<SidebarGroupLabel>Navigation</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{items.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton
										asChild
										isActive={location.pathname === item.url}
										onClick={handleNavigationClick}
										onMouseEnter={handleMenuItemHover}
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
