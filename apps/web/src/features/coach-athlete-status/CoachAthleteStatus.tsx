import React, { useState, useMemo } from 'react';
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Calendar,
  Zap,
  Moon,
  Heart,
  Thermometer,
  Search,
  ChevronRight,
  Bell,
  MessageCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { tokens as designTokens } from '../../design-tokens';

interface PlayerStatus {
  id: string;
  name: string;
  category: 'A' | 'B' | 'C';
  hcp: number;
  lastActive: string;
  overallStatus: 'green' | 'yellow' | 'red';
  metrics: {
    training: { value: number; status: 'good' | 'warning' | 'critical'; label: string };
    sleep: { value: number; status: 'good' | 'warning' | 'critical'; label: string };
    energy: { value: number; status: 'good' | 'warning' | 'critical'; label: string };
    stress: { value: number; status: 'good' | 'warning' | 'critical'; label: string };
    injury: { value: boolean; status: 'good' | 'warning' | 'critical'; label: string };
  };
  alerts: {
    type: 'warning' | 'info' | 'critical';
    message: string;
  }[];
  upcomingSession?: string;
  weeklyTrainingMinutes: number;
  weeklyGoal: number;
}

const mockPlayerStatuses: PlayerStatus[] = [
  {
    id: '1',
    name: 'Emma Larsen',
    category: 'A',
    hcp: 4.2,
    lastActive: '2025-01-19T10:30:00',
    overallStatus: 'green',
    metrics: {
      training: { value: 85, status: 'good', label: '8.5t denne uka' },
      sleep: { value: 90, status: 'good', label: '7.5t snitt' },
      energy: { value: 80, status: 'good', label: 'Høy' },
      stress: { value: 25, status: 'good', label: 'Lav' },
      injury: { value: false, status: 'good', label: 'Ingen skader' }
    },
    alerts: [],
    upcomingSession: '2025-01-20T09:00:00',
    weeklyTrainingMinutes: 510,
    weeklyGoal: 600
  },
  {
    id: '2',
    name: 'Jonas Pedersen',
    category: 'B',
    hcp: 16.8,
    lastActive: '2024-12-22T14:00:00',
    overallStatus: 'red',
    metrics: {
      training: { value: 20, status: 'critical', label: '1t denne uka' },
      sleep: { value: 50, status: 'warning', label: '5.5t snitt' },
      energy: { value: 40, status: 'warning', label: 'Lav' },
      stress: { value: 70, status: 'warning', label: 'Høy' },
      injury: { value: false, status: 'good', label: 'Ingen skader' }
    },
    alerts: [
      { type: 'critical', message: '28 dager siden sist aktivitet' },
      { type: 'warning', message: 'Rapportert høyt stressnivå' }
    ],
    weeklyTrainingMinutes: 60,
    weeklyGoal: 300
  },
  {
    id: '3',
    name: 'Sofie Andersen',
    category: 'A',
    hcp: 2.8,
    lastActive: '2025-01-19T08:00:00',
    overallStatus: 'green',
    metrics: {
      training: { value: 95, status: 'good', label: '10t denne uka' },
      sleep: { value: 85, status: 'good', label: '7t snitt' },
      energy: { value: 90, status: 'good', label: 'Veldig høy' },
      stress: { value: 20, status: 'good', label: 'Lav' },
      injury: { value: false, status: 'good', label: 'Ingen skader' }
    },
    alerts: [],
    upcomingSession: '2025-01-21T10:00:00',
    weeklyTrainingMinutes: 600,
    weeklyGoal: 600
  },
  {
    id: '4',
    name: 'Thomas Berg',
    category: 'B',
    hcp: 12.4,
    lastActive: '2025-01-18T16:00:00',
    overallStatus: 'yellow',
    metrics: {
      training: { value: 65, status: 'warning', label: '4t denne uka' },
      sleep: { value: 60, status: 'warning', label: '6t snitt' },
      energy: { value: 55, status: 'warning', label: 'Middels' },
      stress: { value: 50, status: 'warning', label: 'Middels' },
      injury: { value: false, status: 'good', label: 'Ingen skader' }
    },
    alerts: [
      { type: 'warning', message: 'Lavere treningsvolum enn normalt' }
    ],
    upcomingSession: '2025-01-22T14:00:00',
    weeklyTrainingMinutes: 240,
    weeklyGoal: 360
  },
  {
    id: '5',
    name: 'Kristine Olsen',
    category: 'A',
    hcp: 7.5,
    lastActive: '2025-01-17T12:00:00',
    overallStatus: 'yellow',
    metrics: {
      training: { value: 50, status: 'warning', label: '3t denne uka' },
      sleep: { value: 45, status: 'warning', label: '5t snitt' },
      energy: { value: 40, status: 'warning', label: 'Lav' },
      stress: { value: 65, status: 'warning', label: 'Forhøyet' },
      injury: { value: true, status: 'critical', label: 'Håndledd' }
    },
    alerts: [
      { type: 'critical', message: 'Rapportert skade: Håndledd' },
      { type: 'warning', message: 'Lite søvn siste uke' }
    ],
    weeklyTrainingMinutes: 180,
    weeklyGoal: 480
  },
  {
    id: '6',
    name: 'Erik Hansen',
    category: 'A',
    hcp: 5.5,
    lastActive: '2025-01-18T09:00:00',
    overallStatus: 'green',
    metrics: {
      training: { value: 75, status: 'good', label: '6t denne uka' },
      sleep: { value: 80, status: 'good', label: '7t snitt' },
      energy: { value: 75, status: 'good', label: 'Høy' },
      stress: { value: 30, status: 'good', label: 'Lav' },
      injury: { value: false, status: 'good', label: 'Ingen skader' }
    },
    alerts: [],
    upcomingSession: '2025-01-20T11:00:00',
    weeklyTrainingMinutes: 360,
    weeklyGoal: 420
  }
];

