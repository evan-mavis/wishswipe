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
	onWishlistCountChange?: (count: number) => void;
	onLoadingChange?: (loading: boolean) => void;
}

export function WishlistSelector({
	value,
	onChange,
	onWishlistCountChange,
	onLoadingChange,
}: WishlistSelectorProps) {
	const [wishlists, setWishlists] = useState<wishlistService.WishlistOption[]>(
		[]
	);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);
	const [hasSetDefault, setHasSetDefault] = useState(false);

	useEffect(() => {
		const fetchWishlists = async () => {
			try {
				const options = await wishlistService.fetchWishlistOptions();
				setWishlists(options);
				setError(false);
				onWishlistCountChange?.(options.length);
			} catch (error) {
				console.error("Error fetching wishlists:", error);
				setError(true);
				onWishlistCountChange?.(0);
			} finally {
				setLoading(false);
				onLoadingChange?.(false);
			}
		};

		fetchWishlists();
		onLoadingChange?.(true);
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
				<SelectTrigger id="wishlist-select" className="w-[120px] sm:w-[160px]">
					<SelectValue placeholder={loading ? "Loading..." : "Choose..."} />
				</SelectTrigger>
				<SelectContent>
					{wishlists.map((wishlist) => (
						<SelectItem
							key={wishlist.id}
							value={wishlist.id}
							className="text-xs"
						>
							{wishlist.name}
						</SelectItem>
					))}
					{wishlists.length === 0 && !loading && !error && (
						<SelectItem value="no-wishlists" disabled className="text-xs">
							No wishlists found
						</SelectItem>
					)}
					{error && (
						<SelectItem value="error" disabled className="text-xs">
							Failed to load wishlists
						</SelectItem>
					)}
				</SelectContent>
			</Select>
		</div>
	);
}
