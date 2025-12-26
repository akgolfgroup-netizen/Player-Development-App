/**
 * ReferenceLibrary Component
 * Library for coach demo videos, pro references, and drill instructions
 *
 * Features:
 * - Grid display of reference videos
 * - Upload new reference videos
 * - Category and type filtering
 * - Search functionality
 * - Share videos with players
 * - Compare with player videos
 */

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReferenceVideoCard, REFERENCE_TYPES } from './ReferenceVideoCard';
import { useVideos } from '../../hooks/useVideos';
import { useVideoUpload, UPLOAD_STATES } from '../../hooks/useVideoUpload';
import * as videoApi from '../../services/videoApi';
import { coachesAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import { track } from '../../analytics/track';

// Video categories for golf
const VIDEO_CATEGORIES = [
  { value: '', label: 'Alle kategorier' },
  { value: 'full_swing', label: 'Full Swing' },
  { value: 'putting', label: 'Putting' },
  { value: 'chipping', label: 'Chipping' },
  { value: 'pitching', label: 'Pitching' },
  { value: 'bunker', label: 'Bunker' },
  { value: 'driver', label: 'Driver' },
  { value: 'iron', label: 'Jern' },
  { value: 'mental', label: 'Mental' },
  { value: 'warmup', label: 'Oppvarming' },
];

// Reference type options
const TYPE_OPTIONS = [
  { value: '', label: 'Alle typer' },
  { value: REFERENCE_TYPES.COACH_DEMO, label: 'Coach Demo' },
  { value: REFERENCE_TYPES.PRO_REFERENCE, label: 'Pro Referanse' },
  { value: REFERENCE_TYPES.DRILL_INSTRUCTION, label: 'Øvelse' },
  { value: REFERENCE_TYPES.TECHNIQUE_BREAKDOWN, label: 'Teknikk' },
];

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
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 'var(--spacing-3, 12px)',
    flexWrap: 'wrap',
  },
  titleSection: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-3, 12px)',
  },
  title: {
    margin: 0,
    fontSize: '20px',
    fontWeight: '700',
    color: 'var(--ak-text-primary, white)',
  },
  videoCount: {
    padding: '4px 10px',
    backgroundColor: 'var(--ak-surface-dark, #0f0f1a)',
    borderRadius: 'var(--radius-full, 9999px)',
    fontSize: '12px',
    fontWeight: '600',
    color: 'var(--ak-text-secondary, rgba(255, 255, 255, 0.7))',
  },
  uploadButton: {
    padding: '10px 20px',
    backgroundColor: 'var(--ak-primary, #6366f1)',
    border: 'none',
    borderRadius: 'var(--radius-md, 8px)',
    color: 'white',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-2, 8px)',
    transition: 'all 0.15s ease',
  },
  filters: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-3, 12px)',
    flexWrap: 'wrap',
    padding: 'var(--spacing-3, 12px)',
    backgroundColor: 'var(--ak-surface, #1a1a2e)',
    borderRadius: 'var(--radius-lg, 12px)',
    border: '1px solid var(--ak-border, rgba(255, 255, 255, 0.1))',
  },
  searchContainer: {
    flex: '1 1 200px',
    position: 'relative',
  },
  searchInput: {
    width: '100%',
    padding: '10px 12px 10px 36px',
    backgroundColor: 'var(--ak-surface-dark, #0f0f1a)',
    border: '1px solid var(--ak-border, rgba(255, 255, 255, 0.1))',
    borderRadius: 'var(--radius-md, 8px)',
    color: 'var(--ak-text-primary, white)',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.15s ease',
  },
  searchIcon: {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'var(--ak-text-tertiary, rgba(255, 255, 255, 0.4))',
    pointerEvents: 'none',
  },
  select: {
    padding: '10px 32px 10px 12px',
    backgroundColor: 'var(--ak-surface-dark, #0f0f1a)',
    border: '1px solid var(--ak-border, rgba(255, 255, 255, 0.1))',
    borderRadius: 'var(--radius-md, 8px)',
    color: 'var(--ak-text-primary, white)',
    fontSize: '14px',
    cursor: 'pointer',
    outline: 'none',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.5)' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 10px center',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: 'var(--spacing-4, 16px)',
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
    width: '64px',
    height: '64px',
    color: 'var(--ak-text-tertiary, rgba(255, 255, 255, 0.3))',
    marginBottom: 'var(--spacing-4, 16px)',
  },
  emptyTitle: {
    margin: '0 0 8px 0',
    fontSize: '18px',
    fontWeight: '600',
    color: 'var(--ak-text-primary, white)',
  },
  emptyText: {
    margin: '0 0 16px 0',
    fontSize: '14px',
    color: 'var(--ak-text-secondary, rgba(255, 255, 255, 0.7))',
    maxWidth: '300px',
  },
  // Upload modal styles
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
    maxWidth: '500px',
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
  closeButton: {
    width: '32px',
    height: '32px',
    borderRadius: 'var(--radius-md, 8px)',
    backgroundColor: 'transparent',
    border: 'none',
    color: 'var(--ak-text-secondary, rgba(255, 255, 255, 0.7))',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.15s ease',
  },
  modalBody: {
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
  label: {
    fontSize: '13px',
    fontWeight: '500',
    color: 'var(--ak-text-secondary, rgba(255, 255, 255, 0.7))',
  },
  input: {
    padding: '10px 12px',
    backgroundColor: 'var(--ak-surface-dark, #0f0f1a)',
    border: '1px solid var(--ak-border, rgba(255, 255, 255, 0.1))',
    borderRadius: 'var(--radius-md, 8px)',
    color: 'var(--ak-text-primary, white)',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.15s ease',
  },
  textarea: {
    padding: '10px 12px',
    backgroundColor: 'var(--ak-surface-dark, #0f0f1a)',
    border: '1px solid var(--ak-border, rgba(255, 255, 255, 0.1))',
    borderRadius: 'var(--radius-md, 8px)',
    color: 'var(--ak-text-primary, white)',
    fontSize: '14px',
    outline: 'none',
    resize: 'vertical',
    minHeight: '80px',
    fontFamily: 'inherit',
  },
  dropZone: {
    padding: 'var(--spacing-6, 24px)',
    border: '2px dashed var(--ak-border, rgba(255, 255, 255, 0.2))',
    borderRadius: 'var(--radius-lg, 12px)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--spacing-3, 12px)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  dropZoneActive: {
    borderColor: 'var(--ak-primary, #6366f1)',
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
  },
  dropZoneIcon: {
    width: '48px',
    height: '48px',
    color: 'var(--ak-text-tertiary, rgba(255, 255, 255, 0.4))',
  },
  dropZoneText: {
    fontSize: '14px',
    color: 'var(--ak-text-secondary, rgba(255, 255, 255, 0.7))',
    textAlign: 'center',
  },
  dropZoneHint: {
    fontSize: '12px',
    color: 'var(--ak-text-tertiary, rgba(255, 255, 255, 0.5))',
  },
  selectedFile: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-3, 12px)',
    padding: 'var(--spacing-3, 12px)',
    backgroundColor: 'var(--ak-surface-dark, #0f0f1a)',
    borderRadius: 'var(--radius-md, 8px)',
  },
  fileIcon: {
    width: '40px',
    height: '40px',
    borderRadius: 'var(--radius-md, 8px)',
    backgroundColor: 'var(--ak-primary, #6366f1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
  },
  fileInfo: {
    flex: 1,
    minWidth: 0,
  },
  fileName: {
    fontSize: '13px',
    fontWeight: '500',
    color: 'var(--ak-text-primary, white)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  fileSize: {
    fontSize: '12px',
    color: 'var(--ak-text-tertiary, rgba(255, 255, 255, 0.5))',
  },
  removeFileButton: {
    width: '28px',
    height: '28px',
    borderRadius: 'var(--radius-sm, 4px)',
    backgroundColor: 'transparent',
    border: 'none',
    color: 'var(--ak-text-tertiary, rgba(255, 255, 255, 0.5))',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalFooter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 'var(--spacing-3, 12px)',
    padding: 'var(--spacing-4, 16px)',
    borderTop: '1px solid var(--ak-border, rgba(255, 255, 255, 0.1))',
  },
  cancelButton: {
    padding: '10px 20px',
    backgroundColor: 'transparent',
    border: '1px solid var(--ak-border, rgba(255, 255, 255, 0.2))',
    borderRadius: 'var(--radius-md, 8px)',
    color: 'var(--ak-text-secondary, rgba(255, 255, 255, 0.7))',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
  },
  submitButton: {
    padding: '10px 20px',
    backgroundColor: 'var(--ak-primary, #6366f1)',
    border: 'none',
    borderRadius: 'var(--radius-md, 8px)',
    color: 'white',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  submitButtonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  deleteButton: {
    padding: '10px 20px',
    backgroundColor: 'var(--color-danger, #dc3545)',
    border: 'none',
    borderRadius: 'var(--radius-md, 8px)',
    color: 'white',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  // Share modal styles
  shareModal: {
    maxWidth: '400px',
  },
  playerList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-2, 8px)',
    maxHeight: '300px',
    overflowY: 'auto',
  },
  playerItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-3, 12px)',
    padding: 'var(--spacing-3, 12px)',
    backgroundColor: 'var(--ak-surface-dark, #0f0f1a)',
    borderRadius: 'var(--radius-md, 8px)',
    cursor: 'pointer',
    transition: 'background-color 0.15s ease',
  },
  playerItemSelected: {
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    outline: '1px solid var(--ak-primary, #6366f1)',
  },
  playerAvatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: 'var(--ak-primary, #6366f1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: '600',
    color: 'white',
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: '14px',
    fontWeight: '500',
    color: 'var(--ak-text-primary, white)',
  },
  playerLevel: {
    fontSize: '12px',
    color: 'var(--ak-text-tertiary, rgba(255, 255, 255, 0.5))',
  },
  checkbox: {
    width: '20px',
    height: '20px',
    borderRadius: 'var(--radius-sm, 4px)',
    border: '2px solid var(--ak-border, rgba(255, 255, 255, 0.3))',
    backgroundColor: 'transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.15s ease',
  },
  checkboxChecked: {
    backgroundColor: 'var(--ak-primary, #6366f1)',
    borderColor: 'var(--ak-primary, #6366f1)',
  },
};

