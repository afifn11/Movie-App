import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Modal from '../../ui/Modal/Modal';
import { useAuth } from '../../../context/AuthContext';
import styles from './LoginModal.module.css';

const BENEFIT_ICONS = ['🎬', '⭐', '✨'];
const BENEFIT_KEYS = ['auth.benefit1', 'auth.benefit2', 'auth.benefit3'];

export default function LoginModal({ isOpen, onClose }) {
  const { t } = useTranslation();
  const { signInWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGoogle = async () => {
    try {
      setLoading(true);
      setError(null);
      await signInWithGoogle();
      onClose();
    } catch (err) {
      setError(t('auth.signInFailed'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className={styles.container}>
        <div className={styles.logoWrap}>
          <img src="/logo.png" alt="" width="48" height="48" className={styles.logoImg} />
        </div>

        <h2 className={styles.title}>{t('auth.welcomeTitle')}</h2>
        <p className={styles.subtitle}>{t('auth.welcomeSubtitle')}</p>

        <ul className={styles.benefits}>
          {BENEFIT_KEYS.map((key, i) => (
            <li key={key} className={styles.benefitItem}>
              <span className={styles.benefitIcon}>{BENEFIT_ICONS[i]}</span>
              {t(key)}
            </li>
          ))}
        </ul>

        {error && <p className={styles.error}>{error}</p>}

        <button className={styles.googleBtn} onClick={handleGoogle} disabled={loading}>
          {loading ? (
            <span className={styles.spinner} />
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
          )}
          {loading ? t('auth.signingIn') : t('auth.continueGoogle')}
        </button>

        <p className={styles.terms}>
          {t('auth.termsAgreementPrefix')}{' '}
          <Link to="/terms" onClick={onClose}>{t('auth.termsLink')}</Link>{' '}
          {t('auth.termsAgreementAnd')}{' '}
          <Link to="/privacy" onClick={onClose}>{t('auth.privacyLink')}</Link>
          {t('auth.termsAgreementSuffix')}
        </p>
      </div>
    </Modal>
  );
}