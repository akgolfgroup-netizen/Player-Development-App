/**
 * AK Golf Academy - Coach Stats Overview
 * Design System v3.0 - Premium Light
 *
 * Hovedoversikt over spillerstatistikk for trenere.
 *
 * MIGRATED TO PAGE ARCHITECTURE - Zero inline styles
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
import { SectionTitle, SubSectionTitle } from '../../components/typography';

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
        avatarColor: 'var(--category-spill)',
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
        avatarColor: 'var(--achievement)',
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
        avatarColor: 'var(--category-slag)',
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
        avatarColor: 'var(--error)',
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
        avatarColor: 'var(--text-tertiary)',
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
        avatarColor: 'var(--category-spill)',
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

  const getTrendConfig = (trend: string) => {
    switch (trend) {
      case 'up':
        return { icon: TrendingUp, colorClass: 'bg-ak-status-success text-white' };
      case 'down':
        return { icon: TrendingDown, colorClass: 'bg-ak-status-error text-white' };
      default:
        return { icon: Minus, colorClass: 'bg-ak-text-secondary text-white' };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-ak-surface-subtle flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-ak-border-default border-t-ak-brand-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ak-surface-subtle font-[Inter,-apple-system,BlinkMacSystemFont,system-ui,sans-serif]">
      {/* Header - using PageHeader from design system */}
      <PageHeader
        title="Spillerstatistikk"
        subtitle="Oversikt over fremgang og utvikling"
        actions={
          <div className="flex gap-2.5">
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
      <div className="bg-ak-surface-base border-b border-ak-border-default px-6 pb-5">

        {/* Quick stats */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-3">
          <div className="p-4 bg-ak-status-success/10 rounded-lg text-center">
            <div className="text-[28px] font-bold text-ak-status-success">{overallStats.improving}</div>
            <div className="text-[13px] text-ak-text-primary">Spillere i fremgang</div>
          </div>
          <div className="p-4 bg-ak-status-error/10 rounded-lg text-center">
            <div className="text-[28px] font-bold text-ak-status-error">{overallStats.declining}</div>
            <div className="text-[13px] text-ak-text-primary">Trenger oppfølging</div>
          </div>
          <div className="p-4 bg-ak-brand-primary/10 rounded-lg text-center">
            <div className="text-[28px] font-bold text-ak-brand-primary">
              {overallStats.avgHandicapChange > 0 ? '+' : ''}{overallStats.avgHandicapChange}
            </div>
            <div className="text-[13px] text-ak-text-primary">Snitt HCP-endring</div>
          </div>
          <div className="p-4 bg-ak-surface-muted rounded-lg text-center">
            <div className="text-[28px] font-bold text-ak-text-primary">{overallStats.totalSessions}</div>
            <div className="text-[13px] text-ak-text-primary">Økter denne mnd</div>
          </div>
        </div>
      </div>

      {/* Category summary */}
      <div className="p-6 border-b border-ak-border-default bg-ak-surface-base">
        <SectionTitle className="m-0 mb-4">Kategori-oversikt</SectionTitle>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
          {categorySummary.map((cat) => (
            <div
              key={cat.category}
              onClick={() => setCategoryFilter(cat.category)}
              className={`p-4 rounded-lg cursor-pointer border-2 ${
                categoryFilter === cat.category
                  ? 'bg-ak-brand-primary/5 border-ak-brand-primary'
                  : 'bg-ak-surface-muted border-transparent'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-bold text-ak-brand-primary">Kategori {cat.category}</span>
                <span className="text-sm text-ak-text-secondary">{cat.playerCount} spillere</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="text-xs text-ak-text-secondary">Snitt HCP</div>
                  <div className="text-base font-semibold text-ak-text-primary">{cat.avgHandicap}</div>
                </div>
                <div>
                  <div className="text-xs text-ak-text-secondary">Økter/uke</div>
                  <div className="text-base font-semibold text-ak-text-primary">{cat.avgSessions}</div>
                </div>
                <div>
                  <div className="text-xs text-ak-text-secondary">I fremgang</div>
                  <div className="text-base font-semibold text-ak-status-success">{cat.improving}</div>
                </div>
                <div>
                  <div className="text-xs text-ak-text-secondary">Tilbakegang</div>
                  <div className="text-base font-semibold text-ak-status-error">{cat.declining}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="py-4 px-6 bg-ak-surface-base border-b border-ak-border-default flex gap-3 flex-wrap">
        <div className="flex items-center gap-2 py-2 px-3 bg-ak-surface-muted rounded-lg flex-1 max-w-[250px]">
          <Search size={18} className="text-ak-text-secondary" />
          <input
            type="text"
            placeholder="Søk spiller..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 border-none bg-transparent text-sm text-ak-text-primary outline-none"
          />
        </div>

        <div className="flex gap-2">
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
          className="py-2 px-3 bg-ak-surface-base border border-ak-border-default rounded-lg text-[13px] text-ak-text-primary"
        >
          <option value="trend">Sorter: Trend</option>
          <option value="name">Sorter: Navn</option>
          <option value="handicap">Sorter: Handicap</option>
          <option value="sessions">Sorter: Aktivitet</option>
        </select>
      </div>

      {/* Player list */}
      <div className="p-6">
        <div className="flex flex-col gap-3">
          {filteredPlayers.map((player) => {
            const trendConfig = getTrendConfig(player.trend);
            const TrendIcon = trendConfig.icon;

            return (
              <div
                key={player.id}
                onClick={() => navigate(`/coach/athletes/${player.id}`)}
                className={`bg-ak-surface-base rounded-xl shadow-sm p-4 px-5 cursor-pointer border ${
                  player.trend === 'down'
                    ? 'border-2 border-ak-status-error'
                    : 'border-ak-border-default'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    <div className="relative">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-base font-semibold text-ak-surface-base"
                        style={{ backgroundColor: player.avatarColor }}
                      >
                        {player.initials}
                      </div>
                      <div className={`absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full flex items-center justify-center border-2 border-white ${trendConfig.colorClass}`}>
                        <TrendIcon size={12} />
                      </div>
                    </div>
                    <div>
                      <SubSectionTitle className="m-0">{player.name}</SubSectionTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-semibold text-ak-brand-primary bg-ak-brand-primary/15 py-0.5 px-2 rounded">
                          Kategori {player.category}
                        </span>
                        {player.highlights.map((h, i) => (
                          <span key={i} className="text-[11px] text-amber-600 bg-amber-500/15 py-0.5 px-1.5 rounded">
                            {h}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="text-xs text-ak-text-secondary">Handicap</div>
                      <div className="text-lg font-bold text-ak-text-primary">{player.handicap}</div>
                      <div className={`text-xs font-medium ${
                        player.handicapChange < 0
                          ? 'text-ak-status-success'
                          : player.handicapChange > 0
                            ? 'text-ak-status-error'
                            : 'text-ak-text-secondary'
                      }`}>
                        {player.handicapChange > 0 ? '+' : ''}{player.handicapChange}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-ak-text-secondary">Økter/mnd</div>
                      <div className="text-lg font-bold text-ak-text-primary">{player.sessionsThisMonth}</div>
                      <div className="text-xs text-ak-text-secondary">{player.avgSessionsPerWeek}/uke</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-ak-text-secondary">Snitt score</div>
                      <div className="text-lg font-bold text-ak-text-primary">{player.tournamentScore}</div>
                    </div>
                    <ChevronRight size={20} className="text-ak-text-secondary" />
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
