import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

const BROWSE_LINKS = [
  { to: '/movie/popular',     label: 'Popular' },
  { to: '/movie/now-playing', label: 'Now Playing' },
  { to: '/movie/top-rated',   label: 'Top Rated' },
  { to: '/explore',           label: 'Explore' },
  { to: '/discover',          label: 'AI Discover' },
  { to: '/leaderboard',       label: 'Leaderboard' },
];

const ACCOUNT_LINKS = [
  { to: '/watchlist', label: 'My Watchlist' },
  { to: '/lists',     label: 'My Lists' },
  { to: '/profile',   label: 'My Profile' },
];

function SprocketDivider() {
  const holes = Array.from({ length: 40 });
  return (
    <div className={styles.sprocket} aria-hidden="true">
      {holes.map((_, i) => <span key={i} className={styles.sprocketHole} />)}
    </div>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <SprocketDivider />

      <div className={`container ${styles.inner}`}>
        <div className={styles.grid}>

          {/* Brand */}
          <div className={styles.brandCol}>
            <Link to="/" className={styles.logo}>
              <img src="/logo.png" alt="Netfif Cinema" width="32" height="32" />
              <span className={styles.logoText}>Netfif <span className={styles.logoAccent}>Cinema</span></span>
            </Link>
            <p className={styles.tagline}>
              A personal movie discovery experience — track what you watch, rate what you love, and find your next favorite film.
            </p>
            <p className={styles.credit}>
              Built by{' '}
              <a href="https://mafif.my.id" target="_blank" rel="noopener noreferrer" className={styles.creditLink}>
                Muhammad Afif Naufal
              </a>
            </p>
          </div>

          {/* Browse */}
          <div className={styles.linkCol}>
            <p className={styles.colLabel}>Browse</p>
            {BROWSE_LINKS.map(({ to, label }) => (
              <Link key={to} to={to} className={styles.link}>{label}</Link>
            ))}
          </div>

          {/* Account */}
          <div className={styles.linkCol}>
            <p className={styles.colLabel}>Account</p>
            {ACCOUNT_LINKS.map(({ to, label }) => (
              <Link key={to} to={to} className={styles.link}>{label}</Link>
            ))}
          </div>

          {/* Legal & Attribution */}
          <div className={styles.linkCol}>
            <p className={styles.colLabel}>About</p>
            <p className={styles.tmdbAttribution}>
              This product uses the TMDB API but is not endorsed or certified by TMDB.
            </p>
            <a
              href="https://www.themoviedb.org/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.tmdbLogoLink}
            >
              themoviedb.org
            </a>
          </div>
        </div>

        <div className={styles.bottomBar}>
          <p className={styles.copy}>© {year} Netfif Cinema. All rights reserved.</p>
          <div className={styles.legalLinks}>
            <Link to="/terms" className={styles.legalLink}>Terms</Link>
            <span className={styles.legalDivider}>·</span>
            <Link to="/privacy" className={styles.legalLink}>Privacy</Link>
          </div>
          <button
            type="button"
            className={styles.backToTop}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Back to top"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to top
          </button>
        </div>
      </div>
    </footer>
  );
}