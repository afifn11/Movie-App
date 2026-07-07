import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styles from './NotFound.module.css';

export default function NotFound() {
  const { t } = useTranslation();
  return (
    <div className={styles.page}>
      <div className={styles.code}>404</div>
      <h1 className={styles.title}>{t('notFound.title')}</h1>
      <p className={styles.message}>{t('notFound.message')}</p>
      <Link to="/" className={styles.homeBtn}>{t('notFound.backHome')}</Link>
    </div>
  );
}