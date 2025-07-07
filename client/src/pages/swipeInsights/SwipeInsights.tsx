import {
	Bookmark,
	Heart,
	MousePointer,
	BarChart as BarChartIcon,
} from "lucide-react";

import { SwipeCountsHeader } from "@/components/insights/SwipeCountsHeader";
import { ConditionWishlistChart } from "@/components/insights/ConditionWishlistChart";
import { CategoryFiltersChart } from "@/components/insights/CategoryFiltersChart";
import { SearchTermsChart } from "@/components/insights/SearchTermsChart";
import { PriceDistributionChart } from "@/components/insights/PriceDistributionChart";
import { PriceStatisticsCard } from "@/components/insights/PriceStatisticsCard";
import { StatCard } from "@/components/insights/StatCard";
import {
	mockData,
	conditionConfig,
	categoryConfig,
	priceConfig,
	searchConfig,
} from "./data/mockData";

export function SwipeInsights() {
	console.log("Condition data:", mockData.conditionWishlist);

	return (
		<div className="container mx-auto max-w-7xl p-6">
			<div className="mb-8">
				<h1 className="mb-2 flex items-center gap-2 text-3xl font-bold">
					<BarChartIcon className="text-xl" /> Swipe Insights
				</h1>
				<p className="text-muted-foreground">
					Analytics from your swiping activity and wishlist data. Yes, I know
					this is over-engineered!
				</p>
			</div>

			<SwipeCountsHeader swipeCounts={mockData.swipeCounts} />

			<div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
				<ConditionWishlistChart
					data={mockData.conditionWishlist}
					config={conditionConfig}
				/>
				<CategoryFiltersChart
					data={mockData.categoryFilters}
					config={categoryConfig}
				/>
				<SearchTermsChart data={mockData.searchTerms} config={searchConfig} />
			</div>

			<div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
				<PriceDistributionChart
					data={mockData.priceDistribution}
					config={priceConfig}
				/>
				<PriceStatisticsCard
					min={mockData.wishlistStats.priceStats.min}
					average={mockData.wishlistStats.priceStats.average}
					max={mockData.wishlistStats.priceStats.max}
				/>
			</div>

			<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
				<StatCard
					title="Largest Wishlist"
					description="Your biggest collection of saved items"
					value={mockData.wishlistStats.largestWishlist.itemCount}
					icon={<Heart className="h-5 w-5" />}
					label={mockData.wishlistStats.largestWishlist.name}
					label2="items"
				/>
				<StatCard
					title="Total Items Saved"
					description="All items across all your wishlists"
					value={mockData.wishlistStats.totalItemsSaved}
					icon={<Bookmark className="h-5 w-5" />}
					label="Items"
					label2="across all wishlists"
				/>
				<StatCard
					title="Avg Swipes Per Session"
					description="Your typical browsing intensity"
					value={mockData.wishlistStats.avgSwipesPerSession}
					icon={<MousePointer className="h-5 w-5" />}
					label="Swipes"
					label2="per session"
				/>
			</div>
		</div>
	);
}
