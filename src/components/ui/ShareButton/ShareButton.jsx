import { useState, useRef, useEffect } from 'react';
import styles from './ShareButton.module.css';

export default function ShareButton({ title, text, url, compact = false }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setOpen(false);
    };
    const handleEscape = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
      } catch (err) {
        if (err.name !== 'AbortError') console.error('Share failed:', err);
      }
    } else {
      setOpen((v) => !v);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  const shareLinks = [
    { label: 'WhatsApp', href: `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}` },
    { label: 'X (Twitter)', href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}` },
    { label: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}` },
  ];

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <button
        type="button"
        className={`${styles.shareBtn} ${compact ? styles.shareBtnCompact : ''}`}
        onClick={handleShare}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label="Share"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <circle cx="18" cy="5" r="3" stroke="currentColor" strokeWidth="2"/>
          <circle cx="6" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
          <circle cx="18" cy="19" r="3" stroke="currentColor" strokeWidth="2"/>
          <path d="M8.6 10.6l6.8-3.8M8.6 13.4l6.8 3.8" stroke="currentColor" strokeWidth="2"/>
        </svg>
        {!compact && 'Share'}
      </button>

      {open && (
        <div className={styles.popover} role="menu">
          {shareLinks.map((link) => (
            <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer"
              className={styles.popoverItem} role="menuitem" onClick={() => setOpen(false)}>
              {link.label}
            </a>
          ))}
          <button type="button" className={styles.popoverItem} onClick={handleCopy} role="menuitem">
            {copied ? '✓ Copied!' : 'Copy Link'}
          </button>
        </div>
      )}
    </div>
  );
}