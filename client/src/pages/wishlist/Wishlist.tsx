import {
	Scroll,
	Plus,
	Trash2,
	GripVertical,
	Settings2,
	Check,
	X,
} from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { WishlistCard } from "../../components/wishlistCard/WishlistCard";
import type { WishList } from "@/types/listing";
import { useState } from "react";
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

const mockWishlists: WishList[] = [
	{
		id: "1",
		title: "Tech Gadgets",
		description: "My tech wishlist",
		createdAt: new Date(),
		updatedAt: new Date(),
		items: [
			{
				id: 1,
				imageUrl: "/test-image-1.jpg",
				details: {
					title: "MacBook Pro",
					seller: "TechDeals_USA",
					price: 1299.99,
					condition: "New",
				},
			},
			{
				id: 2,
				imageUrl: "/test-image-2.jpg",
				details: {
					title: "iPad Pro",
					seller: "Apple",
					price: 799.99,
					condition: "New",
				},
			},
		],
	},
	{
		id: "2",
		title: "Home Office",
		description: "Office setup items",
		createdAt: new Date(),
		updatedAt: new Date(),
		items: [
			{
				id: 3,
				imageUrl: "/test-image-3.jpg",
				details: {
					title: "Standing Desk",
					seller: "IKEA",
					price: 499.99,
					condition: "New",
				},
			},
		],
	},
	{
		id: "3",
		title: "Tech Gadgets",
		description: "My tech wishlist",
		createdAt: new Date(),
		updatedAt: new Date(),
		items: [
			{
				id: 1,
				imageUrl: "/test-image-1.jpg",
				details: {
					title: "MacBook Pro",
					seller: "TechDeals_USA",
					price: 1299.99,
					condition: "New",
				},
			},
			{
				id: 2,
				imageUrl: "/test-image-2.jpg",
				details: {
					title: "iPad Pro",
					seller: "Apple",
					price: 799.99,
					condition: "New",
				},
			},
			{
				id: 3,
				imageUrl: "/test-image-1.jpg",
				details: {
					title: "MacBook Pro",
					seller: "TechDeals_USA",
					price: 1299.99,
					condition: "New",
				},
			},
			{
				id: 4,
				imageUrl: "/test-image-2.jpg",
				details: {
					title: "iPad Pro",
					seller: "Apple",
					price: 799.99,
					condition: "New",
				},
			},

			{
				id: 5,
				imageUrl: "/test-image-2.jpg",
				details: {
					title: "iPad Pro",
					seller: "Apple",
					price: 799.99,
					condition: "New",
				},
			},

			{
				id: 6,
				imageUrl: "/test-image-2.jpg",
				details: {
					title: "iPad Pro",
					seller: "Apple",
					price: 799.99,
					condition: "New",
				},
			},
		],
	},
	{
		id: "4",
		title: "Tech Gadgets",
		description: "My tech wishlist",
		createdAt: new Date(),
		updatedAt: new Date(),
		items: [
			{
				id: 1,
				imageUrl: "/test-image-1.jpg",
				details: {
					title: "MacBook Pro",
					seller: "TechDeals_USA",
					price: 1299.99,
					condition: "New",
				},
			},
			{
				id: 2,
				imageUrl: "/test-image-2.jpg",
				details: {
					title: "iPad Pro",
					seller: "Apple",
					price: 799.99,
					condition: "New",
				},
			},
		],
	},
	{
		id: "5",
		title: "Home Office",
		description: "Office setup items",
		createdAt: new Date(),
		updatedAt: new Date(),
		items: [
			{
				id: 3,
				imageUrl: "/test-image-3.jpg",
				details: {
					title: "Standing Desk",
					seller: "IKEA",
					price: 499.99,
					condition: "New",
				},
			},
		],
	},
	{
		id: "6",
		title: "Tech Gadgets",
		description: "My tech wishlist",
		createdAt: new Date(),
		updatedAt: new Date(),
		items: [
			{
				id: 1,
				imageUrl: "/test-image-1.jpg",
				details: {
					title: "MacBook Pro",
					seller: "TechDeals_USA",
					price: 1299.99,
					condition: "New",
				},
			},
			{
				id: 2,
				imageUrl: "/test-image-2.jpg",
				details: {
					title: "iPad Pro",
					seller: "Apple",
					price: 799.99,
					condition: "New",
				},
			},
			{
				id: 3,
				imageUrl: "/test-image-1.jpg",
				details: {
					title: "MacBook Pro",
					seller: "TechDeals_USA",
					price: 1299.99,
					condition: "New",
				},
			},
			{
				id: 4,
				imageUrl: "/test-image-2.jpg",
				details: {
					title: "iPad Pro",
					seller: "Apple",
					price: 799.99,
					condition: "New",
				},
			},

			{
				id: 5,
				imageUrl: "/test-image-2.jpg",
				details: {
					title: "iPad Pro",
					seller: "Apple",
					price: 799.99,
					condition: "New",
				},
			},

			{
				id: 6,
				imageUrl: "/test-image-2.jpg",
				details: {
					title: "iPad Pro",
					seller: "Apple",
					price: 799.99,
					condition: "New",
				},
			},
		],
	},
];

