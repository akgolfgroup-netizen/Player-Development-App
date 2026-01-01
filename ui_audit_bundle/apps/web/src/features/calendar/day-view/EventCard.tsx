/**
 * Event Card Component
 *
 * Visual styling based on event intent (from spec):
 * 1. Recommended AK Golf workout - Primary brand styling, dominant
 * 2. Planned (not recommended) - Elevated surface, neutral
 * 3. Ghost slot - Dashed border, reduced opacity
 * 4. In progress - Success styling with play icon
 * 5. Completed - Muted surface with check icon
 * 6. External events - Neutral, never competes with recommended
 *
 * Badge priority: Pågår > Anbefalt > Fullført > Planlagt > Foreslått
 */

import React from 'react';
import { Play, Check, Clock, MapPin, Calendar } from 'lucide-react';
import { EventCardProps, WorkoutCategory } from './types';

// Category color mapping using semantic tokens
const getCategoryStyles = (category: WorkoutCategory) => {
  const categoryMap: Record<WorkoutCategory, { background: string; border: string; text: string }> = {
    teknikk: {
      background: 'var(--category-tek-muted)',
      border: 'var(--category-tek)',
      text: 'var(--category-tek)',
    },
    golfslag: {
      background: 'var(--category-slag-muted)',
      border: 'var(--category-slag)',
      text: 'var(--category-slag)',
    },
    spill: {
      background: 'var(--category-spill-muted)',
      border: 'var(--category-spill)',
      text: 'var(--category-spill)',
    },
    konkurranse: {
      background: 'var(--category-turn-muted)',
      border: 'var(--category-turn)',
      text: 'var(--category-turn)',
    },
    fysisk: {
      background: 'var(--category-fys-muted)',
      border: 'var(--category-fys)',
      text: 'var(--category-fys)',
    },
    mental: {
      background: 'var(--bg-neutral-subtle)',
      border: 'var(--text-tertiary)',
      text: 'var(--text-secondary)',
    },
  };

  return categoryMap[category] || categoryMap.mental;
};

// Semantic styles (NO raw hex values)
const styles = {
  card: {
    height: '100%',
    borderRadius: 'var(--radius-md)',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'box-shadow 0.15s ease, transform 0.15s ease',
    display: 'flex',
    flexDirection: 'column' as const,
  },
  cardHover: {
    boxShadow: 'var(--shadow-elevated)',
    transform: 'translateY(-1px)',
  },
  cardRecommended: {
    backgroundColor: 'var(--accent-muted)',
    borderLeft: '4px solid var(--accent)',
  },
  cardPlanned: {
    backgroundColor: 'var(--background-elevated)',
    borderLeft: '4px solid var(--border-strong)',
  },
  cardInProgress: {
    backgroundColor: 'var(--success-muted)',
    borderLeft: '4px solid var(--success)',
  },
  cardCompleted: {
    backgroundColor: 'var(--background-elevated)',
    borderLeft: '4px solid var(--success)',
    opacity: 0.7,
  },
  cardExternal: {
    backgroundColor: 'var(--background-surface)',
    borderLeft: '4px solid var(--border-default)',
  },
  cardGhost: {
    backgroundColor: 'transparent',
    border: '2px dashed var(--border-brand)',
    borderLeft: '2px dashed var(--border-brand)',
    opacity: 0.6,
  },
  content: {
    flex: 1,
    padding: 'var(--spacing-3)',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 'var(--spacing-1)',
    minWidth: 0,
  },
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 'var(--spacing-2)',
  },
  title: {
    fontSize: 'var(--font-size-footnote)',
    fontWeight: 600,
    color: 'var(--text-primary)',
    lineHeight: 1.3,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
  },
  titleExternal: {
    color: 'var(--text-secondary)',
    fontWeight: 500,
  },
  meta: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-2)',
    fontSize: 'var(--font-size-caption1)',
    color: 'var(--text-tertiary)',
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '2px',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '2px',
    padding: '2px 6px',
    borderRadius: 'var(--radius-full)',
    fontSize: '10px',
    fontWeight: 600,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.3px',
    whiteSpace: 'nowrap' as const,
  },
  badgeRecommended: {
    backgroundColor: 'var(--accent)',
    color: 'var(--text-inverse)',
  },
  badgeInProgress: {
    backgroundColor: 'var(--success)',
    color: 'var(--text-inverse)',
  },
  badgeCompleted: {
    backgroundColor: 'var(--success-muted)',
    color: 'var(--success)',
  },
  badgePlanned: {
    backgroundColor: 'var(--background-muted)',
    color: 'var(--text-secondary)',
  },
  badgeGhost: {
    backgroundColor: 'var(--accent-muted)',
    color: 'var(--text-brand)',
    border: '1px dashed var(--border-brand)',
  },
  actionButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '28px',
    height: '28px',
    borderRadius: 'var(--radius-full)',
    backgroundColor: 'var(--accent)',
    color: 'var(--text-inverse)',
    border: 'none',
    cursor: 'pointer',
    flexShrink: 0,
    transition: 'background-color 0.15s ease',
  },
  actionButtonHover: {
    backgroundColor: 'var(--accent-hover)',
  },
  completedIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '24px',
    height: '24px',
    borderRadius: 'var(--radius-full)',
    backgroundColor: 'var(--success)',
    color: 'var(--text-inverse)',
    flexShrink: 0,
  },
  location: {
    display: 'flex',
    alignItems: 'center',
    gap: '2px',
    fontSize: 'var(--font-size-caption2)',
    color: 'var(--text-tertiary)',
    marginTop: 'auto',
  },
};

