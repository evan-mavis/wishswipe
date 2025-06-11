import { ChevronLeft, ChevronRight } from "lucide-react";

interface EbayListingCardProps {
  imageUrl: string;
}

export function EbayListingCard({ imageUrl }: EbayListingCardProps) {
  return (
    <div className="flex flex-col items-center justify-center overflow-hidden">
      <img
        src={imageUrl}
        alt="eBay product"
        className="object-contain rounded-4xl w-full"
        loading="lazy"
      />
      <div className="p-6 relative">
        <div className="absolute top-0 left-0 ">
          <ChevronLeft
            className="text-fuchsia-300"
            style={{ transform: "rotate(45deg)", fontSize: "0.8em" }}
          />
        </div>
        <div className="absolute top-0 right-0 ">
          <ChevronRight
            className="text-fuchsia-300"
            style={{ transform: "rotate(-45deg)", fontSize: "0.8em" }}
          />
        </div>
        <div className="absolute bottom-0 left-0 ">
          <ChevronLeft
            className="text-fuchsia-300"
            style={{ transform: "rotate(-45deg)", fontSize: "0.8em" }}
          />
        </div>
        <div className="absolute bottom-0 right-0 ">
          <ChevronRight
            className="text-fuchsia-300"
            style={{ transform: "rotate(45deg)", fontSize: "0.8em" }}
          />
        </div>
        <h3 className="text-lg font-semibold">Placeholder Item Title</h3>
        <p className="text-sm text-gray-500">Seller: PlaceholderSeller</p>
        <p className="text-xl font-bold">$99.99</p>
        <p className="text-sm">Condition: New</p>
      </div>
    </div>
  );
}
