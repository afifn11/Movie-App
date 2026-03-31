import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMovieLists } from '../hooks/useMovieLists';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button/Button';
import Modal from '../components/ui/Modal/Modal';
import { EmptyState } from '../components/ui/StateViews/StateViews';
import styles from './Lists.module.css';

export default function ListsPage() {
  const { user } = useAuth();
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
            <h1 className={styles.title}><span className={styles.accent}>/</span> My Lists</h1>
            <p className={styles.subtitle}>Curate your own film collections</p>
          </div>
          <Button variant="primary" size="md" onClick={() => setModalOpen(true)}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
            New List
          </Button>
        </div>

        {loading ? (
          <p className={styles.loadingText}>Loading lists...</p>
        ) : lists.length === 0 ? (
          <EmptyState message="No lists yet. Create your first film collection!" />
        ) : (
          <div className={styles.grid}>
            {lists.map((list) => (
              <div key={list.id} className={styles.card}>
                <Link to={`/lists/${list.id}`} className={styles.cardLink}>
                  <div className={styles.cardTop}>
                    <h3 className={styles.listName}>{list.name}</h3>
                    {list.is_public && <span className={styles.publicBadge}>Public</span>}
                  </div>
                  {list.description && <p className={styles.listDesc}>{list.description}</p>}
                  <p className={styles.listMeta}>
                    {list.list_items?.[0]?.count ?? 0} films · {new Date(list.created_at).toLocaleDateString()}
                  </p>
                </Link>
                <button className={styles.deleteBtn} onClick={() => deleteList(list.id)} title="Delete list">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Create New List" size="sm">
        <form onSubmit={handleCreate} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>List Name *</label>
            <input className={styles.input} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Best Sci-Fi of the 2010s" autoFocus />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Description</label>
            <textarea className={`${styles.input} ${styles.textarea}`} value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="What is this list about?" rows={3} />
          </div>
          <label className={styles.checkboxRow}>
            <input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} />
            <span>Make this list public</span>
          </label>
          <Button type="submit" variant="primary" size="md" loading={creating} className={styles.submitBtn}>
            Create List
          </Button>
        </form>
      </Modal>
    </div>
  );
}
