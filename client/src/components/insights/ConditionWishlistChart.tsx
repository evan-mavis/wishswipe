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
import { Bar, BarChart, Cell, CartesianGrid, XAxis, YAxis } from "recharts";
import { Package } from "lucide-react";

interface ConditionWishlistChartProps {
	data: Array<{ condition: string; count: number }>;
	config: Record<string, { color: string }>;
}

export function ConditionWishlistChart({
	data,
	config,
}: ConditionWishlistChartProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Package className="h-5 w-5" />
					Items by Condition
				</CardTitle>
				<CardDescription>
					Number of items swiped right by condition
				</CardDescription>
			</CardHeader>
			<CardContent>
				<ChartContainer config={config} className="h-64 w-full">
					<BarChart data={data}>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis dataKey="condition" />
						<YAxis />
						<ChartTooltip content={<ChartTooltipContent />} />
						<Bar dataKey="count">
							{data.map((entry, index) => (
								<Cell
									key={`cell-${index}`}
									fill={
										config[entry.condition as keyof typeof config]?.color ||
										"#a855f7"
									}
								/>
							))}
						</Bar>
					</BarChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
