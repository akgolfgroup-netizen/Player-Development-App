/**
 * AK Golf Academy - Coach Tournament Results
 * Design System v3.0 - Blue Palette 01
 *
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
    const colors = ['var(--ak-session-spill)', 'var(--achievement)', 'var(--ak-session-golfslag)', 'var(--error)', 'var(--text-muted)'];

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
      return { icon: Trophy, color: 'var(--medal-gold)', bg: 'var(--achievement-muted)', label: '1.' };
    } else if (position === 2) {
      return { icon: Medal, color: 'var(--medal-silver)', bg: 'rgba(192, 192, 192, 0.1)', label: '2.' };
    } else if (position === 3) {
      return { icon: Medal, color: 'var(--medal-bronze)', bg: 'rgba(205, 127, 50, 0.1)', label: '3.' };
    }
    return null;
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: 'var(--bg-secondary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            border: `4px solid ${'var(--border-default)'}`,
            borderTopColor: 'var(--accent)',
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
        backgroundColor: 'var(--bg-secondary)',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          backgroundColor: 'var(--bg-primary)',
          borderBottom: `1px solid ${'var(--border-default)'}`,
          padding: '20px 24px',
        }}
      >
        <PageHeader
          title="Turneringsresultater"
          subtitle="Resultater og statistikk for dine spillere"
          onBack={() => navigate('/coach/tournaments')}
          divider={false}
        />

        {/* Summary stats */}
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 14px',
              backgroundColor: 'rgba(var(--accent-rgb), 0.10)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <Trophy size={16} color={'var(--accent)'} />
            <span style={{ fontSize: '13px', color: 'var(--text-primary)' }}>
              <strong>{summary.totalTournaments}</strong> turneringer
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 14px',
              backgroundColor: 'rgba(var(--achievement-rgb), 0.15)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <Star size={16} color={'var(--achievement)'} />
            <span style={{ fontSize: '13px', color: 'var(--text-primary)' }}>
              <strong>{summary.totalWins}</strong> seiere
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 14px',
              backgroundColor: 'rgba(var(--success-rgb), 0.10)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <Medal size={16} color={'var(--success)'} />
            <span style={{ fontSize: '13px', color: 'var(--text-primary)' }}>
              <strong>{summary.totalTopThree}</strong> pallplasser
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 14px',
              backgroundColor: 'var(--bg-tertiary)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <Award size={16} color={'var(--text-secondary)'} />
            <span style={{ fontSize: '13px', color: 'var(--text-primary)' }}>
              Snitt: <strong>{summary.avgPosition}.</strong> plass
            </span>
          </div>
        </div>
      </div>

      {/* View toggle and filters */}
      <div
        style={{
          backgroundColor: 'var(--bg-primary)',
          padding: '16px 24px',
          borderBottom: `1px solid ${'var(--border-default)'}`,
          display: 'flex',
          gap: '12px',
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', gap: '4px', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', padding: '4px' }}>
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

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 12px',
            backgroundColor: 'var(--bg-tertiary)',
            borderRadius: 'var(--radius-md)',
            flex: 1,
            maxWidth: '250px',
          }}
        >
          <Search size={18} color={'var(--text-secondary)'} />
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
              color: 'var(--text-primary)',
              outline: 'none',
            }}
          />
        </div>

        <select
          value={playerFilter}
          onChange={(e) => setPlayerFilter(e.target.value)}
          style={{
            padding: '8px 12px',
            backgroundColor: 'var(--bg-primary)',
            border: `1px solid ${'var(--border-default)'}`,
            borderRadius: 'var(--radius-md)',
            fontSize: '13px',
            color: 'var(--text-primary)',
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
            backgroundColor: 'var(--bg-primary)',
            border: `1px solid ${'var(--border-default)'}`,
            borderRadius: 'var(--radius-md)',
            fontSize: '13px',
            color: 'var(--text-primary)',
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
                backgroundColor: 'var(--bg-primary)',
                borderRadius: 'var(--radius-lg)',
                padding: '48px',
                textAlign: 'center',
                boxShadow: 'var(--shadow-card)',
              }}
            >
              <Trophy size={48} color={'var(--text-secondary)'} style={{ marginBottom: '16px' }} />
              <SubSectionTitle style={{ margin: '0 0 8px' }}>
                Ingen resultater funnet
              </SubSectionTitle>
              <p style={{ fontSize: '13px', lineHeight: '18px', color: 'var(--text-secondary)', margin: 0 }}>
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
                      backgroundColor: 'var(--bg-primary)',
                      borderRadius: 'var(--radius-lg)',
                      boxShadow: 'var(--shadow-card)',
                      overflow: 'hidden',
                      border: positionBadge ? `2px solid ${positionBadge.color}` : `1px solid ${'var(--border-default)'}`,
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
                              borderRadius: 'var(--radius-md)',
                              backgroundColor: positionBadge ? positionBadge.bg : 'var(--bg-tertiary)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            {positionBadge ? (
                              <positionBadge.icon size={24} color={positionBadge.color} />
                            ) : (
                              <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
                                {result.position}
                              </span>
                            )}
                          </div>

                          <div>
                            <SubSectionTitle style={{ margin: 0 }}>
                              {result.tournamentName}
                            </SubSectionTitle>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                              <Calendar size={14} color={'var(--text-secondary)'} />
                              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                                {formatDate(result.date)}
                              </span>
                              <span style={{ color: 'var(--border-default)' }}>•</span>
                              <MapPin size={14} color={'var(--text-secondary)'} />
                              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                                {result.location}
                              </span>
                            </div>
                          </div>
                        </div>

                        {result.highlight && (
                          <div
                            style={{
                              padding: '6px 12px',
                              backgroundColor: 'rgba(var(--achievement-rgb), 0.15)',
                              color: 'var(--achievement)',
                              borderRadius: '50%',
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
                          backgroundColor: 'var(--bg-tertiary)',
                          borderRadius: 'var(--radius-md)',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: '50%',
                              backgroundColor: 'var(--accent)',
                              color: 'var(--bg-primary)',
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
                            <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)' }}>
                              {result.playerName}
                            </div>
                            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                              Kategori {result.playerCategory}
                            </div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                          <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Plassering</div>
                            <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
                              {result.position}/{result.totalParticipants}
                            </div>
                          </div>
                          <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Score</div>
                            <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
                              {result.score}
                            </div>
                          </div>
                          <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Til par</div>
                            <div
                              style={{
                                fontSize: '18px',
                                fontWeight: 700,
                                color:
                                  result.scoreToPar < 0
                                    ? 'var(--success)'
                                    : result.scoreToPar > 0
                                    ? 'var(--error)'
                                    : 'var(--text-primary)',
                              }}
                            >
                              {result.scoreToPar > 0 ? '+' : ''}
                              {result.scoreToPar}
                            </div>
                          </div>
                          {result.rounds.length > 1 && (
                            <div style={{ textAlign: 'center' }}>
                              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Runder</div>
                              <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)' }}>
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
                  backgroundColor: 'var(--bg-primary)',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--shadow-card)',
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
                        color: 'var(--bg-primary)',
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
                      <SubSectionTitle style={{ margin: 0 }}>
                        {player.name}
                      </SubSectionTitle>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                        <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
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
                                ? 'var(--success)'
                                : player.trend === 'down'
                                ? 'var(--error)'
                                : 'var(--text-secondary)',
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

                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => navigate(`/coach/athletes/${player.id}`)}
                  >
                    Se profil
                  </Button>
                </div>

                {/* Stats grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '12px' }}>
                  <div
                    style={{
                      padding: '12px',
                      backgroundColor: 'rgba(var(--achievement-rgb), 0.10)',
                      borderRadius: 'var(--radius-md)',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--achievement)' }}>
                      {player.wins}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Seiere</div>
                  </div>
                  <div
                    style={{
                      padding: '12px',
                      backgroundColor: 'rgba(var(--success-rgb), 0.10)',
                      borderRadius: 'var(--radius-md)',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--success)' }}>
                      {player.topThree}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Top 3</div>
                  </div>
                  <div
                    style={{
                      padding: '12px',
                      backgroundColor: 'rgba(var(--accent-rgb), 0.10)',
                      borderRadius: 'var(--radius-md)',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--accent)' }}>
                      {player.topTen}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Top 10</div>
                  </div>
                  <div
                    style={{
                      padding: '12px',
                      backgroundColor: 'var(--bg-tertiary)',
                      borderRadius: 'var(--radius-md)',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {player.averagePosition}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Snitt plass</div>
                  </div>
                  <div
                    style={{
                      padding: '12px',
                      backgroundColor: 'var(--bg-tertiary)',
                      borderRadius: 'var(--radius-md)',
                      textAlign: 'center',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '24px',
                        fontWeight: 700,
                        color:
                          player.averageScore < 0
                            ? 'var(--success)'
                            : player.averageScore > 0
                            ? 'var(--error)'
                            : 'var(--text-primary)',
                      }}
                    >
                      {player.averageScore > 0 ? '+' : ''}
                      {player.averageScore}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Snitt til par</div>
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
