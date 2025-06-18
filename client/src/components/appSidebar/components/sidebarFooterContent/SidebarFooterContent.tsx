import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { useAuth } from "@/hooks/use-auth";
import { ModeToggle } from "@/components/modeToggle/ModeToggle";

export function SidebarFooterContent() {
  const { user, signOutUser } = useAuth();

  return (
    <div className="flex items-center justify-between p-4">
      <DropdownMenu>
        <DropdownMenuTrigger className="ml-2" asChild>
          <Avatar>
            <AvatarImage
              src={user?.photoURL || ""}
              alt={user?.displayName || "Avatar"}
            />
            <AvatarFallback>{user?.displayName?.[0] || "U"}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="p-2">
          <DropdownMenuItem onClick={signOutUser}>Sign Out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ModeToggle />
    </div>
  );
}
