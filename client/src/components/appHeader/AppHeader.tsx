interface AppHeaderProps {
	fontSize?: string;
}

export function AppHeader({ fontSize = "text-lg" }: AppHeaderProps) {
	return (
		<div className={`font-bold ${fontSize}`}>
			Wish
			<em className="animate-keyboard-wave bg-gradient-to-r from-fuchsia-300 via-white to-fuchsia-300 bg-[length:200%_auto] bg-clip-text text-fuchsia-300 text-transparent">
				Swipe
			</em>
		</div>
	);
}
