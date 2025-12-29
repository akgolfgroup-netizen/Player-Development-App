/**
 * AK Golf Academy - Coach Athletes Tournaments Overview
 * Design System v3.0 - Blue Palette 01
 *
 * Oversikt over alle spilleres turneringsdeltakelse for trenere.
 * Fokus: Hvem deltar i hvilke turneringer, statusoversikt.
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Trophy,
  Users,
  Search,
  Calendar,
  MapPin,
  ChevronRight,
  CheckCircle,
  Clock,
  Star,
  AlertCircle,
  Filter,
  ChevronDown,
  Award,
} from 'lucide-react';
import PageHeader from '../../ui/raw-blocks/PageHeader.raw';
// Types
interface TournamentEntry {
  id: string;
  tournamentId: string;
  tournamentName: string;
  date: string;
  location: string;
  status: 'registered' | 'pending' | 'interested' | 'declined';
  category: string;
  result?: {
    position: number;
    score: number;
  };
}

interface Athlete {
  id: string;
  firstName: string;
  lastName: string;
  category: 'A' | 'B' | 'C';
  avatarColor: string;
  upcomingTournaments: TournamentEntry[];
  completedTournaments: TournamentEntry[];
  totalThisYear: number;
  lastTournament?: string;
}

// Avatar component
const Avatar: React.FC<{ name: string; color: string; size?: number }> = ({
  name,
  color,
  size = 44,
}) => {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: color,
        color: 'var(--bg-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.4,
        fontWeight: 600,
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  );
};

// Status badge config
const getStatusConfig = (status: string) => {
  switch (status) {
    case 'registered':
      return {
        label: 'Påmeldt',
        color: 'var(--success)',
        bg: 'rgba(var(--success-rgb), 0.15)',
        icon: CheckCircle,
      };
    case 'pending':
      return {
        label: 'Venter',
        color: 'var(--warning)',
        bg: 'rgba(var(--warning-rgb), 0.15)',
        icon: Clock,
      };
    case 'interested':
      return {
        label: 'Interessert',
        color: 'var(--achievement)',
        bg: 'rgba(var(--achievement-rgb), 0.15)',
        icon: Star,
      };
    case 'declined':
      return {
        label: 'Avslått',
        color: 'var(--error)',
        bg: 'rgba(var(--error-rgb), 0.15)',
        icon: AlertCircle,
      };
    default:
      return {
        label: status,
        color: 'var(--text-secondary)',
        bg: 'var(--bg-tertiary)',
        icon: Clock,
      };
  }
};

// Generate mock data
const generateMockAthletes = (): Athlete[] => {
  // Avatar colors - using CSS variable values as fallback hex for mock data
  const avatarColors = [
    'var(--ak-session-spill)', // accent
    'var(--ak-session-teknikk)', // accent-light
    'var(--ak-session-golfslag)', // success
    'var(--ak-achievement-gold)', // achievement
    '#8E6E53', // warm neutral (no mapping)
    'var(--ak-text-tertiary)', // cool neutral
  ];

  return [
    {
      id: 'a1',
      firstName: 'Anders',
      lastName: 'Hansen',
      category: 'A',
      avatarColor: avatarColors[0],
      upcomingTournaments: [
        {
          id: 'e1',
          tournamentId: 't1',
          tournamentName: 'NM Junior 2025',
          date: '2025-06-15',
          location: 'Oslo GK',
          status: 'registered',
          category: 'junior',
        },
        {
          id: 'e2',
          tournamentId: 't3',
          tournamentName: 'NGF Tour - Runde 3',
          date: '2025-05-10',
          location: 'Borre GK',
          status: 'registered',
          category: 'elite',
        },
        {
          id: 'e3',
          tournamentId: 't4',
          tournamentName: 'Nordisk Mesterskap',
          date: '2025-07-20',
          location: 'København',
          status: 'interested',
          category: 'junior',
        },
      ],
      completedTournaments: [
        {
          id: 'c1',
          tournamentId: 't10',
          tournamentName: 'Vårturneringen',
          date: '2025-03-15',
          location: 'Miklagard',
          status: 'registered',
          category: 'open',
          result: { position: 3, score: -2 },
        },
      ],
      totalThisYear: 8,
      lastTournament: '2025-03-15',
    },
    {
      id: 'a2',
      firstName: 'Sofie',
      lastName: 'Andersen',
      category: 'B',
      avatarColor: avatarColors[3],
      upcomingTournaments: [
        {
          id: 'e4',
          tournamentId: 't2',
          tournamentName: 'AK Golf Academy Cup',
          date: '2025-01-20',
          location: 'Miklagard',
          status: 'registered',
          category: 'open',
        },
      ],
      completedTournaments: [],
      totalThisYear: 5,
      lastTournament: '2025-02-28',
    },
    {
      id: 'a3',
      firstName: 'Erik',
      lastName: 'Johansen',
      category: 'A',
      avatarColor: avatarColors[2],
      upcomingTournaments: [
        {
          id: 'e5',
          tournamentId: 't1',
          tournamentName: 'NM Junior 2025',
          date: '2025-06-15',
          location: 'Oslo GK',
          status: 'registered',
          category: 'junior',
        },
        {
          id: 'e6',
          tournamentId: 't3',
          tournamentName: 'NGF Tour - Runde 3',
          date: '2025-05-10',
          location: 'Borre GK',
          status: 'registered',
          category: 'elite',
        },
        {
          id: 'e7',
          tournamentId: 't7',
          tournamentName: 'WANG Internserie',
          date: '2025-02-15',
          location: 'Miklagard',
          status: 'registered',
          category: 'junior',
        },
      ],
      completedTournaments: [
        {
          id: 'c2',
          tournamentId: 't11',
          tournamentName: 'Vinterturneringen',
          date: '2025-01-20',
          location: 'Losby GK',
          status: 'registered',
          category: 'open',
          result: { position: 1, score: -5 },
        },
      ],
      totalThisYear: 10,
      lastTournament: '2025-03-10',
    },
    {
      id: 'a4',
      firstName: 'Maria',
      lastName: 'Berg',
      category: 'C',
      avatarColor: avatarColors[4],
      upcomingTournaments: [
        {
          id: 'e8',
          tournamentId: 't2',
          tournamentName: 'AK Golf Academy Cup',
          date: '2025-01-20',
          location: 'Miklagard',
          status: 'pending',
          category: 'open',
        },
      ],
      completedTournaments: [],
      totalThisYear: 3,
      lastTournament: '2025-01-15',
    },
    {
      id: 'a5',
      firstName: 'Lars',
      lastName: 'Olsen',
      category: 'B',
      avatarColor: avatarColors[5],
      upcomingTournaments: [
        {
          id: 'e9',
          tournamentId: 't1',
          tournamentName: 'NM Junior 2025',
          date: '2025-06-15',
          location: 'Oslo GK',
          status: 'pending',
          category: 'junior',
        },
        {
          id: 'e10',
          tournamentId: 't2',
          tournamentName: 'AK Golf Academy Cup',
          date: '2025-01-20',
          location: 'Miklagard',
          status: 'registered',
          category: 'open',
        },
      ],
      completedTournaments: [],
      totalThisYear: 6,
      lastTournament: '2025-02-20',
    },
    {
      id: 'a6',
      firstName: 'Emma',
      lastName: 'Nilsen',
      category: 'A',
      avatarColor: avatarColors[1],
      upcomingTournaments: [],
      completedTournaments: [
        {
          id: 'c3',
          tournamentId: 't12',
          tournamentName: 'Åpningsturneringen',
          date: '2025-02-01',
          location: 'Oslo GK',
          status: 'registered',
          category: 'open',
          result: { position: 5, score: +1 },
        },
      ],
      totalThisYear: 2,
      lastTournament: '2025-02-01',
    },
  ];
};

type SortOption = 'name' | 'tournaments' | 'category';
type FilterOption = 'all' | 'A' | 'B' | 'C' | 'upcoming' | 'none';

export default function CoachAthleteTournaments() {
  const navigate = useNavigate();
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [expandedAthlete, setExpandedAthlete] = useState<string | null>(null);

  // Fetch athletes
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/v1/coach/athletes/tournaments');
        if (response.ok) {
          const data = await response.json();
          setAthletes(data.athletes || []);
        } else {
          setAthletes(generateMockAthletes());
        }
      } catch (error) {
        console.error('Failed to fetch athletes:', error);
        setAthletes(generateMockAthletes());
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Sort and filter athletes
  const sortedAndFilteredAthletes = useMemo(() => {
    let result = [...athletes];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (a) =>
          `${a.firstName} ${a.lastName}`.toLowerCase().includes(query) ||
          a.category.toLowerCase().includes(query)
      );
    }

    // Filter by category or tournament status
    if (filterBy !== 'all') {
      if (['A', 'B', 'C'].includes(filterBy)) {
        result = result.filter((a) => a.category === filterBy);
      } else if (filterBy === 'upcoming') {
        result = result.filter((a) => a.upcomingTournaments.length > 0);
      } else if (filterBy === 'none') {
        result = result.filter((a) => a.upcomingTournaments.length === 0);
      }
    }

    // Sort
    switch (sortBy) {
      case 'name':
        result.sort((a, b) =>
          `${a.lastName} ${a.firstName}`.localeCompare(`${b.lastName} ${b.firstName}`)
        );
        break;
      case 'tournaments':
        result.sort((a, b) => b.upcomingTournaments.length - a.upcomingTournaments.length);
        break;
      case 'category':
        result.sort((a, b) => a.category.localeCompare(b.category));
        break;
    }

    return result;
  }, [athletes, searchQuery, sortBy, filterBy]);

  // Stats
  const stats = useMemo(() => {
    const totalRegistrations = athletes.reduce(
      (sum, a) => sum + a.upcomingTournaments.filter((t) => t.status === 'registered').length,
      0
    );
    const pendingRegistrations = athletes.reduce(
      (sum, a) => sum + a.upcomingTournaments.filter((t) => t.status === 'pending').length,
      0
    );
    const athletesWithTournaments = athletes.filter((a) => a.upcomingTournaments.length > 0).length;
    const athletesWithoutTournaments = athletes.filter(
      (a) => a.upcomingTournaments.length === 0
    ).length;

    return {
      totalRegistrations,
      pendingRegistrations,
      athletesWithTournaments,
      athletesWithoutTournaments,
    };
  }, [athletes]);

  // Format date
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('nb-NO', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  // Format short date
  const formatShortDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('nb-NO', {
      day: 'numeric',
      month: 'short',
    });
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
            border: '4px solid var(--border-default)',
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
        fontFamily: 'Inter, -apple-system, system-ui, sans-serif',
      }}
    >
      {/* Header - using PageHeader from design system */}
      <PageHeader
        title="Turneringsdeltakelse"
        subtitle="Oversikt over spillernes påmeldinger og deltakelse"
      />

      {/* Stats badges */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', padding: '0 24px 16px', borderBottom: '1px solid var(--border-default)' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 14px',
            backgroundColor: 'rgba(var(--success-rgb), 0.1)',
            borderRadius: 'var(--radius-md)',
          }}
        >
          <CheckCircle size={16} color={'var(--success)'} />
          <span style={{ fontSize: '13px', color: 'var(--text-primary)' }}>
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
              backgroundColor: 'rgba(var(--warning-rgb), 0.15)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <Clock size={16} color={'var(--warning)'} />
            <span style={{ fontSize: '13px', color: 'var(--text-primary)' }}>
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
            backgroundColor: 'rgba(var(--accent-rgb), 0.1)',
            borderRadius: 'var(--radius-md)',
          }}
        >
          <Users size={16} color={'var(--accent)'} />
          <span style={{ fontSize: '13px', color: 'var(--text-primary)' }}>
            <strong>{stats.athletesWithTournaments}</strong> med turneringer
          </span>
        </div>
        {stats.athletesWithoutTournaments > 0 && (
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
            <AlertCircle size={16} color={'var(--text-secondary)'} />
            <span style={{ fontSize: '13px', color: 'var(--text-primary)' }}>
              <strong>{stats.athletesWithoutTournaments}</strong> uten påmeldinger
            </span>
          </div>
        )}
      </div>

      {/* Search and filters */}
      <div
        style={{
          backgroundColor: 'var(--bg-primary)',
          padding: '16px 24px',
          borderBottom: '1px solid var(--border-default)',
          display: 'flex',
          gap: '12px',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        {/* Search */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 14px',
            backgroundColor: 'var(--bg-tertiary)',
            borderRadius: 'var(--radius-md)',
            flex: 1,
            maxWidth: '300px',
          }}
        >
          <Search size={18} color={'var(--text-secondary)'} />
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
              color: 'var(--text-primary)',
              outline: 'none',
            }}
          />
        </div>

        {/* Filter button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '10px 14px',
            backgroundColor: showFilters ? 'var(--accent)' : 'var(--bg-tertiary)',
            color: showFilters ? 'var(--bg-primary)' : 'var(--text-primary)',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            fontSize: '14px',
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          <Filter size={16} />
          Filter
          <ChevronDown size={16} style={{ transform: showFilters ? 'rotate(180deg)' : 'none' }} />
        </button>

        {/* Sort select */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortOption)}
          style={{
            padding: '10px 14px',
            backgroundColor: 'var(--bg-tertiary)',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            fontSize: '14px',
            color: 'var(--text-primary)',
            cursor: 'pointer',
          }}
        >
          <option value="name">Sorter: Navn</option>
          <option value="tournaments">Sorter: Flest turneringer</option>
          <option value="category">Sorter: Kategori</option>
        </select>
      </div>

      {/* Filter options */}
      {showFilters && (
        <div
          style={{
            backgroundColor: 'var(--bg-primary)',
            padding: '16px 24px',
            borderBottom: '1px solid var(--border-default)',
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap',
          }}
        >
          {[
            { value: 'all', label: 'Alle' },
            { value: 'A', label: 'Kategori A' },
            { value: 'B', label: 'Kategori B' },
            { value: 'C', label: 'Kategori C' },
            { value: 'upcoming', label: 'Med turneringer' },
            { value: 'none', label: 'Uten turneringer' },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setFilterBy(option.value as FilterOption)}
              style={{
                padding: '8px 16px',
                backgroundColor:
                  filterBy === option.value ? 'var(--accent)' : 'var(--bg-tertiary)',
                color: filterBy === option.value ? 'var(--bg-primary)' : 'var(--text-primary)',
                border: 'none',
                borderRadius: '9999px',
                fontSize: '13px',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}

      {/* Athletes list */}
      <div style={{ padding: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {sortedAndFilteredAthletes.length === 0 ? (
            <div
              style={{
                backgroundColor: 'var(--bg-primary)',
                borderRadius: 'var(--radius-lg)',
                padding: '48px 24px',
                textAlign: 'center',
              }}
            >
              <Users size={48} color={'var(--border-default)'} style={{ marginBottom: '16px' }} />
              <h3 style={{ fontSize: '17px', lineHeight: '22px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                Ingen spillere funnet
              </h3>
              <p style={{ fontSize: '15px', lineHeight: '20px', color: 'var(--text-secondary)', marginTop: '8px' }}>
                Prøv å endre søk eller filter
              </p>
            </div>
          ) : (
            sortedAndFilteredAthletes.map((athlete) => {
              const fullName = `${athlete.firstName} ${athlete.lastName}`;
              const isExpanded = expandedAthlete === athlete.id;

              return (
                <div
                  key={athlete.id}
                  style={{
                    backgroundColor: 'var(--bg-primary)',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--shadow-card)',
                    overflow: 'hidden',
                  }}
                >
                  {/* Athlete header */}
                  <div
                    onClick={() => setExpandedAthlete(isExpanded ? null : athlete.id)}
                    style={{
                      padding: '16px 20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      borderBottom: isExpanded ? '1px solid var(--bg-tertiary)' : 'none',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <Avatar name={fullName} color={athlete.avatarColor} />
                      <div>
                        <h3
                          style={{
                            fontSize: '17px', lineHeight: '22px', fontWeight: 600,
                            color: 'var(--text-primary)',
                            margin: 0,
                          }}
                        >
                          {athlete.lastName}, {athlete.firstName}
                        </h3>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            marginTop: '4px',
                          }}
                        >
                          <span
                            style={{
                              fontSize: '11px',
                              fontWeight: 600,
                              color: 'var(--accent)',
                              backgroundColor: 'rgba(var(--accent-rgb), 0.15)',
                              padding: '2px 8px',
                              borderRadius: '4px',
                            }}
                          >
                            Kategori {athlete.category}
                          </span>
                          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                            {athlete.totalThisYear} turneringer i år
                          </span>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {/* Tournament count badges */}
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {athlete.upcomingTournaments.length > 0 && (
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '4px 10px',
                              backgroundColor: 'rgba(var(--success-rgb), 0.1)',
                              borderRadius: '9999px',
                            }}
                          >
                            <Trophy size={14} color={'var(--success)'} />
                            <span
                              style={{
                                fontSize: '12px',
                                fontWeight: 600,
                                color: 'var(--success)',
                              }}
                            >
                              {athlete.upcomingTournaments.length}
                            </span>
                          </div>
                        )}
                        {athlete.upcomingTournaments.length === 0 && (
                          <span
                            style={{
                              fontSize: '12px',
                              color: 'var(--text-secondary)',
                              fontStyle: 'italic',
                            }}
                          >
                            Ingen kommende
                          </span>
                        )}
                      </div>

                      <ChevronDown
                        size={20}
                        color={'var(--text-secondary)'}
                        style={{
                          transform: isExpanded ? 'rotate(180deg)' : 'none',
                          transition: 'transform 0.2s ease',
                        }}
                      />
                    </div>
                  </div>

                  {/* Expanded content */}
                  {isExpanded && (
                    <div style={{ padding: '16px 20px' }}>
                      {/* Upcoming tournaments */}
                      {athlete.upcomingTournaments.length > 0 && (
                        <div style={{ marginBottom: '20px' }}>
                          <h4
                            style={{
                              fontSize: '13px', lineHeight: '18px',
                              color: 'var(--text-secondary)',
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px',
                              margin: '0 0 12px',
                            }}
                          >
                            Kommende turneringer
                          </h4>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {athlete.upcomingTournaments.map((entry) => {
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
                                    backgroundColor: 'var(--bg-secondary)',
                                    borderRadius: 'var(--radius-md)',
                                  }}
                                >
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <Trophy size={16} color={'var(--achievement)'} />
                                    <div>
                                      <div
                                        style={{
                                          fontSize: '14px',
                                          fontWeight: 500,
                                          color: 'var(--text-primary)',
                                        }}
                                      >
                                        {entry.tournamentName}
                                      </div>
                                      <div
                                        style={{
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: '8px',
                                          marginTop: '4px',
                                        }}
                                      >
                                        <Calendar size={12} color={'var(--text-secondary)'} />
                                        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                                          {formatShortDate(entry.date)}
                                        </span>
                                        <MapPin size={12} color={'var(--text-secondary)'} />
                                        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
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
                                      borderRadius: '9999px',
                                    }}
                                  >
                                    <StatusIcon size={14} color={statusConfig.color} />
                                    <span
                                      style={{
                                        fontSize: '12px',
                                        fontWeight: 500,
                                        color: statusConfig.color,
                                      }}
                                    >
                                      {statusConfig.label}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Completed tournaments (last 3) */}
                      {athlete.completedTournaments.length > 0 && (
                        <div style={{ marginBottom: '16px' }}>
                          <h4
                            style={{
                              fontSize: '13px', lineHeight: '18px',
                              color: 'var(--text-secondary)',
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px',
                              margin: '0 0 12px',
                            }}
                          >
                            Siste resultater
                          </h4>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {athlete.completedTournaments.slice(0, 3).map((entry) => (
                              <div
                                key={entry.id}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  padding: '12px 14px',
                                  backgroundColor: 'rgba(var(--accent-rgb), 0.05)',
                                  borderRadius: 'var(--radius-md)',
                                  borderLeft: '3px solid var(--accent)',
                                }}
                              >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                  <Award size={16} color={'var(--accent)'} />
                                  <div>
                                    <div
                                      style={{
                                        fontSize: '14px',
                                        fontWeight: 500,
                                        color: 'var(--text-primary)',
                                      }}
                                    >
                                      {entry.tournamentName}
                                    </div>
                                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                                      {formatDate(entry.date)} • {entry.location}
                                    </div>
                                  </div>
                                </div>

                                {entry.result && (
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ textAlign: 'right' }}>
                                      <div
                                        style={{
                                          fontSize: '16px',
                                          fontWeight: 700,
                                          color: 'var(--accent)',
                                        }}
                                      >
                                        #{entry.result.position}
                                      </div>
                                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                                        {entry.result.score > 0 ? '+' : ''}
                                        {entry.result.score}
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* No tournaments */}
                      {athlete.upcomingTournaments.length === 0 &&
                        athlete.completedTournaments.length === 0 && (
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              padding: '24px',
                              color: 'var(--text-secondary)',
                              fontSize: '14px',
                            }}
                          >
                            <Trophy size={18} style={{ marginRight: '8px' }} />
                            Ingen turneringer registrert
                          </div>
                        )}

                      {/* Actions */}
                      <div
                        style={{
                          display: 'flex',
                          gap: '12px',
                          marginTop: '16px',
                          paddingTop: '16px',
                          borderTop: '1px solid var(--bg-tertiary)',
                        }}
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/coach/athletes/${athlete.id}`);
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '10px 16px',
                            backgroundColor: 'var(--accent)',
                            color: 'var(--bg-primary)',
                            border: 'none',
                            borderRadius: 'var(--radius-md)',
                            fontSize: '13px',
                            fontWeight: 500,
                            cursor: 'pointer',
                          }}
                        >
                          Se spillerprofil
                          <ChevronRight size={16} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/coach/tournaments/players?athlete=${athlete.id}`);
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '10px 16px',
                            backgroundColor: 'var(--bg-tertiary)',
                            color: 'var(--text-primary)',
                            border: 'none',
                            borderRadius: 'var(--radius-md)',
                            fontSize: '13px',
                            fontWeight: 500,
                            cursor: 'pointer',
                          }}
                        >
                          <Trophy size={16} />
                          Meld på turnering
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
