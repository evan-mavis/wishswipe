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
				<div className="flex min-h-48 items-center justify-center overflow-hidden">
					<div className="flex w-full flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:gap-2 sm:px-6">
						<div className="min-w-0 flex-1 p-2 text-center">
							<div className="animate-bounce-in text-2xl font-bold break-all hyphens-auto text-red-600 sm:text-2xl">
								${min.toFixed(2)}
							</div>
							<p className="text-muted-foreground text-sm sm:text-base">
								Lowest
							</p>
						</div>

						<div className="hidden h-24 w-px bg-gray-300 sm:block dark:bg-gray-600" />

						<div className="min-w-0 flex-1 p-2 text-center">
							<div className="animate-bounce-in text-2xl font-bold break-all hyphens-auto text-fuchsia-300 sm:text-2xl">
								${average.toFixed(2)}
							</div>
							<p className="text-muted-foreground text-sm sm:text-base">
								Average
							</p>
						</div>

						<div className="hidden h-24 w-px bg-gray-300 sm:block dark:bg-gray-600" />

						<div className="min-w-0 flex-1 p-2 text-center">
							<div className="animate-bounce-in text-2xl font-bold break-all hyphens-auto text-green-600 sm:text-2xl">
								${max.toFixed(2)}
							</div>
							<p className="text-muted-foreground text-sm sm:text-base">
								Highest
							</p>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
