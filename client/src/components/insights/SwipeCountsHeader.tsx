import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, ArrowLeft } from "lucide-react";

interface SwipeCountsHeaderProps {
	swipeCounts: {
		right: number;
		left: number;
	};
}

export function SwipeCountsHeader({ swipeCounts }: SwipeCountsHeaderProps) {
	return (
		<Card className="mb-8">
			<CardContent className="p-6">
				<div className="flex items-center justify-center gap-8">
					<div className="text-center">
						<div className="flex items-center gap-2 text-red-600">
							<ArrowLeft className="h-6 w-6" />
							<span className="text-4xl font-bold">{swipeCounts.left}</span>
						</div>
						<p className="text-muted-foreground text-sm">Swipe Left</p>
					</div>

					<div className="h-16 w-px bg-gray-300 dark:bg-gray-600" />

					<div className="text-center">
						<div className="flex items-center gap-2 text-green-600">
							<span className="text-4xl font-bold">{swipeCounts.right}</span>
							<ArrowRight className="h-6 w-6" />
						</div>
						<p className="text-muted-foreground text-sm">Swipe Right</p>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
