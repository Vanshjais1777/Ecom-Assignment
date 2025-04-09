export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

export interface CartItem extends Product {
  quantity: number;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface WishlistItem extends Product {
  addedAt: string;
}

export type SortOption = 'price-asc' | 'price-desc' | 'rating-desc' | 'name-asc';

export interface ErrorResponse {
  message: string;
  status: number;
}