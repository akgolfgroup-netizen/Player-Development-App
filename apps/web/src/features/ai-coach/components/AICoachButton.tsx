/**
 * AI Coach Button
 *
 * Floating action button that opens the AI Coach panel.
 * Shows unread message badge when there are new messages.
 *
 * Position: Fixed bottom-right corner
 * Visibility: Always visible when panel is closed
 */

import React from 'react';
import { Sparkles } from 'lucide-react';
import { useAICoach } from '../context/AICoachContext';

// =============================================================================
// Component
// =============================================================================

export function AICoachButton() {
  const { isOpen, unreadCount, togglePanel, markAsRead } = useAICoach();

  // Don't show button when panel is open
  if (isOpen) {
    return null;
  }

  const handleClick = () => {
    markAsRead();
    togglePanel();
  };

  return (
    <button
      onClick={handleClick}
      style={styles.button}
      aria-label={`Åpne AI Coach${unreadCount > 0 ? ` (${unreadCount} uleste)` : ''}`}
    >
      <Sparkles size={24} />
      <span style={styles.label}>AI Coach</span>

      {/* Unread badge */}
      {unreadCount > 0 && (
        <span style={styles.badge} aria-label={`${unreadCount} uleste meldinger`}>
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </button>
  );
}

// =============================================================================
// Styles
// =============================================================================

const styles: Record<string, React.CSSProperties> = {
  button: {
    position: 'fixed',
    right: 'var(--spacing-4)',
    bottom: 'var(--spacing-4)',
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-2)',
    padding: 'var(--spacing-3) var(--spacing-4)',
    backgroundColor: 'var(--accent)',
    color: 'white',
    border: 'none',
    borderRadius: 'var(--radius-full)',
    cursor: 'pointer',
    boxShadow: 'var(--shadow-lg)',
    zIndex: 1000,
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    fontFamily: 'inherit',
  },
  label: {
    fontWeight: 600,
    fontSize: 'var(--font-size-body)',
  },
  badge: {
    position: 'absolute',
    top: '-4px',
    right: '-4px',
    minWidth: '20px',
    height: '20px',
    padding: '0 6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'var(--status-error)',
    color: 'white',
    borderRadius: 'var(--radius-full)',
    fontSize: '11px',
    fontWeight: 700,
    lineHeight: 1,
    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
  },
};

// Add hover styles via CSS
if (typeof document !== 'undefined' && !document.getElementById('ai-coach-button-styles')) {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'ai-coach-button-styles';
  styleSheet.textContent = `
    [aria-label^="Åpne AI Coach"]:hover {
      transform: scale(1.05);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
    }
    [aria-label^="Åpne AI Coach"]:active {
      transform: scale(0.98);
    }

    /* Mobile responsive */
    @media (max-width: 480px) {
      [aria-label^="Åpne AI Coach"] {
        right: var(--spacing-3) !important;
        bottom: var(--spacing-3) !important;
        padding: var(--spacing-3) !important;
      }
      [aria-label^="Åpne AI Coach"] span:not([aria-label]) {
        display: none;
      }
    }
  `;
  document.head.appendChild(styleSheet);
}

export default AICoachButton;
