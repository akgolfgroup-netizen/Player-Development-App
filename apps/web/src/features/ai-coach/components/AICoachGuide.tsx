/**
 * AICoachGuide.tsx
 * Design System v3.0 - Premium Light
 *
 * MIGRATED TO PAGE ARCHITECTURE - Zero inline styles
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
      <div className={`bg-ak-brand-primary/10 rounded-lg py-2 px-3 ${className}`}>
        <div className="flex items-center gap-2">
          <Bot size={16} className="text-ak-brand-primary shrink-0" />
          <span className="flex-1 text-xs text-ak-text-secondary">{config.description}</span>
          <button
            onClick={handleOpenChat}
            className="inline-flex items-center gap-1 py-1 px-2 bg-ak-brand-primary border-none rounded text-xs text-white cursor-pointer font-medium"
            aria-label="Spør AI Coach"
          >
            <MessageCircle size={14} />
            Spør
          </button>
          <button
            onClick={handleDismiss}
            className="flex items-center justify-center w-6 h-6 bg-transparent border-none rounded text-ak-text-tertiary cursor-pointer p-0 hover:bg-ak-surface-subtle hover:text-ak-text-secondary"
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
      <div className={`bg-ak-surface-subtle border-b border-ak-border-subtle py-3 px-4 ${className}`}>
        <div className="flex items-center gap-3 max-w-[1200px] mx-auto max-sm:flex-wrap">
          <div className="w-9 h-9 rounded-full bg-ak-brand-primary/10 text-ak-brand-primary flex items-center justify-center shrink-0">
            <Bot size={24} />
          </div>
          <div className="flex-1 text-sm text-ak-text-primary">
            <strong>{config.title}</strong> – {config.description}
          </div>
          <div className="flex items-center gap-2 max-sm:w-full max-sm:mt-2">
            {config.suggestions.slice(0, 2).map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => handleSuggestionClick(suggestion)}
                className="py-1 px-3 bg-ak-brand-primary border-none rounded-full text-xs text-white cursor-pointer font-medium whitespace-nowrap hover:opacity-90"
              >
                {suggestion}
              </button>
            ))}
            <button
              onClick={handleDismiss}
              className="flex items-center justify-center w-6 h-6 bg-transparent border-none rounded text-ak-text-tertiary cursor-pointer p-0 hover:bg-ak-surface-subtle hover:text-ak-text-secondary"
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
    <div className={`bg-ak-surface-base border border-ak-brand-primary/20 rounded-xl p-4 mb-4 ${className}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-ak-brand-primary/10 text-ak-brand-primary flex items-center justify-center">
            <Bot size={20} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-ak-text-primary m-0 mb-0.5">{config.title}</h3>
            <span className="text-xs text-ak-brand-primary font-medium">AI Coach</span>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="flex items-center justify-center w-7 h-7 bg-transparent border-none rounded text-ak-text-tertiary cursor-pointer transition-colors hover:bg-ak-surface-subtle hover:text-ak-text-secondary"
          aria-label="Skjul veiviser"
          title="Ikke vis igjen"
        >
          <X size={16} />
        </button>
      </div>

      {/* Description */}
      <p className="text-sm text-ak-text-secondary leading-relaxed m-0 mb-4">{config.description}</p>

      {/* Suggestions */}
      <div className="flex flex-wrap gap-2">
        {config.suggestions.map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => handleSuggestionClick(suggestion)}
            className="inline-flex items-center gap-2 py-2 px-3 bg-ak-surface-subtle border border-ak-border-default rounded-full text-xs text-ak-text-secondary cursor-pointer transition-all hover:bg-ak-surface-base hover:border-ak-brand-primary hover:text-ak-text-primary"
          >
            <MessageCircle size={14} />
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}

export default AICoachGuide;
