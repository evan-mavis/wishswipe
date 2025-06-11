import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Button } from "../../../ui/button";
import { useAuth } from "@/hooks/use-auth";
import { ModeToggle } from "@/components/modeToggle/ModeToggle";

export function SidebarFooterContent() {
  const { user, signOutUser, signInWithGoogle } = useAuth();

  return (
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
                <AvatarFallback>{user.displayName?.[0] || "U"}</AvatarFallback>
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
  );
}
