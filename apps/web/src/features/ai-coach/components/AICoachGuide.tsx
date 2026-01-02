/**
 * AI Coach Guide
 *
 * Contextual inline guide component that appears on specific pages.
 * Features:
 * - Page-specific title and description
 * - Suggestion chips that open chat with pre-filled message
 * - Dismissible with persistence
 * - Matches design system
 */

import React from 'react';
import { Bot, X, MessageCircle } from 'lucide-react';
import { useAICoach } from '../context/AICoachContext';
import type { GuideConfig } from '../types';

// =============================================================================
// Types
// =============================================================================

interface AICoachGuideProps {
  /**
   * Guide configuration with title, description, and suggestions
   */
  config: GuideConfig;

  /**
   * Optional variant for different visual styles
   */
  variant?: 'default' | 'compact' | 'banner';

  /**
   * Optional className for additional styling
   */
  className?: string;
}

// =============================================================================
// Component
// =============================================================================

export function AICoachGuide({
  config,
  variant = 'default',
  className = '',
}: AICoachGuideProps) {
  const {
    isGuideHidden,
    hideGuide,
    openPanelWithMessage,
    isOpen: isPanelOpen,
  } = useAICoach();

  // Don't show if hidden or if panel is already open
  if (isGuideHidden(config.id) || isPanelOpen) {
    return null;
  }

  const handleDismiss = () => {
    hideGuide(config.id);
  };

  const handleSuggestionClick = (suggestion: string) => {
    openPanelWithMessage(suggestion);
  };

  const handleOpenChat = () => {
    openPanelWithMessage(`Hjelp meg med ${config.title.toLowerCase()}`);
  };

  if (variant === 'compact') {
    return (
      <div style={styles.compactContainer} className={className}>
        <div style={styles.compactContent}>
          <Bot size={16} style={{ color: 'var(--accent)', flexShrink: 0 }} />
          <span style={styles.compactText}>{config.description}</span>
          <button
            onClick={handleOpenChat}
            style={styles.compactButton}
            aria-label="Spør AI Coach"
          >
            <MessageCircle size={14} />
            Spør
          </button>
          <button
            onClick={handleDismiss}
            style={styles.dismissButtonSmall}
            aria-label="Skjul veiviser"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    );
  }

  if (variant === 'banner') {
    return (
      <div style={styles.bannerContainer} className={className}>
        <div style={styles.bannerContent}>
          <div style={styles.bannerIcon}>
            <Bot size={24} />
          </div>
          <div style={styles.bannerText}>
            <strong>{config.title}</strong> – {config.description}
          </div>
          <div style={styles.bannerActions}>
            {config.suggestions.slice(0, 2).map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => handleSuggestionClick(suggestion)}
                style={styles.bannerSuggestion}
              >
                {suggestion}
              </button>
            ))}
            <button
              onClick={handleDismiss}
              style={styles.dismissButtonSmall}
              aria-label="Skjul veiviser"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Default variant (card style)
  return (
    <div style={styles.container} className={className}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.iconContainer}>
            <Bot size={20} />
          </div>
          <div>
            <h3 style={styles.title}>{config.title}</h3>
            <span style={styles.badge}>AI Coach</span>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          style={styles.dismissButton}
          aria-label="Skjul veiviser"
          title="Ikke vis igjen"
        >
          <X size={16} />
        </button>
      </div>

      {/* Description */}
      <p style={styles.description}>{config.description}</p>

      {/* Suggestions */}
      <div style={styles.suggestions}>
        {config.suggestions.map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => handleSuggestionClick(suggestion)}
            style={styles.suggestionButton}
          >
            <MessageCircle size={14} />
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}

// =============================================================================
// Styles
// =============================================================================

