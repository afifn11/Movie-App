import UserMenu from '../../features/auth/UserMenu';
import LoginModal from '../../features/auth/LoginModal';
import Avatar from '../../ui/Avatar/Avatar';
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
  { to: '/leaderboard',       label: 'Leaderboard' },
  { to: '/discover',          label: 'Discover ✨' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen]   = useState(false);
  const [scrolled, setScrolled]   = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const location = useLocation();

  const { isAuthenticated, watchlist, profile, user, signOut } = useAuth();

  const avatar = profile?.avatar_url || user?.user_metadata?.avatar_url;
  const name   = profile?.full_name  || user?.user_metadata?.full_name || 'there';

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
              >
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>

          <div className={styles.actions}>
            {/* Search & Watchlist: cuma tampil di desktop. Di mobile dipindah ke Quick Actions dalam drawer. */}
            <Link to="/search" className={`${styles.iconBtn} ${styles.desktopOnly}`} title="Search" aria-label="Search">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </Link>

            <Link to="/watchlist" className={`${styles.iconBtn} ${styles.desktopOnly}`} title="Watchlist" aria-label="Watchlist">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              {watchlist?.length > 0 && (
                <span className={styles.badge}>{watchlist.length > 99 ? '99+' : watchlist.length}</span>
              )}
            </Link>

            <div className={styles.desktopOnly}>
              {isAuthenticated ? <UserMenu /> : (
                <button className={styles.signInBtn} onClick={() => setLoginOpen(true)}>
                  Sign In
                </button>
              )}
            </div>

            <button
              className={`${styles.hamburger} ${menuOpen ? styles.hamburgerOpen : ''}`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </header>

      <div className={`${styles.mobileOverlay} ${menuOpen ? styles.mobileOverlayOpen : ''}`} onClick={() => setMenuOpen(false)} />

      <nav className={`${styles.mobileDrawer} ${menuOpen ? styles.mobileDrawerOpen : ''}`} aria-label="Mobile navigation">
        <div className={styles.mobileDrawerInner}>

          {isAuthenticated ? (
            <Link to="/profile" className={styles.mobileUserCard} onClick={() => setMenuOpen(false)}>
              <Avatar src={avatar} name={name} size={44} />
              <div>
                <p className={styles.mobileUserGreeting}>Welcome back,</p>
                <p className={styles.mobileUserName}>{name}</p>
              </div>
              <svg className={styles.mobileUserChevron} width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          ) : (
            <button className={styles.mobileSignIn} onClick={() => { setMenuOpen(false); setLoginOpen(true); }}>
              Sign In with Google
            </button>
          )}

          {/* Quick Actions: Search & Watchlist, satu tap, tanpa menyesaki top bar */}
          <div className={styles.quickActions}>
            <Link to="/search" className={styles.quickActionBtn} onClick={() => setMenuOpen(false)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Search
            </Link>
            <Link to="/watchlist" className={styles.quickActionBtn} onClick={() => setMenuOpen(false)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Watchlist
              {watchlist?.length > 0 && <span className={styles.quickActionBadge}>{watchlist.length}</span>}
            </Link>
          </div>

          <p className={styles.mobileDrawerLabel}>Navigation</p>
          {NAV_LINKS.map(({ to, label, exact }) => (
            <NavLink key={to} to={to} end={exact}
              className={({ isActive }) => `${styles.mobileNavLink} ${isActive ? styles.mobileNavLinkActive : ''}`}
            >{label}</NavLink>
          ))}

          {isAuthenticated && (
            <>
              <div className={styles.mobileDrawerDivider} />
              <Link to="/lists" className={styles.mobileNavLink} onClick={() => setMenuOpen(false)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                My Lists
              </Link>
              <button className={styles.mobileSignOutBtn} onClick={() => { setMenuOpen(false); signOut(); }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Sign Out
              </button>
            </>
          )}
        </div>
      </nav>

      <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
}