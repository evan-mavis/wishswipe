import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { SavedListingCard } from "./components/SavedListingCard";
import type { WishList } from "@/types/listing";

export function WishlistCard({ title, description, items }: WishList) {
	const [isExpanded, setIsExpanded] = useState(false);

	return (
		<motion.div
			layout
			animate={{ width: isExpanded ? "100%" : "300px" }}
			transition={{ duration: 0.3 }}
		>
			<Card
				className="cursor-pointer transition-shadow hover:shadow-md"
				onClick={() => setIsExpanded(!isExpanded)}
			>
				<CardHeader>
					<div className="flex items-center justify-between">
						<CardTitle>{title}</CardTitle>
						<motion.div
							animate={{ rotate: isExpanded ? 180 : 0 }}
							transition={{ duration: 0.3 }}
						>
							<ChevronDown className="h-5 w-5" />
						</motion.div>
					</div>
					<p className="text-muted-foreground text-sm">{description}</p>
				</CardHeader>
				<AnimatePresence>
					{isExpanded && (
						<motion.div
							initial={{ height: 0 }}
							animate={{ height: "auto" }}
							exit={{ height: 0 }}
							transition={{ duration: 0.3 }}
							className="overflow-hidden"
						>
							<CardContent className="grid gap-4">
								{items.map((listing) => (
									<SavedListingCard key={listing.id} listing={listing} />
								))}
							</CardContent>
						</motion.div>
					)}
				</AnimatePresence>
			</Card>
		</motion.div>
	);
}
