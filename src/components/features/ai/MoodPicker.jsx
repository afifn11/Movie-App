import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getMoodRecommendations } from '../../../lib/gemini';
import { enrichWithTmdbPoster } from '../../../hooks/useEnrichWithTmdb';
import { Link } from 'react-router-dom';
import styles from './MoodPicker.module.css';

const MOOD_PRESET_DEFS = [
  { key: 'laugh', value: 'I want something funny and lighthearted' },
  { key: 'emotional', value: 'I want to feel deeply moved or cry' },
  { key: 'adrenaline', value: 'I want intense action and thrills' },
  { key: 'think', value: 'I want a thought-provoking, mind-bending story' },
  { key: 'romantic', value: 'I want a heartwarming love story' },
  { key: 'scared', value: 'I want something terrifying and suspenseful' },
  { key: 'inspiration', value: 'I want something uplifting and motivating' },
  { key: 'relax', value: 'I want something calm, beautiful and peaceful' },
];

const TIME_OPTION_DEFS = [
  { key: 'under90', i18nKey: 'filter.under90', value: 'under 90 minutes' },
  { key: '90to120', i18nKey: 'mood.time90to120', value: '90 to 120 minutes' },
  { key: '2plus', i18nKey: 'mood.time2plus', value: 'over 2 hours' },
  { key: 'flexible', i18nKey: 'filter.anyLength', value: 'flexible' },
];

export default function MoodPicker({ watchHistory = [] }) {
  const { t } = useTranslation();
  const MOOD_PRESETS = MOOD_PRESET_DEFS.map((m) => ({ ...m, label: t(`mood.presets.${m.key}`) }));
  const TIME_OPTIONS = TIME_OPTION_DEFS.map((o) => ({ ...o, label: t(o.i18nKey) }));
  const [mood, setMood]           = useState('');
  const [customMood, setCustomMood] = useState('');
  const [time, setTime]           = useState('flexible');
  const [results, setResults]     = useState([]);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState(null);
  const [searched, setSearched]   = useState(false);

  const handleFind = async () => {
    const finalMood = customMood.trim() || mood;
    if (!finalMood) return;
    
    try {
      setLoading(true);
      setError(null);
      setResults([]);

      const watchedTitles = watchHistory.map((h) => h.movie_title);
      
      // 1. Dapatkan metadata film dari Gemini
      const recs = await getMoodRecommendations({
        mood: finalMood,
        timeAvailable: time,
        watchedTitles,
      });

      // 2. Enrich dengan poster TMDB (Tanpa duplikasi & tanpa waterfall)
      const enriched = await enrichWithTmdbPoster(recs);
      
      setResults(enriched);
      setSearched(true);
    } catch (err) {
      setError(t('mood.errorDefault'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h3 className={styles.title}>
          <span className={styles.accent}>/</span> {t('mood.title')}
        </h3>
        <p className={styles.subtitle}>{t('mood.subtitle')}</p>
      </div>

      {/* Mood presets */}
      <div className={styles.presets}>
        {MOOD_PRESETS.map((m) => (
          <button
            key={m.value}
            className={`${styles.preset} ${mood === m.value ? styles.presetActive : ''}`}
            onClick={() => { setMood(m.value); setCustomMood(''); }}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Custom mood */}
      <div className={styles.customRow}>
        <input
          type="text"
          maxLength={100}
          value={customMood}
          onChange={(e) => { setCustomMood(e.target.value); setMood(''); }}
          placeholder={t('mood.customPlaceholder')}
          className={styles.customInput}
        />
      </div>

      {/* Time filter */}
      <div className={styles.timeRow}>
        <span className={styles.timeLabel}>{t('mood.timeAvailable')}</span>
        <div className={styles.timeOptions}>
          {TIME_OPTIONS.map((t) => (
            <button
              key={t.value}
              className={`${styles.timeChip} ${time === t.value ? styles.timeChipActive : ''}`}
              onClick={() => setTime(t.value)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <button
        className={styles.findBtn}
        onClick={handleFind}
        disabled={(!mood && !customMood.trim()) || loading}
      >
        {loading ? (
          <>
            <span className={styles.spinner} />
            {t('mood.finding')}
          </>
        ) : (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L13.09 8.26L19 9.27L15 14.14L16.18 21.02L12 17.77L7.82 21.02L9 14.14L5 9.27L10.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2"/>
            </svg>
            {t('mood.findBtn')}
          </>
        )}
      </button>

      {error && <p className={styles.error}>{error}</p>}

      {/* Results */}
      {searched && results.length > 0 && (
        <div className={styles.results}>
          <p className={styles.resultsLabel}>{t('mood.resultsLabel')}</p>
          <div className={styles.resultsList}>
            {results.map((film, i) => (
              <div key={i} className={styles.resultCard}>
                {film.poster ? (
                  <img src={film.poster} alt={film.title} className={styles.resultPoster} />
                ) : (
                  <div className={styles.resultPosterFallback}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                    </svg>
                  </div>
                )}
                <div className={styles.resultInfo}>
                  <div className={styles.resultTop}>
                    <h4 className={styles.resultTitle}>{film.title}</h4>
                    <span className={styles.resultYear}>{film.year}</span>
                  </div>
                  <span className={styles.resultVibe}>{film.vibe}</span>
                  <p className={styles.resultReason}>{film.mood_match}</p>
                  {film.tmdbId && (
                    <Link to={`/movie/${film.tmdbId}`} className={styles.resultLink}>
                      {t('mood.viewDetails')}
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}