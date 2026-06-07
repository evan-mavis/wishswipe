import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { generateSearchHash } from "@/lib/search-hash";
import { requireApiUser } from "@/server/auth";
import { searchEbayItems } from "@/server/ebay";
import { filterUnseenItems } from "@/server/history";
import {
  getOrCreateSearchSession,
  setNextPage,
} from "@/server/search-sessions";
import type { EbayItemSummary, SimplifiedListing } from "@/types/ebay";
import type { ExploreListingsResponse, SearchFilters } from "@/types/listing";

const EBAY_RESPONSE_LIMIT = 200;

const exploreQuerySchema = z.object({
  query: z.string().optional().default("trending"),
  condition: z.string().optional(),
  category: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  background: z.string().optional(),
});

function toSimplifiedListings(items: EbayItemSummary[]): SimplifiedListing[] {
  return items.map((item) => ({
    id: item.itemId,
    itemId: item.itemId,
    title: item.title,
    price: {
      value: item.price.value,
      currency: item.price.currency,
    },
    condition: item.condition,
    itemWebUrl: item.itemWebUrl,
    imageUrl: item.image?.imageUrl,
    sellerFeedbackScore: item.seller.feedbackScore,
  }));
}

export async function GET(request: NextRequest) {
  try {
    const user = await requireApiUser();
    const params = Object.fromEntries(request.nextUrl.searchParams.entries());
    const parseResult = exploreQuerySchema.safeParse(params);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Invalid query parameters", details: parseResult.error.flatten() },
        { status: 400 }
      );
    }

    const searchFilters: SearchFilters = parseResult.data;
    const searchHash = generateSearchHash(searchFilters);
    const searchSession = await getOrCreateSearchSession(
      user.id,
      searchHash,
      searchFilters
    );

    let currentPage = searchSession.pageNumber;
    let currentOffset = (currentPage - 1) * EBAY_RESPONSE_LIMIT;
    let unseenListings: EbayItemSummary[] = [];
    let hasMoreItems = true;
    let attempts = 0;
    const maxAttempts = 5;

    while (
      unseenListings.length === 0 &&
      hasMoreItems &&
      attempts < maxAttempts
    ) {
      const data = await searchEbayItems(searchHash, searchFilters, currentOffset);

      if (!data.itemSummaries || data.itemSummaries.length === 0) {
        hasMoreItems = false;
        break;
      }

      unseenListings = await filterUnseenItems(user.id, data.itemSummaries);

      if (
        parseResult.data.background === "true" &&
        unseenListings.length > 0 &&
        unseenListings.length < 10
      ) {
        currentPage += 1;
        currentOffset = (currentPage - 1) * EBAY_RESPONSE_LIMIT;
        await setNextPage(searchSession.id, currentPage);
      }

      if (unseenListings.length === 0) {
        currentPage += 1;
        currentOffset = (currentPage - 1) * EBAY_RESPONSE_LIMIT;
        await setNextPage(searchSession.id, currentPage);
        attempts += 1;
      }
    }

    const response: ExploreListingsResponse = {
      listings: toSimplifiedListings(unseenListings),
      pagination: {
        currentPage,
        currentOffset,
        totalItemsSeen: searchSession.totalItemsSeen,
        searchSessionId: searchSession.id,
        hasMoreItems: hasMoreItems && attempts < maxAttempts,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    if (error instanceof Response) return error;
    console.error("eBay Browse API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch eBay listings" },
      { status: 500 }
    );
  }
}
