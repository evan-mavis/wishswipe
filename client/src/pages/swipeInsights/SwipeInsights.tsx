import { useEffect, useState } from "react";
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
import { analyticsService } from "../../services/analyticsService";
import {
	conditionConfig,
	categoryConfig,
	priceConfig,
	searchConfig,
} from "./data/mockData";
import type { AnalyticsData } from "@/types/analytics";

export function SwipeInsights() {
	const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
		null
	);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchAnalytics = async () => {
			try {
				setLoading(true);
				setError(null);
				const data = await analyticsService.getAnalytics();
				setAnalyticsData(data);
			} catch (err) {
				setError(
					err instanceof Error ? err.message : "Failed to fetch analytics"
				);
			} finally {
				setLoading(false);
			}
		};

		fetchAnalytics();
	}, []);

	if (loading) {
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
				<div className="flex h-64 items-center justify-center">
					<p className="text-muted-foreground">Loading analytics...</p>
				</div>
			</div>
		);
	}

	if (error) {
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
				<div className="flex h-64 items-center justify-center">
					<p className="text-red-600">Error: {error}</p>
				</div>
			</div>
		);
	}

	if (!analyticsData) {
		return null;
	}

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

			<SwipeCountsHeader swipeCounts={analyticsData.swipeCounts} />

			<div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
				<ConditionWishlistChart
					data={analyticsData.conditionWishlist}
					config={conditionConfig}
				/>
				<CategoryFiltersChart
					data={analyticsData.categoryFilters}
					config={categoryConfig}
				/>
				<SearchTermsChart
					data={analyticsData.searchTerms}
					config={searchConfig}
				/>
			</div>

			<div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
				<PriceDistributionChart
					data={analyticsData.priceDistribution}
					config={priceConfig}
				/>
				<PriceStatisticsCard
					min={analyticsData.wishlistStats.priceStats.min}
					average={analyticsData.wishlistStats.priceStats.average}
					max={analyticsData.wishlistStats.priceStats.max}
				/>
			</div>

			<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
				<StatCard
					title="Largest Wishlist"
					description="Your biggest collection of saved items"
					value={analyticsData.wishlistStats.largestWishlist.itemCount}
					icon={<Heart className="h-5 w-5" />}
					label={analyticsData.wishlistStats.largestWishlist.name}
					label2="items"
				/>
				<StatCard
					title="Total Items Saved"
					description="All items across all your wishlists"
					value={analyticsData.wishlistStats.totalItemsSaved}
					icon={<Bookmark className="h-5 w-5" />}
					label="Items"
					label2="across all wishlists"
				/>
				<StatCard
					title="Avg Swipes Per Session"
					description="Your typical browsing intensity"
					value={analyticsData.wishlistStats.avgSwipesPerSession}
					icon={<MousePointer className="h-5 w-5" />}
					label="Swipes"
					label2="per session"
				/>
			</div>
		</div>
	);
}
