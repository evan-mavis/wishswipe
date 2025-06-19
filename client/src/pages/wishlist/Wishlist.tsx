import { Scroll } from "lucide-react";
import { WishlistCard } from "../../components/wishlistCard/WishlistCard";
import type { WishList } from "@/types/listing";

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
];

export function Wishlist() {
	return (
		<div className="container mx-auto p-8">
			<h1 className="mb-8 flex items-center text-3xl font-bold">
				<Scroll />
				<div className="ml-2">My Wishlists</div>
			</h1>
			<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
				{mockWishlists.map((wishlist) => (
					<WishlistCard key={wishlist.id} {...wishlist} />
				))}
			</div>
		</div>
	);
}
