import { CornersFrame } from "@/components/contentCornerFrame/CornersFrame";

export function ListingCaption() {
  return (
    <div className="p-6 relative mt-4">
      <CornersFrame />
      <h3 className="text-lg font-semibold">Placeholder Item Title</h3>
      <p className="text-sm text-gray-500">Seller: PlaceholderSeller</p>
      <p className="text-xl font-bold">$99.99</p>
      <p className="text-sm">Condition: New</p>
    </div>
  );
}
