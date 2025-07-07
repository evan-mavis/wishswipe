import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { DollarSign } from "lucide-react";

interface PriceStatisticsCardProps {
	min: number;
	average: number;
	max: number;
}

export function PriceStatisticsCard({
	min,
	average,
	max,
}: PriceStatisticsCardProps) {
	return (
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
							<div className="animate-bounce-in text-4xl font-bold text-red-600">
								${min.toFixed(2)}
							</div>
							<p className="text-muted-foreground text-base">Lowest</p>
						</div>

						<div className="h-32 w-px bg-gray-300 dark:bg-gray-600" />

						<div className="flex-1 text-center">
							<div className="animate-bounce-in text-4xl font-bold text-fuchsia-300">
								${average.toFixed(2)}
							</div>
							<p className="text-muted-foreground text-base">Average</p>
						</div>

						<div className="h-32 w-px bg-gray-300 dark:bg-gray-600" />

						<div className="flex-1 text-center">
							<div className="animate-bounce-in text-4xl font-bold text-green-600">
								${max.toFixed(2)}
							</div>
							<p className="text-muted-foreground text-base">Highest</p>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
