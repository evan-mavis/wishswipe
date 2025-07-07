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

interface CategoryFiltersChartProps {
	data: Array<{ name: string; value: number; color: string }>;
	config: Record<string, { color: string }>;
}

export function CategoryFiltersChart({
	data,
	config,
}: CategoryFiltersChartProps) {
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
							dataKey="value"
							label={({ name, percent }) =>
								`${name} ${((percent || 0) * 100).toFixed(0)}%`
							}
						>
							{data.map((entry, index) => (
								<Cell key={`cell-${index}`} fill={entry.color} />
							))}
						</Pie>
						<ChartTooltip content={<ChartTooltipContent />} />
					</PieChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
