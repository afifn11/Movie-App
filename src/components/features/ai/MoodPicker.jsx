import { useState } from 'react';
import { getMoodRecommendations } from '../../../lib/gemini';
import { movieService } from '../../../services/movieService';
import { Link } from 'react-router-dom';
import styles from './MoodPicker.module.css';

const MOOD_PRESETS = [
  { label: '😂 Need to laugh', value: 'I want something funny and lighthearted' },
  { label: '😢 Feeling emotional', value: 'I want to feel deeply moved or cry' },
  { label: '😤 Need adrenaline', value: 'I want intense action and thrills' },
  { label: '🤔 Want to think', value: 'I want a thought-provoking, mind-bending story' },
  { label: '😍 Feeling romantic', value: 'I want a heartwarming love story' },
  { label: '😱 Want to be scared', value: 'I want something terrifying and suspenseful' },
  { label: '🌟 Need inspiration', value: 'I want something uplifting and motivating' },
  { label: '🧘 Want to relax', value: 'I want something calm, beautiful and peaceful' },
];

const TIME_OPTIONS = [
  { label: 'Under 90 min', value: 'under 90 minutes' },
  { label: '90–120 min', value: '90 to 120 minutes' },
  { label: '2+ hours', value: 'over 2 hours' },
  { label: 'Any length', value: 'flexible' },
];

export default function MoodPicker({ watchHistory = [] }) {
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
      const recs = await getMoodRecommendations({
        mood: finalMood,
        timeAvailable: time,
        watchedTitles,
      });

      // Enrich with TMDB search
      const enriched = await Promise.all(
        recs.map(async (rec) => {
          try {
            const data = await movieService.search(rec.searchQuery, 1);
            const match = data.results[0];
            return {
              ...rec,
              tmdbId: match?.id || null,
              poster: match?.poster_path
                ? `https://image.tmdb.org/t/p/w342${match.poster_path}`
                : null,
            };
          } catch {
            return { ...rec, tmdbId: null, poster: null };
          }
        })
      );
      setResults(enriched);
      setSearched(true);
    } catch (err) {
      setError('Could not get recommendations. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h3 className={styles.title}>
          <span className={styles.accent}>/</span> What are you in the mood for?
        </h3>
        <p className={styles.subtitle}>Tell the AI how you're feeling and get perfect film picks.</p>
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
          value={customMood}
          onChange={(e) => { setCustomMood(e.target.value); setMood(''); }}
          placeholder="Or describe your mood in your own words..."
          className={styles.customInput}
        />
      </div>

      {/* Time filter */}
      <div className={styles.timeRow}>
        <span className={styles.timeLabel}>Time available:</span>
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
            Finding perfect films...
          </>
        ) : (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L13.09 8.26L19 9.27L15 14.14L16.18 21.02L12 17.77L7.82 21.02L9 14.14L5 9.27L10.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2"/>
            </svg>
            Find Films for My Mood
          </>
        )}
      </button>

      {error && <p className={styles.error}>{error}</p>}

      {/* Results */}
      {searched && results.length > 0 && (
        <div className={styles.results}>
          <p className={styles.resultsLabel}>AI picked these for you ✨</p>
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
                      View Details →
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
