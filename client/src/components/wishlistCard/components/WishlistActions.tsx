import { Plus, Trash2, GripVertical, Settings2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface WishlistActionsProps {
	reorderMode: boolean;
	deleteMode: boolean;
	selectedCount: number;
	onReorderSave: () => void;
	onReorderCancel: () => void;
	onDeleteCancel: () => void;
	onDeleteConfirm: () => void;
	onModeChange: (mode: "reorder" | "delete" | null) => void;
	onNewWishlist: () => void;
}

export function WishlistActions({
	reorderMode,
	deleteMode,
	selectedCount,
	onReorderSave,
	onReorderCancel,
	onDeleteCancel,
	onDeleteConfirm,
	onModeChange,
	onNewWishlist,
}: WishlistActionsProps) {
	const isMobile = useIsMobile();

	if (reorderMode) {
		return (
			<div className="flex gap-2">
				<Button
					variant="ghost"
					onClick={onReorderCancel}
					className={cn("gap-2", isMobile && "h-8 w-8 p-0")}
				>
					<X className="h-4 w-4" />
					{!isMobile && "Cancel"}
				</Button>
				<Button
					variant="default"
					onClick={onReorderSave}
					className={cn("gap-2", isMobile && "h-8 w-8 p-0")}
				>
					<Check className="h-4 w-4" />
					{!isMobile && "Save Changes"}
				</Button>
			</div>
		);
	}

	if (deleteMode) {
		return (
			<div className="flex gap-2">
				<Button
					variant="ghost"
					onClick={onDeleteCancel}
					className={cn("gap-2", isMobile && "h-8 w-8 p-0")}
				>
					<X className="h-4 w-4" />
					{!isMobile && "Cancel"}
				</Button>
				<Button
					variant="destructive"
					onClick={onDeleteConfirm}
					disabled={selectedCount === 0}
					className={cn("gap-2", isMobile && "h-8 w-8 p-0")}
				>
					<Trash2 className="h-4 w-4" />
					{!isMobile && `Delete (${selectedCount})`}
				</Button>
			</div>
		);
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="outline"
					className={cn("gap-2", isMobile && "h-8 w-8 p-0")}
				>
					<Settings2 className="h-4 w-4" />
					{!isMobile && "Wishlist Actions"}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuGroup>
					<DropdownMenuItem onClick={onNewWishlist} className="gap-2">
						<Plus className="h-4 w-4" />
						New Wishlist
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => onModeChange("reorder")}
						className="gap-2"
					>
						<GripVertical className="h-4 w-4" />
						Reorder Mode
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => onModeChange("delete")}
						className="gap-2"
					>
						<Trash2 className="h-4 w-4" />
						Delete Mode
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
