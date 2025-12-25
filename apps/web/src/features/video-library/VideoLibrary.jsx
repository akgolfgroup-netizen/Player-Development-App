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

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { VideoCard } from './VideoCard';
import { VideoFilters, VIEW_MODES, SORT_OPTIONS } from './VideoFilters';
import apiClient from '../../services/apiClient';

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
    color: 'white',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: 'var(--radius-md, 8px)',
    fontSize: '13px',
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
  const { token, user } = useAuth();

  // State
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  const [viewMode, setViewMode] = useState(VIEW_MODES.GRID);
  const [selectedVideos, setSelectedVideos] = useState(new Set());
  const [pagination, setPagination] = useState({
    offset: 0,
    limit: 20,
    total: 0,
    hasMore: false,
  });

  // Check if user is coach
  const isCoach = user?.role === 'coach' || user?.role === 'admin';

  // Fetch videos
  const fetchVideos = useCallback(async (reset = false) => {
    try {
      if (reset) {
        setLoading(true);
        setError(null);
      } else {
        setLoadingMore(true);
      }

      const offset = reset ? 0 : pagination.offset + pagination.limit;

      const params = new URLSearchParams({
        limit: pagination.limit.toString(),
        offset: offset.toString(),
        sortBy: filters.sortBy || 'createdAt',
        sortOrder: filters.sortOrder || 'desc',
      });

      if (filters.category) {
        params.append('category', filters.category);
      }

      if (filters.playerId || playerId) {
        params.append('playerId', filters.playerId || playerId);
      }

      if (filters.search) {
        params.append('search', filters.search);
      }

      const response = await apiClient.get(`/videos?${params.toString()}`);
      const data = response.data;

      if (reset) {
        setVideos(data.videos || []);
      } else {
        setVideos((prev) => [...prev, ...(data.videos || [])]);
      }

      setPagination({
        offset: offset,
        limit: pagination.limit,
        total: data.total || 0,
        hasMore: (data.videos || []).length === pagination.limit,
      });

    } catch (err) {
      console.warn('Video API not available, using demo data:', err);
      // Use demo data as fallback
      let filteredVideos = [...DEMO_VIDEOS];

      // Apply filters
      if (filters.category) {
        filteredVideos = filteredVideos.filter((v) => v.category === filters.category);
      }

      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredVideos = filteredVideos.filter((v) =>
          v.title.toLowerCase().includes(searchLower)
        );
      }

      // Apply sort
      filteredVideos.sort((a, b) => {
        const aVal = a[filters.sortBy || 'createdAt'];
        const bVal = b[filters.sortBy || 'createdAt'];
        const order = filters.sortOrder === 'asc' ? 1 : -1;

        if (typeof aVal === 'string') {
          return aVal.localeCompare(bVal) * order;
        }
        return (aVal - bVal) * order;
      });

      setVideos(filteredVideos);
      setPagination({
        offset: 0,
        limit: 20,
        total: filteredVideos.length,
        hasMore: false,
      });
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [token, filters, playerId, pagination.limit, pagination.offset]);

  // Initial fetch
  useEffect(() => {
    fetchVideos(true);
  }, [filters]);

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

  // Handle delete selected
  const handleDeleteSelected = useCallback(async () => {
    if (!window.confirm(`Er du sikker på at du vil slette ${selectedVideos.size} videoer?`)) {
      return;
    }

    try {
      // Delete videos (would need API implementation)
      for (const videoId of selectedVideos) {
        await apiClient.delete(`/videos/${videoId}`);
      }
      setSelectedVideos(new Set());
      fetchVideos(true);
    } catch (err) {
      console.error('Failed to delete videos:', err);
      alert('Kunne ikke slette videoer');
    }
  }, [selectedVideos, fetchVideos]);

  // Handle load more
  const handleLoadMore = useCallback(() => {
    if (!loadingMore && pagination.hasMore) {
      fetchVideos(false);
    }
  }, [loadingMore, pagination.hasMore, fetchVideos]);

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
          {pagination.hasMore && (
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
    </div>
  );
}

export default VideoLibrary;
