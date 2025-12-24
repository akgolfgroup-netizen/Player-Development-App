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
import { tokens as designTokens } from '../../design-tokens';

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
      case 'A': return { bg: '#dcfce7', text: '#166534' };
      case 'B': return { bg: '#dbeafe', text: '#1e40af' };
      case 'C': return { bg: '#fef3c7', text: '#92400e' };
      default: return { bg: '#f3f4f6', text: '#374151' };
    }
  };

  return (
    <div style={{ padding: '24px', backgroundColor: designTokens.colors.background.primary, minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: `linear-gradient(135deg, ${designTokens.colors.primary[500]}, ${designTokens.colors.primary[600]})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <TrendingUp size={24} color="white" />
          </div>
          <div>
            <h1 style={{
              fontSize: '28px',
              fontWeight: '700',
              color: designTokens.colors.text.primary,
              margin: 0
            }}>
              Spillere i fremgang
            </h1>
            <p style={{
              fontSize: '14px',
              color: designTokens.colors.text.secondary,
              margin: 0
            }}>
              {filteredAndSortedPlayers.length} spillere viser positiv utvikling
            </p>
          </div>
        </div>
      </div>

      {/* Top Performers */}
      <div style={{
        backgroundColor: designTokens.colors.background.card,
        borderRadius: '16px',
        padding: '20px',
        marginBottom: '24px',
        border: `1px solid ${designTokens.colors.border.light}`
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <Award size={20} color={designTokens.colors.primary[500]} />
          <h2 style={{
            fontSize: '16px',
            fontWeight: '600',
            color: designTokens.colors.text.primary,
            margin: 0
          }}>
            Månedens stjerner
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {topPerformers.map((player, index) => (
            <div key={player.id} style={{
              backgroundColor: index === 0 ? 'rgba(234, 179, 8, 0.1)' : designTokens.colors.background.secondary,
              borderRadius: '12px',
              padding: '16px',
              border: index === 0 ? '2px solid rgba(234, 179, 8, 0.3)' : `1px solid ${designTokens.colors.border.light}`,
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
                  backgroundColor: designTokens.colors.primary[100],
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: designTokens.colors.primary[700]
                }}>
                  {player.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: designTokens.colors.text.primary,
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
                <span style={{ fontSize: '12px', color: designTokens.colors.text.secondary }}>
                  HCP endring
                </span>
                <span style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  color: '#16a34a'
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
              color: designTokens.colors.text.tertiary
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
              border: `1px solid ${designTokens.colors.border.light}`,
              backgroundColor: designTokens.colors.background.card,
              fontSize: '14px',
              color: designTokens.colors.text.primary,
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
            <button
              key={option.key}
              onClick={() => setSortBy(option.key as typeof sortBy)}
              style={{
                padding: '10px 16px',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: sortBy === option.key
                  ? designTokens.colors.primary[500]
                  : designTokens.colors.background.card,
                color: sortBy === option.key
                  ? 'white'
                  : designTokens.colors.text.secondary,
                fontSize: '13px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Player List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredAndSortedPlayers.map((player) => (
          <div
            key={player.id}
            style={{
              backgroundColor: designTokens.colors.background.card,
              borderRadius: '16px',
              padding: '20px',
              border: `1px solid ${designTokens.colors.border.light}`,
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
                  backgroundColor: designTokens.colors.primary[100],
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  fontWeight: '600',
                  color: designTokens.colors.primary[700]
                }}>
                  {player.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <h3 style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: designTokens.colors.text.primary,
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
                      <Target size={14} color={designTokens.colors.text.tertiary} />
                      <span style={{ fontSize: '13px', color: designTokens.colors.text.secondary }}>
                        HCP: {player.currentHcp} (fra {player.startHcp})
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Calendar size={14} color={designTokens.colors.text.tertiary} />
                      <span style={{ fontSize: '13px', color: designTokens.colors.text.secondary }}>
                        {player.sessionsThisMonth} økter denne mnd
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '13px', color: designTokens.colors.text.tertiary }}>
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
                        color: '#16a34a',
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
                          <span style={{ fontSize: '12px', color: designTokens.colors.text.secondary }}>
                            {goal.current}
                          </span>
                          <span style={{ fontSize: '12px', fontWeight: '500', color: designTokens.colors.primary[600] }}>
                            {goal.progress}%
                          </span>
                        </div>
                        <div style={{
                          height: '6px',
                          backgroundColor: designTokens.colors.border.light,
                          borderRadius: '3px',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            height: '100%',
                            width: `${goal.progress}%`,
                            backgroundColor: designTokens.colors.primary[500],
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
                  <ArrowUpRight size={18} color="#16a34a" />
                  <span style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#16a34a'
                  }}>
                    {player.hcpChange}
                  </span>
                </div>
                <button style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: `1px solid ${designTokens.colors.border.light}`,
                  backgroundColor: 'transparent',
                  color: designTokens.colors.text.secondary,
                  fontSize: '12px',
                  cursor: 'pointer'
                }}>
                  Se detaljer
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredAndSortedPlayers.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          backgroundColor: designTokens.colors.background.card,
          borderRadius: '16px',
          border: `1px solid ${designTokens.colors.border.light}`
        }}>
          <TrendingUp size={48} color={designTokens.colors.text.tertiary} style={{ marginBottom: '16px' }} />
          <p style={{
            fontSize: '16px',
            color: designTokens.colors.text.secondary,
            margin: 0
          }}>
            Ingen spillere funnet med søket ditt
          </p>
        </div>
      )}
    </div>
  );
};

export default CoachStatsProgress;
