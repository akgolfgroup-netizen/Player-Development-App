/**
 * AK Golf Academy - Coach Stats Overview
 * Design System v3.0 - Blue Palette 01
 *
 * Hovedoversikt over spillerstatistikk for trenere.
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  Search,
  Minus,
} from 'lucide-react';
import Card from '../../ui/primitives/Card';
import Button from '../../ui/primitives/Button';
import PageHeader from '../../ui/raw-blocks/PageHeader.raw';

interface PlayerStat {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
  category: string;
  handicap: number;
  handicapChange: number;
  sessionsThisMonth: number;
  avgSessionsPerWeek: number;
  tournamentScore: number;
  trend: 'up' | 'down' | 'stable';
  lastActive: string;
  highlights: string[];
}

interface CategorySummary {
  category: string;
  playerCount: number;
  avgHandicap: number;
  avgSessions: number;
  improving: number;
  declining: number;
}

export default function CoachStatsOverview() {
  const navigate = useNavigate();
  const [players, setPlayers] = useState<PlayerStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'handicap' | 'trend' | 'sessions'>('trend');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/v1/coach/stats/overview');
        if (response.ok) {
          const data = await response.json();
          setPlayers(data.players || []);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
        setPlayers(generateMockPlayers());
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const generateMockPlayers = (): PlayerStat[] => {
    return [
      {
        id: 'p1',
        name: 'Anders Hansen',
        initials: 'AH',
        avatarColor: 'var(--ak-session-spill)',
        category: 'A',
        handicap: 2.4,
        handicapChange: -0.8,
        sessionsThisMonth: 18,
        avgSessionsPerWeek: 4.5,
        tournamentScore: 72.3,
        trend: 'up',
        lastActive: '2025-12-20',
        highlights: ['Ny PB på driving', 'Redusert handicap'],
      },
      {
        id: 'p2',
        name: 'Sofie Andersen',
        initials: 'SA',
        avatarColor: 'var(--ak-achievement-gold)',
        category: 'B',
        handicap: 8.2,
        handicapChange: -1.2,
        sessionsThisMonth: 14,
        avgSessionsPerWeek: 3.5,
        tournamentScore: 78.5,
        trend: 'up',
        lastActive: '2025-12-19',
        highlights: ['Forbedret putting'],
      },
      {
        id: 'p3',
        name: 'Erik Johansen',
        initials: 'EJ',
        avatarColor: 'var(--ak-session-golfslag)',
        category: 'A',
        handicap: 3.1,
        handicapChange: 0.3,
        sessionsThisMonth: 12,
        avgSessionsPerWeek: 3.0,
        tournamentScore: 73.8,
        trend: 'down',
        lastActive: '2025-12-18',
        highlights: [],
      },
      {
        id: 'p4',
        name: 'Maria Berg',
        initials: 'MB',
        avatarColor: 'var(--ak-status-error)',
        category: 'C',
        handicap: 15.4,
        handicapChange: -2.1,
        sessionsThisMonth: 10,
        avgSessionsPerWeek: 2.5,
        tournamentScore: 85.2,
        trend: 'up',
        lastActive: '2025-12-21',
        highlights: ['Stor fremgang', 'Mest forbedret'],
      },
      {
        id: 'p5',
        name: 'Lars Olsen',
        initials: 'LO',
        avatarColor: 'var(--ak-text-muted)',
        category: 'B',
        handicap: 9.8,
        handicapChange: 0.0,
        sessionsThisMonth: 8,
        avgSessionsPerWeek: 2.0,
        tournamentScore: 80.1,
        trend: 'stable',
        lastActive: '2025-12-17',
        highlights: [],
      },
      {
        id: 'p6',
        name: 'Emma Nilsen',
        initials: 'EN',
        avatarColor: 'var(--ak-session-spill)',
        category: 'A',
        handicap: 1.8,
        handicapChange: -0.4,
        sessionsThisMonth: 20,
        avgSessionsPerWeek: 5.0,
        tournamentScore: 71.2,
        trend: 'up',
        lastActive: '2025-12-21',
        highlights: ['Elite-nivå', 'Turneringsvinner'],
      },
    ];
  };

  // Category summary
  const categorySummary = useMemo((): CategorySummary[] => {
    const categories = ['A', 'B', 'C'];
    return categories.map((cat) => {
      const catPlayers = players.filter((p) => p.category === cat);
      return {
        category: cat,
        playerCount: catPlayers.length,
        avgHandicap: catPlayers.length > 0
          ? Math.round((catPlayers.reduce((sum, p) => sum + p.handicap, 0) / catPlayers.length) * 10) / 10
          : 0,
        avgSessions: catPlayers.length > 0
          ? Math.round((catPlayers.reduce((sum, p) => sum + p.avgSessionsPerWeek, 0) / catPlayers.length) * 10) / 10
          : 0,
        improving: catPlayers.filter((p) => p.trend === 'up').length,
        declining: catPlayers.filter((p) => p.trend === 'down').length,
      };
    });
  }, [players]);

  // Overall stats
  const overallStats = useMemo(() => {
    const improving = players.filter((p) => p.trend === 'up').length;
    const declining = players.filter((p) => p.trend === 'down').length;
    const avgHandicapChange = players.length > 0
      ? Math.round((players.reduce((sum, p) => sum + p.handicapChange, 0) / players.length) * 10) / 10
      : 0;
    const totalSessions = players.reduce((sum, p) => sum + p.sessionsThisMonth, 0);

    return { improving, declining, avgHandicapChange, totalSessions };
  }, [players]);

  // Filter and sort players
  const filteredPlayers = useMemo(() => {
    let result = players;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(query));
    }

    if (categoryFilter !== 'all') {
      result = result.filter((p) => p.category === categoryFilter);
    }

    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'handicap':
          return a.handicap - b.handicap;
        case 'trend':
          const trendOrder = { up: 0, stable: 1, down: 2 };
          return trendOrder[a.trend] - trendOrder[b.trend];
        case 'sessions':
          return b.sessionsThisMonth - a.sessionsThisMonth;
        default:
          return 0;
      }
    });

    return result;
  }, [players, searchQuery, categoryFilter, sortBy]);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return { icon: TrendingUp, color: 'var(--success)' };
      case 'down':
        return { icon: TrendingDown, color: 'var(--error)' };
      default:
        return { icon: Minus, color: 'var(--text-secondary)' };
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 48, height: 48, border: `4px solid ${'var(--border-default)'}`, borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-secondary)', fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif" }}>
      {/* Header - using PageHeader from design system */}
      <PageHeader
        title="Spillerstatistikk"
        subtitle="Oversikt over fremgang og utvikling"
        actions={
          <div style={{ display: 'flex', gap: '10px' }}>
            <Button variant="ghost" size="sm" onClick={() => navigate('/coach/stats/progress')} leftIcon={<TrendingUp size={18} />}>
              Fremgang
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate('/coach/stats/regression')} leftIcon={<TrendingDown size={18} />}>
              Tilbakegang
            </Button>
            <Button variant="primary" size="sm" onClick={() => navigate('/coach/stats/datagolf')} leftIcon={<BarChart3 size={18} />}>
              Data Golf
            </Button>
          </div>
        }
        divider={false}
      />
      <div style={{ backgroundColor: 'var(--bg-primary)', borderBottom: `1px solid ${'var(--border-default)'}`, padding: '0 24px 20px' }}>

        {/* Quick stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
          <div style={{ padding: '16px', backgroundColor: 'rgba(var(--success-rgb), 0.10)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--success)' }}>{overallStats.improving}</div>
            <div style={{ fontSize: '13px', color: 'var(--text-primary)' }}>Spillere i fremgang</div>
          </div>
          <div style={{ padding: '16px', backgroundColor: 'rgba(var(--error-rgb), 0.10)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--error)' }}>{overallStats.declining}</div>
            <div style={{ fontSize: '13px', color: 'var(--text-primary)' }}>Trenger oppfølging</div>
          </div>
          <div style={{ padding: '16px', backgroundColor: 'rgba(var(--accent-rgb), 0.10)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--accent)' }}>
              {overallStats.avgHandicapChange > 0 ? '+' : ''}{overallStats.avgHandicapChange}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-primary)' }}>Snitt HCP-endring</div>
          </div>
          <div style={{ padding: '16px', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)' }}>{overallStats.totalSessions}</div>
            <div style={{ fontSize: '13px', color: 'var(--text-primary)' }}>Økter denne mnd</div>
          </div>
        </div>
      </div>

      {/* Category summary */}
      <div style={{ padding: '24px', borderBottom: `1px solid ${'var(--border-default)'}`, backgroundColor: 'var(--bg-primary)' }}>
        <h2 style={{ fontSize: '17px', lineHeight: '22px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 16px' }}>Kategori-oversikt</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          {categorySummary.map((cat) => (
            <div
              key={cat.category}
              onClick={() => setCategoryFilter(cat.category)}
              style={{
                padding: '16px', backgroundColor: categoryFilter === cat.category ? `${'var(--accent)'}08` : 'var(--bg-tertiary)',
                borderRadius: 'var(--radius-md)', cursor: 'pointer',
                border: categoryFilter === cat.category ? `2px solid ${'var(--accent)'}` : '2px solid transparent',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--accent)' }}>Kategori {cat.category}</span>
                <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{cat.playerCount} spillere</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Snitt HCP</div>
                  <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>{cat.avgHandicap}</div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Økter/uke</div>
                  <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>{cat.avgSessions}</div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>I fremgang</div>
                  <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--success)' }}>{cat.improving}</div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Tilbakegang</div>
                  <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--error)' }}>{cat.declining}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div style={{ padding: '16px 24px', backgroundColor: 'var(--bg-primary)', borderBottom: `1px solid ${'var(--border-default)'}`, display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', flex: 1, maxWidth: '250px' }}>
          <Search size={18} color={'var(--text-secondary)'} />
          <input
            type="text"
            placeholder="Søk spiller..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ flex: 1, border: 'none', backgroundColor: 'transparent', fontSize: '14px', color: 'var(--text-primary)', outline: 'none' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          {['all', 'A', 'B', 'C'].map((cat) => (
            <Button
              key={cat}
              variant={categoryFilter === cat ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setCategoryFilter(cat)}
            >
              {cat === 'all' ? 'Alle' : `Kat. ${cat}`}
            </Button>
          ))}
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          style={{ padding: '8px 12px', backgroundColor: 'var(--bg-primary)', border: `1px solid ${'var(--border-default)'}`, borderRadius: 'var(--radius-md)', fontSize: '13px', color: 'var(--text-primary)' }}
        >
          <option value="trend">Sorter: Trend</option>
          <option value="name">Sorter: Navn</option>
          <option value="handicap">Sorter: Handicap</option>
          <option value="sessions">Sorter: Aktivitet</option>
        </select>
      </div>

      {/* Player list */}
      <div style={{ padding: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredPlayers.map((player) => {
            const trendConfig = getTrendIcon(player.trend);
            const TrendIcon = trendConfig.icon;

            return (
              <div
                key={player.id}
                onClick={() => navigate(`/coach/athletes/${player.id}`)}
                style={{
                  backgroundColor: 'var(--bg-primary)', borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--shadow-card)', padding: '16px 20px', cursor: 'pointer',
                  border: player.trend === 'down' ? `2px solid ${'var(--error)'}` : `1px solid ${'var(--border-default)'}`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ position: 'relative' }}>
                      <div style={{
                        width: 48, height: 48, borderRadius: '50%', backgroundColor: player.avatarColor,
                        color: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '16px', fontWeight: 600,
                      }}>
                        {player.initials}
                      </div>
                      <div style={{
                        position: 'absolute', bottom: -2, right: -2, width: 20, height: 20,
                        borderRadius: '50%', backgroundColor: trendConfig.color, display: 'flex',
                        alignItems: 'center', justifyContent: 'center', border: '2px solid white',
                      }}>
                        <TrendIcon size={12} color="white" />
                      </div>
                    </div>
                    <div>
                      <h3 style={{ fontSize: '17px', lineHeight: '22px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>{player.name}</h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--accent)', backgroundColor: 'rgba(var(--accent-rgb), 0.15)', padding: '2px 8px', borderRadius: '4px' }}>
                          Kategori {player.category}
                        </span>
                        {player.highlights.map((h, i) => (
                          <span key={i} style={{ fontSize: '11px', color: 'var(--achievement)', backgroundColor: 'rgba(var(--achievement-rgb), 0.15)', padding: '2px 6px', borderRadius: '4px' }}>
                            {h}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Handicap</div>
                      <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>{player.handicap}</div>
                      <div style={{ fontSize: '12px', fontWeight: 500, color: player.handicapChange < 0 ? 'var(--success)' : player.handicapChange > 0 ? 'var(--error)' : 'var(--text-secondary)' }}>
                        {player.handicapChange > 0 ? '+' : ''}{player.handicapChange}
                      </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Økter/mnd</div>
                      <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>{player.sessionsThisMonth}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{player.avgSessionsPerWeek}/uke</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Snitt score</div>
                      <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>{player.tournamentScore}</div>
                    </div>
                    <ChevronRight size={20} color={'var(--text-secondary)'} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
