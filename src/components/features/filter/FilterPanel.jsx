import { useTranslation } from 'react-i18next';
import styles from './FilterPanel.module.css';

const SORT_OPTION_VALUES = [
  { value: 'popularity.desc', key: 'filter.mostPopular' },
  { value: 'vote_average.desc', key: 'filter.highestRated' },
  { value: 'primary_release_date.desc', key: 'filter.newest' },
  { value: 'primary_release_date.asc', key: 'filter.oldest' },
  { value: 'revenue.desc', key: 'filter.highestRevenue' },
];
const currentYear = new Date().getFullYear();

export default function FilterPanel({ filters, genres, onChange, onClear, hasActiveFilters }) {
  const { t } = useTranslation();
  const toggleGenre = (id) => {
    const exists = filters.genres.includes(id);
    onChange({ genres: exists ? filters.genres.filter((g) => g !== id) : [...filters.genres, id] });
  };

  return (
    <div className={styles.panel}>
      <div className={styles.row}>
        <label className={styles.label} htmlFor="sortBy">{t('filter.sortBy')}</label>
        <select id="sortBy" className={styles.select} value={filters.sortBy}
          onChange={(e) => onChange({ sortBy: e.target.value })}>
          {SORT_OPTION_VALUES.map((o) => <option key={o.value} value={o.value}>{t(o.key)}</option>)}
        </select>
      </div>

      <div className={styles.row}>
        <span className={styles.label}>{t('filter.genres')}</span>
        <div className={styles.genreChips}>
          {genres.map((g) => (
            <button
              key={g.id}
              type="button"
              className={`${styles.chip} ${filters.genres.includes(g.id) ? styles.chipActive : ''}`}
              onClick={() => toggleGenre(g.id)}
              aria-pressed={filters.genres.includes(g.id)}
            >
              {g.name}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.rowSplit}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="yearFrom">{t('filter.yearFrom')}</label>
          <input id="yearFrom" type="number" className={styles.input}
            placeholder="1980" min="1900" max={currentYear}
            value={filters.yearFrom}
            onChange={(e) => onChange({ yearFrom: e.target.value })} />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="yearTo">{t('filter.yearTo')}</label>
          <input id="yearTo" type="number" className={styles.input}
            placeholder={String(currentYear)} min="1900" max={currentYear}
            value={filters.yearTo}
            onChange={(e) => onChange({ yearTo: e.target.value })} />
        </div>
      </div>

      <div className={styles.row}>
        <label className={styles.label} htmlFor="minRating">
          {t('filter.minRating')} <strong>{filters.minRating > 0 ? filters.minRating : t('filter.any')}</strong>
        </label>
        <input id="minRating" type="range" min="0" max="9" step="0.5" className={styles.slider}
          value={filters.minRating}
          onChange={(e) => onChange({ minRating: Number(e.target.value) })} />
      </div>

      <div className={styles.row}>
        <label className={styles.label} htmlFor="maxRuntime">{t('filter.maxRuntime')}</label>
        <select id="maxRuntime" className={styles.select} value={filters.maxRuntime}
          onChange={(e) => onChange({ maxRuntime: e.target.value })}>
          <option value="">{t('filter.anyLength')}</option>
          <option value="90">{t('filter.under90')}</option>
          <option value="120">{t('filter.under120')}</option>
          <option value="150">{t('filter.under150')}</option>
        </select>
      </div>

      {hasActiveFilters && (
        <button type="button" className={styles.clearBtn} onClick={onClear}>
          {t('filter.clearAll')}
        </button>
      )}
    </div>
  );
}