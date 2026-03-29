import styles from './StateViews.module.css';
import Button from '../Button/Button';

export function ErrorState({ message = 'Something went wrong.', onRetry }) {
  return (
    <div className={styles.container}>
      <div className={styles.icon}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M12 7V13M12 16.5V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>
      <h3 className={styles.title}>Oops!</h3>
      <p className={styles.message}>{message}</p>
      {onRetry && (
        <Button variant="secondary" size="md" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
}

export function EmptyState({ message = 'No movies found.', icon }) {
  return (
    <div className={styles.container}>
      <div className={styles.icon}>
        {icon || (
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
            <path d="M21 3H3C1.9 3 1 3.9 1 5V19C1 20.1 1.9 21 3 21H21C22.1 21 23 20.1 23 19V5C23 3.9 22.1 3 21 3Z" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M7 3V21M17 3V21M1 9H7M17 9H23M1 15H7M17 15H23" stroke="currentColor" strokeWidth="1.5"/>
          </svg>
        )}
      </div>
      <p className={styles.message}>{message}</p>
    </div>
  );
}

export function PageLoader({ message = 'Loading...' }) {
  return (
    <div className={styles.loaderContainer}>
      <div className={styles.loaderSpinner} />
      <p className={styles.loaderText}>{message}</p>
    </div>
  );
}
