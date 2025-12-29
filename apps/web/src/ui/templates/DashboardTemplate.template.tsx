import React from 'react';
import { AppShell, PageHeader, CardSimple, CardHeader } from '../raw-blocks';
import { Button, Text, Avatar } from '../primitives';
import { Tabs } from '../composites';

/**
 * DashboardTemplate
 * Complete dashboard page layout with stats, charts, and activity feed
 */

interface DashboardStat {
  id: string;
  label: string;
  value: string | number;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
}

interface ActivityItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type?: 'success' | 'info' | 'warning' | 'error';
  avatar?: string;
  userName?: string;
}

interface DashboardTab {
  id: string;
  label: string;
  content: React.ReactNode;
  badge?: number | string;
}

interface DashboardTemplateProps {
  /** Page title */
  title: string;
  /** Page subtitle */
  subtitle?: string;
  /** User info for header */
  user?: {
    name: string;
    avatar?: string;
    role?: string;
  };
  /** Statistics to display */
  stats: DashboardStat[];
  /** Recent activity items */
  activities?: ActivityItem[];
  /** Main content tabs */
  tabs?: DashboardTab[];
  /** Quick actions */
  actions?: React.ReactNode;
  /** Welcome message */
  welcomeMessage?: string;
  /** Show activity feed */
  showActivity?: boolean;
  /** Loading state */
  loading?: boolean;
}

