import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { userInteractionService } from "@/services/userInteractionService";

/**
 * Hook that flushes user interactions when navigating between pages
 * This ensures that swipe actions are saved before the user switches UIs
 */
export function useNavigationFlush() {
	const location = useLocation();

	useEffect(() => {
		// flush interactions when the component mounts (user navigated to this page)
		// this ensures any pending interactions from previous pages are saved
		userInteractionService.forceFlush();

		// set up cleanup to flush when component unmounts (user navigates away)
		return () => {
			userInteractionService.forceFlush();
		};
	}, [location.pathname]); // re-run when pathname changes
}
