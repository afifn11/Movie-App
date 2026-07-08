import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { parseNaturalLanguageFilter } from '../../../lib/gemini';
import styles from './NaturalLanguageFilter.module.css';

export default function NaturalLanguageFilter({ onApply }) {
  const { t } = useTranslation();
  const [text, setText]       = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() || loading) return;
    setLoading(true);
    setError(null);
    try {
      const parsed = await parseNaturalLanguageFilter(text.trim());
      onApply(parsed);
    } catch (err) {
      console.error('Parse filter error:', err);
      setError(err.message || t('nlFilter.errorDefault'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label htmlFor="nlFilter" className={styles.label}>{t('nlFilter.label')}</label>
      <div className={styles.inputRow}>
        <input
          id="nlFilter"
          type="text"
          className={styles.input}
          placeholder={t('nlFilter.placeholder')}
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={loading}
          maxLength={200}
        />
        <button type="submit" className={styles.submitBtn} disabled={loading || !text.trim()}>
          {loading ? t('nlFilter.thinking') : t('nlFilter.apply')}
        </button>
      </div>
      {error && <p className={styles.error}>{error}</p>}
    </form>
  );
}