import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useMovieFilters } from '../hooks/useMovieFilters';
import { useDiscoverMovies } from '../hooks/useDiscoverMovies';
import { useFilterPresets } from '../hooks/useFilterPresets';
import { useAuth } from '../context/AuthContext';
import { useMovies } from '../context/MoviesContext';
import { movieService } from '../services/movieService';
import FilterPanel from '../components/features/filter/FilterPanel';
import NaturalLanguageFilter from '../components/features/filter/NaturalLanguageFilter';
import MovieGrid from '../components/features/movie/MovieGrid/MovieGrid';
import styles from './Explore.module.css';

export default function Explore() {
  const { t } = useTranslation();
  const { filters, setFilters, clearFilters, hasActiveFilters } = useMovieFilters();
  const { movies, loading, loadingMore, error, hasMore, loadMore } = useDiscoverMovies(filters);
  const { isAuthenticated } = useAuth();
  const { presets, savePreset, deletePreset } = useFilterPresets();
  const { apiCache, updateCache } = useMovies();
  const genres = apiCache.genres || [];
  const [presetName, setPresetName] = useState('');
  const [saveOpen, setSaveOpen] = useState(false);

  useEffect(() => {
    if (genres.length > 0) return;
    movieService.getGenres()
      .then((data) => updateCache('genres', data.genres || []))
      .catch((err) => console.error('Failed to fetch genres:', err));
  }, [genres.length, updateCache]);

  const handleSavePreset = async (e) => {
    e.preventDefault();
    if (!presetName.trim()) return;
    try {
      await savePreset(presetName.trim(), filters);
      setPresetName('');
      setSaveOpen(false);
    } catch (err) {
      console.error('Save preset failed:', err);
    }
  };

  return (
    <div className={`container ${styles.page}`}>
      <h1 className={styles.heading}>{t('explore.heading')}</h1>
      <p className={styles.subheading}>{t('explore.subheading')}</p>

      <NaturalLanguageFilter onApply={(parsed) => setFilters(parsed)} />

      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <FilterPanel
            filters={filters}
            genres={genres}
            onChange={setFilters}
            onClear={clearFilters}
            hasActiveFilters={hasActiveFilters}
          />

          {isAuthenticated && (
            <div className={styles.presetsBlock}>
              <div className={styles.presetsHeader}>
                <span className={styles.label}>{t('explore.savedFilters')}</span>
                {hasActiveFilters && (
                  <button className={styles.presetAddBtn} onClick={() => setSaveOpen((v) => !v)}>
                    {t('explore.saveCurrent')}
                  </button>
                )}
              </div>

              {saveOpen && (
                <form className={styles.presetForm} onSubmit={handleSavePreset}>
                  <input
                    className={styles.presetInput}
                    placeholder={t('explore.presetNamePlaceholder')}
                    value={presetName}
                    onChange={(e) => setPresetName(e.target.value)}
                    maxLength={40}
                  />
                  <button type="submit" className={styles.presetSaveBtn}>{t('explore.save')}</button>
                </form>
              )}

              {presets.length === 0 ? (
                <p className={styles.presetEmpty}>{t('explore.noSavedFilters')}</p>
              ) : (
                <ul className={styles.presetList}>
                  {presets.map((p) => (
                    <li key={p.id} className={styles.presetItem}>
                      <button className={styles.presetApplyBtn} onClick={() => setFilters(p.params)}>
                        {p.name}
                      </button>
                      <button
                        className={styles.presetDeleteBtn}
                        aria-label={t('explore.deletePreset', { name: p.name })}
                        onClick={() => deletePreset(p.id)}
                      >
                        ✕
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </aside>

        <div className={styles.results}>
          {error && <p className={styles.errorMsg}>{error}</p>}
          <MovieGrid
            movies={movies}
            loading={loading}
            loadingMore={loadingMore}
            hasMore={hasMore}
            onLoadMore={loadMore}
            showGenreFilter={false}
          />
        </div>
      </div>
    </div>
  );
}