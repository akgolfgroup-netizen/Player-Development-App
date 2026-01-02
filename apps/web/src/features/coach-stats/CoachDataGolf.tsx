// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * AK Golf Academy - Coach Data Golf Statistics
 * Design System v3.0 - Premium Light
 *
 * Strokes Gained analysis and advanced player statistics.
 *
 * MIGRATED TO PAGE ARCHITECTURE - Zero inline styles
 */

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  BarChart3,
  Search,
  TrendingUp,
  TrendingDown,
  Target,
  Crosshair,
  CircleDot,
  Flag,
  Activity,
  ChevronRight,
  RefreshCw,
  Info
} from 'lucide-react';
import { dataGolfAPI } from '../../services/api';
import StateCard from '../../ui/composites/StateCard';
import PageHeader from '../../ui/raw-blocks/PageHeader.raw';
import Button from '../../ui/primitives/Button';
import { SubSectionTitle, CardTitle } from '../../components/typography';

interface PlayerStats {
  sgTotal: number | null;
  sgTee: number | null;
  sgApproach: number | null;
  sgAround: number | null;
  sgPutting: number | null;
  drivingDistance: number | null;
  drivingAccuracy: number | null;
  girPercent: number | null;
  scrambling: number | null;
  puttsPerRound: number | null;
}

interface PlayerTrends {
  sgTotal: 'up' | 'down' | 'stable';
  sgTee: 'up' | 'down' | 'stable';
  sgApproach: 'up' | 'down' | 'stable';
  sgAround: 'up' | 'down' | 'stable';
  sgPutting: 'up' | 'down' | 'stable';
}

interface PlayerDataGolf {
  playerId: string;
  playerName: string;
  category: string;
  handicap: number | null;
  dataGolfConnected: boolean;
  lastSync: string | null;
  roundsTracked: number;
  stats: PlayerStats;
  trends: PlayerTrends;
  tourComparison: {
    tour: string;
    gapToTour: number | null;
    percentile: number | null;
  } | null;
}

interface DashboardSummary {
  totalPlayers: number;
  connectedPlayers: number;
  totalRoundsTracked: number;
  lastSyncAt: string | null;
}

interface DashboardData {
  players: PlayerDataGolf[];
  summary: DashboardSummary;
  tourAverages: any;
}

