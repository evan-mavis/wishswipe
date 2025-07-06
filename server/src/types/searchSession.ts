export interface SearchSession {
  id: number;
  user_id: string;
  search_query: string;
  condition_filter?: string;
  category_filter?: string;
  price_min?: number;
  price_max?: number;
  page_number: number;
  total_items_seen: number;
  last_activity: Date;
  search_hash: string;
}
