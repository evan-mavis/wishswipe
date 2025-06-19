import { ArrowDownToLine, Trash2 } from "lucide-react";
import { ListingCard } from "./components/listingCard/ListingCard";
import { Progress } from "../ui/progress";
import { useState } from "react";
import type { Listing } from "../../types/listing";
import { AnimatePresence } from "framer-motion";

const initialListings: Listing[] = [
  {
    id: 1,
    imageUrl: "/test-image-1.jpg",
    details: {
      title: "MacBook Pro 14-inch M2 Pro 16GB 512GB",
      seller: "TechDeals_USA",
      price: 1999.99,
      condition: "New",
    },
  },
  {
    id: 2,
    imageUrl: "/test-image-2.jpg",
    details: {
      title: "PS5 Digital Edition with DualSense Controller",
      seller: "GameStop_Official",
      price: 499.99,
      condition: "New",
    },
  },
  {
    id: 3,
    imageUrl: "/test-image-3.jpg",
    details: {
      title: 'Samsung 65" QLED 4K Smart TV Q80B Series',
      seller: "ElectronicsHub",
      price: 1299.99,
      condition: "New",
    },
  },
  {
    id: 4,
    imageUrl: "/test-image-1.jpg",
    details: {
      title: "MacBook Pro 14-inch M2 Pro 16GB 512GB",
      seller: "TechDeals_USA",
      price: 1999.99,
      condition: "New",
    },
  },
  {
    id: 5,
    imageUrl: "/test-image-2.jpg",
    details: {
      title: "PS5 Digital Edition with DualSense Controller",
      seller: "GameStop_Official",
      price: 499.99,
      condition: "New",
    },
  },
  {
    id: 6,
    imageUrl: "/test-image-3.jpg",
    details: {
      title: 'Samsung 65" QLED 4K Smart TV Q80B Series',
      seller: "ElectronicsHub",
      price: 1299.99,
      condition: "New",
    },
  },
  {
    id: 7,
    imageUrl: "/test-image-1.jpg",
    details: {
      title: "MacBook Pro 14-inch M2 Pro 16GB 512GB",
      seller: "TechDeals_USA",
      price: 1999.99,
      condition: "New",
    },
  },
  {
    id: 8,
    imageUrl: "/test-image-2.jpg",
    details: {
      title: "PS5 Digital Edition with DualSense Controller",
      seller: "GameStop_Official",
      price: 499.99,
      condition: "New",
    },
  },
  {
    id: 9,
    imageUrl: "/test-image-3.jpg",
    details: {
      title: 'Samsung 65" QLED 4K Smart TV Q80B Series',
      seller: "ElectronicsHub",
      price: 1299.99,
      condition: "New",
    },
  },
];

export function Listings() {
  const [listings, setListings] = useState(initialListings);
  const [progress, setProgress] = useState(50);

  const handleProgressChange = (progress: number) => {
    setProgress(progress);
  };

  return (
    <>
      <div className="grid place-items-center w-full">
        <AnimatePresence mode="wait">
          {listings.map((listing, index) => (
            <ListingCard
              key={listing.id}
              id={listing.id}
              imageUrl={listing.imageUrl}
              details={listing.details}
              setListings={setListings}
              onProgressChange={handleProgressChange}
              index={index} // Add this new prop
            />
          ))}
        </AnimatePresence>
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
