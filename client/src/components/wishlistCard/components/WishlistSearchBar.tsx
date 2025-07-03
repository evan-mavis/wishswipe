import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";

interface WishlistSearchBarProps {
	searchQuery: string;
	onSearchChange: (value: string) => void;
	onClearSearch: () => void;
}

export function WishlistSearchBar({
	searchQuery,
	onSearchChange,
	onClearSearch,
}: WishlistSearchBarProps) {
	return (
		<div className="relative mb-4">
			<Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
			<Input
				placeholder="Search items..."
				value={searchQuery}
				onChange={(e) => onSearchChange(e.target.value)}
				className="pr-10 pl-10"
				onClick={(e) => e.stopPropagation()}
			/>
			{searchQuery && (
				<button
					onClick={(e) => {
						e.stopPropagation();
						onClearSearch();
					}}
					className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2"
				>
					<X className="h-4 w-4" />
				</button>
			)}
		</div>
	);
}
