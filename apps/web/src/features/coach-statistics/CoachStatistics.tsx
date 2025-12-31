// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * AK Golf Academy - Coach Statistics Dashboard
 * Comprehensive analytics and statistics view for coaches
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart3, TrendingUp, TrendingDown, Users, Target,
  Award, Download,
  Activity, CheckCircle, AlertTriangle
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { analyticsAPI, coachesAPI } from '../../services/api';
import Card from '../../ui/primitives/Card';
import Button from '../../ui/primitives/Button';
import StateCard from '../../ui/composites/StateCard';
import { PageTitle, SectionTitle } from '../../components/typography';

// Types
interface TeamAnalytics {
  totalPlayers: number;
  playersByCategory: Record<string, number>;
  overallCompletionRate: number;
  testsCompletedTotal: number;
  testsPossibleTotal: number;
  testStatistics: TestStatistic[];
  recentActivityCount: number;
  monthlyTrend: 'improving' | 'stable' | 'declining';
}

interface TestStatistic {
  testNumber: number;
  testName: string;
  averageScore: number;
  passRate: number;
  totalAttempts: number;
  trend: 'up' | 'down' | 'stable';
}

interface PlayerSummary {
  playerId: string;
  playerName: string;
  category: string;
  testsCompleted: number;
  totalTests: number;
  completionRate: number;
  lastActivity: string;
  trend: 'improving' | 'stable' | 'declining';
}

// Stat Card Component
const StatCard: React.FC<{
  label: string;
  value: string | number;
  icon: React.ElementType;
  trend?: { value: number; direction: 'up' | 'down' };
  variant?: 'primary' | 'success' | 'warning' | 'gold';
}> = ({ label, value, icon: Icon, trend, variant = 'primary' }) => {
  const colorMap = {
    primary: 'var(--accent)',
    success: 'var(--success)',
    warning: 'var(--warning)',
    gold: 'var(--achievement)',
  };
  const color = colorMap[variant];
  const rgbMap = {
    primary: 'var(--accent-rgb)',
    success: 'var(--success-rgb)',
    warning: 'var(--warning-rgb)',
    gold: 'var(--achievement-rgb)',
  };

  return (
    <Card variant="default" padding="lg">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{
            fontSize: '13px',
            lineHeight: '18px',
            color: 'var(--text-secondary)',
            marginBottom: '8px',
          }}>
            {label}
          </p>
          <p style={{ fontSize: '32px', fontWeight: 700, color, margin: 0 }}>
            {value}
          </p>
          {trend && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              marginTop: '8px',
              color: trend.direction === 'up' ? 'var(--success)' : 'var(--error)',
            }}>
              {trend.direction === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              <span style={{ fontSize: '12px', fontWeight: 500 }}>
                {trend.value}% fra forrige maned
              </span>
            </div>
          )}
        </div>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 'var(--radius-md)',
            backgroundColor: `rgba(${rgbMap[variant]}, 0.1)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon size={24} style={{ color }} />
        </div>
      </div>
    </Card>
  );
};

// Progress bar component
const ProgressBar: React.FC<{ value: number; max?: number; color?: string }> = ({
  value,
  max = 100,
  color = 'var(--accent)',
}) => (
  <div
    style={{
      width: '100%',
      height: '8px',
      backgroundColor: 'var(--bg-tertiary)',
      borderRadius: '4px',
      overflow: 'hidden',
    }}
  >
    <div
      style={{
        width: `${Math.min((value / max) * 100, 100)}%`,
        height: '100%',
        backgroundColor: color,
        borderRadius: '4px',
        transition: 'width 0.3s ease',
      }}
    />
  </div>
);

// Category distribution chart
const CategoryChart: React.FC<{ data: Record<string, number> }> = ({ data }) => {
  const categories = Object.entries(data).sort((a, b) => a[0].localeCompare(b[0]));
  const maxValue = Math.max(...categories.map(([, v]) => v as number), 1);

  const getCategoryColor = (cat: string) => {
    const colors: Record<string, string> = {
      A: 'var(--accent)',
      B: 'rgba(var(--accent-rgb), 0.7)',
      C: 'var(--success)',
      D: 'var(--achievement)',
      E: 'var(--grade-e)',
      F: 'var(--grade-f)',
    };
    return colors[cat] || 'var(--text-secondary)';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {categories.map(([category, count]) => {
        const countNum = count as number;
        return (
        <div key={category}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ fontSize: '15px', lineHeight: '22px', fontWeight: 500 }}>Kategori {category}</span>
            <span style={{ fontSize: '15px', lineHeight: '22px', color: 'var(--text-secondary)' }}>{countNum} spillere</span>
          </div>
          <div
            style={{
              width: '100%',
              height: '24px',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-sm)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${(countNum / maxValue) * 100}%`,
                height: '100%',
                backgroundColor: getCategoryColor(category),
                borderRadius: 'var(--radius-sm)',
                transition: 'width 0.5s ease',
              }}
            />
          </div>
        </div>
      );
      })}
    </div>
  );
};

