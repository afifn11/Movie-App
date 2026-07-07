import { useTranslation } from 'react-i18next';
import Navbar from '../layout/Navbar/Navbar';
import Footer from '../layout/Footer/Footer';
import ScrollToTop from '../layout/ScrollToTop';
import styles from './AppLayout.module.css';

export default function AppLayout({ children }) {
  const { t } = useTranslation();
  return (
    <div className={styles.wrapper}>
      <a href="#main-content" className="skip-link">{t('common.skipToContent')}</a>
      <ScrollToTop />
      <Navbar />
      <main id="main-content" className={styles.main}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
