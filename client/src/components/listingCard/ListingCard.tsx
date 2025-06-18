import type { Dispatch, SetStateAction } from "react";
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
  isActive: boolean;
  setListings: Dispatch<SetStateAction<{ id: number; imageUrl: string }[]>>;
}

export function ListingCard({
  id,
  imageUrl,
  isActive,
  setListings,
}: ListingCardProps) {
  const x = useMotionValue(0);

  useMotionValueEvent(x, "change", (latest) => {
    console.log("X position changed:", latest);
  });

  const opacity = useTransform(x, [-350, 0, 350], [0, 1, 0]);
  const rotate = useTransform(x, [-350, 350], [-15, 15]);

  const handleDragEnd = () => {
    if (Math.abs(x.get()) > 100) {
      setListings((pv) => pv.filter((v) => v.id !== id));
    }
  };

  return (
    <motion.div
      style={{
        gridRow: 1,
        gridColumn: 1,
        x,
        opacity,
        rotate,
        transition: "0.125s transform ease-in",
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
      <ListingCaption isActive={isActive} />
    </motion.div>
  );
}
