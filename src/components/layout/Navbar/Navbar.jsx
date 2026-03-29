import { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useWatchlist } from '../../../context/WatchlistContext';
import styles from './Navbar.module.css';

const NAV_LINKS = [
  { to: '/',                  label: 'Home',        exact: true },
  { to: '/movie/popular',     label: 'Popular' },
  { to: '/movie/now-playing', label: 'Now Playing' },
  { to: '/movie/top-rated',   label: 'Top Rated' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled]   = useState(false);
  const location = useLocation();
  const { watchlist } = useWatchlist();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
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

          {/* Logo */}
          <Link to="/" className={styles.logo}>
            <span className={styles.logoIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M21 3H3C1.9 3 1 3.9 1 5V19C1 20.1 1.9 21 3 21H21C22.1 21 23 20.1 23 19V5C23 3.9 22.1 3 21 3Z" stroke="currentColor" strokeWidth="2"/>
                <path d="M7 3V21M17 3V21M1 9H7M17 9H23M1 15H7M17 15H23" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </span>
            <span className={styles.logoText}>
              CINE<span className={styles.logoAccent}>MA</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className={styles.desktopNav} aria-label="Main navigation">
            {NAV_LINKS.map(({ to, label, exact }) => (
              <NavLink
                key={to}
                to={to}
                end={exact}
                className={({ isActive }) =>
                  `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Actions */}
          <div className={styles.actions}>
            {/* Search */}
            <Link
              to="/search"
              className={styles.iconBtn}
              aria-label="Search"
              title="Search movies"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </Link>

            {/* Watchlist */}
            <Link
              to="/watchlist"
              className={styles.iconBtn}
              aria-label="Watchlist"
              title="My watchlist"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {watchlist.length > 0 && (
                <span className={styles.badge}>{watchlist.length > 99 ? '99+' : watchlist.length}</span>
              )}
            </Link>

            {/* Add Movie CTA */}
            <Link to="/movie/create" className={styles.addBtn}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
              <span>Add Movie</span>
            </Link>

            {/* Hamburger */}
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

      {/* Mobile Overlay */}
      <div
        className={`${styles.mobileOverlay} ${menuOpen ? styles.mobileOverlayOpen : ''}`}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile Drawer */}
      <nav
        className={`${styles.mobileDrawer} ${menuOpen ? styles.mobileDrawerOpen : ''}`}
        aria-label="Mobile navigation"
      >
        <div className={styles.mobileDrawerInner}>
          <p className={styles.mobileDrawerLabel}>Navigation</p>

          {NAV_LINKS.map(({ to, label, exact }) => (
            <NavLink
              key={to}
              to={to}
              end={exact}
              className={({ isActive }) =>
                `${styles.mobileNavLink} ${isActive ? styles.mobileNavLinkActive : ''}`
              }
            >
              {label}
            </NavLink>
          ))}

          <NavLink
            to="/search"
            className={({ isActive }) =>
              `${styles.mobileNavLink} ${isActive ? styles.mobileNavLinkActive : ''}`
            }
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
              <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Search
          </NavLink>

          <NavLink
            to="/watchlist"
            className={({ isActive }) =>
              `${styles.mobileNavLink} ${isActive ? styles.mobileNavLinkActive : ''}`
            }
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Watchlist
            {watchlist.length > 0 && (
              <span className={styles.mobileBadge}>{watchlist.length}</span>
            )}
          </NavLink>

          <Link to="/movie/create" className={styles.mobileAddBtn}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
            Add Movie
          </Link>
        </div>
      </nav>
    </>
  );
}
