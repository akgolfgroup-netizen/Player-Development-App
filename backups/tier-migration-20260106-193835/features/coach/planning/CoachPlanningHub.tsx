/**
 * CoachPlanningHub - Planning Hub Page
 *
 * Purpose: "Who has plans and who needs plans?"
 *
 * Features:
 * - Tabs: [Spillere] [Grupper]
 * - Cards per athlete/group with plan status badges
 * - Search + filter by plan status
 * - Quick stats: with plan / without plan
 */

import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ClipboardList, Users, CheckCircle, AlertTriangle, ChevronRight } from 'lucide-react';
import { PageTitle, SectionTitle } from '../../../components/typography';
import { athleteList, groups, type Athlete, type Group } from '../../../lib/coachMockData';

type TabType = 'players' | 'groups';
type FilterType = 'all' | 'with_plan' | 'without_plan';

// Loading skeleton for cards
function CardSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4 bg-ak-surface-card rounded-xl border border-ak-border-default animate-pulse">
      <div className="w-10 h-10 rounded-full bg-ak-border-default" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-ak-border-default rounded w-1/3" />
        <div className="h-3 bg-ak-border-default rounded w-1/4" />
      </div>
      <div className="w-16 h-6 bg-ak-border-default rounded-full" />
    </div>
  );
}

// Loading skeleton for stats
function StatSkeleton() {
  return (
    <div className="bg-ak-surface-card rounded-xl border border-ak-border-default p-4 animate-pulse">
      <div className="h-8 bg-ak-border-default rounded w-12 mb-2" />
      <div className="h-4 bg-ak-border-default rounded w-24" />
    </div>
  );
}

// Avatar component
const AVATAR_COLORS = ['bg-ak-primary', 'bg-ak-status-success', 'bg-ak-status-warning', 'bg-ak-status-info'];

function Avatar({ name, size = 40 }: { name: string; size?: number }) {
  const initials = name.split(',')[0]?.substring(0, 2).toUpperCase() || 'XX';

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const bgColorClass = AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];

  return (
    <div
      className={`rounded-full ${bgColorClass} text-white flex items-center justify-center font-semibold shrink-0`}
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {initials}
    </div>
  );
}

// Plan status badge
function PlanStatusBadge({ hasPlan }: { hasPlan: boolean }) {
  if (hasPlan) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
        <CheckCircle size={12} />
        Plan
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
      <AlertTriangle size={12} />
      Ingen plan
    </span>
  );
}

// Tab button
function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-3 font-medium rounded-lg transition-colors ${
        active
          ? 'bg-ak-primary text-white'
          : 'bg-ak-surface-subtle text-ak-text-secondary hover:text-ak-text-primary'
      }`}
    >
      {children}
    </button>
  );
}

// Filter chip
function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm rounded-full transition-colors ${
        active
          ? 'bg-ak-text-primary text-white'
          : 'bg-ak-surface-subtle text-ak-text-secondary hover:bg-ak-border-default'
      }`}
    >
      {children}
    </button>
  );
}

// Athlete card - Memoized to prevent unnecessary re-renders
const AthleteCard = React.memo(({ athlete, onClick }: { athlete: Athlete; onClick: () => void }) => {
  return (
    <div
      onClick={onClick}
      className="flex items-center gap-4 p-4 bg-ak-surface-card rounded-xl border border-ak-border-default cursor-pointer hover:border-ak-primary transition-colors will-change-[border-color]"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      style={{ contain: 'layout' }}
    >
      <Avatar name={athlete.displayName} />

      <div className="flex-1 min-w-0">
        <div className="font-semibold text-ak-text-primary truncate">
          {athlete.displayName}
        </div>
        <div className="text-sm text-ak-text-secondary">
          HCP {athlete.hcp.toFixed(1)} • Kat. {athlete.category}
        </div>
      </div>

      <PlanStatusBadge hasPlan={athlete.hasPlan} />

      <ChevronRight size={18} className="text-ak-text-tertiary shrink-0" />
    </div>
  );
});

