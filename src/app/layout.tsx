import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/themeProvider/ThemeProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "WishSwipe",
  description: "Swipe-based discovery for eBay finds.",
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "32x32", type: "image/png" },
      { url: "/icon.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeProvider storageKey="wishswipe-theme">{children}</ThemeProvider>
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
