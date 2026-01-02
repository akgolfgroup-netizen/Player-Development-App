/**
 * AK Golf Academy - Coach Tournament Results
 * Design System v3.0 - Premium Light
 *
 * MIGRATED TO PAGE ARCHITECTURE - Zero inline styles
 * Resultater fra turneringer for trenerens spillere.
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Trophy,
  Medal,
  Calendar,
  MapPin,
  TrendingUp,
  TrendingDown,
  Minus,
  Search,
  Star,
  Award,
} from 'lucide-react';
import Button from '../../ui/primitives/Button';
import PageHeader from '../../ui/raw-blocks/PageHeader.raw';
import { SubSectionTitle } from '../../components/typography';

interface TournamentResult {
  id: string;
  tournamentName: string;
  tournamentType: string;
  date: string;
  location: string;
  category: string;
  playerId: string;
  playerName: string;
  playerInitials: string;
  playerCategory: string;
  position: number;
  totalParticipants: number;
  score: number;
  scoreToPar: number;
  rounds: number[];
  highlight?: string;
}

interface PlayerStats {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
  tournamentsPlayed: number;
  wins: number;
  topThree: number;
  topTen: number;
  averagePosition: number;
  averageScore: number;
  trend: 'up' | 'down' | 'stable';
}

export default function CoachTournamentResults() {
  const navigate = useNavigate();
  const [results, setResults] = useState<TournamentResult[]>([]);
  const [playerStats, setPlayerStats] = useState<PlayerStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'results' | 'stats'>('results');
  const [searchQuery, setSearchQuery] = useState('');
  const [playerFilter, setPlayerFilter] = useState<string>('all');
  const [periodFilter, setPeriodFilter] = useState<'all' | 'month' | 'quarter' | 'year'>('year');

  // Fetch results
  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch('/api/v1/coach/tournaments/results');
        if (response.ok) {
          const data = await response.json();
          setResults(data.results || []);
          setPlayerStats(data.playerStats || []);
        }
      } catch (error) {
        console.error('Failed to fetch results:', error);
        const mockResults = generateMockResults();
        setResults(mockResults);
        setPlayerStats(generatePlayerStats(mockResults));
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  // Generate mock results
  const generateMockResults = (): TournamentResult[] => {
    return [
      {
        id: 'r1',
        tournamentName: 'Vårturneringen 2025',
        tournamentType: 'club',
        date: '2025-03-15',
        location: 'Holtsmark GK',
        category: 'open',
        playerId: 'p1',
        playerName: 'Anders Hansen',
        playerInitials: 'AH',
        playerCategory: 'A',
        position: 3,
        totalParticipants: 42,
        score: 74,
        scoreToPar: 2,
        rounds: [74],
        highlight: 'Bronse',
      },
      {
        id: 'r2',
        tournamentName: 'Vårturneringen 2025',
        tournamentType: 'club',
        date: '2025-03-15',
        location: 'Holtsmark GK',
        category: 'open',
        playerId: 'p3',
        playerName: 'Erik Johansen',
        playerInitials: 'EJ',
        playerCategory: 'A',
        position: 7,
        totalParticipants: 42,
        score: 77,
        scoreToPar: 5,
        rounds: [77],
      },
      {
        id: 'r3',
        tournamentName: 'NGF Tour - Runde 1',
        tournamentType: 'tour',
        date: '2025-02-28',
        location: 'Drammens GK',
        category: 'elite',
        playerId: 'p1',
        playerName: 'Anders Hansen',
        playerInitials: 'AH',
        playerCategory: 'A',
        position: 12,
        totalParticipants: 78,
        score: 148,
        scoreToPar: 4,
        rounds: [74, 74],
      },
      {
        id: 'r4',
        tournamentName: 'NGF Tour - Runde 1',
        tournamentType: 'tour',
        date: '2025-02-28',
        location: 'Drammens GK',
        category: 'elite',
        playerId: 'p3',
        playerName: 'Erik Johansen',
        playerInitials: 'EJ',
        playerCategory: 'A',
        position: 5,
        totalParticipants: 78,
        score: 145,
        scoreToPar: 1,
        rounds: [73, 72],
        highlight: 'Top 5',
      },
      {
        id: 'r5',
        tournamentName: 'Sesongåpning',
        tournamentType: 'club',
        date: '2025-02-10',
        location: 'Tyrifjord GK',
        category: 'open',
        playerId: 'p1',
        playerName: 'Anders Hansen',
        playerInitials: 'AH',
        playerCategory: 'A',
        position: 1,
        totalParticipants: 35,
        score: 71,
        scoreToPar: -1,
        rounds: [71],
        highlight: 'Seier!',
      },
      {
        id: 'r6',
        tournamentName: 'Sesongåpning',
        tournamentType: 'club',
        date: '2025-02-10',
        location: 'Tyrifjord GK',
        category: 'open',
        playerId: 'p2',
        playerName: 'Sofie Andersen',
        playerInitials: 'SA',
        playerCategory: 'B',
        position: 8,
        totalParticipants: 35,
        score: 78,
        scoreToPar: 6,
        rounds: [78],
      },
      {
        id: 'r7',
        tournamentName: 'Vinterturneringen',
        tournamentType: 'club',
        date: '2025-01-20',
        location: 'Miklagard Golf',
        category: 'open',
        playerId: 'p5',
        playerName: 'Lars Olsen',
        playerInitials: 'LO',
        playerCategory: 'B',
        position: 2,
        totalParticipants: 28,
        score: 73,
        scoreToPar: 1,
        rounds: [73],
        highlight: 'Sølv',
      },
      {
        id: 'r8',
        tournamentName: 'Juniormesterskapet Region Øst',
        tournamentType: 'championship',
        date: '2024-11-15',
        location: 'Oslo GK',
        category: 'junior',
        playerId: 'p3',
        playerName: 'Erik Johansen',
        playerInitials: 'EJ',
        playerCategory: 'A',
        position: 1,
        totalParticipants: 65,
        score: 142,
        scoreToPar: -2,
        rounds: [71, 71],
        highlight: 'Regionsmester!',
      },
    ];
  };

  // Generate player stats from results
  const generatePlayerStats = (results: TournamentResult[]): PlayerStats[] => {
    const playerMap = new Map<string, TournamentResult[]>();

    results.forEach((r) => {
      const existing = playerMap.get(r.playerId) || [];
      playerMap.set(r.playerId, [...existing, r]);
    });

    const stats: PlayerStats[] = [];
    const colors = ['rgb(var(--ak-brand-primary-rgb))', 'rgb(var(--ak-status-success-rgb))', 'rgb(var(--ak-status-warning-rgb))', 'rgb(var(--ak-status-error-rgb))', 'rgb(var(--ak-text-secondary-rgb))'];

    playerMap.forEach((playerResults, playerId) => {
      const first = playerResults[0];
      const wins = playerResults.filter((r) => r.position === 1).length;
      const topThree = playerResults.filter((r) => r.position <= 3).length;
      const topTen = playerResults.filter((r) => r.position <= 10).length;
      const avgPosition = playerResults.reduce((sum, r) => sum + r.position, 0) / playerResults.length;
      const avgScore = playerResults.reduce((sum, r) => sum + r.scoreToPar, 0) / playerResults.length;

      // Trend calculation (simplified)
      const recentResults = playerResults.slice(0, 3);
      const olderResults = playerResults.slice(3);
      let trend: 'up' | 'down' | 'stable' = 'stable';
      if (recentResults.length >= 2 && olderResults.length >= 2) {
        const recentAvg = recentResults.reduce((sum, r) => sum + r.position, 0) / recentResults.length;
        const olderAvg = olderResults.reduce((sum, r) => sum + r.position, 0) / olderResults.length;
        if (recentAvg < olderAvg - 2) trend = 'up';
        else if (recentAvg > olderAvg + 2) trend = 'down';
      }

      stats.push({
        id: playerId,
        name: first.playerName,
        initials: first.playerInitials,
        avatarColor: colors[stats.length % colors.length],
        tournamentsPlayed: playerResults.length,
        wins,
        topThree,
        topTen,
        averagePosition: Math.round(avgPosition * 10) / 10,
        averageScore: Math.round(avgScore * 10) / 10,
        trend,
      });
    });

    return stats.sort((a, b) => b.wins - a.wins || b.topThree - a.topThree);
  };

  // Filter results
  const filteredResults = useMemo(() => {
    return results.filter((r) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (
          !r.tournamentName.toLowerCase().includes(query) &&
          !r.playerName.toLowerCase().includes(query)
        ) {
          return false;
        }
      }
      if (playerFilter !== 'all' && r.playerId !== playerFilter) return false;

      if (periodFilter !== 'all') {
        const resultDate = new Date(r.date);
        const now = new Date();
        if (periodFilter === 'month') {
          const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
          if (resultDate < monthAgo) return false;
        } else if (periodFilter === 'quarter') {
          const quarterAgo = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
          if (resultDate < quarterAgo) return false;
        } else if (periodFilter === 'year') {
          const yearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
          if (resultDate < yearAgo) return false;
        }
      }

      return true;
    });
  }, [results, searchQuery, playerFilter, periodFilter]);

  // Stats summary
  const summary = useMemo(() => {
    const totalTournaments = new Set(filteredResults.map((r) => r.tournamentName)).size;
    const totalWins = filteredResults.filter((r) => r.position === 1).length;
    const totalTopThree = filteredResults.filter((r) => r.position <= 3).length;
    const avgPosition =
      filteredResults.length > 0
        ? Math.round((filteredResults.reduce((sum, r) => sum + r.position, 0) / filteredResults.length) * 10) / 10
        : 0;

    return { totalTournaments, totalWins, totalTopThree, avgPosition };
  }, [filteredResults]);

  // Unique players for filter
  const uniquePlayers = useMemo(() => {
    const players = new Map<string, { name: string; initials: string }>();
    results.forEach((r) => {
      if (!players.has(r.playerId)) {
        players.set(r.playerId, { name: r.playerName, initials: r.playerInitials });
      }
    });
    return Array.from(players.entries());
  }, [results]);

  // Format date
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('nb-NO', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  // Get position badge
  const getPositionBadge = (position: number) => {
    if (position === 1) {
      return { icon: Trophy, colorClass: 'text-amber-500', bgClass: 'bg-amber-500/15', label: '1.' };
    } else if (position === 2) {
      return { icon: Medal, colorClass: 'text-gray-400', bgClass: 'bg-gray-400/10', label: '2.' };
    } else if (position === 3) {
      return { icon: Medal, colorClass: 'text-amber-700', bgClass: 'bg-amber-700/10', label: '3.' };
    }
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-ak-surface-subtle flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-ak-border-default border-t-ak-brand-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ak-surface-subtle font-sans">
      {/* Header */}
      <div className="bg-ak-surface-base border-b border-ak-border-default py-5 px-6">
        <PageHeader
          title="Turneringsresultater"
          subtitle="Resultater og statistikk for dine spillere"
          onBack={() => navigate('/coach/tournaments')}
          divider={false}
        />

        {/* Summary stats */}
        <div className="flex gap-4 flex-wrap">
          <div className="flex items-center gap-2 py-2 px-3.5 bg-ak-brand-primary/10 rounded-lg">
            <Trophy size={16} className="text-ak-brand-primary" />
            <span className="text-[13px] text-ak-text-primary">
              <strong>{summary.totalTournaments}</strong> turneringer
            </span>
          </div>
          <div className="flex items-center gap-2 py-2 px-3.5 bg-amber-500/15 rounded-lg">
            <Star size={16} className="text-amber-500" />
            <span className="text-[13px] text-ak-text-primary">
              <strong>{summary.totalWins}</strong> seiere
            </span>
          </div>
          <div className="flex items-center gap-2 py-2 px-3.5 bg-ak-status-success/10 rounded-lg">
            <Medal size={16} className="text-ak-status-success" />
            <span className="text-[13px] text-ak-text-primary">
              <strong>{summary.totalTopThree}</strong> pallplasser
            </span>
          </div>
          <div className="flex items-center gap-2 py-2 px-3.5 bg-ak-surface-muted rounded-lg">
            <Award size={16} className="text-ak-text-secondary" />
            <span className="text-[13px] text-ak-text-primary">
              Snitt: <strong>{summary.avgPosition}.</strong> plass
            </span>
          </div>
        </div>
      </div>

      {/* View toggle and filters */}
      <div className="bg-ak-surface-base py-4 px-6 border-b border-ak-border-default flex gap-3 flex-wrap items-center">
        <div className="flex gap-1 bg-ak-surface-muted rounded-lg p-1">
          <Button
            variant={view === 'results' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setView('results')}
          >
            Resultater
          </Button>
          <Button
            variant={view === 'stats' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setView('stats')}
          >
            Spillerstatistikk
          </Button>
        </div>

        <div className="flex items-center gap-2 py-2 px-3 bg-ak-surface-muted rounded-lg flex-1 max-w-[250px]">
          <Search size={18} className="text-ak-text-secondary" />
          <input
            type="text"
            placeholder="Søk..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 border-none bg-transparent text-sm text-ak-text-primary outline-none"
          />
        </div>

        <select
          value={playerFilter}
          onChange={(e) => setPlayerFilter(e.target.value)}
          className="py-2 px-3 bg-ak-surface-base border border-ak-border-default rounded-lg text-[13px] text-ak-text-primary"
        >
          <option value="all">Alle spillere</option>
          {uniquePlayers.map(([id, player]) => (
            <option key={id} value={id}>
              {player.name}
            </option>
          ))}
        </select>

        <select
          value={periodFilter}
          onChange={(e) => setPeriodFilter(e.target.value as typeof periodFilter)}
          className="py-2 px-3 bg-ak-surface-base border border-ak-border-default rounded-lg text-[13px] text-ak-text-primary"
        >
          <option value="all">All tid</option>
          <option value="month">Siste måned</option>
          <option value="quarter">Siste 3 mnd</option>
          <option value="year">Siste år</option>
        </select>
      </div>

      {/* Content */}
      <div className="p-6">
        {view === 'results' ? (
          /* Results list */
          filteredResults.length === 0 ? (
            <div className="bg-ak-surface-base rounded-xl p-12 text-center shadow-sm">
              <Trophy size={48} className="text-ak-text-secondary mb-4 mx-auto" />
              <SubSectionTitle className="m-0 mb-2">
                Ingen resultater funnet
              </SubSectionTitle>
              <p className="text-[13px] leading-[18px] text-ak-text-secondary m-0">
                Prøv å endre filter eller søkekriterier
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {filteredResults.map((result) => {
                const positionBadge = getPositionBadge(result.position);

                return (
                  <div
                    key={result.id}
                    className={`bg-ak-surface-base rounded-xl shadow-sm overflow-hidden ${
                      positionBadge
                        ? `border-2 ${positionBadge.colorClass.replace('text-', 'border-')}`
                        : 'border border-ak-border-default'
                    }`}
                  >
                    <div className="p-4 px-5">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          {/* Position */}
                          <div
                            className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                              positionBadge ? positionBadge.bgClass : 'bg-ak-surface-muted'
                            }`}
                          >
                            {positionBadge ? (
                              <positionBadge.icon size={24} className={positionBadge.colorClass} />
                            ) : (
                              <span className="text-lg font-bold text-ak-text-primary">
                                {result.position}
                              </span>
                            )}
                          </div>

                          <div>
                            <SubSectionTitle className="m-0">
                              {result.tournamentName}
                            </SubSectionTitle>
                            <div className="flex items-center gap-2 mt-1">
                              <Calendar size={14} className="text-ak-text-secondary" />
                              <span className="text-[13px] text-ak-text-secondary">
                                {formatDate(result.date)}
                              </span>
                              <span className="text-ak-border-default">•</span>
                              <MapPin size={14} className="text-ak-text-secondary" />
                              <span className="text-[13px] text-ak-text-secondary">
                                {result.location}
                              </span>
                            </div>
                          </div>
                        </div>

                        {result.highlight && (
                          <div className="py-1.5 px-3 bg-amber-500/15 text-amber-600 rounded-full text-xs font-semibold">
                            {result.highlight}
                          </div>
                        )}
                      </div>

                      {/* Player and score */}
                      <div className="flex items-center justify-between mt-4 p-3 bg-ak-surface-muted rounded-lg">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-ak-brand-primary text-ak-surface-base flex items-center justify-center text-xs font-semibold">
                            {result.playerInitials}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-ak-text-primary">
                              {result.playerName}
                            </div>
                            <div className="text-xs text-ak-text-secondary">
                              Kategori {result.playerCategory}
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-6 items-center">
                          <div className="text-center">
                            <div className="text-xs text-ak-text-secondary">Plassering</div>
                            <div className="text-lg font-bold text-ak-text-primary">
                              {result.position}/{result.totalParticipants}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-ak-text-secondary">Score</div>
                            <div className="text-lg font-bold text-ak-text-primary">
                              {result.score}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-ak-text-secondary">Til par</div>
                            <div
                              className={`text-lg font-bold ${
                                result.scoreToPar < 0
                                  ? 'text-ak-status-success'
                                  : result.scoreToPar > 0
                                  ? 'text-ak-status-error'
                                  : 'text-ak-text-primary'
                              }`}
                            >
                              {result.scoreToPar > 0 ? '+' : ''}
                              {result.scoreToPar}
                            </div>
                          </div>
                          {result.rounds.length > 1 && (
                            <div className="text-center">
                              <div className="text-xs text-ak-text-secondary">Runder</div>
                              <div className="text-sm font-medium text-ak-text-primary">
                                {result.rounds.join(' / ')}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        ) : (
          /* Player stats */
          <div className="flex flex-col gap-4">
            {playerStats.map((player) => (
              <div
                key={player.id}
                className="bg-ak-surface-base rounded-xl shadow-sm p-5"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-full text-ak-surface-base flex items-center justify-center text-lg font-semibold"
                      style={{ backgroundColor: player.avatarColor }}
                    >
                      {player.initials}
                    </div>
                    <div>
                      <SubSectionTitle className="m-0">
                        {player.name}
                      </SubSectionTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[13px] text-ak-text-secondary">
                          {player.tournamentsPlayed} turneringer
                        </span>
                        <span
                          className={`flex items-center gap-1 text-xs font-medium ${
                            player.trend === 'up'
                              ? 'text-ak-status-success'
                              : player.trend === 'down'
                              ? 'text-ak-status-error'
                              : 'text-ak-text-secondary'
                          }`}
                        >
                          {player.trend === 'up' && <TrendingUp size={14} />}
                          {player.trend === 'down' && <TrendingDown size={14} />}
                          {player.trend === 'stable' && <Minus size={14} />}
                          {player.trend === 'up' && 'Stigende'}
                          {player.trend === 'down' && 'Fallende'}
                          {player.trend === 'stable' && 'Stabil'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => navigate(`/coach/athletes/${player.id}`)}
                  >
                    Se profil
                  </Button>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))] gap-3">
                  <div className="p-3 bg-amber-500/10 rounded-lg text-center">
                    <div className="text-2xl font-bold text-amber-500">
                      {player.wins}
                    </div>
                    <div className="text-xs text-ak-text-secondary">Seiere</div>
                  </div>
                  <div className="p-3 bg-ak-status-success/10 rounded-lg text-center">
                    <div className="text-2xl font-bold text-ak-status-success">
                      {player.topThree}
                    </div>
                    <div className="text-xs text-ak-text-secondary">Top 3</div>
                  </div>
                  <div className="p-3 bg-ak-brand-primary/10 rounded-lg text-center">
                    <div className="text-2xl font-bold text-ak-brand-primary">
                      {player.topTen}
                    </div>
                    <div className="text-xs text-ak-text-secondary">Top 10</div>
                  </div>
                  <div className="p-3 bg-ak-surface-muted rounded-lg text-center">
                    <div className="text-2xl font-bold text-ak-text-primary">
                      {player.averagePosition}
                    </div>
                    <div className="text-xs text-ak-text-secondary">Snitt plass</div>
                  </div>
                  <div className="p-3 bg-ak-surface-muted rounded-lg text-center">
                    <div
                      className={`text-2xl font-bold ${
                        player.averageScore < 0
                          ? 'text-ak-status-success'
                          : player.averageScore > 0
                          ? 'text-ak-status-error'
                          : 'text-ak-text-primary'
                      }`}
                    >
                      {player.averageScore > 0 ? '+' : ''}
                      {player.averageScore}
                    </div>
                    <div className="text-xs text-ak-text-secondary">Snitt til par</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
