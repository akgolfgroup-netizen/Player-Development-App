import React from 'react';
import { AppShell, PageHeader, CardSimple, CardHeader, StatsGrid } from '../raw-blocks';
import { Button, Text, Avatar, Badge, Divider } from '../primitives';
import { Tabs, Modal } from '../composites';

/**
 * ProfileTemplate
 * User/player profile page template
 */

interface ProfileInfo {
  name: string;
  avatar?: string;
  email?: string;
  phone?: string;
  role?: string;
  bio?: string;
  location?: string;
  joinDate?: string;
  status?: 'active' | 'inactive' | 'away';
}

interface ProfileStat {
  id: string;
  label: string;
  value: string | number;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
}

interface ProfileTab {
  id: string;
  label: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
  badge?: number | string;
}

interface ProfileTemplateProps {
  /** Profile information */
  profile: ProfileInfo;
  /** Profile statistics */
  stats?: ProfileStat[];
  /** Content tabs */
  tabs?: ProfileTab[];
  /** Show edit button */
  editable?: boolean;
  /** Edit handler */
  onEdit?: () => void;
  /** Show settings button */
  showSettings?: boolean;
  /** Settings handler */
  onSettings?: () => void;
  /** Additional actions */
  actions?: React.ReactNode;
  /** Cover image */
  coverImage?: string;
  /** Loading state */
  loading?: boolean;
}

const ProfileTemplate: React.FC<ProfileTemplateProps> = ({
  profile,
  stats = [],
  tabs = [],
  editable = false,
  onEdit,
  showSettings = false,
  onSettings,
  actions,
  coverImage,
  loading = false,
}) => {
  const [imageModalOpen, setImageModalOpen] = React.useState(false);

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
    });
  };

  return (
    <AppShell>
      <div style={styles.container}>
        {/* Cover Image */}
        {coverImage && (
          <div
            style={{
              ...styles.coverImage,
              backgroundImage: `url(${coverImage})`,
            }}
            onClick={() => setImageModalOpen(true)}
            role="button"
            tabIndex={0}
          />
        )}

        {/* Profile Header */}
        <div style={styles.profileHeader}>
          <div style={styles.profileInfo}>
            <div
              style={styles.avatarContainer}
              onClick={() => setImageModalOpen(true)}
              role="button"
              tabIndex={0}
            >
              <Avatar
                src={profile.avatar}
                name={profile.name}
                size="xl"
                status={profile.status}
              />
            </div>

            <div style={styles.profileDetails}>
              <div style={styles.nameSection}>
                <Text variant="title1" weight={700}>
                  {profile.name}
                </Text>
                {profile.role && (
                  <Badge variant="accent" pill>
                    {profile.role}
                  </Badge>
                )}
              </div>

              {profile.bio && (
                <Text variant="body" color="secondary">
                  {profile.bio}
                </Text>
              )}

              <div style={styles.metadata}>
                {profile.email && (
                  <div style={styles.metadataItem}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor">
                      <rect x="2" y="4" width="12" height="9" rx="1" strokeWidth="1.5" />
                      <path d="M2 5l6 4 6-4" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    <Text variant="footnote" color="secondary">
                      {profile.email}
                    </Text>
                  </div>
                )}

                {profile.location && (
                  <div style={styles.metadataItem}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor">
                      <path d="M8 14s-4-3-4-6.5C4 5 5.79 3 8 3s4 2 4 4.5S8 14 8 14z" strokeWidth="1.5" />
                      <circle cx="8" cy="7" r="1.5" strokeWidth="1.5" />
                    </svg>
                    <Text variant="footnote" color="secondary">
                      {profile.location}
                    </Text>
                  </div>
                )}

                {profile.joinDate && (
                  <div style={styles.metadataItem}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor">
                      <rect x="3" y="4" width="10" height="9" rx="1" strokeWidth="1.5" />
                      <path d="M6 2v3M10 2v3M3 7h10" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    <Text variant="footnote" color="secondary">
                      Joined {formatDate(profile.joinDate)}
                    </Text>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div style={styles.profileActions}>
            {editable && onEdit && (
              <Button variant="outline" onClick={onEdit}>
                Edit Profile
              </Button>
            )}
            {showSettings && onSettings && (
              <Button variant="ghost" onClick={onSettings}>
                Settings
              </Button>
            )}
            {actions}
          </div>
        </div>

        {/* Statistics */}
        {stats.length > 0 && (
          <div style={styles.statsSection}>
            <StatsGrid stats={stats} showTrend columns={4} />
          </div>
        )}

        <Divider />

        {/* Content Tabs */}
        {tabs.length > 0 && (
          <div style={styles.tabsSection}>
            <Tabs
              tabs={tabs}
              variant="underline"
              defaultActiveTab={tabs[0]?.id}
            />
          </div>
        )}

        {/* Empty State */}
        {tabs.length === 0 && stats.length === 0 && (
          <CardSimple padding="lg">
            <div style={styles.emptyState}>
              <Text variant="title3" color="secondary">
                No additional information available
              </Text>
            </div>
          </CardSimple>
        )}
      </div>

      {/* Image Modal */}
      <Modal
        isOpen={imageModalOpen}
        onClose={() => setImageModalOpen(false)}
        size="lg"
        showCloseButton
      >
        <div style={styles.imageModalContent}>
          <Avatar
            src={profile.avatar}
            name={profile.name}
            size="xl"
          />
        </div>
      </Modal>
    </AppShell>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-6)',
    width: '100%',
  },
  coverImage: {
    width: '100%',
    height: '240px',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    borderRadius: 'var(--radius-lg)',
    cursor: 'pointer',
    transition: 'transform 0.2s ease',
  },
  profileHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 'var(--spacing-4)',
    backgroundColor: 'var(--background-white)',
    padding: 'var(--spacing-6)',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-card)',
  },
  profileInfo: {
    display: 'flex',
    gap: 'var(--spacing-5)',
    flex: 1,
  },
  avatarContainer: {
    cursor: 'pointer',
    transition: 'transform 0.2s ease',
  },
  profileDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-3)',
    flex: 1,
  },
  nameSection: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-3)',
    flexWrap: 'wrap',
  },
  metadata: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-2)',
  },
  metadataItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-2)',
    color: 'var(--text-secondary)',
  },
  profileActions: {
    display: 'flex',
    gap: 'var(--spacing-2)',
    flexShrink: 0,
  },
  statsSection: {
    width: '100%',
  },
  tabsSection: {
    backgroundColor: 'var(--background-white)',
    borderRadius: 'var(--radius-lg)',
    padding: 'var(--spacing-5)',
    boxShadow: 'var(--shadow-card)',
  },
  emptyState: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 'var(--spacing-10)',
  },
  imageModalContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 'var(--spacing-8)',
  },
};

// Responsive styles
if (typeof window !== 'undefined') {
  const mediaQuery = window.matchMedia('(max-width: 767px)');
  if (mediaQuery.matches) {
    styles.profileHeader = {
      ...styles.profileHeader,
      flexDirection: 'column',
    };
    styles.profileInfo = {
      ...styles.profileInfo,
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
    };
    styles.profileActions = {
      ...styles.profileActions,
      width: '100%',
      flexDirection: 'column',
    };
  }
}

export default ProfileTemplate;
