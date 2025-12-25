/**
 * PlayerVideoFeed Component
 * Feed of all player videos for coach review
 *
 * Features:
 * - List of videos from all players
 * - Filter by player, date, category, review status
 * - Player avatar and name display
 * - Review status indicators
 * - Quick actions (review, annotate, comment)
 */

import React, { useState, useCallback, useMemo } from 'react';

// Review status options
export const REVIEW_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  REVIEWED: 'reviewed',
  NEEDS_FOLLOWUP: 'needs_followup',
};

// Status labels
const STATUS_LABELS = {
  [REVIEW_STATUS.PENDING]: 'Venter på gjennomgang',
  [REVIEW_STATUS.IN_PROGRESS]: 'Under arbeid',
  [REVIEW_STATUS.REVIEWED]: 'Gjennomgått',
  [REVIEW_STATUS.NEEDS_FOLLOWUP]: 'Trenger oppfølging',
};

// Status colors
const STATUS_COLORS = {
  [REVIEW_STATUS.PENDING]: '#f59e0b',
  [REVIEW_STATUS.IN_PROGRESS]: '#6366f1',
  [REVIEW_STATUS.REVIEWED]: '#22c55e',
  [REVIEW_STATUS.NEEDS_FOLLOWUP]: '#ef4444',
};

// Styles
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-3, 12px)',
  },
  feedItem: {
    display: 'flex',
    gap: 'var(--spacing-4, 16px)',
    padding: 'var(--spacing-4, 16px)',
    backgroundColor: 'var(--ak-surface, #1a1a2e)',
    borderRadius: 'var(--radius-lg, 12px)',
    border: '1px solid var(--ak-border, rgba(255, 255, 255, 0.1))',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  feedItemHover: {
    borderColor: 'var(--ak-primary, #6366f1)',
    transform: 'translateY(-1px)',
  },
  feedItemSelected: {
    borderColor: 'var(--ak-primary, #6366f1)',
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
  },
  checkbox: {
    width: '20px',
    height: '20px',
    marginTop: '4px',
    cursor: 'pointer',
    accentColor: 'var(--ak-primary, #6366f1)',
  },
  thumbnailContainer: {
    position: 'relative',
    width: '160px',
    height: '90px',
    borderRadius: 'var(--radius-md, 8px)',
    overflow: 'hidden',
    flexShrink: 0,
    backgroundColor: 'var(--ak-surface-dark, #0f0f1a)',
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
  duration: {
    position: 'absolute',
    bottom: '4px',
    right: '4px',
    padding: '2px 6px',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 'var(--radius-sm, 4px)',
    fontSize: '11px',
    fontFamily: 'var(--font-mono, monospace)',
    color: 'white',
  },
  statusBadge: {
    position: 'absolute',
    top: '4px',
    left: '4px',
    padding: '2px 6px',
    borderRadius: 'var(--radius-sm, 4px)',
    fontSize: '10px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.3px',
  },
  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-2, 8px)',
    minWidth: 0,
  },
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 'var(--spacing-3, 12px)',
  },
  titleSection: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    margin: 0,
    fontSize: '15px',
    fontWeight: '600',
    color: 'var(--ak-text-primary, white)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  meta: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-2, 8px)',
    marginTop: '4px',
    fontSize: '12px',
    color: 'var(--ak-text-secondary, rgba(255, 255, 255, 0.7))',
  },
  metaDot: {
    width: '3px',
    height: '3px',
    borderRadius: '50%',
    backgroundColor: 'var(--ak-text-tertiary, rgba(255, 255, 255, 0.3))',
  },
  playerInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-2, 8px)',
  },
  avatar: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    backgroundColor: 'var(--ak-primary, #6366f1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '11px',
    fontWeight: '600',
    color: 'white',
    flexShrink: 0,
  },
  playerName: {
    fontSize: '13px',
    fontWeight: '500',
    color: 'var(--ak-text-primary, white)',
  },
  annotations: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-1, 4px)',
    fontSize: '12px',
    color: 'var(--ak-text-tertiary, rgba(255, 255, 255, 0.5))',
  },
  actions: {
    display: 'flex',
    gap: 'var(--spacing-2, 8px)',
  },
  actionButton: {
    padding: '6px 12px',
    backgroundColor: 'var(--ak-surface-dark, #0f0f1a)',
    border: '1px solid var(--ak-border, rgba(255, 255, 255, 0.1))',
    borderRadius: 'var(--radius-md, 8px)',
    color: 'var(--ak-text-secondary, rgba(255, 255, 255, 0.7))',
    fontSize: '12px',
    fontWeight: '500',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    transition: 'all 0.15s ease',
  },
  primaryAction: {
    backgroundColor: 'var(--ak-primary, #6366f1)',
    borderColor: 'var(--ak-primary, #6366f1)',
    color: 'white',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 'var(--spacing-8, 32px)',
    textAlign: 'center',
    color: 'var(--ak-text-tertiary, rgba(255, 255, 255, 0.4))',
  },
  emptyIcon: {
    width: '48px',
    height: '48px',
    marginBottom: 'var(--spacing-3, 12px)',
    opacity: 0.5,
  },
  emptyText: {
    fontSize: '14px',
    margin: 0,
  },
  loadingSpinner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 'var(--spacing-6, 24px)',
  },
  spinner: {
    width: '32px',
    height: '32px',
    border: '3px solid var(--ak-border, rgba(255, 255, 255, 0.1))',
    borderTopColor: 'var(--ak-primary, #6366f1)',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
};

// Icons
const VideoIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
  </svg>
);

const AnnotateIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
  </svg>
);

const CommentIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const CheckIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const PlayIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5v14l11-7z" />
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
 * Format relative date
 */
function formatRelativeDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 60) return `${diffMins} min siden`;
  if (diffHours < 24) return `${diffHours} timer siden`;
  if (diffDays === 1) return 'I går';
  if (diffDays < 7) return `${diffDays} dager siden`;

  return date.toLocaleDateString('nb-NO', {
    day: 'numeric',
    month: 'short',
  });
}

/**
 * Get player initials
 */
function getInitials(name) {
  if (!name) return '?';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * PlayerVideoFeed Component
 */
export function PlayerVideoFeed({
  videos = [],
  loading = false,
  selectedVideos = new Set(),
  onVideoSelect,
  onVideoClick,
  onAnnotate,
  onComment,
  onMarkReviewed,
  selectable = false,
  style,
  className,
}) {
  const [hoveredId, setHoveredId] = useState(null);

  // Handle checkbox change
  const handleCheckboxChange = useCallback((e, video) => {
    e.stopPropagation();
    const isSelected = selectedVideos.has(video.id);
    onVideoSelect?.(video, !isSelected);
  }, [selectedVideos, onVideoSelect]);

  // Handle video click
  const handleVideoClick = useCallback((video) => {
    onVideoClick?.(video);
  }, [onVideoClick]);

  // Handle annotate
  const handleAnnotate = useCallback((e, video) => {
    e.stopPropagation();
    onAnnotate?.(video);
  }, [onAnnotate]);

  // Handle comment
  const handleComment = useCallback((e, video) => {
    e.stopPropagation();
    onComment?.(video);
  }, [onComment]);

  // Handle mark reviewed
  const handleMarkReviewed = useCallback((e, video) => {
    e.stopPropagation();
    onMarkReviewed?.(video);
  }, [onMarkReviewed]);

  // Loading state
  if (loading) {
    return (
      <div style={styles.loadingSpinner}>
        <div style={styles.spinner} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // Empty state
  if (videos.length === 0) {
    return (
      <div style={styles.emptyState}>
        <VideoIcon size={48} />
        <p style={styles.emptyText}>Ingen videoer å vise</p>
      </div>
    );
  }

  return (
    <div className={className} style={{ ...styles.container, ...style }}>
      {videos.map((video) => {
        const isHovered = hoveredId === video.id;
        const isSelected = selectedVideos.has(video.id);
        const statusColor = STATUS_COLORS[video.reviewStatus] || STATUS_COLORS[REVIEW_STATUS.PENDING];

        return (
          <div
            key={video.id}
            style={{
              ...styles.feedItem,
              ...(isHovered ? styles.feedItemHover : {}),
              ...(isSelected ? styles.feedItemSelected : {}),
            }}
            onClick={() => handleVideoClick(video)}
            onMouseEnter={() => setHoveredId(video.id)}
            onMouseLeave={() => setHoveredId(null)}
            role="button"
            tabIndex={0}
          >
            {/* Selection checkbox */}
            {selectable && (
              <input
                type="checkbox"
                checked={isSelected}
                onChange={(e) => handleCheckboxChange(e, video)}
                onClick={(e) => e.stopPropagation()}
                style={styles.checkbox}
                aria-label={`Velg ${video.title}`}
              />
            )}

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
                  <VideoIcon size={32} />
                </div>
              )}

              {/* Duration */}
              {video.duration && (
                <span style={styles.duration}>
                  {formatDuration(video.duration)}
                </span>
              )}

              {/* Status badge */}
              {video.reviewStatus && video.reviewStatus !== REVIEW_STATUS.REVIEWED && (
                <span
                  style={{
                    ...styles.statusBadge,
                    backgroundColor: statusColor,
                    color: 'white',
                  }}
                >
                  {video.reviewStatus === REVIEW_STATUS.PENDING ? 'Ny' :
                   video.reviewStatus === REVIEW_STATUS.NEEDS_FOLLOWUP ? '!' : ''}
                </span>
              )}
            </div>

            {/* Content */}
            <div style={styles.content}>
              <div style={styles.header}>
                <div style={styles.titleSection}>
                  <h3 style={styles.title}>{video.title}</h3>
                  <div style={styles.meta}>
                    <span>{video.category || 'Ukategorisert'}</span>
                    <span style={styles.metaDot} />
                    <span>{formatRelativeDate(video.createdAt)}</span>
                    {video.annotationCount > 0 && (
                      <>
                        <span style={styles.metaDot} />
                        <span style={styles.annotations}>
                          <AnnotateIcon size={12} />
                          {video.annotationCount}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Player info */}
                <div style={styles.playerInfo}>
                  <div style={styles.avatar}>
                    {getInitials(video.playerName)}
                  </div>
                  <span style={styles.playerName}>{video.playerName}</span>
                </div>
              </div>

              {/* Actions */}
              <div style={styles.actions}>
                <button
                  style={{ ...styles.actionButton, ...styles.primaryAction }}
                  onClick={(e) => handleAnnotate(e, video)}
                >
                  <AnnotateIcon />
                  Annotér
                </button>
                <button
                  style={styles.actionButton}
                  onClick={(e) => handleComment(e, video)}
                >
                  <CommentIcon />
                  Kommenter
                </button>
                {video.reviewStatus !== REVIEW_STATUS.REVIEWED && (
                  <button
                    style={styles.actionButton}
                    onClick={(e) => handleMarkReviewed(e, video)}
                  >
                    <CheckIcon />
                    Merk gjennomgått
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default PlayerVideoFeed;
