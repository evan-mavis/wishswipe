import type { CSSProperties } from "react";
import { Toaster as Sonner, ToasterProps } from "sonner";
import { useTheme } from "@/hooks/use-theme";

const Toaster = ({ ...props }: ToasterProps) => {
	const { theme } = useTheme();

	return (
		<Sonner
			theme={(theme as ToasterProps["theme"]) ?? "dark"}
			className="toaster group"
			style={
				{
					"--normal-bg": "var(--popover)",
					"--normal-text": "var(--popover-foreground)",
					"--normal-border": "var(--border)",
				} as CSSProperties
			}
			{...props}
		/>
	);
};

export { Toaster };
