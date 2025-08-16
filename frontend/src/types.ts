export interface Product {
  id: number;
  name: string;
  artist: string;
  cover_art?: string;   created_at: string; }

export interface User {
  id: number;
  email: string;
  username?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface ProductsState {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  isCreating: boolean;   searchQuery: string;
  selectedArtist: string;
  sortBy: 'newest' | 'alphabetical';   sortOrder: 'asc' | 'desc';
}

export interface APIResponse<T = unknown> {
  data?: T;
  message?: string;
  error?: string;
}

export interface CreateProductFormData {
  name: string;
  artist: string;
  coverArt?: File;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  email: string;
  username?: string;
  password: string;
  confirmPassword: string;
}
