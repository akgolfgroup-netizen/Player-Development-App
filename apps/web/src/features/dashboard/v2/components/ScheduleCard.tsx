import React from 'react';
import Card from '../../../../ui/primitives/Card';
import { SubSectionTitle } from '../../../../components/typography';

/**
 * ScheduleCard
 *
 * Daily training plan/schedule display.
 * Shows time-blocked sessions with type indicators.
 *
 * Design principles:
 * - Time is aligned for quick scanning
 * - Session types use subtle semantic colors
 * - Completed sessions are visually muted
 * - Touch targets meet 44px minimum
 */

type SessionType =
  | 'teknikk'
  | 'golfslag'
  | 'spill'
  | 'kompetanse'
  | 'fysisk'
  | 'funksjonell'
  | 'hjemme'
  | 'test';

type SessionStatus = 'upcoming' | 'in_progress' | 'completed' | 'skipped';

interface ScheduleSession {
  id: string;
  title: string;
  type: SessionType;
  startTime: string; // "09:00"
  endTime?: string;  // "10:30"
  duration?: number; // minutes
  status: SessionStatus;
  location?: string;
}

interface ScheduleCardProps {
  /** Date label (e.g., "Mandag 29. des") */
  dateLabel: string;
  /** List of sessions */
  sessions: ScheduleSession[];
  /** Empty state message */
  emptyMessage?: string;
  /** Click handler for session */
  onSessionClick?: (session: ScheduleSession) => void;
  /** View all action */
  onViewAll?: () => void;
}

const ScheduleCard: React.FC<ScheduleCardProps> = ({
  dateLabel,
  sessions,
  emptyMessage = 'Ingen planlagte økter i dag',
  onSessionClick,
  onViewAll,
}) => {
  // Session type colors (subtle backgrounds) - using semantic tokens
  // NOTE: kompetanse and funksjonell mapped to closest semantic alternatives
  const getTypeColor = (type: SessionType): string => {
    const colors: Record<SessionType, string> = {
      teknikk: 'var(--info-muted)',
      golfslag: 'var(--success-muted)',
      spill: 'var(--warning-muted)',
      kompetanse: 'var(--accent-muted)',
      fysisk: 'var(--error-muted)',
      funksjonell: 'var(--error-muted)',
      hjemme: 'var(--bg-neutral-subtle)',
      test: 'var(--info-muted)',
    };
    return colors[type];
  };

  const getTypeDot = (type: SessionType): string => {
    const colors: Record<SessionType, string> = {
      teknikk: 'var(--ak-info)',
      golfslag: 'var(--ak-success)',
      spill: 'var(--ak-warning)',
      kompetanse: 'var(--ak-primary)',
      fysisk: 'var(--ak-error)',
      funksjonell: 'var(--ak-error)',
      hjemme: 'var(--gray-500)',
      test: 'var(--ak-info)',
    };
    return colors[type];
  };

  const getStatusStyles = (status: SessionStatus): React.CSSProperties => {
    switch (status) {
      case 'completed':
        return { opacity: 0.5 };
      case 'skipped':
        return { opacity: 0.3, textDecoration: 'line-through' };
      case 'in_progress':
        return {
          borderLeft: '3px solid var(--ak-primary)',
          paddingLeft: 'calc(var(--spacing-3) - 3px)',
        };
      default:
        return {};
    }
  };

  return (
    <Card variant="default" padding="none">
      {/* Header */}
      <div style={styles.header}>
        <div>
          <span style={styles.headerLabel}>Dagens plan</span>
          <SubSectionTitle style={styles.headerDate}>{dateLabel}</SubSectionTitle>
        </div>
        {onViewAll && (
          <button
            style={styles.viewAllButton}
            onClick={onViewAll}
          >
            Se alt
          </button>
        )}
      </div>

      {/* Sessions list */}
      <div style={styles.sessionsList}>
        {sessions.length === 0 ? (
          <div style={styles.emptyState}>
            <p style={styles.emptyText}>{emptyMessage}</p>
          </div>
        ) : (
          sessions.map((session) => (
            <div
              key={session.id}
              style={{
                ...styles.sessionItem,
                ...getStatusStyles(session.status),
                backgroundColor: getTypeColor(session.type),
              }}
              onClick={() => onSessionClick?.(session)}
              role={onSessionClick ? 'button' : undefined}
              tabIndex={onSessionClick ? 0 : undefined}
            >
              {/* Time column */}
              <div style={styles.timeColumn}>
                <span style={styles.startTime}>{session.startTime}</span>
                {session.endTime && (
                  <span style={styles.endTime}>{session.endTime}</span>
                )}
              </div>

              {/* Content column */}
              <div style={styles.contentColumn}>
                <div style={styles.titleRow}>
                  <span
                    style={{
                      ...styles.typeDot,
                      backgroundColor: getTypeDot(session.type),
                    }}
                  />
                  <span style={styles.sessionTitle}>{session.title}</span>
                </div>
                {session.location && (
                  <span style={styles.location}>{session.location}</span>
                )}
              </div>

              {/* Status indicator */}
              {session.status === 'completed' && (
                <span style={styles.checkmark}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
              )}
            </div>
          ))
        )}
      </div>
    </Card>
  );
};

