import type { Dispatch, SetStateAction } from "react";
import type { Listing, ListingDetails } from "../../../../types/listing";
import { ListingCaption } from "./components/listingCaption/ListingCaption";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
} from "framer-motion";

interface ListingCardProps {
  id: number;
  imageUrl: string;
  details: ListingDetails;
  isActive: boolean;
  setListings: Dispatch<SetStateAction<Listing[]>>;
  onProgressChange?: (progress: number) => void;
}

export function ListingCard({
  id,
  imageUrl,
  details,
  isActive,
  setListings,
  onProgressChange,
}: ListingCardProps) {
  const x = useMotionValue(0);
  const DRAG_THRESHOLD = 150;

  useMotionValueEvent(x, "change", (latest) => {
    // Adjust calculation to reach 0/100 at threshold
    const progress = 50 + (latest / DRAG_THRESHOLD) * 50;
    onProgressChange?.(Math.min(Math.max(progress, 0), 100));
  });

  const opacity = useTransform(
    x,
    [-DRAG_THRESHOLD, 0, DRAG_THRESHOLD],
    [0.2, 1, 0.2]
  );
  const rotate = useTransform(x, [-DRAG_THRESHOLD, DRAG_THRESHOLD], [-15, 15]);

  const handleDragEnd = () => {
    if (Math.abs(x.get()) > DRAG_THRESHOLD) {
      setListings((pv) => pv.filter((v) => v.id !== id));
    }
    onProgressChange?.(50); // This will reset progress and activeId
  };

  return (
    <motion.div
      style={{
        gridRow: 1,
        gridColumn: 1,
        x,
        opacity,
        rotate,
      }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      className="cursor-grab active:cursor-grabbing"
      onDragEnd={handleDragEnd}
    >
      <div className="w-full h-[60vh] pointer-events-none">
        <img
          src={imageUrl}
          alt="eBay product"
          className="object-contain h-full w-full pointer-events-none"
          loading="lazy"
          draggable="false"
        />
      </div>
      <ListingCaption isActive={isActive} details={details} />
    </motion.div>
  );
}
