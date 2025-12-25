/**
 * CoachVideosDashboard Component
 * Main dashboard for coaches to review and manage player videos
 *
 * Features:
 * - Overview of all player videos
 * - Pending review queue
 * - Filter by player, date, status
 * - Batch actions (mark reviewed, request videos)
 * - Video request modal
 * - Quick stats
 */

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { PlayerVideoFeed, REVIEW_STATUS } from './PlayerVideoFeed';
import { PendingReviewQueue } from './PendingReviewQueue';
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
  headerActions: {
    display: 'flex',
    gap: 'var(--spacing-2, 8px)',
  },
  requestButton: {
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
  statsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: 'var(--spacing-3, 12px)',
  },
  statCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-1, 4px)',
    padding: 'var(--spacing-4, 16px)',
    backgroundColor: 'var(--ak-surface, #1a1a2e)',
    borderRadius: 'var(--radius-lg, 12px)',
    border: '1px solid var(--ak-border, rgba(255, 255, 255, 0.1))',
  },
  statValue: {
    fontSize: '28px',
    fontWeight: '700',
    color: 'var(--ak-text-primary, white)',
  },
  statLabel: {
    fontSize: '12px',
    color: 'var(--ak-text-secondary, rgba(255, 255, 255, 0.7))',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  filtersRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 'var(--spacing-3, 12px)',
    padding: 'var(--spacing-4, 16px)',
    backgroundColor: 'var(--ak-surface, #1a1a2e)',
    borderRadius: 'var(--radius-lg, 12px)',
    border: '1px solid var(--ak-border, rgba(255, 255, 255, 0.1))',
  },
  filterGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-1, 4px)',
  },
  filterLabel: {
    fontSize: '11px',
    fontWeight: '600',
    color: 'var(--ak-text-tertiary, rgba(255, 255, 255, 0.5))',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  filterSelect: {
    padding: '8px 32px 8px 12px',
    backgroundColor: 'var(--ak-surface-dark, #0f0f1a)',
    border: '1px solid var(--ak-border, rgba(255, 255, 255, 0.1))',
    borderRadius: 'var(--radius-md, 8px)',
    color: 'var(--ak-text-primary, white)',
    fontSize: '13px',
    cursor: 'pointer',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.5)' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 8px center',
    minWidth: '140px',
  },
  searchInput: {
    padding: '8px 12px',
    backgroundColor: 'var(--ak-surface-dark, #0f0f1a)',
    border: '1px solid var(--ak-border, rgba(255, 255, 255, 0.1))',
    borderRadius: 'var(--radius-md, 8px)',
    color: 'var(--ak-text-primary, white)',
    fontSize: '13px',
    minWidth: '200px',
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
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-3, 12px)',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    margin: 0,
    fontSize: '16px',
    fontWeight: '600',
    color: 'var(--ak-text-primary, white)',
  },
  // Request Modal
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: 'var(--spacing-4, 16px)',
  },
  modal: {
    width: '100%',
    maxWidth: '480px',
    backgroundColor: 'var(--ak-surface, #1a1a2e)',
    borderRadius: 'var(--radius-xl, 16px)',
    border: '1px solid var(--ak-border, rgba(255, 255, 255, 0.1))',
    boxShadow: '0 24px 48px rgba(0, 0, 0, 0.4)',
    overflow: 'hidden',
  },
  modalHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 'var(--spacing-4, 16px)',
    borderBottom: '1px solid var(--ak-border, rgba(255, 255, 255, 0.1))',
  },
  modalTitle: {
    margin: 0,
    fontSize: '18px',
    fontWeight: '600',
    color: 'var(--ak-text-primary, white)',
  },
  modalClose: {
    padding: '8px',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: 'var(--radius-md, 8px)',
    color: 'var(--ak-text-tertiary, rgba(255, 255, 255, 0.4))',
    cursor: 'pointer',
  },
  modalContent: {
    padding: 'var(--spacing-4, 16px)',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-4, 16px)',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-2, 8px)',
  },
  formLabel: {
    fontSize: '13px',
    fontWeight: '500',
    color: 'var(--ak-text-secondary, rgba(255, 255, 255, 0.7))',
  },
  formInput: {
    padding: '10px 12px',
    backgroundColor: 'var(--ak-surface-dark, #0f0f1a)',
    border: '1px solid var(--ak-border, rgba(255, 255, 255, 0.1))',
    borderRadius: 'var(--radius-md, 8px)',
    color: 'var(--ak-text-primary, white)',
    fontSize: '14px',
  },
  formTextarea: {
    padding: '10px 12px',
    backgroundColor: 'var(--ak-surface-dark, #0f0f1a)',
    border: '1px solid var(--ak-border, rgba(255, 255, 255, 0.1))',
    borderRadius: 'var(--radius-md, 8px)',
    color: 'var(--ak-text-primary, white)',
    fontSize: '14px',
    minHeight: '100px',
    resize: 'vertical',
  },
  modalFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 'var(--spacing-2, 8px)',
    padding: 'var(--spacing-4, 16px)',
    borderTop: '1px solid var(--ak-border, rgba(255, 255, 255, 0.1))',
  },
  modalCancelButton: {
    padding: '10px 20px',
    backgroundColor: 'transparent',
    border: '1px solid var(--ak-border, rgba(255, 255, 255, 0.2))',
    borderRadius: 'var(--radius-md, 8px)',
    color: 'var(--ak-text-secondary, rgba(255, 255, 255, 0.7))',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
  },
  modalSubmitButton: {
    padding: '10px 20px',
    backgroundColor: 'var(--ak-primary, #6366f1)',
    border: 'none',
    borderRadius: 'var(--radius-md, 8px)',
    color: 'white',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
};

