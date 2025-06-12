import { ListingCaption } from "./components/listingCaption/ListingCaption";

interface ListingCardProps {
  imageUrl: string;
}

export function ListingCard({ imageUrl }: ListingCardProps) {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-full h-[60vh]">
        <img
          src={imageUrl}
          alt="eBay product"
          className="object-contain h-full w-full"
          loading="lazy"
        />
      </div>
      <ListingCaption />
    </div>
  );
}
