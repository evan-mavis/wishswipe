import { ListingCard } from "../listingCard/ListingCard";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";

export function CustomCarousel() {
  return (
    <Carousel className="w-[70%]">
      <CarouselContent>
        <CarouselItem>
          <ListingCard imageUrl="/test-image-1.jpg" />
        </CarouselItem>
        <CarouselItem>
          <ListingCard imageUrl="/test-image-2.jpg" />
        </CarouselItem>
        <CarouselItem>
          <ListingCard imageUrl="/test-image-3.jpg" />
        </CarouselItem>
      </CarouselContent>
    </Carousel>
  );
}
