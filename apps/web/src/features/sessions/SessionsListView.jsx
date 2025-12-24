/**
 * SessionsListView - Training sessions overview with filtering
 *
 * Shows list of all training sessions with:
 * - Filter by status, type, period, date range
 * - Session cards with key info
 * - Navigation to session detail/evaluation
 */
import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { tokens, typographyStyle } from '../../design-tokens';
import {
  Calendar, Clock, Target, Filter, Plus, ChevronRight,
  CheckCircle, AlertCircle, XCircle, Play, Search
} from 'lucide-react';

// Session type labels
const SESSION_TYPE_LABELS = {
  driving_range: 'Driving Range',
  putting: 'Putting',
  chipping: 'Chipping',
  pitching: 'Pitching',
  bunker: 'Bunker',
  course_play: 'Banespill',
  physical: 'Fysisk',
  mental: 'Mental',
};

// Status config
const STATUS_CONFIG = {
  in_progress: {
    label: 'Pagar',
    color: tokens.colors.warning,
    icon: Play,
    bg: `${tokens.colors.warning}15`,
  },
  completed: {
    label: 'Fullfort',
    color: tokens.colors.success,
    icon: CheckCircle,
    bg: `${tokens.colors.success}15`,
  },
  auto_completed: {
    label: 'Auto-fullfort',
    color: tokens.colors.steel,
    icon: AlertCircle,
    bg: `${tokens.colors.steel}15`,
  },
  abandoned: {
    label: 'Avbrutt',
    color: tokens.colors.error,
    icon: XCircle,
    bg: `${tokens.colors.error}15`,
  },
};

// Period labels
const PERIOD_LABELS = {
  E: 'Etablering',
  G: 'Grunn',
  S: 'Spesifikk',
  T: 'Topp',
};

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

