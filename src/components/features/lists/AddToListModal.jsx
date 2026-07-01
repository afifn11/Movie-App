import { useState, useEffect } from 'react';
import Modal from '../../ui/Modal/Modal';
import { useMovieLists } from '../../../hooks/useMovieLists';
import { useAuth } from '../../../context/AuthContext';
import Button from '../../ui/Button/Button';
import styles from './AddToListModal.module.css';

// 🛡️ ListRow is now a pure presentational component (No data fetching inside)
function ListRow({ list, movie, alreadyIn, addMovieToList, onSuccess }) {
  const [adding, setAdding] = useState(false);
  const [done, setDone] = useState(false);

  const handleAdd = async () => {
    if (alreadyIn || done) return;
    try {
      setAdding(true);
      await addMovieToList(list.id, movie);
      setDone(true);
      onSuccess?.(list.name);
    } catch (err) {
      console.error(err);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className={styles.listRow}>
      <div className={styles.listInfo}>
        <span className={styles.listName}>{list.name}</span>
        {list.is_public && <span className={styles.publicTag}>Public</span>}
      </div>
      <button
        className={`${styles.addBtn} ${alreadyIn || done ? styles.addBtnDone : ''}`}
        onClick={handleAdd}
        disabled={adding || alreadyIn || done}
      >
        {adding ? (
          <span className={styles.spinner} />
        ) : alreadyIn || done ? (
          <>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Added
          </>
        ) : (
          <>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
            Add
          </>
        )}
      </button>
    </div>
  );
}

export default function AddToListModal({ isOpen, onClose, movie }) {
  const { isAuthenticated } = useAuth();
  
  // 🛡️ Extracted optimized functions
  const { lists, loading: listsLoading, createList, getListsContainingMovie, addMovieToList } = useMovieLists();
  
  const [successMsg, setSuccessMsg] = useState('');
  const [creatingNew, setCreatingNew] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [creating, setCreating] = useState(false);
  
  // 🛡️ Local state to hold the single query result
  const [presentInLists, setPresentInLists] = useState(new Set());
  const [checkingPresence, setCheckingPresence] = useState(true);

  // Execute 1 query when modal opens to find which lists have this movie
  useEffect(() => {
    if (isOpen && movie && lists.length > 0) {
      setCheckingPresence(true);
      getListsContainingMovie(movie.id)
        .then((movieListsSet) => {
          setPresentInLists(movieListsSet);
          setCheckingPresence(false);
        })
        .catch((err) => {
          console.error("Failed to check movie presence:", err);
          setCheckingPresence(false);
        });
    } else {
      setCheckingPresence(false);
    }
  }, [isOpen, movie, lists, getListsContainingMovie]);

  const handleSuccess = (listName) => {
    setSuccessMsg(`Added to "${listName}"`);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleCreateAndAdd = async () => {
    if (!newListName.trim()) return;
    try {
      setCreating(true);
      await createList({ name: newListName.trim(), isPublic: false });
      setNewListName('');
      setCreatingNew(false);
      // Data presence will re-verify seamlessly due to useEffect listening to `lists` dependency
    } catch (err) {
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add to List" size="sm">
      <div className={styles.container}>

        {successMsg && (
          <div className={styles.successBanner}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
            {successMsg}
          </div>
        )}

        {/* Movie info */}
        <div className={styles.movieInfo}>
          {movie?.poster && (
            <img src={movie.poster} alt={movie.title} className={styles.moviePoster} />
          )}
          <div>
            <p className={styles.movieTitle}>{movie?.title}</p>
            {movie?.year && <p className={styles.movieYear}>{movie.year}</p>}
          </div>
        </div>

        {/* Lists */}
        {listsLoading || checkingPresence ? (
          <p className={styles.loadingText}>Loading your lists...</p>
        ) : lists.length === 0 && !creatingNew ? (
          <p className={styles.emptyText}>You have no lists yet.</p>
        ) : (
          <div className={styles.listRows}>
            {lists.map((list) => (
              <ListRow
                key={list.id}
                list={list}
                movie={movie}
                alreadyIn={presentInLists.has(list.id)}
                addMovieToList={addMovieToList}
                onSuccess={handleSuccess}
              />
            ))}
          </div>
        )}

        {/* Create new list inline */}
        {creatingNew ? (
          <div className={styles.newListForm}>
            <input
              className={styles.newListInput}
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              placeholder="List name..."
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleCreateAndAdd()}
            />
            <div className={styles.newListActions}>
              <Button variant="primary" size="sm" loading={creating} onClick={handleCreateAndAdd}>
                Create
              </Button>
              <Button variant="ghost" size="sm" onClick={() => { setCreatingNew(false); setNewListName(''); }}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <button className={styles.newListBtn} onClick={() => setCreatingNew(true)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
            Create new list
          </button>
        )}
      </div>
    </Modal>
  );
}