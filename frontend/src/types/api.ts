export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface Category {
  _id: string;
  name: string;
  type: 'age' | 'theme';
  icon: string;
  order: number;
}

export interface CategoriesResponse {
  success: boolean;
  categories: Category[];
  ageCategories?: Category[];
  themeCategories?: Category[];
}

export interface FavoriteResponse {
  success: boolean;
  favorites: any[];
  totalPages: number;
  currentPage: number;
  total: number;
}

export interface CheckFavoriteResponse {
  success: boolean;
  isFavorited: boolean;
}

export interface RecommendationsResponse {
  success: boolean;
  recommendations: any[];
}

export interface ShareResponse {
  success: boolean;
  shareCode?: string;
  shareUrl?: string;
}