import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface Product {
  id: number;
  name: string;
  artist: string;
  cover_art?: string;
  created_at: string;
}

interface ProductsState {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  isCreating: boolean;
  searchQuery: string;
  selectedArtist: string;
  sortBy: 'newest' | 'alphabetical';
}

const initialState: ProductsState = {
  products: [],
  isLoading: false,
  error: null,
  isCreating: false,
  searchQuery: '',
  selectedArtist: '',
  sortBy: 'newest',
};

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { getState }) => {
    const state = getState() as { auth: { token: string | null } };
    const token = state.auth.token;

    const headers: Record<string, string> = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch('/api/v1/products', {
      headers,
    });

    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }

    return response.json();
  }
);

export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (productData: { name: string; artist: string; coverArt?: File }, { getState }) => {
    const state = getState() as { auth: { token: string | null } };
    const token = state.auth.token;

    const formData = new FormData();
    formData.append('name', productData.name);
    formData.append('artist', productData.artist);
    if (productData.coverArt) {
      formData.append('coverArt', productData.coverArt);
    }

    const headers: Record<string, string> = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch('/api/v1/products', {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to create product');
    }

    return response.json();
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSelectedArtist: (state, action: PayloadAction<string>) => {
      state.selectedArtist = action.payload;
    },
    setSortBy: (state, action: PayloadAction<'newest' | 'alphabetical'>) => {
      state.sortBy = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.isLoading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Something went wrong loading products';
      })
            .addCase(createProduct.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        state.isCreating = false;
        state.products.unshift(action.payload);               })
      .addCase(createProduct.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.error.message || 'Failed to create product';
      });
  },
});

export const { clearError, setSearchQuery, setSelectedArtist, setSortBy } = productsSlice.actions;
export default productsSlice.reducer;