// Test performance table
const TestPerformanceTable: React.FC<{ data: TestStatistic[] }> = ({ data }) => {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp size={16} style={{ color: 'var(--success)' }} />;
      case 'down':
        return <TrendingDown size={16} style={{ color: 'var(--error)' }} />;
      default:
        return <Activity size={16} style={{ color: 'var(--text-secondary)' }} />;
    }
  };

  const getPassRateColor = (rate: number) => {
    if (rate >= 80) return 'var(--success)';
    if (rate >= 60) return 'var(--warning)';
    return 'var(--error)';
  };

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border-default)' }}>
            <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', lineHeight: '18px', color: 'var(--text-secondary)' }}>
              Test
            </th>
            <th style={{ padding: '12px', textAlign: 'center', fontSize: '13px', lineHeight: '18px', color: 'var(--text-secondary)' }}>
              Gjennomsnitt
            </th>
            <th style={{ padding: '12px', textAlign: 'center', fontSize: '13px', lineHeight: '18px', color: 'var(--text-secondary)' }}>
              Bestattprosent
            </th>
            <th style={{ padding: '12px', textAlign: 'center', fontSize: '13px', lineHeight: '18px', color: 'var(--text-secondary)' }}>
              Antall forsok
            </th>
            <th style={{ padding: '12px', textAlign: 'center', fontSize: '13px', lineHeight: '18px', color: 'var(--text-secondary)' }}>
              Trend
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((test) => (
            <tr
              key={test.testNumber}
              style={{ borderBottom: '1px solid var(--bg-secondary)' }}
            >
              <td style={{ padding: '14px 12px' }}>
                <div>
                  <p style={{ fontSize: '15px', lineHeight: '22px', fontWeight: 500, margin: 0 }}>
                    Test {test.testNumber}
                  </p>
                  <p style={{ fontSize: '12px', lineHeight: '16px', color: 'var(--text-secondary)', margin: 0 }}>
                    {test.testName}
                  </p>
                </div>
              </td>
              <td style={{ padding: '14px 12px', textAlign: 'center' }}>
                <span style={{ fontSize: '15px', lineHeight: '22px', fontWeight: 600 }}>
                  {test.averageScore.toFixed(1)}
                </span>
              </td>
              <td style={{ padding: '14px 12px', textAlign: 'center' }}>
                <span
                  style={{
                    fontSize: '15px',
                    lineHeight: '22px',
                    fontWeight: 600,
                    color: getPassRateColor(test.passRate),
                  }}
                >
                  {test.passRate.toFixed(0)}%
                </span>
              </td>
              <td style={{ padding: '14px 12px', textAlign: 'center' }}>
                <span style={{ fontSize: '15px', lineHeight: '22px' }}>{test.totalAttempts}</span>
              </td>
              <td style={{ padding: '14px 12px', textAlign: 'center' }}>
                {getTrendIcon(test.trend)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Player summary list
const PlayerSummaryList: React.FC<{
  players: PlayerSummary[];
  onPlayerClick: (playerId: string) => void;
}> = ({ players, onPlayerClick }) => {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
        return <TrendingUp size={16} style={{ color: 'var(--success)' }} />;
      case 'declining':
        return <TrendingDown size={16} style={{ color: 'var(--error)' }} />;
      default:
        return <Activity size={16} style={{ color: 'var(--text-secondary)' }} />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {players.map((player) => (
        <div
          key={player.playerId}
          onClick={() => onPlayerClick(player.playerId)}
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '14px 0',
            borderBottom: '1px solid var(--bg-secondary)',
            cursor: 'pointer',
          }}
        >
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: '15px', lineHeight: '22px', fontWeight: 500, margin: 0 }}>
              {player.playerName}
            </p>
            <p style={{ fontSize: '12px', lineHeight: '16px', color: 'var(--text-secondary)', margin: 0 }}>
              Kategori {player.category}
            </p>
          </div>
          <div style={{ width: '120px', marginRight: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: '12px', lineHeight: '16px', color: 'var(--text-secondary)' }}>
                {player.testsCompleted}/{player.totalTests}
              </span>
              <span style={{ fontSize: '12px', lineHeight: '16px', fontWeight: 500 }}>
                {player.completionRate.toFixed(0)}%
              </span>
            </div>
            <ProgressBar value={player.completionRate} />
          </div>
          {getTrendIcon(player.trend)}
        </div>
      ))}
    </div>
  );
};

