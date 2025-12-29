/**
 * VideoProgressView Component
 * Main view for tracking video progress over time
 *
 * Features:
 * - Timeline with video thumbnails
 * - Filter by category
 * - Before/after comparison
 * - Trend visualization
 */

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useVideos } from '../../hooks/useVideos';
import { SwingTimeline } from './SwingTimeline';
import PageHeader from '../../ui/raw-blocks/PageHeader.raw';

// Styles
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-4, 16px)',
    padding: 'var(--spacing-4, 16px)',
  },
  header: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 'var(--spacing-4, 16px)',
  },
  headerLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-1, 4px)',
  },
  title: {
    margin: 0,
    fontSize: '24px',
    fontWeight: '700',
    color: 'var(--ak-text-primary, white)',
  },
  subtitle: {
    margin: 0,
    fontSize: '14px',
    color: 'var(--ak-text-secondary, rgba(255, 255, 255, 0.7))',
  },
  filters: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 'var(--spacing-2, 8px)',
  },
  filterButton: {
    padding: '8px 16px',
    backgroundColor: 'var(--ak-surface, var(--ak-toast-bg))',
    border: '1px solid var(--ak-border, rgba(255, 255, 255, 0.1))',
    borderRadius: 'var(--radius-md, 8px)',
    color: 'var(--ak-text-secondary, rgba(255, 255, 255, 0.7))',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  filterButtonActive: {
    backgroundColor: 'var(--ak-primary, var(--ak-brand-primary))',
    borderColor: 'var(--ak-primary, var(--ak-brand-primary))',
    color: 'white',
  },
  statsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: 'var(--spacing-3, 12px)',
  },
  statCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-1, 4px)',
    padding: 'var(--spacing-3, 12px)',
    backgroundColor: 'var(--ak-surface, var(--ak-toast-bg))',
    borderRadius: 'var(--radius-lg, 12px)',
    border: '1px solid var(--ak-border, rgba(255, 255, 255, 0.1))',
    textAlign: 'center',
  },
  statValue: {
    fontSize: '24px',
    fontWeight: '700',
    color: 'var(--ak-text-primary, white)',
  },
  statLabel: {
    fontSize: '11px',
    color: 'var(--ak-text-secondary, rgba(255, 255, 255, 0.7))',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  timelineSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-4, 16px)',
  },
  sectionTitle: {
    margin: 0,
    fontSize: '16px',
    fontWeight: '600',
    color: 'var(--ak-text-primary, white)',
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-2, 8px)',
  },
  sectionBadge: {
    padding: '2px 8px',
    backgroundColor: 'var(--ak-primary-soft, rgba(99, 102, 241, 0.2))',
    color: 'var(--ak-primary, var(--ak-brand-primary))',
    borderRadius: 'var(--radius-full, 9999px)',
    fontSize: '11px',
    fontWeight: '600',
  },
  loadingState: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 'var(--spacing-8, 32px)',
    color: 'var(--ak-text-tertiary, rgba(255, 255, 255, 0.4))',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 'var(--spacing-8, 32px)',
    color: 'var(--ak-text-tertiary, rgba(255, 255, 255, 0.4))',
    textAlign: 'center',
    backgroundColor: 'var(--ak-surface, var(--ak-toast-bg))',
    borderRadius: 'var(--radius-lg, 12px)',
    border: '1px solid var(--ak-border, rgba(255, 255, 255, 0.1))',
  },
  emptyIcon: {
    marginBottom: 'var(--spacing-3, 12px)',
    opacity: 0.5,
  },
  emptyText: {
    fontSize: '14px',
    margin: 0,
  },
  uploadLink: {
    marginTop: 'var(--spacing-3, 12px)',
    padding: '10px 20px',
    backgroundColor: 'var(--ak-primary, var(--ak-brand-primary))',
    color: 'white',
    border: 'none',
    borderRadius: 'var(--radius-md, 8px)',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    textDecoration: 'none',
  },
};

// Category configuration
const CATEGORIES = [
  { id: 'all', label: 'Alle' },
  { id: 'swing', label: 'Full Swing' },
  { id: 'putting', label: 'Putting' },
  { id: 'short_game', label: 'Short Game' },
  { id: 'other', label: 'Annet' },
];

// Icons
const TrendIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

const VideoIcon = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <polygon points="23 7 16 12 23 17 23 7" />
    <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
  </svg>
);

