// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useMemo, useCallback, useEffect } from 'react';
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
  Info
} from 'lucide-react';
import { dataGolfAPI } from '../../services/api';
import StateCard from '../../ui/composites/StateCard';
import PageHeader from '../../ui/raw-blocks/PageHeader.raw';
import Button from '../../ui/primitives/Button';
import { SubSectionTitle, CardTitle } from '../../components/typography';

interface PlayerStats {
  sgTotal: number | null;
  sgTee: number | null;
  sgApproach: number | null;
  sgAround: number | null;
  sgPutting: number | null;
  drivingDistance: number | null;
  drivingAccuracy: number | null;
  girPercent: number | null;
  scrambling: number | null;
  puttsPerRound: number | null;
}

interface PlayerTrends {
  sgTotal: 'up' | 'down' | 'stable';
  sgTee: 'up' | 'down' | 'stable';
  sgApproach: 'up' | 'down' | 'stable';
  sgAround: 'up' | 'down' | 'stable';
  sgPutting: 'up' | 'down' | 'stable';
}

interface PlayerDataGolf {
  playerId: string;
  playerName: string;
  category: string;
  handicap: number | null;
  dataGolfConnected: boolean;
  lastSync: string | null;
  roundsTracked: number;
  stats: PlayerStats;
  trends: PlayerTrends;
  tourComparison: {
    tour: string;
    gapToTour: number | null;
    percentile: number | null;
  } | null;
}

interface DashboardSummary {
  totalPlayers: number;
  connectedPlayers: number;
  totalRoundsTracked: number;
  lastSyncAt: string | null;
}

interface DashboardData {
  players: PlayerDataGolf[];
  summary: DashboardSummary;
  tourAverages: any;
}

