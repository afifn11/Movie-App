import UserMenu from '../../features/auth/UserMenu';
import LoginModal from '../../features/auth/LoginModal';
import { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useWatchlistDB } from '../../../hooks/useWatchlistDB';


import styles from './Navbar.module.css';

// Re-export components at correct path


const NAV_LINKS = [
  { to: '/',                  label: 'Home',        exact: true },
  { to: '/movie/popular',     label: 'Popular' },
  { to: '/movie/now-playing', label: 'Now Playing' },
  { to: '/movie/top-rated',   label: 'Top Rated' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen]   = useState(false);
  const [scrolled, setScrolled]   = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { watchlist } = useWatchlistDB();

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <>
      <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
        <div className={`container ${styles.inner}`}>

          <Link to="/" className={styles.logo}>
            <span className={styles.logoIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M21 3H3C1.9 3 1 3.9 1 5V19C1 20.1 1.9 21 3 21H21C22.1 21 23 20.1 23 19V5C23 3.9 22.1 3 21 3Z" stroke="currentColor" strokeWidth="2"/>
                <path d="M7 3V21M17 3V21M1 9H7M17 9H23M1 15H7M17 15H23" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </span>
            <span className={styles.logoText}>CINE<span className={styles.logoAccent}>MA</span></span>
          </Link>

          <nav className={styles.desktopNav}>
            {NAV_LINKS.map(({ to, label, exact }) => (
              <NavLink key={to} to={to} end={exact}
                className={({ isActive }) => `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
              >{label}</NavLink>
            ))}
          </nav>

          <div className={styles.actions}>
            <Link to="/search" className={styles.iconBtn} title="Search">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </Link>

            <Link to="/watchlist" className={styles.iconBtn} title="Watchlist">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              {watchlist.length > 0 && (
                <span className={styles.badge}>{watchlist.length > 99 ? '99+' : watchlist.length}</span>
              )}
            </Link>

            {isAuthenticated ? (
              <UserMenu />
            ) : (
              <button className={styles.signInBtn} onClick={() => setLoginOpen(true)}>
                Sign In
              </button>
            )}

            <button
              className={`${styles.hamburger} ${menuOpen ? styles.hamburgerOpen : ''}`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </header>

      <div className={`${styles.mobileOverlay} ${menuOpen ? styles.mobileOverlayOpen : ''}`} onClick={() => setMenuOpen(false)} />

      <nav className={`${styles.mobileDrawer} ${menuOpen ? styles.mobileDrawerOpen : ''}`}>
        <div className={styles.mobileDrawerInner}>
          <p className={styles.mobileDrawerLabel}>Navigation</p>
          {NAV_LINKS.map(({ to, label, exact }) => (
            <NavLink key={to} to={to} end={exact}
              className={({ isActive }) => `${styles.mobileNavLink} ${isActive ? styles.mobileNavLinkActive : ''}`}
            >{label}</NavLink>
          ))}
          <NavLink to="/search" className={({ isActive }) => `${styles.mobileNavLink} ${isActive ? styles.mobileNavLinkActive : ''}`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/><path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            Search
          </NavLink>
          <NavLink to="/watchlist" className={({ isActive }) => `${styles.mobileNavLink} ${isActive ? styles.mobileNavLinkActive : ''}`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            Watchlist
            {watchlist.length > 0 && <span className={styles.mobileBadge}>{watchlist.length}</span>}
          </NavLink>
          {isAuthenticated ? (
            <>
              <NavLink to="/profile" className={({ isActive }) => `${styles.mobileNavLink} ${isActive ? styles.mobileNavLinkActive : ''}`}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/></svg>
                Profile
              </NavLink>
              <NavLink to="/lists" className={({ isActive }) => `${styles.mobileNavLink} ${isActive ? styles.mobileNavLinkActive : ''}`}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                My Lists
              </NavLink>
            </>
          ) : (
            <button className={styles.mobileSignIn} onClick={() => { setMenuOpen(false); setLoginOpen(true); }}>
              Sign In with Google
            </button>
          )}
        </div>
      </nav>

      <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
}
