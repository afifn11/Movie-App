import MoodPicker from '../components/features/ai/MoodPicker';
import { useAuth } from '../context/AuthContext';
import { useWatchHistory } from '../hooks/useWatchHistory';
import { useState } from 'react';
import LoginModal from '../components/features/auth/LoginModal';
import styles from './Discover.module.css';

export default function DiscoverPage() {
  const { isAuthenticated } = useAuth();
  const { history } = useWatchHistory();
  const [loginOpen, setLoginOpen] = useState(false);

  return (
    <div className={styles.page}>
      <div className={`container ${styles.container}`}>

        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <span className={styles.eyebrow}>AI-Powered</span>
            <h1 className={styles.title}>
              <span className={styles.accent}>/</span> Discover
            </h1>
            <p className={styles.subtitle}>
              Tell the AI how you're feeling and get perfect film picks curated just for you.
            </p>
          </div>

          {/* Auth nudge */}
          {!isAuthenticated && (
            <div className={styles.authNudge}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L13.09 8.26L19 9.27L15 14.14L16.18 21.02L12 17.77L7.82 21.02L9 14.14L5 9.27L10.91 8.26L12 2Z"
                  stroke="currentColor" strokeWidth="1.5"/>
              </svg>
              <div>
                <p className={styles.nudgeTitle}>Sign in for smarter picks</p>
                <p className={styles.nudgeText}>
                  When signed in, the AI avoids films you've already watched.
                </p>
              </div>
              <button className={styles.nudgeBtn} onClick={() => setLoginOpen(true)}>
                Sign In
              </button>
            </div>
          )}
        </div>

        {/* Mood Picker */}
        <MoodPicker watchHistory={history} />

      </div>

      <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
    </div>
  );
}
