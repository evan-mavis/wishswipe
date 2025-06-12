import { CornersFrame } from "@/components/contentCornerFrame/CornersFrame";

interface ListingCaptionProps {
  isActive: boolean;
}

export function ListingCaption({ isActive }: ListingCaptionProps) {
  return (
    <div
      className={`p-6 relative mt-4 transition-all duration-1300
        ${isActive ? "opacity-100 translate-x-0 " : "opacity-0 translate-x-15 "}
        ease-out
      `}
    >
      <CornersFrame />
      <h3 className="text-lg font-semibold">Placeholder Item Title</h3>
      <p className="text-sm text-gray-500">Seller: PlaceholderSeller</p>
      <p className="text-xl font-bold">$99.99</p>
      <p className="text-sm">Condition: New</p>
    </div>
  );
}
