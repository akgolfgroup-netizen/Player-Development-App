import React, { useState, useMemo, useCallback } from 'react';
import {
  BarChart3,
  Search,
  TrendingUp,
  TrendingDown,
  Target,
  Crosshair,
  CircleDot,
  Flag,
  Activity,
  ChevronRight,
  RefreshCw,
  ExternalLink,
  Info
} from 'lucide-react';
import { tokens as designTokens } from '../../design-tokens';

interface PlayerDataGolf {
  id: string;
  name: string;
  category: 'A' | 'B' | 'C';
  hcp: number;
  dataGolfConnected: boolean;
  lastSync?: string;
  stats: {
    sgTotal: number;
    sgTee: number;
    sgApproach: number;
    sgAround: number;
    sgPutting: number;
    drivingDistance: number;
    drivingAccuracy: number;
    girPercent: number;
    scrambling: number;
    puttsPerRound: number;
    roundsTracked: number;
  };
  trends: {
    sgTotal: 'up' | 'down' | 'stable';
    sgTee: 'up' | 'down' | 'stable';
    sgApproach: 'up' | 'down' | 'stable';
    sgAround: 'up' | 'down' | 'stable';
    sgPutting: 'up' | 'down' | 'stable';
  };
}

const mockDataGolfPlayers: PlayerDataGolf[] = [
  {
    id: '1',
    name: 'Emma Larsen',
    category: 'A',
    hcp: 4.2,
    dataGolfConnected: true,
    lastSync: '2025-01-19T10:30:00',
    stats: {
      sgTotal: 2.8,
      sgTee: 0.6,
      sgApproach: 1.2,
      sgAround: 0.4,
      sgPutting: 0.6,
      drivingDistance: 235,
      drivingAccuracy: 68,
      girPercent: 58,
      scrambling: 52,
      puttsPerRound: 31.2,
      roundsTracked: 42
    },
    trends: { sgTotal: 'up', sgTee: 'stable', sgApproach: 'up', sgAround: 'up', sgPutting: 'stable' }
  },
  {
    id: '2',
    name: 'Thomas Berg',
    category: 'B',
    hcp: 12.4,
    dataGolfConnected: true,
    lastSync: '2025-01-18T14:15:00',
    stats: {
      sgTotal: -1.5,
      sgTee: -0.3,
      sgApproach: -0.5,
      sgAround: -0.4,
      sgPutting: -0.3,
      drivingDistance: 218,
      drivingAccuracy: 52,
      girPercent: 38,
      scrambling: 35,
      puttsPerRound: 34.8,
      roundsTracked: 28
    },
    trends: { sgTotal: 'up', sgTee: 'up', sgApproach: 'stable', sgAround: 'up', sgPutting: 'down' }
  },
  {
    id: '3',
    name: 'Sofie Andersen',
    category: 'A',
    hcp: 2.8,
    dataGolfConnected: true,
    lastSync: '2025-01-19T08:00:00',
    stats: {
      sgTotal: 4.2,
      sgTee: 0.8,
      sgApproach: 1.8,
      sgAround: 0.8,
      sgPutting: 0.8,
      drivingDistance: 228,
      drivingAccuracy: 72,
      girPercent: 65,
      scrambling: 58,
      puttsPerRound: 29.8,
      roundsTracked: 56
    },
    trends: { sgTotal: 'up', sgTee: 'up', sgApproach: 'up', sgAround: 'stable', sgPutting: 'up' }
  },
  {
    id: '4',
    name: 'Jonas Pedersen',
    category: 'B',
    hcp: 16.8,
    dataGolfConnected: false,
    stats: {
      sgTotal: 0,
      sgTee: 0,
      sgApproach: 0,
      sgAround: 0,
      sgPutting: 0,
      drivingDistance: 0,
      drivingAccuracy: 0,
      girPercent: 0,
      scrambling: 0,
      puttsPerRound: 0,
      roundsTracked: 0
    },
    trends: { sgTotal: 'stable', sgTee: 'stable', sgApproach: 'stable', sgAround: 'stable', sgPutting: 'stable' }
  },
  {
    id: '5',
    name: 'Erik Hansen',
    category: 'A',
    hcp: 5.5,
    dataGolfConnected: true,
    lastSync: '2025-01-17T16:45:00',
    stats: {
      sgTotal: 1.9,
      sgTee: 0.8,
      sgApproach: 0.5,
      sgAround: 0.2,
      sgPutting: 0.4,
      drivingDistance: 255,
      drivingAccuracy: 58,
      girPercent: 52,
      scrambling: 45,
      puttsPerRound: 32.1,
      roundsTracked: 38
    },
    trends: { sgTotal: 'stable', sgTee: 'up', sgApproach: 'down', sgAround: 'stable', sgPutting: 'up' }
  },
  {
    id: '6',
    name: 'Mia Kristiansen',
    category: 'C',
    hcp: 28.5,
    dataGolfConnected: true,
    lastSync: '2025-01-15T11:20:00',
    stats: {
      sgTotal: -5.2,
      sgTee: -1.2,
      sgApproach: -1.8,
      sgAround: -1.2,
      sgPutting: -1.0,
      drivingDistance: 165,
      drivingAccuracy: 45,
      girPercent: 18,
      scrambling: 22,
      puttsPerRound: 38.5,
      roundsTracked: 15
    },
    trends: { sgTotal: 'up', sgTee: 'up', sgApproach: 'up', sgAround: 'stable', sgPutting: 'up' }
  }
];

