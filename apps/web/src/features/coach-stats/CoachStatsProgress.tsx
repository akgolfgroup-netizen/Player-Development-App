import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  Search,
  ArrowUpRight,
  Target,
  Calendar,
  Award,
  ChevronRight,
  Star,
  Zap
} from 'lucide-react';
import StateCard from '../../ui/composites/StateCard';
import Button from '../../ui/primitives/Button';
import PageHeader from '../../ui/raw-blocks/PageHeader.raw';

interface PlayerProgress {
  id: string;
  name: string;
  avatar?: string;
  category: 'A' | 'B' | 'C';
  currentHcp: number;
  startHcp: number;
  hcpChange: number;
  sessionsThisMonth: number;
  totalSessions: number;
  streak: number;
  lastSession: string;
  improvements: string[];
  goals: {
    current: string;
    progress: number;
  }[];
}

const mockProgressPlayers: PlayerProgress[] = [
  {
    id: '1',
    name: 'Emma Larsen',
    category: 'A',
    currentHcp: 4.2,
    startHcp: 6.8,
    hcpChange: -2.6,
    sessionsThisMonth: 8,
    totalSessions: 45,
    streak: 12,
    lastSession: '2025-01-18',
    improvements: ['Driver konsistens', 'Putting under press', 'Kursmanagement'],
    goals: [
      { current: 'Nå HCP 3.0', progress: 75 },
      { current: 'Vinne klubbmesterskap', progress: 60 }
    ]
  },
  {
    id: '2',
    name: 'Thomas Berg',
    category: 'B',
    currentHcp: 12.4,
    startHcp: 18.2,
    hcpChange: -5.8,
    sessionsThisMonth: 6,
    totalSessions: 32,
    streak: 8,
    lastSession: '2025-01-17',
    improvements: ['Jernspill', 'Bunkerslag', 'Approach'],
    goals: [
      { current: 'Nå HCP 10.0', progress: 80 },
      { current: 'Spille under 80', progress: 45 }
    ]
  },
  {
    id: '3',
    name: 'Sofie Andersen',
    category: 'A',
    currentHcp: 2.8,
    startHcp: 4.5,
    hcpChange: -1.7,
    sessionsThisMonth: 10,
    totalSessions: 62,
    streak: 15,
    lastSession: '2025-01-19',
    improvements: ['Wedge-spill', 'Mentalt spill', 'Scrambling'],
    goals: [
      { current: 'Kvalifisere til NM', progress: 90 },
      { current: 'Plusshcp', progress: 65 }
    ]
  },
  {
    id: '4',
    name: 'Andreas Nilsen',
    category: 'B',
    currentHcp: 14.8,
    startHcp: 22.0,
    hcpChange: -7.2,
    sessionsThisMonth: 5,
    totalSessions: 28,
    streak: 5,
    lastSession: '2025-01-16',
    improvements: ['Sving-teknikk', 'Avstand kontroll'],
    goals: [
      { current: 'Spille stabilt under 90', progress: 70 }
    ]
  },
  {
    id: '5',
    name: 'Mia Kristiansen',
    category: 'C',
    currentHcp: 28.5,
    startHcp: 36.0,
    hcpChange: -7.5,
    sessionsThisMonth: 4,
    totalSessions: 18,
    streak: 4,
    lastSession: '2025-01-15',
    improvements: ['Grunnleggende sving', 'Putting grunnlag'],
    goals: [
      { current: 'Nå HCP 25.0', progress: 60 }
    ]
  },
  {
    id: '6',
    name: 'Erik Hansen',
    category: 'A',
    currentHcp: 5.5,
    startHcp: 7.2,
    hcpChange: -1.7,
    sessionsThisMonth: 7,
    totalSessions: 40,
    streak: 10,
    lastSession: '2025-01-18',
    improvements: ['Driver', 'Lange jern', 'Kurs strategi'],
    goals: [
      { current: 'Nå HCP 4.0', progress: 55 },
      { current: 'Delta i regionsmesterskap', progress: 80 }
    ]
  }
];

