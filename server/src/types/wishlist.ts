export interface DbWishlist {
  id: string;
  name: string;
  description?: string;
  isFavorite: boolean;
  orderIndex: number;
  createdAt: Date;
  updatedAt: Date;
  itemCount?: number;
}

export interface DbWishlistItem {
  id: string;
  wishlistId: string;
  ebayItemId: string;
  title?: string;
  imageUrl?: string;
  itemWebUrl?: string;
  price?: number;
  sellerFeedbackScore?: number;
  orderIndex: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface DbWishlistWithItems extends DbWishlist {
  items: DbWishlistItem[];
}

// Request types
export interface CreateWishlistRequest {
  userId: string;
  name: string;
  description?: string;
  isFavorite?: boolean;
  orderIndex?: number;
}

export interface UpdateWishlistRequest {
  name?: string;
  description?: string;
  isFavorite?: boolean;
}

export interface ReorderWishlistsRequest {
  wishlistIds: string[];
}

export interface ReorderWishlistItemsRequest {
  itemIds: string[];
}

export interface AddItemToWishlistRequest {
  wishlistId: string;
  ebayItemId: string;
  title?: string;
  imageUrl?: string;
  itemWebUrl?: string;
  price?: number;
  sellerFeedbackScore?: number;
}
