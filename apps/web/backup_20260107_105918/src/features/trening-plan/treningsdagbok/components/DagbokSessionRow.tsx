/**
 * DagbokSessionRow
 *
 * Table-like row for displaying a single training session.
 * Shows pyramid badge, title, duration, planned/free status, and drill summary.
 */

import React from 'react';
import {
  Clock, ChevronRight, CheckCircle, Circle, Activity,
  Dumbbell, Settings, Target, Flag, Trophy,
  type LucideIcon
} from 'lucide-react';

import type { DagbokSession, DagbokSessionRowProps, Pyramid } from '../types';
import { PYRAMIDS, PYRAMID_COLORS } from '../constants';
import { InfoTooltip } from '../../../../components/InfoTooltip';

// Icon mapping for pyramid types
const PYRAMID_ICON_MAP: Record<string, LucideIcon> = {
  'Dumbbell': Dumbbell,
  'Settings': Settings,
  'Target': Target,
  'Flag': Flag,
  'Trophy': Trophy,
};

// =============================================================================
// STYLES
// =============================================================================

const styles = {
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    backgroundColor: 'var(--card-background)',
    borderBottom: '1px solid var(--border-subtle)',
    cursor: 'pointer',
    transition: 'background-color 150ms ease',
  },
  rowHover: {
    backgroundColor: 'var(--hover-bg)',
  },
  pyramidBadge: (pyramid: Pyramid) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    borderRadius: 'var(--radius-sm)',
    backgroundColor: PYRAMID_COLORS[pyramid].bg,
    color: PYRAMID_COLORS[pyramid].text,
    flexShrink: 0,
  }),
  pyramidIcon: {
    fontSize: '18px',
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '4px',
  },
  title: {
    fontSize: '14px',
    fontWeight: 600,
    color: 'var(--text-primary)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
  },
  planBadge: (isPlanned: boolean) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '3px',
    padding: '2px 6px',
    fontSize: '10px',
    fontWeight: 600,
    borderRadius: 'var(--radius-xs)',
    backgroundColor: isPlanned
      ? 'color-mix(in srgb, var(--accent) 15%, transparent)'
      : 'color-mix(in srgb, var(--text-tertiary) 15%, transparent)',
    color: isPlanned ? 'var(--accent)' : 'var(--text-tertiary)',
  }),
  meta: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '12px',
    color: 'var(--text-secondary)',
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  stats: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    flexShrink: 0,
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'flex-end',
    minWidth: '60px',
  },
  statValue: {
    fontSize: '14px',
    fontWeight: 600,
    color: 'var(--text-primary)',
    fontVariantNumeric: 'tabular-nums',
  },
  statLabel: {
    fontSize: '10px',
    color: 'var(--text-tertiary)',
    textTransform: 'uppercase' as const,
  },
  chevron: {
    color: 'var(--text-tertiary)',
    flexShrink: 0,
  },
  drillsSummary: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '11px',
    color: 'var(--text-tertiary)',
    marginTop: '4px',
  },
  drillDot: {
    width: '4px',
    height: '4px',
    borderRadius: '50%',
    backgroundColor: 'var(--accent)',
  },
};

// =============================================================================
// HELPERS
// =============================================================================

function formatTime(time?: string): string {
  if (!time) return '';
  return time.slice(0, 5);
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return 'I dag';
  if (date.toDateString() === yesterday.toDateString()) return 'I gar';

  return date.toLocaleDateString('nb-NO', { weekday: 'short', day: 'numeric', month: 'short' });
}

// =============================================================================
// COMPONENT
// =============================================================================

export const DagbokSessionRow: React.FC<DagbokSessionRowProps> = ({
  session,
  onClick,
  isExpanded = false,
  className = '',
}) => {
  const [isHovered, setIsHovered] = React.useState(false);

  const pyramidConfig = PYRAMIDS[session.pyramid];
  const IconComponent = PYRAMID_ICON_MAP[pyramidConfig.icon];

  return (
    <div
      className={className}
      style={{
        ...styles.row,
        ...(isHovered ? styles.rowHover : {}),
      }}
      onClick={() => onClick?.(session)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="button"
      tabIndex={0}
    >
      {/* Pyramid badge with tooltip */}
      <div className="flex items-center gap-1">
        <div style={styles.pyramidBadge(session.pyramid)}>
          {IconComponent && <IconComponent size={20} />}
        </div>
        <InfoTooltip
          content={`${pyramidConfig.label}: ${pyramidConfig.description}`}
          side="right"
          size={12}
        />
      </div>

      {/* Content */}
      <div style={styles.content}>
        <div style={styles.header}>
          <span style={styles.title}>{session.title}</span>
          <div className="flex items-center gap-1">
            <span style={styles.planBadge(session.isPlanned)}>
              {session.isPlanned ? (
                <>
                  <CheckCircle size={10} />
                  Planlagt
                </>
              ) : (
                <>
                  <Circle size={10} />
                  Fri
                </>
              )}
            </span>
            <InfoTooltip
              content={
                session.isPlanned
                  ? 'Økten er planlagt i henhold til treningsplanen'
                  : 'Fri økt som ikke er del av planen'
              }
              side="top"
              size={10}
            />
          </div>
        </div>

        <div style={styles.meta}>
          <span style={styles.metaItem}>
            {formatDate(session.date)}
            {session.startTime && (
              <>, {formatTime(session.startTime)}</>
            )}
          </span>
          <span style={styles.metaItem}>
            <Clock size={12} />
            {session.duration} min
          </span>
          {session.formula && (
            <span style={styles.metaItem}>
              {session.formula}
            </span>
          )}
        </div>

        {/* Drills summary */}
        {session.drills.length > 0 && (
          <div style={styles.drillsSummary}>
            <Activity size={10} />
            {session.drills.length} ovelser
            {session.totalReps > 0 && (
              <> | {session.totalReps} reps</>
            )}
          </div>
        )}
      </div>

      {/* Stats - Only show Reps and Duration */}
      <div style={styles.stats}>
        {session.totalReps > 0 && (
          <div className="flex items-center gap-1">
            <div style={styles.statItem}>
              <span style={styles.statValue}>{session.totalReps}</span>
              <span style={styles.statLabel}>Reps</span>
            </div>
            <InfoTooltip
              content="Totalt antall repetisjoner i økten"
              side="left"
              size={12}
            />
          </div>
        )}
        <div className="flex items-center gap-1">
          <div style={styles.statItem}>
            <span style={styles.statValue}>{session.duration}</span>
            <span style={styles.statLabel}>Min</span>
          </div>
          <InfoTooltip
            content="Øktens varighet i minutter"
            side="left"
            size={12}
          />
        </div>
      </div>

      {/* Chevron */}
      <ChevronRight size={18} style={styles.chevron} />
    </div>
  );
};

export default DagbokSessionRow;
