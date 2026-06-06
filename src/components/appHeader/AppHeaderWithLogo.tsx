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
	const marginValue = `${Number(margin) * 0.25}rem`;

	return (
		<div className="flex items-center" style={{ margin: marginValue }}>
			<img
				src="/wishswipe-logo.png"
				alt="WishSwipe Logo"
				style={{ width, height }}
			/>
			<AppHeader fontSize={fontSize} />
			<img
				src="/wishswipe-logo.png"
				alt="WishSwipe Logo"
				style={{ width, height }}
			/>
		</div>
	);
}
