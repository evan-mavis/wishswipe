export interface DbWishlist {
  id: string;
  userId: string;
  name: string;
  description?: string;
  isFavorite: boolean;
  createdAt: Date;
  updatedAt: Date;
  itemCount?: number;
}

export interface DbWishlistItem {
  id: number;
  wishlistId: string;
  ebayItemId: string;
  title?: string;
  imageUrl?: string;
  itemWebUrl?: string;
  price?: number;
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
}

export interface AddItemToWishlistRequest {
  wishlistId: string;
  ebayItemId: string;
  title?: string;
  imageUrl?: string;
  itemWebUrl?: string;
  price?: number;
}
