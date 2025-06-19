import { AppHeader } from "./AppHeader";

interface AppHeaderWithLogoProps {
	imageWidth?: string;
	imageHeight?: string;
	fontSize?: string;
	margin?: string;
}

export function AppHeaderWithLogo({
	imageWidth = "12",
	imageHeight = "12",
	fontSize = "text-6xl",
	margin = "4",
}: AppHeaderWithLogoProps) {
	return (
		<div className={`flex items-center m-${margin}`}>
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
