import styles from './Button.module.css';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  as: Tag = 'button',
  className = '',
  loading = false,
  disabled = false,
  ...props
}) {
  return (
    <Tag
      className={[
        styles.btn,
        styles[variant],
        styles[size],
        loading ? styles.loading : '',
        className,
      ].filter(Boolean).join(' ')}
      disabled={Tag === 'button' ? (disabled || loading) : undefined}
      {...props}
    >
      {loading ? (
        <span className={styles.spinner} aria-hidden="true" />
      ) : null}
      <span className={loading ? styles.hiddenText : ''}>{children}</span>
    </Tag>
  );
}
