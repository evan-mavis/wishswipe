export interface Listing {
  id: number;
  imageUrl: string;
  details: ListingDetails;
}

export interface ListingDetails {
  title: string;
  seller: string;
  price: number;
  condition: string;
}