const DashboardTemplate: React.FC<DashboardTemplateProps> = ({
  title,
  subtitle,
  user,
  stats,
  activities = [],
  tabs,
  actions,
  welcomeMessage,
  showActivity = true,
  loading = false,
}) => {
  const getActivityIcon = (type?: string) => {
    switch (type) {
      case 'success':
        return '✓';
      case 'warning':
        return '⚠';
      case 'error':
        return '✕';
      default:
        return 'ℹ';
    }
  };

  const getActivityColor = (type?: string) => {
    switch (type) {
      case 'success':
        return 'var(--success)';
      case 'warning':
        return 'var(--warning)';
      case 'error':
        return 'var(--error)';
      default:
        return 'var(--accent)';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <AppShell
      header={
        <PageHeader
          title={title}
          subtitle={subtitle}
          actions={actions}
        />
      }
    >
      <div style={styles.container}>
        {/* Welcome Section */}
        {(welcomeMessage || user) && (
          <div style={styles.welcomeCard}>
            <div style={styles.welcomeSection}>
              {user && (
                <div style={styles.welcomeMain}>
                  <div style={styles.userInfo}>
                    <Avatar
                      src={user.avatar}
                      name={user.name}
                      size="lg"
                      status="online"
                    />
                    <div style={styles.userDetails}>
                      <Text variant="caption1" color="tertiary">
                        Welcome back,
                      </Text>
                      <Text variant="title2" weight={700}>
                        {user.name}
                      </Text>
                      {user.role && (
                        <Text variant="caption1" color="tertiary">
                          {user.role}
                        </Text>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => window.location.href = '/profile'}
                  >
                    View profile
                  </Button>
                </div>
              )}
              {welcomeMessage && (
                <Text variant="body" color="secondary">
                  {welcomeMessage}
                </Text>
              )}
            </div>
            {/* Profile Stats Row */}
            <div style={styles.profileStats}>
              {stats.slice(0, 3).map((stat, idx) => (
                <div
                  key={stat.id}
                  style={{
                    ...styles.profileStatItem,
                    borderLeft: idx > 0 ? '1px solid var(--border-default)' : 'none',
                  }}
                >
                  <span style={styles.profileStatValue}>{stat.value}</span>
                  <span style={styles.profileStatLabel}>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div style={styles.mainContent}>
          {/* Left Column - Main Content */}
          <div style={styles.contentColumn}>
            {tabs ? (
              <Tabs
                tabs={tabs}
                variant="underline"
                defaultActiveTab={tabs[0]?.id}
              />
            ) : (
              <CardSimple padding="lg">
                <Text color="secondary">
                  No content configured. Add tabs to display data.
                </Text>
              </CardSimple>
            )}
          </div>

          {/* Right Column - Activity Feed */}
          {showActivity && activities.length > 0 && (
            <div style={styles.activityColumn}>
              <CardSimple padding="none">
                <CardHeader
                  title="Recent Activity"
                  subtitle={`${activities.length} updates`}
                  size="sm"
                />

                <div style={styles.activityList}>
                  {activities.slice(0, 10).map((activity) => (
                    <div key={activity.id} style={styles.activityItem}>
                      <div
                        style={{
                          ...styles.activityIcon,
                          backgroundColor: getActivityColor(activity.type),
                        }}
                      >
                        {getActivityIcon(activity.type)}
                      </div>

                      <div style={styles.activityContent}>
                        <Text variant="footnote" weight={600}>
                          {activity.title}
                        </Text>
                        <Text variant="caption1" color="secondary">
                          {activity.description}
                        </Text>
                        <Text variant="caption2" color="tertiary">
                          {formatTimestamp(activity.timestamp)}
                        </Text>
                      </div>

                      {activity.userName && (
                        <Avatar
                          name={activity.userName}
                          src={activity.avatar}
                          size="xs"
                        />
                      )}
                    </div>
                  ))}
                </div>

                {activities.length > 10 && (
                  <div style={styles.activityFooter}>
                    <Button variant="ghost" size="sm" fullWidth>
                      View All Activity
                    </Button>
                  </div>
                )}
              </CardSimple>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-6)',
    maxWidth: '1400px',
    margin: '0 auto',
    width: '100%',
  },
  welcomeCard: {
    backgroundColor: 'var(--card)',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-card)',
    overflow: 'hidden',
  },
  welcomeSection: {
    padding: 'var(--spacing-6)',
  },
  welcomeMain: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 'var(--spacing-4)',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-4)',
  },
  userDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  profileStats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    backgroundColor: 'var(--bg-elevated)',
    borderTop: '1px solid var(--border-default)',
  },
  profileStatItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 'var(--spacing-5) var(--spacing-6)',
    textAlign: 'center',
  },
  profileStatValue: {
    fontSize: '18px',
    fontWeight: 600,
    color: 'var(--text-primary)',
  },
  profileStatLabel: {
    fontSize: '13px',
    color: 'var(--text-tertiary)',
    marginTop: '2px',
  },
  section: {
    width: '100%',
  },
  loadingState: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 'var(--spacing-10)',
    backgroundColor: 'var(--background-white)',
    borderRadius: 'var(--radius-md)',
  },
  mainContent: {
    display: 'grid',
    gridTemplateColumns: '1fr 350px',
    gap: 'var(--spacing-6)',
  },
  contentColumn: {
    minWidth: 0,
  },
  activityColumn: {
    display: 'flex',
    flexDirection: 'column',
  },
  activityList: {
    display: 'flex',
    flexDirection: 'column',
    maxHeight: '600px',
    overflowY: 'auto',
  },
  activityItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 'var(--spacing-3)',
    padding: 'var(--spacing-4)',
    borderBottom: '1px solid var(--border-subtle)',
    transition: 'background-color 0.15s ease',
  },
  activityIcon: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '14px',
    flexShrink: 0,
  },
  activityContent: {
    flex: 1,
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  activityFooter: {
    padding: 'var(--spacing-3)',
    borderTop: '1px solid var(--border-subtle)',
  },
};

// Responsive styles
if (typeof window !== 'undefined') {
  const mediaQuery = window.matchMedia('(max-width: 1023px)');
  if (mediaQuery.matches) {
    styles.mainContent = {
      ...styles.mainContent,
      gridTemplateColumns: '1fr',
    };
  }
}

export default DashboardTemplate;
