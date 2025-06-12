import React, { useState, useCallback } from "react";
import { ListingCard } from "../listingCard/ListingCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "../ui/carousel";
import { ArrowDownToLine, Trash2 } from "lucide-react";
import { Progress } from "../ui/progress";

const images = ["/test-image-1.jpg", "/test-image-2.jpg", "/test-image-3.jpg"];

export function MainCarousel() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(50);
  const [emblaApi, setEmblaApi] = useState<CarouselApi | null>(null);
  const [highlightLeft, setHighlightLeft] = useState(false);
  const [highlightRight, setHighlightRight] = useState(false);
  const [showProgress, setShowProgress] = useState(true);

  const resetHighlights = () => {
    setTimeout(() => {
      setHighlightLeft(false);
      setHighlightRight(false);
    }, 500);
  };

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCurrentImageIndex(emblaApi.selectedScrollSnap());
    setScrollProgress(50); // Reset to center when new slide is selected
  }, [emblaApi]);

  const onScroll = useCallback(() => {
    if (!emblaApi) return;

    const engine = emblaApi.internalEngine();
    const scrollPosition = engine.location.get();
    const target = engine.target.get();
    const diff = scrollPosition - target;

    const slideWidth = engine.containerRect.width;
    const relativeDiff = diff / slideWidth;

    const newProgress = 50 + relativeDiff * 500;

    if (newProgress <= 10) {
      setHighlightLeft(true);
      setScrollProgress(0);
      resetHighlights();
      return;
    }

    if (newProgress >= 90) {
      setHighlightRight(true);
      setScrollProgress(100);
      resetHighlights();
      return;
    }

    setScrollProgress(Math.max(0, Math.min(100, newProgress)));
  }, [emblaApi]);

  React.useEffect(() => {
    if (!emblaApi) return;

    onSelect();
    onScroll();

    emblaApi.on("select", onSelect);
    emblaApi.on("scroll", onScroll);

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("scroll", onScroll);
    };
  }, [emblaApi, onSelect, onScroll]);

  return (
    <div className="w-[70%] flex flex-col items-center">
      <Carousel setApi={setEmblaApi}>
        <CarouselContent>
          {images.map((imageUrl, index) => (
            <CarouselItem key={index}>
              <ListingCard
                imageUrl={imageUrl}
                isActive={index === currentImageIndex}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <div className="flex justify-center items-center w-[50%] mt-2">
        <Trash2
          size="40"
          className={`mr-4 transition-all duration-300 ${
            highlightLeft ? "text-red-500 scale-150" : ""
          }`}
        />
        <div className="flex-1">
          <Progress
            value={scrollProgress}
            className="bg-gray-200 [&>div]:bg-fuchsia-400"
          />
        </div>
        <ArrowDownToLine
          size="40"
          className={`ml-4 transition-all duration-300 ${
            highlightRight ? "text-green-500 scale-150" : ""
          }`}
        />
      </div>
    </div>
  );
}
