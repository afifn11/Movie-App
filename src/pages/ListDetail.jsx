import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useListDetail } from '../hooks/useMovieLists';
import { PageLoader, EmptyState } from '../components/ui/StateViews/StateViews';
import styles from './ListDetail.module.css';

const FALLBACK = 'https://placehold.co/400x600/111720/4a5568?text=No+Image';

export default function ListDetailPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const { list, items, loading, removeFromList, isOwner } = useListDetail(id);

  if (loading) return <PageLoader />;
  if (!list) return <EmptyState message={t('listDetail.notFound')} />;

  return (
    <div className={styles.page}>
      <div className={`container ${styles.container}`}>
        <div className={styles.header}>
          <div>
            <div className={styles.breadcrumb}>
              <Link to="/lists" className={styles.breadcrumbLink}>{t('listDetail.myLists')}</Link>
              <span className={styles.breadcrumbSep}>/</span>
              <span>{list.name}</span>
            </div>
            <h1 className={styles.title}>{list.name}</h1>
            {list.description && <p className={styles.desc}>{list.description}</p>}
            <div className={styles.meta}>
              <span>{t('listDetail.filmsCount', { count: items.length })}</span>
              {list.is_public && <span className={styles.publicBadge}>{t('lists.public')}</span>}
              <span>{t('listDetail.byAuthor', { name: list.profiles?.full_name || t('listDetail.unknown') })}</span>
            </div>
          </div>
        </div>

        {items.length === 0 ? (
          <EmptyState message={t('listDetail.empty')} />
        ) : (
          <div className={styles.grid}>
            {items.map((item) => (
              <div key={item.id} className={styles.card}>
                <Link to={`/movie/${item.movie_id}`} className={styles.cardLink}>
                  <div className={styles.posterWrap}>
                    <img
                      src={item.poster_url || FALLBACK}
                      alt={item.movie_title}
                      className={styles.poster}
                      loading="lazy"
                      onError={(e) => { e.target.src = FALLBACK; }}
                    />
                  </div>
                  <div className={styles.cardInfo}>
                    <h3 className={styles.cardTitle}>{item.movie_title}</h3>
                    {item.year && <span className={styles.cardYear}>{item.year}</span>}
                  </div>
                </Link>
                {isOwner && (
                  <button
                    className={styles.removeBtn}
                    onClick={() => removeFromList(item.movie_id)}
                    title={t('listDetail.removeTitle')}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                      <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
