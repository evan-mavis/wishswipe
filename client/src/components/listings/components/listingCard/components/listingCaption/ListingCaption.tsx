import { CornersFrame } from "@/components/contentCornerFrame/CornersFrame";
import type { ListingDetails } from "@/types/listing";

interface ListingCaptionProps {
  isActive: boolean;
  details: ListingDetails;
}

export function ListingCaption({ isActive, details }: ListingCaptionProps) {
  return (
    <div
      className={`p-6 relative mt-4 transition-all duration-300
        ${isActive ? "opacity-100 translate-x-0" : "opacity-0"}
        ease-out
      `}
    >
      <CornersFrame />
      <h3 className="text-lg font-semibold">{details.title}</h3>
      <p className="text-sm text-gray-500">Seller: {details.seller}</p>
      <p className="text-xl font-bold">${details.price.toFixed(2)}</p>
      <p className="text-sm">Condition: {details.condition}</p>
    </div>
  );
}
