/**
 * CoachPlanningHub.tsx
 * Design System v3.0 - Premium Light
 *
 * MIGRATED TO PAGE ARCHITECTURE - Zero inline styles
 */
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  ClipboardList,
  Search,
  Users,
  User,
  ChevronRight,
  CheckCircle,
  FileText,
  Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { coachesAPI } from '../../services/api';
import PageHeader from '../../ui/raw-blocks/PageHeader.raw';
import Button from '../../ui/primitives/Button';
import { SubSectionTitle } from '../../components/typography';

// ============================================================================
// CLASS MAPPINGS
// ============================================================================

const CATEGORY_CLASSES = {
  A: { bg: 'bg-ak-status-success/15', text: 'text-ak-status-success' },
  B: { bg: 'bg-ak-brand-primary/15', text: 'text-ak-brand-primary' },
  C: { bg: 'bg-ak-status-warning/15', text: 'text-ak-status-warning' },
};

interface Player {
  id: string;
  name: string;
  category: 'A' | 'B' | 'C';
  hcp: number;
  hasActivePlan: boolean;
  planUpdated?: string;
  nextSession?: string;
  weeksInPlan?: number;
}

interface Group {
  id: string;
  name: string;
  memberCount: number;
  hasGroupPlan: boolean;
  planUpdated?: string;
}

