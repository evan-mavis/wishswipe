import { AppHeader } from "./AppHeader";

interface AppHeaderWithLogoProps {
	imageWidth?: string;
	imageHeight?: string;
	fontSize?: string;
	margin?: string;
}

export function AppHeaderWithLogo({
	fontSize = "text-6xl",
	margin = "4",
}: AppHeaderWithLogoProps) {
	const marginValue = `${Number(margin) * 0.25}rem`;

	return (
		<div className="flex items-center" style={{ margin: marginValue }}>
			<AppHeader fontSize={fontSize} />
		</div>
	);
}
