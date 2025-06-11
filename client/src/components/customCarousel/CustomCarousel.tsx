import { EbayListingCard } from "../ebayListingCard/EbayListingCard";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";

export function CustomCarousel() {
  return (
    <Carousel className="w-[70%] ">
      <CarouselContent>
        <CarouselItem>
          <EbayListingCard imageUrl="/test-image-3.jpg" />
        </CarouselItem>
        <CarouselItem>
          <EbayListingCard imageUrl="/test-image-2.jpg" />
        </CarouselItem>
        <CarouselItem>
          <EbayListingCard imageUrl="/test-image-3.jpg" />
        </CarouselItem>
      </CarouselContent>
    </Carousel>
  );
}
