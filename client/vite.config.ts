import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), tailwindcss()],
	envDir: "./",
	build: {
		rollupOptions: {
			output: {
				manualChunks(id) {
					if (!id.includes("node_modules")) return;
					if (id.includes("recharts")) return "recharts";
					if (id.includes("firebase")) return "firebase";
					if (id.includes("@radix-ui")) return "radix";
					if (id.includes("lucide-react")) return "icons";
					if (id.includes("framer-motion") || id.includes("motion"))
						return "motion";
					return "vendor";
				},
			},
		},
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	server: {
		open: true,
		proxy: {
			"/wishswipe/": "http://localhost:3000",
			"/login": "http://localhost:3000",
		},
	},
});
