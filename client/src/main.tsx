import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import WishSwipe from "./WishSwipe";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<WishSwipe />
	</StrictMode>
);
