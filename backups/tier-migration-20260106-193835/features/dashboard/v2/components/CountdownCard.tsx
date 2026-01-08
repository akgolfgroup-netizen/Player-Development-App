import React from 'react';
import Card from '../../../../ui/primitives/Card';
import { SubSectionTitle } from '../../../../components/typography';

/**
 * CountdownCard
 *
 * Displays countdown to upcoming events (tournaments, tests, milestones).
 * Uses monospace numerals for the countdown value.
 *
 * Design principles:
 * - Event type indicated by subtle background tint (not color overload)
 * - Days remaining is the dominant visual element
 * - Location and date are secondary information
 * - No icons as UI elements (per design spec)
 */

type EventType = 'tournament' | 'test' | 'milestone';

interface CountdownCardProps {
  /** Event type for visual differentiation */
  type: EventType;
  /** Event title */
  title: string;
  /** Target date */
  date: Date | string;
  /** Optional location */
  location?: string;
  /** Optional subtitle/description */
  subtitle?: string;
  /** Click handler for details */
  onClick?: () => void;
}

const CountdownCard: React.FC<CountdownCardProps> = ({
  type,
  title,
  date,
  location,
  subtitle,
  onClick,
}) => {
  // Calculate days remaining
  const targetDate = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  targetDate.setHours(0, 0, 0, 0);
  const diffTime = targetDate.getTime() - today.getTime();
  const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // Format date for display
  const formatDate = (d: Date): string => {
    return d.toLocaleDateString('nb-NO', {
      day: 'numeric',
      month: 'short',
    });
  };

  // Get type-specific styling using semantic tokens
  const getTypeStyles = () => {
    switch (type) {
      case 'tournament':
        return {
          labelColor: 'var(--ak-warning)',
          bgTint: 'var(--warning-muted)',
        };
      case 'test':
        return {
          labelColor: 'var(--ak-info)',
          bgTint: 'var(--info-muted)',
        };
      case 'milestone':
        return {
          labelColor: 'var(--ak-primary)',
          bgTint: 'var(--accent-muted)',
        };
    }
  };

  const typeStyles = getTypeStyles();
  const typeLabels: Record<EventType, string> = {
    tournament: 'Turnering',
    test: 'Test',
    milestone: 'Milepæl',
  };

  // Handle past/today events
  const getDaysLabel = (): string => {
    if (daysRemaining === 0) return 'I dag';
    if (daysRemaining === 1) return '1 dag';
    if (daysRemaining < 0) return 'Passert';
    return `${daysRemaining} dager`;
  };

  return (
    <Card
      variant="outlined"
      padding="md"
      onClick={onClick}
      style={{
        backgroundColor: typeStyles.bgTint,
        ...(onClick ? { cursor: 'pointer' } : {}),
      }}
    >
      <div style={styles.container}>
        {/* Left side: Event info */}
        <div style={styles.infoSection}>
          {/* Type label */}
          <span
            style={{
              ...styles.typeLabel,
              color: typeStyles.labelColor,
            }}
          >
            {typeLabels[type]}
          </span>

          {/* Title */}
          <SubSectionTitle style={styles.title}>{title}</SubSectionTitle>

          {/* Subtitle or location */}
          {(subtitle || location) && (
            <p style={styles.subtitle}>
              {subtitle || location}
            </p>
          )}

          {/* Date */}
          <p style={styles.date}>{formatDate(targetDate)}</p>
        </div>

        {/* Right side: Countdown */}
        <div style={styles.countdownSection}>
          <span style={styles.daysValue}>
            {daysRemaining >= 0 ? daysRemaining : '—'}
          </span>
          <span style={styles.daysLabel}>
            {getDaysLabel()}
          </span>
        </div>
      </div>
    </Card>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 'var(--spacing-3)',
  },
  infoSection: {
    flex: 1,
    minWidth: 0,
  },
  typeLabel: {
    display: 'block',
    fontSize: 'var(--font-size-caption2)',
    lineHeight: 'var(--line-height-caption2)',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '4px',
  },
  title: {
    fontSize: 'var(--font-size-subheadline)',
    lineHeight: 'var(--line-height-subheadline)',
    fontWeight: 600,
    color: 'var(--text-primary)',
    margin: '0 0 4px 0',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  subtitle: {
    fontSize: 'var(--font-size-caption1)',
    lineHeight: 'var(--line-height-caption1)',
    color: 'var(--text-secondary)',
    margin: '0 0 2px 0',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  date: {
    fontSize: 'var(--font-size-caption1)',
    lineHeight: 'var(--line-height-caption1)',
    color: 'var(--text-tertiary)',
    margin: 0,
  },
  countdownSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    flexShrink: 0,
  },
  daysValue: {
    fontSize: 'var(--font-size-title1)',
    lineHeight: 1,
    fontWeight: 700,
    color: 'var(--text-brand)',
    fontVariantNumeric: 'tabular-nums',
  },
  daysLabel: {
    fontSize: 'var(--font-size-caption2)',
    lineHeight: 'var(--line-height-caption2)',
    color: 'var(--text-tertiary)',
    marginTop: '2px',
  },
};

export default CountdownCard;

/**
 * NextUpSection
 *
 * Container for 2 CountdownCards (tournament + test).
 * Stacked on mobile, side-by-side on tablet+.
 */
interface NextUpSectionProps {
  /** Tournament countdown data */
  tournament?: {
    title: string;
    date: Date | string;
    location?: string;
    onClick?: () => void;
  };
  /** Test countdown data */
  test?: {
    title: string;
    date: Date | string;
    subtitle?: string;
    onClick?: () => void;
  };
}

export const NextUpSection: React.FC<NextUpSectionProps> = ({
  tournament,
  test,
}) => {
  if (!tournament && !test) return null;

  return (
    <div style={nextUpStyles.container}>
      {tournament && (
        <CountdownCard
          type="tournament"
          title={tournament.title}
          date={tournament.date}
          location={tournament.location}
          onClick={tournament.onClick}
        />
      )}
      {test && (
        <CountdownCard
          type="test"
          title={test.title}
          date={test.date}
          subtitle={test.subtitle}
          onClick={test.onClick}
        />
      )}
    </div>
  );
};

const nextUpStyles: Record<string, React.CSSProperties> = {
  container: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: 'var(--spacing-3)',
  },
};

// CSS for responsive grid (add to index.css)
export const nextUpCSS = `
@media (min-width: 640px) {
  .next-up-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
`;
