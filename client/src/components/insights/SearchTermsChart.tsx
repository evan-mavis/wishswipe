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
import { Search } from "lucide-react";

interface SearchTermsChartProps {
	data: Array<{ term: string; count: number }>;
	config: Record<string, { color: string }>;
}

export function SearchTermsChart({ data, config }: SearchTermsChartProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Search className="h-5 w-5" />
					Most Used Search Terms
				</CardTitle>
				<CardDescription>Your most frequent search queries</CardDescription>
			</CardHeader>
			<CardContent>
				<ChartContainer config={config} className="h-64 w-full">
					<BarChart data={data}>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis dataKey="term" />
						<YAxis />
						<ChartTooltip content={<ChartTooltipContent />} />
						<Bar dataKey="count">
							{data.map((entry, index) => (
								<Cell
									key={`cell-${index}`}
									fill={
										config[entry.term as keyof typeof config]?.color ||
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
