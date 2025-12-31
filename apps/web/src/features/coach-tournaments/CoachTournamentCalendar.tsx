/**
 * AK Golf Academy - Coach Tournament Calendar
 * Design System v3.0 - Blue Palette 01
 *
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
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: 'var(--bg-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <StateCard variant="loading" title="Laster turneringer..." />
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg-primary)',
      }}
    >
      {/* Header */}
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border-default)',
          padding: '20px 24px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <PageTitle style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              Turneringskalender
            </PageTitle>
            <p style={{ fontSize: '15px', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
              Oversikt over turneringer og spillerdeltakelse
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
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
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 14px',
              backgroundColor: 'var(--bg-accent-subtle)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <Trophy size={16} color="var(--accent)" />
            <span style={{ fontSize: '13px', color: 'var(--text-primary)' }}>
              <strong>{stats.upcoming}</strong> kommende
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 14px',
              backgroundColor: 'color-mix(in srgb, var(--success) 15%, transparent)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <Users size={16} color="var(--success)" />
            <span style={{ fontSize: '13px', color: 'var(--text-primary)' }}>
              <strong>{stats.withPlayers}</strong> med mine spillere
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 14px',
              backgroundColor: 'color-mix(in srgb, var(--warning) 15%, transparent)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <CheckCircle size={16} color="var(--warning)" />
            <span style={{ fontSize: '13px', color: 'var(--text-primary)' }}>
              <strong>{stats.totalParticipations}</strong> påmeldinger
            </span>
          </div>
          {stats.pendingRegistrations > 0 && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 14px',
                backgroundColor: 'color-mix(in srgb, var(--warning) 15%, transparent)',
                borderRadius: 'var(--radius-md)',
              }}
            >
              <Clock size={16} color="var(--warning)" />
              <span style={{ fontSize: '13px', color: 'var(--text-primary)' }}>
                <strong>{stats.pendingRegistrations}</strong> venter
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Filters */}
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          padding: '16px 24px',
          borderBottom: '1px solid var(--border-default)',
          display: 'flex',
          gap: '12px',
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        <Card variant="default" padding="sm" style={{ flex: 1, maxWidth: '300px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Search size={18} color="var(--text-tertiary)" />
            <input
              type="text"
              placeholder="Søk turnering..."
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
        </Card>

        <div style={{ display: 'flex', gap: '8px' }}>
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
          style={{
            padding: '8px 12px',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-md)',
            fontSize: '13px',
            color: 'var(--text-primary)',
            cursor: 'pointer',
          }}
        >
          <option value="all">Alle kategorier</option>
          <option value="junior">Junior</option>
          <option value="elite">Elite</option>
          <option value="open">Åpen</option>
          <option value="senior">Senior</option>
        </select>
      </div>

      {/* Tournament list */}
      <div style={{ padding: '24px' }}>
        {filteredTournaments.length === 0 ? (
          <StateCard
            variant="empty"
            icon={Trophy}
            title="Ingen turneringer funnet"
            description="Prøv å endre filter eller søkekriterier"
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
                  style={{
                    cursor: 'pointer',
                    border: tournament.myPlayers.length > 0 ? '2px solid var(--accent)' : '1px solid var(--border-default)',
                    overflow: 'hidden',
                  }}
                >
                  <div style={{ padding: '20px' }}>
                    {/* Header */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div
                          style={{
                            width: 48,
                            height: 48,
                            borderRadius: 'var(--radius-md)',
                            backgroundColor: 'color-mix(in srgb, var(--warning) 15%, transparent)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <TypeIcon size={24} color="var(--warning)" />
                        </div>
                        <div>
                          <SubSectionTitle style={{ fontSize: '17px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                            {tournament.name}
                          </SubSectionTitle>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
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
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', marginBottom: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Calendar size={16} color="var(--text-tertiary)" />
                        <span style={{ fontSize: '14px', color: 'var(--text-primary)' }}>
                          {formatDateRange(tournament.startDate, tournament.endDate)}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <MapPin size={16} color="var(--text-tertiary)" />
                        <span style={{ fontSize: '14px', color: 'var(--text-primary)' }}>
                          {tournament.location}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Users size={16} color="var(--text-tertiary)" />
                        <span style={{ fontSize: '14px', color: 'var(--text-primary)' }}>
                          {tournament.currentParticipants}/{tournament.maxParticipants}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Flag size={16} color="var(--text-tertiary)" />
                        <span style={{ fontSize: '14px', color: 'var(--text-primary)' }}>
                          {tournament.format}
                        </span>
                      </div>
                    </div>

                    {/* My Players */}
                    {tournament.myPlayers.length > 0 && (
                      <div
                        style={{
                          padding: '12px 16px',
                          backgroundColor: 'var(--bg-accent-subtle)',
                          borderRadius: 'var(--radius-md)',
                          borderLeft: '3px solid var(--accent)',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--accent)' }}>
                            Mine spillere ({tournament.myPlayers.length})
                          </span>
                          {pendingPlayers.length > 0 && (
                            <Badge variant="warning" size="sm">{pendingPlayers.length} venter</Badge>
                          )}
                        </div>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          {tournament.myPlayers.map((player) => (
                            <div
                              key={player.id}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '4px 10px',
                                backgroundColor: 'var(--bg-surface)',
                                borderRadius: 'var(--radius-full)',
                                border: player.status === 'pending' ? '1px solid var(--warning)' : '1px solid var(--border-default)',
                              }}
                            >
                              <div
                                style={{
                                  width: 20,
                                  height: 20,
                                  borderRadius: '50%',
                                  backgroundColor: 'var(--accent)',
                                  color: 'var(--bg-surface)',
                                  fontSize: '9px',
                                  fontWeight: 600,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                {player.initials}
                              </div>
                              <span style={{ fontSize: '12px', color: 'var(--text-primary)' }}>
                                {player.name}
                              </span>
                              {player.status === 'pending' && (
                                <Clock size={12} color="var(--warning)" />
                              )}
                              {player.status === 'interested' && (
                                <Star size={12} color="var(--warning)" />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 20px',
                      backgroundColor: 'var(--bg-secondary)',
                      borderTop: '1px solid var(--border-default)',
                    }}
                  >
                    <div>
                      <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>Startavgift</span>
                      <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {tournament.fee === 0 ? 'Gratis' : `${tournament.fee} kr`}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              zIndex: 100,
            }}
            onClick={() => setSelectedTournament(null)}
          />
          <div
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: 'var(--bg-surface)',
              borderRadius: 'var(--radius-lg)',
              padding: '24px',
              width: '500px',
              maxWidth: '90vw',
              maxHeight: '80vh',
              overflow: 'auto',
              zIndex: 101,
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <SectionTitle style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                {selectedTournament.name}
              </SectionTitle>
              <button
                onClick={() => setSelectedTournament(null)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--bg-secondary)',
                  border: 'none',
                  fontSize: '18px',
                  cursor: 'pointer',
                  color: 'var(--text-secondary)',
                }}
              >
                ×
              </button>
            </div>

            <p style={{ fontSize: '15px', color: 'var(--text-primary)', margin: '0 0 20px' }}>
              {selectedTournament.description}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Calendar size={18} color="var(--accent)" />
                <span style={{ color: 'var(--text-primary)' }}>{formatDateRange(selectedTournament.startDate, selectedTournament.endDate)}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <MapPin size={18} color="var(--accent)" />
                <span style={{ color: 'var(--text-primary)' }}>{selectedTournament.location}, {selectedTournament.city}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Flag size={18} color="var(--accent)" />
                <span style={{ color: 'var(--text-primary)' }}>{selectedTournament.format}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Clock size={18} color="var(--accent)" />
                <span style={{ color: 'var(--text-primary)' }}>Påmeldingsfrist: {formatDate(selectedTournament.registrationDeadline)}</span>
              </div>
            </div>

            {selectedTournament.myPlayers.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <CardTitle style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 12px' }}>
                  Påmeldte spillere
                </CardTitle>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {selectedTournament.myPlayers.map((player) => (
                    <div
                      key={player.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 12px',
                        backgroundColor: 'var(--bg-secondary)',
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
                            color: 'var(--bg-surface)',
                            fontSize: '12px',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {player.initials}
                        </div>
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)' }}>
                            {player.name}
                          </div>
                          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
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

            <div style={{ display: 'flex', gap: '12px' }}>
              <Button
                variant="ghost"
                leftIcon={<UserPlus size={18} />}
                onClick={() => {
                  setSelectedTournament(null);
                  navigate(`/coach/tournaments/players?tournament=${selectedTournament.id}`);
                }}
                style={{ flex: 1 }}
              >
                Meld på spiller
              </Button>
              <Button
                variant="primary"
                leftIcon={<ExternalLink size={18} />}
                onClick={() => window.open(`https://mingolf.no/turnering/${selectedTournament.id}`, '_blank')}
                style={{ flex: 1 }}
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
