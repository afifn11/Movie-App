import { useTranslation } from 'react-i18next';
import styles from './LanguageSwitcher.module.css';

const LANGS = [
  { code: 'en', label: 'EN' },
  { code: 'id', label: 'ID' },
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  return (
    <div className={styles.switcher} role="group" aria-label="Language">
      {LANGS.map((lang) => (
        <button
          key={lang.code}
          type="button"
          className={`${styles.langBtn} ${i18n.language === lang.code ? styles.langBtnActive : ''}`}
          onClick={() => i18n.changeLanguage(lang.code)}
          aria-pressed={i18n.language === lang.code}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}