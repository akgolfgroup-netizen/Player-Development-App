/**
 * TIER Golf - Offline Indicator
 *
 * Shows network status and pending sync count.
 * Displays banner when offline, toast when coming back online.
 */

import React, { useEffect, useState } from 'react';
import { WifiOff, CloudOff, RefreshCw, Check } from 'lucide-react';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';
import { processQueue } from '../../services/offlineStore';

interface OfflineIndicatorProps {
  showPendingSyncs?: boolean;
  position?: 'top' | 'bottom';
  onSyncComplete?: (result: { success: number; failed: number }) => void;
}

const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({
  showPendingSyncs = true,
  position = 'top',
  onSyncComplete,
}) => {
  const { isOnline, wasOffline, pendingSyncs } = useNetworkStatus();
  const [isSyncing, setIsSyncing] = useState(false);
  const [showReconnected, setShowReconnected] = useState(false);
  const [syncResult, setSyncResult] = useState<{ success: number; failed: number } | null>(null);

  // Handle coming back online
  useEffect(() => {
    if (isOnline && wasOffline) {
      setShowReconnected(true);

      // Auto-sync pending changes
      if (pendingSyncs > 0) {
        handleSync();
      }

      // Hide reconnected message after 3 seconds
      const timer = setTimeout(() => {
        setShowReconnected(false);
        setSyncResult(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isOnline, wasOffline, pendingSyncs]);

  const handleSync = async () => {
    if (isSyncing || !isOnline) return;

    setIsSyncing(true);
    try {
      const result = await processQueue(async (url, options) => {
        const token = localStorage.getItem('auth_token');
        return fetch(url, {
          ...options,
          headers: {
            ...options.headers,
            Authorization: token ? `Bearer ${token}` : '',
          },
        });
      });

      setSyncResult(result);
      onSyncComplete?.(result);
    } catch (error) {
      console.error('[OfflineIndicator] Sync failed:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  // Don't show anything if online and no pending syncs
  if (isOnline && !showReconnected && pendingSyncs === 0) {
    return null;
  }

  const positionStyles: React.CSSProperties = position === 'top'
    ? { top: 0, borderRadius: '0 0 var(--radius-md) var(--radius-md)' }
    : { bottom: 0, borderRadius: 'var(--radius-md) var(--radius-md) 0 0' };

  // Show reconnected toast
  if (showReconnected && isOnline) {
    return (
      <div
        style={{
          ...styles.banner,
          ...positionStyles,
          backgroundColor: 'var(--status-success)',
        }}
        role="status"
        aria-live="polite"
      >
        <Check size={16} />
        <span>
          {syncResult
            ? `Tilkoblet igjen - ${syncResult.success} endringer synkronisert`
            : 'Tilkoblet igjen'}
        </span>
      </div>
    );
  }

  // Show offline banner
  if (!isOnline) {
    return (
      <div
        style={{
          ...styles.banner,
          ...positionStyles,
          backgroundColor: 'var(--status-warning)',
        }}
        role="alert"
        aria-live="assertive"
      >
        <WifiOff size={16} />
        <span>Du er offline - endringer lagres lokalt</span>
      </div>
    );
  }

  // Show pending syncs indicator
  if (showPendingSyncs && pendingSyncs > 0) {
    return (
      <button
        onClick={handleSync}
        disabled={isSyncing}
        style={{
          ...styles.syncButton,
          ...positionStyles,
        }}
        aria-label={`${pendingSyncs} ventende endringer - klikk for å synkronisere`}
      >
        {isSyncing ? (
          <RefreshCw size={16} style={styles.spinning} />
        ) : (
          <CloudOff size={16} />
        )}
        <span>{pendingSyncs} ventende</span>
      </button>
    );
  }

  return null;
};

const styles: Record<string, React.CSSProperties> = {
  banner: {
    position: 'fixed',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-2)',
    padding: 'var(--spacing-2) var(--spacing-4)',
    color: 'white',
    fontSize: 'var(--font-size-footnote)',
    fontWeight: 500,
    zIndex: 9999,
    boxShadow: 'var(--shadow-md)',
  },
  syncButton: {
    position: 'fixed',
    right: 'var(--spacing-4)',
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-2)',
    padding: 'var(--spacing-2) var(--spacing-3)',
    backgroundColor: 'var(--background-elevated)',
    border: '1px solid var(--border-default)',
    borderRadius: 'var(--radius-md)',
    color: 'var(--text-secondary)',
    fontSize: 'var(--font-size-footnote)',
    cursor: 'pointer',
    zIndex: 9999,
    transition: 'all 0.15s ease',
  },
  spinning: {
    animation: 'spin 1s linear infinite',
  },
};

// Add keyframes for spinning animation
if (typeof document !== 'undefined' && !document.getElementById('offline-indicator-styles')) {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'offline-indicator-styles';
  styleSheet.textContent = `
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(styleSheet);
}

export default OfflineIndicator;