function FilterBar({ filters, onFilterChange, onSearch }) {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div style={{ marginBottom: tokens.spacing.lg }}>
      {/* Search and filter toggle */}
      <div style={{ display: 'flex', gap: tokens.spacing.sm, marginBottom: tokens.spacing.md }}>
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            gap: tokens.spacing.sm,
            padding: tokens.spacing.sm,
            backgroundColor: tokens.colors.white,
            borderRadius: tokens.borderRadius.md,
            border: `1px solid ${tokens.colors.mist}`,
          }}
        >
          <Search size={18} color={tokens.colors.steel} />
          <input
            type="text"
            placeholder="Sok i okter..."
            value={filters.search || ''}
            onChange={(e) => onSearch(e.target.value)}
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              ...typographyStyle('body'),
            }}
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: tokens.spacing.xs,
            padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
            backgroundColor: showFilters ? tokens.colors.primary : tokens.colors.white,
            color: showFilters ? tokens.colors.white : tokens.colors.charcoal,
            border: `1px solid ${showFilters ? tokens.colors.primary : tokens.colors.mist}`,
            borderRadius: tokens.borderRadius.md,
            cursor: 'pointer',
            ...typographyStyle('label'),
          }}
        >
          <Filter size={16} />
          Filter
        </button>
      </div>

      {/* Expanded filters */}
      {showFilters && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: tokens.spacing.md,
            padding: tokens.spacing.md,
            backgroundColor: tokens.colors.white,
            borderRadius: tokens.borderRadius.md,
            border: `1px solid ${tokens.colors.mist}`,
          }}
        >
          {/* Status filter */}
          <div>
            <label style={{ ...typographyStyle('caption'), color: tokens.colors.steel, display: 'block', marginBottom: tokens.spacing.xs }}>
              Status
            </label>
            <select
              value={filters.completionStatus || ''}
              onChange={(e) => onFilterChange('completionStatus', e.target.value || null)}
              style={{
                width: '100%',
                padding: tokens.spacing.sm,
                borderRadius: tokens.borderRadius.sm,
                border: `1px solid ${tokens.colors.mist}`,
                ...typographyStyle('body'),
              }}
            >
              <option value="">Alle</option>
              <option value="in_progress">Pagar</option>
              <option value="completed">Fullfort</option>
              <option value="auto_completed">Auto-fullfort</option>
              <option value="abandoned">Avbrutt</option>
            </select>
          </div>

          {/* Session type filter */}
          <div>
            <label style={{ ...typographyStyle('caption'), color: tokens.colors.steel, display: 'block', marginBottom: tokens.spacing.xs }}>
              Type
            </label>
            <select
              value={filters.sessionType || ''}
              onChange={(e) => onFilterChange('sessionType', e.target.value || null)}
              style={{
                width: '100%',
                padding: tokens.spacing.sm,
                borderRadius: tokens.borderRadius.sm,
                border: `1px solid ${tokens.colors.mist}`,
                ...typographyStyle('body'),
              }}
            >
              <option value="">Alle typer</option>
              {Object.entries(SESSION_TYPE_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

          {/* Period filter */}
          <div>
            <label style={{ ...typographyStyle('caption'), color: tokens.colors.steel, display: 'block', marginBottom: tokens.spacing.xs }}>
              Periode
            </label>
            <select
              value={filters.period || ''}
              onChange={(e) => onFilterChange('period', e.target.value || null)}
              style={{
                width: '100%',
                padding: tokens.spacing.sm,
                borderRadius: tokens.borderRadius.sm,
                border: `1px solid ${tokens.colors.mist}`,
                ...typographyStyle('body'),
              }}
            >
              <option value="">Alle perioder</option>
              {Object.entries(PERIOD_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

          {/* Date from */}
          <div>
            <label style={{ ...typographyStyle('caption'), color: tokens.colors.steel, display: 'block', marginBottom: tokens.spacing.xs }}>
              Fra dato
            </label>
            <input
              type="date"
              value={filters.fromDate || ''}
              onChange={(e) => onFilterChange('fromDate', e.target.value || null)}
              style={{
                width: '100%',
                padding: tokens.spacing.sm,
                borderRadius: tokens.borderRadius.sm,
                border: `1px solid ${tokens.colors.mist}`,
                ...typographyStyle('body'),
              }}
            />
          </div>

          {/* Date to */}
          <div>
            <label style={{ ...typographyStyle('caption'), color: tokens.colors.steel, display: 'block', marginBottom: tokens.spacing.xs }}>
              Til dato
            </label>
            <input
              type="date"
              value={filters.toDate || ''}
              onChange={(e) => onFilterChange('toDate', e.target.value || null)}
              style={{
                width: '100%',
                padding: tokens.spacing.sm,
                borderRadius: tokens.borderRadius.sm,
                border: `1px solid ${tokens.colors.mist}`,
                ...typographyStyle('body'),
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function SessionCard({ session, onClick }) {
  const statusConfig = STATUS_CONFIG[session.completionStatus] || STATUS_CONFIG.in_progress;
  const StatusIcon = statusConfig.icon;
  const sessionDate = new Date(session.sessionDate);

  return (
    <div
      onClick={onClick}
      style={{
        backgroundColor: tokens.colors.white,
        borderRadius: tokens.borderRadius.lg,
        padding: tokens.spacing.md,
        marginBottom: tokens.spacing.md,
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          {/* Session type and status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing.sm, marginBottom: tokens.spacing.sm }}>
            <span style={{ ...typographyStyle('title3'), color: tokens.colors.charcoal }}>
              {SESSION_TYPE_LABELS[session.sessionType] || session.sessionType}
            </span>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 8px',
                backgroundColor: statusConfig.bg,
                color: statusConfig.color,
                borderRadius: tokens.borderRadius.sm,
                ...typographyStyle('caption'),
              }}
            >
              <StatusIcon size={12} />
              {statusConfig.label}
            </span>
          </div>

          {/* Date and duration */}
          <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing.md, marginBottom: tokens.spacing.sm }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing.xs }}>
              <Calendar size={14} color={tokens.colors.steel} />
              <span style={{ ...typographyStyle('caption'), color: tokens.colors.steel }}>
                {sessionDate.toLocaleDateString('nb-NO', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing.xs }}>
              <Clock size={14} color={tokens.colors.steel} />
              <span style={{ ...typographyStyle('caption'), color: tokens.colors.steel }}>
                {session.duration} min
              </span>
            </div>
          </div>

          {/* Focus area */}
          {session.focusArea && (
            <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing.xs }}>
              <Target size={14} color={tokens.colors.primary} />
              <span style={{ ...typographyStyle('body'), color: tokens.colors.charcoal }}>
                {session.focusArea}
              </span>
            </div>
          )}

          {/* Evaluation ratings (if completed) */}
          {session.completionStatus === 'completed' && session.evaluationFocus && (
            <div style={{ display: 'flex', gap: tokens.spacing.md, marginTop: tokens.spacing.sm }}>
              <span style={{ ...typographyStyle('caption'), color: tokens.colors.steel }}>
                Fokus: {session.evaluationFocus}/10
              </span>
              <span style={{ ...typographyStyle('caption'), color: tokens.colors.steel }}>
                Teknikk: {session.evaluationTechnical}/10
              </span>
            </div>
          )}
        </div>

        <ChevronRight size={20} color={tokens.colors.steel} />
      </div>
    </div>
  );
}

function EmptyState({ onCreateNew }) {
  return (
    <div
      style={{
        textAlign: 'center',
        padding: tokens.spacing.xl,
        backgroundColor: tokens.colors.white,
        borderRadius: tokens.borderRadius.lg,
      }}
    >
      <Calendar size={48} color={tokens.colors.steel} style={{ marginBottom: tokens.spacing.md }} />
      <h3 style={{ ...typographyStyle('title3'), color: tokens.colors.charcoal, marginBottom: tokens.spacing.sm }}>
        Ingen okter funnet
      </h3>
      <p style={{ ...typographyStyle('body'), color: tokens.colors.steel, marginBottom: tokens.spacing.lg }}>
        Du har ingen treningsokter som matcher filtrene dine.
      </p>
      <button
        onClick={onCreateNew}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: tokens.spacing.sm,
          padding: `${tokens.spacing.sm} ${tokens.spacing.lg}`,
          backgroundColor: tokens.colors.primary,
          color: tokens.colors.white,
          border: 'none',
          borderRadius: tokens.borderRadius.md,
          cursor: 'pointer',
          ...typographyStyle('label'),
        }}
      >
        <Plus size={16} />
        Opprett ny okt
      </button>
    </div>
  );
}

function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: tokens.spacing.sm,
        marginTop: tokens.spacing.lg,
      }}
    >
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        style={{
          padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
          backgroundColor: page <= 1 ? tokens.colors.mist : tokens.colors.white,
          color: page <= 1 ? tokens.colors.steel : tokens.colors.charcoal,
          border: `1px solid ${tokens.colors.mist}`,
          borderRadius: tokens.borderRadius.sm,
          cursor: page <= 1 ? 'not-allowed' : 'pointer',
          ...typographyStyle('body'),
        }}
      >
        Forrige
      </button>
      <span style={{ ...typographyStyle('body'), color: tokens.colors.charcoal }}>
        Side {page} av {totalPages}
      </span>
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        style={{
          padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
          backgroundColor: page >= totalPages ? tokens.colors.mist : tokens.colors.white,
          color: page >= totalPages ? tokens.colors.steel : tokens.colors.charcoal,
          border: `1px solid ${tokens.colors.mist}`,
          borderRadius: tokens.borderRadius.sm,
          cursor: page >= totalPages ? 'not-allowed' : 'pointer',
          ...typographyStyle('body'),
        }}
      >
        Neste
      </button>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function SessionsListView({
  sessions = [],
  pagination = { page: 1, totalPages: 1, total: 0 },
  filters = {},
  isLoading = false,
  onFilterChange,
  onSearch,
  onPageChange,
}) {
  const navigate = useNavigate();

  const handleSessionClick = useCallback((session) => {
    if (session.completionStatus === 'in_progress') {
      navigate(`/session/${session.id}/evaluate`);
    } else {
      navigate(`/session/${session.id}`);
    }
  }, [navigate]);

  const handleCreateNew = useCallback(() => {
    navigate('/session/new');
  }, [navigate]);

  return (
    <div
      style={{
        backgroundColor: tokens.colors.surface,
        minHeight: '100vh',
        fontFamily: tokens.typography.fontFamily,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: tokens.spacing.lg,
          backgroundColor: tokens.colors.white,
          borderBottom: `1px solid ${tokens.colors.mist}`,
        }}
      >
        <div>
          <h1 style={{ ...typographyStyle('title1'), color: tokens.colors.charcoal, margin: 0 }}>
            Mine treningsokter
          </h1>
          <p style={{ ...typographyStyle('caption'), color: tokens.colors.steel, marginTop: tokens.spacing.xs }}>
            {pagination.total} okter totalt
          </p>
        </div>
        <button
          onClick={handleCreateNew}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: tokens.spacing.sm,
            padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
            backgroundColor: tokens.colors.primary,
            color: tokens.colors.white,
            border: 'none',
            borderRadius: tokens.borderRadius.md,
            cursor: 'pointer',
            ...typographyStyle('label'),
          }}
        >
          <Plus size={16} />
          Ny okt
        </button>
      </div>

      {/* Content */}
      <div style={{ padding: tokens.spacing.lg }}>
        {/* Filters */}
        <FilterBar
          filters={filters}
          onFilterChange={onFilterChange}
          onSearch={onSearch}
        />

        {/* Loading state */}
        {isLoading && (
          <div style={{ textAlign: 'center', padding: tokens.spacing.xl }}>
            <p style={{ ...typographyStyle('body'), color: tokens.colors.steel }}>
              Laster okter...
            </p>
          </div>
        )}

        {/* Sessions list */}
        {!isLoading && sessions.length > 0 && (
          <>
            {sessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                onClick={() => handleSessionClick(session)}
              />
            ))}
            <Pagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={onPageChange}
            />
          </>
        )}

        {/* Empty state */}
        {!isLoading && sessions.length === 0 && (
          <EmptyState onCreateNew={handleCreateNew} />
        )}
      </div>
    </div>
  );
}
