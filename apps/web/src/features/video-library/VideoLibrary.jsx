/**
 * VideoLibrary Component
 * Main video library page with grid/list view, filtering, and bulk actions
 *
 * Features:
 * - Grid and list view modes
 * - Filter by category, player, search
 * - Sort by date, title, duration
 * - Bulk selection for comparison/deletion
 * - Empty state and loading states
 * - Pagination/infinite scroll
 */

import React, { useState, useCallback, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import { VideoCard } from './VideoCard';
import { VideoFilters, VIEW_MODES, SORT_OPTIONS } from './VideoFilters';
import { useVideos } from '../../hooks/useVideos';
import * as videoApi from '../../services/videoApi';
import StateCard from '../../ui/composites/StateCard';
import Modal from '../../ui/composites/Modal.composite';

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
    alignItems: 'center',
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
  headerActions: {
    display: 'flex',
    gap: 'var(--spacing-2, 8px)',
  },
  uploadButton: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-2, 8px)',
    padding: '10px 20px',
    backgroundColor: 'var(--ak-primary, #6366f1)',
    color: 'white',
    border: 'none',
    borderRadius: 'var(--radius-md, 8px)',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: 'var(--spacing-4, 16px)',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-3, 12px)',
  },
  listCard: {
    display: 'flex',
    gap: 'var(--spacing-4, 16px)',
    padding: 'var(--spacing-3, 12px)',
    backgroundColor: 'var(--ak-surface, #1a1a2e)',
    borderRadius: 'var(--radius-lg, 12px)',
    border: '1px solid var(--ak-border, rgba(255, 255, 255, 0.1))',
    cursor: 'pointer',
    transition: 'border-color 0.2s ease',
  },
  listThumbnail: {
    width: '160px',
    height: '90px',
    borderRadius: 'var(--radius-md, 8px)',
    overflow: 'hidden',
    flexShrink: 0,
    backgroundColor: 'var(--ak-surface-dark, #0f0f1a)',
  },
  listThumbnailImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  listContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    minWidth: 0,
  },
  listTitle: {
    margin: 0,
    fontSize: '16px',
    fontWeight: '600',
    color: 'var(--ak-text-primary, white)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  listMeta: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 'var(--spacing-3, 12px)',
    marginTop: 'var(--spacing-1, 4px)',
    fontSize: '13px',
    color: 'var(--ak-text-secondary, rgba(255, 255, 255, 0.7))',
  },
  listActions: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-2, 8px)',
  },
  bulkActionsBar: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-4, 16px)',
    padding: 'var(--spacing-3, 12px) var(--spacing-4, 16px)',
    backgroundColor: 'var(--ak-primary, #6366f1)',
    borderRadius: 'var(--radius-lg, 12px)',
    color: 'white',
  },
  bulkCount: {
    fontSize: '14px',
    fontWeight: '600',
  },
  bulkActions: {
    display: 'flex',
    gap: 'var(--spacing-2, 8px)',
    marginLeft: 'auto',
  },
  bulkButton: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-1, 4px)',
    padding: '6px 12px',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    color: 'white',
    border: 'none',
    borderRadius: 'var(--radius-md, 8px)',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  },
  cancelButton: {
    padding: '6px 12px',
    backgroundColor: 'transparent',
    color: 'var(--text-primary, white)',
    border: '1px solid var(--border-default, rgba(255, 255, 255, 0.3))',
    borderRadius: 'var(--radius-md, 8px)',
    fontSize: '13px',
    cursor: 'pointer',
  },
  deleteButton: {
    padding: '6px 16px',
    backgroundColor: 'var(--color-danger, #dc3545)',
    color: 'white',
    border: 'none',
    borderRadius: 'var(--radius-md, 8px)',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 'var(--spacing-8, 32px)',
    textAlign: 'center',
  },
  emptyIcon: {
    width: '80px',
    height: '80px',
    color: 'var(--ak-text-tertiary, rgba(255, 255, 255, 0.3))',
    marginBottom: 'var(--spacing-4, 16px)',
  },
  emptyTitle: {
    margin: 0,
    fontSize: '18px',
    fontWeight: '600',
    color: 'var(--ak-text-primary, white)',
  },
  emptyDescription: {
    margin: 'var(--spacing-2, 8px) 0 0',
    fontSize: '14px',
    color: 'var(--ak-text-secondary, rgba(255, 255, 255, 0.7))',
    maxWidth: '300px',
  },
  loadingContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 'var(--spacing-8, 32px)',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '3px solid var(--ak-border, rgba(255, 255, 255, 0.1))',
    borderTopColor: 'var(--ak-primary, #6366f1)',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  loadMoreButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    padding: 'var(--spacing-3, 12px)',
    backgroundColor: 'var(--ak-surface, #1a1a2e)',
    color: 'var(--ak-text-secondary, rgba(255, 255, 255, 0.7))',
    border: '1px solid var(--ak-border, rgba(255, 255, 255, 0.1))',
    borderRadius: 'var(--radius-md, 8px)',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 'var(--spacing-2, 8px)',
    marginTop: 'var(--spacing-4, 16px)',
  },
};

