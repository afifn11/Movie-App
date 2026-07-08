import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useMovieLists } from '../hooks/useMovieLists';
import Button from '../components/ui/Button/Button';
import Modal from '../components/ui/Modal/Modal';
import { EmptyState } from '../components/ui/StateViews/StateViews';
import styles from './Lists.module.css';

export default function ListsPage() {
  const { t } = useTranslation();
  const { lists, loading, createList, deleteList } = useMovieLists();
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName]           = useState('');
  const [desc, setDesc]           = useState('');
  const [isPublic, setIsPublic]   = useState(false);
  const [creating, setCreating]   = useState(false);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      setCreating(true);
      await createList({ name: name.trim(), description: desc.trim(), isPublic });
      setName(''); setDesc(''); setIsPublic(false);
      setModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={`container ${styles.container}`}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}><span className={styles.accent}>/</span> {t('lists.title')}</h1>
            <p className={styles.subtitle}>{t('lists.subtitle')}</p>
          </div>
          <Button variant="primary" size="md" onClick={() => setModalOpen(true)}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
            {t('lists.newList')}
          </Button>
        </div>

        {loading ? (
          <p className={styles.loadingText}>{t('lists.loading')}</p>
        ) : lists.length === 0 ? (
          <EmptyState message={t('lists.empty')} />
        ) : (
          <div className={styles.grid}>
            {lists.map((list) => (
              <div key={list.id} className={styles.card}>
                <Link to={`/lists/${list.id}`} className={styles.cardLink}>
                  <div className={styles.cardTop}>
                    <h3 className={styles.listName}>{list.name}</h3>
                    {list.is_public && <span className={styles.publicBadge}>{t('lists.public')}</span>}
                  </div>
                  {list.description && <p className={styles.listDesc}>{list.description}</p>}
                  <p className={styles.listMeta}>
                    {t('lists.filmsCount', { count: list.list_items?.[0]?.count ?? 0 })} · {new Date(list.created_at).toLocaleDateString()}
                  </p>
                </Link>
                <button className={styles.deleteBtn} onClick={() => deleteList(list.id)} title={t('lists.deleteTitle')}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={t('lists.createModalTitle')} size="sm">
        <form onSubmit={handleCreate} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>{t('lists.listNameLabel')}</label>
+            <input className={styles.input} value={name} onChange={(e) => setName(e.target.value)} placeholder={t('lists.listNamePlaceholder')} autoFocus />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>{t('lists.descLabel')}</label>
+            <textarea className={`${styles.input} ${styles.textarea}`} value={desc} onChange={(e) => setDesc(e.target.value)} placeholder={t('lists.descPlaceholder')} rows={3} />
          </div>
          <label className={styles.checkboxRow}>
            <input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} />
            <span>{t('lists.makePublic')}</span>
          </label>
          <Button type="submit" variant="primary" size="md" loading={creating} className={styles.submitBtn}>
            {t('lists.createBtn')}
          </Button>
        </form>
      </Modal>
    </div>
  );
}
