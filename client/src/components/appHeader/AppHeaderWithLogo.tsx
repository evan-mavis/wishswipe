import { AppHeader } from "./AppHeader";

interface AppHeaderWithLogoProps {
  imageWidth?: string;
  imageHeight?: string;
  fontSize?: string;
}

export function AppHeaderWithLogo({
  imageWidth = "25",
  imageHeight = "25",
  fontSize = "text-6xl",
}: AppHeaderWithLogoProps) {
  return (
    <div className="flex items-center">
      <img
        src="wishswipe-logo.png"
        alt="WishSwipe Logo"
        className={`w-${imageWidth} h-${imageHeight}`}
      />
      <AppHeader fontSize={fontSize} />
      <img
        src="wishswipe-logo.png"
        alt="WishSwipe Logo"
        className={`w-${imageWidth} h-${imageHeight}`}
      />
    </div>
  );
}