// Icons
const VideoRequestIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M23 7l-7 5 7 5V7z" />
    <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    <line x1="12" y1="9" x2="12" y2="15" />
    <line x1="9" y1="12" x2="15" y2="12" />
  </svg>
);

const CheckIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const CloseIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// Demo data
const DEMO_PLAYERS = [
  { id: '1', name: 'Magnus Olsen' },
  { id: '2', name: 'Emma Hansen' },
  { id: '3', name: 'Lars Berg' },
  { id: '4', name: 'Sofie Nilsen' },
];

const DEMO_VIDEOS = [
  {
    id: 'v1',
    title: 'Driver Swing',
    playerId: '1',
    playerName: 'Magnus Olsen',
    category: 'swing',
    duration: 45,
    reviewStatus: REVIEW_STATUS.PENDING,
    annotationCount: 0,
    thumbnailUrl: null,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'v2',
    title: 'Putting Practice',
    playerId: '2',
    playerName: 'Emma Hansen',
    category: 'putting',
    duration: 120,
    reviewStatus: REVIEW_STATUS.PENDING,
    annotationCount: 0,
    thumbnailUrl: null,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'v3',
    title: '7-iron Approach',
    playerId: '3',
    playerName: 'Lars Berg',
    category: 'swing',
    duration: 30,
    reviewStatus: REVIEW_STATUS.REVIEWED,
    annotationCount: 3,
    thumbnailUrl: null,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'v4',
    title: 'Bunker Shot',
    playerId: '1',
    playerName: 'Magnus Olsen',
    category: 'short_game',
    duration: 60,
    reviewStatus: REVIEW_STATUS.NEEDS_FOLLOWUP,
    annotationCount: 2,
    thumbnailUrl: null,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'v5',
    title: 'Chip and Run',
    playerId: '4',
    playerName: 'Sofie Nilsen',
    category: 'short_game',
    duration: 45,
    reviewStatus: REVIEW_STATUS.PENDING,
    annotationCount: 0,
    thumbnailUrl: null,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

/**
 * CoachVideosDashboard Component
 */
export function CoachVideosDashboard({
  style,
  className,
}) {
  const { token } = useAuth();

  // State
  const [videos, setVideos] = useState(DEMO_VIDEOS);
  const [players, setPlayers] = useState(DEMO_PLAYERS);
  const [loading, setLoading] = useState(false);
  const [selectedVideos, setSelectedVideos] = useState(new Set());
  const [filters, setFilters] = useState({
    playerId: '',
    status: '',
    category: '',
    search: '',
  });
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestForm, setRequestForm] = useState({
    playerId: '',
    drillType: '',
    instructions: '',
  });

  // Stats
  const stats = useMemo(() => {
    const pending = videos.filter((v) => v.reviewStatus === REVIEW_STATUS.PENDING).length;
    const reviewed = videos.filter((v) => v.reviewStatus === REVIEW_STATUS.REVIEWED).length;
    const needsFollowup = videos.filter((v) => v.reviewStatus === REVIEW_STATUS.NEEDS_FOLLOWUP).length;
    return { total: videos.length, pending, reviewed, needsFollowup };
  }, [videos]);

  // Filtered videos
  const filteredVideos = useMemo(() => {
    return videos.filter((video) => {
      if (filters.playerId && video.playerId !== filters.playerId) return false;
      if (filters.status && video.reviewStatus !== filters.status) return false;
      if (filters.category && video.category !== filters.category) return false;
      if (filters.search) {
        const search = filters.search.toLowerCase();
        if (!video.title.toLowerCase().includes(search) &&
            !video.playerName.toLowerCase().includes(search)) {
          return false;
        }
      }
      return true;
    });
  }, [videos, filters]);

  // Handle filter change
  const handleFilterChange = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
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

  // Handle clear selection
  const handleClearSelection = useCallback(() => {
    setSelectedVideos(new Set());
  }, []);

  // Handle batch mark reviewed
  const handleBatchMarkReviewed = useCallback(() => {
    setVideos((prev) =>
      prev.map((v) =>
        selectedVideos.has(v.id)
          ? { ...v, reviewStatus: REVIEW_STATUS.REVIEWED }
          : v
      )
    );
    setSelectedVideos(new Set());
  }, [selectedVideos]);

  // Handle single mark reviewed
  const handleMarkReviewed = useCallback((video) => {
    setVideos((prev) =>
      prev.map((v) =>
        v.id === video.id
          ? { ...v, reviewStatus: REVIEW_STATUS.REVIEWED }
          : v
      )
    );
  }, []);

  // Handle video click
  const handleVideoClick = useCallback((video) => {
    console.log('Open video:', video);
    // Would navigate to video analysis view
  }, []);

  // Handle annotate
  const handleAnnotate = useCallback((video) => {
    console.log('Annotate video:', video);
    // Would open video analyzer
  }, []);

  // Handle comment
  const handleComment = useCallback((video) => {
    console.log('Comment on video:', video);
    // Would open comment panel
  }, []);

  // Handle request form change
  const handleRequestFormChange = useCallback((key, value) => {
    setRequestForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  // Handle submit request
  const handleSubmitRequest = useCallback(async () => {
    console.log('Submitting video request:', requestForm);
    // Would call API to send request
    setShowRequestModal(false);
    setRequestForm({ playerId: '', drillType: '', instructions: '' });
  }, [requestForm]);

  return (
    <div className={className} style={{ ...styles.container, ...style }}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <h1 style={styles.title}>Spillervideoer</h1>
          <p style={styles.subtitle}>
            Gjennomgå og annotér videoer fra dine spillere
          </p>
        </div>
        <div style={styles.headerActions}>
          <button
            style={styles.requestButton}
            onClick={() => setShowRequestModal(true)}
          >
            <VideoRequestIcon />
            Be om video
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={styles.statsRow}>
        <div style={styles.statCard}>
          <span style={styles.statValue}>{stats.total}</span>
          <span style={styles.statLabel}>Totalt</span>
        </div>
        <div style={styles.statCard}>
          <span style={{ ...styles.statValue, color: 'var(--ak-warning, #f59e0b)' }}>
            {stats.pending}
          </span>
          <span style={styles.statLabel}>Venter</span>
        </div>
        <div style={styles.statCard}>
          <span style={{ ...styles.statValue, color: 'var(--ak-success, #22c55e)' }}>
            {stats.reviewed}
          </span>
          <span style={styles.statLabel}>Gjennomgått</span>
        </div>
        <div style={styles.statCard}>
          <span style={{ ...styles.statValue, color: 'var(--ak-error, #ef4444)' }}>
            {stats.needsFollowup}
          </span>
          <span style={styles.statLabel}>Oppfølging</span>
        </div>
      </div>

      {/* Pending Review Queue */}
      <PendingReviewQueue
        videos={videos}
        onVideoClick={handleVideoClick}
        onViewAll={() => handleFilterChange('status', REVIEW_STATUS.PENDING)}
      />

      {/* Filters */}
      <div style={styles.filtersRow}>
        <div style={styles.filterGroup}>
          <label style={styles.filterLabel}>Spiller</label>
          <select
            value={filters.playerId}
            onChange={(e) => handleFilterChange('playerId', e.target.value)}
            style={styles.filterSelect}
          >
            <option value="">Alle spillere</option>
            {players.map((player) => (
              <option key={player.id} value={player.id}>
                {player.name}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.filterGroup}>
          <label style={styles.filterLabel}>Status</label>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            style={styles.filterSelect}
          >
            <option value="">Alle statuser</option>
            <option value={REVIEW_STATUS.PENDING}>Venter</option>
            <option value={REVIEW_STATUS.IN_PROGRESS}>Under arbeid</option>
            <option value={REVIEW_STATUS.REVIEWED}>Gjennomgått</option>
            <option value={REVIEW_STATUS.NEEDS_FOLLOWUP}>Oppfølging</option>
          </select>
        </div>

        <div style={styles.filterGroup}>
          <label style={styles.filterLabel}>Kategori</label>
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            style={styles.filterSelect}
          >
            <option value="">Alle kategorier</option>
            <option value="swing">Full Swing</option>
            <option value="putting">Putting</option>
            <option value="short_game">Short Game</option>
            <option value="other">Annet</option>
          </select>
        </div>

        <div style={{ ...styles.filterGroup, flex: 1 }}>
          <label style={styles.filterLabel}>Søk</label>
          <input
            type="text"
            placeholder="Søk etter tittel eller spiller..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            style={styles.searchInput}
          />
        </div>
      </div>

      {/* Bulk actions bar */}
      {selectedVideos.size > 0 && (
        <div style={styles.bulkActionsBar}>
          <span style={styles.bulkCount}>
            {selectedVideos.size} valgt
          </span>
          <div style={styles.bulkActions}>
            <button
              style={styles.bulkButton}
              onClick={handleBatchMarkReviewed}
            >
              <CheckIcon />
              Merk gjennomgått
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

      {/* Video feed */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>
            Alle videoer ({filteredVideos.length})
          </h2>
        </div>
        <PlayerVideoFeed
          videos={filteredVideos}
          loading={loading}
          selectedVideos={selectedVideos}
          onVideoSelect={handleVideoSelect}
          onVideoClick={handleVideoClick}
          onAnnotate={handleAnnotate}
          onComment={handleComment}
          onMarkReviewed={handleMarkReviewed}
          selectable
        />
      </div>

      {/* Request Modal */}
      {showRequestModal && (
        <div
          style={styles.modalOverlay}
          onClick={(e) => e.target === e.currentTarget && setShowRequestModal(false)}
        >
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Be om video</h3>
              <button
                style={styles.modalClose}
                onClick={() => setShowRequestModal(false)}
              >
                <CloseIcon />
              </button>
            </div>

            <div style={styles.modalContent}>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Spiller</label>
                <select
                  value={requestForm.playerId}
                  onChange={(e) => handleRequestFormChange('playerId', e.target.value)}
                  style={styles.formInput}
                >
                  <option value="">Velg spiller...</option>
                  {players.map((player) => (
                    <option key={player.id} value={player.id}>
                      {player.name}
                    </option>
                  ))}
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Type øvelse</label>
                <select
                  value={requestForm.drillType}
                  onChange={(e) => handleRequestFormChange('drillType', e.target.value)}
                  style={styles.formInput}
                >
                  <option value="">Velg type...</option>
                  <option value="driver">Driver</option>
                  <option value="iron">Jern</option>
                  <option value="wedge">Wedge</option>
                  <option value="putting">Putting</option>
                  <option value="chipping">Chipping</option>
                  <option value="bunker">Bunker</option>
                  <option value="other">Annet</option>
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Instruksjoner</label>
                <textarea
                  value={requestForm.instructions}
                  onChange={(e) => handleRequestFormChange('instructions', e.target.value)}
                  style={styles.formTextarea}
                  placeholder="Beskriv hva du ønsker at spilleren skal filme..."
                />
              </div>
            </div>

            <div style={styles.modalFooter}>
              <button
                style={styles.modalCancelButton}
                onClick={() => setShowRequestModal(false)}
              >
                Avbryt
              </button>
              <button
                style={styles.modalSubmitButton}
                onClick={handleSubmitRequest}
                disabled={!requestForm.playerId}
              >
                Send forespørsel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CoachVideosDashboard;
