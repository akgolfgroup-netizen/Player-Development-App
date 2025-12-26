/**
 * SwingTimeline Component
 * Horizontal timeline showing video thumbnails over time
 *
 * Features:
 * - Horizontal timeline with dates
 * - Video thumbnails as points
 * - Click to open video
 * - Hover preview
 * - Compare button between two videos
 */

import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// Styles
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-3, 12px)',
    padding: 'var(--spacing-4, 16px)',
    backgroundColor: 'var(--ak-surface, #1a1a2e)',
    borderRadius: 'var(--radius-lg, 12px)',
    border: '1px solid var(--ak-border, rgba(255, 255, 255, 0.1))',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 'var(--spacing-3, 12px)',
  },
  title: {
    margin: 0,
    fontSize: '16px',
    fontWeight: '600',
    color: 'var(--ak-text-primary, white)',
  },
  compareButton: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-2, 8px)',
    padding: '8px 16px',
    backgroundColor: 'var(--ak-primary, #6366f1)',
    color: 'white',
    border: 'none',
    borderRadius: 'var(--radius-md, 8px)',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
  },
  compareButtonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  timelineWrapper: {
    position: 'relative',
    padding: '0 16px',
  },
  timeline: {
    position: 'relative',
    height: '120px',
    display: 'flex',
    alignItems: 'flex-end',
    gap: 0,
  },
  timelineLine: {
    position: 'absolute',
    bottom: '24px',
    left: 0,
    right: 0,
    height: '2px',
    backgroundColor: 'var(--ak-border, rgba(255, 255, 255, 0.2))',
  },
  videoPoint: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    transform: 'translateX(-50%)',
    cursor: 'pointer',
    transition: 'transform 0.15s ease',
  },
  videoPointSelected: {
    transform: 'translateX(-50%) scale(1.1)',
  },
  thumbnail: {
    width: '60px',
    height: '45px',
    backgroundColor: 'var(--ak-surface-dark, #0f0f1a)',
    borderRadius: 'var(--radius-sm, 4px)',
    border: '2px solid transparent',
    overflow: 'hidden',
    marginBottom: '8px',
    transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
  },
  thumbnailSelected: {
    borderColor: 'var(--ak-primary, #6366f1)',
    boxShadow: '0 0 0 2px rgba(99, 102, 241, 0.3)',
  },
  thumbnailImage: {
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
    color: 'var(--ak-text-tertiary, rgba(255, 255, 255, 0.4))',
  },
  dateMarker: {
    position: 'absolute',
    bottom: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    fontSize: '10px',
    color: 'var(--ak-text-tertiary, rgba(255, 255, 255, 0.5))',
    whiteSpace: 'nowrap',
    fontFamily: 'var(--font-mono, monospace)',
  },
  dot: {
    position: 'absolute',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '10px',
    height: '10px',
    backgroundColor: 'var(--ak-primary, #6366f1)',
    borderRadius: '50%',
    border: '2px solid var(--ak-surface, #1a1a2e)',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 'var(--spacing-6, 24px)',
    color: 'var(--ak-text-tertiary, rgba(255, 255, 255, 0.4))',
    textAlign: 'center',
  },
  emptyText: {
    fontSize: '14px',
    margin: 0,
  },
  selectionInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-2, 8px)',
    padding: 'var(--spacing-2, 8px) var(--spacing-3, 12px)',
    backgroundColor: 'var(--ak-primary-soft, rgba(99, 102, 241, 0.1))',
    borderRadius: 'var(--radius-md, 8px)',
    fontSize: '12px',
    color: 'var(--ak-text-secondary, rgba(255, 255, 255, 0.7))',
  },
  clearButton: {
    padding: '4px 8px',
    backgroundColor: 'transparent',
    border: '1px solid var(--ak-border, rgba(255, 255, 255, 0.2))',
    borderRadius: 'var(--radius-sm, 4px)',
    color: 'var(--ak-text-secondary, rgba(255, 255, 255, 0.7))',
    fontSize: '11px',
    cursor: 'pointer',
  },
};

// Icons
const VideoIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="23 7 16 12 23 17 23 7" />
    <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
  </svg>
);

const CompareIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);

/**
 * Format date as DD.MM
 */
function formatDate(date) {
  const d = new Date(date);
  return `${d.getDate().toString().padStart(2, '0')}.${(d.getMonth() + 1).toString().padStart(2, '0')}`;
}

/**
 * SwingTimeline Component
 */
