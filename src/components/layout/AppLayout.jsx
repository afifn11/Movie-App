import Navbar from '../layout/Navbar/Navbar';
import Footer from '../layout/Footer/Footer';
import ScrollToTop from '../layout/ScrollToTop';
import styles from './AppLayout.module.css';

export default function AppLayout({ children }) {
  return (
    <div className={styles.wrapper}>
      <ScrollToTop />
      <Navbar />
      <main className={styles.main}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
