import React from 'react';
import Card from '../../../../ui/primitives/Card';

/**
 * ActivityFeed
 *
 * Chronological list of recent activities, notifications, and updates.
 * Designed for quick scanning with clear visual hierarchy.
 *
 * Design principles:
 * - Timestamp is secondary (right-aligned)
 * - Activity type indicated by subtle icon/indicator
 * - Unread items have visual distinction
 * - Touch targets are 44px minimum
 */

type ActivityType =
  | 'session_completed'
  | 'badge_earned'
  | 'goal_achieved'
  | 'coach_message'
  | 'test_result'
  | 'streak_update'
  | 'system';

interface ActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  description?: string;
  timestamp: Date | string;
  isUnread?: boolean;
  /** Link to related content */
  href?: string;
  /** For badge_earned type - is this a gold/premium achievement? */
  isGoldAchievement?: boolean;
}

interface ActivityFeedProps {
  /** Card title */
  title?: string;
  /** List of activity items */
  activities: ActivityItem[];
  /** Maximum items to show */
  maxItems?: number;
  /** Empty state message */
  emptyMessage?: string;
  /** Click handler for activity item */
  onActivityClick?: (activity: ActivityItem) => void;
  /** View all action */
  onViewAll?: () => void;
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({
  title = 'Aktivitet',
  activities,
  maxItems = 5,
  emptyMessage = 'Ingen ny aktivitet',
  onActivityClick,
  onViewAll,
}) => {
  const displayActivities = activities.slice(0, maxItems);
  const hasMore = activities.length > maxItems;

  // Format relative timestamp
  const formatTimestamp = (timestamp: Date | string): string => {
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Nå';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}t`;
    if (diffDays < 7) return `${diffDays}d`;
    return date.toLocaleDateString('nb-NO', { day: 'numeric', month: 'short' });
  };

  // Get type indicator color
  const getTypeIndicator = (type: ActivityType, isGold?: boolean): React.CSSProperties => {
    // Special handling for gold achievements (only case where gold is allowed)
    if (type === 'badge_earned' && isGold) {
      return { backgroundColor: 'var(--ak-gold)' };
    }

    const colors: Record<ActivityType, string> = {
      session_completed: 'var(--ak-success)',
      badge_earned: 'var(--ak-primary)',
      goal_achieved: 'var(--ak-success)',
      coach_message: 'var(--ak-info)',
      test_result: 'var(--ak-primary)',
      streak_update: 'var(--ak-warning)',
      system: 'var(--gray-400)',
    };

    return { backgroundColor: colors[type] };
  };

  return (
    <Card variant="default" padding="none">
      {/* Header */}
      <div style={styles.header}>
        <h3 style={styles.title}>{title}</h3>
        {onViewAll && hasMore && (
          <button style={styles.viewAllButton} onClick={onViewAll}>
            Se alt
          </button>
        )}
      </div>

      {/* Activities list */}
      <div style={styles.activitiesList}>
        {displayActivities.length === 0 ? (
          <div style={styles.emptyState}>
            <p style={styles.emptyText}>{emptyMessage}</p>
          </div>
        ) : (
          displayActivities.map((activity, index) => (
            <div
              key={activity.id}
              style={{
                ...styles.activityItem,
                ...(activity.isUnread ? styles.unreadItem : {}),
                borderBottom:
                  index < displayActivities.length - 1
                    ? '1px solid var(--border-subtle)'
                    : 'none',
              }}
              onClick={() => onActivityClick?.(activity)}
              role={onActivityClick ? 'button' : undefined}
              tabIndex={onActivityClick ? 0 : undefined}
            >
              {/* Type indicator */}
              <div
                style={{
                  ...styles.typeIndicator,
                  ...getTypeIndicator(activity.type, activity.isGoldAchievement),
                }}
              />

              {/* Content */}
              <div style={styles.content}>
                <p style={styles.activityTitle}>{activity.title}</p>
                {activity.description && (
                  <p style={styles.activityDescription}>{activity.description}</p>
                )}
              </div>

              {/* Timestamp */}
              <span style={styles.timestamp}>
                {formatTimestamp(activity.timestamp)}
              </span>

              {/* Unread indicator */}
              {activity.isUnread && <div style={styles.unreadDot} />}
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
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 'var(--spacing-4)',
    borderBottom: '1px solid var(--border-subtle)',
  },
  title: {
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
  },
  activitiesList: {
    padding: 0,
  },
  activityItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 'var(--spacing-3)',
    padding: 'var(--spacing-4)',
    cursor: 'pointer',
    transition: 'background-color 0.15s ease',
    position: 'relative',
    minHeight: '56px',
  },
  unreadItem: {
    backgroundColor: 'var(--accent-muted)',
  },
  typeIndicator: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    flexShrink: 0,
    marginTop: '6px',
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  activityTitle: {
    fontSize: 'var(--font-size-subheadline)',
    lineHeight: 'var(--line-height-subheadline)',
    fontWeight: 500,
    color: 'var(--text-primary)',
    margin: 0,
  },
  activityDescription: {
    fontSize: 'var(--font-size-caption1)',
    lineHeight: 'var(--line-height-caption1)',
    color: 'var(--text-secondary)',
    margin: '2px 0 0 0',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
  },
  timestamp: {
    fontSize: 'var(--font-size-caption1)',
    lineHeight: 'var(--line-height-caption1)',
    color: 'var(--text-tertiary)',
    flexShrink: 0,
    fontVariantNumeric: 'tabular-nums',
  },
  unreadDot: {
    position: 'absolute',
    top: 'var(--spacing-4)',
    right: 'var(--spacing-2)',
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: 'var(--ak-primary)',
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

export default ActivityFeed;