export function SwingTimeline({
  videos = [],
  title = 'Fremgang over tid',
  onVideoClick,
  onCompare,
  selectable = true,
  style,
  className,
}) {
  const navigate = useNavigate();
  const [selectedVideos, setSelectedVideos] = useState([]);

  // Sort videos by date
  const sortedVideos = useMemo(() => {
    return [...videos].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }, [videos]);

  // Calculate positions for each video
  const videoPositions = useMemo(() => {
    if (sortedVideos.length === 0) return [];

    const minDate = new Date(sortedVideos[0].createdAt).getTime();
    const maxDate = new Date(sortedVideos[sortedVideos.length - 1].createdAt).getTime();
    const range = maxDate - minDate || 1;

    return sortedVideos.map((video) => {
      const date = new Date(video.createdAt).getTime();
      const position = ((date - minDate) / range) * 100;
      return {
        ...video,
        position: Math.max(2, Math.min(98, position)), // Keep within bounds
      };
    });
  }, [sortedVideos]);

  // Handle video click
  const handleVideoClick = useCallback((video, e) => {
    if (selectable && (e.ctrlKey || e.metaKey || e.shiftKey)) {
      // Multi-select mode
      setSelectedVideos((prev) => {
        if (prev.some((v) => v.id === video.id)) {
          return prev.filter((v) => v.id !== video.id);
        }
        if (prev.length >= 2) {
          return [prev[1], video];
        }
        return [...prev, video];
      });
    } else if (selectable && selectedVideos.length > 0) {
      // Add to selection
      setSelectedVideos((prev) => {
        if (prev.some((v) => v.id === video.id)) {
          return prev.filter((v) => v.id !== video.id);
        }
        if (prev.length >= 2) {
          return [prev[1], video];
        }
        return [...prev, video];
      });
    } else {
      // Single click - open video
      if (onVideoClick) {
        onVideoClick(video);
      } else {
        navigate(`/videos/${video.id}/analyze`);
      }
    }
  }, [selectable, selectedVideos, onVideoClick, navigate]);

  // Handle compare
  const handleCompare = useCallback(() => {
    if (selectedVideos.length !== 2) return;

    if (onCompare) {
      onCompare(selectedVideos[0], selectedVideos[1]);
    } else {
      navigate(`/videos/compare?left=${selectedVideos[0].id}&right=${selectedVideos[1].id}`);
    }
  }, [selectedVideos, onCompare, navigate]);

  // Clear selection
  const clearSelection = useCallback(() => {
    setSelectedVideos([]);
  }, []);

  // Is video selected
  const isSelected = useCallback((videoId) => {
    return selectedVideos.some((v) => v.id === videoId);
  }, [selectedVideos]);

  // Render empty state
  if (videos.length === 0) {
    return (
      <div className={className} style={{ ...styles.container, ...style }}>
        <div style={styles.header}>
          <h3 style={styles.title}>{title}</h3>
        </div>
        <div style={styles.emptyState}>
          <VideoIcon size={32} />
          <p style={styles.emptyText}>
            Ingen videoer i denne kategorien ennå
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={className} style={{ ...styles.container, ...style }}>
      {/* Header */}
      <div style={styles.header}>
        <h3 style={styles.title}>{title}</h3>
        {selectable && (
          <button
            style={{
              ...styles.compareButton,
              ...(selectedVideos.length !== 2 ? styles.compareButtonDisabled : {}),
            }}
            onClick={handleCompare}
            disabled={selectedVideos.length !== 2}
          >
            <CompareIcon />
            Sammenlign ({selectedVideos.length}/2)
          </button>
        )}
      </div>

      {/* Selection info */}
      {selectedVideos.length > 0 && (
        <div style={styles.selectionInfo}>
          <span>
            {selectedVideos.length === 1
              ? `1 video valgt - velg 1 til for å sammenligne`
              : `2 videoer valgt - klar til sammenligning`}
          </span>
          <button style={styles.clearButton} onClick={clearSelection}>
            Nullstill
          </button>
        </div>
      )}

      {/* Timeline */}
      <div style={styles.timelineWrapper}>
        <div style={styles.timeline}>
          <div style={styles.timelineLine} />

          {videoPositions.map((video) => (
            <div
              key={video.id}
              style={{
                ...styles.videoPoint,
                left: `${video.position}%`,
                ...(isSelected(video.id) ? styles.videoPointSelected : {}),
              }}
              onClick={(e) => handleVideoClick(video, e)}
              title={`${video.title} - ${formatDate(video.createdAt)}`}
            >
              <div
                style={{
                  ...styles.thumbnail,
                  ...(isSelected(video.id) ? styles.thumbnailSelected : {}),
                }}
              >
                {video.thumbnailUrl ? (
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    style={styles.thumbnailImage}
                  />
                ) : (
                  <div style={styles.thumbnailPlaceholder}>
                    <VideoIcon size={20} />
                  </div>
                )}
              </div>
              <div style={styles.dot} />
              <span style={styles.dateMarker}>{formatDate(video.createdAt)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SwingTimeline;
