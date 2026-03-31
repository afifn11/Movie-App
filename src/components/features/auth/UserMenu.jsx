import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import styles from './UserMenu.module.css';

export default function UserMenu() {
  const { profile, user, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const avatar = profile?.avatar_url || user?.user_metadata?.avatar_url;
  const name   = profile?.full_name  || user?.user_metadata?.full_name || 'User';
  const initials = name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className={styles.wrapper} ref={ref}>
      <button
        className={styles.trigger}
        onClick={() => setOpen(!open)}
        aria-label="User menu"
        aria-expanded={open}
      >
        {avatar ? (
          <img src={avatar} alt={name} className={styles.avatar} />
        ) : (
          <span className={styles.initials}>{initials}</span>
        )}
      </button>

      {open && (
        <div className={styles.dropdown}>
          {/* User info */}
          <div className={styles.userInfo}>
            {avatar ? (
              <img src={avatar} alt={name} className={styles.dropdownAvatar} />
            ) : (
              <span className={`${styles.initials} ${styles.dropdownInitials}`}>{initials}</span>
            )}
            <div>
              <p className={styles.userName}>{name}</p>
              <p className={styles.userEmail}>{user?.email}</p>
            </div>
          </div>

          <div className={styles.divider} />

          <Link to="/profile" className={styles.menuItem} onClick={() => setOpen(false)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
            </svg>
            Profile
          </Link>
          <Link to="/watchlist" className={styles.menuItem} onClick={() => setOpen(false)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Watchlist
          </Link>
          <Link to="/lists" className={styles.menuItem} onClick={() => setOpen(false)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            My Lists
          </Link>

          <div className={styles.divider} />

          <button className={`${styles.menuItem} ${styles.signOut}`} onClick={signOut}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
