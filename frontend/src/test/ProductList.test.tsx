import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import ProductList from '../components/ProductList';
import productsSlice from '../store/slices/productsSlice';
import authSlice from '../store/authSlice';

const createTestStore = (initialState: Record<string, any> = {}) => {
  return configureStore({
    reducer: {
      products: productsSlice,
      auth: authSlice,
    },
    preloadedState: {
      products: {
        products: [],
        isLoading: false,
        error: null,
        searchQuery: '',
        selectedArtist: '',
        sortBy: 'newest',
        ...initialState.products,
      },
      auth: {
        isAuthenticated: false,
        token: null,
        user: null,
        ...initialState.auth,
      },
    },
  });
};

describe('ProductList', () => {
  it('shows loading state', () => {
    const store = createTestStore({
      products: { isLoading: true },
    });

    render(
      <Provider store={store}>
        <ProductList />
      </Provider>
    );

    expect(screen.getByText('Loading products...')).toBeInTheDocument();
  });
});