export const CoachDataGolf: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterConnected, setFilterConnected] = useState<'all' | 'connected' | 'disconnected'>('all');
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);

  const filteredPlayers = useMemo(() => {
    let players = [...mockDataGolfPlayers];

    if (searchQuery) {
      players = players.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterConnected === 'connected') {
      players = players.filter(p => p.dataGolfConnected);
    } else if (filterConnected === 'disconnected') {
      players = players.filter(p => !p.dataGolfConnected);
    }

    return players;
  }, [searchQuery, filterConnected]);

  const stats = useMemo(() => ({
    total: mockDataGolfPlayers.length,
    connected: mockDataGolfPlayers.filter(p => p.dataGolfConnected).length,
    totalRounds: mockDataGolfPlayers.reduce((acc, p) => acc + p.stats.roundsTracked, 0)
  }), []);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'A': return { bg: '#dcfce7', text: '#166534' };
      case 'B': return { bg: '#dbeafe', text: '#1e40af' };
      case 'C': return { bg: '#fef3c7', text: '#92400e' };
      default: return { bg: '#f3f4f6', text: '#374151' };
    }
  };

  const getTrendIcon = useCallback((trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp size={12} color="#16a34a" />;
      case 'down': return <TrendingDown size={12} color="#dc2626" />;
      default: return <Activity size={12} color={designTokens.colors.text.tertiary} />;
    }
  }, []);

  const formatSG = (value: number) => {
    if (value > 0) return `+${value.toFixed(1)}`;
    return value.toFixed(1);
  };

  const getSGColor = (value: number) => {
    if (value > 0) return '#16a34a';
    if (value < 0) return '#dc2626';
    return designTokens.colors.text.secondary;
  };

  const formatLastSync = (dateString?: string) => {
    if (!dateString) return 'Aldri synkronisert';
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffHours < 1) return 'Akkurat nå';
    if (diffHours < 24) return `${diffHours} timer siden`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} dager siden`;
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
            background: `linear-gradient(135deg, #6366f1, #4f46e5)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <BarChart3 size={24} color="white" />
          </div>
          <div>
            <h1 style={{
              fontSize: '28px',
              fontWeight: '700',
              color: designTokens.colors.text.primary,
              margin: 0
            }}>
              Data Golf Statistikk
            </h1>
            <p style={{
              fontSize: '14px',
              color: designTokens.colors.text.secondary,
              margin: 0
            }}>
              Strokes Gained analyse og avansert spillerstatistikk
            </p>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div style={{
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        borderRadius: '12px',
        padding: '16px',
        marginBottom: '24px',
        border: '1px solid rgba(99, 102, 241, 0.2)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <Info size={20} color="#6366f1" />
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: '14px', color: designTokens.colors.text.primary, margin: 0 }}>
            <strong>Strokes Gained</strong> viser hvor mange slag en spiller vinner eller taper sammenlignet med scratch-spillere.
          </p>
        </div>
        <button style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '8px 14px',
          borderRadius: '8px',
          border: 'none',
          backgroundColor: '#6366f1',
          color: 'white',
          fontSize: '12px',
          fontWeight: '500',
          cursor: 'pointer'
        }}>
          <ExternalLink size={14} />
          Data Golf Guide
        </button>
      </div>

      {/* Stats Summary */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div style={{
          backgroundColor: designTokens.colors.background.card,
          borderRadius: '12px',
          padding: '16px',
          border: `1px solid ${designTokens.colors.border.light}`
        }}>
          <p style={{ fontSize: '12px', color: designTokens.colors.text.tertiary, margin: '0 0 4px 0' }}>
            Totalt spillere
          </p>
          <p style={{ fontSize: '28px', fontWeight: '700', color: designTokens.colors.text.primary, margin: 0 }}>
            {stats.total}
          </p>
        </div>
        <div style={{
          backgroundColor: designTokens.colors.background.card,
          borderRadius: '12px',
          padding: '16px',
          border: `1px solid ${designTokens.colors.border.light}`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#16a34a'
            }} />
            <p style={{ fontSize: '12px', color: designTokens.colors.text.tertiary, margin: 0 }}>
              Tilkoblet
            </p>
          </div>
          <p style={{ fontSize: '28px', fontWeight: '700', color: '#16a34a', margin: 0 }}>
            {stats.connected}
          </p>
        </div>
        <div style={{
          backgroundColor: designTokens.colors.background.card,
          borderRadius: '12px',
          padding: '16px',
          border: `1px solid ${designTokens.colors.border.light}`
        }}>
          <p style={{ fontSize: '12px', color: designTokens.colors.text.tertiary, margin: '0 0 4px 0' }}>
            Runder registrert
          </p>
          <p style={{ fontSize: '28px', fontWeight: '700', color: designTokens.colors.text.primary, margin: 0 }}>
            {stats.totalRounds}
          </p>
        </div>
      </div>

      {/* Search and Filter */}
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
          {(['all', 'connected', 'disconnected'] as const).map(filter => (
            <button
              key={filter}
              onClick={() => setFilterConnected(filter)}
              style={{
                padding: '10px 16px',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: filterConnected === filter
                  ? designTokens.colors.primary[500]
                  : designTokens.colors.background.card,
                color: filterConnected === filter
                  ? 'white'
                  : designTokens.colors.text.secondary,
                fontSize: '13px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {filter === 'all' ? 'Alle' : filter === 'connected' ? 'Tilkoblet' : 'Ikke tilkoblet'}
            </button>
          ))}
        </div>
      </div>

      {/* Player List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredPlayers.map((player) => (
          <div
            key={player.id}
            style={{
              backgroundColor: designTokens.colors.background.card,
              borderRadius: '16px',
              padding: '20px',
              border: `1px solid ${designTokens.colors.border.light}`,
              opacity: player.dataGolfConnected ? 1 : 0.7
            }}
          >
            {/* Player Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: player.dataGolfConnected ? '16px' : '0'
            }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: designTokens.colors.primary[100],
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  fontWeight: '600',
                  color: designTokens.colors.primary[700]
                }}>
                  {player.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
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
                    <span style={{
                      fontSize: '11px',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      backgroundColor: player.dataGolfConnected
                        ? 'rgba(34, 197, 94, 0.1)'
                        : 'rgba(239, 68, 68, 0.1)',
                      color: player.dataGolfConnected ? '#16a34a' : '#dc2626',
                      fontWeight: '500'
                    }}>
                      {player.dataGolfConnected ? 'Tilkoblet' : 'Ikke tilkoblet'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '13px', color: designTokens.colors.text.secondary }}>
                      HCP: {player.hcp}
                    </span>
                    {player.dataGolfConnected && (
                      <>
                        <span style={{ fontSize: '13px', color: designTokens.colors.text.tertiary }}>
                          {player.stats.roundsTracked} runder
                        </span>
                        <span style={{ fontSize: '12px', color: designTokens.colors.text.tertiary }}>
                          Synk: {formatLastSync(player.lastSync)}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Total SG or Connect button */}
              {player.dataGolfConnected ? (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <div style={{
                    textAlign: 'right',
                    padding: '8px 16px',
                    backgroundColor: player.stats.sgTotal >= 0
                      ? 'rgba(34, 197, 94, 0.1)'
                      : 'rgba(239, 68, 68, 0.1)',
                    borderRadius: '10px'
                  }}>
                    <p style={{ fontSize: '11px', color: designTokens.colors.text.tertiary, margin: '0 0 2px 0' }}>
                      SG Total
                    </p>
                    <p style={{
                      fontSize: '20px',
                      fontWeight: '700',
                      color: getSGColor(player.stats.sgTotal),
                      margin: 0
                    }}>
                      {formatSG(player.stats.sgTotal)}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedPlayer(selectedPlayer === player.id ? null : player.id)}
                    style={{
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: `1px solid ${designTokens.colors.border.light}`,
                      backgroundColor: 'transparent',
                      color: designTokens.colors.text.secondary,
                      fontSize: '12px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    {selectedPlayer === player.id ? 'Skjul' : 'Detaljer'}
                    <ChevronRight
                      size={14}
                      style={{
                        transform: selectedPlayer === player.id ? 'rotate(90deg)' : 'none',
                        transition: 'transform 0.2s ease'
                      }}
                    />
                  </button>
                </div>
              ) : (
                <button style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '10px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: '#6366f1',
                  color: 'white',
                  fontSize: '13px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}>
                  <RefreshCw size={14} />
                  Koble til Data Golf
                </button>
              )}
            </div>

            {/* Expanded Stats */}
            {player.dataGolfConnected && selectedPlayer === player.id && (
              <div style={{
                paddingTop: '16px',
                borderTop: `1px solid ${designTokens.colors.border.light}`
              }}>
                {/* SG Breakdown */}
                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{
                    fontSize: '13px',
                    fontWeight: '600',
                    color: designTokens.colors.text.secondary,
                    margin: '0 0 12px 0',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Strokes Gained Breakdown
                  </h4>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '12px'
                  }}>
                    {[
                      { label: 'SG Tee', value: player.stats.sgTee, trend: player.trends.sgTee, icon: Crosshair },
                      { label: 'SG Approach', value: player.stats.sgApproach, trend: player.trends.sgApproach, icon: Target },
                      { label: 'SG Around', value: player.stats.sgAround, trend: player.trends.sgAround, icon: Flag },
                      { label: 'SG Putting', value: player.stats.sgPutting, trend: player.trends.sgPutting, icon: CircleDot }
                    ].map((stat) => (
                      <div key={stat.label} style={{
                        backgroundColor: designTokens.colors.background.secondary,
                        borderRadius: '10px',
                        padding: '14px'
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: '8px'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <stat.icon size={14} color={designTokens.colors.text.tertiary} />
                            <span style={{ fontSize: '12px', color: designTokens.colors.text.secondary }}>
                              {stat.label}
                            </span>
                          </div>
                          {getTrendIcon(stat.trend)}
                        </div>
                        <p style={{
                          fontSize: '22px',
                          fontWeight: '700',
                          color: getSGColor(stat.value),
                          margin: 0
                        }}>
                          {formatSG(stat.value)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Traditional Stats */}
                <div>
                  <h4 style={{
                    fontSize: '13px',
                    fontWeight: '600',
                    color: designTokens.colors.text.secondary,
                    margin: '0 0 12px 0',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Tradisjonell Statistikk
                  </h4>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(5, 1fr)',
                    gap: '12px'
                  }}>
                    {[
                      { label: 'Driving', value: `${player.stats.drivingDistance}m`, subtext: `${player.stats.drivingAccuracy}% acc` },
                      { label: 'GIR', value: `${player.stats.girPercent}%`, subtext: 'Greens in Reg' },
                      { label: 'Scrambling', value: `${player.stats.scrambling}%`, subtext: 'Save rate' },
                      { label: 'Putts/Runde', value: player.stats.puttsPerRound.toFixed(1), subtext: 'gjennomsnitt' },
                      { label: 'Runder', value: player.stats.roundsTracked, subtext: 'analysert' }
                    ].map((stat) => (
                      <div key={stat.label} style={{
                        backgroundColor: designTokens.colors.background.secondary,
                        borderRadius: '10px',
                        padding: '12px',
                        textAlign: 'center'
                      }}>
                        <p style={{ fontSize: '11px', color: designTokens.colors.text.tertiary, margin: '0 0 4px 0' }}>
                          {stat.label}
                        </p>
                        <p style={{
                          fontSize: '18px',
                          fontWeight: '700',
                          color: designTokens.colors.text.primary,
                          margin: '0 0 2px 0'
                        }}>
                          {stat.value}
                        </p>
                        <p style={{ fontSize: '10px', color: designTokens.colors.text.tertiary, margin: 0 }}>
                          {stat.subtext}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredPlayers.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          backgroundColor: designTokens.colors.background.card,
          borderRadius: '16px',
          border: `1px solid ${designTokens.colors.border.light}`
        }}>
          <BarChart3 size={48} color={designTokens.colors.text.tertiary} style={{ marginBottom: '16px' }} />
          <p style={{
            fontSize: '16px',
            color: designTokens.colors.text.secondary,
            margin: 0
          }}>
            Ingen spillere funnet med valgt filter
          </p>
        </div>
      )}
    </div>
  );
};

export default CoachDataGolf;
