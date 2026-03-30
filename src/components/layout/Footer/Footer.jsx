import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

const FOOTER_LINKS = [
  { to: '/',                  label: 'Home' },
  { to: '/movie/popular',     label: 'Popular' },
  { to: '/movie/now-playing', label: 'Now Playing' },
  { to: '/movie/top-rated',   label: 'Top Rated' },
  { to: '/search',            label: 'Search' },
  { to: '/watchlist',         label: 'Watchlist' },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.brand}>
          <span className={styles.logo}>CINE<span>MA</span></span>
          <p className={styles.tagline}>Your personal movie discovery experience</p>
        </div>
        <nav className={styles.links} aria-label="Footer navigation">
          {FOOTER_LINKS.map(({ to, label }) => (
            <Link key={to} to={to} className={styles.link}>{label}</Link>
          ))}
        </nav>
        <p className={styles.copy}>© {new Date().getFullYear()} Cinema. Powered by TMDB.</p>
      </div>
    </footer>
  );
}