export const CoachAthleteStatus: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'green' | 'yellow' | 'red'>('all');

  const filteredPlayers = useMemo(() => {
    let players = [...mockPlayerStatuses];

    if (searchQuery) {
      players = players.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      players = players.filter(p => p.overallStatus === statusFilter);
    }

    // Sort by status (red first, then yellow, then green)
    players.sort((a, b) => {
      const order = { red: 0, yellow: 1, green: 2 };
      return order[a.overallStatus] - order[b.overallStatus];
    });

    return players;
  }, [searchQuery, statusFilter]);

  const stats = useMemo(() => ({
    total: mockPlayerStatuses.length,
    green: mockPlayerStatuses.filter(p => p.overallStatus === 'green').length,
    yellow: mockPlayerStatuses.filter(p => p.overallStatus === 'yellow').length,
    red: mockPlayerStatuses.filter(p => p.overallStatus === 'red').length,
    totalAlerts: mockPlayerStatuses.reduce((acc, p) => acc + p.alerts.length, 0)
  }), []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'green': case 'good': return { bg: 'rgba(34, 197, 94, 0.1)', text: '#16a34a', border: '#16a34a' };
      case 'yellow': case 'warning': return { bg: 'rgba(245, 158, 11, 0.1)', text: '#d97706', border: '#f59e0b' };
      case 'red': case 'critical': return { bg: 'rgba(239, 68, 68, 0.1)', text: '#dc2626', border: '#ef4444' };
      default: return { bg: '#f3f4f6', text: '#6b7280', border: '#e5e7eb' };
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'A': return { bg: '#dcfce7', text: '#166534' };
      case 'B': return { bg: '#dbeafe', text: '#1e40af' };
      case 'C': return { bg: '#fef3c7', text: '#92400e' };
      default: return { bg: '#f3f4f6', text: '#374151' };
    }
  };

  const formatLastActive = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffHours < 1) return 'Akkurat nå';
    if (diffHours < 24) return `${diffHours}t siden`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'I går';
    return `${diffDays} dager siden`;
  };

  const getMetricIcon = (metric: string) => {
    switch (metric) {
      case 'training': return Zap;
      case 'sleep': return Moon;
      case 'energy': return Heart;
      case 'stress': return Activity;
      case 'injury': return Thermometer;
      default: return Activity;
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
            <Activity size={24} color="white" />
          </div>
          <div>
            <h1 style={{
              fontSize: '28px',
              fontWeight: '700',
              color: designTokens.colors.text.primary,
              margin: 0
            }}>
              Spillerstatus
            </h1>
            <p style={{
              fontSize: '14px',
              color: designTokens.colors.text.secondary,
              margin: 0
            }}>
              Sanntidsoversikt over spillernes tilstand og varsler
            </p>
          </div>
        </div>
      </div>

      {/* Status Summary Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: '12px',
        marginBottom: '24px'
      }}>
        <div style={{
          backgroundColor: designTokens.colors.background.card,
          borderRadius: '12px',
          padding: '16px',
          border: `1px solid ${designTokens.colors.border.light}`
        }}>
          <p style={{ fontSize: '12px', color: designTokens.colors.text.tertiary, margin: '0 0 4px 0' }}>
            Totalt
          </p>
          <p style={{ fontSize: '28px', fontWeight: '700', color: designTokens.colors.text.primary, margin: 0 }}>
            {stats.total}
          </p>
        </div>
        <div style={{
          backgroundColor: 'rgba(34, 197, 94, 0.05)',
          borderRadius: '12px',
          padding: '16px',
          border: '1px solid rgba(34, 197, 94, 0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
            <CheckCircle size={14} color="#16a34a" />
            <p style={{ fontSize: '12px', color: '#16a34a', margin: 0 }}>Alt OK</p>
          </div>
          <p style={{ fontSize: '28px', fontWeight: '700', color: '#16a34a', margin: 0 }}>
            {stats.green}
          </p>
        </div>
        <div style={{
          backgroundColor: 'rgba(245, 158, 11, 0.05)',
          borderRadius: '12px',
          padding: '16px',
          border: '1px solid rgba(245, 158, 11, 0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
            <Clock size={14} color="#d97706" />
            <p style={{ fontSize: '12px', color: '#d97706', margin: 0 }}>Følg opp</p>
          </div>
          <p style={{ fontSize: '28px', fontWeight: '700', color: '#d97706', margin: 0 }}>
            {stats.yellow}
          </p>
        </div>
        <div style={{
          backgroundColor: 'rgba(239, 68, 68, 0.05)',
          borderRadius: '12px',
          padding: '16px',
          border: '1px solid rgba(239, 68, 68, 0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
            <AlertTriangle size={14} color="#dc2626" />
            <p style={{ fontSize: '12px', color: '#dc2626', margin: 0 }}>Kritisk</p>
          </div>
          <p style={{ fontSize: '28px', fontWeight: '700', color: '#dc2626', margin: 0 }}>
            {stats.red}
          </p>
        </div>
        <div style={{
          backgroundColor: designTokens.colors.background.card,
          borderRadius: '12px',
          padding: '16px',
          border: `1px solid ${designTokens.colors.border.light}`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
            <Bell size={14} color={designTokens.colors.text.tertiary} />
            <p style={{ fontSize: '12px', color: designTokens.colors.text.tertiary, margin: 0 }}>Varsler</p>
          </div>
          <p style={{ fontSize: '28px', fontWeight: '700', color: designTokens.colors.text.primary, margin: 0 }}>
            {stats.totalAlerts}
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
        <div style={{ position: 'relative', flex: 1, minWidth: '200px', maxWidth: '400px' }}>
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
            { key: 'all', label: 'Alle', color: designTokens.colors.text.secondary },
            { key: 'red', label: 'Kritisk', color: '#dc2626' },
            { key: 'yellow', label: 'Følg opp', color: '#d97706' },
            { key: 'green', label: 'OK', color: '#16a34a' }
          ].map(filter => (
            <button
              key={filter.key}
              onClick={() => setStatusFilter(filter.key as typeof statusFilter)}
              style={{
                padding: '10px 16px',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: statusFilter === filter.key
                  ? filter.key === 'all' ? designTokens.colors.primary[500] : filter.color
                  : designTokens.colors.background.card,
                color: statusFilter === filter.key
                  ? 'white'
                  : designTokens.colors.text.secondary,
                fontSize: '13px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Player List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredPlayers.map((player) => {
          const statusColors = getStatusColor(player.overallStatus);
          const catColors = getCategoryColor(player.category);

          return (
            <div
              key={player.id}
              style={{
                backgroundColor: designTokens.colors.background.card,
                borderRadius: '16px',
                padding: '20px',
                border: `1px solid ${statusColors.border}`,
                borderLeft: `4px solid ${statusColors.border}`
              }}
            >
              {/* Header Row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    backgroundColor: statusColors.bg,
                    border: `2px solid ${statusColors.border}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                    fontWeight: '600',
                    color: statusColors.text
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
                        fontSize: '10px',
                        fontWeight: '600',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        backgroundColor: catColors.bg,
                        color: catColors.text
                      }}>
                        Kat. {player.category}
                      </span>
                      <span style={{
                        fontSize: '11px',
                        color: designTokens.colors.text.tertiary
                      }}>
                        HCP {player.hcp}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '12px', color: designTokens.colors.text.tertiary }}>
                        Sist aktiv: {formatLastActive(player.lastActive)}
                      </span>
                      {player.upcomingSession && (
                        <span style={{
                          fontSize: '12px',
                          color: designTokens.colors.primary[600],
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          <Calendar size={12} />
                          Neste økt: {new Date(player.upcomingSession).toLocaleDateString('nb-NO', { day: 'numeric', month: 'short' })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => navigate(`/coach/messages/compose?to=${player.id}`)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '8px',
                      border: `1px solid ${designTokens.colors.border.light}`,
                      backgroundColor: 'transparent',
                      color: designTokens.colors.text.secondary,
                      fontSize: '12px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <MessageCircle size={14} />
                    Melding
                  </button>
                  <button
                    onClick={() => navigate(`/coach/athletes/${player.id}`)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '8px',
                      border: 'none',
                      backgroundColor: designTokens.colors.primary[500],
                      color: 'white',
                      fontSize: '12px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    Se profil
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>

              {/* Metrics Row */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                gap: '12px',
                marginBottom: player.alerts.length > 0 ? '16px' : '0'
              }}>
                {Object.entries(player.metrics).map(([key, metric]) => {
                  const Icon = getMetricIcon(key);
                  const typedMetric = metric as { value: number | boolean; status: 'good' | 'warning' | 'critical'; label: string };
                  const metricColors = getStatusColor(typedMetric.status);
                  return (
                    <div key={key} style={{
                      padding: '12px',
                      backgroundColor: metricColors.bg,
                      borderRadius: '10px',
                      textAlign: 'center'
                    }}>
                      <Icon size={18} color={metricColors.text} style={{ marginBottom: '6px' }} />
                      <p style={{
                        fontSize: '11px',
                        color: metricColors.text,
                        fontWeight: '500',
                        margin: 0
                      }}>
                        {typedMetric.label}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Weekly Training Progress */}
              <div style={{
                marginTop: '12px',
                padding: '12px',
                backgroundColor: designTokens.colors.background.secondary,
                borderRadius: '10px'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '8px'
                }}>
                  <span style={{ fontSize: '12px', color: designTokens.colors.text.secondary }}>
                    Ukentlig trening
                  </span>
                  <span style={{ fontSize: '12px', fontWeight: '600', color: designTokens.colors.text.primary }}>
                    {Math.round(player.weeklyTrainingMinutes / 60)}t / {Math.round(player.weeklyGoal / 60)}t
                  </span>
                </div>
                <div style={{
                  height: '8px',
                  backgroundColor: designTokens.colors.border.light,
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    height: '100%',
                    width: `${Math.min((player.weeklyTrainingMinutes / player.weeklyGoal) * 100, 100)}%`,
                    backgroundColor: (player.weeklyTrainingMinutes / player.weeklyGoal) >= 0.8
                      ? '#16a34a'
                      : (player.weeklyTrainingMinutes / player.weeklyGoal) >= 0.5
                        ? '#f59e0b'
                        : '#dc2626',
                    borderRadius: '4px',
                    transition: 'width 0.3s ease'
                  }} />
                </div>
              </div>

              {/* Alerts */}
              {player.alerts.length > 0 && (
                <div style={{
                  marginTop: '12px',
                  padding: '12px',
                  backgroundColor: 'rgba(239, 68, 68, 0.05)',
                  borderRadius: '10px',
                  border: '1px solid rgba(239, 68, 68, 0.2)'
                }}>
                  {player.alerts.map((alert, idx) => (
                    <div key={idx} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: idx < player.alerts.length - 1 ? '8px' : '0'
                    }}>
                      <AlertTriangle
                        size={14}
                        color={alert.type === 'critical' ? '#dc2626' : '#d97706'}
                      />
                      <span style={{
                        fontSize: '13px',
                        color: alert.type === 'critical' ? '#dc2626' : '#d97706',
                        fontWeight: '500'
                      }}>
                        {alert.message}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredPlayers.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          backgroundColor: designTokens.colors.background.card,
          borderRadius: '16px',
          border: `1px solid ${designTokens.colors.border.light}`
        }}>
          <Activity size={48} color={designTokens.colors.text.tertiary} style={{ marginBottom: '16px' }} />
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

export default CoachAthleteStatus;