export const CoachPlanningHub: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'players' | 'groups'>('players');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPlan, setFilterPlan] = useState<'all' | 'with' | 'without'>('all');
  const [players, setPlayers] = useState<Player[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch players and groups from API
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch coach's players with their plan status
      const playersRes = await coachesAPI.getAthletes().catch(() => ({ data: null }));
      const playersData = playersRes.data?.data || playersRes.data || [];

      if (Array.isArray(playersData)) {
        const mappedPlayers: Player[] = playersData.map((p: any) => ({
          id: p.id,
          name: p.name || `${p.firstName || ''} ${p.lastName || ''}`.trim() || 'Spiller',
          category: p.category || 'C',
          hcp: p.handicap ? Number(p.handicap) : 54,
          hasActivePlan: !!p.hasActivePlan || !!p.trainingPlan,
          planUpdated: p.planUpdated || p.trainingPlan?.updatedAt,
          nextSession: p.nextSession,
          weeksInPlan: p.weeksInPlan || p.trainingPlan?.weeks || 0,
        }));
        setPlayers(mappedPlayers);
      }

      // Groups feature is planned but not yet implemented
      // Show empty state until groups API is available
      setGroups([]);
    } catch (error) {
      console.error('Error fetching planning data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredPlayers = useMemo(() => {
    let filtered = [...players];

    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterPlan === 'with') {
      filtered = filtered.filter(p => p.hasActivePlan);
    } else if (filterPlan === 'without') {
      filtered = filtered.filter(p => !p.hasActivePlan);
    }

    return filtered;
  }, [players, searchQuery, filterPlan]);

  const filteredGroups = useMemo(() => {
    let filtered = [...groups];

    if (searchQuery) {
      filtered = filtered.filter(g =>
        g.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterPlan === 'with') {
      filtered = filtered.filter(g => g.hasGroupPlan);
    } else if (filterPlan === 'without') {
      filtered = filtered.filter(g => !g.hasGroupPlan);
    }

    return filtered;
  }, [groups, searchQuery, filterPlan]);

  const stats = useMemo(() => ({
    playersWithPlan: players.filter(p => p.hasActivePlan).length,
    playersWithoutPlan: players.filter(p => !p.hasActivePlan).length,
    groupsWithPlan: groups.filter(g => g.hasGroupPlan).length,
    groupsWithoutPlan: groups.filter(g => !g.hasGroupPlan).length
  }), [players, groups]);

  const getCategoryClasses = (category: string) => {
    return CATEGORY_CLASSES[category as keyof typeof CATEGORY_CLASSES] || { bg: 'bg-ak-surface-base', text: 'text-ak-text-secondary' };
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('nb-NO', { day: 'numeric', month: 'short' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-ak-surface-subtle flex items-center justify-center">
        <Loader2 size={40} className="text-ak-brand-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-ak-surface-subtle min-h-screen">
      {/* Header - using PageHeader from design system */}
      <PageHeader
        title="Treningsplanlegger"
        subtitle="Velg spiller eller gruppe for å opprette/redigere treningsplan"
        actions={
          <Button
            variant="secondary"
            leftIcon={<FileText size={18} />}
            onClick={() => navigate('/coach/exercises/templates')}
          >
            Maler
          </Button>
        }
      />

      <div className="px-6 pb-6">

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <div className="bg-ak-surface-base rounded-xl p-4 border border-ak-border-default">
          <div className="flex items-center gap-2 mb-2">
            <User size={16} className="text-ak-brand-primary" />
            <span className="text-xs text-ak-text-secondary">Spillere med plan</span>
          </div>
          <p className="text-2xl font-bold text-ak-brand-primary m-0">
            {stats.playersWithPlan}
          </p>
        </div>
        <div className="bg-ak-surface-base rounded-xl p-4 border border-ak-border-default">
          <div className="flex items-center gap-2 mb-2">
            <User size={16} className="text-ak-status-warning" />
            <span className="text-xs text-ak-text-secondary">Mangler plan</span>
          </div>
          <p className="text-2xl font-bold text-ak-status-warning m-0">
            {stats.playersWithoutPlan}
          </p>
        </div>
        <div className="bg-ak-surface-base rounded-xl p-4 border border-ak-border-default">
          <div className="flex items-center gap-2 mb-2">
            <Users size={16} className="text-ak-status-success" />
            <span className="text-xs text-ak-text-secondary">Grupper med plan</span>
          </div>
          <p className="text-2xl font-bold text-ak-status-success m-0">
            {stats.groupsWithPlan}
          </p>
        </div>
        <div className="bg-ak-surface-base rounded-xl p-4 border border-ak-border-default">
          <div className="flex items-center gap-2 mb-2">
            <Users size={16} className="text-ak-status-error" />
            <span className="text-xs text-ak-text-secondary">Grupper uten plan</span>
          </div>
          <p className="text-2xl font-bold text-ak-status-error m-0">
            {stats.groupsWithoutPlan}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-5 p-1 bg-ak-surface-subtle rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('players')}
          className={`py-2.5 px-5 rounded-lg border-none text-sm font-medium cursor-pointer flex items-center gap-2 transition-all ${
            activeTab === 'players'
              ? 'bg-ak-surface-base text-ak-text-primary shadow-sm'
              : 'bg-transparent text-ak-text-secondary'
          }`}
        >
          <User size={16} />
          Spillere ({players.length})
        </button>
        <button
          onClick={() => setActiveTab('groups')}
          className={`py-2.5 px-5 rounded-lg border-none text-sm font-medium cursor-pointer flex items-center gap-2 transition-all ${
            activeTab === 'groups'
              ? 'bg-ak-surface-base text-ak-text-primary shadow-sm'
              : 'bg-transparent text-ak-text-secondary'
          }`}
        >
          <Users size={16} />
          Grupper ({groups.length})
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4 mb-5 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-[400px]">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-ak-text-secondary"
          />
          <input
            type="text"
            placeholder={activeTab === 'players' ? 'Søk etter spiller...' : 'Søk etter gruppe...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-3 pl-10 pr-3 rounded-[10px] border border-ak-border-default bg-ak-surface-base text-sm text-ak-text-primary outline-none focus:border-ak-brand-primary"
          />
        </div>
        <div className="flex gap-2">
          {[
            { key: 'all', label: 'Alle' },
            { key: 'with', label: 'Med plan' },
            { key: 'without', label: 'Uten plan' }
          ].map(filter => (
            <button
              key={filter.key}
              onClick={() => setFilterPlan(filter.key as typeof filterPlan)}
              className={`py-2.5 px-4 rounded-[10px] border-none text-[13px] font-medium cursor-pointer transition-colors ${
                filterPlan === filter.key
                  ? 'bg-ak-brand-primary text-white'
                  : 'bg-ak-surface-base text-ak-text-secondary hover:bg-ak-surface-subtle'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {activeTab === 'players' ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-3">
          {filteredPlayers.map(player => {
            const catClasses = getCategoryClasses(player.category);
            return (
              <div
                key={player.id}
                onClick={() => navigate(`/coach/athletes/${player.id}/plan`)}
                className="bg-ak-surface-base rounded-xl p-4 border border-ak-border-default cursor-pointer transition-all hover:shadow-md flex items-center gap-3"
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-base font-semibold border-2 ${
                  player.hasActivePlan
                    ? 'bg-ak-status-success/15 border-ak-status-success text-ak-status-success'
                    : 'bg-ak-status-warning/15 border-ak-status-warning text-ak-status-warning'
                }`}>
                  {player.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <SubSectionTitle className="text-[15px] font-semibold text-ak-text-primary m-0">
                      {player.name}
                    </SubSectionTitle>
                    <span className={`text-[10px] font-semibold py-0.5 px-1.5 rounded ${catClasses.bg} ${catClasses.text}`}>
                      {player.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-ak-text-secondary">
                      HCP {player.hcp}
                    </span>
                    {player.hasActivePlan ? (
                      <>
                        <span className="text-[11px] text-ak-status-success flex items-center gap-1">
                          <CheckCircle size={12} />
                          {player.weeksInPlan}u plan
                        </span>
                        {player.planUpdated && (
                          <span className="text-[11px] text-ak-text-secondary">
                            Oppdatert {formatDate(player.planUpdated)}
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="text-[11px] text-ak-status-warning font-medium">
                        Ingen aktiv plan
                      </span>
                    )}
                  </div>
                </div>
                <ChevronRight size={18} className="text-ak-text-secondary" />
              </div>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-3">
          {filteredGroups.map(group => (
            <div
              key={group.id}
              onClick={() => navigate(`/coach/groups/${group.id}/plan`)}
              className="bg-ak-surface-base rounded-xl p-4 border border-ak-border-default cursor-pointer transition-all hover:shadow-md flex items-center gap-3"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center border-2 ${
                group.hasGroupPlan
                  ? 'bg-ak-status-success/15 border-ak-status-success'
                  : 'bg-ak-status-warning/15 border-ak-status-warning'
              }`}>
                <Users size={20} className={group.hasGroupPlan ? 'text-ak-status-success' : 'text-ak-status-warning'} />
              </div>
              <div className="flex-1">
                <SubSectionTitle className="text-[15px] font-semibold text-ak-text-primary m-0 mb-1">
                  {group.name}
                </SubSectionTitle>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-ak-text-secondary">
                    {group.memberCount} medlemmer
                  </span>
                  {group.hasGroupPlan ? (
                    <>
                      <span className="text-[11px] text-ak-status-success flex items-center gap-1">
                        <CheckCircle size={12} />
                        Aktiv plan
                      </span>
                      {group.planUpdated && (
                        <span className="text-[11px] text-ak-text-secondary">
                          Oppdatert {formatDate(group.planUpdated)}
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="text-[11px] text-ak-status-warning font-medium">
                      Ingen gruppeplan
                    </span>
                  )}
                </div>
              </div>
              <ChevronRight size={18} className="text-ak-text-secondary" />
            </div>
          ))}
        </div>
      )}

      {((activeTab === 'players' && filteredPlayers.length === 0) ||
        (activeTab === 'groups' && filteredGroups.length === 0)) && (
        <div className="text-center py-16 px-5 bg-ak-surface-base rounded-2xl border border-ak-border-default">
          <ClipboardList size={48} className="text-ak-text-secondary mb-4 mx-auto" />
          <p className="text-base text-ak-text-secondary m-0">
            Ingen {activeTab === 'players' ? 'spillere' : 'grupper'} funnet
          </p>
        </div>
      )}
      </div>
    </div>
  );
};

export default CoachPlanningHub;
