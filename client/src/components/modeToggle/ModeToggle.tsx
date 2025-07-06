import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { Switch } from "../ui/switch";

export function ModeToggle() {
	const { theme, setTheme } = useTheme();

	return (
		<div className="items-centers flex gap-1">
			<Moon size={16} className={theme === "dark" ? "text-fuchsia-400" : ""} />
			<Switch
				checked={theme === "light"}
				onCheckedChange={(checked) => setTheme(checked ? "light" : "dark")}
			/>
			<Sun size={16} className={theme === "light" ? "text-orange-400" : ""} />
		</div>
	);
}
