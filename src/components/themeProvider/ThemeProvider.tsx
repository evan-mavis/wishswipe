"use client";

import { useEffect, useState } from "react";
import { ThemeProviderContext } from "./ThemeProviderContext";
import type { Theme } from "@/types/theme";

type ThemeProviderProps = {
	children: React.ReactNode;
	defaultTheme?: Theme;
	storageKey?: string;
};

export function ThemeProvider({
	children,
	defaultTheme = "dark",
	storageKey = "wishswipe-theme",
	...props
}: ThemeProviderProps) {
	const [theme, setTheme] = useState<Theme>(defaultTheme);

	useEffect(() => {
		const storedTheme = localStorage.getItem(storageKey) as Theme | null;
		if (storedTheme && storedTheme !== theme) {
			setTheme(storedTheme);
			return;
		}

		const root = window.document.documentElement;

		root.classList.remove("light", "dark");

		root.classList.add(theme);
	}, [storageKey, theme]);

	const value = {
		theme,
		setTheme: (theme: Theme) => {
			localStorage.setItem(storageKey, theme);
			setTheme(theme);
		},
	};

	return (
		<ThemeProviderContext.Provider {...props} value={value}>
			{children}
		</ThemeProviderContext.Provider>
	);
}
