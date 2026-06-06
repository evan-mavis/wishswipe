import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/themeProvider/ThemeProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "WishSwipe",
  description: "Swipe-based discovery for eBay finds.",
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
