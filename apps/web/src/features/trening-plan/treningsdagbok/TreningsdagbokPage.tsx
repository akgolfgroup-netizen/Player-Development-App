/**
 * TreningsdagbokPage
 *
 * Main Training Ledger page with:
 * - Full AK hierarchy filtering
 * - URL-based state persistence
 * - Weekly heatmap visualization
 * - Compliance tracking
 * - Session list with drill/reps display
 */

import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Plus } from 'lucide-react';

import { useDagbokState } from './hooks/useDagbokState';
import { useDagbokFilters } from './hooks/useDagbokFilters';
import { useDagbokSessions } from './hooks/useDagbokSessions';
import { useDagbokHeatmap } from './hooks/useDagbokHeatmap';

import { DagbokFilterBar } from './components/DagbokFilterBar';
import { DagbokHierarchyFilters } from './components/DagbokHierarchyFilters';
import { DagbokWeeklyHeatmap } from './components/DagbokWeeklyHeatmap';
import { DagbokComplianceBand } from './components/DagbokComplianceBand';
import { DagbokSummarySection } from './components/DagbokSummarySection';
import { DagbokSessionList } from './components/DagbokSessionList';

import type { DagbokSession } from './types';

// =============================================================================
// STYLES
// =============================================================================

const styles = {
  page: {
    display: 'flex',
    flexDirection: 'column' as const,
    height: '100%',
    minHeight: '100vh',
    backgroundColor: 'var(--bg-primary)',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px',
    backgroundColor: 'var(--card-background)',
    borderBottom: '1px solid var(--border-default)',
  },
  headerIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    borderRadius: 'var(--radius-md)',
    backgroundColor: 'color-mix(in srgb, var(--accent) 15%, transparent)',
  },
  headerTitle: {
    fontSize: '18px',
    fontWeight: 700,
    color: 'var(--text-primary)',
    margin: 0,
  },
  headerSubtitle: {
    fontSize: '13px',
    color: 'var(--text-secondary)',
    margin: 0,
  },
  content: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
  },
  mainColumn: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    overflow: 'hidden',
  },
  sideColumn: {
    width: '320px',
    borderLeft: '1px solid var(--border-default)',
    backgroundColor: 'var(--bg-secondary)',
    padding: '16px',
    overflow: 'auto' as const,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
  },
  sessionListContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  mobileVisuals: {
    display: 'none',
    padding: '16px',
    backgroundColor: 'var(--bg-secondary)',
    borderBottom: '1px solid var(--border-default)',
    flexDirection: 'column' as const,
    gap: '16px',
  },
};

// Media query styles (applied via className or inline check)
const mediaStyles = `
  @media (max-width: 1024px) {
    .dagbok-side-column {
      display: none !important;
    }
    .dagbok-mobile-visuals {
      display: flex !important;
    }
  }
`;

// =============================================================================
// COMPONENT
// =============================================================================

export const TreningsdagbokPage: React.FC = () => {
  const navigate = useNavigate();
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // State management
  const state = useDagbokState();
  const { visibility, options, activeFilterCount } = useDagbokFilters(state);
  const { sessions, stats, isLoading, error } = useDagbokSessions(state);
  const { heatmapData } = useDagbokHeatmap(sessions, state.anchorDate);

  // Actions (extracted from state hook)
  const actions = {
    setPyramid: state.setPyramid,
    setArea: state.setArea,
    setLPhase: state.setLPhase,
    setEnvironment: state.setEnvironment,
    setPressure: state.setPressure,
    setCSLevel: state.setCSLevel,
    setPosition: state.setPosition,
    setTournamentType: state.setTournamentType,
    setPhysicalFocus: state.setPhysicalFocus,
    setPlayFocus: state.setPlayFocus,
    setPuttingFocus: state.setPuttingFocus,
    setPeriod: state.setPeriod,
    setDate: state.setDate,
    setDateRange: state.setDateRange,
    goToToday: state.goToToday,
    goToNext: state.goToNext,
    goToPrev: state.goToPrev,
    setPlanType: state.setPlanType,
    setSearchQuery: state.setSearchQuery,
    resetFilters: state.resetFilters,
    resetAll: state.resetAll,
  };

  const handleToggleAdvancedFilters = useCallback(() => {
    setShowAdvancedFilters((prev) => !prev);
  }, []);

  const handleSessionClick = useCallback((session: DagbokSession) => {
    // Navigate to session detail page
    navigate(`/session/${session.id}`);
  }, [navigate]);

  const handleNewSession = useCallback(() => {
    navigate('/logg-trening');
  }, [navigate]);

  return (
    <>
      {/* Inject media query styles */}
      <style>{mediaStyles}</style>

      <div style={styles.page}>
        {/* Page header */}
        <div style={styles.header}>
          <div style={styles.headerIcon}>
            <BookOpen size={20} style={{ color: 'var(--accent)' }} />
          </div>
          <div style={{ flex: 1 }}>
            <h1 style={styles.headerTitle}>Treningsdagbok</h1>
            <p style={styles.headerSubtitle}>
              Logg, analyser og folg opp treningen din
            </p>
          </div>
          <button
            onClick={handleNewSession}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              backgroundColor: 'var(--accent)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            <Plus size={18} />
            Ny økt
          </button>
        </div>

        {/* Filter bar */}
        <DagbokFilterBar
          state={state}
          actions={actions}
          visibility={visibility}
          activeFilterCount={activeFilterCount}
          showAdvancedFilters={showAdvancedFilters}
          onToggleAdvancedFilters={handleToggleAdvancedFilters}
        />

        {/* Advanced filters (collapsible) */}
        {showAdvancedFilters && (
          <DagbokHierarchyFilters
            state={state}
            actions={actions}
            visibility={visibility}
            options={options}
          />
        )}

        {/* Mobile visuals (hidden on desktop) */}
        <div className="dagbok-mobile-visuals" style={styles.mobileVisuals}>
          <DagbokSummarySection stats={stats} isLoading={isLoading} />
        </div>

        {/* Main content area */}
        <div style={styles.content}>
          {/* Main column - session list */}
          <div style={styles.mainColumn}>
            <div style={styles.sessionListContainer}>
              <DagbokSessionList
                sessions={sessions}
                isLoading={isLoading}
                onSessionClick={handleSessionClick}
                emptyMessage={
                  activeFilterCount > 0
                    ? 'Ingen okter matcher filtrene. Prov a justere filtrene.'
                    : 'Ingen treningsokter registrert for denne perioden.'
                }
              />
            </div>
          </div>

          {/* Side column - visuals (hidden on mobile) */}
          <div className="dagbok-side-column" style={styles.sideColumn}>
            {/* Summary stats */}
            <DagbokSummarySection stats={stats} isLoading={isLoading} />

            {/* Weekly heatmap */}
            {state.period === 'week' && (
              <DagbokWeeklyHeatmap
                data={heatmapData}
                isLoading={isLoading}
              />
            )}

            {/* Compliance band */}
            <DagbokComplianceBand
              plannedMinutes={stats.plannedSessions * stats.avgDuration}
              actualMinutes={stats.totalMinutes}
              plannedSessions={stats.plannedSessions}
              actualSessions={stats.completedPlanned}
              complianceRate={stats.complianceRate}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default TreningsdagbokPage;