// Group card - Memoized to prevent unnecessary re-renders
const GroupCard = React.memo(({ group, onClick }: { group: Group; onClick: () => void }) => {
  return (
    <div
      onClick={onClick}
      className="flex items-center gap-4 p-4 bg-ak-surface-card rounded-xl border border-ak-border-default cursor-pointer hover:border-ak-primary transition-colors will-change-[border-color]"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      style={{ contain: 'layout' }}
    >
      <div className="w-10 h-10 rounded-full bg-ak-primary/10 flex items-center justify-center">
        <Users size={20} className="text-ak-primary" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="font-semibold text-ak-text-primary truncate">
          {group.name}
        </div>
        <div className="text-sm text-ak-text-secondary">
          {group.memberCount} medlemmer • {group.type}
        </div>
      </div>

      <PlanStatusBadge hasPlan={group.hasPlan} />

      <ChevronRight size={18} className="text-ak-text-tertiary shrink-0" />
    </div>
  );
});

export default function CoachPlanningHub() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('players');
  const [searchTerm, setSearchTerm] = useState('');
  const [planFilter, setPlanFilter] = useState<FilterType>('all');
  const [isLoading, setIsLoading] = useState(true);

  // Simulate initial loading to prevent layout shift
  useEffect(() => {
    // Even with mock data, add a brief delay to show loading state
    // This prevents sudden content pop-in
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Calculate stats
  const stats = useMemo(() => {
    const withPlan = athleteList.filter(a => a.hasPlan).length;
    const withoutPlan = athleteList.filter(a => !a.hasPlan).length;
    const groupsWithPlan = groups.filter(g => g.hasPlan).length;
    const groupsWithoutPlan = groups.filter(g => !g.hasPlan).length;

    return {
      athletes: { withPlan, withoutPlan, total: athleteList.length },
      groups: { withPlan: groupsWithPlan, withoutPlan: groupsWithoutPlan, total: groups.length },
    };
  }, []);

  // Filter athletes
  const filteredAthletes = useMemo(() => {
    let result = [...athleteList];

    // Search filter
    if (searchTerm) {
      result = result.filter(
        a =>
          a.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          a.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          a.lastName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Plan status filter
    if (planFilter === 'with_plan') {
      result = result.filter(a => a.hasPlan);
    } else if (planFilter === 'without_plan') {
      result = result.filter(a => !a.hasPlan);
    }

    // Always alphabetical
    return result.sort((a, b) => a.displayName.localeCompare(b.displayName, 'nb-NO'));
  }, [searchTerm, planFilter]);

  // Filter groups
  const filteredGroups = useMemo(() => {
    let result = [...groups];

    // Search filter
    if (searchTerm) {
      result = result.filter(g =>
        g.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Plan status filter
    if (planFilter === 'with_plan') {
      result = result.filter(g => g.hasPlan);
    } else if (planFilter === 'without_plan') {
      result = result.filter(g => !g.hasPlan);
    }

    // Alphabetical
    return result.sort((a, b) => a.name.localeCompare(b.name, 'nb-NO'));
  }, [searchTerm, planFilter]);

  const handleAthleteClick = (id: string) => {
    navigate(`/coach/athletes/${id}/plan`);
  };

  const handleGroupClick = (id: string) => {
    navigate(`/coach/groups/${id}/plan`);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <PageTitle>Planlegging</PageTitle>
        <p className="text-ak-text-secondary mt-1">
          Oversikt over treningsplaner for spillere og grupper
        </p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {isLoading ? (
          <>
            <StatSkeleton />
            <StatSkeleton />
            <StatSkeleton />
            <StatSkeleton />
          </>
        ) : (
          <>
            <div className="bg-ak-surface-card rounded-xl border border-ak-border-default p-4">
              <div className="text-2xl font-bold text-ak-primary">{stats.athletes.withPlan}</div>
              <div className="text-sm text-ak-text-secondary">Spillere med plan</div>
            </div>
            <div className="bg-ak-surface-card rounded-xl border border-ak-border-default p-4">
              <div className="text-2xl font-bold text-yellow-600">{stats.athletes.withoutPlan}</div>
              <div className="text-sm text-ak-text-secondary">Spillere uten plan</div>
            </div>
            <div className="bg-ak-surface-card rounded-xl border border-ak-border-default p-4">
              <div className="text-2xl font-bold text-ak-primary">{stats.groups.withPlan}</div>
              <div className="text-sm text-ak-text-secondary">Grupper med plan</div>
            </div>
            <div className="bg-ak-surface-card rounded-xl border border-ak-border-default p-4">
              <div className="text-2xl font-bold text-yellow-600">{stats.groups.withoutPlan}</div>
              <div className="text-sm text-ak-text-secondary">Grupper uten plan</div>
            </div>
          </>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <TabButton
          active={activeTab === 'players'}
          onClick={() => setActiveTab('players')}
        >
          <span className="flex items-center gap-2">
            <Users size={18} />
            Spillere ({stats.athletes.total})
          </span>
        </TabButton>
        <TabButton
          active={activeTab === 'groups'}
          onClick={() => setActiveTab('groups')}
        >
          <span className="flex items-center gap-2">
            <ClipboardList size={18} />
            Grupper ({stats.groups.total})
          </span>
        </TabButton>
      </div>

      {/* Search and filters */}
      <div className="mb-6 space-y-4">
        {/* Search */}
        <div className="flex items-center gap-3 px-4 py-3 bg-ak-surface-card rounded-xl border border-ak-border-default">
          <Search size={20} className="text-ak-text-secondary" />
          <input
            type="text"
            placeholder={activeTab === 'players' ? 'Søk etter spiller...' : 'Søk etter gruppe...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-ak-text-primary placeholder:text-ak-text-tertiary"
          />
        </div>

        {/* Filter chips */}
        <div className="flex gap-2">
          <FilterChip
            active={planFilter === 'all'}
            onClick={() => setPlanFilter('all')}
          >
            Alle
          </FilterChip>
          <FilterChip
            active={planFilter === 'with_plan'}
            onClick={() => setPlanFilter('with_plan')}
          >
            Med plan
          </FilterChip>
          <FilterChip
            active={planFilter === 'without_plan'}
            onClick={() => setPlanFilter('without_plan')}
          >
            Uten plan
          </FilterChip>
        </div>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="space-y-3">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : activeTab === 'players' ? (
        <div className="space-y-3">
          {filteredAthletes.length === 0 ? (
            <div className="text-center py-12 bg-ak-surface-card rounded-xl border border-ak-border-default">
              <ClipboardList size={48} className="mx-auto text-ak-text-tertiary mb-3" />
              <p className="text-ak-text-secondary">Ingen spillere funnet</p>
            </div>
          ) : (
            filteredAthletes.map(athlete => (
              <AthleteCard
                key={athlete.id}
                athlete={athlete}
                onClick={() => handleAthleteClick(athlete.id)}
              />
            ))
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredGroups.length === 0 ? (
            <div className="text-center py-12 bg-ak-surface-card rounded-xl border border-ak-border-default">
              <Users size={48} className="mx-auto text-ak-text-tertiary mb-3" />
              <p className="text-ak-text-secondary">Ingen grupper funnet</p>
            </div>
          ) : (
            filteredGroups.map(group => (
              <GroupCard
                key={group.id}
                group={group}
                onClick={() => handleGroupClick(group.id)}
              />
            ))
          )}
        </div>
      )}

      {/* Note about ordering */}
      <p className="text-center text-xs text-ak-text-tertiary mt-4">
        Sortert alfabetisk (A-Å)
      </p>
    </div>
  );
}
