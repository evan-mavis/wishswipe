import Image from "next/image";
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
	const width = `${Number(imageWidth) * 0.25}rem`;
	const height = `${Number(imageHeight) * 0.25}rem`;
	const widthPx = Number(imageWidth) * 4;
	const heightPx = Number(imageHeight) * 4;
	const marginValue = `${Number(margin) * 0.25}rem`;

	return (
		<div className="flex items-center" style={{ margin: marginValue }}>
			<Image
				src="/wishswipe-logo.png"
				alt="WishSwipe Logo"
				width={widthPx}
				height={heightPx}
				style={{ width, height }}
			/>
			<AppHeader fontSize={fontSize} />
			<Image
				src="/wishswipe-logo.png"
				alt="WishSwipe Logo"
				width={widthPx}
				height={heightPx}
				style={{ width, height }}
			/>
		</div>
	);
}
