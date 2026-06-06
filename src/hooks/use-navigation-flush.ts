"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { userInteractionService } from "@/services/userInteractionService";

export function useNavigationFlush() {
	const pathname = usePathname();

	useEffect(() => {
		userInteractionService.forceFlush();

		return () => {
			userInteractionService.forceFlush();
		};
	}, [pathname]);
}
