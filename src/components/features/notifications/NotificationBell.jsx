import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../../hooks/useNotifications';
import styles from './NotificationBell.module.css';

function timeAgo(dateStr, locale) {
  const diffSec = Math.round((Date.now() - new Date(dateStr).getTime()) / 1000);
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

  if (diffSec < 60) return rtf.format(-diffSec, 'second');
  const diffMin = Math.round(diffSec / 60);
  if (diffMin < 60) return rtf.format(-diffMin, 'minute');
  const diffHour = Math.round(diffMin / 60);
  if (diffHour < 24) return rtf.format(-diffHour, 'hour');
  return rtf.format(-Math.round(diffHour / 24), 'day');
}

export default function NotificationBell() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleClick = (n) => {
    if (!n.read) markAsRead(n.id);
    setOpen(false);
    if (n.link) navigate(n.link);
  };

  return (
    <div className={styles.wrapper} ref={ref}>
      <button
        className={styles.trigger}
        onClick={() => setOpen((v) => !v)}
        aria-label={t('notifications.title')}
        aria-expanded={open}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        {unreadCount > 0 && (
          <span className={styles.badge}>{unreadCount > 9 ? '9+' : unreadCount}</span>
        )}
      </button>

      {open && (
        <div className={styles.dropdown}>
          <div className={styles.header}>
            <span className={styles.headerTitle}>{t('notifications.title')}</span>
            {unreadCount > 0 && (
              <button className={styles.markAllBtn} onClick={markAllAsRead}>
                {t('notifications.markAllRead')}
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <p className={styles.empty}>{t('notifications.empty')}</p>
          ) : (
            <div className={styles.list}>
              {notifications.map((n) => (
                <button
                  key={n.id}
                  className={`${styles.item} ${!n.read ? styles.itemUnread : ''}`}
                  onClick={() => handleClick(n)}
                >
                  <div className={styles.itemContent}>
                    <p className={styles.itemTitle}>{n.title}</p>
                    {n.body && <p className={styles.itemBody}>{n.body}</p>}
                    <p className={styles.itemTime}>{timeAgo(n.created_at, i18n.language)}</p>
                  </div>
                  {!n.read && <span className={styles.dot} />}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}