export const CoachDataGolf: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterConnected, setFilterConnected] = useState<'all' | 'connected' | 'disconnected'>('all');
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [selectedTour, setSelectedTour] = useState<'pga' | 'euro' | 'kft'>('pga');

  // API state
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);

  // Fetch dashboard data
  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await dataGolfAPI.getCoachDashboard(selectedTour);
      if (response.data?.success) {
        setDashboardData(response.data.data);
      } else {
        setError('Kunne ikke hente data');
      }
    } catch (err: any) {
      console.error('Failed to fetch DataGolf dashboard:', err);
      setError(err.response?.data?.error || 'Kunne ikke hente data fra server');
    } finally {
      setLoading(false);
    }
  }, [selectedTour]);

  // Initial fetch
  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  // Trigger sync
  const handleSync = async () => {
    setSyncing(true);
    try {
      await dataGolfAPI.triggerSync();
      // Refetch after sync
      await fetchDashboard();
    } catch (err) {
      console.error('Sync failed:', err);
    } finally {
      setSyncing(false);
    }
  };

  const players = dashboardData?.players || [];

  const filteredPlayers = useMemo(() => {
    let result = [...players];

    if (searchQuery) {
      result = result.filter(p =>
        p.playerName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterConnected === 'connected') {
      result = result.filter(p => p.dataGolfConnected);
    } else if (filterConnected === 'disconnected') {
      result = result.filter(p => !p.dataGolfConnected);
    }

    return result;
  }, [players, searchQuery, filterConnected]);

  const stats = dashboardData?.summary || {
    totalPlayers: 0,
    connectedPlayers: 0,
    totalRoundsTracked: 0,
    lastSyncAt: null
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'A': return { bg: 'var(--bg-success-subtle)', text: 'var(--success)' };
      case 'B': return { bg: 'var(--bg-accent-subtle)', text: 'var(--info)' };
      case 'C': return { bg: 'var(--bg-warning-subtle)', text: 'var(--warning)' };
      default: return { bg: 'var(--card)', text: 'var(--text-secondary)' };
    }
  };

  const getTrendIcon = useCallback((trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp size={12} color="var(--success)" />;
      case 'down': return <TrendingDown size={12} color="var(--error)" />;
      default: return <Activity size={12} color={'var(--text-tertiary)'} />;
    }
  }, []);

  const formatSG = (value: number | null) => {
    if (value === null) return '-';
    if (value > 0) return `+${value.toFixed(1)}`;
    return value.toFixed(1);
  };

  const getSGColor = (value: number | null) => {
    if (value === null) return 'var(--text-tertiary)';
    if (value > 0) return 'var(--success)';
    if (value < 0) return 'var(--error)';
    return 'var(--text-secondary)';
  };

  const formatLastSync = (dateString?: string | null) => {
    if (!dateString) return 'Ingen testdata';
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffHours < 1) return 'Akkurat nå';
    if (diffHours < 24) return `${diffHours} timer siden`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} dager siden`;
  };

  if (loading) {
    return (
      <div style={{
        padding: '24px',
        backgroundColor: 'var(--bg-secondary)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <StateCard
          variant="loading"
          title="Laster Data Golf statistikk..."
        />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        padding: '24px',
        backgroundColor: 'var(--bg-secondary)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <StateCard
          variant="error"
          title="Kunne ikke laste data"
          description={error}
          action={
            <Button variant="primary" onClick={fetchDashboard}>
              Prøv igjen
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', backgroundColor: 'var(--bg-secondary)', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '24px' }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, var(--datagolf-accent), var(--datagolf-accent-dark))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <BarChart3 size={24} color="white" />
        </div>
        <div style={{ flex: 1 }}>
          <PageHeader
            title="Data Golf Statistikk"
            subtitle="Strokes Gained analyse og avansert spillerstatistikk"
            actions={
              <Button
                variant="secondary"
                size="sm"
                onClick={handleSync}
                disabled={syncing}
                loading={syncing}
                leftIcon={<RefreshCw size={14} />}
              >
                {syncing ? 'Synkroniserer...' : 'Oppdater'}
              </Button>
            }
            divider={false}
          />
        </div>
      </div>

      {/* Info Banner */}
      <div style={{
        backgroundColor: 'var(--datagolf-accent-muted)',
        borderRadius: '12px',
        padding: '16px',
        marginBottom: '24px',
        border: '1px solid var(--datagolf-accent-border)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <Info size={20} color="var(--datagolf-accent)" />
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: '14px', color: 'var(--text-primary)', margin: 0 }}>
            <strong>Strokes Gained</strong> estimeres basert på testresultater og sammenlignes med {selectedTour.toUpperCase()} Tour gjennomsnitt.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {(['pga', 'euro', 'kft'] as const).map(tour => (
            <button
              key={tour}
              onClick={() => setSelectedTour(tour)}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: selectedTour === tour ? 'var(--datagolf-accent)' : 'var(--datagolf-accent-border)',
                color: selectedTour === tour ? 'white' : 'var(--datagolf-accent)',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              {tour.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Summary */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          borderRadius: '12px',
          padding: '16px',
          border: `1px solid ${'var(--border-default)'}`
        }}>
          <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', margin: '0 0 4px 0' }}>
            Totalt spillere
          </p>
          <p style={{ fontSize: '28px', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
            {stats.totalPlayers}
          </p>
        </div>
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          borderRadius: '12px',
          padding: '16px',
          border: `1px solid ${'var(--border-default)'}`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: 'var(--success)'
            }} />
            <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', margin: 0 }}>
              Med testdata
            </p>
          </div>
          <p style={{ fontSize: '28px', fontWeight: '700', color: 'var(--success)', margin: 0 }}>
            {stats.connectedPlayers}
          </p>
        </div>
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          borderRadius: '12px',
          padding: '16px',
          border: `1px solid ${'var(--border-default)'}`
        }}>
          <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', margin: '0 0 4px 0' }}>
            Tester registrert
          </p>
          <p style={{ fontSize: '28px', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
            {stats.totalRoundsTracked}
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
          {(['all', 'connected', 'disconnected'] as const).map(filter => (
            <button
              key={filter}
              onClick={() => setFilterConnected(filter)}
              style={{
                padding: '10px 16px',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: filterConnected === filter
                  ? 'var(--accent)'
                  : 'var(--bg-primary)',
                color: filterConnected === filter
                  ? 'white'
                  : 'var(--text-secondary)',
                fontSize: '13px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {filter === 'all' ? 'Alle' : filter === 'connected' ? 'Med data' : 'Uten data'}
            </button>
          ))}
        </div>
      </div>

      {/* Player List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredPlayers.map((player) => (
          <div
            key={player.playerId}
            style={{
              backgroundColor: 'var(--bg-primary)',
              borderRadius: '16px',
              padding: '20px',
              border: `1px solid ${'var(--border-default)'}`,
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
                  backgroundColor: 'rgba(var(--accent-rgb), 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  fontWeight: '600',
                  color: 'var(--accent)'
                }}>
                  {player.playerName.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <SubSectionTitle style={{ margin: 0 }}>
                      {player.playerName}
                    </SubSectionTitle>
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
                        ? 'var(--success-muted)'
                        : 'var(--error-muted)',
                      color: player.dataGolfConnected ? 'var(--success)' : 'var(--error)',
                      fontWeight: '500'
                    }}>
                      {player.dataGolfConnected ? 'Har testdata' : 'Mangler testdata'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {player.handicap !== null && (
                      <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                        HCP: {player.handicap.toFixed(1)}
                      </span>
                    )}
                    {player.dataGolfConnected && (
                      <>
                        <span style={{ fontSize: '13px', color: 'var(--text-tertiary)' }}>
                          {player.roundsTracked} tester
                        </span>
                        <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
                          Siste: {formatLastSync(player.lastSync)}
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
                    backgroundColor: (player.stats.sgTotal ?? 0) >= 0
                      ? 'var(--success-muted)'
                      : 'var(--error-muted)',
                    borderRadius: '10px'
                  }}>
                    <p style={{ fontSize: '11px', color: 'var(--text-tertiary)', margin: '0 0 2px 0' }}>
                      SG Total (est.)
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
                    onClick={() => setSelectedPlayer(selectedPlayer === player.playerId ? null : player.playerId)}
                    style={{
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: `1px solid ${'var(--border-default)'}`,
                      backgroundColor: 'transparent',
                      color: 'var(--text-secondary)',
                      fontSize: '12px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    {selectedPlayer === player.playerId ? 'Skjul' : 'Detaljer'}
                    <ChevronRight
                      size={14}
                      style={{
                        transform: selectedPlayer === player.playerId ? 'rotate(90deg)' : 'none',
                        transition: 'transform 0.2s ease'
                      }}
                    />
                  </button>
                </div>
              ) : (
                <div style={{
                  padding: '8px 16px',
                  backgroundColor: 'var(--error-muted)',
                  borderRadius: '8px',
                  fontSize: '12px',
                  color: 'var(--error)'
                }}>
                  Ingen testresultater enda
                </div>
              )}
            </div>

            {/* Expanded Stats */}
            {player.dataGolfConnected && selectedPlayer === player.playerId && (
              <div style={{
                paddingTop: '16px',
                borderTop: `1px solid ${'var(--border-default)'}`
              }}>
                {/* SG Breakdown */}
                <div style={{ marginBottom: '20px' }}>
                  <CardTitle style={{ margin: '0 0 12px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Strokes Gained Breakdown (estimert)
                  </CardTitle>
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
                        backgroundColor: 'var(--bg-tertiary)',
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
                            <stat.icon size={14} color={'var(--text-tertiary)'} />
                            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
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

                {/* Tour Comparison */}
                {player.tourComparison && (
                  <div style={{ marginBottom: '20px' }}>
                    <CardTitle style={{ margin: '0 0 12px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Sammenligning med {player.tourComparison.tour} Tour
                    </CardTitle>
                    <div style={{
                      backgroundColor: 'var(--bg-tertiary)',
                      borderRadius: '10px',
                      padding: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '24px'
                    }}>
                      <div>
                        <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', margin: '0 0 4px 0' }}>
                          Gap til Tour Avg
                        </p>
                        <p style={{
                          fontSize: '24px',
                          fontWeight: '700',
                          color: getSGColor(player.tourComparison.gapToTour),
                          margin: 0
                        }}>
                          {formatSG(player.tourComparison.gapToTour)} slag
                        </p>
                      </div>
                      <div>
                        <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', margin: '0 0 4px 0' }}>
                          Percentil
                        </p>
                        <p style={{
                          fontSize: '24px',
                          fontWeight: '700',
                          color: 'var(--text-primary)',
                          margin: 0
                        }}>
                          {player.tourComparison.percentile ?? '-'}%
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Traditional Stats */}
                <div>
                  <CardTitle style={{ margin: '0 0 12px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Testbasert Statistikk
                  </CardTitle>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(5, 1fr)',
                    gap: '12px'
                  }}>
                    {[
                      { label: 'Driving', value: player.stats.drivingDistance ? `${player.stats.drivingDistance}m` : '-', subtext: player.stats.drivingAccuracy ? `${player.stats.drivingAccuracy}% acc` : '' },
                      { label: 'GIR', value: player.stats.girPercent ? `${player.stats.girPercent}%` : '-', subtext: 'Greens in Reg' },
                      { label: 'Scrambling', value: player.stats.scrambling ? `${player.stats.scrambling}%` : '-', subtext: 'Save rate' },
                      { label: 'Putts/Runde', value: player.stats.puttsPerRound?.toFixed(1) ?? '-', subtext: 'gjennomsnitt' },
                      { label: 'Tester', value: player.roundsTracked, subtext: 'analysert' }
                    ].map((stat) => (
                      <div key={stat.label} style={{
                        backgroundColor: 'var(--bg-tertiary)',
                        borderRadius: '10px',
                        padding: '12px',
                        textAlign: 'center'
                      }}>
                        <p style={{ fontSize: '11px', color: 'var(--text-tertiary)', margin: '0 0 4px 0' }}>
                          {stat.label}
                        </p>
                        <p style={{
                          fontSize: '18px',
                          fontWeight: '700',
                          color: 'var(--text-primary)',
                          margin: '0 0 2px 0'
                        }}>
                          {stat.value}
                        </p>
                        <p style={{ fontSize: '10px', color: 'var(--text-tertiary)', margin: 0 }}>
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
        <StateCard
          variant="empty"
          title="Ingen spillere funnet"
          description={players.length === 0 ? 'Last inn spillerdata for å komme i gang.' : 'Prøv å justere filteret for å se flere spillere.'}
        />
      )}
    </div>
  );
};

export default CoachDataGolf;
