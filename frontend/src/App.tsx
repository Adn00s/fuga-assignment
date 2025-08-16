import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { loginUser, registerUser, fetchProfile, clearError } from './store/authSlice';
import './App.css';
import ProductForm from './components/ProductForm';
import ProductList from './components/ProductList';
import Navbar from './components/Navbar';
import AuthForm from './components/AuthForm';

function App() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, token, isLoading, error } = useAppSelector(state => state.auth);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
        if (token && !isAuthenticated) {
      dispatch(fetchProfile());
    }
  }, [dispatch, token, isAuthenticated]);

  const handleLogin = async (email: string, password: string) => {
    try {
      await dispatch(loginUser({ email, password })).unwrap();
      setShowAuthModal(false);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleRegister = async (email: string, password: string, name: string) => {
    try {
      await dispatch(registerUser({ email, password, name })).unwrap();
      setShowAuthModal(false);
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  const handleCloseModal = () => {
    setShowAuthModal(false);
    dispatch(clearError());
  };

  return (
    <div className="app">
      <Navbar onShowAuth={() => setShowAuthModal(true)} />
      
      <main className="app-main">
        <div className="container">
          {isAuthenticated && <ProductForm />}
          <ProductList />
        </div>
      </main>

      {showAuthModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={handleCloseModal}>×</button>
            <AuthForm
              onLogin={handleLogin}
              onRegister={handleRegister}
              isLoading={isLoading}
              error={error || undefined}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
