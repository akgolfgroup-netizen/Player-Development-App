/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * DagbokSessionList
 *
 * Virtualized list of training sessions using react-window.
 * Falls back to regular list if react-window not available.
 */

import React, { useCallback, useRef, useMemo } from 'react';
import { BookOpen, Loader2 } from 'lucide-react';

import type { DagbokSession, DagbokSessionListProps } from '../types';
import { DagbokSessionRow } from './DagbokSessionRow';
import { SESSION_ROW_HEIGHT, OVERSCAN_COUNT } from '../constants';
import { SubSectionTitle } from '../../../../ui/primitives/typography';

// Virtualization disabled - react-window not installed
// When/if react-window is added, uncomment the import below:
// import { FixedSizeList } from 'react-window';
const FixedSizeList: any = null;

// =============================================================================
// STYLES
// =============================================================================

const styles = {
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    overflow: 'hidden',
  },
  scrollContainer: {
    flex: 1,
    overflow: 'auto' as const,
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    padding: '48px 24px',
    gap: '12px',
  },
  loadingText: {
    fontSize: '14px',
    color: 'var(--text-secondary)',
  },
  emptyContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 'var(--spacing-12) var(--spacing-4)',
    textAlign: 'center' as const,
  },
  emptyIcon: {
    width: '48px',
    height: '48px',
    color: 'var(--text-muted)',
    marginBottom: 'var(--spacing-4)',
  },
  emptyTitle: {
    fontSize: 'var(--font-size-headline)',
    fontWeight: 600,
    color: 'var(--text-primary)',
    margin: 0,
    marginBottom: 'var(--spacing-2)',
  },
  emptyMessage: {
    fontSize: 'var(--font-size-footnote)',
    color: 'var(--text-tertiary)',
    margin: 0,
    marginBottom: 'var(--spacing-4)',
    maxWidth: '320px',
  },
  skeletonRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    borderBottom: '1px solid var(--border-subtle)',
  },
  skeletonBadge: {
    width: '40px',
    height: '40px',
    borderRadius: 'var(--radius-sm)',
    backgroundColor: 'var(--skeleton-bg)',
    animation: 'pulse 1.5s ease-in-out infinite',
  },
  skeletonContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },
  skeletonTitle: {
    width: '60%',
    height: '14px',
    borderRadius: 'var(--radius-xs)',
    backgroundColor: 'var(--skeleton-bg)',
    animation: 'pulse 1.5s ease-in-out infinite',
  },
  skeletonMeta: {
    width: '40%',
    height: '12px',
    borderRadius: 'var(--radius-xs)',
    backgroundColor: 'var(--skeleton-bg)',
    animation: 'pulse 1.5s ease-in-out infinite',
  },
  dateHeader: {
    padding: '8px 16px',
    fontSize: '12px',
    fontWeight: 600,
    color: 'var(--text-secondary)',
    backgroundColor: 'var(--bg-secondary)',
    borderBottom: '1px solid var(--border-subtle)',
    position: 'sticky' as const,
    top: 0,
    zIndex: 1,
  },
};

// =============================================================================
// SKELETON COMPONENT
// =============================================================================

const SkeletonRow: React.FC = () => (
  <div style={styles.skeletonRow}>
    <div style={styles.skeletonBadge} />
    <div style={styles.skeletonContent}>
      <div style={styles.skeletonTitle} />
      <div style={styles.skeletonMeta} />
    </div>
  </div>
);

// =============================================================================
// GROUP SESSIONS BY DATE
// =============================================================================

interface SessionGroup {
  date: string;
  dateLabel: string;
  sessions: DagbokSession[];
}

function groupSessionsByDate(sessions: DagbokSession[]): SessionGroup[] {
  const groups: Map<string, DagbokSession[]> = new Map();

  // Sort sessions by date (newest first) then by time
  const sorted = [...sessions].sort((a, b) => {
    const dateCompare = b.date.localeCompare(a.date);
    if (dateCompare !== 0) return dateCompare;
    return (b.startTime || '').localeCompare(a.startTime || '');
  });

  // Group by date
  for (const session of sorted) {
    const existing = groups.get(session.date) || [];
    existing.push(session);
    groups.set(session.date, existing);
  }

  // Convert to array with labels
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  return Array.from(groups.entries()).map(([date, sessions]) => {
    const d = new Date(date);
    let dateLabel: string;

    if (d.toDateString() === today.toDateString()) {
      dateLabel = 'I dag';
    } else if (d.toDateString() === yesterday.toDateString()) {
      dateLabel = 'I gar';
    } else {
      dateLabel = d.toLocaleDateString('nb-NO', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      });
    }

    return { date, dateLabel, sessions };
  });
}

// =============================================================================
// VIRTUALIZED ROW COMPONENT
// =============================================================================

interface VirtualizedRowData {
  sessions: DagbokSession[];
  onSessionClick?: (session: DagbokSession) => void;
}

const VirtualizedRow: React.FC<{
  index: number;
  style: React.CSSProperties;
  data: VirtualizedRowData;
}> = ({ index, style, data }) => {
  const session = data.sessions[index];

  return (
    <div style={style}>
      <DagbokSessionRow
        session={session}
        onClick={data.onSessionClick}
      />
    </div>
  );
};

// =============================================================================
// COMPONENT
// =============================================================================

export const DagbokSessionList: React.FC<DagbokSessionListProps> = ({
  sessions,
  isLoading = false,
  onSessionClick,
  emptyMessage = 'Ingen treningsøkter funnet for valgt periode',
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Group sessions by date
  const groupedSessions = useMemo(() => groupSessionsByDate(sessions), [sessions]);

  // Loading state
  if (isLoading) {
    return (
      <div className={className} style={styles.container}>
        <div style={styles.scrollContainer}>
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonRow key={i} />
          ))}
        </div>
      </div>
    );
  }

  // Empty state
  if (sessions.length === 0) {
    return (
      <div className={className} style={styles.container}>
        <div style={styles.emptyContainer}>
          <BookOpen style={styles.emptyIcon} />
          <SubSectionTitle style={{ marginBottom: 0 }}>Ingen økter</SubSectionTitle>
          <p style={styles.emptyMessage}>{emptyMessage}</p>
        </div>
      </div>
    );
  }

  // Use virtualization if available and many sessions
  if (FixedSizeList && sessions.length > 50) {
    const itemData: VirtualizedRowData = {
      sessions,
      onSessionClick,
    };

    return (
      <div className={className} style={styles.container} ref={containerRef}>
        <FixedSizeList
          height={600}
          width="100%"
          itemCount={sessions.length}
          itemSize={SESSION_ROW_HEIGHT}
          itemData={itemData}
          overscanCount={OVERSCAN_COUNT}
        >
          {VirtualizedRow}
        </FixedSizeList>
      </div>
    );
  }

  // Regular list with date headers
  return (
    <div className={className} style={styles.container}>
      <div style={styles.scrollContainer}>
        {groupedSessions.map((group) => (
          <div key={group.date}>
            <div style={styles.dateHeader}>
              {group.dateLabel}
            </div>
            {group.sessions.map((session) => (
              <DagbokSessionRow
                key={session.id}
                session={session}
                onClick={onSessionClick}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DagbokSessionList;
