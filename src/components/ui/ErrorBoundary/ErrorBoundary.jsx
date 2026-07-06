import { Component } from 'react';
import { Sentry } from '../../../lib/sentry';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    Sentry.captureException(error, {
      extra: { componentStack: errorInfo?.componentStack },
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', height: '50vh', textAlign: 'center', color: '#64748b'
        }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" style={{ marginBottom: '1rem', color: '#ef4444' }}>
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 8V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 16H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <h2 style={{ color: '#f8fafc', marginBottom: '0.5rem' }}>Oops! Something went wrong.</h2>
          <p style={{ marginBottom: '1.5rem', maxWidth: '400px' }}>
            We're sorry, an unexpected error occurred while rendering this section.
          </p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: '0.75rem 1.5rem', background: '#3b82f6', color: 'white',
              border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: '500'
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}