// Format duration
const formatDuration = (minutes: number): string => {
  if (minutes >= 60) {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hrs}t ${mins}m` : `${hrs}t`;
  }
  return `${minutes}m`;
};

export const EventCard: React.FC<EventCardProps> = ({ event, isGhost = false, onClick, onStart }) => {
  const isAKWorkout = event.type === 'ak_workout' && event.workout;
  const workout = event.workout;
  const external = event.external;

  // Determine card style based on type and status
  const getCardStyle = () => {
    if (isGhost) return { ...styles.card, ...styles.cardGhost };
    if (!isAKWorkout) return { ...styles.card, ...styles.cardExternal };

    switch (workout?.status) {
      case 'in_progress':
        return { ...styles.card, ...styles.cardInProgress };
      case 'completed':
        return { ...styles.card, ...styles.cardCompleted };
      default:
        if (workout?.isRecommended) {
          return { ...styles.card, ...styles.cardRecommended };
        }
        return { ...styles.card, ...styles.cardPlanned };
    }
  };

  // Determine badge to show (priority order)
  const getBadge = () => {
    if (!isAKWorkout) return null;

    if (workout?.status === 'in_progress') {
      return (
        <span style={{ ...styles.badge, ...styles.badgeInProgress }}>
          <Play size={8} />
          Pågår
        </span>
      );
    }

    if (workout?.status === 'completed') {
      return (
        <span style={{ ...styles.badge, ...styles.badgeCompleted }}>
          <Check size={8} />
          Fullført
        </span>
      );
    }

    if (isGhost) {
      return (
        <span style={{ ...styles.badge, ...styles.badgeGhost }}>
          Foreslått
        </span>
      );
    }

    if (workout?.isRecommended) {
      return (
        <span style={{ ...styles.badge, ...styles.badgeRecommended }}>
          Anbefalt
        </span>
      );
    }

    return (
      <span style={{ ...styles.badge, ...styles.badgePlanned }}>
        Planlagt
      </span>
    );
  };

  // Render AK Golf workout
  if (isAKWorkout && workout) {
    return (
      <div
        style={getCardStyle()}
        onClick={onClick}
        onMouseEnter={(e) => {
          if (!isGhost) {
            e.currentTarget.style.boxShadow = 'var(--shadow-elevated)';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = 'none';
          e.currentTarget.style.transform = 'none';
        }}
      >
        <div style={styles.content}>
          <div style={styles.header}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={styles.title}>{workout.name}</div>
              <div style={styles.meta}>
                {workout.scheduledTime && (
                  <span style={styles.metaItem}>
                    <Clock size={10} />
                    {workout.scheduledTime}
                  </span>
                )}
                <span style={styles.metaItem}>{formatDuration(workout.duration)}</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
              {getBadge()}
              {workout.status === 'completed' && (
                <div style={styles.completedIcon}>
                  <Check size={14} />
                </div>
              )}
              {workout.status !== 'completed' && workout.status !== 'in_progress' && onStart && (
                <button
                  style={styles.actionButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    onStart();
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--accent-hover)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--accent)';
                  }}
                >
                  <Play size={14} style={{ marginLeft: '2px' }} />
                </button>
              )}
            </div>
          </div>
          {workout.location && (
            <div style={styles.location}>
              <MapPin size={10} />
              {workout.location}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Render external event
  if (external) {
    return (
      <div
        style={{ ...styles.card, ...styles.cardExternal }}
        onClick={onClick}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = 'var(--shadow-card)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        <div style={styles.content}>
          <div style={{ ...styles.title, ...styles.titleExternal }}>{external.title}</div>
          <div style={styles.meta}>
            <span style={styles.metaItem}>
              <Clock size={10} />
              {external.startTime} - {external.endTime}
            </span>
            {external.source && (
              <span style={styles.metaItem}>
                <Calendar size={10} />
                {external.source}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default EventCard;