export const CoachDataGolf: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterConnected, setFilterConnected] = useState<'all' | 'connected' | 'disconnected'>('all');
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [selectedTour, setSelectedTour] = useState<'pga' | 'euro' | 'kft'>('pga');

  // API state
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);

  // Fetch dashboard data
  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await dataGolfAPI.getCoachDashboard(selectedTour);
      if (response.data?.success) {
        setDashboardData(response.data.data);
      } else {
        setError('Kunne ikke hente data');
      }
    } catch (err: any) {
      console.error('Failed to fetch DataGolf dashboard:', err);
      setError(err.response?.data?.error || 'Kunne ikke hente data fra server');
    } finally {
      setLoading(false);
    }
  }, [selectedTour]);

  // Initial fetch
  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  // Trigger sync
  const handleSync = async () => {
    setSyncing(true);
    try {
      await dataGolfAPI.triggerSync();
      // Refetch after sync
      await fetchDashboard();
    } catch (err) {
      console.error('Sync failed:', err);
    } finally {
      setSyncing(false);
    }
  };

  const players = dashboardData?.players || [];

  const filteredPlayers = useMemo(() => {
    let result = [...players];

    if (searchQuery) {
      result = result.filter(p =>
        p.playerName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterConnected === 'connected') {
      result = result.filter(p => p.dataGolfConnected);
    } else if (filterConnected === 'disconnected') {
      result = result.filter(p => !p.dataGolfConnected);
    }

    return result;
  }, [players, searchQuery, filterConnected]);

  const stats = dashboardData?.summary || {
    totalPlayers: 0,
    connectedPlayers: 0,
    totalRoundsTracked: 0,
    lastSyncAt: null
  };

  const getCategoryClasses = (category: string) => {
    switch (category) {
      case 'A': return { bg: 'bg-ak-status-success/10', text: 'text-ak-status-success' };
      case 'B': return { bg: 'bg-ak-brand-primary/10', text: 'text-ak-brand-primary' };
      case 'C': return { bg: 'bg-ak-status-warning/10', text: 'text-ak-status-warning' };
      default: return { bg: 'bg-ak-surface-base', text: 'text-ak-text-secondary' };
    }
  };

  const getTrendIcon = useCallback((trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp size={12} className="text-ak-status-success" />;
      case 'down': return <TrendingDown size={12} className="text-ak-status-error" />;
      default: return <Activity size={12} className="text-ak-text-tertiary" />;
    }
  }, []);

  const formatSG = (value: number | null) => {
    if (value === null) return '-';
    if (value > 0) return `+${value.toFixed(1)}`;
    return value.toFixed(1);
  };

  const getSGClasses = (value: number | null) => {
    if (value === null) return 'text-ak-text-tertiary';
    if (value > 0) return 'text-ak-status-success';
    if (value < 0) return 'text-ak-status-error';
    return 'text-ak-text-secondary';
  };

  const formatLastSync = (dateString?: string | null) => {
    if (!dateString) return 'Ingen testdata';
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffHours < 1) return 'Akkurat nå';
    if (diffHours < 24) return `${diffHours} timer siden`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} dager siden`;
  };

  if (loading) {
    return (
      <div className="p-6 bg-ak-surface-subtle min-h-screen flex items-center justify-center">
        <StateCard
          variant="loading"
          title="Laster Data Golf statistikk..."
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-ak-surface-subtle min-h-screen flex items-center justify-center">
        <StateCard
          variant="error"
          title="Kunne ikke laste data"
          description={error}
          action={
            <Button variant="primary" onClick={fetchDashboard}>
              Prøv igjen
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="p-6 bg-ak-surface-subtle min-h-screen">
      {/* Header */}
      <div className="flex items-start gap-4 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-ak-brand-primary to-ak-brand-primary/80 flex items-center justify-center flex-shrink-0">
          <BarChart3 size={24} className="text-white" />
        </div>
        <div className="flex-1">
          <PageHeader
            title="Data Golf Statistikk"
            subtitle="Strokes Gained analyse og avansert spillerstatistikk"
            actions={
              <Button
                variant="secondary"
                size="sm"
                onClick={handleSync}
                disabled={syncing}
                loading={syncing}
                leftIcon={<RefreshCw size={14} />}
              >
                {syncing ? 'Synkroniserer...' : 'Oppdater'}
              </Button>
            }
            divider={false}
          />
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-ak-brand-primary/10 rounded-xl p-4 mb-6 border border-ak-brand-primary/20 flex items-center gap-3">
        <Info size={20} className="text-ak-brand-primary" />
        <div className="flex-1">
          <p className="text-sm text-ak-text-primary m-0">
            <strong>Strokes Gained</strong> estimeres basert på testresultater og sammenlignes med {selectedTour.toUpperCase()} Tour gjennomsnitt.
          </p>
        </div>
        <div className="flex gap-2">
          {(['pga', 'euro', 'kft'] as const).map(tour => (
            <button
              key={tour}
              onClick={() => setSelectedTour(tour)}
              className={`py-1.5 px-3 rounded-md border-none text-xs font-semibold cursor-pointer ${
                selectedTour === tour
                  ? 'bg-ak-brand-primary text-white'
                  : 'bg-ak-brand-primary/20 text-ak-brand-primary'
              }`}
            >
              {tour.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-ak-surface-base rounded-xl p-4 border border-ak-border-default">
          <p className="text-xs text-ak-text-tertiary m-0 mb-1">
            Totalt spillere
          </p>
          <p className="text-[28px] font-bold text-ak-text-primary m-0">
            {stats.totalPlayers}
          </p>
        </div>
        <div className="bg-ak-surface-base rounded-xl p-4 border border-ak-border-default">
          <div className="flex items-center gap-1.5 mb-1">
            <div className="w-2 h-2 rounded-full bg-ak-status-success" />
            <p className="text-xs text-ak-text-tertiary m-0">
              Med testdata
            </p>
          </div>
          <p className="text-[28px] font-bold text-ak-status-success m-0">
            {stats.connectedPlayers}
          </p>
        </div>
        <div className="bg-ak-surface-base rounded-xl p-4 border border-ak-border-default">
          <p className="text-xs text-ak-text-tertiary m-0 mb-1">
            Tester registrert
          </p>
          <p className="text-[28px] font-bold text-ak-text-primary m-0">
            {stats.totalRoundsTracked}
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4 mb-5 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-ak-text-tertiary"
          />
          <input
            type="text"
            placeholder="Søk etter spiller..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-3 pr-3 pl-10 rounded-[10px] border border-ak-border-default bg-ak-surface-base text-sm text-ak-text-primary outline-none"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'connected', 'disconnected'] as const).map(filter => (
            <button
              key={filter}
              onClick={() => setFilterConnected(filter)}
              className={`py-2.5 px-4 rounded-[10px] border-none text-[13px] font-medium cursor-pointer transition-all ${
                filterConnected === filter
                  ? 'bg-ak-brand-primary text-white'
                  : 'bg-ak-surface-base text-ak-text-secondary'
              }`}
            >
              {filter === 'all' ? 'Alle' : filter === 'connected' ? 'Med data' : 'Uten data'}
            </button>
          ))}
        </div>
      </div>

      {/* Player List */}
      <div className="flex flex-col gap-3">
        {filteredPlayers.map((player) => (
          <div
            key={player.playerId}
            className={`bg-ak-surface-base rounded-2xl p-5 border border-ak-border-default ${
              player.dataGolfConnected ? 'opacity-100' : 'opacity-70'
            }`}
          >
            {/* Player Header */}
            <div className={`flex justify-between items-start ${player.dataGolfConnected ? 'mb-4' : ''}`}>
              <div className="flex gap-3 items-center">
                <div className="w-12 h-12 rounded-full bg-ak-brand-primary/15 flex items-center justify-center text-lg font-semibold text-ak-brand-primary">
                  {player.playerName.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <SubSectionTitle className="m-0">
                      {player.playerName}
                    </SubSectionTitle>
                    <span className={`text-[11px] font-medium py-0.5 px-2 rounded ${getCategoryClasses(player.category).bg} ${getCategoryClasses(player.category).text}`}>
                      Kat. {player.category}
                    </span>
                    <span className={`text-[11px] py-0.5 px-2 rounded font-medium ${
                      player.dataGolfConnected
                        ? 'bg-ak-status-success/15 text-ak-status-success'
                        : 'bg-ak-status-error/15 text-ak-status-error'
                    }`}>
                      {player.dataGolfConnected ? 'Har testdata' : 'Mangler testdata'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    {player.handicap !== null && (
                      <span className="text-[13px] text-ak-text-secondary">
                        HCP: {player.handicap.toFixed(1)}
                      </span>
                    )}
                    {player.dataGolfConnected && (
                      <>
                        <span className="text-[13px] text-ak-text-tertiary">
                          {player.roundsTracked} tester
                        </span>
                        <span className="text-xs text-ak-text-tertiary">
                          Siste: {formatLastSync(player.lastSync)}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Total SG or Connect button */}
              {player.dataGolfConnected ? (
                <div className="flex items-center gap-2">
                  <div className={`text-right py-2 px-4 rounded-[10px] ${
                    (player.stats.sgTotal ?? 0) >= 0
                      ? 'bg-ak-status-success/15'
                      : 'bg-ak-status-error/15'
                  }`}>
                    <p className="text-[11px] text-ak-text-tertiary m-0 mb-0.5">
                      SG Total (est.)
                    </p>
                    <p className={`text-xl font-bold m-0 ${getSGClasses(player.stats.sgTotal)}`}>
                      {formatSG(player.stats.sgTotal)}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedPlayer(selectedPlayer === player.playerId ? null : player.playerId)}
                    className="py-2.5 px-3.5 rounded-lg border border-ak-border-default bg-transparent text-ak-text-secondary text-xs cursor-pointer flex items-center gap-1 hover:bg-ak-surface-subtle"
                  >
                    {selectedPlayer === player.playerId ? 'Skjul' : 'Detaljer'}
                    <ChevronRight
                      size={14}
                      className={`transition-transform ${selectedPlayer === player.playerId ? 'rotate-90' : ''}`}
                    />
                  </button>
                </div>
              ) : (
                <div className="py-2 px-4 bg-ak-status-error/15 rounded-lg text-xs text-ak-status-error">
                  Ingen testresultater enda
                </div>
              )}
            </div>

            {/* Expanded Stats */}
            {player.dataGolfConnected && selectedPlayer === player.playerId && (
              <div className="pt-4 border-t border-ak-border-default">
                {/* SG Breakdown */}
                <div className="mb-5">
                  <CardTitle className="m-0 mb-3 uppercase tracking-wide">
                    Strokes Gained Breakdown (estimert)
                  </CardTitle>
                  <div className="grid grid-cols-4 gap-3">
                    {[
                      { label: 'SG Tee', value: player.stats.sgTee, trend: player.trends.sgTee, icon: Crosshair },
                      { label: 'SG Approach', value: player.stats.sgApproach, trend: player.trends.sgApproach, icon: Target },
                      { label: 'SG Around', value: player.stats.sgAround, trend: player.trends.sgAround, icon: Flag },
                      { label: 'SG Putting', value: player.stats.sgPutting, trend: player.trends.sgPutting, icon: CircleDot }
                    ].map((stat) => (
                      <div key={stat.label} className="bg-ak-surface-muted rounded-[10px] p-3.5">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-1.5">
                            <stat.icon size={14} className="text-ak-text-tertiary" />
                            <span className="text-xs text-ak-text-secondary">
                              {stat.label}
                            </span>
                          </div>
                          {getTrendIcon(stat.trend)}
                        </div>
                        <p className={`text-[22px] font-bold m-0 ${getSGClasses(stat.value)}`}>
                          {formatSG(stat.value)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tour Comparison */}
                {player.tourComparison && (
                  <div className="mb-5">
                    <CardTitle className="m-0 mb-3 uppercase tracking-wide">
                      Sammenligning med {player.tourComparison.tour} Tour
                    </CardTitle>
                    <div className="bg-ak-surface-muted rounded-[10px] p-4 flex items-center gap-6">
                      <div>
                        <p className="text-xs text-ak-text-tertiary m-0 mb-1">
                          Gap til Tour Avg
                        </p>
                        <p className={`text-2xl font-bold m-0 ${getSGClasses(player.tourComparison.gapToTour)}`}>
                          {formatSG(player.tourComparison.gapToTour)} slag
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-ak-text-tertiary m-0 mb-1">
                          Percentil
                        </p>
                        <p className="text-2xl font-bold text-ak-text-primary m-0">
                          {player.tourComparison.percentile ?? '-'}%
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Traditional Stats */}
                <div>
                  <CardTitle className="m-0 mb-3 uppercase tracking-wide">
                    Testbasert Statistikk
                  </CardTitle>
                  <div className="grid grid-cols-5 gap-3">
                    {[
                      { label: 'Driving', value: player.stats.drivingDistance ? `${player.stats.drivingDistance}m` : '-', subtext: player.stats.drivingAccuracy ? `${player.stats.drivingAccuracy}% acc` : '' },
                      { label: 'GIR', value: player.stats.girPercent ? `${player.stats.girPercent}%` : '-', subtext: 'Greens in Reg' },
                      { label: 'Scrambling', value: player.stats.scrambling ? `${player.stats.scrambling}%` : '-', subtext: 'Save rate' },
                      { label: 'Putts/Runde', value: player.stats.puttsPerRound?.toFixed(1) ?? '-', subtext: 'gjennomsnitt' },
                      { label: 'Tester', value: player.roundsTracked, subtext: 'analysert' }
                    ].map((stat) => (
                      <div key={stat.label} className="bg-ak-surface-muted rounded-[10px] p-3 text-center">
                        <p className="text-[11px] text-ak-text-tertiary m-0 mb-1">
                          {stat.label}
                        </p>
                        <p className="text-lg font-bold text-ak-text-primary m-0 mb-0.5">
                          {stat.value}
                        </p>
                        <p className="text-[10px] text-ak-text-tertiary m-0">
                          {stat.subtext}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredPlayers.length === 0 && (
        <StateCard
          variant="empty"
          title="Ingen spillere funnet"
          description={players.length === 0 ? 'Last inn spillerdata for å komme i gang.' : 'Prøv å justere filteret for å se flere spillere.'}
        />
      )}
    </div>
  );
};

export default CoachDataGolf;
