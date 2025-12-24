/**
 * AK Golf Academy - Coach Tournament Players
 * Design System v3.0 - Blue Palette 01
 *
 * Oversikt over spillernes turneringsdeltakelse og påmeldinger.
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  Trophy,
  User,
  Users,
  Search,
  CheckCircle,
  Clock,
  Star,
  AlertCircle,
  Plus,
} from 'lucide-react';
import { tokens } from '../../design-tokens';

interface TournamentEntry {
  id: string;
  tournamentId: string;
  tournamentName: string;
  date: string;
  location: string;
  status: 'registered' | 'pending' | 'interested' | 'declined';
  category: string;
}

interface Player {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
  category: string;
  upcomingTournaments: TournamentEntry[];
  totalThisYear: number;
  lastTournament?: string;
}

interface Tournament {
  id: string;
  name: string;
  date: string;
  location: string;
  category: string;
  registrationDeadline: string;
  status: 'registration_open' | 'registration_closed' | 'upcoming';
}

export default function CoachTournamentPlayers() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tournamentIdFromUrl = searchParams.get('tournament');

  const [players, setPlayers] = useState<Player[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showRegisterModal, setShowRegisterModal] = useState(!!tournamentIdFromUrl);
  const [selectedTournamentForRegister, setSelectedTournamentForRegister] = useState<string | null>(tournamentIdFromUrl);

  // Fetch players
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [playersRes, tournamentsRes] = await Promise.all([
          fetch('/api/v1/coach/tournaments/players'),
          fetch('/api/v1/coach/tournaments'),
        ]);

        if (playersRes.ok) {
          const data = await playersRes.json();
          setPlayers(data.players || []);
        }
        if (tournamentsRes.ok) {
          const data = await tournamentsRes.json();
          setTournaments(data.tournaments || []);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setPlayers(generateMockPlayers());
        setTournaments(generateMockTournaments());
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Generate mock players
  const generateMockPlayers = (): Player[] => {
    return [
      {
        id: 'p1',
        name: 'Anders Hansen',
        initials: 'AH',
        avatarColor: '#10456A',
        category: 'A',
        upcomingTournaments: [
          { id: 'e1', tournamentId: 't1', tournamentName: 'NM Junior 2025', date: '2025-06-15', location: 'Oslo GK', status: 'registered', category: 'junior' },
          { id: 'e2', tournamentId: 't3', tournamentName: 'NGF Tour - Runde 3', date: '2025-05-10', location: 'Borre GK', status: 'registered', category: 'elite' },
          { id: 'e3', tournamentId: 't4', tournamentName: 'Nordisk Mesterskap', date: '2025-07-20', location: 'København', status: 'interested', category: 'junior' },
        ],
        totalThisYear: 8,
        lastTournament: '2025-03-15',
      },
      {
        id: 'p2',
        name: 'Sofie Andersen',
        initials: 'SA',
        avatarColor: '#C9A227',
        category: 'B',
        upcomingTournaments: [
          { id: 'e4', tournamentId: 't2', tournamentName: 'AK Golf Academy Cup', date: '2025-01-20', location: 'Miklagard', status: 'registered', category: 'open' },
        ],
        totalThisYear: 5,
        lastTournament: '2025-02-28',
      },
      {
        id: 'p3',
        name: 'Erik Johansen',
        initials: 'EJ',
        avatarColor: '#4A7C59',
        category: 'A',
        upcomingTournaments: [
          { id: 'e5', tournamentId: 't1', tournamentName: 'NM Junior 2025', date: '2025-06-15', location: 'Oslo GK', status: 'registered', category: 'junior' },
          { id: 'e6', tournamentId: 't3', tournamentName: 'NGF Tour - Runde 3', date: '2025-05-10', location: 'Borre GK', status: 'registered', category: 'elite' },
          { id: 'e7', tournamentId: 't7', tournamentName: 'WANG Internserie', date: '2025-02-15', location: 'Miklagard', status: 'registered', category: 'junior' },
        ],
        totalThisYear: 10,
        lastTournament: '2025-03-10',
      },
      {
        id: 'p4',
        name: 'Maria Berg',
        initials: 'MB',
        avatarColor: '#C45B4E',
        category: 'C',
        upcomingTournaments: [
          { id: 'e8', tournamentId: 't2', tournamentName: 'AK Golf Academy Cup', date: '2025-01-20', location: 'Miklagard', status: 'registered', category: 'open' },
        ],
        totalThisYear: 3,
        lastTournament: '2025-01-15',
      },
      {
        id: 'p5',
        name: 'Lars Olsen',
        initials: 'LO',
        avatarColor: '#8E8E93',
        category: 'B',
        upcomingTournaments: [
          { id: 'e9', tournamentId: 't1', tournamentName: 'NM Junior 2025', date: '2025-06-15', location: 'Oslo GK', status: 'pending', category: 'junior' },
          { id: 'e10', tournamentId: 't2', tournamentName: 'AK Golf Academy Cup', date: '2025-01-20', location: 'Miklagard', status: 'registered', category: 'open' },
        ],
        totalThisYear: 6,
        lastTournament: '2025-02-20',
      },
    ];
  };

  // Generate mock tournaments
  const generateMockTournaments = (): Tournament[] => {
    return [
      { id: 't1', name: 'NM Junior 2025', date: '2025-06-15', location: 'Oslo GK', category: 'junior', registrationDeadline: '2025-05-30', status: 'registration_open' },
      { id: 't2', name: 'AK Golf Academy Cup', date: '2025-01-20', location: 'Miklagard', category: 'open', registrationDeadline: '2025-01-15', status: 'registration_open' },
      { id: 't3', name: 'NGF Tour - Runde 3', date: '2025-05-10', location: 'Borre GK', category: 'elite', registrationDeadline: '2025-05-01', status: 'registration_open' },
      { id: 't4', name: 'Nordisk Mesterskap', date: '2025-07-20', location: 'København', category: 'junior', registrationDeadline: '2025-06-30', status: 'registration_open' },
      { id: 't5', name: 'Sommerturneringen', date: '2025-07-05', location: 'Losby GK', category: 'open', registrationDeadline: '2025-06-28', status: 'registration_open' },
    ];
  };

  // Filter players
  const filteredPlayers = useMemo(() => {
    if (!searchQuery) return players;
    const query = searchQuery.toLowerCase();
    return players.filter(
      (p) => p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query)
    );
  }, [players, searchQuery]);

  // Stats
  const stats = useMemo(() => {
    const totalRegistrations = players.reduce(
      (sum, p) => sum + p.upcomingTournaments.filter((t) => t.status === 'registered').length,
      0
    );
    const pendingRegistrations = players.reduce(
      (sum, p) => sum + p.upcomingTournaments.filter((t) => t.status === 'pending').length,
      0
    );
    const playersWithTournaments = players.filter((p) => p.upcomingTournaments.length > 0).length;

    return { totalRegistrations, pendingRegistrations, playersWithTournaments };
  }, [players]);

  // Format date
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('nb-NO', { day: 'numeric', month: 'short' });
  };

  // Get status config
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'registered':
        return { label: 'Påmeldt', color: tokens.colors.success, bg: `${tokens.colors.success}15`, icon: CheckCircle };
      case 'pending':
        return { label: 'Venter', color: tokens.colors.warning, bg: `${tokens.colors.warning}15`, icon: Clock };
      case 'interested':
        return { label: 'Interessert', color: tokens.colors.gold, bg: `${tokens.colors.gold}15`, icon: Star };
      case 'declined':
        return { label: 'Avslått', color: tokens.colors.error, bg: `${tokens.colors.error}15`, icon: AlertCircle };
      default:
        return { label: status, color: tokens.colors.steel, bg: tokens.colors.gray100, icon: Clock };
    }
  };

  // Handle register player
  const handleRegisterPlayer = async (playerId: string, tournamentId: string) => {
    try {
      await fetch(`/api/v1/coach/tournaments/${tournamentId}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId }),
      });

      // Update local state
      setPlayers((prev) =>
        prev.map((p) => {
          if (p.id === playerId) {
            const tournament = tournaments.find((t) => t.id === tournamentId);
            if (tournament) {
              return {
                ...p,
                upcomingTournaments: [
                  ...p.upcomingTournaments,
                  {
                    id: `new-${Date.now()}`,
                    tournamentId,
                    tournamentName: tournament.name,
                    date: tournament.date,
                    location: tournament.location,
                    status: 'pending' as const,
                    category: tournament.category,
                  },
                ],
              };
            }
          }
          return p;
        })
      );
    } catch (error) {
      console.error('Failed to register player:', error);
    }

    setShowRegisterModal(false);
    setSelectedTournamentForRegister(null);
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
              Spillerdeltakelse
            </h1>
            <p style={{ ...tokens.typography.subheadline, color: tokens.colors.steel, margin: '4px 0 0' }}>
              Oversikt over spillernes turneringspåmeldinger
            </p>
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
              backgroundColor: `${tokens.colors.success}10`,
              borderRadius: tokens.radius.md,
            }}
          >
            <CheckCircle size={16} color={tokens.colors.success} />
            <span style={{ fontSize: '13px', color: tokens.colors.charcoal }}>
              <strong>{stats.totalRegistrations}</strong> påmeldinger
            </span>
          </div>
          {stats.pendingRegistrations > 0 && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 14px',
                backgroundColor: `${tokens.colors.warning}15`,
                borderRadius: tokens.radius.md,
              }}
            >
              <Clock size={16} color={tokens.colors.warning} />
              <span style={{ fontSize: '13px', color: tokens.colors.charcoal }}>
                <strong>{stats.pendingRegistrations}</strong> venter
              </span>
            </div>
          )}
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
            <Users size={16} color={tokens.colors.primary} />
            <span style={{ fontSize: '13px', color: tokens.colors.charcoal }}>
              <strong>{stats.playersWithTournaments}</strong> av {players.length} spillere
            </span>
          </div>
        </div>
      </div>

      {/* Search and actions */}
      <div
        style={{
          backgroundColor: tokens.colors.white,
          padding: '16px 24px',
          borderBottom: `1px solid ${tokens.colors.gray200}`,
          display: 'flex',
          gap: '12px',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 12px',
            backgroundColor: tokens.colors.gray100,
            borderRadius: tokens.radius.md,
            flex: 1,
            maxWidth: '300px',
          }}
        >
          <Search size={18} color={tokens.colors.steel} />
          <input
            type="text"
            placeholder="Søk spiller..."
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

        <button
          onClick={() => setShowRegisterModal(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            backgroundColor: tokens.colors.primary,
            color: tokens.colors.white,
            border: 'none',
            borderRadius: tokens.radius.md,
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          <Plus size={18} />
          Meld på spiller
        </button>
      </div>

      {/* Player list */}
      <div style={{ padding: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredPlayers.map((player) => (
            <div
              key={player.id}
              style={{
                backgroundColor: tokens.colors.white,
                borderRadius: tokens.radius.lg,
                boxShadow: tokens.shadows.card,
                overflow: 'hidden',
              }}
            >
              {/* Player header */}
              <div
                style={{
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: `1px solid ${tokens.colors.gray100}`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: '50%',
                      backgroundColor: player.avatarColor,
                      color: tokens.colors.white,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '16px',
                      fontWeight: 600,
                    }}
                  >
                    {player.initials}
                  </div>
                  <div>
                    <h3 style={{ ...tokens.typography.headline, color: tokens.colors.charcoal, margin: 0 }}>
                      {player.name}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 600,
                          color: tokens.colors.primary,
                          backgroundColor: `${tokens.colors.primary}15`,
                          padding: '2px 8px',
                          borderRadius: '4px',
                        }}
                      >
                        Kategori {player.category}
                      </span>
                      <span style={{ fontSize: '12px', color: tokens.colors.steel }}>
                        {player.totalThisYear} turneringer i år
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/coach/athletes/${player.id}`)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 12px',
                    backgroundColor: tokens.colors.gray100,
                    color: tokens.colors.charcoal,
                    border: 'none',
                    borderRadius: tokens.radius.md,
                    fontSize: '13px',
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                >
                  <User size={16} />
                  Profil
                </button>
              </div>

              {/* Tournaments */}
              <div style={{ padding: '16px 20px' }}>
                {player.upcomingTournaments.length === 0 ? (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '24px',
                      color: tokens.colors.steel,
                      fontSize: '14px',
                    }}
                  >
                    <Trophy size={18} style={{ marginRight: '8px' }} />
                    Ingen kommende turneringer
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {player.upcomingTournaments.map((entry) => {
                      const statusConfig = getStatusConfig(entry.status);
                      const StatusIcon = statusConfig.icon;

                      return (
                        <div
                          key={entry.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '12px 14px',
                            backgroundColor: tokens.colors.gray50,
                            borderRadius: tokens.radius.md,
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Trophy size={16} color={tokens.colors.gold} />
                            <div>
                              <div style={{ fontSize: '14px', fontWeight: 500, color: tokens.colors.charcoal }}>
                                {entry.tournamentName}
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                                <span style={{ fontSize: '12px', color: tokens.colors.steel }}>
                                  {formatDate(entry.date)}
                                </span>
                                <span style={{ fontSize: '12px', color: tokens.colors.steel }}>•</span>
                                <span style={{ fontSize: '12px', color: tokens.colors.steel }}>
                                  {entry.location}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '4px 10px',
                              backgroundColor: statusConfig.bg,
                              borderRadius: tokens.radius.full,
                            }}
                          >
                            <StatusIcon size={14} color={statusConfig.color} />
                            <span style={{ fontSize: '12px', fontWeight: 500, color: statusConfig.color }}>
                              {statusConfig.label}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Register modal */}
      {showRegisterModal && (
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
            onClick={() => {
              setShowRegisterModal(false);
              setSelectedTournamentForRegister(null);
            }}
          />
          <div
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: tokens.colors.white,
              borderRadius: tokens.radius.lg,
              padding: '24px',
              width: '500px',
              maxWidth: '90vw',
              maxHeight: '80vh',
              overflow: 'auto',
              zIndex: 101,
            }}
          >
            <h2 style={{ ...tokens.typography.title2, color: tokens.colors.charcoal, margin: '0 0 20px' }}>
              Meld på spiller
            </h2>

            {/* Tournament selection */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: tokens.colors.charcoal, marginBottom: '8px' }}>
                Velg turnering
              </label>
              <select
                value={selectedTournamentForRegister || ''}
                onChange={(e) => setSelectedTournamentForRegister(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: `1px solid ${tokens.colors.gray300}`,
                  borderRadius: tokens.radius.md,
                  fontSize: '14px',
                  color: tokens.colors.charcoal,
                }}
              >
                <option value="">Velg turnering...</option>
                {tournaments
                  .filter((t) => t.status === 'registration_open')
                  .map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} - {formatDate(t.date)}
                    </option>
                  ))}
              </select>
            </div>

            {/* Player selection */}
            {selectedTournamentForRegister && (
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: tokens.colors.charcoal, marginBottom: '8px' }}>
                  Velg spillere
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '300px', overflow: 'auto' }}>
                  {players.map((player) => {
                    const isAlreadyRegistered = player.upcomingTournaments.some(
                      (t) => t.tournamentId === selectedTournamentForRegister
                    );

                    return (
                      <div
                        key={player.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '12px',
                          backgroundColor: tokens.colors.gray50,
                          borderRadius: tokens.radius.md,
                          opacity: isAlreadyRegistered ? 0.5 : 1,
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: '50%',
                              backgroundColor: player.avatarColor,
                              color: tokens.colors.white,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '12px',
                              fontWeight: 600,
                            }}
                          >
                            {player.initials}
                          </div>
                          <div>
                            <div style={{ fontSize: '14px', fontWeight: 500, color: tokens.colors.charcoal }}>
                              {player.name}
                            </div>
                            <div style={{ fontSize: '12px', color: tokens.colors.steel }}>
                              Kategori {player.category}
                            </div>
                          </div>
                        </div>

                        {isAlreadyRegistered ? (
                          <span style={{ fontSize: '12px', color: tokens.colors.success, fontWeight: 500 }}>
                            Allerede påmeldt
                          </span>
                        ) : (
                          <button
                            onClick={() => handleRegisterPlayer(player.id, selectedTournamentForRegister)}
                            style={{
                              padding: '6px 12px',
                              backgroundColor: tokens.colors.primary,
                              color: tokens.colors.white,
                              border: 'none',
                              borderRadius: tokens.radius.md,
                              fontSize: '13px',
                              fontWeight: 500,
                              cursor: 'pointer',
                            }}
                          >
                            Meld på
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button
                onClick={() => {
                  setShowRegisterModal(false);
                  setSelectedTournamentForRegister(null);
                }}
                style={{
                  padding: '10px 20px',
                  backgroundColor: tokens.colors.gray100,
                  color: tokens.colors.charcoal,
                  border: 'none',
                  borderRadius: tokens.radius.md,
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                Lukk
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
