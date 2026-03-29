import { useState } from 'react';
import Button from '../../../ui/Button/Button';
import { GENRE_OPTIONS } from '../../../../utils/constants/data';
import styles from './AddMovieForm.module.css';

const INITIAL = { title: '', year: '', type: '', poster: '', overview: '' };

export default function AddMovieForm({ onSubmit }) {
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [preview, setPreview] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    if (name === 'poster') setPreview(value);
  };

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required.';
    if (!form.year) {
      errs.year = 'Year is required.';
    } else if (
      parseInt(form.year) < 1900 ||
      parseInt(form.year) > new Date().getFullYear() + 2
    ) {
      errs.year = `Year must be between 1900 and ${new Date().getFullYear() + 2}.`;
    }
    if (!form.type) errs.type = 'Genre is required.';
    if (!form.poster.trim()) {
      errs.poster = 'Poster URL is required.';
    } else if (!/^https?:\/\/.+/.test(form.poster)) {
      errs.poster = 'Enter a valid URL (https://...)';
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 600)); // UX feedback delay

    onSubmit({
      ...form,
      id: `local-${Date.now()}`,
      rating: 'N/A',
    });

    setForm(INITIAL);
    setErrors({});
    setPreview('');
    setSubmitting(false);
  };

  return (
    <section className={styles.section}>
      <div className={`container ${styles.container}`}>
        {/* Left – Form */}
        <div className={styles.formCol}>
          <div className={styles.header}>
            <span className={styles.eyebrow}>Your Collection</span>
            <h2 className={styles.title}>Add a Movie</h2>
            <p className={styles.subtitle}>
              Add a movie to your personal local collection.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className={styles.form}>
            {/* Title */}
            <div className={styles.field}>
              <label htmlFor="title" className={styles.label}>
                Movie Title <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={form.title}
                onChange={handleChange}
                className={`${styles.input} ${errors.title ? styles.inputError : ''}`}
                placeholder="e.g. Inception"
                autoComplete="off"
              />
              {errors.title && <p className={styles.error}>{errors.title}</p>}
            </div>

            {/* Year + Genre row */}
            <div className={styles.row}>
              <div className={styles.field}>
                <label htmlFor="year" className={styles.label}>
                  Release Year <span className={styles.required}>*</span>
                </label>
                <input
                  type="number"
                  id="year"
                  name="year"
                  value={form.year}
                  onChange={handleChange}
                  className={`${styles.input} ${errors.year ? styles.inputError : ''}`}
                  placeholder="2024"
                  min="1900"
                  max={new Date().getFullYear() + 2}
                />
                {errors.year && <p className={styles.error}>{errors.year}</p>}
              </div>

              <div className={styles.field}>
                <label htmlFor="type" className={styles.label}>
                  Genre <span className={styles.required}>*</span>
                </label>
                <select
                  id="type"
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  className={`${styles.input} ${styles.select} ${errors.type ? styles.inputError : ''}`}
                >
                  <option value="">Select genre</option>
                  {GENRE_OPTIONS.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
                {errors.type && <p className={styles.error}>{errors.type}</p>}
              </div>
            </div>

            {/* Poster URL */}
            <div className={styles.field}>
              <label htmlFor="poster" className={styles.label}>
                Poster URL <span className={styles.required}>*</span>
              </label>
              <input
                type="url"
                id="poster"
                name="poster"
                value={form.poster}
                onChange={handleChange}
                className={`${styles.input} ${errors.poster ? styles.inputError : ''}`}
                placeholder="https://example.com/poster.jpg"
              />
              {errors.poster && <p className={styles.error}>{errors.poster}</p>}
            </div>

            {/* Overview */}
            <div className={styles.field}>
              <label htmlFor="overview" className={styles.label}>
                Overview <span className={styles.optional}>(optional)</span>
              </label>
              <textarea
                id="overview"
                name="overview"
                value={form.overview}
                onChange={handleChange}
                className={`${styles.input} ${styles.textarea}`}
                placeholder="Brief description of the movie..."
                rows={3}
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={submitting}
              className={styles.submitBtn}
            >
              Add to Collection
            </Button>
          </form>
        </div>

        {/* Right – Preview */}
        <div className={styles.previewCol}>
          <div className={styles.previewCard}>
            {preview ? (
              <img
                src={preview}
                alt="Poster preview"
                className={styles.previewImg}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            ) : (
              <div className={styles.previewPlaceholder}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                  <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M21 15L16 10L5 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Poster preview</span>
              </div>
            )}
          </div>
          <p className={styles.previewLabel}>
            {form.title || 'Movie Title'}
          </p>
          {form.type && (
            <span className={styles.previewGenre}>{form.type}</span>
          )}
        </div>
      </div>
    </section>
  );
}