// Icons
const UploadIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

const VideoEmptyIcon = () => (
  <svg style={styles.emptyIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m10 9 5 3-5 3V9z" />
  </svg>
);

const CompareIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="4" width="8" height="16" rx="1" />
    <rect x="14" y="4" width="8" height="16" rx="1" />
  </svg>
);

const DeleteIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

// Demo videos for fallback
const DEMO_VIDEOS = [
  {
    id: '1',
    title: 'Driver Swing - September',
    category: 'swing',
    viewAngle: 'face_on',
    duration: 45,
    status: 'ready',
    thumbnailUrl: null,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    title: 'Putting Drill',
    category: 'putting',
    viewAngle: 'down_the_line',
    duration: 120,
    status: 'ready',
    thumbnailUrl: null,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    title: '7-iron approach',
    category: 'swing',
    viewAngle: 'face_on',
    duration: 30,
    status: 'processing',
    thumbnailUrl: null,
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    title: 'Bunker Shot Teknikk',
    category: 'short_game',
    viewAngle: 'side',
    duration: 90,
    status: 'ready',
    thumbnailUrl: null,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '5',
    title: 'Chip and Run',
    category: 'short_game',
    viewAngle: 'down_the_line',
    duration: 60,
    status: 'ready',
    thumbnailUrl: null,
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

/**
 * VideoLibrary Component
 */
export function VideoLibrary({
  playerId,
  showPlayerFilter = false,
  players = [],
  onVideoClick,
  onUploadClick,
  onCompareClick,
  style,
  className,
}) {
  const { user } = useAuth();
  const { showNotification } = useNotification();

  // Filter state
  const [filters, setFilters] = useState({
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  const [viewMode, setViewMode] = useState(VIEW_MODES.GRID);
  const [selectedVideos, setSelectedVideos] = useState(new Set());
  const [loadingMore, setLoadingMore] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Check if user is coach
  const isCoach = user?.role === 'coach' || user?.role === 'admin';

  // Use the videos hook
  const {
    videos,
    total,
    loading,
    error,
    hasMore,
    loadMore,
    refresh,
    removeVideoFromList,
  } = useVideos({
    playerId: filters.playerId || playerId,
    category: filters.category,
    status: filters.status || '', // Empty string means all statuses
    sortBy: filters.sortBy || 'createdAt',
    sortOrder: filters.sortOrder || 'desc',
  });

  // Handle filter change
  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
    setSelectedVideos(new Set());
  }, []);

  // Handle video selection
  const handleVideoSelect = useCallback((video, selected) => {
    setSelectedVideos((prev) => {
      const next = new Set(prev);
      if (selected) {
        next.add(video.id);
      } else {
        next.delete(video.id);
      }
      return next;
    });
  }, []);

  // Handle select all
  const handleSelectAll = useCallback(() => {
    if (selectedVideos.size === videos.length) {
      setSelectedVideos(new Set());
    } else {
      setSelectedVideos(new Set(videos.map((v) => v.id)));
    }
  }, [videos, selectedVideos.size]);

  // Handle clear selection
  const handleClearSelection = useCallback(() => {
    setSelectedVideos(new Set());
  }, []);

  // Handle compare selected
  const handleCompareSelected = useCallback(() => {
    const selectedArray = videos.filter((v) => selectedVideos.has(v.id));
    if (selectedArray.length >= 2) {
      onCompareClick?.(selectedArray[0], selectedArray[1]);
    }
  }, [videos, selectedVideos, onCompareClick]);

  // Handle delete selected - opens confirmation modal
  const handleDeleteSelected = useCallback(() => {
    setShowDeleteConfirm(true);
  }, []);

  // Confirm and execute deletion
  const handleConfirmDelete = useCallback(async () => {
    setShowDeleteConfirm(false);
    try {
      // Delete videos using videoApi
      for (const videoId of selectedVideos) {
        await videoApi.deleteVideo(videoId);
        removeVideoFromList(videoId);
      }
      setSelectedVideos(new Set());
      showNotification('Videoer slettet', 'success');
    } catch (err) {
      console.error('Failed to delete videos:', err);
      showNotification('Kunne ikke slette videoer', 'error');
    }
  }, [selectedVideos, removeVideoFromList, showNotification]);

  // Handle load more
  const handleLoadMore = useCallback(() => {
    if (!loadingMore && hasMore) {
      setLoadingMore(true);
      loadMore().finally(() => setLoadingMore(false));
    }
  }, [loadingMore, hasMore, loadMore]);

  // Memoize selection state
  const selectionEnabled = selectedVideos.size > 0 || viewMode === VIEW_MODES.GRID;

  // Render grid view
  const renderGridView = () => (
    <div style={styles.grid}>
      {videos.map((video) => (
        <VideoCard
          key={video.id}
          video={video}
          selected={selectedVideos.has(video.id)}
          selectable={selectionEnabled}
          onSelect={handleVideoSelect}
          onClick={onVideoClick}
        />
      ))}
    </div>
  );

  // Render list view
  const renderListView = () => (
    <div style={styles.list}>
      {videos.map((video) => (
        <div
          key={video.id}
          style={{
            ...styles.listCard,
            borderColor: selectedVideos.has(video.id)
              ? 'var(--ak-primary, #6366f1)'
              : 'var(--ak-border, rgba(255, 255, 255, 0.1))',
          }}
          onClick={() => onVideoClick?.(video)}
          role="button"
          tabIndex={0}
        >
          <div style={styles.listThumbnail}>
            {video.thumbnailUrl ? (
              <img
                src={video.thumbnailUrl}
                alt={video.title}
                style={styles.listThumbnailImg}
              />
            ) : (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--ak-text-tertiary)',
                }}
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
                </svg>
              </div>
            )}
          </div>
          <div style={styles.listContent}>
            <h3 style={styles.listTitle}>{video.title}</h3>
            <div style={styles.listMeta}>
              {video.category && <span>{video.category}</span>}
              {video.viewAngle && <span>{video.viewAngle}</span>}
              {video.duration && (
                <span>
                  {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
                </span>
              )}
              <span>
                {new Date(video.createdAt).toLocaleDateString('nb-NO', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            </div>
          </div>
          <div style={styles.listActions}>
            <input
              type="checkbox"
              checked={selectedVideos.has(video.id)}
              onChange={(e) => {
                e.stopPropagation();
                handleVideoSelect(video, e.target.checked);
              }}
              onClick={(e) => e.stopPropagation()}
              aria-label={`Velg ${video.title}`}
            />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className={className} style={{ ...styles.container, ...style }}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <h1 style={styles.title}>Videobibliotek</h1>
          <p style={styles.subtitle}>
            Se og analyser dine sving-videoer
          </p>
        </div>
        <div style={styles.headerActions}>
          <button
            style={styles.uploadButton}
            onClick={onUploadClick}
          >
            <UploadIcon />
            Last opp video
          </button>
        </div>
      </div>

      {/* Filters */}
      <VideoFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        players={players}
        showPlayerFilter={showPlayerFilter && isCoach}
        resultCount={loading ? undefined : videos.length}
      />

      {/* Bulk actions bar */}
      {selectedVideos.size > 0 && (
        <div style={styles.bulkActionsBar}>
          <span style={styles.bulkCount}>
            {selectedVideos.size} valgt
          </span>
          <div style={styles.bulkActions}>
            {selectedVideos.size >= 2 && onCompareClick && (
              <button
                style={styles.bulkButton}
                onClick={handleCompareSelected}
              >
                <CompareIcon />
                Sammenlign
              </button>
            )}
            <button
              style={{ ...styles.bulkButton, backgroundColor: 'rgba(239, 68, 68, 0.3)' }}
              onClick={handleDeleteSelected}
            >
              <DeleteIcon />
              Slett
            </button>
            <button
              style={styles.cancelButton}
              onClick={handleClearSelection}
            >
              Avbryt
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div style={styles.loadingContainer}>
          <div style={styles.spinner} />
        </div>
      ) : error ? (
        <StateCard
          variant="error"
          title="Kunne ikke laste videoer"
          description="Sjekk nettverkstilkoblingen og prøv igjen."
          action={
            <button
              style={styles.uploadButton}
              onClick={refresh}
            >
              Prøv igjen
            </button>
          }
        />
      ) : videos.length === 0 ? (
        <div style={styles.emptyState}>
          <VideoEmptyIcon />
          <h2 style={styles.emptyTitle}>Ingen videoer ennå</h2>
          <p style={styles.emptyDescription}>
            Last opp din første video for å begynne å analysere svingen din.
          </p>
          <button
            style={{ ...styles.uploadButton, marginTop: 'var(--spacing-4, 16px)' }}
            onClick={onUploadClick}
          >
            <UploadIcon />
            Last opp video
          </button>
        </div>
      ) : (
        <>
          {viewMode === VIEW_MODES.GRID ? renderGridView() : renderListView()}

          {/* Load more */}
          {hasMore && (
            <button
              style={styles.loadMoreButton}
              onClick={handleLoadMore}
              disabled={loadingMore}
            >
              {loadingMore ? 'Laster...' : 'Last flere videoer'}
            </button>
          )}
        </>
      )}

      {/* Spinner animation */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      {/* Delete confirmation modal */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Slett videoer"
        size="sm"
        footer={
          <>
            <button
              style={styles.cancelButton}
              onClick={() => setShowDeleteConfirm(false)}
            >
              Avbryt
            </button>
            <button
              style={styles.deleteButton}
              onClick={handleConfirmDelete}
            >
              Slett {selectedVideos.size} {selectedVideos.size === 1 ? 'video' : 'videoer'}
            </button>
          </>
        }
      >
        <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
          Er du sikker på at du vil slette {selectedVideos.size} {selectedVideos.size === 1 ? 'video' : 'videoer'}?
          Denne handlingen kan ikke angres.
        </p>
      </Modal>
    </div>
  );
}

export default VideoLibrary;
