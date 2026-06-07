"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowDownToLine, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { ActionToolbar } from "@/components/actionToolbar/actionToolbar";
import { AppHeaderWithLogo } from "@/components/appHeader/AppHeaderWithLogo";
import { Listings } from "@/components/listings/Listings";
import { ListingCaption } from "@/components/listings/components/listingCaption/ListingCaption";
import { PlaceholderListing } from "@/components/placeholderListing/PlaceholderListing";
import { Progress } from "@/components/ui/progress";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNavigationFlush } from "@/hooks/use-navigation-flush";
import { resetSearchSessionsDebounced } from "@/services/maintenanceService";
import { userInteractionService } from "@/services/userInteractionService";
import type { Preferences } from "@/server/preferences";
import type { Listing } from "@/types/listing";

interface SwipeClientProps {
  userName: string;
  initialPreferences: Preferences;
  initialWishlistCount: number;
  initialSelectedWishlistId: string;
}

export function SwipeClient({
  userName,
  initialPreferences,
  initialWishlistCount,
  initialSelectedWishlistId,
}: SwipeClientProps) {
  const isMobile = useIsMobile();
  const initialFilters = useMemo<{
    condition?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
  }>(() => {
    const defaultPriceRange = [10, 75];
    const hasCustomCondition =
      initialPreferences.defaultCondition &&
      initialPreferences.defaultCondition !== "none" &&
      initialPreferences.defaultCondition !== "No Selection";
    const hasCustomCategory =
      initialPreferences.defaultCategory &&
      initialPreferences.defaultCategory !== "none" &&
      initialPreferences.defaultCategory !== "No Selection";
    const hasCustomPriceRange =
      initialPreferences.defaultPriceRange[0] !== defaultPriceRange[0] ||
      initialPreferences.defaultPriceRange[1] !== defaultPriceRange[1];

    return {
      condition: hasCustomCondition ? initialPreferences.defaultCondition : undefined,
      category: hasCustomCategory ? initialPreferences.defaultCategory : undefined,
      minPrice: hasCustomPriceRange
        ? initialPreferences.defaultPriceRange[0]
        : undefined,
      maxPrice: hasCustomPriceRange
        ? initialPreferences.defaultPriceRange[1]
        : undefined,
    };
  }, [initialPreferences]);

  const [showWelcome, setShowWelcome] = useState(true);
  const [search, setSearch] = useState(initialPreferences.defaultSearchTerm);
  const [selectedWishlist, setSelectedWishlist] = useState(
    initialSelectedWishlistId
  );
  const [filters, setFilters] = useState(initialFilters);
  const [progress, setProgress] = useState(50);
  const [currentListing, setCurrentListing] = useState<Listing | null>(null);
  const [wishlistCount, setWishlistCount] = useState(initialWishlistCount);
  const [wishlistsLoading, setWishlistsLoading] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const undoRef = useRef<(() => void) | null>(null);
  const undoCountRef = useRef(0);

  useNavigationFlush();

  useEffect(() => {
    resetSearchSessionsDebounced(60);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isMobile) return;
    const key = "wishswipe:seenKeyboardHint:v2";
    try {
      if (localStorage.getItem(key) === "true") return;
      localStorage.setItem(key, "true");
      toast("Use arrow keys to swipe", {
        description: "Left to dismiss, right to save",
        duration: 4500,
      });
    } catch {
      // ignore storage errors
    }
  }, [isMobile]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) void userInteractionService.forceFlush();
    };
    const handleBeforeUnload = () => {
      void userInteractionService.forceFlush();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    const handleSearchShortcut = (event: KeyboardEvent) => {
      if (!event.metaKey || event.key.toLowerCase() !== "k") return;

      event.preventDefault();
      searchInputRef.current?.focus({ preventScroll: true });
      searchInputRef.current?.select();
    };

    window.addEventListener("keydown", handleSearchShortcut);
    return () => window.removeEventListener("keydown", handleSearchShortcut);
  }, []);

  const handleProgressChange = useCallback((nextProgress: number) => {
    setProgress(nextProgress);
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <div
        className={`flex items-center justify-center px-4 ${
          isMobile ? "min-h-[40px]" : "min-h-[60px]"
        }`}
      >
        <div className="relative">
          {showWelcome ? (
            <h1
              className={`animate-keyboard-wave bg-gradient-to-r from-fuchsia-300 via-white to-fuchsia-300 bg-[length:200%_auto] bg-clip-text text-center text-transparent transition-opacity duration-500 ${
                isMobile ? "text-sm" : "text-xl"
              }`}
            >
              Welcome, {userName}. Swipe away.
            </h1>
          ) : (
            <h1 className="animate-bounce-in">
              <AppHeaderWithLogo
                fontSize={isMobile ? "text-lg" : "text-3xl"}
                imageHeight={isMobile ? "5" : "8"}
                imageWidth={isMobile ? "5" : "8"}
                margin="0"
              />
            </h1>
          )}
        </div>
      </div>

      <div
        className={`flex items-center justify-center px-4 ${
          isMobile ? "min-h-[60px] py-0" : "min-h-[80px] py-1"
        }`}
      >
        <ActionToolbar
          search={search}
          setSearch={setSearch}
          filters={filters}
          setFilters={setFilters}
          selectedWishlist={selectedWishlist}
          onWishlistChange={setSelectedWishlist}
          onUndo={() => undoRef.current?.()}
          undoCount={undoCountRef.current}
          onWishlistCountChange={setWishlistCount}
          onWishlistsLoadingChange={setWishlistsLoading}
          searchInputRef={searchInputRef}
        />
      </div>

      <div
        className={`flex items-center justify-center px-4 ${
          isMobile ? "mt-1 h-[50vh]" : "mt-1 max-h-[75vh] flex-1"
        }`}
      >
        {wishlistsLoading ? (
          <PlaceholderListing text="Loading wishlists..." />
        ) : wishlistCount === 0 ? (
          <PlaceholderListing
            text="Create a wishlist to start swiping."
            showArrows={false}
            actionButton={
              <Link
                href="/wishlists"
                className="inline-flex items-center rounded-lg bg-fuchsia-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-fuchsia-600"
              >
                My Wishlists
              </Link>
            }
          />
        ) : (
          <Listings
            searchQuery={search}
            filters={filters}
            selectedWishlistId={selectedWishlist}
            undoRef={undoRef}
            undoCountRef={undoCountRef}
            onProgressChange={handleProgressChange}
            onCurrentListingChange={setCurrentListing}
          />
        )}
      </div>

      {wishlistCount > 0 && (
        <div
          className={`flex items-center justify-center px-4 ${
            isMobile ? "mt-1 min-h-[30px] py-0" : "min-h-[40px] py-1"
          }`}
        >
          {currentListing ? (
            <ListingCaption
              key={currentListing.itemId}
              isActive
              listing={currentListing}
            />
          ) : (
            <div className="text-muted-foreground text-center">No listing selected</div>
          )}
        </div>
      )}

      {wishlistCount > 0 && (
        <div
          className={`flex items-center justify-center px-4 ${
            isMobile ? "mt-1 min-h-[40px] py-0" : "min-h-[60px] py-1"
          }`}
        >
          <div className="mx-auto flex w-full max-w-[600px] items-center justify-center">
            <Trash2
              size={isMobile ? 24 : 28}
              className={`mr-4 transition-transform duration-300 ${
                progress < 5 ? "scale-150 text-red-500" : ""
              }`}
            />
            <div className="flex-1">
              <Progress value={progress} className="bg-gray-200 [&>div]:bg-fuchsia-400" />
            </div>
            <ArrowDownToLine
              size={isMobile ? 24 : 28}
              className={`ml-4 transition-transform duration-300 ${
                progress > 95 ? "scale-150 text-green-500" : ""
              }`}
            />
          </div>
        </div>
      )}
    </div>
  );
}
