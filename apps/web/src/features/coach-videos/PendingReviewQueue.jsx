/**
 * PendingReviewQueue Component
 * Compact queue of videos awaiting coach review
 *
 * Features:
 * - Horizontal scrollable queue
 * - Quick preview thumbnails
 * - Player name and upload time
 * - Priority indicators
 * - Quick action to start review
 */

import React, { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { REVIEW_STATUS } from './PlayerVideoFeed';
import { track } from '../../analytics/track';

// Styles
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-3, 12px)',
    padding: 'var(--spacing-4, 16px)',
    backgroundColor: 'var(--ak-surface, var(--ak-toast-bg))',
    borderRadius: 'var(--radius-lg, 12px)',
    border: '1px solid var(--ak-border, rgba(255, 255, 255, 0.1))',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 'var(--spacing-3, 12px)',
  },
  title: {
    margin: 0,
    fontSize: '16px',
    fontWeight: '600',
    color: 'var(--ak-text-primary, white)',
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-2, 8px)',
  },
  badge: {
    padding: '2px 8px',
    backgroundColor: 'var(--ak-warning, var(--ak-status-warning-light))',
    borderRadius: 'var(--radius-full, 9999px)',
    fontSize: '12px',
    fontWeight: '700',
    color: 'white',
  },
  viewAllButton: {
    padding: '6px 12px',
    backgroundColor: 'transparent',
    border: '1px solid var(--ak-border, rgba(255, 255, 255, 0.2))',
    borderRadius: 'var(--radius-md, 8px)',
    color: 'var(--ak-text-secondary, rgba(255, 255, 255, 0.7))',
    fontSize: '12px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  scrollContainer: {
    display: 'flex',
    gap: 'var(--spacing-3, 12px)',
    overflowX: 'auto',
    paddingBottom: 'var(--spacing-2, 8px)',
    scrollbarWidth: 'thin',
    scrollbarColor: 'var(--ak-border) transparent',
  },
  queueItem: {
    flex: '0 0 auto',
    width: '140px',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-2, 8px)',
    cursor: 'pointer',
    transition: 'transform 0.15s ease',
  },
  queueItemHover: {
    transform: 'translateY(-2px)',
  },
  thumbnailContainer: {
    position: 'relative',
    width: '140px',
    height: '80px',
    borderRadius: 'var(--radius-md, 8px)',
    overflow: 'hidden',
    backgroundColor: 'var(--ak-surface-dark, var(--ak-surface-dark-elevated))',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  thumbnailPlaceholder: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--ak-text-tertiary, rgba(255, 255, 255, 0.3))',
  },
  playOverlay: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    opacity: 0,
    transition: 'opacity 0.15s ease',
  },
  playOverlayVisible: {
    opacity: 1,
  },
  playButton: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: 'var(--ak-primary, var(--ak-brand-primary))',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
  },
  duration: {
    position: 'absolute',
    bottom: '4px',
    right: '4px',
    padding: '2px 4px',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 'var(--radius-sm, 4px)',
    fontSize: '10px',
    fontFamily: 'var(--font-mono, monospace)',
    color: 'white',
  },
  priorityBadge: {
    position: 'absolute',
    top: '4px',
    left: '4px',
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    border: '2px solid white',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
  },
  itemInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  playerName: {
    fontSize: '12px',
    fontWeight: '500',
    color: 'var(--ak-text-primary, white)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  uploadTime: {
    fontSize: '11px',
    color: 'var(--ak-text-tertiary, rgba(255, 255, 255, 0.5))',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 'var(--spacing-6, 24px)',
    textAlign: 'center',
  },
  emptyIcon: {
    width: '40px',
    height: '40px',
    color: 'var(--ak-success, var(--ak-status-success-light))',
    marginBottom: 'var(--spacing-2, 8px)',
  },
  emptyText: {
    fontSize: '13px',
    color: 'var(--ak-text-secondary, rgba(255, 255, 255, 0.7))',
    margin: 0,
  },
  scrollButton: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: 'var(--ak-surface, var(--ak-toast-bg))',
    border: '1px solid var(--ak-border, rgba(255, 255, 255, 0.2))',
    color: 'var(--ak-text-primary, white)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
  },
  scrollLeft: {
    left: '-16px',
  },
  scrollRight: {
    right: '-16px',
  },
  scrollWrapper: {
    position: 'relative',
  },
};

// Icons
const VideoIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
  </svg>
);

const PlayIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5v14l11-7z" />
  </svg>
);

const CheckCircleIcon = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const ChevronLeftIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const ChevronRightIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const ClockIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

/**
 * Format duration as MM:SS
 */
