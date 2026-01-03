/**
 * Analytics Debug Overlay
 * Design System v3.0 - Premium Light
 *
 * MIGRATED TO PAGE ARCHITECTURE - Minimal inline styles (dynamic colors)
 *
 * DEV ONLY — NOT RENDERED IN PRODUCTION
 * Shows last 20 tracked events in a collapsible panel.
 */

import React, { useState, useEffect } from 'react';

const IS_DEV = process.env.NODE_ENV === 'development';

interface DebugEvent {
  id: number;
  timestamp: string;
  event: string;
  payload?: Record<string, unknown>;
}

// In-memory event buffer (shared across instances)
const eventBuffer: DebugEvent[] = [];
let eventId = 0;
const listeners = new Set<() => void>();

/**
 * Push an event to the debug buffer (call from track.ts)
 */
export function pushDebugEvent(
  event: string,
  payload?: Record<string, unknown>
): void {
  if (!IS_DEV) return;

  eventBuffer.unshift({
    id: eventId++,
    timestamp: new Date().toISOString().split('T')[1].slice(0, 8),
    event,
    payload,
  });

  // Keep only last 20
  if (eventBuffer.length > 20) {
    eventBuffer.pop();
  }

  // Notify listeners
  listeners.forEach((fn) => fn());
}

/**
 * Debug Panel Component
 */
const AnalyticsDebug: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [, forceUpdate] = useState({});

  useEffect(() => {
    const update = () => forceUpdate({});
    listeners.add(update);
    return () => {
      listeners.delete(update);
    };
  }, []);

  if (!IS_DEV) return null;

  return (
    <div style={styles.container}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={styles.toggle}
        aria-label="Toggle analytics debug"
      >
        {isOpen ? '📊 ▼' : '📊 ▲'}
      </button>

      {isOpen && (
        <div style={styles.panel}>
          <div style={styles.header}>
            <span style={styles.title}>Analytics Events</span>
            <button
              onClick={() => {
                eventBuffer.length = 0;
                forceUpdate({});
              }}
              style={styles.clearBtn}
            >
              Clear
            </button>
          </div>
          <div style={styles.eventList}>
            {eventBuffer.length === 0 ? (
              <div style={styles.empty}>No events yet</div>
            ) : (
              eventBuffer.map((e) => (
                <div key={e.id} style={styles.eventItem}>
                  <span style={styles.time}>{e.timestamp}</span>
                  <span style={styles.eventName}>{e.event}</span>
                  {e.payload && (
                    <span style={styles.payload}>
                      {JSON.stringify(e.payload).slice(0, 50)}
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    position: 'fixed',
    bottom: 70,
    right: 10,
    zIndex: 9999,
    fontFamily: 'monospace',
    fontSize: '11px',
  },
  toggle: {
    padding: '6px 10px',
    backgroundColor: 'var(--ak-toast-bg)',
    color: 'var(--ak-surface-card)',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  panel: {
    position: 'absolute',
    bottom: 36,
    right: 0,
    width: '320px',
    maxHeight: '300px',
    backgroundColor: 'var(--ak-toast-bg)',
    color: 'var(--ak-text-tertiary)',
    borderRadius: '6px',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 10px',
    borderBottom: '1px solid var(--ak-border-subtle)',
  },
  title: {
    fontWeight: 'bold',
    color: 'var(--ak-surface-card)',
  },
  clearBtn: {
    padding: '2px 8px',
    fontSize: '10px',
    backgroundColor: 'var(--ak-surface-subtle)',
    color: 'var(--ak-surface-card)',
    border: 'none',
    borderRadius: '3px',
    cursor: 'pointer',
  },
  eventList: {
    maxHeight: '250px',
    overflowY: 'auto',
    padding: '6px',
  },
  eventItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    padding: '4px 6px',
    marginBottom: '4px',
    backgroundColor: 'var(--ak-surface-dark-subtle)',
    borderRadius: '3px',
  },
  time: {
    color: 'var(--ak-text-secondary)',
    fontSize: '9px',
  },
  eventName: {
    color: 'var(--ak-accent-cyan)',
    fontWeight: 'bold',
  },
  payload: {
    color: 'var(--ak-text-tertiary)',
    fontSize: '10px',
    wordBreak: 'break-all',
  },
  empty: {
    color: 'var(--ak-text-secondary)',
    textAlign: 'center',
    padding: '20px',
  },
};

export default AnalyticsDebug;
