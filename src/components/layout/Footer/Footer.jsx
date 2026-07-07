import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styles from './Footer.module.css';

const BROWSE_LINKS = [
  { to: '/movie/popular',     key: 'nav.popular' },
  { to: '/movie/now-playing', key: 'nav.nowPlaying' },
  { to: '/movie/top-rated',   key: 'nav.topRated' },
  { to: '/explore',           key: 'nav.explore' },
  { to: '/discover',          key: 'footer.aiDiscover' },
  { to: '/leaderboard',       key: 'nav.leaderboard' },
];

const ACCOUNT_LINKS = [
  { to: '/watchlist', key: 'footer.myWatchlist' },
  { to: '/lists',     key: 'footer.myLists' },
  { to: '/profile',   key: 'footer.myProfile' },
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
  const { t } = useTranslation();
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
              {t('footer.tagline')}
            </p>
            <p className={styles.credit}>
              {t('footer.builtBy')}{' '}
              <a href="https://mafif.my.id" target="_blank" rel="noopener noreferrer" className={styles.creditLink}>
                Muhammad Afif Naufal
              </a>
            </p>
          </div>

          {/* Browse */}
          <div className={styles.linkCol}>
            <p className={styles.colLabel}>{t('footer.browse')}</p>
            {BROWSE_LINKS.map(({ to, key }) => (
              <Link key={to} to={to} className={styles.link}>{t(key)}</Link>
            ))}
          </div>

          {/* Account */}
          <div className={styles.linkCol}>
            <p className={styles.colLabel}>{t('footer.account')}</p>
            {ACCOUNT_LINKS.map(({ to, key }) => (
              <Link key={to} to={to} className={styles.link}>{t(key)}</Link>
            ))}
          </div>

          {/* Legal & Attribution */}
          <div className={styles.linkCol}>
            <p className={styles.colLabel}>{t('footer.about')}</p>
            <p className={styles.tmdbAttribution}>
              {t('footer.tmdbAttribution')}
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
          <p className={styles.copy}>© {year} Netfif Cinema. {t('footer.allRightsReserved')}</p>
          <div className={styles.legalLinks}>
            <Link to="/terms" className={styles.legalLink}>{t('footer.terms')}</Link>
            <span className={styles.legalDivider}>·</span>
            <Link to="/privacy" className={styles.legalLink}>{t('footer.privacy')}</Link>
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
            {t('common.backToTop')}
          </button>
        </div>
      </div>
    </footer>
  );
}