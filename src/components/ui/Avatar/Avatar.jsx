import { useState } from 'react';
import styles from './Avatar.module.css';

export default function Avatar({ src, name = 'User', size = 36 }) {
  const [errored, setErrored] = useState(false);
  const initials = name.split(' ').filter(Boolean).map((n) => n[0]).join('').toUpperCase().slice(0, 2) || '?';
  const showImage = Boolean(src) && !errored;
  const dimension = `${size}px`;

  if (showImage) {
    return (
      <img
        src={src}
        alt={name}
        referrerPolicy="no-referrer"
        onError={() => setErrored(true)}
        className={styles.avatarImg}
        style={{ width: dimension, height: dimension }}
      />
    );
  }

  return (
    <span
      className={styles.avatarInitials}
      style={{ width: dimension, height: dimension, fontSize: `${size * 0.34}px` }}
    >
      {initials}
    </span>
  );
}