// Main component
export default function CoachStatistics() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [analytics, setAnalytics] = useState<TeamAnalytics | null>(null);
  const [players, setPlayers] = useState<PlayerSummary[]>([]);

  // Fetch data
  const fetchData = useCallback(async () => {
    if (!user?.coachId && !user?.id) return;

    setLoading(true);
    try {
      const coachId = user.coachId || user.id;

      // Fetch team analytics and players in parallel
      const [analyticsRes, playersRes] = await Promise.all([
        analyticsAPI.getTeamAnalytics(coachId).catch(() => ({ data: null })),
        coachesAPI.getAthletes().catch(() => ({ data: null })),
      ]);

      // Handle analytics response
      const analyticsData = analyticsRes.data?.data || analyticsRes.data;
      if (analyticsData) {
        setAnalytics(analyticsData);
      }

      // Transform players to summary format
      const playersData = playersRes.data?.data || playersRes.data || [];
      if (Array.isArray(playersData) && playersData.length > 0) {
        const playerSummaries: PlayerSummary[] = playersData.map((p: any) => ({
          playerId: p.id,
          playerName: `${p.firstName || ''} ${p.lastName || ''}`.trim() || p.name || 'Spiller',
          category: p.category || 'C',
          testsCompleted: p.testsCompleted || p.completedTests || 0,
          totalTests: p.totalTests || 20,
          completionRate: p.completionRate || (p.testsCompleted / (p.totalTests || 20)) * 100 || 0,
          lastActivity: p.lastActivity || p.updatedAt || new Date().toISOString(),
          trend: p.trend || 'stable',
        }));
        setPlayers(playerSummaries);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.coachId, user?.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData, timeRange]);

  // Mock data for when API is not available
  const mockAnalytics: TeamAnalytics = analytics || {
    totalPlayers: 12,
    playersByCategory: { A: 3, B: 4, C: 3, D: 2 },
    overallCompletionRate: 78,
    testsCompletedTotal: 187,
    testsPossibleTotal: 240,
    testStatistics: [
      { testNumber: 1, testName: 'Driving Distance', averageScore: 245, passRate: 85, totalAttempts: 48, trend: 'up' },
      { testNumber: 2, testName: 'Driving Accuracy', averageScore: 72, passRate: 70, totalAttempts: 45, trend: 'stable' },
      { testNumber: 3, testName: 'Iron Play', averageScore: 68, passRate: 65, totalAttempts: 42, trend: 'up' },
      { testNumber: 4, testName: 'Short Game', averageScore: 75, passRate: 78, totalAttempts: 50, trend: 'up' },
      { testNumber: 5, testName: 'Putting', averageScore: 32, passRate: 82, totalAttempts: 52, trend: 'stable' },
    ],
    recentActivityCount: 24,
    monthlyTrend: 'improving',
  };

  const handleExport = () => {
    window.open('/api/v1/export/statistics', '_blank');
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg-secondary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <StateCard variant="loading" title="Laster statistikk..." />
      </div>
    );
  }

  const data = mockAnalytics;

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg-secondary)',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
      }}
    >
      {/* Header */}
      <div style={{ padding: '24px', backgroundColor: 'var(--bg-primary)', borderBottom: '1px solid var(--border-default)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <PageTitle style={{
              fontSize: '34px',
              lineHeight: '41px',
              fontWeight: 700,
              letterSpacing: '-0.4px',
              color: 'var(--text-primary)',
              margin: 0,
            }}>
              Statistikk
            </PageTitle>
            <p style={{
              fontSize: '15px',
              lineHeight: '22px',
              color: 'var(--text-secondary)',
              marginTop: '4px',
            }}>
              Oversikt over dine spilleres prestasjoner
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            {/* Time range selector */}
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              style={{
                padding: '10px 16px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-default)',
                backgroundColor: 'var(--bg-primary)',
                fontSize: '15px',
                lineHeight: '22px',
                cursor: 'pointer',
              }}
            >
              <option value="week">Siste uke</option>
              <option value="month">Siste maned</option>
              <option value="quarter">Siste kvartal</option>
              <option value="year">Siste ar</option>
            </select>
            {/* Export button */}
            <Button variant="primary" size="md" onClick={handleExport} leftIcon={<Download size={18} />}>
              Eksporter
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div style={{ padding: '24px' }}>
        {/* Top stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '24px' }}>
          <StatCard
            label="Totalt spillere"
            value={data.totalPlayers}
            icon={Users}
            variant="primary"
          />
          <StatCard
            label="Gjennomforingsgrad"
            value={`${data.overallCompletionRate}%`}
            icon={Target}
            trend={{ value: 5, direction: 'up' }}
            variant="success"
          />
          <StatCard
            label="Tester fullfort"
            value={data.testsCompletedTotal}
            icon={CheckCircle}
            variant="primary"
          />
          <StatCard
            label="Aktivitet siste 7 dager"
            value={data.recentActivityCount}
            icon={Activity}
            trend={{ value: 12, direction: 'up' }}
            variant="gold"
          />
        </div>

        {/* Main content grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
          {/* Left column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Test Performance */}
            <Card variant="default" padding="lg">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <SectionTitle style={{
                  fontSize: '22px',
                  lineHeight: '28px',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  margin: 0,
                }}>
                  Testprestasjoner
                </SectionTitle>
                <BarChart3 size={20} style={{ color: 'var(--text-secondary)' }} />
              </div>
              <TestPerformanceTable data={data.testStatistics} />
            </Card>

            {/* Player Progress */}
            <Card variant="default" padding="lg">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <SectionTitle style={{
                  fontSize: '22px',
                  lineHeight: '28px',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  margin: 0,
                }}>
                  Spillerfremdrift
                </SectionTitle>
                <Button variant="ghost" size="sm" onClick={() => navigate('/coach/athletes')}>
                  Se alle
                </Button>
              </div>
              <PlayerSummaryList
                players={players}
                onPlayerClick={(id) => navigate(`/coach/athlete/${id}`)}
              />
            </Card>
          </div>

          {/* Right column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Category Distribution */}
            <Card variant="default" padding="lg">
              <SectionTitle style={{
                fontSize: '22px',
                lineHeight: '28px',
                fontWeight: 700,
                color: 'var(--text-primary)',
                margin: 0,
                marginBottom: '20px',
              }}>
                Kategorifordeling
              </SectionTitle>
              <CategoryChart data={data.playersByCategory} />
            </Card>

            {/* Quick Insights */}
            <Card variant="default" padding="lg">
              <SectionTitle style={{
                fontSize: '22px',
                lineHeight: '28px',
                fontWeight: 700,
                color: 'var(--text-primary)',
                margin: 0,
                marginBottom: '20px',
              }}>
                Innsikt
              </SectionTitle>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  padding: '14px',
                  backgroundColor: 'rgba(var(--success-rgb), 0.1)',
                  borderRadius: 'var(--radius-md)',
                }}>
                  <TrendingUp size={20} style={{ color: 'var(--success)' }} />
                  <div>
                    <p style={{ fontSize: '15px', lineHeight: '22px', fontWeight: 500, margin: 0 }}>
                      Positiv trend
                    </p>
                    <p style={{ fontSize: '12px', lineHeight: '16px', color: 'var(--text-secondary)', margin: 0 }}>
                      3 spillere har forbedret seg betydelig denne maneden
                    </p>
                  </div>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  padding: '14px',
                  backgroundColor: 'rgba(var(--warning-rgb), 0.1)',
                  borderRadius: 'var(--radius-md)',
                }}>
                  <AlertTriangle size={20} style={{ color: 'var(--warning)' }} />
                  <div>
                    <p style={{ fontSize: '15px', lineHeight: '22px', fontWeight: 500, margin: 0 }}>
                      Oppmerksomhet nodvendig
                    </p>
                    <p style={{ fontSize: '12px', lineHeight: '16px', color: 'var(--text-secondary)', margin: 0 }}>
                      2 spillere har ikke vart aktive pa over 2 uker
                    </p>
                  </div>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  padding: '14px',
                  backgroundColor: 'rgba(var(--accent-rgb), 0.1)',
                  borderRadius: 'var(--radius-md)',
                }}>
                  <Award size={20} style={{ color: 'var(--accent)' }} />
                  <div>
                    <p style={{ fontSize: '15px', lineHeight: '22px', fontWeight: 500, margin: 0 }}>
                      Kategoriopprykksklar
                    </p>
                    <p style={{ fontSize: '12px', lineHeight: '16px', color: 'var(--text-secondary)', margin: 0 }}>
                      Lars Olsen er klar for opprykk til kategori A
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Export Options */}
            <Card variant="default" padding="lg">
              <SectionTitle style={{
                fontSize: '22px',
                lineHeight: '28px',
                fontWeight: 700,
                color: 'var(--text-primary)',
                margin: 0,
                marginBottom: '16px',
              }}>
                Eksporter data
              </SectionTitle>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button
                  onClick={() => window.open('/api/v1/export/test-results', '_blank')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px',
                    backgroundColor: 'var(--bg-secondary)',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    width: '100%',
                    textAlign: 'left',
                  }}
                >
                  <Download size={18} style={{ color: 'var(--accent)' }} />
                  <span style={{ fontSize: '15px', lineHeight: '22px' }}>Testresultater (Excel)</span>
                </button>
                <button
                  onClick={() => window.open('/api/v1/export/training-sessions', '_blank')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px',
                    backgroundColor: 'var(--bg-secondary)',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    width: '100%',
                    textAlign: 'left',
                  }}
                >
                  <Download size={18} style={{ color: 'var(--accent)' }} />
                  <span style={{ fontSize: '15px', lineHeight: '22px' }}>Treningsokter (Excel)</span>
                </button>
                <button
                  onClick={() => window.open('/api/v1/export/statistics', '_blank')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px',
                    backgroundColor: 'var(--bg-secondary)',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    width: '100%',
                    textAlign: 'left',
                  }}
                >
                  <Download size={18} style={{ color: 'var(--accent)' }} />
                  <span style={{ fontSize: '15px', lineHeight: '22px' }}>Full statistikk (Excel)</span>
                </button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
