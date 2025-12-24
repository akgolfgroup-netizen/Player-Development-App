/**
 * AK Golf Academy - Coach Tournament Results
 * Design System v3.0 - Blue Palette 01
 *
 * Resultater fra turneringer for trenerens spillere.
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
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
import { tokens } from '../../design-tokens';

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
    const colors = ['#10456A', '#C9A227', '#4A7C59', '#C45B4E', '#8E8E93'];

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
      return { icon: Trophy, color: tokens.colors.gold, bg: `${tokens.colors.gold}20`, label: '1.' };
    } else if (position === 2) {
      return { icon: Medal, color: '#A0A0A0', bg: '#A0A0A015', label: '2.' };
    } else if (position === 3) {
      return { icon: Medal, color: '#CD7F32', bg: '#CD7F3215', label: '3.' };
    }
    return null;
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: tokens.colors.snow,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            border: `4px solid ${tokens.colors.gray300}`,
            borderTopColor: tokens.colors.primary,
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }}
        />
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: tokens.colors.snow,
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          backgroundColor: tokens.colors.white,
          borderBottom: `1px solid ${tokens.colors.gray200}`,
          padding: '20px 24px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
          <button
            onClick={() => navigate('/coach/tournaments')}
            style={{
              width: 40,
              height: 40,
              borderRadius: tokens.radius.md,
              backgroundColor: tokens.colors.gray100,
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <ArrowLeft size={20} color={tokens.colors.charcoal} />
          </button>
          <div>
            <h1 style={{ ...tokens.typography.title1, color: tokens.colors.charcoal, margin: 0 }}>
              Turneringsresultater
            </h1>
            <p style={{ ...tokens.typography.subheadline, color: tokens.colors.steel, margin: '4px 0 0' }}>
              Resultater og statistikk for dine spillere
            </p>
          </div>
        </div>

        {/* Summary stats */}
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 14px',
              backgroundColor: `${tokens.colors.primary}10`,
              borderRadius: tokens.radius.md,
            }}
          >
            <Trophy size={16} color={tokens.colors.primary} />
            <span style={{ fontSize: '13px', color: tokens.colors.charcoal }}>
              <strong>{summary.totalTournaments}</strong> turneringer
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 14px',
              backgroundColor: `${tokens.colors.gold}15`,
              borderRadius: tokens.radius.md,
            }}
          >
            <Star size={16} color={tokens.colors.gold} />
            <span style={{ fontSize: '13px', color: tokens.colors.charcoal }}>
              <strong>{summary.totalWins}</strong> seiere
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 14px',
              backgroundColor: `${tokens.colors.success}10`,
              borderRadius: tokens.radius.md,
            }}
          >
            <Medal size={16} color={tokens.colors.success} />
            <span style={{ fontSize: '13px', color: tokens.colors.charcoal }}>
              <strong>{summary.totalTopThree}</strong> pallplasser
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 14px',
              backgroundColor: tokens.colors.gray100,
              borderRadius: tokens.radius.md,
            }}
          >
            <Award size={16} color={tokens.colors.steel} />
            <span style={{ fontSize: '13px', color: tokens.colors.charcoal }}>
              Snitt: <strong>{summary.avgPosition}.</strong> plass
            </span>
          </div>
        </div>
      </div>

      {/* View toggle and filters */}
      <div
        style={{
          backgroundColor: tokens.colors.white,
          padding: '16px 24px',
          borderBottom: `1px solid ${tokens.colors.gray200}`,
          display: 'flex',
          gap: '12px',
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', gap: '4px', backgroundColor: tokens.colors.gray100, borderRadius: tokens.radius.md, padding: '4px' }}>
          <button
            onClick={() => setView('results')}
            style={{
              padding: '8px 16px',
              backgroundColor: view === 'results' ? tokens.colors.white : 'transparent',
              color: view === 'results' ? tokens.colors.charcoal : tokens.colors.steel,
              border: 'none',
              borderRadius: tokens.radius.sm,
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
              boxShadow: view === 'results' ? tokens.shadows.card : 'none',
            }}
          >
            Resultater
          </button>
          <button
            onClick={() => setView('stats')}
            style={{
              padding: '8px 16px',
              backgroundColor: view === 'stats' ? tokens.colors.white : 'transparent',
              color: view === 'stats' ? tokens.colors.charcoal : tokens.colors.steel,
              border: 'none',
              borderRadius: tokens.radius.sm,
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
              boxShadow: view === 'stats' ? tokens.shadows.card : 'none',
            }}
          >
            Spillerstatistikk
          </button>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 12px',
            backgroundColor: tokens.colors.gray100,
            borderRadius: tokens.radius.md,
            flex: 1,
            maxWidth: '250px',
          }}
        >
          <Search size={18} color={tokens.colors.steel} />
          <input
            type="text"
            placeholder="Søk..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              border: 'none',
              backgroundColor: 'transparent',
              fontSize: '14px',
              color: tokens.colors.charcoal,
              outline: 'none',
            }}
          />
        </div>

        <select
          value={playerFilter}
          onChange={(e) => setPlayerFilter(e.target.value)}
          style={{
            padding: '8px 12px',
            backgroundColor: tokens.colors.white,
            border: `1px solid ${tokens.colors.gray300}`,
            borderRadius: tokens.radius.md,
            fontSize: '13px',
            color: tokens.colors.charcoal,
          }}
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
          style={{
            padding: '8px 12px',
            backgroundColor: tokens.colors.white,
            border: `1px solid ${tokens.colors.gray300}`,
            borderRadius: tokens.radius.md,
            fontSize: '13px',
            color: tokens.colors.charcoal,
          }}
        >
          <option value="all">All tid</option>
          <option value="month">Siste måned</option>
          <option value="quarter">Siste 3 mnd</option>
          <option value="year">Siste år</option>
        </select>
      </div>

      {/* Content */}
      <div style={{ padding: '24px' }}>
        {view === 'results' ? (
          /* Results list */
          filteredResults.length === 0 ? (
            <div
              style={{
                backgroundColor: tokens.colors.white,
                borderRadius: tokens.radius.lg,
                padding: '48px',
                textAlign: 'center',
                boxShadow: tokens.shadows.card,
              }}
            >
              <Trophy size={48} color={tokens.colors.steel} style={{ marginBottom: '16px' }} />
              <h3 style={{ ...tokens.typography.headline, color: tokens.colors.charcoal, margin: '0 0 8px' }}>
                Ingen resultater funnet
              </h3>
              <p style={{ ...tokens.typography.subheadline, color: tokens.colors.steel, margin: 0 }}>
                Prøv å endre filter eller søkekriterier
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {filteredResults.map((result) => {
                const positionBadge = getPositionBadge(result.position);

                return (
                  <div
                    key={result.id}
                    style={{
                      backgroundColor: tokens.colors.white,
                      borderRadius: tokens.radius.lg,
                      boxShadow: tokens.shadows.card,
                      overflow: 'hidden',
                      border: positionBadge ? `2px solid ${positionBadge.color}` : `1px solid ${tokens.colors.gray200}`,
                    }}
                  >
                    <div style={{ padding: '16px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          {/* Position */}
                          <div
                            style={{
                              width: 48,
                              height: 48,
                              borderRadius: tokens.radius.md,
                              backgroundColor: positionBadge ? positionBadge.bg : tokens.colors.gray100,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            {positionBadge ? (
                              <positionBadge.icon size={24} color={positionBadge.color} />
                            ) : (
                              <span style={{ fontSize: '18px', fontWeight: 700, color: tokens.colors.charcoal }}>
                                {result.position}
                              </span>
                            )}
                          </div>

                          <div>
                            <h3 style={{ ...tokens.typography.headline, color: tokens.colors.charcoal, margin: 0 }}>
                              {result.tournamentName}
                            </h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                              <Calendar size={14} color={tokens.colors.steel} />
                              <span style={{ fontSize: '13px', color: tokens.colors.steel }}>
                                {formatDate(result.date)}
                              </span>
                              <span style={{ color: tokens.colors.gray300 }}>•</span>
                              <MapPin size={14} color={tokens.colors.steel} />
                              <span style={{ fontSize: '13px', color: tokens.colors.steel }}>
                                {result.location}
                              </span>
                            </div>
                          </div>
                        </div>

                        {result.highlight && (
                          <div
                            style={{
                              padding: '6px 12px',
                              backgroundColor: `${tokens.colors.gold}15`,
                              color: tokens.colors.gold,
                              borderRadius: tokens.radius.full,
                              fontSize: '12px',
                              fontWeight: 600,
                            }}
                          >
                            {result.highlight}
                          </div>
                        )}
                      </div>

                      {/* Player and score */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginTop: '16px',
                          padding: '12px',
                          backgroundColor: tokens.colors.gray50,
                          borderRadius: tokens.radius.md,
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: '50%',
                              backgroundColor: tokens.colors.primary,
                              color: tokens.colors.white,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '12px',
                              fontWeight: 600,
                            }}
                          >
                            {result.playerInitials}
                          </div>
                          <div>
                            <div style={{ fontSize: '14px', fontWeight: 500, color: tokens.colors.charcoal }}>
                              {result.playerName}
                            </div>
                            <div style={{ fontSize: '12px', color: tokens.colors.steel }}>
                              Kategori {result.playerCategory}
                            </div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                          <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '12px', color: tokens.colors.steel }}>Plassering</div>
                            <div style={{ fontSize: '18px', fontWeight: 700, color: tokens.colors.charcoal }}>
                              {result.position}/{result.totalParticipants}
                            </div>
                          </div>
                          <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '12px', color: tokens.colors.steel }}>Score</div>
                            <div style={{ fontSize: '18px', fontWeight: 700, color: tokens.colors.charcoal }}>
                              {result.score}
                            </div>
                          </div>
                          <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '12px', color: tokens.colors.steel }}>Til par</div>
                            <div
                              style={{
                                fontSize: '18px',
                                fontWeight: 700,
                                color:
                                  result.scoreToPar < 0
                                    ? tokens.colors.success
                                    : result.scoreToPar > 0
                                    ? tokens.colors.error
                                    : tokens.colors.charcoal,
                              }}
                            >
                              {result.scoreToPar > 0 ? '+' : ''}
                              {result.scoreToPar}
                            </div>
                          </div>
                          {result.rounds.length > 1 && (
                            <div style={{ textAlign: 'center' }}>
                              <div style={{ fontSize: '12px', color: tokens.colors.steel }}>Runder</div>
                              <div style={{ fontSize: '14px', fontWeight: 500, color: tokens.colors.charcoal }}>
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {playerStats.map((player) => (
              <div
                key={player.id}
                style={{
                  backgroundColor: tokens.colors.white,
                  borderRadius: tokens.radius.lg,
                  boxShadow: tokens.shadows.card,
                  padding: '20px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: '50%',
                        backgroundColor: player.avatarColor,
                        color: tokens.colors.white,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '18px',
                        fontWeight: 600,
                      }}
                    >
                      {player.initials}
                    </div>
                    <div>
                      <h3 style={{ ...tokens.typography.headline, color: tokens.colors.charcoal, margin: 0 }}>
                        {player.name}
                      </h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                        <span style={{ fontSize: '13px', color: tokens.colors.steel }}>
                          {player.tournamentsPlayed} turneringer
                        </span>
                        <span
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '12px',
                            fontWeight: 500,
                            color:
                              player.trend === 'up'
                                ? tokens.colors.success
                                : player.trend === 'down'
                                ? tokens.colors.error
                                : tokens.colors.steel,
                          }}
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

                  <button
                    onClick={() => navigate(`/coach/athletes/${player.id}`)}
                    style={{
                      padding: '8px 14px',
                      backgroundColor: tokens.colors.gray100,
                      color: tokens.colors.charcoal,
                      border: 'none',
                      borderRadius: tokens.radius.md,
                      fontSize: '13px',
                      fontWeight: 500,
                      cursor: 'pointer',
                    }}
                  >
                    Se profil
                  </button>
                </div>

                {/* Stats grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '12px' }}>
                  <div
                    style={{
                      padding: '12px',
                      backgroundColor: `${tokens.colors.gold}10`,
                      borderRadius: tokens.radius.md,
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: '24px', fontWeight: 700, color: tokens.colors.gold }}>
                      {player.wins}
                    </div>
                    <div style={{ fontSize: '12px', color: tokens.colors.steel }}>Seiere</div>
                  </div>
                  <div
                    style={{
                      padding: '12px',
                      backgroundColor: `${tokens.colors.success}10`,
                      borderRadius: tokens.radius.md,
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: '24px', fontWeight: 700, color: tokens.colors.success }}>
                      {player.topThree}
                    </div>
                    <div style={{ fontSize: '12px', color: tokens.colors.steel }}>Top 3</div>
                  </div>
                  <div
                    style={{
                      padding: '12px',
                      backgroundColor: `${tokens.colors.primary}10`,
                      borderRadius: tokens.radius.md,
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: '24px', fontWeight: 700, color: tokens.colors.primary }}>
                      {player.topTen}
                    </div>
                    <div style={{ fontSize: '12px', color: tokens.colors.steel }}>Top 10</div>
                  </div>
                  <div
                    style={{
                      padding: '12px',
                      backgroundColor: tokens.colors.gray100,
                      borderRadius: tokens.radius.md,
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: '24px', fontWeight: 700, color: tokens.colors.charcoal }}>
                      {player.averagePosition}
                    </div>
                    <div style={{ fontSize: '12px', color: tokens.colors.steel }}>Snitt plass</div>
                  </div>
                  <div
                    style={{
                      padding: '12px',
                      backgroundColor: tokens.colors.gray100,
                      borderRadius: tokens.radius.md,
                      textAlign: 'center',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '24px',
                        fontWeight: 700,
                        color:
                          player.averageScore < 0
                            ? tokens.colors.success
                            : player.averageScore > 0
                            ? tokens.colors.error
                            : tokens.colors.charcoal,
                      }}
                    >
                      {player.averageScore > 0 ? '+' : ''}
                      {player.averageScore}
                    </div>
                    <div style={{ fontSize: '12px', color: tokens.colors.steel }}>Snitt til par</div>
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
