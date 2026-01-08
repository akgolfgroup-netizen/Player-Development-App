/**
 * TIER Golf Academy - Coach Athlete List
 *
 * Archetype: A - List/Index Page
 * Purpose: Provide neutral access to athletes for a coach
 * - Alphabetically sorted, no ranking or comparison
 *
 * Contract references:
 * - COACH_ADMIN_IMPLEMENTATION_CONTRACT.md
 * - COACH_ADMIN_SCREEN_CONTRACT.md
 *
 * MIGRATED TO PAGE ARCHITECTURE - Zero inline styles
 * (except dynamic avatar colors which require runtime calculation)
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Search, ChevronRight, CheckSquare, Square, Users } from 'lucide-react';
import { coachesAPI } from '../../services/api';
import Button from '../../ui/primitives/Button';
import StateCard from '../../ui/composites/StateCard';
import Card from '../../ui/primitives/Card';
import PageHeader from '../../ui/raw-blocks/PageHeader.raw';
import PageContainer from '../../ui/raw-blocks/PageContainer.raw';
import BatchOperationsPanel from './BatchOperationsPanel';

// ============================================================================
// TYPES
// ============================================================================

type Athlete = {
  id: string;
  firstName: string;
  lastName: string;
};

// ============================================================================
// MOCK DATA
// ============================================================================

const MOCK_ATHLETES: Athlete[] = [
  { id: '1', firstName: 'Anders', lastName: 'Hansen' },
  { id: '2', firstName: 'Erik', lastName: 'Johansen' },
  { id: '3', firstName: 'Lars', lastName: 'Olsen' },
  { id: '4', firstName: 'Mikkel', lastName: 'Pedersen' },
  { id: '5', firstName: 'Sofie', lastName: 'Andersen' },
  { id: '6', firstName: 'Emma', lastName: 'Berg' },
];

// ============================================================================
// HELPERS
// ============================================================================

const sortAlphabetically = (athletes: Athlete[]): Athlete[] =>
  [...athletes].sort((a, b) =>
    `${a.lastName} ${a.firstName}`.localeCompare(`${b.lastName} ${b.firstName}`)
  );

// ============================================================================
// AVATAR COMPONENT
// ============================================================================

const Avatar: React.FC<{ name: string; size?: number }> = ({ name, size = 44 }) => {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const colors = ['var(--accent)', 'var(--status-success)', 'var(--status-warning)'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const bgColor = colors[Math.abs(hash) % colors.length];

  return (
    <div
      className="rounded-full flex items-center justify-center font-semibold flex-shrink-0 text-white"
      style={{
        width: size,
        height: size,
        backgroundColor: bgColor,
        fontSize: size * 0.4,
      }}
    >
      {initials}
    </div>
  );
};

// ============================================================================
// STATE COMPONENTS
// ============================================================================

const LoadingState: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-tier-surface-base">
    <StateCard variant="loading" title="Laster spillere..." />
  </div>
);

const ErrorState: React.FC<{ error: string; onRetry: () => void }> = ({ error, onRetry }) => (
  <div className="min-h-screen flex items-center justify-center bg-tier-surface-base p-6">
    <StateCard
      variant="error"
      title="Kunne ikke laste spillere"
      description={error}
      action={
        <Button variant="primary" onClick={onRetry}>
          Prøv igjen
        </Button>
      }
    />
  </div>
);

// ============================================================================
// MAIN COMPONENT
// ============================================================================

type Props = {
  onSelectAthlete: (athleteId: string) => void;
  athletes?: Athlete[];
};

export default function CoachAthleteList({ onSelectAthlete, athletes: propAthletes }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [athletes, setAthletes] = useState<Athlete[]>(propAthletes || []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Multi-select state
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showBatchPanel, setShowBatchPanel] = useState(false);

  // Fetch athletes from API
  const fetchAthletes = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await coachesAPI.getAthletes();
      setAthletes(response.data?.data || response.data || MOCK_ATHLETES);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
            'En ukjent feil oppstod';
      setError(errorMessage);
      setAthletes(MOCK_ATHLETES);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!propAthletes) {
      fetchAthletes();
    } else {
      setLoading(false);
    }
  }, [propAthletes]);

  // Filter and sort athletes
  const filteredAthletes = sortAlphabetically(athletes).filter((a) =>
    `${a.firstName} ${a.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Selection handlers
  const toggleSelectMode = useCallback(() => {
    setIsSelectMode((prev) => !prev);
    if (isSelectMode) {
      setSelectedIds(new Set());
      setShowBatchPanel(false);
    }
  }, [isSelectMode]);

  const togglePlayerSelection = useCallback((playerId: string) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(playerId)) {
        newSet.delete(playerId);
      } else {
        newSet.add(playerId);
      }
      return newSet;
    });
  }, []);

  const selectAll = useCallback(() => {
    const allIds = new Set(filteredAthletes.map((a) => a.id));
    setSelectedIds(allIds);
  }, [filteredAthletes]);

  const deselectAll = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const handleBatchComplete = useCallback(() => {
    setShowBatchPanel(false);
    setSelectedIds(new Set());
    setIsSelectMode(false);
    fetchAthletes();
  }, []);

  // Create player names map for batch panel
  const selectedPlayerNames = new Map<string, string>();
  athletes.forEach((a) => {
    if (selectedIds.has(a.id)) {
      selectedPlayerNames.set(a.id, `${a.firstName} ${a.lastName}`);
    }
  });

  if (loading) return <LoadingState />;
  if (error && athletes.length === 0) return <ErrorState error={error} onRetry={fetchAthletes} />;

  return (
    <div className="min-h-screen bg-tier-surface-base">
      {/* TIER-compliant PageHeader */}
      <PageHeader
        title="Spillere"
        subtitle={`${filteredAthletes.length} spillere (sortert alfabetisk)`}
      />

      <PageContainer paddingY="md" background="base">
        {/* Select Mode Controls */}
        <div className="mb-4 flex gap-3 items-center">
        <button
          onClick={toggleSelectMode}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium cursor-pointer transition-colors ${
            isSelectMode
              ? 'bg-tier-navy text-white border-none'
              : 'bg-tier-white text-tier-navy border border-tier-border-default'
          }`}
        >
          <Users size={16} />
          {isSelectMode ? 'Avbryt valg' : 'Velg flere'}
        </button>

        {isSelectMode && (
          <>
            <button
              onClick={selectedIds.size === filteredAthletes.length ? deselectAll : selectAll}
              className="px-4 py-2.5 rounded-lg border border-tier-border-default bg-tier-white text-tier-text-secondary cursor-pointer text-sm"
            >
              {selectedIds.size === filteredAthletes.length ? 'Velg ingen' : 'Velg alle'}
            </button>

            {selectedIds.size > 0 && (
              <button
                onClick={() => setShowBatchPanel(true)}
                className="px-4 py-2.5 rounded-lg border-none bg-tier-success text-white cursor-pointer text-sm font-medium"
              >
                Handlinger ({selectedIds.size})
              </button>
            )}
          </>
        )}
      </div>

        {/* Search */}
        <div className="mb-4">
        <Card variant="default" padding="none">
          <div className="flex items-center gap-3 px-4 py-3">
            <Search size={20} className="text-tier-text-secondary" />
            <input
              type="text"
              placeholder="Søk etter spiller..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 border-none bg-transparent outline-none text-[15px] text-tier-navy"
            />
          </div>
        </Card>
      </div>

        {/* Athletes List */}
        <div className="pb-6">
        <Card variant="default" padding="none">
          <div className="overflow-hidden">
            {filteredAthletes.map((athlete, index) => (
              <button
                key={athlete.id}
                type="button"
                onClick={() => {
                  if (isSelectMode) {
                    togglePlayerSelection(athlete.id);
                  } else {
                    onSelectAthlete(athlete.id);
                  }
                }}
                className={`w-full flex items-center gap-3.5 px-5 py-4 border-none cursor-pointer text-left transition-colors ${
                  selectedIds.has(athlete.id)
                    ? 'bg-tier-navy/10'
                    : 'bg-transparent hover:bg-tier-surface-base'
                } ${index < filteredAthletes.length - 1 ? 'border-b border-tier-border-default' : ''}`}
              >
                {isSelectMode && (
                  <div className="flex-shrink-0">
                    {selectedIds.has(athlete.id) ? (
                      <CheckSquare size={22} className="text-tier-navy" />
                    ) : (
                      <Square size={22} className="text-tier-text-secondary" />
                    )}
                  </div>
                )}
                <Avatar name={`${athlete.firstName} ${athlete.lastName}`} />
                <span className="flex-1 text-[15px] font-medium text-tier-navy">
                  {athlete.lastName}, {athlete.firstName}
                </span>
                {!isSelectMode && <ChevronRight size={20} className="text-tier-text-secondary" />}
              </button>
            ))}
          </div>
        </Card>
        </div>
      </PageContainer>

      {/* Batch Operations Panel */}
      {showBatchPanel && selectedIds.size > 0 && (
        <BatchOperationsPanel
          selectedPlayerIds={Array.from(selectedIds)}
          selectedPlayerNames={selectedPlayerNames}
          onClose={() => setShowBatchPanel(false)}
          onComplete={handleBatchComplete}
        />
      )}
    </div>
  );
}

/*
STRICT NOTES:
- Alphabetical sorting only (by last name)
- No counts, badges, or performance indicators
- Neutral presentation - no ranking or comparison
- Search is for convenience only, not filtering by performance
*/
