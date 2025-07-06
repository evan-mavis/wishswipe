export interface UserPreferences {
  id: string;
  user_id: string;
  default_search_term: string;
  default_condition: string;
  default_category: string;
  default_price_min: number;
  default_price_max: number;
  created_at: Date;
  updated_at: Date;
}

export interface CreateUserPreferences {
  user_id: string;
  default_search_term?: string;
  default_condition?: string;
  default_category?: string;
  default_price_min?: number;
  default_price_max?: number;
}

export interface UpdateUserPreferences {
  default_search_term?: string;
  default_condition?: string;
  default_category?: string;
  default_price_min?: number;
  default_price_max?: number;
}
