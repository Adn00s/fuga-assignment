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
}

const initialState: ProductsState = {
  products: [],
  isLoading: false,
  error: null,
  isCreating: false,
};

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async () => {
    const response = await fetch('/api/products');
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    const data = await response.json();
    console.log('fetched products:', data.length);     return data;
  }
);

export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (productData: { name: string; artist: string; coverArt?: File }) => {
    const formData = new FormData();
    formData.append('name', productData.name);
    formData.append('artist', productData.artist);
    if (productData.coverArt) {
      formData.append('coverArt', productData.coverArt);
    }

    const response = await fetch('/api/products', {
      method: 'POST',
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

export const { clearError } = productsSlice.actions;
export default productsSlice.reducer;
