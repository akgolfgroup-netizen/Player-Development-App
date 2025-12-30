// Build: 2025-12-30T06:55
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import { initializeTheme } from './theme/theme';
import { initErrorReporter } from './utils/errorReporter';
import { validateEnv } from './utils/envValidation';

// Initialize error reporting (global handlers)
initErrorReporter();

// Validate environment variables
validateEnv();

// Initialize theme before React renders to prevent flash
initializeTheme();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Register service worker for PWA support
serviceWorkerRegistration.register({
  onSuccess: () => {
    console.log('[App] PWA ready for offline use');
  },
  onUpdate: (registration) => {
    console.log('[App] New version available');
    // Optionally show update notification to user
    if (window.confirm('Ny versjon tilgjengelig! Last inn på nytt?')) {
      serviceWorkerRegistration.skipWaiting();
      window.location.reload();
    }
  },
});
