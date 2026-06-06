"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";
import { ModeToggle } from "@/components/modeToggle/ModeToggle";

export function SidebarFooterContent() {
	const { user, signOutUser } = useAuth();
	const displayName = user?.name || "User";

	return (
		<div className="flex items-center justify-between p-4">
			<DropdownMenu>
				<DropdownMenuTrigger className="ml-2" asChild>
					<Avatar>
						<AvatarImage
							src={user?.image || ""}
							alt={displayName}
						/>
						<AvatarFallback>{displayName[0] || "U"}</AvatarFallback>
					</Avatar>
				</DropdownMenuTrigger>
				<DropdownMenuContent className="p-2">
					<DropdownMenuItem onClick={signOutUser}>Sign out</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
			<ModeToggle />
		</div>
	);
}
