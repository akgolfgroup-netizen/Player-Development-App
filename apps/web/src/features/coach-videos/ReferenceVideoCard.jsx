/**
 * ReferenceVideoCard Component
 * Card for displaying reference/demo videos in the library
 *
 * Features:
 * - Thumbnail with play overlay
 * - Category and type badges
 * - Share with players action
 * - Edit/delete options for owners
 * - View count and usage stats
 */

import React, { useState, useCallback } from 'react';

// Reference video types
export const REFERENCE_TYPES = {
  COACH_DEMO: 'coach_demo',
  PRO_REFERENCE: 'pro_reference',
  DRILL_INSTRUCTION: 'drill_instruction',
  TECHNIQUE_BREAKDOWN: 'technique_breakdown',
};

// Type labels
const TYPE_LABELS = {
  [REFERENCE_TYPES.COACH_DEMO]: 'Coach Demo',
  [REFERENCE_TYPES.PRO_REFERENCE]: 'Pro Referanse',
  [REFERENCE_TYPES.DRILL_INSTRUCTION]: 'Øvelse',
  [REFERENCE_TYPES.TECHNIQUE_BREAKDOWN]: 'Teknikk',
};

// Type colors
const TYPE_COLORS = {
  [REFERENCE_TYPES.COACH_DEMO]: '#6366f1',
  [REFERENCE_TYPES.PRO_REFERENCE]: '#f59e0b',
  [REFERENCE_TYPES.DRILL_INSTRUCTION]: '#22c55e',
  [REFERENCE_TYPES.TECHNIQUE_BREAKDOWN]: '#ec4899',
};

// Styles
const styles = {
  card: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'var(--ak-surface, #1a1a2e)',
    borderRadius: 'var(--radius-lg, 12px)',
    border: '1px solid var(--ak-border, rgba(255, 255, 255, 0.1))',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  cardHover: {
    transform: 'translateY(-2px)',
    borderColor: 'var(--ak-primary, #6366f1)',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
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
  typeBadge: {
    position: 'absolute',
    top: '8px',
    left: '8px',
    padding: '4px 8px',
    borderRadius: 'var(--radius-sm, 4px)',
    fontSize: '10px',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    color: 'white',
  },
  duration: {
    position: 'absolute',
    bottom: '8px',
    right: '8px',
    padding: '2px 6px',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 'var(--radius-sm, 4px)',
    fontSize: '11px',
    fontFamily: 'var(--font-mono, monospace)',
    color: 'white',
  },
  menuButton: {
    position: 'absolute',
    top: '8px',
    right: '8px',
    width: '28px',
    height: '28px',
    borderRadius: 'var(--radius-sm, 4px)',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0,
    transition: 'opacity 0.2s ease',
  },
  menuButtonVisible: {
    opacity: 1,
  },
  content: {
    padding: 'var(--spacing-3, 12px)',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-2, 8px)',
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
  description: {
    margin: 0,
    fontSize: '12px',
    color: 'var(--ak-text-secondary, rgba(255, 255, 255, 0.7))',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    lineHeight: 1.4,
  },
  meta: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 'auto',
  },
  category: {
    fontSize: '11px',
    color: 'var(--ak-text-tertiary, rgba(255, 255, 255, 0.5))',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  stats: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-2, 8px)',
    fontSize: '11px',
    color: 'var(--ak-text-tertiary, rgba(255, 255, 255, 0.5))',
  },
  statItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  actions: {
    display: 'flex',
    gap: 'var(--spacing-2, 8px)',
    paddingTop: 'var(--spacing-2, 8px)',
    borderTop: '1px solid var(--ak-border, rgba(255, 255, 255, 0.1))',
  },
  actionButton: {
    flex: 1,
    padding: '8px 12px',
    backgroundColor: 'var(--ak-surface-dark, #0f0f1a)',
    border: '1px solid var(--ak-border, rgba(255, 255, 255, 0.1))',
    borderRadius: 'var(--radius-md, 8px)',
    color: 'var(--ak-text-secondary, rgba(255, 255, 255, 0.7))',
    fontSize: '12px',
    fontWeight: '500',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
    transition: 'all 0.15s ease',
  },
  shareButton: {
    backgroundColor: 'var(--ak-primary, #6366f1)',
    borderColor: 'var(--ak-primary, #6366f1)',
    color: 'white',
  },
  dropdown: {
    position: 'absolute',
    top: '40px',
    right: '8px',
    minWidth: '140px',
    backgroundColor: 'var(--ak-surface, #1a1a2e)',
    borderRadius: 'var(--radius-md, 8px)',
    border: '1px solid var(--ak-border, rgba(255, 255, 255, 0.1))',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
    zIndex: 100,
    overflow: 'hidden',
  },
  dropdownItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-2, 8px)',
    width: '100%',
    padding: '10px 12px',
    backgroundColor: 'transparent',
    border: 'none',
    color: 'var(--ak-text-secondary, rgba(255, 255, 255, 0.7))',
    fontSize: '13px',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'background-color 0.15s ease',
  },
  dropdownItemDanger: {
    color: 'var(--ak-error, #ef4444)',
  },
};

