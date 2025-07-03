import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useEffect } from "react";

interface EditWishlistDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSubmit: (data: {
		name: string;
		description: string;
		isFavorite: boolean;
	}) => void;
	initialName: string;
	initialDescription?: string;
	initialIsFavorite?: boolean;
}

export function EditWishlistDialog({
	open,
	onOpenChange,
	onSubmit,
	initialName,
	initialDescription = "",
	initialIsFavorite = false,
}: EditWishlistDialogProps) {
	const [name, setName] = useState(initialName);
	const [description, setDescription] = useState(initialDescription);
	const [isFavorite, setIsFavorite] = useState(initialIsFavorite);

	// Reset form when dialog opens
	useEffect(() => {
		if (open) {
			setName(initialName);
			setDescription(initialDescription);
			setIsFavorite(initialIsFavorite);
		}
	}, [open, initialName, initialDescription, initialIsFavorite]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (name.trim()) {
			onSubmit({ name, description, isFavorite });
			onOpenChange(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle className="text-fuchsia-300">Edit Wishlist</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="edit-name">Name</Label>
						<Input
							id="edit-name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder="My Wishlist"
							required
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="edit-description">Description</Label>
						<Textarea
							id="edit-description"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							placeholder="Add a description (optional)"
							className="resize-none"
						/>
					</div>
					<div className="flex items-center space-x-2">
						<Checkbox
							id="edit-favorite"
							checked={isFavorite}
							onCheckedChange={(checked) => setIsFavorite(checked as boolean)}
						/>
						<Label
							htmlFor="edit-favorite"
							className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
						>
							Favorite wishlist
						</Label>
					</div>
					<div className="flex justify-end gap-2">
						<Button
							type="button"
							variant="ghost"
							onClick={() => onOpenChange(false)}
						>
							Cancel
						</Button>
						<Button type="submit">Save Changes</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
