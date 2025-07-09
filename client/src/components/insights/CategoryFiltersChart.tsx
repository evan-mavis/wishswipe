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
import { Cell, Pie, PieChart } from "recharts";
import { Filter } from "lucide-react";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

interface CategoryFiltersChartProps {
	data: Array<{ name: string; value: number }>;
	config: Record<string, { color: string }>;
}

export function CategoryFiltersChart({
	data,
	config,
}: CategoryFiltersChartProps) {
	const colors = [
		"#e879f9", // fuchsia-400
		"#a21caf", // fuchsia-700
		"#4a044e", // fuchsia-950
		"#8b5cf6", // violet-500
		"#4c1d95", // violet-900
	];

	const total = data.reduce((sum, item) => sum + item.value, 0);

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Filter className="h-5 w-5" />
					Most Used Categories
				</CardTitle>
				<CardDescription>Categories you filter by most often</CardDescription>
			</CardHeader>
			<CardContent>
				<ChartContainer config={config} className="h-64 w-full">
					<PieChart>
						<Pie
							data={data}
							cx="50%"
							cy="50%"
							outerRadius={80}
							innerRadius={30}
							dataKey="value"
							label={false}
						>
							{data.map((entry, index) => (
								<Cell
									key={`cell-${index}`}
									fill={colors[index % colors.length]}
								/>
							))}
						</Pie>
						<ChartTooltip content={<ChartTooltipContent />} />
					</PieChart>
				</ChartContainer>

				{/* Custom Legend */}
				<TooltipProvider>
					<div className="mt-2 flex flex-wrap justify-center gap-1">
						{data.map((entry, index) => {
							const percentage = ((entry.value / total) * 100).toFixed(0);
							const truncatedName =
								entry.name.length > 15
									? `${entry.name.substring(0, 15)}...`
									: entry.name;

							return (
								<Tooltip key={`legend-${index}`}>
									<TooltipTrigger asChild>
										<div className="bg-muted/50 hover:bg-muted flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-1 transition-colors">
											<div
												className="h-2.5 w-2.5 rounded-full"
												style={{
													backgroundColor: colors[index % colors.length],
												}}
											/>
											<span className="text-xs font-medium">
												{truncatedName} ({percentage}%)
											</span>
										</div>
									</TooltipTrigger>
									<TooltipContent>
										<p>
											{entry.name} ({percentage}%)
										</p>
									</TooltipContent>
								</Tooltip>
							);
						})}
					</div>
				</TooltipProvider>
			</CardContent>
		</Card>
	);
}
