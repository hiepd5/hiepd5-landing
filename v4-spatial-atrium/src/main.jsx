import React from 'react';
import ReactDOM from 'react-dom/client';
// Rule 3.6.A: Import global index.css BEFORE App.jsx in Vite
import './index.css';
import App from './App.jsx';

class RootErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    if (typeof window !== 'undefined' && typeof window.__hd5BootReady === 'function') {
      window.__hd5BootReady();
    }
    console.error('[HiepD5 V5.0 Runtime Error]', error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="webgl-fallback-stage">
          <div className="webgl-fallback-card">
            <h2>Đang đồng bộ lại mô-đun giao diện</h2>
            <p>{String(this.state.error?.message || this.state.error)}</p>
            <button
              type="button"
              className="kbtn kbtn-accent"
              onClick={() => window.location.reload()}
            >
              Tải lại / Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RootErrorBoundary>
      <App />
    </RootErrorBoundary>
  </React.StrictMode>
);