const styles: Record<string, React.CSSProperties> = {
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: 'var(--spacing-4)',
    borderBottom: '1px solid var(--border-subtle)',
  },
  headerLabel: {
    display: 'block',
    fontSize: 'var(--font-size-caption1)',
    lineHeight: 'var(--line-height-caption1)',
    fontWeight: 500,
    color: 'var(--text-tertiary)',
    textTransform: 'uppercase',
    letterSpacing: '0.03em',
    marginBottom: '2px',
  },
  headerDate: {
    fontSize: 'var(--font-size-headline)',
    lineHeight: 'var(--line-height-headline)',
    fontWeight: 600,
    color: 'var(--text-primary)',
    margin: 0,
  },
  viewAllButton: {
    fontSize: 'var(--font-size-footnote)',
    lineHeight: 'var(--line-height-footnote)',
    fontWeight: 500,
    color: 'var(--text-brand)',
    backgroundColor: 'transparent',
    border: 'none',
    padding: '4px 8px',
    cursor: 'pointer',
    borderRadius: 'var(--radius-sm)',
    transition: 'background-color 0.15s ease',
  },
  sessionsList: {
    padding: 'var(--spacing-2)',
  },
  sessionItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-3)',
    padding: 'var(--spacing-3)',
    borderRadius: 'var(--radius-md)',
    marginBottom: 'var(--spacing-2)',
    cursor: 'pointer',
    transition: 'transform 0.1s ease',
    minHeight: '52px',
  },
  timeColumn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    width: '44px',
    flexShrink: 0,
  },
  startTime: {
    fontSize: 'var(--font-size-footnote)',
    lineHeight: 'var(--line-height-footnote)',
    fontWeight: 600,
    color: 'var(--text-primary)',
    fontVariantNumeric: 'tabular-nums',
  },
  endTime: {
    fontSize: 'var(--font-size-caption2)',
    lineHeight: 'var(--line-height-caption2)',
    color: 'var(--text-tertiary)',
    fontVariantNumeric: 'tabular-nums',
  },
  contentColumn: {
    flex: 1,
    minWidth: 0,
  },
  titleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  typeDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    flexShrink: 0,
  },
  sessionTitle: {
    fontSize: 'var(--font-size-subheadline)',
    lineHeight: 'var(--line-height-subheadline)',
    fontWeight: 500,
    color: 'var(--text-primary)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  location: {
    display: 'block',
    fontSize: 'var(--font-size-caption1)',
    lineHeight: 'var(--line-height-caption1)',
    color: 'var(--text-secondary)',
    marginTop: '2px',
    marginLeft: '16px',
  },
  checkmark: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--ak-success)',
    flexShrink: 0,
  },
  emptyState: {
    padding: 'var(--spacing-6) var(--spacing-4)',
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 'var(--font-size-subheadline)',
    lineHeight: 'var(--line-height-subheadline)',
    color: 'var(--text-tertiary)',
    margin: 0,
  },
};

export default ScheduleCard;
