import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout } from '../store/authSlice';
import styles from './Navbar.module.css';

interface NavbarProps {
  onShowAuth: () => void;
}

export default function Navbar({ onShowAuth }: NavbarProps) {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector(state => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContent}>
        <h1 className={styles.logo}>Fuga Music</h1>
        
        <div className={styles.navActions}>
          {isAuthenticated ? (
            <div className={styles.userMenu}>
              <span className={styles.welcome}>Hi, {user?.name}</span>
              <button onClick={handleLogout} className={styles.logoutBtn}>
                Logout
              </button>
            </div>
          ) : (
            <button onClick={onShowAuth} className={styles.loginBtn}>
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
