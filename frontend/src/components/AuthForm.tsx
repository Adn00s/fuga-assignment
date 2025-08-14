import React, { useState } from 'react';
import styles from './AuthForm.module.css';

interface AuthFormProps {
  onLogin: (email: string, password: string) => void;
  onRegister: (email: string, password: string, name: string) => void;
  isLoading?: boolean;
  error?: string;
}

export default function AuthForm({ onLogin, onRegister, isLoading, error }: AuthFormProps) {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoginMode) {
      onLogin(email, password);
    } else {
      onRegister(email, password, name);
    }
  };

  return (
    <div className={styles.authContainer}>
      <form onSubmit={handleSubmit} className={styles.authForm}>
        <h2>{isLoginMode ? 'Login' : 'Register'}</h2>
        
        {error && <div className={styles.error}>{error}</div>}
        
        <div className={styles.field}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className={styles.field}>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {!isLoginMode && (
          <div className={styles.field}>
            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        )}

        <button type="submit" disabled={isLoading} className={styles.submitBtn}>
          {isLoading ? 'Loading...' : (isLoginMode ? 'Login' : 'Register')}
        </button>

        <p className={styles.switchMode}>
          {isLoginMode ? "Don't have an account? " : "Already have an account? "}
          <button 
            type="button" 
            onClick={() => setIsLoginMode(!isLoginMode)}
            className={styles.switchBtn}
          >
            {isLoginMode ? 'Register' : 'Login'}
          </button>
        </p>
      </form>
    </div>
  );
}
