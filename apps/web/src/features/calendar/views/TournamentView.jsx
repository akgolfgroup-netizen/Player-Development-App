/**
 * TournamentView Component
 * Design System v3.0 - Premium Light
 *
 * MIGRATED TO PAGE ARCHITECTURE - Minimal inline styles (dynamic colors)
 */

import React from 'react';
import { ChevronLeft, ChevronRight, Trophy, MapPin, Calendar, Users } from 'lucide-react';
import { SectionTitle, SubSectionTitle, CardTitle } from '../../../components/typography';

const TournamentView = ({
  currentYear,
  tournaments = [],
  onTournamentClick,
  onNavigate
}) => {
  const monthNames = ['Januar', 'Februar', 'Mars', 'April', 'Mai', 'Juni',
                      'Juli', 'August', 'September', 'Oktober', 'November', 'Desember'];

  const today = new Date();

  // Demo tournaments if none provided
  const demoTournaments = [
    {
      id: 1,
      name: 'Vår Cup',
      startDate: new Date(currentYear, 3, 15),
      endDate: new Date(currentYear, 3, 17),
      location: 'Oslo Golfklubb',
      status: 'upcoming',
      category: 'regional',
      participants: 48,
      registered: true
    },
    {
      id: 2,
      name: 'NGF Ranking',
      startDate: new Date(currentYear, 4, 20),
      endDate: new Date(currentYear, 4, 22),
      location: 'Bærum Golfklubb',
      status: 'upcoming',
      category: 'national',
      participants: 96,
      registered: false
    },
    {
      id: 3,
      name: 'Sommer Mesterskap',
      startDate: new Date(currentYear, 6, 5),
      endDate: new Date(currentYear, 6, 8),
      location: 'Miklagard Golf',
      status: 'upcoming',
      category: 'national',
      participants: 120,
      registered: true
    },
    {
      id: 4,
      name: 'Junior Tour Finale',
      startDate: new Date(currentYear, 7, 25),
      endDate: new Date(currentYear, 7, 27),
      location: 'Losby Golfklubb',
      status: 'upcoming',
      category: 'national',
      participants: 64,
      registered: true
    },
    {
      id: 5,
      name: 'Høst-Klassikeren',
      startDate: new Date(currentYear, 8, 10),
      endDate: new Date(currentYear, 8, 12),
      location: 'Bogstad Golfklubb',
      status: 'upcoming',
      category: 'regional',
      participants: 56,
      registered: false
    },
    {
      id: 6,
      name: 'Sesongavslutning',
      startDate: new Date(currentYear, 9, 5),
      endDate: new Date(currentYear, 9, 6),
      location: 'Haga Golfklubb',
      status: 'upcoming',
      category: 'club',
      participants: 32,
      registered: false
    }
  ];

  const displayTournaments = tournaments.length > 0 ? tournaments : demoTournaments;

  // Group tournaments by month
  const tournamentsByMonth = {};
  displayTournaments.forEach(t => {
    const month = t.startDate.getMonth();
    if (!tournamentsByMonth[month]) {
      tournamentsByMonth[month] = [];
    }
    tournamentsByMonth[month].push(t);
  });

  // Category configuration using semantic tokens
  const getCategoryConfig = (category) => {
    const configs = {
      club: { bg: 'var(--ak-text-tertiary)', label: 'Klubb' },
      regional: { bg: 'var(--ak-session-golfslag)', label: 'Regional' },
      national: { bg: 'var(--ak-session-teknikk)', label: 'Nasjonal' },
      international: { bg: 'var(--ak-status-warning)', label: 'Internasjonal' },
    };
    return configs[category] || configs.club;
  };

  // Status configuration using semantic tokens
  const getStatusConfig = (tournament) => {
    const now = today.getTime();
    const start = tournament.startDate.getTime();
    const end = tournament.endDate.getTime();

    if (now > end) {
      return { label: 'Fullført', color: 'var(--ak-text-secondary)' };
    } else if (now >= start && now <= end) {
      return { label: 'Pågår', color: 'var(--ak-status-success)' };
    } else {
      const daysUntil = Math.ceil((start - now) / (1000 * 60 * 60 * 24));
      if (daysUntil <= 7) {
        return { label: `Om ${daysUntil} dager`, color: 'var(--ak-status-warning)' };
      }
      return { label: 'Kommende', color: 'var(--ak-brand-primary)' };
    }
  };

  const formatDateRange = (start, end) => {
    if (start.getMonth() === end.getMonth()) {
      return `${start.getDate()}.–${end.getDate()}. ${monthNames[start.getMonth()]}`;
    }
    return `${start.getDate()}. ${monthNames[start.getMonth()].slice(0, 3)} – ${end.getDate()}. ${monthNames[end.getMonth()].slice(0, 3)}`;
  };

  // Calculate stats
  const totalTournaments = displayTournaments.length;
  const registeredCount = displayTournaments.filter(t => t.registered).length;
  const upcomingCount = displayTournaments.filter(t => t.startDate > today).length;

  return (
    <div className="bg-ak-surface-card rounded-xl border border-ak-border-subtle overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-ak-border-subtle bg-gradient-to-r from-ak-brand-primary to-ak-brand-primary/80 text-white">
        <button
          onClick={() => onNavigate?.(-1)}
          className="p-2 hover:bg-white/20 rounded-lg transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="text-center">
          <div className="flex items-center justify-center gap-2">
            <Trophy size={24} />
            <SectionTitle className="text-xl font-bold">Turneringer {currentYear}</SectionTitle>
          </div>
        </div>
        <button
          onClick={() => onNavigate?.(1)}
          className="p-2 hover:bg-white/20 rounded-lg transition-colors"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Category Legend */}
      <div className="flex items-center gap-4 px-4 py-2 border-b border-ak-border-subtle bg-ak-surface-subtle/50">
        <span className="text-xs text-ak-text-secondary">Nivå:</span>
        {[
          { type: 'club', label: 'Klubb' },
          { type: 'regional', label: 'Regional' },
          { type: 'national', label: 'Nasjonal' },
          { type: 'international', label: 'Internasjonal' },
        ].map(p => (
          <div key={p.type} className="flex items-center gap-1">
            <div
              className="w-3 h-3 rounded"
              style={{ backgroundColor: getCategoryConfig(p.type).bg }}
            />
            <span className="text-xs text-ak-text-primary">{p.label}</span>
          </div>
        ))}
      </div>

      {/* Tournament List by Month */}
      <div className="p-4 space-y-6 max-h-[600px] overflow-y-auto">
        {Object.entries(tournamentsByMonth)
          .sort(([a], [b]) => parseInt(a) - parseInt(b))
          .map(([monthIndex, monthTournaments]) => (
            <div key={monthIndex}>
              {/* Month Header */}
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-6 rounded-full bg-ak-status-warning" />
                <SubSectionTitle className="text-base font-semibold text-ak-text-primary">
                  {monthNames[parseInt(monthIndex)]}
                </SubSectionTitle>
                <span className="text-xs text-ak-text-secondary bg-ak-surface-subtle px-2 py-0.5 rounded-full">
                  {monthTournaments.length} {monthTournaments.length === 1 ? 'turnering' : 'turneringer'}
                </span>
              </div>

              {/* Tournament Cards */}
              <div className="grid gap-3 sm:grid-cols-2">
                {monthTournaments
                  .sort((a, b) => a.startDate - b.startDate)
                  .map(tournament => {
                    const categoryConfig = getCategoryConfig(tournament.category);
                    const statusConfig = getStatusConfig(tournament);
                    const isPast = tournament.endDate < today;

                    return (
                      <div
                        key={tournament.id}
                        className={`p-4 rounded-xl border cursor-pointer transition-all hover:shadow-md ${
                          isPast ? 'opacity-60 border-ak-border-subtle' : 'border-ak-border-subtle hover:border-ak-brand-primary/30'
                        } ${tournament.registered ? 'bg-ak-brand-primary/5' : 'bg-ak-surface-card'}`}
                        style={{
                          borderLeft: `4px solid ${categoryConfig.bg}`
                        }}
                        onClick={() => onTournamentClick?.(tournament)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span
                                className="px-2 py-0.5 rounded text-[10px] font-medium text-white"
                                style={{ backgroundColor: categoryConfig.bg }}
                              >
                                {categoryConfig.label}
                              </span>
                              {tournament.registered && (
                                <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-ak-status-success text-white">
                                  Påmeldt
                                </span>
                              )}
                            </div>
                            <CardTitle className="font-semibold text-ak-text-primary">{tournament.name}</CardTitle>
                          </div>
                          <Trophy
                            size={20}
                            style={{ color: categoryConfig.bg }}
                          />
                        </div>

                        <div className="space-y-1.5 text-xs text-ak-text-secondary">
                          <div className="flex items-center gap-2">
                            <Calendar size={12} />
                            <span>{formatDateRange(tournament.startDate, tournament.endDate)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin size={12} />
                            <span>{tournament.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users size={12} />
                            <span>{tournament.participants} deltakere</span>
                          </div>
                        </div>

                        <div className="mt-3 pt-2 border-t border-ak-border-subtle flex items-center justify-between">
                          <span
                            className="text-xs font-medium"
                            style={{ color: statusConfig.color }}
                          >
                            {statusConfig.label}
                          </span>
                          {!tournament.registered && !isPast && (
                            <button
                              className="text-xs px-3 py-1 bg-ak-brand-primary text-white rounded-lg hover:bg-ak-brand-primary/90 transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                // Handle registration
                              }}
                            >
                              Meld på
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          ))}

        {Object.keys(tournamentsByMonth).length === 0 && (
          <div className="text-center py-12">
            <Trophy size={48} className="mx-auto mb-4 text-ak-text-tertiary" />
            <p className="text-ak-text-secondary">Ingen turneringer funnet for {currentYear}</p>
          </div>
        )}
      </div>

      {/* Stats Footer */}
      <div className="border-t border-ak-border-subtle p-4 bg-ak-surface-subtle/30">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-ak-brand-primary">{totalTournaments}</div>
            <div className="text-xs text-ak-text-secondary">Totalt</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-ak-status-success">{registeredCount}</div>
            <div className="text-xs text-ak-text-secondary">Påmeldt</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-ak-status-warning">{upcomingCount}</div>
            <div className="text-xs text-ak-text-secondary">Kommende</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TournamentView;
