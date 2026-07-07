import { Link } from 'react-router-dom';
import styles from './LegalPage.module.css';

export default function Privacy() {
  return (
    <div className={`container ${styles.page}`}>
      <h1 className={styles.heading}>Privacy Policy</h1>
      <p className={styles.updated}>Last updated: July 2026</p>

      <section className={styles.section}>
        <h2>1. What We Collect</h2>
        <p>When you sign in with Google, we receive and store:</p>
        <ul className={styles.list}>
          <li>Your name, email address, and profile picture (from Google).</li>
          <li>Content you create: reviews, ratings, watchlist, custom lists, and votes.</li>
          <li>Basic activity used for gamification: review count, streaks, and earned badges.</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2>2. What We Don't Collect</h2>
        <p>
          We don't collect payment information (there's no paid tier), and we don't sell
          your data to third parties or advertisers.
        </p>
      </section>

      <section className={styles.section}>
        <h2>3. AI Features & Your Input</h2>
        <p>
          When you use AI features (chat about a movie, review writing assistant, mood-based
          discovery), the text you type is sent to Google Gemini's API to generate a response.
          This text is processed by Google according to their own terms and is not stored
          permanently by Netfif Cinema.
        </p>
      </section>

      <section className={styles.section}>
        <h2>4. Error Monitoring</h2>
        <p>
          We use Sentry to catch and fix bugs. If the app crashes, technical details
          (error messages, the page you were on, and a session replay of what happened
          right before the error) may be sent to Sentry. Session replay masks text and
          media by default for privacy.
        </p>
      </section>

      <section className={styles.section}>
        <h2>5. Public Content</h2>
        <p>
          Your display name, avatar, reviews, and critic rank/badges may be shown publicly
          (e.g. on the Leaderboard, on movie pages, or in shared social preview cards).
          Your watchlist and private lists are not public unless you explicitly mark a
          list as public.
        </p>
      </section>

      <section className={styles.section}>
        <h2>6. Data Deletion</h2>
        <p>
          Since this is a personal/educational project, account deletion is currently a
          manual process. If you'd like your account and data removed, please reach out
          via the contact link on the developer's{' '}
          <a href="https://mafif.my.id" target="_blank" rel="noopener noreferrer">portfolio site</a>.
        </p>
      </section>

      <p className={styles.footerNote}>
        See also our <Link to="/terms">Terms of Service</Link>.
      </p>
    </div>
  );
}