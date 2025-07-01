export interface EbaySearchOptions {
  limit?: number;
  offset?: number;
  category?: string;
  condition?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface SimplifiedListing {
  itemId: string;
  title: string;
  price: {
    value: string;
    currency: string;
  };
  condition: string;
  itemWebUrl: string;
  imageUrl?: string;
  sellerFeedbackScore: number;
}

// ebay api types
export interface EbayPrice {
  value: string;
  currency: string;
}

export interface EbaySeller {
  feedbackScore: number;
  username?: string;
}

export interface EbayCategory {
  categoryId: string;
  categoryName: string;
}

export interface EbayShippingCost {
  value: string;
  currency: string;
}

export interface EbayShippingOption {
  shippingCostType: string;
  shippingCost: EbayShippingCost;
}

export interface EbayItemLocation {
  postalCode: string;
  country: string;
}

export interface EbayItemSummary {
  itemId: string;
  title: string;
  leafCategoryIds: string[];
  categories: EbayCategory[];
  price: EbayPrice;
  itemHref: string;
  seller: EbaySeller;
  condition: string;
  conditionId: string;
  shippingOptions: EbayShippingOption[];
  buyingOptions: string[];
  itemWebUrl: string;
  itemLocation: EbayItemLocation;
  adultOnly: boolean;
  legacyItemId: string;
  availableCoupons: boolean;
  itemOriginDate: string;
  itemCreationDate: string;
  topRatedBuyingExperience: boolean;
  priorityListing: boolean;
  listingMarketplaceId: string;
  image?: {
    imageUrl: string;
  };
}

export interface EbaySearchResponse {
  href: string;
  total: number;
  next: string;
  limit: number;
  offset: number;
  itemSummaries: EbayItemSummary[];
}
