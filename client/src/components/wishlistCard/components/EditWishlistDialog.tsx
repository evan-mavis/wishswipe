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
import { useState, useEffect } from "react";

interface EditWishlistDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSubmit: (data: { name: string; description: string }) => void;
	initialName: string;
	initialDescription?: string;
}

export function EditWishlistDialog({
	open,
	onOpenChange,
	onSubmit,
	initialName,
	initialDescription = "",
}: EditWishlistDialogProps) {
	const [name, setName] = useState(initialName);
	const [description, setDescription] = useState(initialDescription);

	// Reset form when dialog opens
	useEffect(() => {
		if (open) {
			setName(initialName);
			setDescription(initialDescription);
		}
	}, [open, initialName, initialDescription]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (name.trim()) {
			onSubmit({ name, description });
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
