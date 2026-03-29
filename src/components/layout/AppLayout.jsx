import Navbar from '../layout/Navbar/Navbar';
import Footer from '../layout/Footer/Footer';
import styles from './AppLayout.module.css';

export default function AppLayout({ children }) {
  return (
    <div className={styles.wrapper}>
      <Navbar />
      <main className={styles.main}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
