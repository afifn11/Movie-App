import { useState } from 'react';
import styles from './AddMovieForm.module.css';

function AddMovieForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    title: '',
    year: '',
    type: '',
    poster: ''
  });

  const [errors, setErrors] = useState({
    title: '',
    year: '',
    type: '',
    poster: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });

    setErrors({
      ...errors,
      [name]: ''
    });
  };

  const validate = () => {
  const newErrors = {};

  if (!formData.title.trim()) {
    newErrors.title = 'Title wajib diisi.';
  }

  if (!formData.year) {
    newErrors.year = 'Tahun wajib diisi.';
  } else if (
    parseInt(formData.year) < 1900 ||
    parseInt(formData.year) > new Date().getFullYear()
  ) {
    newErrors.year = `Tahun harus antara 1900 dan ${new Date().getFullYear()}.`;
  }

  if (!formData.type) {
    newErrors.type = 'Genre wajib dipilih.';
  }

  if (!formData.poster.trim()) {
    newErrors.poster = 'URL Poster wajib diisi.';
  }

  return newErrors;
};


  const handleSubmit = (e) => {
    e.preventDefault();

    const formErrors = validate();

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    onSubmit({
      ...formData,
      id: Date.now()
    });

    setFormData({ title: '', year: '', type: '', poster: '' });
    setErrors({});
  };

  return (
    <section className={styles.container}>
      <img
        src="https://picsum.photos/300/450?random="
        alt="Movie Poster"
        className={styles.poster}
      />
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2 className={styles.title}>Add Movie</h2>

        <div className={styles.formGroup}>
          <label htmlFor="title" className={styles.label}>Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={styles.input}
          />
          {errors.title && <p className={styles.error}>{errors.title}</p>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="year" className={styles.label}>Year</label>
          <input
            type="number"
            id="year"
            name="year"
            value={formData.year}
            onChange={handleChange}
            className={styles.input}
          />
          {errors.year && <p className={styles.error}>{errors.year}</p>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="poster" className={styles.label}>Poster URL</label>
          <input
            type="text"
            id="poster"
            name="poster"
            value={formData.poster}
            onChange={handleChange}
            className={styles.input}
          />
          {errors.poster && <p className={styles.error}>{errors.poster}</p>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="type" className={styles.label}>Genre</label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className={styles.input}
          >
            <option value="">-- Select Genre --</option>
            <option value="Action">Action</option>
            <option value="Drama">Drama</option>
            <option value="Comedy">Comedy</option>
            <option value="Horror">Horror</option>
            <option value="Fantasy">Fantasy</option>
            <option value="Adventure">Adventure</option>
          </select>
          {errors.type && <p className={styles.error}>{errors.type}</p>}
        </div>

        <button type="submit" className={styles.button}>
          Submit
        </button>
      </form>
    </section>
  );
}

export default AddMovieForm;