function formatDuration(seconds) {
  if (!seconds) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Format relative time
 */
function formatRelativeTime(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}t`;
  return `${Math.floor(diffHours / 24)}d`;
}

/**
 * Get priority color based on wait time
 */
function getPriorityColor(dateString) {
  if (!dateString) return 'var(--ak-status-success-light)';
  const date = new Date(dateString);
  const now = new Date();
  const diffHours = (now - date) / (1000 * 60 * 60);

  if (diffHours > 48) return 'var(--ak-status-error-light)'; // Red - urgent
  if (diffHours > 24) return 'var(--ak-status-warning-light)'; // Yellow - attention
  return 'var(--ak-status-success-light)'; // Green - ok
}

/**
 * PendingReviewQueue Component
 */
export function PendingReviewQueue({
  videos = [],
  onVideoClick,
  onViewAll,
  maxVisible = 8,
  style,
  className,
}) {
  const navigate = useNavigate();
  const [hoveredId, setHoveredId] = useState(null);
  const scrollRef = useRef(null);

  // Filter to only pending videos
  const pendingVideos = videos.filter(
    (v) => v.reviewStatus === REVIEW_STATUS.PENDING || v.reviewStatus === REVIEW_STATUS.NEEDS_FOLLOWUP
  );

  // Limit visible items
  const visibleVideos = pendingVideos.slice(0, maxVisible);

  // Handle scroll
  const handleScroll = useCallback((direction) => {
    if (!scrollRef.current) return;
    const scrollAmount = 160;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  }, []);

  // Handle video click - navigate to analyzer
  const handleVideoClick = useCallback((video) => {
    track('screen_view', {
      screen: 'VideoAnalysisPage',
      source: 'pending_review_queue',
      id: video.id,
      action: 'open_analyzer',
    });
    navigate(`/coach/videos/${video.id}/analyze`);
    onVideoClick?.(video);
  }, [navigate, onVideoClick]);

  // Empty state
  if (pendingVideos.length === 0) {
    return (
      <div className={className} style={{ ...styles.container, ...style }}>
        <div style={styles.header}>
          <h3 style={styles.title}>
            <ClockIcon />
            Venter på gjennomgang
          </h3>
        </div>
        <div style={styles.emptyState}>
          <CheckCircleIcon />
          <p style={styles.emptyText}>
            Alle videoer er gjennomgått!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={className} style={{ ...styles.container, ...style }}>
      {/* Header */}
      <div style={styles.header}>
        <h3 style={styles.title}>
          <ClockIcon />
          Venter på gjennomgang
          <span style={styles.badge}>{pendingVideos.length}</span>
        </h3>
        {pendingVideos.length > maxVisible && (
          <button style={styles.viewAllButton} onClick={onViewAll}>
            Se alle
          </button>
        )}
      </div>

      {/* Scroll wrapper */}
      <div style={styles.scrollWrapper}>
        {/* Scroll buttons */}
        {visibleVideos.length > 4 && (
          <>
            <button
              style={{ ...styles.scrollButton, ...styles.scrollLeft }}
              onClick={() => handleScroll('left')}
              aria-label="Scroll venstre"
            >
              <ChevronLeftIcon />
            </button>
            <button
              style={{ ...styles.scrollButton, ...styles.scrollRight }}
              onClick={() => handleScroll('right')}
              aria-label="Scroll høyre"
            >
              <ChevronRightIcon />
            </button>
          </>
        )}

        {/* Queue items */}
        <div ref={scrollRef} style={styles.scrollContainer}>
          {visibleVideos.map((video) => {
            const isHovered = hoveredId === video.id;
            const priorityColor = getPriorityColor(video.createdAt);

            return (
              <div
                key={video.id}
                style={{
                  ...styles.queueItem,
                  ...(isHovered ? styles.queueItemHover : {}),
                }}
                onClick={() => handleVideoClick(video)}
                onMouseEnter={() => setHoveredId(video.id)}
                onMouseLeave={() => setHoveredId(null)}
                role="button"
                tabIndex={0}
              >
                {/* Thumbnail */}
                <div style={styles.thumbnailContainer}>
                  {video.thumbnailUrl ? (
                    <img
                      src={video.thumbnailUrl}
                      alt={video.title}
                      style={styles.thumbnail}
                      loading="lazy"
                    />
                  ) : (
                    <div style={styles.thumbnailPlaceholder}>
                      <VideoIcon size={24} />
                    </div>
                  )}

                  {/* Play overlay */}
                  <div
                    style={{
                      ...styles.playOverlay,
                      ...(isHovered ? styles.playOverlayVisible : {}),
                    }}
                  >
                    <div style={styles.playButton}>
                      <PlayIcon />
                    </div>
                  </div>

                  {/* Duration */}
                  {video.duration && (
                    <span style={styles.duration}>
                      {formatDuration(video.duration)}
                    </span>
                  )}

                  {/* Priority indicator */}
                  <div
                    style={{
                      ...styles.priorityBadge,
                      backgroundColor: priorityColor,
                    }}
                    title={`Ventet: ${formatRelativeTime(video.createdAt)}`}
                  />
                </div>

                {/* Info */}
                <div style={styles.itemInfo}>
                  <span style={styles.playerName}>{video.playerName}</span>
                  <span style={styles.uploadTime}>
                    {formatRelativeTime(video.createdAt)} siden
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default PendingReviewQueue;
