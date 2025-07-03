import { Label } from "@/components/ui/label";
import {
	Select,
	SelectTrigger,
	SelectContent,
	SelectItem,
	SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import * as wishlistService from "@/services/wishlistService";

interface WishlistSelectorProps {
	value: string;
	onChange: (value: string) => void;
}

export function WishlistSelector({ value, onChange }: WishlistSelectorProps) {
	const [wishlists, setWishlists] = useState<wishlistService.WishlistOption[]>(
		[]
	);
	const [loading, setLoading] = useState(true);
	const [hasSetDefault, setHasSetDefault] = useState(false);

	useEffect(() => {
		const fetchWishlists = async () => {
			try {
				const options = await wishlistService.fetchWishlistOptions();
				setWishlists(options);
			} catch (error) {
				console.error("Error fetching wishlists:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchWishlists();
	}, []); // Only run once on mount

	// Separate effect to handle default selection
	useEffect(() => {
		if (!loading && !hasSetDefault && !value && wishlists.length > 0) {
			// Find the favorite wishlist first, otherwise use the first one
			const favoriteWishlist = wishlists.find((w) => w.isFavorite);
			const defaultWishlist = favoriteWishlist || wishlists[0];

			onChange(defaultWishlist.id);
			setHasSetDefault(true);
		}
	}, [loading, hasSetDefault, value, wishlists, onChange]);

	return (
		<div className="ml-2 flex min-w-[0] items-center gap-2">
			<Label
				htmlFor="wishlist-select"
				className="ml-3 hidden text-sm whitespace-nowrap text-gray-600 sm:inline"
			>
				Wishlist:
			</Label>
			<Select value={value} onValueChange={onChange} disabled={loading}>
				<SelectTrigger id="wishlist-select" className="w-[160px]">
					<SelectValue placeholder={loading ? "Loading..." : "Choose..."} />
				</SelectTrigger>
				<SelectContent>
					{wishlists.map((wishlist) => (
						<SelectItem key={wishlist.id} value={wishlist.id} className="text-xs">
							{wishlist.name}
						</SelectItem>
					))}
					{wishlists.length === 0 && !loading && (
						<SelectItem value="" disabled className="text-xs">
							No wishlists found
						</SelectItem>
					)}
				</SelectContent>
			</Select>
		</div>
	);
}
