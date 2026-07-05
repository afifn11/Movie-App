import UserMenu from '../../features/auth/UserMenu';
import LoginModal from '../../features/auth/LoginModal';
import { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

import styles from './Navbar.module.css';

const NAV_LINKS = [
  { to: '/',                  label: 'Home',        exact: true },
  { to: '/movie/popular',     label: 'Popular' },
  { to: '/explore',           label: 'Explore' },
  { to: '/movie/now-playing', label: 'Now Playing' },
  { to: '/movie/top-rated',   label: 'Top Rated' },
  { to: '/leaderboard',       label: 'Leaderboard 🏆' },
  { to: '/discover',          label: 'Discover ✨' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen]   = useState(false);
  const [scrolled, setScrolled]   = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const location = useLocation();
  
  const { isAuthenticated, watchlist } = useAuth();

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
              <img src="/logo.png" alt="Netfif Cinema Logo" width="36" height="36" loading="eager" />
            </span>
            <span className={styles.logoText}>Netfif <span className={styles.logoAccent}>Cinema</span></span>
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
              {watchlist?.length > 0 && (
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
            {watchlist?.length > 0 && <span className={styles.mobileBadge}>{watchlist.length}</span>}
          </NavLink>

          <div className={styles.mobileDrawerDivider} />

          {!isAuthenticated && (
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