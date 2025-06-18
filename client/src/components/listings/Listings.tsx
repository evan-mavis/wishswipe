import { ArrowDownToLine, Trash2 } from "lucide-react";
import { ListingCard } from "./components/listingCard/ListingCard";
import { Progress } from "../ui/progress";
import { useState } from "react";
import type { Listing } from "../../types/listing";

const initialListings: Listing[] = [
  {
    id: 1,
    imageUrl: "/test-image-1.jpg",
    details: {
      title: "Test Item 1",
      seller: "TestSeller1",
      price: 99.99,
      condition: "New",
    },
  },
  {
    id: 2,
    imageUrl: "/test-image-2.jpg",
    details: {
      title: "Test Item 2",
      seller: "TestSeller2",
      price: 89.99,
      condition: "Used",
    },
  },
  {
    id: 3,
    imageUrl: "/test-image-3.jpg",
    details: {
      title: "Test Item 3",
      seller: "TestSeller3",
      price: 79.99,
      condition: "Refurbished",
    },
  },
  {
    id: 4,
    imageUrl: "/test-image-1.jpg",
    details: {
      title: "Test Item 4",
      seller: "TestSeller4",
      price: 69.99,
      condition: "New",
    },
  },
  {
    id: 5,
    imageUrl: "/test-image-2.jpg",
    details: {
      title: "Test Item 5",
      seller: "TestSeller5",
      price: 59.99,
      condition: "Used",
    },
  },
  {
    id: 6,
    imageUrl: "/test-image-3.jpg",
    details: {
      title: "Test Item 6",
      seller: "TestSeller6",
      price: 49.99,
      condition: "Refurbished",
    },
  },
  {
    id: 7,
    imageUrl: "/test-image-1.jpg",
    details: {
      title: "Test Item 7",
      seller: "TestSeller7",
      price: 39.99,
      condition: "New",
    },
  },
  {
    id: 8,
    imageUrl: "/test-image-2.jpg",
    details: {
      title: "Test Item 8",
      seller: "TestSeller8",
      price: 29.99,
      condition: "Used",
    },
  },
  {
    id: 9,
    imageUrl: "/test-image-3.jpg",
    details: {
      title: "Test Item 9",
      seller: "TestSeller9",
      price: 19.99,
      condition: "Refurbished",
    },
  },
];

export function Listings() {
  const [listings, setListings] = useState(initialListings);
  const [progress, setProgress] = useState(50);
  const [activeId, setActiveId] = useState<number | null>(null);

  const handleProgressChange = (progress: number, id: number) => {
    setProgress(progress);
    setActiveId(progress === 50 ? null : id);
  };

  return (
    <>
      <div className="grid place-items-center">
        {listings.map((listing) => (
          <ListingCard
            key={listing.id}
            id={listing.id}
            imageUrl={listing.imageUrl}
            details={listing.details}
            setListings={setListings}
            isActive={listing.id === activeId}
            onProgressChange={(progress) =>
              handleProgressChange(progress, listing.id)
            }
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