const styles: Record<string, React.CSSProperties> = {
  // Default variant (card)
  container: {
    backgroundColor: 'var(--background-surface)',
    border: '1px solid var(--accent-muted)',
    borderRadius: 'var(--radius-lg)',
    padding: 'var(--spacing-4)',
    marginBottom: 'var(--spacing-4)',
  },
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 'var(--spacing-3)',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-3)',
  },
  iconContainer: {
    width: '40px',
    height: '40px',
    borderRadius: 'var(--radius-full)',
    backgroundColor: 'var(--accent-muted)',
    color: 'var(--accent)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 'var(--font-size-body)',
    fontWeight: 600,
    color: 'var(--text-primary)',
    margin: 0,
    marginBottom: '2px',
  },
  badge: {
    fontSize: 'var(--font-size-caption)',
    color: 'var(--accent)',
    fontWeight: 500,
  },
  dismissButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '28px',
    height: '28px',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--text-tertiary)',
    cursor: 'pointer',
    transition: 'background-color 0.15s ease, color 0.15s ease',
  },
  description: {
    fontSize: 'var(--font-size-footnote)',
    color: 'var(--text-secondary)',
    lineHeight: 1.5,
    margin: 0,
    marginBottom: 'var(--spacing-4)',
  },
  suggestions: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 'var(--spacing-2)',
  },
  suggestionButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 'var(--spacing-2)',
    padding: 'var(--spacing-2) var(--spacing-3)',
    backgroundColor: 'var(--background-elevated)',
    border: '1px solid var(--border-default)',
    borderRadius: 'var(--radius-full)',
    fontSize: 'var(--font-size-caption)',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    fontFamily: 'inherit',
  },

  // Compact variant
  compactContainer: {
    backgroundColor: 'var(--accent-muted)',
    borderRadius: 'var(--radius-md)',
    padding: 'var(--spacing-2) var(--spacing-3)',
  },
  compactContent: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-2)',
  },
  compactText: {
    flex: 1,
    fontSize: 'var(--font-size-caption)',
    color: 'var(--text-secondary)',
  },
  compactButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 'var(--spacing-1)',
    padding: 'var(--spacing-1) var(--spacing-2)',
    backgroundColor: 'var(--accent)',
    border: 'none',
    borderRadius: 'var(--radius-sm)',
    fontSize: 'var(--font-size-caption)',
    color: 'white',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontWeight: 500,
  },
  dismissButtonSmall: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '24px',
    height: '24px',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--text-tertiary)',
    cursor: 'pointer',
    padding: 0,
  },

  // Banner variant
  bannerContainer: {
    backgroundColor: 'var(--background-elevated)',
    borderBottom: '1px solid var(--border-subtle)',
    padding: 'var(--spacing-3) var(--spacing-4)',
  },
  bannerContent: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-3)',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  bannerIcon: {
    width: '36px',
    height: '36px',
    borderRadius: 'var(--radius-full)',
    backgroundColor: 'var(--accent-muted)',
    color: 'var(--accent)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  bannerText: {
    flex: 1,
    fontSize: 'var(--font-size-footnote)',
    color: 'var(--text-primary)',
  },
  bannerActions: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-2)',
  },
  bannerSuggestion: {
    padding: 'var(--spacing-1) var(--spacing-3)',
    backgroundColor: 'var(--accent)',
    border: 'none',
    borderRadius: 'var(--radius-full)',
    fontSize: 'var(--font-size-caption)',
    color: 'white',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontWeight: 500,
    whiteSpace: 'nowrap',
  },
};

// Add hover styles
if (typeof document !== 'undefined' && !document.getElementById('ai-coach-guide-styles')) {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'ai-coach-guide-styles';
  styleSheet.textContent = `
    /* Dismiss button hover */
    [aria-label="Skjul veiviser"]:hover {
      background-color: var(--background-elevated);
      color: var(--text-secondary);
    }

    /* Suggestion button hover */
    .ai-coach-suggestion:hover {
      background-color: var(--background-surface);
      border-color: var(--accent);
      color: var(--text-primary);
    }

    /* Mobile responsive for banner */
    @media (max-width: 640px) {
      [class*="bannerContent"] {
        flex-wrap: wrap;
      }
      [class*="bannerActions"] {
        width: 100%;
        margin-top: var(--spacing-2);
      }
    }
  `;
  document.head.appendChild(styleSheet);
}

export default AICoachGuide;
