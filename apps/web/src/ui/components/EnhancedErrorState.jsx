import React, { useState, useEffect } from 'react';
import { AlertCircle, RefreshCw, WifiOff, Server, Lock } from 'lucide-react';

/**
 * Enhanced error state component with specific error messages and retry logic
 */
export const EnhancedErrorState = ({ error, onRetry, showPartialData = false }) => {
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Monitor network status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Parse error to determine type
  const getErrorType = (errorMessage) => {
    const msg = errorMessage?.toLowerCase() || '';

    if (!isOnline || msg.includes('network') || msg.includes('fetch failed')) {
      return 'network';
    }
    if (msg.includes('unauthorized') || msg.includes('401') || msg.includes('403')) {
      return 'auth';
    }
    if (msg.includes('500') || msg.includes('server error')) {
      return 'server';
    }
    if (msg.includes('timeout')) {
      return 'timeout';
    }
    return 'unknown';
  };

  const errorType = getErrorType(error);

  // Error-specific messages and icons
  const errorConfig = {
    network: {
      icon: <WifiOff size={32} className="text-ak-error" />,
      title: 'Ingen nettverkstilkobling',
      message: 'Sjekk internettforbindelsen din og prøv igjen.',
      showRetry: true,
    },
    auth: {
      icon: <Lock size={32} className="text-ak-warning" />,
      title: 'Autentiseringsfeil',
      message: 'Økten din kan ha utløpt. Vennligst logg inn på nytt.',
      showRetry: false,
    },
    server: {
      icon: <Server size={32} className="text-ak-error" />,
      title: 'Serverfeil',
      message: 'Det oppstod en feil på serveren. Vi jobber med å løse problemet.',
      showRetry: true,
    },
    timeout: {
      icon: <AlertCircle size={32} className="text-ak-warning" />,
      title: 'Tidsavbrudd',
      message: 'Forespørselen tok for lang tid. Prøv igjen.',
      showRetry: true,
    },
    unknown: {
      icon: <AlertCircle size={32} className="text-ak-error" />,
      title: 'Noe gikk galt',
      message: error || 'En ukjent feil oppstod. Prøv igjen senere.',
      showRetry: true,
    },
  };

  const config = errorConfig[errorType];

  // Exponential backoff retry
  const handleRetry = async () => {
    if (!onRetry) return;

    setIsRetrying(true);

    // Exponential backoff: 1s, 2s, 4s, 8s (max 8s)
    const delay = Math.min(1000 * Math.pow(2, retryCount), 8000);

    await new Promise(resolve => setTimeout(resolve, delay));

    try {
      await onRetry();
      setRetryCount(0); // Reset on success
    } catch (err) {
      setRetryCount(count => count + 1);
    } finally {
      setIsRetrying(false);
    }
  };

  return (
    <div className="bg-ak-error/10 border border-ak-error/20 rounded-xl p-8 text-center max-w-md mx-auto">
      {/* Icon */}
      <div className="flex justify-center mb-4">
        {config.icon}
      </div>

      {/* Title */}
      <h3 className="text-[16px] font-semibold text-ak-charcoal mb-2">
        {config.title}
      </h3>

      {/* Message */}
      <p className="text-[14px] text-ak-steel mb-4">
        {config.message}
      </p>

      {/* Network status indicator */}
      {!isOnline && (
        <div className="flex items-center justify-center gap-2 mb-4 text-[13px] text-ak-error">
          <WifiOff size={16} />
          <span>Offline</span>
        </div>
      )}

      {/* Retry button */}
      {config.showRetry && onRetry && (
        <button
          onClick={handleRetry}
          disabled={isRetrying || !isOnline}
          className="inline-flex items-center gap-2 px-6 py-3 bg-ak-primary text-white rounded-lg text-[14px] font-medium hover:bg-ak-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw size={16} className={isRetrying ? 'animate-spin' : ''} />
          {isRetrying ? 'Prøver igjen...' : 'Prøv igjen'}
        </button>
      )}

      {/* Retry count indicator */}
      {retryCount > 0 && (
        <p className="text-[12px] text-ak-steel mt-3">
          Forsøk {retryCount + 1}
        </p>
      )}

      {/* Partial data notice */}
      {showPartialData && (
        <div className="mt-4 p-3 bg-ak-warning/10 border border-ak-warning/20 rounded-lg">
          <p className="text-[13px] text-ak-warning">
            Viser tidligere data. Noe informasjon kan være utdatert.
          </p>
        </div>
      )}
    </div>
  );
};

export default EnhancedErrorState;