// Icons
const PlusIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const SearchIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const FolderVideoIcon = ({ size = 64 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    <polygon points="10 9 16 12 10 15 10 9" fill="currentColor" />
  </svg>
);

const UploadIcon = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

const XIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const VideoIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
  </svg>
);

const CheckIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

/**
 * Format file size for display
 */
function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Demo videos for development
 */
const DEMO_VIDEOS = [
  {
    id: '1',
    title: 'Full Swing Grunnlag',
    description: 'Grunnleggende teknikk for full swing med fokus på grip og stance.',
    type: REFERENCE_TYPES.COACH_DEMO,
    category: 'full_swing',
    duration: 185,
    thumbnailUrl: null,
    viewCount: 47,
    sharedWith: 12,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    title: 'Tiger Woods - Impact Position',
    description: 'Analyse av Tigers impact position og hvordan oppnå lignende.',
    type: REFERENCE_TYPES.PRO_REFERENCE,
    category: 'full_swing',
    duration: 124,
    thumbnailUrl: null,
    viewCount: 89,
    sharedWith: 18,
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    title: 'Putting Grønnlesing',
    description: 'Hvordan lese greenen og velge riktig linje.',
    type: REFERENCE_TYPES.DRILL_INSTRUCTION,
    category: 'putting',
    duration: 210,
    thumbnailUrl: null,
    viewCount: 34,
    sharedWith: 8,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    title: 'Chip & Run Teknikk',
    description: 'Steg-for-steg gjennomgang av chip and run shot.',
    type: REFERENCE_TYPES.TECHNIQUE_BREAKDOWN,
    category: 'chipping',
    duration: 156,
    thumbnailUrl: null,
    viewCount: 56,
    sharedWith: 15,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '5',
    title: 'Bunker Shot Øvelse',
    description: '3 øvelser for å forbedre bunker-spillet ditt.',
    type: REFERENCE_TYPES.DRILL_INSTRUCTION,
    category: 'bunker',
    duration: 278,
    thumbnailUrl: null,
    viewCount: 23,
    sharedWith: 6,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

/**
 * Demo players for development
 */
const DEMO_PLAYERS = [
  { id: '1', name: 'Emma Hansen', level: 'Grønn', initials: 'EH' },
  { id: '2', name: 'Oliver Berg', level: 'Blå', initials: 'OB' },
  { id: '3', name: 'Nora Olsen', level: 'Rød', initials: 'NO' },
  { id: '4', name: 'Henrik Nilsen', level: 'Hvit', initials: 'HN' },
  { id: '5', name: 'Maja Andersen', level: 'Grønn', initials: 'MA' },
];

/**
 * ReferenceLibrary Component
 */
export function ReferenceLibrary({
  videos: propVideos,
  players: propPlayers,
  onUpload,
  onShare,
  onCompare,
  onEdit,
  onDelete,
  onPlay,
  style,
  className,
}) {
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const currentUserId = user?.id;

  // Fetch videos from API - filter for reference/coach videos
  const {
    videos: apiVideos,
    loading,
    error,
    refresh: refetchVideos,
    removeVideoFromList,
    addVideoToList,
  } = useVideos({
    status: 'ready',
    // TODO: Add visibility='reference' filter when backend supports it
    autoFetch: true,
  });

  // Video upload hook
  const upload = useVideoUpload({
    onUploadComplete: (video) => {
      // Add to list and close modal
      addVideoToList(video);
      setShowUploadModal(false);
      resetUploadForm();
    },
    onError: (err) => {
      console.error('Upload failed:', err);
    },
  });

  // Players state
  const [players, setPlayers] = useState([]);
  const [playersLoading, setPlayersLoading] = useState(true);

  // Fetch players/athletes on mount
  useEffect(() => {
    async function fetchPlayers() {
      if (propPlayers) {
        setPlayers(propPlayers);
        setPlayersLoading(false);
        return;
      }

      try {
        setPlayersLoading(true);
        const response = await coachesAPI.getAthletes();
        const athleteData = response.data?.data || response.data || [];
        const mappedPlayers = athleteData.map(p => ({
          id: p.id || p.playerId,
          name: p.name || `${p.firstName || ''} ${p.lastName || ''}`.trim() || 'Ukjent spiller',
          level: p.level || p.tier || '',
          initials: getInitials(p.name || `${p.firstName || ''} ${p.lastName || ''}`),
        }));
        setPlayers(mappedPlayers.length > 0 ? mappedPlayers : DEMO_PLAYERS);
      } catch (err) {
        console.error('Failed to fetch players:', err);
        setPlayers(DEMO_PLAYERS);
      } finally {
        setPlayersLoading(false);
      }
    }
    fetchPlayers();
  }, [propPlayers]);

  // Map API videos to expected format
  const videos = useMemo(() => {
    if (propVideos) return propVideos;
    if (apiVideos.length > 0) {
      return apiVideos.map(v => ({
        id: v.id,
        title: v.title,
        description: v.description,
        type: v.referenceType || v.type || REFERENCE_TYPES.COACH_DEMO,
        category: v.category || 'full_swing',
        duration: v.duration,
        thumbnailUrl: v.thumbnailUrl,
        viewCount: v.viewCount || 0,
        sharedWith: v.sharedWithCount || v.sharedWith || 0,
        createdAt: v.createdAt,
        uploadedById: v.uploadedById || v.playerId,
      }));
    }
    return DEMO_VIDEOS;
  }, [propVideos, apiVideos]);

  // Get initials helper
  function getInitials(name) {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedPlayers, setSelectedPlayers] = useState(new Set());

  // Upload form state
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    type: REFERENCE_TYPES.COACH_DEMO,
    category: 'full_swing',
    file: null,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState(null);

  // Reset upload form
  const resetUploadForm = useCallback(() => {
    setUploadForm({
      title: '',
      description: '',
      type: REFERENCE_TYPES.COACH_DEMO,
      category: 'full_swing',
      file: null,
    });
    upload.reset();
  }, [upload]);

  // Filter videos
  const filteredVideos = useMemo(() => {
    return videos.filter((video) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = video.title.toLowerCase().includes(query);
        const matchesDescription = video.description?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDescription) return false;
      }

      // Category filter
      if (categoryFilter && video.category !== categoryFilter) return false;

      // Type filter
      if (typeFilter && video.type !== typeFilter) return false;

      return true;
    });
  }, [videos, searchQuery, categoryFilter, typeFilter]);

  // Handle video play - navigate to video player
  const handlePlay = useCallback((video) => {
    if (onPlay) {
      onPlay(video);
    } else {
      navigate(`/coach/videos/${video.id}/view`);
    }
  }, [onPlay, navigate]);

  // Handle share click
  const handleShareClick = useCallback((video) => {
    setSelectedVideo(video);
    setSelectedPlayers(new Set());
    setShowShareModal(true);
  }, []);

  // Handle share confirm - call API
  const handleShareConfirm = useCallback(async () => {
    if (!selectedVideo || selectedPlayers.size === 0 || isSharing) return;

    setIsSharing(true);
    try {
      // Call share callback or API
      if (onShare) {
        await onShare(selectedVideo, Array.from(selectedPlayers));
      } else {
        // Call video share API
        const result = await videoApi.shareVideo(selectedVideo.id, Array.from(selectedPlayers));
        console.log('Video shared:', result);
      }

      // Track analytics
      track('video_shared', {
        videoId: selectedVideo.id,
        count: selectedPlayers.size,
        source: 'reference_library',
      });

      // Success feedback
      showNotification(
        `Video delt med ${selectedPlayers.size} ${selectedPlayers.size === 1 ? 'spiller' : 'spillere'}!`,
        'success'
      );

      setShowShareModal(false);
      setSelectedVideo(null);
      setSelectedPlayers(new Set());
    } catch (err) {
      console.error('Failed to share video:', err);
      showNotification('Kunne ikke dele video. Prøv igjen.', 'error');
    } finally {
      setIsSharing(false);
    }
  }, [selectedVideo, selectedPlayers, isSharing, onShare, showNotification]);

  // Handle player toggle
  const handlePlayerToggle = useCallback((playerId) => {
    setSelectedPlayers((prev) => {
      const next = new Set(prev);
      if (next.has(playerId)) {
        next.delete(playerId);
      } else {
        next.add(playerId);
      }
      return next;
    });
  }, []);

  // Handle compare - navigate to comparison view
  const handleCompare = useCallback((video) => {
    if (onCompare) {
      onCompare(video);
    } else {
      navigate(`/coach/videos/compare?reference=${video.id}`);
    }
  }, [onCompare, navigate]);

  // Handle edit - navigate to edit view
  const handleEdit = useCallback((video) => {
    if (onEdit) {
      onEdit(video);
    } else {
      navigate(`/coach/videos/${video.id}/edit`);
    }
  }, [onEdit, navigate]);

  // Handle delete - show confirmation modal
  const handleDelete = useCallback((video) => {
    if (isDeleting) return;
    setVideoToDelete(video);
  }, [isDeleting]);

  // Confirm and execute deletion
  const handleConfirmDelete = useCallback(async () => {
    if (!videoToDelete) return;

    setIsDeleting(true);
    try {
      if (onDelete) {
        await onDelete(videoToDelete);
      } else {
        await videoApi.deleteVideo(videoToDelete.id);
      }
      // Remove from local list
      removeVideoFromList(videoToDelete.id);
      showNotification('Video slettet', 'success');
    } catch (err) {
      console.error('Failed to delete video:', err);
      showNotification('Kunne ikke slette video. Prøv igjen.', 'error');
    } finally {
      setIsDeleting(false);
      setVideoToDelete(null);
    }
  }, [videoToDelete, onDelete, removeVideoFromList, showNotification]);

  // Handle file drop
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer?.files?.[0];
    if (file && file.type.startsWith('video/')) {
      setUploadForm((prev) => ({ ...prev, file }));
    }
  }, []);

  // Handle file select
  const handleFileSelect = useCallback((e) => {
    const file = e.target?.files?.[0];
    if (file) {
      setUploadForm((prev) => ({ ...prev, file }));
    }
  }, []);

  // Handle upload submit - use upload hook or callback
  const handleUploadSubmit = useCallback(async () => {
    if (!uploadForm.title || !uploadForm.file) return;

    if (onUpload) {
      // Use callback if provided
      await onUpload(uploadForm);
      setShowUploadModal(false);
      resetUploadForm();
    } else {
      // Use the upload hook - set file and metadata, then start upload
      upload.handleFileSelect({ target: { files: [uploadForm.file] } });
      upload.updateMetadata('title', uploadForm.title);
      upload.updateMetadata('description', uploadForm.description);
      upload.updateMetadata('category', uploadForm.category);

      // Wait for file to be validated, then start upload
      setTimeout(() => {
        if (upload.uploadState === UPLOAD_STATES.READY) {
          upload.startUpload();
        }
      }, 100);
    }
  }, [uploadForm, onUpload, upload, resetUploadForm]);

  // Check if current user is owner
  const isOwner = useCallback((video) => {
    return video.uploadedById === currentUserId || !video.uploadedById;
  }, [currentUserId]);

  // Loading state
  if (loading && videos.length === 0) {
    return (
      <div className={className} style={{ ...styles.container, ...style }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            border: '3px solid var(--ak-border, rgba(255, 255, 255, 0.1))',
            borderTopColor: 'var(--ak-primary, #6366f1)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }} />
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div className={className} style={{ ...styles.container, ...style }}>
      {/* Error state */}
      {error && (
        <div style={{
          padding: 'var(--spacing-4, 16px)',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          borderRadius: 'var(--radius-lg, 12px)',
          border: '1px solid var(--ak-error, #ef4444)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 'var(--spacing-4, 16px)',
        }}>
          <span style={{ color: 'var(--ak-text-primary, white)', fontSize: '14px' }}>
            {error}
          </span>
          <button
            onClick={refetchVideos}
            style={{
              padding: '8px 16px',
              backgroundColor: 'var(--ak-error, #ef4444)',
              border: 'none',
              borderRadius: 'var(--radius-md, 8px)',
              color: 'white',
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer',
            }}
          >
            Prøv igjen
          </button>
        </div>
      )}

      {/* Header */}
      <div style={styles.header}>
        <div style={styles.titleSection}>
          <h2 style={styles.title}>Referansebibliotek</h2>
          <span style={styles.videoCount}>{videos.length} videoer</span>
        </div>
        <button
          style={styles.uploadButton}
          onClick={() => setShowUploadModal(true)}
        >
          <PlusIcon />
          Last opp video
        </button>
      </div>

      {/* Filters */}
      <div style={styles.filters}>
        <div style={styles.searchContainer}>
          <SearchIcon style={styles.searchIcon} />
          <input
            type="text"
            placeholder="Søk i videoer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          style={styles.select}
        >
          {VIDEO_CATEGORIES.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          style={styles.select}
        >
          {TYPE_OPTIONS.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      {/* Video grid */}
      {filteredVideos.length > 0 ? (
        <div style={styles.grid}>
          {filteredVideos.map((video) => (
            <ReferenceVideoCard
              key={video.id}
              video={video}
              isOwner={isOwner(video)}
              onPlay={handlePlay}
              onShare={handleShareClick}
              onCompare={handleCompare}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div style={styles.emptyState}>
          <FolderVideoIcon style={styles.emptyIcon} />
          <h3 style={styles.emptyTitle}>Ingen videoer funnet</h3>
          <p style={styles.emptyText}>
            {searchQuery || categoryFilter || typeFilter
              ? 'Prøv å justere søket eller filtrene dine.'
              : 'Last opp din første referansevideo for å komme i gang.'}
          </p>
          {!searchQuery && !categoryFilter && !typeFilter && (
            <button
              style={styles.uploadButton}
              onClick={() => setShowUploadModal(true)}
            >
              <PlusIcon />
              Last opp video
            </button>
          )}
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div style={styles.modalOverlay} onClick={() => setShowUploadModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Last opp referansevideo</h3>
              <button
                style={styles.closeButton}
                onClick={() => setShowUploadModal(false)}
              >
                <XIcon />
              </button>
            </div>
            <div style={styles.modalBody}>
              {/* File upload */}
              {!uploadForm.file ? (
                <div
                  style={{
                    ...styles.dropZone,
                    ...(isDragging ? styles.dropZoneActive : {}),
                  }}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('file-input').click()}
                >
                  <UploadIcon style={styles.dropZoneIcon} />
                  <span style={styles.dropZoneText}>
                    Dra og slipp video her, eller klikk for å velge
                  </span>
                  <span style={styles.dropZoneHint}>
                    MP4, MOV, WebM (maks 5 min)
                  </span>
                  <input
                    id="file-input"
                    type="file"
                    accept="video/*"
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                  />
                </div>
              ) : (
                <div style={styles.selectedFile}>
                  <div style={styles.fileIcon}>
                    <VideoIcon />
                  </div>
                  <div style={styles.fileInfo}>
                    <div style={styles.fileName}>{uploadForm.file.name}</div>
                    <div style={styles.fileSize}>
                      {formatFileSize(uploadForm.file.size)}
                    </div>
                  </div>
                  <button
                    style={styles.removeFileButton}
                    onClick={() => setUploadForm((prev) => ({ ...prev, file: null }))}
                  >
                    <XIcon size={16} />
                  </button>
                </div>
              )}

              {/* Title */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Tittel *</label>
                <input
                  type="text"
                  placeholder="F.eks. Full Swing Grunnlag"
                  value={uploadForm.title}
                  onChange={(e) => setUploadForm((prev) => ({ ...prev, title: e.target.value }))}
                  style={styles.input}
                />
              </div>

              {/* Description */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Beskrivelse</label>
                <textarea
                  placeholder="Beskriv hva videoen viser..."
                  value={uploadForm.description}
                  onChange={(e) => setUploadForm((prev) => ({ ...prev, description: e.target.value }))}
                  style={styles.textarea}
                />
              </div>

              {/* Type */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Type</label>
                <select
                  value={uploadForm.type}
                  onChange={(e) => setUploadForm((prev) => ({ ...prev, type: e.target.value }))}
                  style={styles.select}
                >
                  {TYPE_OPTIONS.slice(1).map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Kategori</label>
                <select
                  value={uploadForm.category}
                  onChange={(e) => setUploadForm((prev) => ({ ...prev, category: e.target.value }))}
                  style={styles.select}
                >
                  {VIDEO_CATEGORIES.slice(1).map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div style={styles.modalFooter}>
              <button
                style={styles.cancelButton}
                onClick={() => setShowUploadModal(false)}
              >
                Avbryt
              </button>
              <button
                style={{
                  ...styles.submitButton,
                  ...(!uploadForm.title || !uploadForm.file ? styles.submitButtonDisabled : {}),
                }}
                onClick={handleUploadSubmit}
                disabled={!uploadForm.title || !uploadForm.file}
              >
                Last opp
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && selectedVideo && (
        <div style={styles.modalOverlay} onClick={() => setShowShareModal(false)}>
          <div style={{ ...styles.modal, ...styles.shareModal }} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Del med spillere</h3>
              <button
                style={styles.closeButton}
                onClick={() => setShowShareModal(false)}
              >
                <XIcon />
              </button>
            </div>
            <div style={styles.modalBody}>
              <p style={{ margin: 0, fontSize: '14px', color: 'var(--ak-text-secondary)' }}>
                Velg spillere som skal få tilgang til "{selectedVideo.title}"
              </p>
              <div style={styles.playerList}>
                {players.map((player) => {
                  const isSelected = selectedPlayers.has(player.id);
                  return (
                    <div
                      key={player.id}
                      style={{
                        ...styles.playerItem,
                        ...(isSelected ? styles.playerItemSelected : {}),
                      }}
                      onClick={() => handlePlayerToggle(player.id)}
                    >
                      <div style={styles.playerAvatar}>{player.initials}</div>
                      <div style={styles.playerInfo}>
                        <div style={styles.playerName}>{player.name}</div>
                        <div style={styles.playerLevel}>{player.level}</div>
                      </div>
                      <div
                        style={{
                          ...styles.checkbox,
                          ...(isSelected ? styles.checkboxChecked : {}),
                        }}
                      >
                        {isSelected && <CheckIcon />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div style={styles.modalFooter}>
              <button
                style={styles.cancelButton}
                onClick={() => setShowShareModal(false)}
              >
                Avbryt
              </button>
              <button
                style={{
                  ...styles.submitButton,
                  ...(selectedPlayers.size === 0 ? styles.submitButtonDisabled : {}),
                }}
                onClick={handleShareConfirm}
                disabled={selectedPlayers.size === 0}
              >
                Del med {selectedPlayers.size} {selectedPlayers.size === 1 ? 'spiller' : 'spillere'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {videoToDelete && (
        <div style={styles.modalOverlay} onClick={() => setVideoToDelete(null)}>
          <div style={{ ...styles.modal, ...styles.shareModal }} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Slett video</h3>
              <button
                style={styles.closeButton}
                onClick={() => setVideoToDelete(null)}
              >
                <XIcon />
              </button>
            </div>
            <div style={styles.modalBody}>
              <p style={{ margin: 0, color: 'var(--ak-text-secondary, rgba(255, 255, 255, 0.7))' }}>
                Er du sikker på at du vil slette "{videoToDelete.title}"?
                Denne handlingen kan ikke angres.
              </p>
            </div>
            <div style={styles.modalFooter}>
              <button
                style={styles.cancelButton}
                onClick={() => setVideoToDelete(null)}
              >
                Avbryt
              </button>
              <button
                style={styles.deleteButton}
                onClick={handleConfirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'Sletter...' : 'Slett video'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReferenceLibrary;
