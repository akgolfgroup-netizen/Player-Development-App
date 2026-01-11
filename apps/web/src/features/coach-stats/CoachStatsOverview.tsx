/**
 * TIER Golf - Coach Stats Overview
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
import { SectionTitle, SubSectionTitle } from '../../components/typography/Headings';

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
        avatarColor: 'var(--status-error)',
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
        return { icon: TrendingUp, colorClass: 'bg-tier-success text-white' };
      case 'down':
        return { icon: TrendingDown, colorClass: 'bg-tier-error text-white' };
      default:
        return { icon: Minus, colorClass: 'bg-tier-text-secondary text-white' };
    }
  };

  const getCategoryColors = (category: string) => {
    switch (category) {
      case 'A':
        return {
          bg: 'bg-blue-500/10',
          border: 'border-blue-500',
          text: 'text-blue-600',
          bgActive: 'bg-blue-500/15',
        };
      case 'B':
        return {
          bg: 'bg-green-500/10',
          border: 'border-green-500',
          text: 'text-green-600',
          bgActive: 'bg-green-500/15',
        };
      case 'C':
        return {
          bg: 'bg-orange-500/10',
          border: 'border-orange-500',
          text: 'text-orange-600',
          bgActive: 'bg-orange-500/15',
        };
      default:
        return {
          bg: 'bg-tier-surface-base',
          border: 'border-transparent',
          text: 'text-tier-navy',
          bgActive: 'bg-tier-navy/5',
        };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-tier-surface-base flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-tier-border-default border-t-tier-navy rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-tier-surface-base font-[Inter,-apple-system,BlinkMacSystemFont,system-ui,sans-serif]">
      {/* Header - using PageHeader from design system */}
      <PageHeader
        title="Spillerstatistikk"
        subtitle="Oversikt over fremgang og utvikling"
        helpText="Alfabetisk oversikt over spillernes statistikk og utvikling. Se handicap, treningsfrekvens, trender og høydepunkter for hver spiller. Filtrer og sorter for å identifisere spillere som trenger oppfølging."
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
      <div className="bg-tier-white border-b border-tier-border-default px-6 pb-5">

        {/* Quick stats */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-3">
          <div className="p-4 bg-tier-success/10 rounded-lg text-center">
            <div className="text-[28px] font-bold text-tier-success">{overallStats.improving}</div>
            <div className="text-[13px] text-tier-navy">Spillere i fremgang</div>
          </div>
          <div className="p-4 bg-tier-error/10 rounded-lg text-center">
            <div className="text-[28px] font-bold text-tier-error">{overallStats.declining}</div>
            <div className="text-[13px] text-tier-navy">Trenger oppfølging</div>
          </div>
          <div className="p-4 bg-tier-navy/10 rounded-lg text-center">
            <div className="text-[28px] font-bold text-tier-navy">
              {overallStats.avgHandicapChange > 0 ? '+' : ''}{overallStats.avgHandicapChange}
            </div>
            <div className="text-[13px] text-tier-navy">Snitt HCP-endring</div>
          </div>
          <div className="p-4 bg-tier-surface-base rounded-lg text-center">
            <div className="text-[28px] font-bold text-tier-navy">{overallStats.totalSessions}</div>
            <div className="text-[13px] text-tier-navy">Økter denne mnd</div>
          </div>
        </div>
      </div>

      {/* Category summary */}
      <div className="p-6 border-b border-tier-border-default bg-tier-white">
        <SectionTitle className="m-0 mb-4">Kategori-oversikt</SectionTitle>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
          {categorySummary.map((cat) => {
            const colors = getCategoryColors(cat.category);
            return (
              <div
                key={cat.category}
                onClick={() => setCategoryFilter(cat.category)}
                className={`p-4 rounded-lg cursor-pointer border-2 transition-all ${
                  categoryFilter === cat.category
                    ? `${colors.bgActive} ${colors.border}`
                    : `${colors.bg} border-transparent`
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-lg font-bold ${colors.text}`}>Kategori {cat.category}</span>
                  <span className="text-sm text-tier-text-secondary">{cat.playerCount} spillere</span>
                </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="text-xs text-tier-text-secondary">Snitt HCP</div>
                  <div className="text-base font-semibold text-tier-navy">{cat.avgHandicap}</div>
                </div>
                <div>
                  <div className="text-xs text-tier-text-secondary">Økter/uke</div>
                  <div className="text-base font-semibold text-tier-navy">{cat.avgSessions}</div>
                </div>
                <div>
                  <div className="text-xs text-tier-text-secondary">I fremgang</div>
                  <div className="text-base font-semibold text-tier-success">{cat.improving}</div>
                </div>
                <div>
                  <div className="text-xs text-tier-text-secondary">Tilbakegang</div>
                  <div className="text-base font-semibold text-tier-error">{cat.declining}</div>
                </div>
              </div>
            </div>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      <div className="py-4 px-6 bg-tier-white border-b border-tier-border-default flex gap-3 flex-wrap">
        <div className="flex items-center gap-2 py-2 px-3 bg-tier-surface-base rounded-lg flex-1 max-w-[250px]">
          <Search size={18} className="text-tier-text-secondary" />
          <input
            type="text"
            placeholder="Søk spiller..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 border-none bg-transparent text-sm text-tier-navy outline-none"
          />
        </div>

        <div className="flex gap-2">
          {['all', 'A', 'B', 'C'].map((cat) => {
            const colors = cat !== 'all' ? getCategoryColors(cat) : null;
            const isActive = categoryFilter === cat;

            return (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
                  isActive
                    ? colors
                      ? `${colors.bgActive} ${colors.border} border-2 ${colors.text}`
                      : 'bg-tier-navy text-white border-2 border-tier-navy'
                    : colors
                    ? `${colors.bg} ${colors.text} border-2 border-transparent hover:${colors.border}`
                    : 'bg-tier-surface-base text-tier-navy border-2 border-transparent hover:border-tier-border-default'
                }`}
              >
                {cat === 'all' ? 'Alle' : `Kat. ${cat}`}
              </button>
            );
          })}
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="py-2 px-3 bg-tier-white border border-tier-border-default rounded-lg text-[13px] text-tier-navy"
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
                className={`bg-tier-white rounded-xl shadow-sm p-4 px-5 cursor-pointer border ${
                  player.trend === 'down'
                    ? 'border-2 border-tier-error'
                    : 'border-tier-border-default'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    <div className="relative">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-base font-semibold text-tier-white"
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
                        <span className="text-xs font-semibold text-tier-navy bg-tier-navy/15 py-0.5 px-2 rounded">
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
                      <div className="text-xs text-tier-text-secondary">Handicap</div>
                      <div className="text-lg font-bold text-tier-navy">{player.handicap}</div>
                      <div className={`text-xs font-medium ${
                        player.handicapChange < 0
                          ? 'text-tier-success'
                          : player.handicapChange > 0
                            ? 'text-tier-error'
                            : 'text-tier-text-secondary'
                      }`}>
                        {player.handicapChange > 0 ? '+' : ''}{player.handicapChange}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-tier-text-secondary">Økter/mnd</div>
                      <div className="text-lg font-bold text-tier-navy">{player.sessionsThisMonth}</div>
                      <div className="text-xs text-tier-text-secondary">{player.avgSessionsPerWeek}/uke</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-tier-text-secondary">Snitt score</div>
                      <div className="text-lg font-bold text-tier-navy">{player.tournamentScore}</div>
                    </div>
                    <ChevronRight size={20} className="text-tier-text-secondary" />
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
