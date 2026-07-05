import styles from './FilterPanel.module.css';

const SORT_OPTIONS = [
  { value: 'popularity.desc', label: 'Most Popular' },
  { value: 'vote_average.desc', label: 'Highest Rated' },
  { value: 'primary_release_date.desc', label: 'Newest' },
  { value: 'primary_release_date.asc', label: 'Oldest' },
  { value: 'revenue.desc', label: 'Highest Revenue' },
];

const currentYear = new Date().getFullYear();

export default function FilterPanel({ filters, genres, onChange, onClear, hasActiveFilters }) {
  const toggleGenre = (id) => {
    const exists = filters.genres.includes(id);
    onChange({ genres: exists ? filters.genres.filter((g) => g !== id) : [...filters.genres, id] });
  };

  return (
    <div className={styles.panel}>
      <div className={styles.row}>
        <label className={styles.label} htmlFor="sortBy">Sort by</label>
        <select id="sortBy" className={styles.select} value={filters.sortBy}
          onChange={(e) => onChange({ sortBy: e.target.value })}>
          {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      <div className={styles.row}>
        <span className={styles.label}>Genres</span>
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
          <label className={styles.label} htmlFor="yearFrom">Year from</label>
          <input id="yearFrom" type="number" className={styles.input}
            placeholder="1980" min="1900" max={currentYear}
            value={filters.yearFrom}
            onChange={(e) => onChange({ yearFrom: e.target.value })} />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="yearTo">Year to</label>
          <input id="yearTo" type="number" className={styles.input}
            placeholder={String(currentYear)} min="1900" max={currentYear}
            value={filters.yearTo}
            onChange={(e) => onChange({ yearTo: e.target.value })} />
        </div>
      </div>

      <div className={styles.row}>
        <label className={styles.label} htmlFor="minRating">
          Minimum rating: <strong>{filters.minRating > 0 ? filters.minRating : 'Any'}</strong>
        </label>
        <input id="minRating" type="range" min="0" max="9" step="0.5" className={styles.slider}
          value={filters.minRating}
          onChange={(e) => onChange({ minRating: Number(e.target.value) })} />
      </div>

      <div className={styles.row}>
        <label className={styles.label} htmlFor="maxRuntime">Max runtime</label>
        <select id="maxRuntime" className={styles.select} value={filters.maxRuntime}
          onChange={(e) => onChange({ maxRuntime: e.target.value })}>
          <option value="">Any length</option>
          <option value="90">Under 90 min</option>
          <option value="120">Under 2 hours</option>
          <option value="150">Under 2.5 hours</option>
        </select>
      </div>

      {hasActiveFilters && (
        <button type="button" className={styles.clearBtn} onClick={onClear}>
          Clear all filters
        </button>
      )}
    </div>
  );
}