/**
 * VideoCard Component
 * Displays a video thumbnail with metadata overlay for the video library
 *
 * Features:
 * - Thumbnail preview with duration overlay
 * - Hover state with play icon
 * - Video metadata display (title, category, date)
 * - Selection checkbox for bulk actions
 * - Click to open video player
 */

import React, { useState, useCallback } from 'react';

// Video categories with labels
const CATEGORY_LABELS = {
  swing: 'Full Swing',
  putting: 'Putting',
  short_game: 'Short Game',
  other: 'Annet',
};

// View angle labels
const VIEW_ANGLE_LABELS = {
  face_on: 'Face On',
  down_the_line: 'Down the Line',
  overhead: 'Ovenfra',
  side: 'Side',
};

// Styles
const styles = {
  card: {
    position: 'relative',
    borderRadius: 'var(--radius-lg, 12px)',
    overflow: 'hidden',
    backgroundColor: 'var(--ak-surface, #1a1a2e)',
    border: '1px solid var(--ak-border, rgba(255, 255, 255, 0.1))',
    cursor: 'pointer',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
  },
  cardHover: {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
    borderColor: 'var(--ak-primary, #6366f1)',
  },
  cardSelected: {
    borderColor: 'var(--ak-primary, #6366f1)',
    boxShadow: '0 0 0 2px var(--ak-primary, #6366f1)',
  },
  thumbnailContainer: {
    position: 'relative',
    aspectRatio: '16 / 9',
    backgroundColor: 'var(--ak-surface-dark, #0f0f1a)',
    overflow: 'hidden',
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
    backgroundColor: 'var(--ak-surface-dark, #0f0f1a)',
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
    transition: 'opacity 0.2s ease',
  },
  playOverlayVisible: {
    opacity: 1,
  },
  playButton: {
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    backgroundColor: 'var(--ak-primary, #6366f1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)',
  },
  playIcon: {
    width: '24px',
    height: '24px',
    color: 'white',
    marginLeft: '4px',
  },
  durationBadge: {
    position: 'absolute',
    bottom: '8px',
    right: '8px',
    padding: '2px 6px',
    borderRadius: 'var(--radius-sm, 4px)',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    color: 'white',
    fontSize: '12px',
    fontWeight: '500',
    fontFamily: 'var(--font-mono, monospace)',
  },
  categoryBadge: {
    position: 'absolute',
    top: '8px',
    left: '8px',
    padding: '4px 8px',
    borderRadius: 'var(--radius-sm, 4px)',
    backgroundColor: 'var(--ak-primary, #6366f1)',
    color: 'white',
    fontSize: '11px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  checkbox: {
    position: 'absolute',
    top: '8px',
    right: '8px',
    width: '24px',
    height: '24px',
    borderRadius: 'var(--radius-sm, 4px)',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    border: '2px solid rgba(255, 255, 255, 0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    zIndex: 10,
  },
  checkboxSelected: {
    backgroundColor: 'var(--ak-primary, #6366f1)',
    borderColor: 'var(--ak-primary, #6366f1)',
  },
  checkIcon: {
    width: '14px',
    height: '14px',
    color: 'white',
  },
  content: {
    padding: 'var(--spacing-3, 12px)',
  },
  title: {
    margin: 0,
    fontSize: '14px',
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
    marginTop: 'var(--spacing-1, 4px)',
    fontSize: '12px',
    color: 'var(--ak-text-secondary, rgba(255, 255, 255, 0.7))',
  },
  metaDot: {
    width: '3px',
    height: '3px',
    borderRadius: '50%',
    backgroundColor: 'var(--ak-text-tertiary, rgba(255, 255, 255, 0.3))',
  },
  statusBadge: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    padding: '8px 16px',
    borderRadius: 'var(--radius-md, 8px)',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    color: 'white',
    fontSize: '12px',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-2, 8px)',
  },
  processingSpinner: {
    width: '16px',
    height: '16px',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderTopColor: 'white',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
};

// Play icon SVG
const PlayIcon = () => (
  <svg style={styles.playIcon} viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5v14l11-7z" />
  </svg>
);

// Check icon SVG
const CheckIcon = () => (
  <svg style={styles.checkIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

// Video icon SVG (placeholder)
const VideoIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
  </svg>
);

/**
 * Format duration in seconds to MM:SS
 */
function formatDuration(seconds) {
  if (!seconds || seconds <= 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Format date for display
 */
function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'I dag';
  if (diffDays === 1) return 'I går';
  if (diffDays < 7) return `${diffDays} dager siden`;

  return date.toLocaleDateString('nb-NO', {
    day: 'numeric',
    month: 'short',
  });
}

/**
 * VideoCard Component
 */
export function VideoCard({
  video,
  selected = false,
  selectable = false,
  onSelect,
  onClick,
  style,
  className,
}) {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = useCallback((e) => {
    // If clicking checkbox area, don't trigger card click
    if (e.target.closest('[data-checkbox]')) return;
    onClick?.(video);
  }, [video, onClick]);

  const handleCheckboxClick = useCallback((e) => {
    e.stopPropagation();
    onSelect?.(video, !selected);
  }, [video, selected, onSelect]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.(video);
    }
  }, [video, onClick]);

  const isProcessing = video.status === 'processing';
  const isFailed = video.status === 'failed';

  // Combine styles
  const cardStyle = {
    ...styles.card,
    ...(isHovered && !selected ? styles.cardHover : {}),
    ...(selected ? styles.cardSelected : {}),
    ...style,
  };

  return (
    <div
      className={className}
      style={cardStyle}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      tabIndex={0}
      role="button"
      aria-label={`Åpne video: ${video.title}`}
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
            <VideoIcon />
          </div>
        )}

        {/* Play overlay on hover */}
        {!isProcessing && !isFailed && (
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
        )}

        {/* Processing status */}
        {isProcessing && (
          <div style={styles.statusBadge}>
            <div style={styles.processingSpinner} />
            <span>Behandler...</span>
          </div>
        )}

        {/* Failed status */}
        {isFailed && (
          <div style={{ ...styles.statusBadge, backgroundColor: 'rgba(239, 68, 68, 0.9)' }}>
            <span>Feilet</span>
          </div>
        )}

        {/* Category badge */}
        {video.category && !isProcessing && !isFailed && (
          <div style={styles.categoryBadge}>
            {CATEGORY_LABELS[video.category] || video.category}
          </div>
        )}

        {/* Duration badge */}
        {video.duration && !isProcessing && !isFailed && (
          <div style={styles.durationBadge}>
            {formatDuration(video.duration)}
          </div>
        )}

        {/* Selection checkbox */}
        {selectable && (
          <div
            data-checkbox
            style={{
              ...styles.checkbox,
              ...(selected ? styles.checkboxSelected : {}),
            }}
            onClick={handleCheckboxClick}
            role="checkbox"
            aria-checked={selected}
            aria-label={`Velg video: ${video.title}`}
          >
            {selected && <CheckIcon />}
          </div>
        )}
      </div>

      {/* Content */}
      <div style={styles.content}>
        <h3 style={styles.title} title={video.title}>
          {video.title}
        </h3>
        <div style={styles.meta}>
          {video.viewAngle && (
            <>
              <span>{VIEW_ANGLE_LABELS[video.viewAngle] || video.viewAngle}</span>
              <span style={styles.metaDot} />
            </>
          )}
          <span>{formatDate(video.createdAt)}</span>
        </div>
      </div>

      {/* Spinner animation */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default VideoCard;
