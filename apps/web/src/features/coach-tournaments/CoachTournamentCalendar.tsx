/**
 * AK Golf Academy - Coach Tournament Calendar
 * Design System v3.0 - Premium Light
 *
 * MIGRATED TO PAGE ARCHITECTURE - Zero inline styles
 * Turneringskalender for trenere med oversikt over spillerdeltakelse.
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Trophy,
  Calendar,
  MapPin,
  Users,
  Clock,
  Search,
  Star,
  Medal,
  Flag,
  CheckCircle,
  ExternalLink,
  Eye,
  UserPlus,
} from 'lucide-react';
import Button from '../../ui/primitives/Button';
import Card from '../../ui/primitives/Card';
import Badge from '../../ui/primitives/Badge.primitive';
import StateCard from '../../ui/composites/StateCard';
import { PageTitle, SectionTitle, SubSectionTitle, CardTitle } from '../../components/typography';

interface PlayerParticipant {
  id: string;
  name: string;
  initials: string;
  category: string;
  status: 'registered' | 'pending' | 'interested';
}

interface Tournament {
  id: string;
  name: string;
  type: 'championship' | 'tour' | 'club' | 'international';
  category: 'junior' | 'elite' | 'open' | 'senior';
  startDate: string;
  endDate: string;
  location: string;
  city: string;
  registrationDeadline: string;
  maxParticipants: number;
  currentParticipants: number;
  status: 'registration_open' | 'registration_closed' | 'upcoming' | 'in_progress' | 'completed';
  description?: string;
  format: string;
  fee: number;
  myPlayers: PlayerParticipant[];
}

export default function CoachTournamentCalendar() {
  const navigate = useNavigate();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'my_players' | 'upcoming'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);

  // Fetch tournaments
  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const response = await fetch('/api/v1/coach/tournaments');
        if (response.ok) {
          const data = await response.json();
          setTournaments(data.tournaments || []);
        }
      } catch (error) {
        console.error('Failed to fetch tournaments:', error);
        setTournaments(generateMockTournaments());
      } finally {
        setLoading(false);
      }
    };

    fetchTournaments();
  }, []);

  // Generate mock tournaments
  const generateMockTournaments = (): Tournament[] => {
    const players = [
      { id: 'p1', name: 'Anders Hansen', initials: 'AH', category: 'A' },
      { id: 'p2', name: 'Sofie Andersen', initials: 'SA', category: 'B' },
      { id: 'p3', name: 'Erik Johansen', initials: 'EJ', category: 'A' },
      { id: 'p4', name: 'Maria Berg', initials: 'MB', category: 'C' },
      { id: 'p5', name: 'Lars Olsen', initials: 'LO', category: 'B' },
    ];

    return [
      {
        id: 't1',
        name: 'NM Junior 2025',
        type: 'championship',
        category: 'junior',
        startDate: '2025-06-15',
        endDate: '2025-06-17',
        location: 'Oslo Golfklubb',
        city: 'Oslo',
        registrationDeadline: '2025-05-30',
        maxParticipants: 120,
        currentParticipants: 87,
        status: 'registration_open',
        description: 'Norgesmesterskap for juniorer. Kvalifisering til Nordisk Mesterskap.',
        format: '54 hull slagspill',
        fee: 850,
        myPlayers: [
          { ...players[0], status: 'registered' },
          { ...players[2], status: 'registered' },
          { ...players[4], status: 'pending' },
        ],
      },
      {
        id: 't2',
        name: 'AK Golf Academy Cup',
        type: 'club',
        category: 'open',
        startDate: '2025-01-20',
        endDate: '2025-01-20',
        location: 'Miklagard Golf',
        city: 'Kløfta',
        registrationDeadline: '2025-01-15',
        maxParticipants: 60,
        currentParticipants: 45,
        status: 'registration_open',
        description: 'Intern turnering for AK Golf Academy medlemmer.',
        format: '18 hull stableford',
        fee: 350,
        myPlayers: [
          { ...players[0], status: 'registered' },
          { ...players[1], status: 'registered' },
          { ...players[2], status: 'registered' },
          { ...players[3], status: 'registered' },
          { ...players[4], status: 'registered' },
        ],
      },
      {
        id: 't3',
        name: 'NGF Tour - Runde 3',
        type: 'tour',
        category: 'elite',
        startDate: '2025-05-10',
        endDate: '2025-05-11',
        location: 'Borre Golfklubb',
        city: 'Horten',
        registrationDeadline: '2025-05-01',
        maxParticipants: 80,
        currentParticipants: 80,
        status: 'registration_closed',
        description: 'Tredje runde i NGF Tour sesongen 2025.',
        format: '36 hull slagspill',
        fee: 650,
        myPlayers: [
          { ...players[0], status: 'registered' },
          { ...players[2], status: 'registered' },
        ],
      },
      {
        id: 't4',
        name: 'Nordisk Mesterskap Junior',
        type: 'international',
        category: 'junior',
        startDate: '2025-07-20',
        endDate: '2025-07-23',
        location: 'Rungsted Golf Klub',
        city: 'København, Danmark',
        registrationDeadline: '2025-06-30',
        maxParticipants: 100,
        currentParticipants: 45,
        status: 'registration_open',
        description: 'Nordisk mesterskap for juniorer. Representerer Norge.',
        format: '72 hull slagspill',
        fee: 1200,
        myPlayers: [
          { ...players[0], status: 'interested' },
        ],
      },
      {
        id: 't5',
        name: 'Sommerturneringen',
        type: 'club',
        category: 'open',
        startDate: '2025-07-05',
        endDate: '2025-07-05',
        location: 'Losby Golfklubb',
        city: 'Lørenskog',
        registrationDeadline: '2025-06-28',
        maxParticipants: 100,
        currentParticipants: 23,
        status: 'registration_open',
        description: 'Populær sommerturnering med grillkveld etter spill.',
        format: '18 hull stableford',
        fee: 450,
        myPlayers: [],
      },
      {
        id: 't6',
        name: 'Regionsmesterskap Øst',
        type: 'championship',
        category: 'junior',
        startDate: '2025-08-22',
        endDate: '2025-08-23',
        location: 'Gamle Fredrikstad GK',
        city: 'Fredrikstad',
        registrationDeadline: '2025-08-10',
        maxParticipants: 80,
        currentParticipants: 0,
        status: 'upcoming',
        description: 'Regionsmesterskap for juniorer i region Øst.',
        format: '36 hull slagspill',
        fee: 550,
        myPlayers: [],
      },
      {
        id: 't7',
        name: 'WANG Toppidrett Internserie - Runde 2',
        type: 'club',
        category: 'junior',
        startDate: '2025-02-15',
        endDate: '2025-02-15',
        location: 'Miklagard Golf',
        city: 'Kløfta',
        registrationDeadline: '2025-02-10',
        maxParticipants: 30,
        currentParticipants: 18,
        status: 'registration_open',
        description: 'Intern konkurranse for WANG Toppidrett elever.',
        format: '18 hull slagspill',
        fee: 0,
        myPlayers: [
          { ...players[0], status: 'registered' },
          { ...players[1], status: 'registered' },
          { ...players[2], status: 'registered' },
        ],
      },
    ];
  };

  // Filter tournaments
  const filteredTournaments = useMemo(() => {
    return tournaments.filter((t) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!t.name.toLowerCase().includes(query) && !t.location.toLowerCase().includes(query)) {
          return false;
        }
      }

      // Main filter
      if (filter === 'my_players' && t.myPlayers.length === 0) return false;
      if (filter === 'upcoming') {
        const days = getDaysUntil(t.startDate);
        if (days < 0 || days > 30) return false;
      }

      // Category filter
      if (categoryFilter !== 'all' && t.category !== categoryFilter) return false;

      return true;
    });
  }, [tournaments, filter, categoryFilter, searchQuery]);

  // Stats
  const stats = useMemo(() => {
    const upcoming = tournaments.filter((t) => getDaysUntil(t.startDate) >= 0).length;
    const withPlayers = tournaments.filter((t) => t.myPlayers.length > 0).length;
    const totalParticipations = tournaments.reduce((sum, t) => sum + t.myPlayers.filter((p) => p.status === 'registered').length, 0);
    const pendingRegistrations = tournaments.reduce((sum, t) => sum + t.myPlayers.filter((p) => p.status === 'pending').length, 0);

    return { upcoming, withPlayers, totalParticipations, pendingRegistrations };
  }, [tournaments]);

  // Helper functions
  const getDaysUntil = (dateStr: string) => {
    const today = new Date();
    const target = new Date(dateStr);
    return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('nb-NO', { day: 'numeric', month: 'short' });
  };

  const formatDateRange = (start: string, end: string) => {
    if (start === end) return formatDate(start);
    return `${formatDate(start)} - ${formatDate(end)}`;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'championship':
        return Medal;
      case 'tour':
        return Star;
      case 'international':
        return Flag;
      default:
        return Trophy;
    }
  };

  const getStatusConfig = (status: string): { label: string; variant: 'success' | 'error' | 'neutral' | 'accent' } => {
    switch (status) {
      case 'registration_open':
        return { label: 'Åpen', variant: 'success' };
      case 'registration_closed':
        return { label: 'Fullt', variant: 'error' };
      case 'upcoming':
        return { label: 'Kommer', variant: 'neutral' };
      case 'in_progress':
        return { label: 'Pågår', variant: 'accent' };
      case 'completed':
        return { label: 'Ferdig', variant: 'neutral' };
      default:
        return { label: status, variant: 'neutral' };
    }
  };

  const getCategoryConfig = (category: string): { label: string; variant: 'accent' | 'warning' | 'success' | 'neutral' } => {
    switch (category) {
      case 'junior':
        return { label: 'Junior', variant: 'accent' };
      case 'elite':
        return { label: 'Elite', variant: 'warning' };
      case 'open':
        return { label: 'Åpen', variant: 'success' };
      case 'senior':
        return { label: 'Senior', variant: 'neutral' };
      default:
        return { label: category, variant: 'neutral' };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-ak-surface-base flex items-center justify-center">
        <StateCard variant="loading" title="Laster turneringer..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ak-surface-base">
      {/* Header */}
      <div className="bg-ak-surface-base border-b border-ak-border-default py-5 px-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <PageTitle className="text-[28px] font-bold text-ak-text-primary m-0">
              Turneringskalender
            </PageTitle>
            <p className="text-[15px] text-ak-text-secondary mt-1">
              Oversikt over turneringer og spillerdeltakelse
            </p>
          </div>

          <div className="flex gap-2.5">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/coach/tournaments/players')}
              leftIcon={<Users size={18} />}
            >
              Mine spillere
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/coach/tournaments/results')}
              leftIcon={<Medal size={18} />}
            >
              Resultater
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-4 flex-wrap">
          <div className="flex items-center gap-2 py-2 px-3.5 bg-ak-brand-primary/10 rounded-lg">
            <Trophy size={16} className="text-ak-brand-primary" />
            <span className="text-[13px] text-ak-text-primary">
              <strong>{stats.upcoming}</strong> kommende
            </span>
          </div>
          <div className="flex items-center gap-2 py-2 px-3.5 bg-ak-status-success/15 rounded-lg">
            <Users size={16} className="text-ak-status-success" />
            <span className="text-[13px] text-ak-text-primary">
              <strong>{stats.withPlayers}</strong> med mine spillere
            </span>
          </div>
          <div className="flex items-center gap-2 py-2 px-3.5 bg-ak-status-warning/15 rounded-lg">
            <CheckCircle size={16} className="text-ak-status-warning" />
            <span className="text-[13px] text-ak-text-primary">
              <strong>{stats.totalParticipations}</strong> påmeldinger
            </span>
          </div>
          {stats.pendingRegistrations > 0 && (
            <div className="flex items-center gap-2 py-2 px-3.5 bg-ak-status-warning/15 rounded-lg">
              <Clock size={16} className="text-ak-status-warning" />
              <span className="text-[13px] text-ak-text-primary">
                <strong>{stats.pendingRegistrations}</strong> venter
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-ak-surface-base py-4 px-6 border-b border-ak-border-default flex gap-3 flex-wrap items-center">
        <Card variant="default" padding="sm" className="flex-1 max-w-[300px]">
          <div className="flex items-center gap-2">
            <Search size={18} className="text-ak-text-tertiary" />
            <input
              type="text"
              placeholder="Søk turnering..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 border-none bg-transparent text-sm text-ak-text-primary outline-none"
            />
          </div>
        </Card>

        <div className="flex gap-2">
          {(['all', 'my_players', 'upcoming'] as const).map((f) => (
            <Button
              key={f}
              variant={filter === f ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setFilter(f)}
            >
              {f === 'all' && 'Alle'}
              {f === 'my_players' && 'Med spillere'}
              {f === 'upcoming' && 'Neste 30 dager'}
            </Button>
          ))}
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="py-2 px-3 bg-ak-surface-base border border-ak-border-default rounded-lg text-[13px] text-ak-text-primary cursor-pointer"
        >
          <option value="all">Alle kategorier</option>
          <option value="junior">Junior</option>
          <option value="elite">Elite</option>
          <option value="open">Åpen</option>
          <option value="senior">Senior</option>
        </select>
      </div>

      {/* Tournament list */}
      <div className="p-6">
        {filteredTournaments.length === 0 ? (
          <StateCard
            variant="empty"
            icon={Trophy}
            title="Ingen turneringer funnet"
            description="Prøv å endre filter eller søkekriterier"
          />
        ) : (
          <div className="flex flex-col gap-4">
            {filteredTournaments.map((tournament) => {
              const TypeIcon = getTypeIcon(tournament.type);
              const statusConfig = getStatusConfig(tournament.status);
              const categoryConfig = getCategoryConfig(tournament.category);
              const daysUntil = getDaysUntil(tournament.startDate);
              const pendingPlayers = tournament.myPlayers.filter((p) => p.status === 'pending');

              return (
                <Card
                  key={tournament.id}
                  variant="default"
                  padding="none"
                  onClick={() => setSelectedTournament(tournament)}
                  className={`cursor-pointer overflow-hidden ${
                    tournament.myPlayers.length > 0
                      ? 'border-2 border-ak-brand-primary'
                      : 'border border-ak-border-default'
                  }`}
                >
                  <div className="p-5">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-ak-status-warning/15 flex items-center justify-center">
                          <TypeIcon size={24} className="text-ak-status-warning" />
                        </div>
                        <div>
                          <SubSectionTitle className="text-[17px] font-semibold text-ak-text-primary m-0">
                            {tournament.name}
                          </SubSectionTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant={categoryConfig.variant} size="sm">{categoryConfig.label}</Badge>
                            <Badge variant={statusConfig.variant} size="sm">{statusConfig.label}</Badge>
                          </div>
                        </div>
                      </div>

                      {daysUntil >= 0 && daysUntil <= 14 && (
                        <Badge variant="accent" size="sm">
                          {daysUntil === 0 ? 'I dag!' : `Om ${daysUntil} dager`}
                        </Badge>
                      )}
                    </div>

                    {/* Details */}
                    <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-3 mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-ak-text-tertiary" />
                        <span className="text-sm text-ak-text-primary">
                          {formatDateRange(tournament.startDate, tournament.endDate)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-ak-text-tertiary" />
                        <span className="text-sm text-ak-text-primary">
                          {tournament.location}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users size={16} className="text-ak-text-tertiary" />
                        <span className="text-sm text-ak-text-primary">
                          {tournament.currentParticipants}/{tournament.maxParticipants}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Flag size={16} className="text-ak-text-tertiary" />
                        <span className="text-sm text-ak-text-primary">
                          {tournament.format}
                        </span>
                      </div>
                    </div>

                    {/* My Players */}
                    {tournament.myPlayers.length > 0 && (
                      <div className="p-3 px-4 bg-ak-brand-primary/10 rounded-lg border-l-[3px] border-ak-brand-primary">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[13px] font-semibold text-ak-brand-primary">
                            Mine spillere ({tournament.myPlayers.length})
                          </span>
                          {pendingPlayers.length > 0 && (
                            <Badge variant="warning" size="sm">{pendingPlayers.length} venter</Badge>
                          )}
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          {tournament.myPlayers.map((player) => (
                            <div
                              key={player.id}
                              className={`flex items-center gap-1.5 py-1 px-2.5 bg-ak-surface-base rounded-full ${
                                player.status === 'pending'
                                  ? 'border border-ak-status-warning'
                                  : 'border border-ak-border-default'
                              }`}
                            >
                              <div className="w-5 h-5 rounded-full bg-ak-brand-primary text-ak-surface-base text-[9px] font-semibold flex items-center justify-center">
                                {player.initials}
                              </div>
                              <span className="text-xs text-ak-text-primary">
                                {player.name}
                              </span>
                              {player.status === 'pending' && (
                                <Clock size={12} className="text-ak-status-warning" />
                              )}
                              {player.status === 'interested' && (
                                <Star size={12} className="text-ak-status-warning" />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between py-3 px-5 bg-ak-surface-subtle border-t border-ak-border-default">
                    <div>
                      <span className="text-xs text-ak-text-tertiary">Startavgift</span>
                      <div className="text-base font-semibold text-ak-text-primary">
                        {tournament.fee === 0 ? 'Gratis' : `${tournament.fee} kr`}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        leftIcon={<UserPlus size={16} />}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/coach/tournaments/players?tournament=${tournament.id}`);
                        }}
                      >
                        Meld på spiller
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        leftIcon={<Eye size={16} />}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTournament(tournament);
                        }}
                      >
                        Detaljer
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Tournament detail modal */}
      {selectedTournament && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-[100]"
            onClick={() => setSelectedTournament(null)}
          />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-ak-surface-base rounded-xl p-6 w-[500px] max-w-[90vw] max-h-[80vh] overflow-auto z-[101] shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <SectionTitle className="text-xl font-semibold text-ak-text-primary m-0">
                {selectedTournament.name}
              </SectionTitle>
              <button
                onClick={() => setSelectedTournament(null)}
                className="w-8 h-8 rounded bg-ak-surface-subtle border-none text-lg cursor-pointer text-ak-text-secondary hover:bg-ak-surface-muted"
              >
                ×
              </button>
            </div>

            <p className="text-[15px] text-ak-text-primary mb-5">
              {selectedTournament.description}
            </p>

            <div className="flex flex-col gap-3 mb-5">
              <div className="flex items-center gap-3">
                <Calendar size={18} className="text-ak-brand-primary" />
                <span className="text-ak-text-primary">{formatDateRange(selectedTournament.startDate, selectedTournament.endDate)}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin size={18} className="text-ak-brand-primary" />
                <span className="text-ak-text-primary">{selectedTournament.location}, {selectedTournament.city}</span>
              </div>
              <div className="flex items-center gap-3">
                <Flag size={18} className="text-ak-brand-primary" />
                <span className="text-ak-text-primary">{selectedTournament.format}</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock size={18} className="text-ak-brand-primary" />
                <span className="text-ak-text-primary">Påmeldingsfrist: {formatDate(selectedTournament.registrationDeadline)}</span>
              </div>
            </div>

            {selectedTournament.myPlayers.length > 0 && (
              <div className="mb-5">
                <CardTitle className="text-[15px] font-semibold text-ak-text-primary mb-3">
                  Påmeldte spillere
                </CardTitle>
                <div className="flex flex-col gap-2">
                  {selectedTournament.myPlayers.map((player) => (
                    <div
                      key={player.id}
                      className="flex items-center justify-between py-2.5 px-3 bg-ak-surface-subtle rounded-lg"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-ak-brand-primary text-ak-surface-base text-xs font-semibold flex items-center justify-center">
                          {player.initials}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-ak-text-primary">
                            {player.name}
                          </div>
                          <div className="text-xs text-ak-text-secondary">
                            Kategori {player.category}
                          </div>
                        </div>
                      </div>
                      <Badge
                        variant={
                          player.status === 'registered' ? 'success' :
                          player.status === 'pending' ? 'warning' : 'neutral'
                        }
                        size="sm"
                      >
                        {player.status === 'registered' && 'Påmeldt'}
                        {player.status === 'pending' && 'Venter'}
                        {player.status === 'interested' && 'Interessert'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                variant="ghost"
                leftIcon={<UserPlus size={18} />}
                onClick={() => {
                  setSelectedTournament(null);
                  navigate(`/coach/tournaments/players?tournament=${selectedTournament.id}`);
                }}
                className="flex-1"
              >
                Meld på spiller
              </Button>
              <Button
                variant="primary"
                leftIcon={<ExternalLink size={18} />}
                onClick={() => window.open(`https://mingolf.no/turnering/${selectedTournament.id}`, '_blank')}
                className="flex-1"
              >
                Åpne i MinGolf
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
