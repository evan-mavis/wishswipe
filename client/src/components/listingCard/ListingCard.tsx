import { ListingCaption } from "./components/listingCaption/ListingCaption";

interface ListingCardProps {
  imageUrl: string;
}

export function ListingCard({ imageUrl }: ListingCardProps) {
  return (
    <div className="flex flex-col items-center justify-center">
      <img
        src={imageUrl}
        alt="eBay product"
        className="object-contain rounded-4xl w-full max-h-[500px]"
        loading="lazy"
      />
      <ListingCaption />
    </div>
  );
}
