/**
 * SessionsListView - Training sessions overview with filtering
 *
 * Shows list of all training sessions with:
 * - Filter by status, type, period, date range
 * - Session cards with key info
 * - Navigation to session detail/evaluation
 *
 * Uses design system components and CSS variables for consistent styling.
 */
import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar, Clock, Target, Filter, Plus, ChevronRight,
  CheckCircle, AlertCircle, XCircle, Play, Search
} from 'lucide-react';
import StateCard from '../../ui/composites/StateCard';
import PageHeader from '../../ui/raw-blocks/PageHeader.raw';
import { Button } from '../../ui/primitives';

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
    color: 'var(--warning)',
    icon: Play,
    bg: 'rgba(var(--warning-rgb), 0.15)',
  },
  completed: {
    label: 'Fullfort',
    color: 'var(--success)',
    icon: CheckCircle,
    bg: 'rgba(var(--success-rgb), 0.15)',
  },
  auto_completed: {
    label: 'Auto-fullfort',
    color: 'var(--text-secondary)',
    icon: AlertCircle,
    bg: 'rgba(var(--text-secondary-rgb), 0.15)',
  },
  abandoned: {
    label: 'Avbrutt',
    color: 'var(--error)',
    icon: XCircle,
    bg: 'rgba(var(--error-rgb), 0.15)',
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
    <div style={{ marginBottom: '24px' }}>
      {/* Search and filter toggle */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px',
            backgroundColor: 'var(--bg-primary)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-default)',
          }}
        >
          <Search size={18} color={'var(--text-secondary)'} />
          <input
            type="text"
            placeholder="Sok i okter..."
            value={filters.search || ''}
            onChange={(e) => onSearch(e.target.value)}
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: '15px', lineHeight: '20px',
            }}
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: `${'8px'} ${'16px'}`,
            backgroundColor: showFilters ? 'var(--accent)' : 'var(--bg-primary)',
            color: showFilters ? 'var(--bg-primary)' : 'var(--text-primary)',
            border: `1px solid ${showFilters ? 'var(--accent)' : 'var(--border-default)'}`,
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
            fontSize: '12px', lineHeight: '16px', fontWeight: 500,
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
            gap: '16px',
            padding: '16px',
            backgroundColor: 'var(--bg-primary)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-default)',
          }}
        >
          {/* Status filter */}
          <div>
            <label style={{ fontSize: '12px', lineHeight: '16px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
              Status
            </label>
            <select
              value={filters.completionStatus || ''}
              onChange={(e) => onFilterChange('completionStatus', e.target.value || null)}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-default)',
                fontSize: '15px', lineHeight: '20px',
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
            <label style={{ fontSize: '12px', lineHeight: '16px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
              Type
            </label>
            <select
              value={filters.sessionType || ''}
              onChange={(e) => onFilterChange('sessionType', e.target.value || null)}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-default)',
                fontSize: '15px', lineHeight: '20px',
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
            <label style={{ fontSize: '12px', lineHeight: '16px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
              Periode
            </label>
            <select
              value={filters.period || ''}
              onChange={(e) => onFilterChange('period', e.target.value || null)}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-default)',
                fontSize: '15px', lineHeight: '20px',
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
            <label style={{ fontSize: '12px', lineHeight: '16px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
              Fra dato
            </label>
            <input
              type="date"
              value={filters.fromDate || ''}
              onChange={(e) => onFilterChange('fromDate', e.target.value || null)}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-default)',
                fontSize: '15px', lineHeight: '20px',
              }}
            />
          </div>

          {/* Date to */}
          <div>
            <label style={{ fontSize: '12px', lineHeight: '16px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
              Til dato
            </label>
            <input
              type="date"
              value={filters.toDate || ''}
              onChange={(e) => onFilterChange('toDate', e.target.value || null)}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-default)',
                fontSize: '15px', lineHeight: '20px',
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
        backgroundColor: 'var(--bg-primary)',
        borderRadius: 'var(--radius-lg)',
        padding: '16px',
        marginBottom: '16px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          {/* Session type and status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{ fontSize: '20px', lineHeight: '25px', fontWeight: 600, color: 'var(--text-primary)' }}>
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
                borderRadius: 'var(--radius-sm)',
                fontSize: '12px', lineHeight: '16px',
              }}
            >
              <StatusIcon size={12} />
              {statusConfig.label}
            </span>
          </div>

          {/* Date and duration */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Calendar size={14} color={'var(--text-secondary)'} />
              <span style={{ fontSize: '12px', lineHeight: '16px', color: 'var(--text-secondary)' }}>
                {sessionDate.toLocaleDateString('nb-NO', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={14} color={'var(--text-secondary)'} />
              <span style={{ fontSize: '12px', lineHeight: '16px', color: 'var(--text-secondary)' }}>
                {session.duration} min
              </span>
            </div>
          </div>

          {/* Focus area */}
          {session.focusArea && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Target size={14} color={'var(--accent)'} />
              <span style={{ fontSize: '15px', lineHeight: '20px', color: 'var(--text-primary)' }}>
                {session.focusArea}
              </span>
            </div>
          )}

          {/* Evaluation ratings (if completed) */}
          {session.completionStatus === 'completed' && session.evaluationFocus && (
            <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
              <span style={{ fontSize: '12px', lineHeight: '16px', color: 'var(--text-secondary)' }}>
                Fokus: {session.evaluationFocus}/10
              </span>
              <span style={{ fontSize: '12px', lineHeight: '16px', color: 'var(--text-secondary)' }}>
                Teknikk: {session.evaluationTechnical}/10
              </span>
            </div>
          )}
        </div>

        <ChevronRight size={20} color={'var(--text-secondary)'} />
      </div>
    </div>
  );
}

function EmptyState({ onCreateNew }) {
  return (
    <div
      style={{
        textAlign: 'center',
        padding: '32px',
        backgroundColor: 'var(--bg-primary)',
        borderRadius: 'var(--radius-lg)',
      }}
    >
      <Calendar size={48} color={'var(--text-secondary)'} style={{ marginBottom: '16px' }} />
      <h3 style={{ fontSize: '20px', lineHeight: '25px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
        Ingen okter funnet
      </h3>
      <p style={{ fontSize: '15px', lineHeight: '20px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
        Du har ingen treningsokter som matcher filtrene dine.
      </p>
      <Button
        variant="primary"
        onClick={onCreateNew}
        leftIcon={<Plus size={16} />}
      >
        Opprett ny okt
      </Button>
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
        gap: '8px',
        marginTop: '24px',
      }}
    >
      <Button
        variant="secondary"
        size="sm"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
      >
        Forrige
      </Button>
      <span style={{ fontSize: '15px', lineHeight: '20px', color: 'var(--text-primary)' }}>
        Side {page} av {totalPages}
      </span>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
      >
        Neste
      </Button>
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
        backgroundColor: 'var(--background-default)',
        minHeight: '100vh',
        fontFamily: 'var(--font-family)',
      }}
    >
      {/* Header - using PageHeader from design system */}
      <PageHeader
        title="Mine treningsøkter"
        subtitle={`${pagination.total} økter totalt`}
        actions={
          <Button variant="primary" onClick={handleCreateNew}>
            <Plus size={16} />
            Ny økt
          </Button>
        }
      />

      {/* Content */}
      <div style={{ padding: '24px' }}>
        {/* Filters */}
        <FilterBar
          filters={filters}
          onFilterChange={onFilterChange}
          onSearch={onSearch}
        />

        {/* Loading state */}
        {isLoading && (
          <StateCard variant="loading" title="Laster økter..." />
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
