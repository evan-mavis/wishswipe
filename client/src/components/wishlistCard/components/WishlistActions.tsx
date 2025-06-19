import { Plus, Trash2, GripVertical, Settings2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
	if (reorderMode) {
		return (
			<div className="flex gap-2">
				<Button variant="ghost" onClick={onReorderCancel} className="gap-2">
					<X className="h-4 w-4" />
					Cancel
				</Button>
				<Button variant="default" onClick={onReorderSave} className="gap-2">
					<Check className="h-4 w-4" />
					Save Changes
				</Button>
			</div>
		);
	}

	if (deleteMode) {
		return (
			<div className="flex gap-2">
				<Button variant="ghost" onClick={onDeleteCancel} className="gap-2">
					<X className="h-4 w-4" />
					Cancel
				</Button>
				<Button
					variant="destructive"
					onClick={onDeleteConfirm}
					disabled={selectedCount === 0}
					className="gap-2"
				>
					<Trash2 className="h-4 w-4" />
					Delete ({selectedCount})
				</Button>
			</div>
		);
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" className="gap-2">
					<Settings2 className="h-4 w-4" />
					Wishlist Actions
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
