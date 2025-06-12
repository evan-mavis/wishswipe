import React, { useState, useCallback } from "react";
import { ListingCard } from "../listingCard/ListingCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "../ui/carousel";

const images = ["/test-image-3.jpg", "/test-image-2.jpg", "/test-image-3.jpg"];

export function MainCarousel() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [emblaApi, setEmblaApi] = useState<CarouselApi | null>(null);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCurrentImageIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  React.useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <Carousel className="w-[70%]" setApi={setEmblaApi}>
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
  );
}