/**
 * VideoProgressView Component
 */
export function VideoProgressView({
  playerId: propsPlayerId,
  style,
  className,
}) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();

  // Determine player ID
  const playerId = propsPlayerId || user?.playerId || user?.id;

  // State
  const [activeCategory, setActiveCategory] = useState(
    searchParams.get('category') || 'all'
  );

  // Fetch videos
  const {
    videos,
    loading,
    error,
    refresh,
  } = useVideos({
    playerId,
    category: activeCategory === 'all' ? undefined : activeCategory,
    sortBy: 'createdAt',
    sortOrder: 'asc',
    autoFetch: true,
  });

  // Update URL params when category changes
  useEffect(() => {
    if (activeCategory === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', activeCategory);
    }
    setSearchParams(searchParams, { replace: true });
  }, [activeCategory, searchParams, setSearchParams]);

  // Group videos by category
  const videosByCategory = useMemo(() => {
    const grouped = {};
    videos.forEach((video) => {
      const cat = video.category || 'other';
      if (!grouped[cat]) {
        grouped[cat] = [];
      }
      grouped[cat].push(video);
    });
    return grouped;
  }, [videos]);

  // Stats
  const stats = useMemo(() => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    return {
      total: videos.length,
      thisWeek: videos.filter((v) => new Date(v.createdAt) >= oneWeekAgo).length,
      thisMonth: videos.filter((v) => new Date(v.createdAt) >= oneMonthAgo).length,
      categories: Object.keys(videosByCategory).length,
    };
  }, [videos, videosByCategory]);

  // Handle category filter
  const handleCategoryChange = useCallback((categoryId) => {
    setActiveCategory(categoryId);
  }, []);

  // Handle compare
  const handleCompare = useCallback((video1, video2) => {
    navigate(`/videos/compare?left=${video1.id}&right=${video2.id}`);
  }, [navigate]);

  // Render loading state
  if (loading) {
    return (
      <div className={className} style={{ ...styles.container, ...style }}>
        <div style={styles.loadingState}>
          Laster videoer...
        </div>
      </div>
    );
  }

  // Render empty state
  if (videos.length === 0 && !loading) {
    return (
      <div className={className} style={{ ...styles.container, ...style }}>
        <PageHeader
          title="Videofremgang"
          subtitle="Spor din utvikling over tid"
          divider={false}
        />

        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>
            <VideoIcon />
          </div>
          <p style={styles.emptyText}>
            Du har ikke lastet opp noen videoer ennå.
            <br />
            Last opp din forste video for a begynne a spore fremgangen.
          </p>
          <button
            style={styles.uploadLink}
            onClick={() => navigate('/videos')}
          >
            Ga til videobibliotek
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={className} style={{ ...styles.container, ...style }}>
      {/* Header */}
      <PageHeader
        title="Videofremgang"
        subtitle="Spor din utvikling over tid og sammenlign videoer"
        divider={false}
      />

      {/* Category filters */}
      <div style={styles.filters}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            style={{
              ...styles.filterButton,
              ...(activeCategory === cat.id ? styles.filterButtonActive : {}),
            }}
            onClick={() => handleCategoryChange(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div style={styles.statsRow}>
        <div style={styles.statCard}>
          <span style={styles.statValue}>{stats.total}</span>
          <span style={styles.statLabel}>Totalt</span>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statValue}>{stats.thisWeek}</span>
          <span style={styles.statLabel}>Denne uken</span>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statValue}>{stats.thisMonth}</span>
          <span style={styles.statLabel}>Denne maneden</span>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statValue}>{stats.categories}</span>
          <span style={styles.statLabel}>Kategorier</span>
        </div>
      </div>

      {/* Timelines by category */}
      <div style={styles.timelineSection}>
        {activeCategory === 'all' ? (
          // Show all categories
          Object.entries(videosByCategory).map(([category, categoryVideos]) => (
            <div key={category}>
              <SwingTimeline
                videos={categoryVideos}
                title={CATEGORIES.find((c) => c.id === category)?.label || category}
                onCompare={handleCompare}
                selectable
              />
            </div>
          ))
        ) : (
          // Show single category
          <SwingTimeline
            videos={videos}
            title={CATEGORIES.find((c) => c.id === activeCategory)?.label || 'Videoer'}
            onCompare={handleCompare}
            selectable
          />
        )}
      </div>
    </div>
  );
}

export default VideoProgressView;
