import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import {
	Bar,
	BarChart,
	Line,
	LineChart,
	Pie,
	PieChart,
	XAxis,
	YAxis,
	Cell,
	CartesianGrid,
} from "recharts";
import {
	Bookmark,
	Filter,
	Search,
	Heart,
	DollarSign,
	Package,
	Target,
	ArrowRight,
	ArrowLeft,
	MousePointer,
	BarChart as BarChartIcon,
} from "lucide-react";

// Mock data - replace with actual data from your backend
const mockData = {
	swipeCounts: {
		right: 247,
		left: 189,
	},
	categoryFilters: [
		{ name: "Electronics", value: 45, color: "#a855f7" },
		{ name: "Clothing", value: 32, color: "#8b5cf6" },
		{ name: "Home & Garden", value: 28, color: "#3b82f6" },
		{ name: "Sports", value: 18, color: "#6366f1" },
		{ name: "Books", value: 12, color: "#7c3aed" },
	],
	conditionWishlist: [
		{ condition: "New", count: 23 },
		{ condition: "Used", count: 18 },
		{ condition: "Refurbished", count: 15 },
	],
	searchTerms: [
		{ term: "iPhone", count: 15 },
		{ term: "vintage camera", count: 12 },
		{ term: "guitar", count: 10 },
		{ term: "sneakers", count: 8 },
		{ term: "laptop", count: 7 },
		{ term: "watch", count: 6 },
	],
	priceDistribution: [
		{ range: "$0-25", avgPrice: 12.5 },
		{ range: "$26-50", avgPrice: 37.8 },
		{ range: "$51-75", avgPrice: 62.3 },
		{ range: "$76-100", avgPrice: 87.2 },
		{ range: "$101-150", avgPrice: 125.4 },
		{ range: "$151+", avgPrice: 189.7 },
	],
	wishlistStats: {
		largestWishlist: {
			name: "Electronics Collection",
			itemCount: 23,
		},
		priceStats: {
			average: 67.5,
			max: 299.99,
			min: 12.99,
		},
		totalItemsSaved: 156,
		avgSwipesPerSession: 42,
	},
};

// Chart configurations
const categoryConfig = {
	Electronics: { color: "#a855f7" },
	Clothing: { color: "#8b5cf6" },
	"Home & Garden": { color: "#3b82f6" },
	Sports: { color: "#6366f1" },
	Books: { color: "#7c3aed" },
};

const conditionConfig = {
	New: { color: "#a855f7" },
	Used: { color: "#c084fc" },
	Refurbished: { color: "#d8b4fe" },
};

const searchConfig = {
	iPhone: { color: "#a855f7" },
	"vintage camera": { color: "#c084fc" },
	guitar: { color: "#d8b4fe" },
	sneakers: { color: "#e9d5ff" },
	laptop: { color: "#f3e8ff" },
	watch: { color: "#a855f7" },
};

const priceConfig = {
	avgPrice: { color: "#a855f7" },
};

