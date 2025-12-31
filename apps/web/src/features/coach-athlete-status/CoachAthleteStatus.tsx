/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
/**
 * AK Golf Academy - Coach Athlete Status
 * Design System v3.0 - Semantic CSS Variables
 *
 * Real-time overview of player status including:
 * - Training activity, sleep, energy, stress, injuries
 * - Weekly training progress
 * - Alert notifications
 */

import React, { useState, useMemo, useEffect, useCallback } from 'react';
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
import { useAuth } from '../../contexts/AuthContext';
import { coachesAPI } from '../../services/api';
import Button from '../../ui/primitives/Button';
import Card from '../../ui/primitives/Card';
import StateCard from '../../ui/composites/StateCard';
import { PageTitle, SubSectionTitle } from '../../components/typography';

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
      energy: { value: 80, status: 'good', label: 'Hoy' },
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
      stress: { value: 70, status: 'warning', label: 'Hoy' },
      injury: { value: false, status: 'good', label: 'Ingen skader' }
    },
    alerts: [
      { type: 'critical', message: '28 dager siden sist aktivitet' },
      { type: 'warning', message: 'Rapportert hoyt stressniva' }
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
      energy: { value: 90, status: 'good', label: 'Veldig hoy' },
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
      stress: { value: 65, status: 'warning', label: 'Forhoyet' },
      injury: { value: true, status: 'critical', label: 'Handledd' }
    },
    alerts: [
      { type: 'critical', message: 'Rapportert skade: Handledd' },
      { type: 'warning', message: 'Lite sovn siste uke' }
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
      energy: { value: 75, status: 'good', label: 'Hoy' },
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
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'green' | 'yellow' | 'red'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [playerStatuses, setPlayerStatuses] = useState<PlayerStatus[]>(mockPlayerStatuses);

  // Fetch player data from API
  const fetchPlayerStatuses = useCallback(async () => {
    setIsLoading(true);
    try {
      // Fetch athletes and alerts in parallel
      const [athletesRes, alertsRes] = await Promise.all([
        coachesAPI.getAthletes().catch(() => ({ data: null })),
        coachesAPI.getAlerts(false).catch(() => ({ data: null })),
      ]);

      const athletesData = athletesRes.data?.data || athletesRes.data || [];
      const alertsData: any[] = Array.isArray(alertsRes.data?.data) ? alertsRes.data.data : (Array.isArray(alertsRes.data) ? alertsRes.data : []);

      if (Array.isArray(athletesData) && athletesData.length > 0) {
        // Transform API data to PlayerStatus format
        const transformed: PlayerStatus[] = athletesData.map((athlete: any) => {
          // Find alerts for this player
          const playerAlerts = alertsData.filter(
            (a: any) => a.playerId === athlete.id || a.player?.id === athlete.id
          ).map((a: any) => ({
            type: a.severity === 'critical' || a.priority === 'high' ? 'critical' as const : 'warning' as const,
            message: a.message || a.description || 'Ukjent varsel',
          }));

          // Determine overall status from metrics or alerts
          let overallStatus: 'green' | 'yellow' | 'red' = 'green';
          if (playerAlerts.some((a: any) => a.type === 'critical') || athlete.status === 'critical') {
            overallStatus = 'red';
          } else if (playerAlerts.length > 0 || athlete.status === 'warning') {
            overallStatus = 'yellow';
          }

          return {
            id: athlete.id,
            name: `${athlete.firstName || ''} ${athlete.lastName || ''}`.trim() || athlete.name || 'Spiller',
            category: athlete.category || 'C',
            hcp: athlete.handicap || athlete.hcp || 54,
            lastActive: athlete.lastActivity || athlete.updatedAt || new Date().toISOString(),
            overallStatus,
            metrics: {
              training: {
                value: athlete.trainingProgress || 50,
                status: (athlete.trainingProgress || 50) >= 70 ? 'good' : (athlete.trainingProgress || 50) >= 40 ? 'warning' : 'critical',
                label: `${Math.round((athlete.weeklyTrainingMinutes || 0) / 60)}t denne uka`,
              },
              sleep: {
                value: athlete.sleepScore || 70,
                status: (athlete.sleepScore || 70) >= 70 ? 'good' : (athlete.sleepScore || 70) >= 50 ? 'warning' : 'critical',
                label: `${athlete.avgSleep || 7}t snitt`,
              },
              energy: {
                value: athlete.energyLevel || 70,
                status: (athlete.energyLevel || 70) >= 70 ? 'good' : (athlete.energyLevel || 70) >= 40 ? 'warning' : 'critical',
                label: (athlete.energyLevel || 70) >= 70 ? 'Høy' : (athlete.energyLevel || 70) >= 40 ? 'Middels' : 'Lav',
              },
              stress: {
                value: athlete.stressLevel || 30,
                status: (athlete.stressLevel || 30) <= 30 ? 'good' : (athlete.stressLevel || 30) <= 60 ? 'warning' : 'critical',
                label: (athlete.stressLevel || 30) <= 30 ? 'Lav' : (athlete.stressLevel || 30) <= 60 ? 'Middels' : 'Høy',
              },
              injury: {
                value: athlete.hasInjury || false,
                status: athlete.hasInjury ? 'critical' : 'good',
                label: athlete.hasInjury ? (athlete.injuryDescription || 'Skade') : 'Ingen skader',
              },
            },
            alerts: playerAlerts,
            upcomingSession: athlete.nextSession || undefined,
            weeklyTrainingMinutes: athlete.weeklyTrainingMinutes || 0,
            weeklyGoal: athlete.weeklyGoal || 300,
          };
        });

        setPlayerStatuses(transformed);
      }
    } catch (error) {
      console.error('Failed to fetch player statuses:', error);
      // Keep mock data on error
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlayerStatuses();
  }, [fetchPlayerStatuses]);

  const filteredPlayers = useMemo(() => {
    let players = [...playerStatuses];

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
  }, [searchQuery, statusFilter, playerStatuses]);

  const stats = useMemo(() => ({
    total: playerStatuses.length,
    green: playerStatuses.filter(p => p.overallStatus === 'green').length,
    yellow: playerStatuses.filter(p => p.overallStatus === 'yellow').length,
    red: playerStatuses.filter(p => p.overallStatus === 'red').length,
    totalAlerts: playerStatuses.reduce((acc, p) => acc + p.alerts.length, 0)
  }), [playerStatuses]);

  // Show loading state
  if (isLoading) {
    return (
      <div style={{
        padding: '24px',
        backgroundColor: 'var(--bg-secondary)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <StateCard variant="loading" title="Laster spillerstatus..." />
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'green': case 'good': return { bg: 'rgba(var(--success-rgb), 0.1)', text: 'var(--success)', border: 'var(--success)' };
      case 'yellow': case 'warning': return { bg: 'rgba(var(--warning-rgb), 0.1)', text: 'var(--warning)', border: 'var(--warning)' };
      case 'red': case 'critical': return { bg: 'rgba(var(--error-rgb), 0.1)', text: 'var(--error)', border: 'var(--error)' };
      default: return { bg: 'var(--bg-tertiary)', text: 'var(--text-secondary)', border: 'var(--border-default)' };
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'A': return { bg: 'rgba(var(--success-rgb), 0.15)', text: 'var(--success)' };
      case 'B': return { bg: 'rgba(var(--accent-rgb), 0.15)', text: 'var(--accent)' };
      case 'C': return { bg: 'rgba(var(--warning-rgb), 0.15)', text: 'var(--warning)' };
      default: return { bg: 'var(--bg-tertiary)', text: 'var(--text-primary)' };
    }
  };

  const formatLastActive = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffHours < 1) return 'Akkurat na';
    if (diffHours < 24) return `${diffHours}t siden`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'I gar';
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
    <div style={{ padding: '24px', backgroundColor: 'var(--bg-secondary)', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Activity size={24} color="white" />
          </div>
          <div>
            <PageTitle style={{
              fontSize: '28px',
              fontWeight: '700',
              color: 'var(--text-primary)',
              margin: 0
            }}>
              Spillerstatus
            </PageTitle>
            <p style={{
              fontSize: '14px',
              color: 'var(--text-secondary)',
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
        <Card variant="default" padding="none">
          <div style={{ padding: '16px' }}>
            <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', margin: '0 0 4px 0' }}>
              Totalt
            </p>
            <p style={{ fontSize: '28px', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
              {stats.total}
            </p>
          </div>
        </Card>
        <Card variant="default" padding="none">
          <div style={{
            padding: '16px',
            backgroundColor: 'rgba(var(--success-rgb), 0.05)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid rgba(var(--success-rgb), 0.2)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
              <CheckCircle size={14} style={{ color: 'var(--success)' }} />
              <p style={{ fontSize: '12px', color: 'var(--success)', margin: 0 }}>Alt OK</p>
            </div>
            <p style={{ fontSize: '28px', fontWeight: '700', color: 'var(--success)', margin: 0 }}>
              {stats.green}
            </p>
          </div>
        </Card>
        <Card variant="default" padding="none">
          <div style={{
            padding: '16px',
            backgroundColor: 'rgba(var(--warning-rgb), 0.05)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid rgba(var(--warning-rgb), 0.2)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
              <Clock size={14} style={{ color: 'var(--warning)' }} />
              <p style={{ fontSize: '12px', color: 'var(--warning)', margin: 0 }}>Folg opp</p>
            </div>
            <p style={{ fontSize: '28px', fontWeight: '700', color: 'var(--warning)', margin: 0 }}>
              {stats.yellow}
            </p>
          </div>
        </Card>
        <Card variant="default" padding="none">
          <div style={{
            padding: '16px',
            backgroundColor: 'rgba(var(--error-rgb), 0.05)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid rgba(var(--error-rgb), 0.2)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
              <AlertTriangle size={14} style={{ color: 'var(--error)' }} />
              <p style={{ fontSize: '12px', color: 'var(--error)', margin: 0 }}>Kritisk</p>
            </div>
            <p style={{ fontSize: '28px', fontWeight: '700', color: 'var(--error)', margin: 0 }}>
              {stats.red}
            </p>
          </div>
        </Card>
        <Card variant="default" padding="none">
          <div style={{ padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
              <Bell size={14} style={{ color: 'var(--text-tertiary)' }} />
              <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', margin: 0 }}>Varsler</p>
            </div>
            <p style={{ fontSize: '28px', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
              {stats.totalAlerts}
            </p>
          </div>
        </Card>
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
              color: 'var(--text-tertiary)'
            }}
          />
          <input
            type="text"
            placeholder="Sok etter spiller..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 12px 12px 40px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-default)',
              backgroundColor: 'var(--bg-primary)',
              fontSize: '14px',
              color: 'var(--text-primary)',
              outline: 'none'
            }}
          />
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {[
            { key: 'all', label: 'Alle' },
            { key: 'red', label: 'Kritisk' },
            { key: 'yellow', label: 'Folg opp' },
            { key: 'green', label: 'OK' }
          ].map(filter => (
            <Button
              key={filter.key}
              variant={statusFilter === filter.key ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setStatusFilter(filter.key as typeof statusFilter)}
            >
              {filter.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Player List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredPlayers.map((player) => {
          const statusColors = getStatusColor(player.overallStatus);
          const catColors = getCategoryColor(player.category);

          return (
            <Card key={player.id} variant="default" padding="none">
              <div style={{
                padding: '20px',
                borderLeft: `4px solid ${statusColors.border}`,
                borderRadius: 'var(--radius-lg)'
              }}>
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
                        <SubSectionTitle style={{
                          fontSize: '16px',
                          fontWeight: '600',
                          color: 'var(--text-primary)',
                          margin: 0
                        }}>
                          {player.name}
                        </SubSectionTitle>
                        <span style={{
                          fontSize: '10px',
                          fontWeight: '600',
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: catColors.bg,
                          color: catColors.text
                        }}>
                          Kat. {player.category}
                        </span>
                        <span style={{
                          fontSize: '11px',
                          color: 'var(--text-tertiary)'
                        }}>
                          HCP {player.hcp}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
                          Sist aktiv: {formatLastActive(player.lastActive)}
                        </span>
                        {player.upcomingSession && (
                          <span style={{
                            fontSize: '12px',
                            color: 'var(--accent)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            <Calendar size={12} />
                            Neste okt: {new Date(player.upcomingSession).toLocaleDateString('nb-NO', { day: 'numeric', month: 'short' })}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/coach/messages/compose?to=${player.id}`)}
                      leftIcon={<MessageCircle size={14} />}
                    >
                      Melding
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => navigate(`/coach/athletes/${player.id}`)}
                    >
                      Se profil
                      <ChevronRight size={14} />
                    </Button>
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
                        borderRadius: 'var(--radius-md)',
                        textAlign: 'center'
                      }}>
                        <Icon size={18} style={{ color: metricColors.text, marginBottom: '6px' }} />
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
                  backgroundColor: 'var(--bg-secondary)',
                  borderRadius: 'var(--radius-md)'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '8px'
                  }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      Ukentlig trening
                    </span>
                    <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-primary)' }}>
                      {Math.round(player.weeklyTrainingMinutes / 60)}t / {Math.round(player.weeklyGoal / 60)}t
                    </span>
                  </div>
                  <div style={{
                    height: '8px',
                    backgroundColor: 'var(--border-default)',
                    borderRadius: 'var(--radius-sm)',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${Math.min((player.weeklyTrainingMinutes / player.weeklyGoal) * 100, 100)}%`,
                      backgroundColor: (player.weeklyTrainingMinutes / player.weeklyGoal) >= 0.8
                        ? 'var(--success)'
                        : (player.weeklyTrainingMinutes / player.weeklyGoal) >= 0.5
                          ? 'var(--warning)'
                          : 'var(--error)',
                      borderRadius: 'var(--radius-sm)',
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                </div>

                {/* Alerts */}
                {player.alerts.length > 0 && (
                  <div style={{
                    marginTop: '12px',
                    padding: '12px',
                    backgroundColor: 'rgba(var(--error-rgb), 0.05)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid rgba(var(--error-rgb), 0.2)'
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
                          style={{ color: alert.type === 'critical' ? 'var(--error)' : 'var(--warning)' }}
                        />
                        <span style={{
                          fontSize: '13px',
                          color: alert.type === 'critical' ? 'var(--error)' : 'var(--warning)',
                          fontWeight: '500'
                        }}>
                          {alert.message}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {filteredPlayers.length === 0 && (
        <StateCard
          variant="empty"
          title="Ingen spillere funnet"
          description="Prøv å justere filteret for å se flere spillere."
        />
      )}
    </div>
  );
};

export default CoachAthleteStatus;
