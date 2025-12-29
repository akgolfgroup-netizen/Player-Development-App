import React from 'react';
import Card from '../../../../ui/primitives/Card';

/**
 * HeroCard
 *
 * Primary dashboard card displaying the day's main focus.
 * Occupies col-span-7 on desktop, full width on mobile.
 *
 * Design principles:
 * - Prominent but not overpowering
 * - Clear hierarchy: Priority > Context > Action
 * - Single CTA (primary button)
 * - No decorative elements
 */

interface HeroCardProps {
  /** Current date formatted (e.g., "Mandag 29. desember") */
  dateLabel: string;
  /** Player's first name for personalized greeting */
  playerName: string;
  /** Primary focus/priority for today */
  todaysFocus: {
    title: string;
    description: string;
    category?: string;
    progress?: number; // 0-100
  };
  /** Primary CTA button */
  primaryAction?: {
    label: string;
    onClick: () => void;
  };
  /** Secondary action (text link) */
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
}

const HeroCard: React.FC<HeroCardProps> = ({
  dateLabel,
  playerName,
  todaysFocus,
  primaryAction,
  secondaryAction,
}) => {
  return (
    <Card variant="elevated" padding="spacious">
      {/* Date Label */}
      <p style={styles.dateLabel}>
        {dateLabel}
      </p>

      {/* Greeting */}
      <h1 style={styles.greeting}>
        God morgen, {playerName}
      </h1>

      {/* Today's Focus Section */}
      <div style={styles.focusSection}>
        <div style={styles.focusHeader}>
          <span style={styles.focusLabel}>Dagens fokus</span>
          {todaysFocus.category && (
            <span style={styles.categoryBadge}>
              {todaysFocus.category}
            </span>
          )}
        </div>

        <h2 style={styles.focusTitle}>
          {todaysFocus.title}
        </h2>

        <p style={styles.focusDescription}>
          {todaysFocus.description}
        </p>

        {/* Progress indicator (if applicable) */}
        {typeof todaysFocus.progress === 'number' && (
          <div style={styles.progressContainer}>
            <div style={styles.progressTrack}>
              <div
                style={{
                  ...styles.progressFill,
                  width: `${todaysFocus.progress}%`,
                }}
              />
            </div>
            <span style={styles.progressLabel}>
              {todaysFocus.progress}% fullført
            </span>
          </div>
        )}
      </div>

      {/* Actions */}
      {(primaryAction || secondaryAction) && (
        <div style={styles.actions}>
          {primaryAction && (
            <button
              style={styles.primaryButton}
              onClick={primaryAction.onClick}
              className="btn-interactive"
            >
              {primaryAction.label}
            </button>
          )}
          {secondaryAction && (
            <button
              style={styles.secondaryButton}
              onClick={secondaryAction.onClick}
            >
              {secondaryAction.label}
            </button>
          )}
        </div>
      )}
    </Card>
  );
};

const styles: Record<string, React.CSSProperties> = {
  dateLabel: {
    fontSize: 'var(--font-size-caption1)',
    lineHeight: 'var(--line-height-caption1)',
    color: 'var(--text-tertiary)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    fontWeight: 500,
    margin: 0,
  },
  greeting: {
    fontSize: 'var(--font-size-title1)',
    lineHeight: 'var(--line-height-title1)',
    fontWeight: 700,
    color: 'var(--text-primary)',
    margin: '4px 0 20px 0',
  },
  focusSection: {
    backgroundColor: 'var(--background-surface)',
    borderRadius: 'var(--radius-md)',
    padding: 'var(--spacing-4)',
    marginBottom: 'var(--spacing-4)',
  },
  focusHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 'var(--spacing-2)',
  },
  focusLabel: {
    fontSize: 'var(--font-size-footnote)',
    lineHeight: 'var(--line-height-footnote)',
    fontWeight: 600,
    color: 'var(--text-brand)',
    textTransform: 'uppercase',
    letterSpacing: '0.03em',
  },
  categoryBadge: {
    fontSize: 'var(--font-size-caption2)',
    lineHeight: 'var(--line-height-caption2)',
    fontWeight: 500,
    color: 'var(--text-secondary)',
    backgroundColor: 'var(--background-elevated)',
    padding: '2px 8px',
    borderRadius: 'var(--radius-full)',
  },
  focusTitle: {
    fontSize: 'var(--font-size-title3)',
    lineHeight: 'var(--line-height-title3)',
    fontWeight: 600,
    color: 'var(--text-primary)',
    margin: '0 0 6px 0',
  },
  focusDescription: {
    fontSize: 'var(--font-size-subheadline)',
    lineHeight: 'var(--line-height-subheadline)',
    color: 'var(--text-secondary)',
    margin: 0,
  },
  progressContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-3)',
    marginTop: 'var(--spacing-3)',
  },
  progressTrack: {
    flex: 1,
    height: '6px',
    backgroundColor: 'var(--background-elevated)',
    borderRadius: 'var(--radius-full)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'var(--ak-primary)',
    borderRadius: 'var(--radius-full)',
    transition: 'width 0.3s ease',
  },
  progressLabel: {
    fontSize: 'var(--font-size-caption1)',
    color: 'var(--text-tertiary)',
    fontVariantNumeric: 'tabular-nums',
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-3)',
    flexWrap: 'wrap',
  },
  primaryButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '44px',
    padding: '0 var(--spacing-5)',
    backgroundColor: 'var(--ak-primary)',
    color: 'var(--text-inverse)',
    border: 'none',
    borderRadius: 'var(--radius-sm)',
    fontSize: 'var(--font-size-subheadline)',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  secondaryButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '44px',
    padding: '0 var(--spacing-4)',
    backgroundColor: 'transparent',
    color: 'var(--text-brand)',
    border: 'none',
    fontSize: 'var(--font-size-subheadline)',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'color 0.15s ease',
  },
};

export default HeroCard;