// Icons
const VideoIcon = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
  </svg>
);

const PlayIcon = () => (
  <svg style={styles.playIcon} viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5v14l11-7z" />
  </svg>
);

const MoreIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="5" r="2" />
    <circle cx="12" cy="12" r="2" />
    <circle cx="12" cy="19" r="2" />
  </svg>
);

const ShareIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
);

const EyeIcon = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const UsersIcon = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const EditIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const TrashIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

const CompareIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="4" width="8" height="16" rx="1" />
    <rect x="14" y="4" width="8" height="16" rx="1" />
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
 * ReferenceVideoCard Component
 */
export function ReferenceVideoCard({
  video,
  isOwner = false,
  showActions = true,
  onPlay,
  onShare,
  onCompare,
  onEdit,
  onDelete,
  style,
  className,
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const typeColor = TYPE_COLORS[video.type] || TYPE_COLORS[REFERENCE_TYPES.COACH_DEMO];
  const typeLabel = TYPE_LABELS[video.type] || 'Video';

  // Handle card click
  const handleClick = useCallback(() => {
    onPlay?.(video);
  }, [video, onPlay]);

  // Handle share click
  const handleShare = useCallback((e) => {
    e.stopPropagation();
    onShare?.(video);
  }, [video, onShare]);

  // Handle compare click
  const handleCompare = useCallback((e) => {
    e.stopPropagation();
    onCompare?.(video);
  }, [video, onCompare]);

  // Handle menu toggle
  const handleMenuToggle = useCallback((e) => {
    e.stopPropagation();
    setShowMenu((prev) => !prev);
  }, []);

  // Handle edit
  const handleEdit = useCallback((e) => {
    e.stopPropagation();
    setShowMenu(false);
    onEdit?.(video);
  }, [video, onEdit]);

  // Handle delete
  const handleDelete = useCallback((e) => {
    e.stopPropagation();
    setShowMenu(false);
    if (window.confirm('Er du sikker på at du vil slette denne referansevideoen?')) {
      onDelete?.(video);
    }
  }, [video, onDelete]);

  return (
    <div
      className={className}
      style={{
        ...styles.card,
        ...(isHovered ? styles.cardHover : {}),
        ...style,
      }}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowMenu(false);
      }}
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
            <VideoIcon />
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

        {/* Type badge */}
        <div style={{ ...styles.typeBadge, backgroundColor: typeColor }}>
          {typeLabel}
        </div>

        {/* Duration */}
        {video.duration && (
          <span style={styles.duration}>
            {formatDuration(video.duration)}
          </span>
        )}

        {/* Menu button (owner only) */}
        {isOwner && (
          <button
            style={{
              ...styles.menuButton,
              ...(isHovered ? styles.menuButtonVisible : {}),
            }}
            onClick={handleMenuToggle}
            aria-label="Meny"
          >
            <MoreIcon />
          </button>
        )}

        {/* Dropdown menu */}
        {showMenu && (
          <div style={styles.dropdown}>
            <button style={styles.dropdownItem} onClick={handleEdit}>
              <EditIcon />
              Rediger
            </button>
            <button
              style={{ ...styles.dropdownItem, ...styles.dropdownItemDanger }}
              onClick={handleDelete}
            >
              <TrashIcon />
              Slett
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div style={styles.content}>
        <h3 style={styles.title}>{video.title}</h3>

        {video.description && (
          <p style={styles.description}>{video.description}</p>
        )}

        <div style={styles.meta}>
          <span style={styles.category}>{video.category}</span>
          <div style={styles.stats}>
            {video.viewCount !== undefined && (
              <span style={styles.statItem}>
                <EyeIcon />
                {video.viewCount}
              </span>
            )}
            {video.sharedWith !== undefined && (
              <span style={styles.statItem}>
                <UsersIcon />
                {video.sharedWith}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        {showActions && (
          <div style={styles.actions}>
            <button
              style={{ ...styles.actionButton, ...styles.shareButton }}
              onClick={handleShare}
            >
              <ShareIcon />
              Del
            </button>
            <button style={styles.actionButton} onClick={handleCompare}>
              <CompareIcon />
              Sammenlign
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ReferenceVideoCard;
