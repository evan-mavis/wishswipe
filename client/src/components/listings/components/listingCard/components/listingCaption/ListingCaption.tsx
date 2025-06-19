import { CornersFrame } from "@/components/contentCornerFrame/CornersFrame";
import type { ListingDetails } from "@/types/listing";

interface ListingCaptionProps {
  isActive: boolean;
  details: ListingDetails;
}

export function ListingCaption({ isActive, details }: ListingCaptionProps) {
  return (
    <div className="flex justify-center mb-1 sm:mb-2">
      <div
        className={`inline-block p-2 sm:p-3 md:p-4 relative mt-1 sm:mt-2 transition-all duration-300
          ${
            isActive
              ? "opacity-100 translate-x-0 animate-bounce-in"
              : "opacity-0"
          }
          ease-out max-w-[280px] sm:max-w-full
        `}
      >
        <CornersFrame />
        <h3 className="text-sm sm:text-base md:text-lg font-semibold truncate">
          {details.title}
        </h3>
        <p className="text-xs sm:text-sm text-gray-500">
          Seller: {details.seller}
        </p>
        <p className="text-base sm:text-lg md:text-xl font-bold">
          ${details.price.toFixed(2)}
        </p>
        <p className="text-xs sm:text-sm">Condition: {details.condition}</p>
      </div>
    </div>
  );
}
