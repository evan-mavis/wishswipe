export interface AnalyticsData {
  swipeCounts: {
    right: number;
    left: number;
  };
  categoryFilters: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  conditionWishlist: Array<{
    condition: string;
    count: number;
  }>;
  searchTerms: Array<{
    term: string;
    count: number;
  }>;
  priceDistribution: Array<{
    range: string;
    count: number;
  }>;
  wishlistStats: {
    largestWishlist: {
      name: string;
      itemCount: number;
    };
    priceStats: {
      average: number;
      max: number;
      min: number;
    };
    totalItemsSaved: number;
    avgSwipesPerSession: number;
  };
}
