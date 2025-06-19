import { CornersFrame } from "@/components/contentCornerFrame/CornersFrame";
import type { ListingDetails } from "@/types/listing";

interface ListingCaptionProps {
	isActive: boolean;
	details: ListingDetails;
}

export function ListingCaption({ isActive, details }: ListingCaptionProps) {
	return (
		<div className="mb-1 flex justify-center sm:mb-2">
			<div
				className={`relative mt-1 inline-block p-2 transition-all duration-300 sm:mt-2 sm:p-3 md:p-4 ${
					isActive ? "animate-bounce-in translate-x-0 opacity-100" : "opacity-0"
				} max-w-[280px] ease-out sm:max-w-full`}
			>
				<CornersFrame />
				<h3 className="truncate text-sm font-semibold sm:text-base md:text-lg">
					{details.title}
				</h3>
				<p className="text-xs text-gray-500 sm:text-sm">
					Seller: {details.seller}
				</p>
				<p className="text-base font-bold sm:text-lg md:text-xl">
					${details.price.toFixed(2)}
				</p>
				<p className="text-xs sm:text-sm">Condition: {details.condition}</p>
			</div>
		</div>
	);
}
