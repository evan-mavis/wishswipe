interface AppHeaderProps {
  fontSize?: string;
}

export function AppHeader({ fontSize = "text-lg" }: AppHeaderProps) {
  return (
    <div className={`font-bold ${fontSize}`}>
      Wish<em className="text-fuchsia-300">Swipe</em>
    </div>
  );
}
