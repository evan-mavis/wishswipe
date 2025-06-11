import { Home, Inbox, Search, Settings } from "lucide-react";
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
import { ModeToggle } from "../modeToggle/ModeToggle";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AppHeader } from "../appHeader/AppHeader";

const items = [
  {
    title: "Home",
    url: "#",
    icon: Home,
  },
  {
    title: "WishList",
    url: "#",
    icon: Inbox,
  },
  {
    title: "Explore",
    url: "#",
    icon: Search,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
];

export function AppSidebar() {
  const { user, signOutUser, signInWithGoogle } = useAuth();

  return (
    <>
      <Sidebar>
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
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <div className="flex items-center justify-between p-4">
            {user ? (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger className="ml-2" asChild>
                    <Avatar>
                      <AvatarImage
                        src={user.photoURL || ""}
                        alt={user.displayName || "Avatar"}
                      />
                      <AvatarFallback>
                        {user.displayName?.[0] || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="p-2">
                    <DropdownMenuItem onClick={signOutUser}>
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button
                className="border-2 border-fuchsia-300"
                variant="outline"
                onClick={signInWithGoogle}
              >
                Sign In
              </Button>
            )}
            <ModeToggle />
          </div>
        </SidebarFooter>
      </Sidebar>
    </>
  );
}