export function SwipeInsights() {
	console.log("Condition data:", mockData.conditionWishlist);
	console.log("Condition config:", conditionConfig);

	return (
		<div className="container mx-auto max-w-7xl p-6">
			<div className="mb-8">
				<h1 className="mb-2 flex items-center gap-2 text-3xl font-bold">
					<BarChartIcon className="text-xl" /> Swipe Insights
				</h1>
				<p className="text-muted-foreground">
					Analytics and insights from your swiping activity and wishlist data.
				</p>
			</div>

			{/* Swipe Counts Header */}
			<Card className="mb-8">
				<CardContent className="p-6">
					<div className="flex items-center justify-center gap-8">
						<div className="text-center">
							<div className="flex items-center gap-2 text-red-600">
								<ArrowLeft className="h-6 w-6" />
								<span className="text-4xl font-bold">
									{mockData.swipeCounts.left}
								</span>
							</div>
							<p className="text-muted-foreground text-sm">Swipe Left</p>
						</div>

						<div className="h-16 w-px bg-gray-300 dark:bg-gray-600" />

						<div className="text-center">
							<div className="flex items-center gap-2 text-green-600">
								<span className="text-4xl font-bold">
									{mockData.swipeCounts.right}
								</span>
								<ArrowRight className="h-6 w-6" />
							</div>
							<p className="text-muted-foreground text-sm">Swipe Right</p>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Three Charts Row - Pie Chart in Middle */}
			<div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
				{/* Condition Wishlist Bar Chart */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Package className="h-5 w-5" />
							Items by Condition
						</CardTitle>
						<CardDescription>
							Number of items saved by condition
						</CardDescription>
					</CardHeader>
					<CardContent>
						<ChartContainer config={conditionConfig} className="h-64 w-full">
							<BarChart data={mockData.conditionWishlist}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="condition" />
								<YAxis />
								<ChartTooltip content={<ChartTooltipContent />} />
								<Bar dataKey="count">
									{mockData.conditionWishlist.map((entry, index) => (
										<Cell
											key={`cell-${index}`}
											fill={
												conditionConfig[
													entry.condition as keyof typeof conditionConfig
												]?.color || "#a855f7"
											}
										/>
									))}
								</Bar>
							</BarChart>
						</ChartContainer>
					</CardContent>
				</Card>

				{/* Category Filters Pie Chart */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Filter className="h-5 w-5" />
							Most Used Categories
						</CardTitle>
						<CardDescription>
							Categories you filter by most often
						</CardDescription>
					</CardHeader>
					<CardContent>
						<ChartContainer config={categoryConfig} className="h-64 w-full">
							<PieChart>
								<Pie
									data={mockData.categoryFilters}
									cx="50%"
									cy="50%"
									outerRadius={80}
									dataKey="value"
									label={({ name, percent }) =>
										`${name} ${((percent || 0) * 100).toFixed(0)}%`
									}
								>
									{mockData.categoryFilters.map((entry, index) => (
										<Cell key={`cell-${index}`} fill={entry.color} />
									))}
								</Pie>
								<ChartTooltip content={<ChartTooltipContent />} />
							</PieChart>
						</ChartContainer>
					</CardContent>
				</Card>

				{/* Search Terms Bar Chart */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Search className="h-5 w-5" />
							Most Used Search Terms
						</CardTitle>
						<CardDescription>Your most frequent search queries</CardDescription>
					</CardHeader>
					<CardContent>
						<ChartContainer config={searchConfig} className="h-64 w-full">
							<BarChart data={mockData.searchTerms}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="term" />
								<YAxis />
								<ChartTooltip content={<ChartTooltipContent />} />
								<Bar dataKey="count">
									{mockData.searchTerms.map((entry, index) => (
										<Cell
											key={`cell-${index}`}
											fill={
												searchConfig[entry.term as keyof typeof searchConfig]
													?.color || "#a855f7"
											}
										/>
									))}
								</Bar>
							</BarChart>
						</ChartContainer>
					</CardContent>
				</Card>
			</div>

			{/* Price Distribution and Stats Row */}
			<div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
				{/* Price Distribution Line Chart */}
				<Card>
					<CardHeader className="pb-3">
						<CardTitle className="flex items-center gap-2 text-lg">
							<DollarSign className="h-4 w-4" />
							Average Price Distribution
						</CardTitle>
						<CardDescription>
							Average price of items across price ranges
						</CardDescription>
					</CardHeader>
					<CardContent className="pt-0">
						<ChartContainer config={priceConfig} className="h-64 w-full">
							<LineChart data={mockData.priceDistribution}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="range" />
								<YAxis />
								<ChartTooltip content={<ChartTooltipContent />} />
								<Line
									type="monotone"
									dataKey="avgPrice"
									stroke="#a855f7"
									strokeWidth={2}
								/>
							</LineChart>
						</ChartContainer>
					</CardContent>
				</Card>

				{/* Price Statistics */}
				<Card>
					<CardHeader className="pb-3">
						<CardTitle className="flex items-center gap-2 text-lg">
							<DollarSign className="h-4 w-4" />
							Price Statistics
						</CardTitle>
						<CardDescription>Overview of your wishlist pricing</CardDescription>
					</CardHeader>
					<CardContent className="pt-0">
						<div className="flex h-48 items-center justify-center">
							<div className="flex w-full items-center justify-between px-8">
								<div className="flex-1 text-center">
									<div className="text-4xl font-bold text-red-600">
										${mockData.wishlistStats.priceStats.min}
									</div>
									<p className="text-muted-foreground text-base">Lowest</p>
								</div>

								<div className="h-32 w-px bg-gray-300 dark:bg-gray-600" />

								<div className="flex-1 text-center">
									<div className="text-4xl font-bold text-fuchsia-300">
										${mockData.wishlistStats.priceStats.average}
									</div>
									<p className="text-muted-foreground text-base">Average</p>
								</div>

								<div className="h-32 w-px bg-gray-300 dark:bg-gray-600" />

								<div className="flex-1 text-center">
									<div className="text-4xl font-bold text-green-600">
										${mockData.wishlistStats.priceStats.max}
									</div>
									<p className="text-muted-foreground text-base">Highest</p>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Bottom Row - Three Stats Cards */}
			<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
				{/* Largest Wishlist */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Heart className="h-5 w-5" />
							Largest Wishlist
						</CardTitle>
						<CardDescription>
							Your biggest collection of saved items
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="text-center">
							<div className="text-3xl font-bold text-fuchsia-300">
								{mockData.wishlistStats.largestWishlist.itemCount}
							</div>
							<p className="text-lg font-semibold">
								{mockData.wishlistStats.largestWishlist.name}
							</p>
							<p className="text-muted-foreground text-sm">items</p>
						</div>
					</CardContent>
				</Card>

				{/* Total Items Saved */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Bookmark className="h-5 w-5" />
							Total Items Saved
						</CardTitle>
						<CardDescription>
							All items across all your wishlists
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="text-center">
							<div className="text-3xl font-bold text-fuchsia-300">
								{mockData.wishlistStats.totalItemsSaved}
							</div>
							<p className="text-lg font-semibold">Items</p>
							<p className="text-muted-foreground text-sm">
								across all wishlists
							</p>
						</div>
					</CardContent>
				</Card>

				{/* Average Swipes Per Session */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<MousePointer className="h-5 w-5" />
							Avg Swipes Per Session
						</CardTitle>
						<CardDescription>Your typical browsing intensity</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="text-center">
							<div className="text-3xl font-bold text-fuchsia-300">
								{mockData.wishlistStats.avgSwipesPerSession}
							</div>
							<p className="text-lg font-semibold">Swipes</p>
							<p className="text-muted-foreground text-sm">per session</p>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
