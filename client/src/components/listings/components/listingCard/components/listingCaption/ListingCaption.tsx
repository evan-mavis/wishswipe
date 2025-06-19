import { CornersFrame } from "@/components/contentCornerFrame/CornersFrame";
import type { ListingDetails } from "@/types/listing";

interface ListingCaptionProps {
  isActive: boolean;
  details: ListingDetails;
}

export function ListingCaption({ isActive, details }: ListingCaptionProps) {
  return (
    <div className="flex justify-center mb-2 sm:mb-6">
      <div
        className={`inline-block p-3 sm:p-4 md:p-6 relative mt-2 sm:mt-4 transition-all duration-300
          ${isActive ? "opacity-100 translate-x-0" : "opacity-0"}
          ease-out max-w-[280px] sm:max-w-full
        `}
      >
        <CornersFrame />
        <h3 className="text-base sm:text-lg font-semibold truncate">
          {details.title}
        </h3>
        <p className="text-xs sm:text-sm text-gray-500">
          Seller: {details.seller}
        </p>
        <p className="text-lg sm:text-xl font-bold">
          ${details.price.toFixed(2)}
        </p>
        <p className="text-xs sm:text-sm">Condition: {details.condition}</p>
      </div>
    </div>
  );
}
