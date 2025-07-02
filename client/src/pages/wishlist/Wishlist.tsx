import { GripVertical } from "lucide-react";
import { WishlistCard } from "../../components/wishlistCard/WishlistCard";
import type { WishList } from "@/types/wishlist";
import { useState, useEffect } from "react";
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Reorder } from "framer-motion";
import { cn } from "@/lib/utils";
import { WishlistHeader } from "../../components/wishlistCard/components/WishlistHeader";
import { WishlistActions } from "../../components/wishlistCard/components/WishlistActions";
import { NewWishlistDialog } from "../../components/wishlistCard/components/NewWishlistDialog";
import * as wishlistService from "../../services/wishlistService";

export function Wishlist() {
	const [wishlists, setWishlists] = useState<WishList[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [deleteMode, setDeleteMode] = useState(false);
	const [reorderMode, setReorderMode] = useState(false);
	const [selectedLists, setSelectedLists] = useState<Set<string>>(new Set());
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
	const [showNewWishlist, setShowNewWishlist] = useState(false);
	const [originalOrder, setOriginalOrder] = useState<WishList[]>([]);

	useEffect(() => {
		const loadWishlists = async () => {
			try {
				setLoading(true);
				const fetchedWishlists = await wishlistService.fetchWishlists();
				setWishlists(fetchedWishlists);
				setOriginalOrder(fetchedWishlists);
			} catch (err) {
				console.error("Error fetching wishlists:", err);
				setError("Failed to load wishlists");
			} finally {
				setLoading(false);
			}
		};

		loadWishlists();
	}, []);

	const handleDeleteConfirm = async () => {
		try {
			const selectedIds = Array.from(selectedLists);
			await wishlistService.deleteWishlists(selectedIds);

			// Update local state
			setWishlists((prev) =>
				prev.filter((list) => !selectedLists.has(list.id))
			);
			setSelectedLists(new Set());
			setDeleteMode(false);
			setShowDeleteConfirm(false);
		} catch (err) {
			console.error("Error deleting wishlists:", err);
			setError("Failed to delete wishlists");
		}
	};

	const toggleListSelection = (id: string) => {
		setSelectedLists((prev) => {
			const newSet = new Set(prev);
			if (newSet.has(id)) {
				newSet.delete(id);
			} else {
				newSet.add(id);
			}
			return newSet;
		});
	};

	const handleReorderLists = (newOrder: WishList[]) => {
		setWishlists(newOrder);
	};

	const handleModeReset = () => {
		setDeleteMode(false);
		setReorderMode(false);
		setSelectedLists(new Set());
	};

	const handleReorderCancel = () => {
		setWishlists(originalOrder); // Reset to original order
		setReorderMode(false);
	};

	const handleReorderSave = async () => {
		try {
			const wishlistIds = wishlists.map((w) => w.id);
			await wishlistService.reorderWishlists(wishlistIds);
			setOriginalOrder(wishlists); // Update original order after successful save
			setReorderMode(false);
		} catch (err) {
			console.error("Error reordering wishlists:", err);
			setError("Failed to reorder wishlists");
			// Revert to original order on error
			setWishlists(originalOrder);
			setReorderMode(false);
		}
	};

	const handleCreateWishlist = async ({
		title,
		description,
	}: {
		title: string;
		description: string;
	}) => {
		try {
			const newWishlist = await wishlistService.createWishlist({
				name: title,
				description,
				isFavorite: false,
			});

			setWishlists((prev) => [...prev, newWishlist]);
		} catch (err) {
			console.error("Error creating wishlist:", err);
			setError("Failed to create wishlist");
		}
	};

	const handleSetFavorite = async (id: string) => {
		try {
			const wishlist = wishlists.find((w) => w.id === id);
			if (!wishlist) return;

			const newFavoriteStatus = !wishlist.isFavorite;

			const updatedWishlist = await wishlistService.updateWishlist(id, {
				isFavorite: newFavoriteStatus,
			});

			// Update all wishlists: set the selected one as favorite and clear others
			setWishlists((prev) =>
				prev.map((w) => ({
					...w,
					isFavorite: w.id === id ? updatedWishlist.isFavorite : false,
				}))
			);
		} catch (err) {
			console.error("Error updating favorite status:", err);
			setError("Failed to update favorite status");
		}
	};

	const handleUpdateWishlist = async (
		id: string,
		data: { name: string; description: string }
	) => {
		try {
			const updatedWishlist = await wishlistService.updateWishlist(id, data);

			setWishlists((prev) =>
				prev.map((w) =>
					w.id === id
						? {
								...w,
								name: updatedWishlist.name,
								description: updatedWishlist.description,
							}
						: w
				)
			);
		} catch (err) {
			console.error("Error updating wishlist:", err);
			setError("Failed to update wishlist");
		}
	};

	const renderWishlistActions = () => (
		<WishlistActions
			reorderMode={reorderMode}
			deleteMode={deleteMode}
			selectedCount={selectedLists.size}
			onReorderSave={handleReorderSave}
			onReorderCancel={handleReorderCancel}
			onDeleteCancel={() => {
				setDeleteMode(false);
				setSelectedLists(new Set());
			}}
			onDeleteConfirm={() =>
				selectedLists.size > 0 && setShowDeleteConfirm(true)
			}
			onModeChange={(mode) => {
				handleModeReset();
				if (mode === "reorder") setReorderMode(true);
				if (mode === "delete") setDeleteMode(true);
			}}
			onNewWishlist={() => setShowNewWishlist(true)}
		/>
	);

	if (loading) {
		return (
			<div className="container mx-auto p-8">
				<div className="flex h-64 items-center justify-center">
					<div className="text-lg">Loading wishlists...</div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="container mx-auto p-8">
				<div className="flex h-64 items-center justify-center">
					<div className="text-lg text-red-500">{error}</div>
				</div>
			</div>
		);
	}

	return (
		<>
			<div className="container mx-auto p-8">
				<div className="mb-8 flex items-center justify-between">
					<WishlistHeader />
					{renderWishlistActions()}
				</div>
				<Reorder.Group
					axis="y"
					values={wishlists}
					onReorder={(newOrder: WishList[]) => {
						if (reorderMode) {
							handleReorderLists(newOrder);
						}
					}}
					className="grid grid-cols-1 gap-6 pl-3"
				>
					{wishlists.map((wishlist) => (
						<Reorder.Item
							key={wishlist.id}
							value={wishlist}
							className={cn(
								"relative w-full",
								reorderMode && "cursor-grab active:cursor-grabbing"
							)}
							drag={reorderMode}
						>
							<div className="group relative">
								{reorderMode && (
									<div className="absolute top-1/2 -translate-x-4 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100">
										<GripVertical className="text-muted-foreground h-4 w-4 cursor-grab" />
									</div>
								)}
								<WishlistCard
									{...wishlist}
									deleteMode={deleteMode}
									reorderMode={reorderMode}
									isSelected={selectedLists.has(wishlist.id)}
									onSelect={() => toggleListSelection(wishlist.id)}
									onFavorite={() => handleSetFavorite(wishlist.id)}
									onUpdate={handleUpdateWishlist}
								/>
							</div>
						</Reorder.Item>
					))}
				</Reorder.Group>
			</div>

			<AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete Wishlists</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to delete {selectedLists.size} wishlist
							{selectedLists.size > 1 ? "s" : ""}? This action cannot be undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel onClick={() => setShowDeleteConfirm(false)}>
							Cancel
						</AlertDialogCancel>
						<AlertDialogAction
							className="bg-red-500 hover:bg-red-600"
							onClick={handleDeleteConfirm}
						>
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			<NewWishlistDialog
				open={showNewWishlist}
				onOpenChange={setShowNewWishlist}
				onSubmit={handleCreateWishlist}
			/>
		</>
	);
}
