import { ArrowDownToLine, Trash2 } from "lucide-react";
import { ListingCard } from "./components/listingCard/ListingCard";
import { Progress } from "../ui/progress";
import { useState } from "react";

const initialListings: { id: number; imageUrl: string }[] = [
  { id: 1, imageUrl: "/test-image-1.jpg" },
  { id: 2, imageUrl: "/test-image-2.jpg" },
  { id: 3, imageUrl: "/test-image-3.jpg" },
  { id: 4, imageUrl: "/test-image-1.jpg" },
  { id: 5, imageUrl: "/test-image-2.jpg" },
  { id: 6, imageUrl: "/test-image-3.jpg" },
  { id: 7, imageUrl: "/test-image-1.jpg" },
  { id: 8, imageUrl: "/test-image-2.jpg" },
  { id: 9, imageUrl: "/test-image-3.jpg" },
];

export function Listings() {
  const [listings, setListings] = useState(initialListings);
  const [progress, setProgress] = useState(50);

  return (
    <>
      <div className="grid place-items-center">
        {listings.map((listing: { id: number; imageUrl: string }) => (
          <ListingCard
            key={listing.id}
            id={listing.id}
            imageUrl={listing.imageUrl}
            setListings={setListings}
            isActive={false}
            onProgressChange={setProgress}
          />
        ))}
      </div>
      <div className="flex justify-center items-center w-[50%] mt-2">
        <Trash2
          size="40"
          className={`mr-4 transition-all duration-300 ${
            progress < 5 ? "text-red-500 scale-150" : ""
          }`}
        />
        <div className="flex-1">
          <Progress
            value={progress}
            className="bg-gray-200 [&>div]:bg-fuchsia-400"
          />
        </div>
        <ArrowDownToLine
          size="40"
          className={`ml-4 transition-all duration-300 ${
            progress > 95 ? "text-green-500 scale-150" : ""
          }`}
        />
      </div>
    </>
  );
}