export function Wishlist() {
	const [wishlists, setWishlists] = useState(mockWishlists);
	const [deleteMode, setDeleteMode] = useState(false);
	const [reorderMode, setReorderMode] = useState(false);
	const [selectedLists, setSelectedLists] = useState<Set<string>>(new Set());
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

	const handleDeleteConfirm = () => {
		// Delete selected lists
		setWishlists((prev) => prev.filter((list) => !selectedLists.has(list.id)));
		setSelectedLists(new Set());
		setDeleteMode(false);
		setShowDeleteConfirm(false);
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
		setWishlists(mockWishlists); // Reset to original order
		setReorderMode(false);
	};

	const handleReorderSave = () => {
		// Here you would typically save the new order to your backend
		setReorderMode(false);
	};

	const renderActionButtons = () => {
		if (reorderMode) {
			return (
				<div className="flex gap-2">
					<Button
						variant="ghost"
						onClick={handleReorderCancel}
						className="gap-2"
					>
						<X className="h-4 w-4" />
						Cancel
					</Button>
					<Button
						variant="default"
						onClick={handleReorderSave}
						className="gap-2"
					>
						<Check className="h-4 w-4" />
						Save Changes
					</Button>
				</div>
			);
		}

		if (deleteMode) {
			return (
				<div className="flex gap-2">
					<Button
						variant="ghost"
						onClick={() => {
							setDeleteMode(false);
							setSelectedLists(new Set());
						}}
						className="gap-2"
					>
						<X className="h-4 w-4" />
						Cancel
					</Button>
					<Button
						variant="destructive"
						onClick={() => selectedLists.size > 0 && setShowDeleteConfirm(true)}
						disabled={selectedLists.size === 0}
						className="gap-2"
					>
						<Trash2 className="h-4 w-4" />
						Delete ({selectedLists.size})
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
						<DropdownMenuItem
							onClick={() => console.log("Add new wishlist")}
							className="gap-2"
						>
							<Plus className="h-4 w-4" />
							New Wishlist
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => {
								handleModeReset();
								setReorderMode(true);
							}}
							className="gap-2"
						>
							<GripVertical className="h-4 w-4" />
							{reorderMode ? "Exit Reorder Mode" : "Reorder Mode"}
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => {
								handleModeReset();
								setDeleteMode(true);
							}}
							className="gap-2"
						>
							<Trash2 className="h-4 w-4" />
							Delete Mode
						</DropdownMenuItem>
					</DropdownMenuGroup>
				</DropdownMenuContent>
			</DropdownMenu>
		);
	};

	return (
		<>
			<div className="container mx-auto p-8">
				<div className="mb-8 flex items-center justify-between">
					<h1 className="flex items-center text-3xl font-bold">
						<Scroll />
						<div className="ml-2 text-fuchsia-300">My Wishlists</div>
					</h1>
					{renderActionButtons()}
				</div>
				<Reorder.Group
					axis="y"
					values={wishlists}
					onReorder={reorderMode ? handleReorderLists : undefined}
					className="grid grid-cols-1 gap-6 pl-3"
				>
					{wishlists.map((wishlist) => (
						<Reorder.Item
							key={wishlist.id}
							value={wishlist}
							className="relative w-full"
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
		</>
	);
}
