import { useState } from 'react';
import { parseNaturalLanguageFilter } from '../../../lib/gemini';
import styles from './NaturalLanguageFilter.module.css';

export default function NaturalLanguageFilter({ onApply }) {
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
      setError(err.message || 'Could not understand that. Try rephrasing.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label htmlFor="nlFilter" className={styles.label}>✨ Describe what you're in the mood for</label>
      <div className={styles.inputRow}>
        <input
          id="nlFilter"
          type="text"
          className={styles.input}
          placeholder='e.g. "high-rated horror movies from the 2020s under 2 hours"'
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={loading}
          maxLength={200}
        />
        <button type="submit" className={styles.submitBtn} disabled={loading || !text.trim()}>
          {loading ? 'Thinking...' : 'Apply'}
        </button>
      </div>
      {error && <p className={styles.error}>{error}</p>}
    </form>
  );
}