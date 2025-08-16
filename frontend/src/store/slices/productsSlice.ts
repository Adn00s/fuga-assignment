import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Product, ProductsState } from '../../types';

const initialState: ProductsState = {
  products: [],
  isLoading: false,
  error: null,
  isCreating: false,
  searchQuery: '',
  selectedArtist: '',
  sortBy: 'newest',
  sortOrder: 'desc',
};

const getAuthHeaders = (getState: any): Record<string, string> => {
  const token = (getState() as { auth: { token: string | null } }).auth.token;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { getState }) => {
    const response = await fetch('/api/v1/products', {
      headers: getAuthHeaders(getState),
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
    const formData = new FormData();
    formData.append('name', productData.name);
    formData.append('artist', productData.artist);
    if (productData.coverArt) {
      formData.append('coverArt', productData.coverArt);
    }

    const endpoint = productData.coverArt ? '/api/v1/products/upload' : '/api/v1/products';

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: getAuthHeaders(getState),
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to create product');
    }

    return response.json();
  }
);

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async (productData: { id: number; name: string; artist: string; coverArt?: File }, { getState }) => {
    if (productData.coverArt) {
            const formData = new FormData();
      formData.append('name', productData.name);
      formData.append('artist', productData.artist);
      formData.append('coverArt', productData.coverArt);

      const response = await fetch(`/api/v1/products/upload/${productData.id}`, {
        method: 'POST',
        headers: getAuthHeaders(getState),
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to update product');
      }

      return response.json();
    } else {
            const response = await fetch(`/api/v1/products/${productData.id}`, {
        method: 'PUT',
        headers: { 
          ...getAuthHeaders(getState), 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
          name: productData.name,
          artist: productData.artist
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update product');
      }

      return response.json();
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (productId: number, { getState }) => {
    const response = await fetch(`/api/v1/products/${productId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(getState),
    });

    if (!response.ok) {
      throw new Error('Failed to delete product');
    }

    return productId;
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
      })
      .addCase(updateProduct.pending, (state) => {
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        const index = state.products.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to update product';
      })
      .addCase(deleteProduct.pending, (state) => {
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action: PayloadAction<number>) => {
        state.products = state.products.filter(p => p.id !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to delete product';
      });
  },
});

export const { clearError, setSearchQuery, setSelectedArtist, setSortBy } = productsSlice.actions;
export default productsSlice.reducer;
