import { Scroll, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WishlistCard } from "../../components/wishlistCard/WishlistCard";
import type { Listing, WishList } from "@/types/listing";
import { useState } from "react";

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
	const [selectedLists, setSelectedLists] = useState<Set<string>>(new Set());

	const toggleDeleteMode = () => {
		if (deleteMode && selectedLists.size > 0) {
			// Delete selected lists
			setWishlists((prev) =>
				prev.filter((list) => !selectedLists.has(list.id))
			);
			setSelectedLists(new Set());
		}
		setDeleteMode(!deleteMode);
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

	return (
		<div className="container mx-auto p-8">
			<div className="mb-8 flex items-center justify-between">
				<h1 className="flex items-center text-3xl font-bold">
					<Scroll />
					<div className="ml-2">My Wishlists</div>
				</h1>
				<div className="flex gap-2">
					<Button
						variant={deleteMode ? "destructive" : "outline"}
						onClick={toggleDeleteMode}
					>
						<Trash2 className="mr-2 h-4 w-4" />
						{deleteMode ? `Delete (${selectedLists.size})` : "Delete Mode"}
					</Button>
					<Button onClick={() => console.log("Add new wishlist")}>
						New Wishlist
						<Plus className="ml-2 h-4 w-4" />
					</Button>
				</div>
			</div>
			<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
				{wishlists.map((wishlist) => (
					<WishlistCard
						key={wishlist.id}
						{...wishlist}
						deleteMode={deleteMode}
						isSelected={selectedLists.has(wishlist.id)}
						onSelect={() => toggleListSelection(wishlist.id)}
					/>
				))}
			</div>
		</div>
	);
}
