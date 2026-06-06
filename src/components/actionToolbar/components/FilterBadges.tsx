import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { getPriceDisplayName } from "../filterHelpers";

interface FilterBadgesProps {
	filters: {
		condition?: string;
		category?: string;
		minPrice?: number;
		maxPrice?: number;
	};
	onClearCondition: () => void;
	onClearCategory: () => void;
	onClearPrice: () => void;
}

export function FilterBadges({
	filters,
	onClearCondition,
	onClearCategory,
	onClearPrice,
}: FilterBadgesProps) {
	return (
		<div className="flex flex-wrap justify-center gap-1 p-2">
			{filters.condition && (
				<Badge
					variant="secondary"
					className="border-fuchsia-600 bg-fuchsia-600 text-xs text-white"
				>
					Condition: {filters.condition}
					<button
						onClick={onClearCondition}
						className="ml-1 rounded-full p-0.5 transition-colors hover:bg-fuchsia-600"
					>
						<X size={12} />
					</button>
				</Badge>
			)}
			{filters.category && (
				<Badge
					variant="secondary"
					className="border-fuchsia-600 bg-fuchsia-600 text-xs text-white"
				>
					Category: {filters.category}
					<button
						onClick={onClearCategory}
						className="ml-1 rounded-full p-0.5 transition-colors hover:bg-fuchsia-600"
					>
						<X size={12} />
					</button>
				</Badge>
			)}
			{getPriceDisplayName(filters) && (
				<Badge
					variant="secondary"
					className="border-fuchsia-600 bg-fuchsia-600 text-xs text-white"
				>
					Price: {getPriceDisplayName(filters)}
					<button
						onClick={onClearPrice}
						className="ml-1 rounded-full p-0.5 transition-colors hover:bg-fuchsia-600"
					>
						<X size={12} />
					</button>
				</Badge>
			)}
		</div>
	);
}