export const CoachStatsProgress: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'hcpChange' | 'streak' | 'sessions'>('hcpChange');

  const filteredAndSortedPlayers = useMemo(() => {
    let players = [...mockProgressPlayers];

    if (searchQuery) {
      players = players.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    players.sort((a, b) => {
      switch (sortBy) {
        case 'hcpChange':
          return a.hcpChange - b.hcpChange; // Most negative first
        case 'streak':
          return b.streak - a.streak;
        case 'sessions':
          return b.sessionsThisMonth - a.sessionsThisMonth;
        default:
          return 0;
      }
    });

    return players;
  }, [searchQuery, sortBy]);

  const topPerformers = useMemo(() => {
    return [...mockProgressPlayers]
      .sort((a, b) => a.hcpChange - b.hcpChange)
      .slice(0, 3);
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('nb-NO', { day: 'numeric', month: 'short' });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'A': return { bg: 'var(--bg-success-subtle)', text: 'var(--success)' };
      case 'B': return { bg: 'var(--bg-accent-subtle)', text: 'var(--info)' };
      case 'C': return { bg: 'var(--bg-warning-subtle)', text: 'var(--warning)' };
      default: return { bg: 'var(--card)', text: 'var(--text-secondary)' };
    }
  };

  return (
    <div style={{ padding: '24px', backgroundColor: 'var(--bg-primary)', minHeight: '100vh' }}>
      {/* Header with icon */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '24px' }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, var(--accent), var(--accent-dark))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <TrendingUp size={24} color="white" />
        </div>
        <div style={{ flex: 1 }}>
          <PageHeader
            title="Spillere i fremgang"
            subtitle={`${filteredAndSortedPlayers.length} spillere viser positiv utvikling`}
            divider={false}
          />
        </div>
      </div>

      {/* Top Performers */}
      <div style={{
        backgroundColor: 'var(--bg-primary)',
        borderRadius: '16px',
        padding: '20px',
        marginBottom: '24px',
        border: `1px solid ${'var(--border-default)'}`
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <Award size={20} color={'var(--accent)'} />
          <h2 style={{
            fontSize: '16px',
            fontWeight: '600',
            color: 'var(--text-primary)',
            margin: 0
          }}>
            Månedens stjerner
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {topPerformers.map((player, index) => (
            <div key={player.id} style={{
              backgroundColor: index === 0 ? 'rgba(234, 179, 8, 0.1)' : 'var(--bg-secondary)',
              borderRadius: '12px',
              padding: '16px',
              border: index === 0 ? '2px solid rgba(234, 179, 8, 0.3)' : `1px solid ${'var(--border-default)'}`,
              position: 'relative'
            }}>
              {index === 0 && (
                <div style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-8px',
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: '#eab308',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Star size={14} color="white" fill="white" />
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(var(--accent-rgb), 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: 'var(--accent)'
                }}>
                  {player.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: 'var(--text-primary)',
                    margin: 0
                  }}>
                    {player.name}
                  </p>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: '500',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    backgroundColor: getCategoryColor(player.category).bg,
                    color: getCategoryColor(player.category).text
                  }}>
                    Kategori {player.category}
                  </span>
                </div>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 12px',
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                borderRadius: '8px'
              }}>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  HCP endring
                </span>
                <span style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  color: 'var(--success)'
                }}>
                  {player.hcpChange}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Search and Sort */}
      <div style={{
        display: 'flex',
        gap: '16px',
        marginBottom: '20px',
        flexWrap: 'wrap'
      }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
          <Search
            size={18}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-tertiary)'
            }}
          />
          <input
            type="text"
            placeholder="Søk etter spiller..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 12px 12px 40px',
              borderRadius: '10px',
              border: `1px solid ${'var(--border-default)'}`,
              backgroundColor: 'var(--bg-primary)',
              fontSize: '14px',
              color: 'var(--text-primary)',
              outline: 'none'
            }}
          />
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {[
            { key: 'hcpChange', label: 'HCP forbedring' },
            { key: 'streak', label: 'Treningsrekke' },
            { key: 'sessions', label: 'Økter denne mnd' }
          ].map(option => (
            <Button
              key={option.key}
              variant={sortBy === option.key ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setSortBy(option.key as typeof sortBy)}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Player List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredAndSortedPlayers.map((player) => (
          <div
            key={player.id}
            style={{
              backgroundColor: 'var(--bg-primary)',
              borderRadius: '16px',
              padding: '20px',
              border: `1px solid ${'var(--border-default)'}`,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              {/* Left side - Player info */}
              <div style={{ display: 'flex', gap: '16px', flex: 1 }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(var(--accent-rgb), 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  fontWeight: '600',
                  color: 'var(--accent)'
                }}>
                  {player.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <h3 style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: 'var(--text-primary)',
                      margin: 0
                    }}>
                      {player.name}
                    </h3>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: '500',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      backgroundColor: getCategoryColor(player.category).bg,
                      color: getCategoryColor(player.category).text
                    }}>
                      Kat. {player.category}
                    </span>
                    {player.streak >= 10 && (
                      <span style={{
                        fontSize: '11px',
                        fontWeight: '500',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        backgroundColor: 'rgba(234, 179, 8, 0.15)',
                        color: '#b45309',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <Zap size={10} />
                        {player.streak} uker streak
                      </span>
                    )}
                  </div>

                  {/* Stats row */}
                  <div style={{
                    display: 'flex',
                    gap: '20px',
                    marginBottom: '12px',
                    flexWrap: 'wrap'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Target size={14} color={'var(--text-tertiary)'} />
                      <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                        HCP: {player.currentHcp} (fra {player.startHcp})
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Calendar size={14} color={'var(--text-tertiary)'} />
                      <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                        {player.sessionsThisMonth} økter denne mnd
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '13px', color: 'var(--text-tertiary)' }}>
                        Sist: {formatDate(player.lastSession)}
                      </span>
                    </div>
                  </div>

                  {/* Improvements */}
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
                    {player.improvements.map((imp, idx) => (
                      <span key={idx} style={{
                        fontSize: '11px',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        backgroundColor: 'rgba(34, 197, 94, 0.1)',
                        color: 'var(--success)',
                        fontWeight: '500'
                      }}>
                        {imp}
                      </span>
                    ))}
                  </div>

                  {/* Goals progress */}
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    {player.goals.map((goal, idx) => (
                      <div key={idx} style={{
                        flex: '1',
                        minWidth: '150px',
                        maxWidth: '250px'
                      }}>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          marginBottom: '4px'
                        }}>
                          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                            {goal.current}
                          </span>
                          <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--accent-dark)' }}>
                            {goal.progress}%
                          </span>
                        </div>
                        <div style={{
                          height: '6px',
                          backgroundColor: 'var(--border-default)',
                          borderRadius: '3px',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            height: '100%',
                            width: `${goal.progress}%`,
                            backgroundColor: 'var(--accent)',
                            borderRadius: '3px',
                            transition: 'width 0.3s ease'
                          }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right side - HCP change */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                gap: '8px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '8px 16px',
                  backgroundColor: 'rgba(34, 197, 94, 0.1)',
                  borderRadius: '10px'
                }}>
                  <ArrowUpRight size={18} color="var(--success)" />
                  <span style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: 'var(--success)'
                  }}>
                    {player.hcpChange}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                >
                  Se detaljer
                  <ChevronRight size={14} style={{ marginLeft: '4px' }} />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredAndSortedPlayers.length === 0 && (
        <StateCard
          variant="empty"
          title="Ingen spillere funnet"
          description="Prøv å justere søket for å se flere spillere."
        />
      )}
    </div>
  );
};

export default CoachStatsProgress;
