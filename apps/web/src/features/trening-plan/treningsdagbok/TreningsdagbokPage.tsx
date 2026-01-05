/**
 * TreningsdagbokPage
 *
 * Archetype: C - Dashboard/Calendar Page
 * Purpose: Main Training Ledger page with:
 * - Full AK hierarchy filtering
 * - URL-based state persistence
 * - Weekly heatmap visualization
 * - Compliance tracking
 * - Session list with drill/reps display
 *
 * MIGRATED TO PAGE ARCHITECTURE - Zero inline styles
 */

import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';

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

// Media query styles
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

export const TreningsdagbokPage: React.FC = () => {
  const navigate = useNavigate();
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // State management
  const state = useDagbokState();
  const { visibility, options, activeFilterCount } = useDagbokFilters(state);
  const { sessions, stats, isLoading } = useDagbokSessions(state);
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

  const handleSessionClick = useCallback(
    (session: DagbokSession) => {
      navigate(`/session/${session.id}`);
    },
    [navigate]
  );

  const handleNewSession = useCallback(() => {
    navigate('/logg-trening');
  }, [navigate]);

  return (
    <>
      {/* Inject media query styles */}
      <style>{mediaStyles}</style>

      <div className="flex flex-col h-full min-h-screen bg-ak-surface-base">
        {/* Top bar with action button */}
        <div className="flex items-center justify-end pb-4">
          <button
            onClick={handleNewSession}
            className="flex items-center gap-1.5 px-4 py-2 bg-ak-primary text-white border-none rounded-lg text-sm font-medium cursor-pointer"
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
        <div className="dagbok-mobile-visuals hidden p-4 bg-ak-surface-subtle border-b border-ak-border-default flex-col gap-4">
          <DagbokSummarySection stats={stats} isLoading={isLoading} />
        </div>

        {/* Main content area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Main column - session list */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-hidden">
              <DagbokSessionList
                sessions={sessions}
                isLoading={isLoading}
                onSessionClick={handleSessionClick}
                emptyMessage={
                  activeFilterCount > 0
                    ? 'Ingen økter matcher filtrene. Prøv å justere filtrene.'
                    : 'Ingen treningsøkter registrert for denne perioden.'
                }
              />
            </div>
          </div>

          {/* Side column - visuals (hidden on mobile) */}
          <div className="dagbok-side-column w-80 border-l border-ak-border-default bg-ak-surface-subtle p-4 overflow-auto flex flex-col gap-4">
            {/* Summary stats */}
            <DagbokSummarySection stats={stats} isLoading={isLoading} />

            {/* Weekly heatmap */}
            {state.period === 'week' && (
              <DagbokWeeklyHeatmap data={heatmapData} isLoading={isLoading} />
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
