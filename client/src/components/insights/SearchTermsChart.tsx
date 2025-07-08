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
					<BarChart
						data={data}
						margin={{ left: 10, right: 10, top: 10, bottom: 40 }}
					>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis
							dataKey="term"
							angle={-45}
							textAnchor="end"
							height={60}
							tick={{ fontSize: 12 }}
						/>
						<YAxis />
						<ChartTooltip content={<ChartTooltipContent />} />
						<Bar dataKey="count">
							{data.map((entry, index) => {
								const colors = [
									"#e879f9", // fuchsia-400
									"#a21caf", // fuchsia-700
									"#86198f", // fuchsia-500
									"#4a044e", // fuchsia-950
									"#8b5cf6", // violet-500
									"#4c1d95", // violet-900
								];
								return <Cell key={`cell-${index}`} fill={colors[index]} />;
							})}
						</Bar>
					</BarChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
