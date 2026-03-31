import { useState, useRef, useEffect } from 'react';
import { chatAboutMovie } from '../../../lib/gemini';
import styles from './AIChatPanel.module.css';

const SUGGESTIONS = [
  'Is this suitable for family viewing?',
  'What are the hidden themes in this film?',
  'Explain the ending without spoilers',
  'Who should watch this film?',
  'What makes this film unique?',
];

export default function AIChatPanel({ movie }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [isOpen, setIsOpen]     = useState(false);
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  useEffect(() => {
    if (isOpen) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      inputRef.current?.focus();
    }
  }, [messages, isOpen]);

  const sendMessage = async (text) => {
    const q = (text || input).trim();
    if (!q || loading) return;

    setMessages((prev) => [...prev, { role: 'user', text: q }]);
    setInput('');
    setLoading(true);

    try {
      const reply = await chatAboutMovie(movie, q);
      setMessages((prev) => [...prev, { role: 'ai', text: reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: 'ai', text: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button className={styles.openBtn} onClick={() => setIsOpen(true)}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L13.09 8.26L19 9.27L15 14.14L16.18 21.02L12 17.77L7.82 21.02L9 14.14L5 9.27L10.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2"/>
        </svg>
        Ask AI about this film
      </button>
    );
  }

  return (
    <div className={styles.panel}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.aiDot} />
          <span className={styles.headerTitle}>AI Film Assistant</span>
          <span className={styles.headerSub}>Powered by Gemini</span>
        </div>
        <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className={styles.messages}>
        {messages.length === 0 && (
          <div className={styles.emptyState}>
            <p className={styles.emptyTitle}>Ask anything about <strong>{movie.title}</strong></p>
            <div className={styles.suggestions}>
              {SUGGESTIONS.map((s) => (
                <button key={s} className={styles.suggestion} onClick={() => sendMessage(s)}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={`${styles.message} ${styles[m.role]}`}>
            {m.role === 'ai' && <span className={styles.aiLabel}>AI</span>}
            <p className={styles.messageText}>{m.text}</p>
          </div>
        ))}

        {loading && (
          <div className={`${styles.message} ${styles.ai}`}>
            <span className={styles.aiLabel}>AI</span>
            <div className={styles.typing}>
              <span /><span /><span />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className={styles.inputRow}>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
          placeholder="Ask about this film..."
          className={styles.input}
          disabled={loading}
        />
        <button
          className={styles.sendBtn}
          onClick={() => sendMessage()}
          disabled={!input.trim() || loading}
          aria-label="Send"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M22 2L11 13M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
