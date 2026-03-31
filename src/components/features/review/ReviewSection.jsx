import { useState } from 'react';
import { useMovieReviews } from '../../../hooks/useReviews';
import { useAuth } from '../../../context/AuthContext';
import { enhanceReview } from '../../../lib/gemini';
import Button from '../../ui/Button/Button';
import styles from './ReviewSection.module.css';

const RATINGS = [1,2,3,4,5,6,7,8,9,10];

function StarRating({ value, onChange, readonly = false }) {
  const [hovered, setHovered] = useState(null);
  const display = hovered ?? value;

  return (
    <div className={styles.stars}>
      {RATINGS.map((n) => (
        <button
          key={n}
          type="button"
          className={`${styles.star} ${display >= n ? styles.starFilled : ''}`}
          onClick={() => !readonly && onChange?.(n)}
          onMouseEnter={() => !readonly && setHovered(n)}
          onMouseLeave={() => !readonly && setHovered(null)}
          disabled={readonly}
          aria-label={`Rate ${n}/10`}
        >
          {n <= 5 ? '★' : '☆'}
        </button>
      ))}
      {value && <span className={styles.ratingNum}>{value}/10</span>}
    </div>
  );
}

function ReviewCard({ review }) {
  const name = review.profiles?.full_name || 'Anonymous';
  const avatar = review.profiles?.avatar_url;
  const initials = name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  const date = new Date(review.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className={styles.reviewCard}>
      <div className={styles.reviewHeader}>
        <div className={styles.reviewUser}>
          {avatar ? (
            <img src={avatar} alt={name} className={styles.reviewAvatar} />
          ) : (
            <span className={styles.reviewInitials}>{initials}</span>
          )}
          <div>
            <p className={styles.reviewName}>{name}</p>
            <p className={styles.reviewDate}>{date}</p>
          </div>
        </div>
        <div className={styles.reviewRating}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
          </svg>
          {review.rating}/10
        </div>
      </div>
      {review.content && <p className={styles.reviewContent}>{review.content}</p>}
    </div>
  );
}

export default function ReviewSection({ movie }) {
  const { user, isAuthenticated } = useAuth();
  const { reviews, userReview, loading, submitReview, deleteReview, avgRating } = useMovieReviews(movie?.id);
  const [rating, setRating]     = useState(userReview?.rating || 0);
  const [content, setContent]   = useState(userReview?.content || '');
  const [submitting, setSubmitting] = useState(false);
  const [aiHint, setAiHint]     = useState('');
  const [loadingHint, setLoadingHint] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating) return;
    try {
      setSubmitting(true);
      await submitReview({
        rating,
        content,
        movieTitle: movie.title,
        posterUrl: movie._localPoster || null,
      });
      setShowForm(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAiHint = async () => {
    if (!content.trim() || !rating) return;
    try {
      setLoadingHint(true);
      const hint = await enhanceReview({
        movieTitle: movie.title,
        rating,
        draftReview: content,
        genres: movie.genres?.map((g) => g.name).join(', '),
      });
      setAiHint(hint);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingHint(false);
    }
  };

  return (
    <div className={styles.section}>
      {/* Header */}
      <div className={styles.header}>
        <h3 className={styles.title}>
          <span className={styles.accent}>/</span> Reviews
          {avgRating && (
            <span className={styles.avg}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
              </svg>
              {avgRating} avg · {reviews.length} review{reviews.length !== 1 ? 's' : ''}
            </span>
          )}
        </h3>
        {isAuthenticated && !userReview && (
          <Button variant="secondary" size="sm" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : '+ Write Review'}
          </Button>
        )}
      </div>

      {/* Write Review Form */}
      {isAuthenticated && (showForm || userReview) && (
        <form onSubmit={handleSubmit} className={styles.form}>
          <p className={styles.formLabel}>Your Rating</p>
          <StarRating value={rating} onChange={setRating} />

          <textarea
            className={styles.textarea}
            placeholder="Write your thoughts about this film... (optional)"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
          />

          {/* AI hint button */}
          {content.trim().length > 20 && rating > 0 && (
            <button type="button" className={styles.aiHintBtn} onClick={handleAiHint} disabled={loadingHint}>
              {loadingHint ? (
                <span className={styles.smallSpinner} />
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L13.09 8.26L19 9.27L15 14.14L16.18 21.02L12 17.77L7.82 21.02L9 14.14L5 9.27L10.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2"/>
                </svg>
              )}
              {loadingHint ? 'Getting AI suggestions...' : '✨ Get AI writing tips'}
            </button>
          )}

          {aiHint && (
            <div className={styles.aiHint}>
              <p className={styles.aiHintLabel}>✨ AI Suggestion</p>
              <p className={styles.aiHintText}>{aiHint}</p>
            </div>
          )}

          <div className={styles.formActions}>
            <Button type="submit" variant="primary" size="md" loading={submitting} disabled={!rating}>
              {userReview ? 'Update Review' : 'Submit Review'}
            </Button>
            {userReview && (
              <Button type="button" variant="danger" size="md" onClick={deleteReview}>
                Delete
              </Button>
            )}
          </div>
        </form>
      )}

      {/* Login prompt */}
      {!isAuthenticated && (
        <div className={styles.loginPrompt}>
          Sign in to write a review
        </div>
      )}

      {/* Reviews List */}
      {loading ? (
        <p className={styles.loadingText}>Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p className={styles.emptyText}>No reviews yet. Be the first!</p>
      ) : (
        <div className={styles.reviewsList}>
          {reviews.map((r) => <ReviewCard key={r.id} review={r} />)}
        </div>
      )}
    </div>
  );
}
