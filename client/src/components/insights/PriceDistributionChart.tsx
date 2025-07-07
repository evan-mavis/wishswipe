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
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { DollarSign } from "lucide-react";

interface PriceDistributionChartProps {
	data: Array<{ range: string; avgPrice: number }>;
	config: Record<string, { color: string }>;
}

export function PriceDistributionChart({
	data,
	config,
}: PriceDistributionChartProps) {
	return (
		<Card>
			<CardHeader className="pb-3">
				<CardTitle className="flex items-center gap-2 text-lg">
					<DollarSign className="h-4 w-4" />
					Items by Price Range
				</CardTitle>
				<CardDescription>Number of items per price range</CardDescription>
			</CardHeader>
			<CardContent className="pt-0">
				<ChartContainer config={config} className="h-64 w-full">
					<LineChart data={data}>
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
	);
}
