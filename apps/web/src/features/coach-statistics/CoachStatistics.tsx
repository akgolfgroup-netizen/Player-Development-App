/**
 * AK Golf Academy - Coach Statistics Dashboard
 * Comprehensive analytics and statistics view for coaches
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart3, TrendingUp, TrendingDown, Users, Target,
  Award, Calendar, Download, Filter, RefreshCw, ChevronDown,
  Activity, CheckCircle, XCircle, AlertTriangle
} from 'lucide-react';
import { tokens } from '../../design-tokens';
import { useAuth } from '../../contexts/AuthContext';

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

// Helpers
const typography = tokens.typography;

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div
    style={{
      backgroundColor: tokens.colors.white,
      borderRadius: tokens.borderRadius.lg,
      boxShadow: tokens.shadows.card,
    }}
    className={className}
  >
    {children}
  </div>
);

const StatCard: React.FC<{
  label: string;
  value: string | number;
  icon: React.ElementType;
  trend?: { value: number; direction: 'up' | 'down' };
  color?: string;
}> = ({ label, value, icon: Icon, trend, color = tokens.colors.primary }) => (
  <Card>
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ ...typography.caption, color: tokens.colors.steel, marginBottom: '8px' }}>
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
              color: trend.direction === 'up' ? tokens.colors.success : tokens.colors.error,
            }}>
              {trend.direction === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              <span style={{ ...typography.small, fontWeight: 500 }}>
                {trend.value}% fra forrige maned
              </span>
            </div>
          )}
        </div>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: tokens.borderRadius.md,
            backgroundColor: `${color}15`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon size={24} color={color} />
        </div>
      </div>
    </div>
  </Card>
);

// Progress bar component
const ProgressBar: React.FC<{ value: number; max?: number; color?: string }> = ({
  value,
  max = 100,
  color = tokens.colors.primary,
}) => (
  <div
    style={{
      width: '100%',
      height: '8px',
      backgroundColor: tokens.colors.mist,
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
      A: tokens.colors.primary,
      B: tokens.colors.primaryLight,
      C: tokens.colors.success,
      D: tokens.colors.gold,
      E: '#FF9800',
      F: '#FF5722',
    };
    return colors[cat] || tokens.colors.steel;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {categories.map(([category, count]) => {
        const countNum = count as number;
        return (
        <div key={category}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ ...typography.body, fontWeight: 500 }}>Kategori {category}</span>
            <span style={{ ...typography.body, color: tokens.colors.steel }}>{countNum} spillere</span>
          </div>
          <div
            style={{
              width: '100%',
              height: '24px',
              backgroundColor: tokens.colors.snow,
              borderRadius: tokens.borderRadius.sm,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${(countNum / maxValue) * 100}%`,
                height: '100%',
                backgroundColor: getCategoryColor(category),
                borderRadius: tokens.borderRadius.sm,
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
        return <TrendingUp size={16} color={tokens.colors.success} />;
      case 'down':
        return <TrendingDown size={16} color={tokens.colors.error} />;
      default:
        return <Activity size={16} color={tokens.colors.steel} />;
    }
  };

  const getPassRateColor = (rate: number) => {
    if (rate >= 80) return tokens.colors.success;
    if (rate >= 60) return tokens.colors.warning;
    return tokens.colors.error;
  };

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: `1px solid ${tokens.colors.mist}` }}>
            <th style={{ padding: '12px', textAlign: 'left', ...typography.caption, color: tokens.colors.steel }}>
              Test
            </th>
            <th style={{ padding: '12px', textAlign: 'center', ...typography.caption, color: tokens.colors.steel }}>
              Gjennomsnitt
            </th>
            <th style={{ padding: '12px', textAlign: 'center', ...typography.caption, color: tokens.colors.steel }}>
              Bestattprosent
            </th>
            <th style={{ padding: '12px', textAlign: 'center', ...typography.caption, color: tokens.colors.steel }}>
              Antall forsok
            </th>
            <th style={{ padding: '12px', textAlign: 'center', ...typography.caption, color: tokens.colors.steel }}>
              Trend
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((test) => (
            <tr
              key={test.testNumber}
              style={{ borderBottom: `1px solid ${tokens.colors.snow}` }}
            >
              <td style={{ padding: '14px 12px' }}>
                <div>
                  <p style={{ ...typography.body, fontWeight: 500, margin: 0 }}>
                    Test {test.testNumber}
                  </p>
                  <p style={{ ...typography.small, color: tokens.colors.steel, margin: 0 }}>
                    {test.testName}
                  </p>
                </div>
              </td>
              <td style={{ padding: '14px 12px', textAlign: 'center' }}>
                <span style={{ ...typography.body, fontWeight: 600 }}>
                  {test.averageScore.toFixed(1)}
                </span>
              </td>
              <td style={{ padding: '14px 12px', textAlign: 'center' }}>
                <span
                  style={{
                    ...typography.body,
                    fontWeight: 600,
                    color: getPassRateColor(test.passRate),
                  }}
                >
                  {test.passRate.toFixed(0)}%
                </span>
              </td>
              <td style={{ padding: '14px 12px', textAlign: 'center' }}>
                <span style={{ ...typography.body }}>{test.totalAttempts}</span>
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
        return <TrendingUp size={16} color={tokens.colors.success} />;
      case 'declining':
        return <TrendingDown size={16} color={tokens.colors.error} />;
      default:
        return <Activity size={16} color={tokens.colors.steel} />;
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
            borderBottom: `1px solid ${tokens.colors.snow}`,
            cursor: 'pointer',
          }}
        >
          <div style={{ flex: 1 }}>
            <p style={{ ...typography.body, fontWeight: 500, margin: 0 }}>
              {player.playerName}
            </p>
            <p style={{ ...typography.small, color: tokens.colors.steel, margin: 0 }}>
              Kategori {player.category}
            </p>
          </div>
          <div style={{ width: '120px', marginRight: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ ...typography.small, color: tokens.colors.steel }}>
                {player.testsCompleted}/{player.totalTests}
              </span>
              <span style={{ ...typography.small, fontWeight: 500 }}>
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
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch team analytics
        const analyticsRes = await fetch(`/api/v1/coach-analytics/team/${user?.coachId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        if (analyticsRes.ok) {
          const { data } = await analyticsRes.json();
          setAnalytics(data);
        }

        // For now, use mock player data
        setPlayers([
          { playerId: '1', playerName: 'Anders Hansen', category: 'A', testsCompleted: 18, totalTests: 20, completionRate: 90, lastActivity: '2025-12-20', trend: 'improving' },
          { playerId: '2', playerName: 'Erik Johansen', category: 'B', testsCompleted: 15, totalTests: 20, completionRate: 75, lastActivity: '2025-12-19', trend: 'stable' },
          { playerId: '3', playerName: 'Lars Olsen', category: 'A', testsCompleted: 20, totalTests: 20, completionRate: 100, lastActivity: '2025-12-21', trend: 'improving' },
          { playerId: '4', playerName: 'Mikkel Pedersen', category: 'C', testsCompleted: 12, totalTests: 20, completionRate: 60, lastActivity: '2025-12-18', trend: 'declining' },
          { playerId: '5', playerName: 'Sofie Andersen', category: 'B', testsCompleted: 16, totalTests: 20, completionRate: 80, lastActivity: '2025-12-20', trend: 'improving' },
        ]);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.coachId, timeRange]);

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
        backgroundColor: tokens.colors.snow,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <RefreshCw size={32} color={tokens.colors.primary} style={{ animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  const data = mockAnalytics;

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: tokens.colors.snow,
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
      }}
    >
      {/* Header */}
      <div style={{ padding: '24px', backgroundColor: tokens.colors.white, borderBottom: `1px solid ${tokens.colors.mist}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ ...typography.largeTitle, color: tokens.colors.charcoal, margin: 0 }}>
              Statistikk
            </h1>
            <p style={{ ...typography.body, color: tokens.colors.steel, marginTop: '4px' }}>
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
                borderRadius: tokens.borderRadius.md,
                border: `1px solid ${tokens.colors.mist}`,
                backgroundColor: tokens.colors.white,
                ...typography.body,
                cursor: 'pointer',
              }}
            >
              <option value="week">Siste uke</option>
              <option value="month">Siste maned</option>
              <option value="quarter">Siste kvartal</option>
              <option value="year">Siste ar</option>
            </select>
            {/* Export button */}
            <button
              onClick={handleExport}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                backgroundColor: tokens.colors.primary,
                color: tokens.colors.white,
                border: 'none',
                borderRadius: tokens.borderRadius.md,
                cursor: 'pointer',
                ...typography.body,
                fontWeight: 500,
              }}
            >
              <Download size={18} />
              Eksporter
            </button>
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
            color={tokens.colors.primary}
          />
          <StatCard
            label="Gjennomforingsgrad"
            value={`${data.overallCompletionRate}%`}
            icon={Target}
            trend={{ value: 5, direction: 'up' }}
            color={tokens.colors.success}
          />
          <StatCard
            label="Tester fullfort"
            value={data.testsCompletedTotal}
            icon={CheckCircle}
            color={tokens.colors.primaryLight}
          />
          <StatCard
            label="Aktivitet siste 7 dager"
            value={data.recentActivityCount}
            icon={Activity}
            trend={{ value: 12, direction: 'up' }}
            color={tokens.colors.gold}
          />
        </div>

        {/* Main content grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
          {/* Left column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Test Performance */}
            <Card>
              <div style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h2 style={{ ...typography.title2, color: tokens.colors.charcoal, margin: 0 }}>
                    Testprestasjoner
                  </h2>
                  <BarChart3 size={20} color={tokens.colors.steel} />
                </div>
                <TestPerformanceTable data={data.testStatistics} />
              </div>
            </Card>

            {/* Player Progress */}
            <Card>
              <div style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h2 style={{ ...typography.title2, color: tokens.colors.charcoal, margin: 0 }}>
                    Spillerfremdrift
                  </h2>
                  <button
                    onClick={() => navigate('/coach/athletes')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: tokens.colors.primary,
                      cursor: 'pointer',
                      ...typography.caption,
                      fontWeight: 500,
                    }}
                  >
                    Se alle
                  </button>
                </div>
                <PlayerSummaryList
                  players={players}
                  onPlayerClick={(id) => navigate(`/coach/athlete/${id}`)}
                />
              </div>
            </Card>
          </div>

          {/* Right column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Category Distribution */}
            <Card>
              <div style={{ padding: '20px' }}>
                <h2 style={{ ...typography.title2, color: tokens.colors.charcoal, margin: 0, marginBottom: '20px' }}>
                  Kategorifordeling
                </h2>
                <CategoryChart data={data.playersByCategory} />
              </div>
            </Card>

            {/* Quick Insights */}
            <Card>
              <div style={{ padding: '20px' }}>
                <h2 style={{ ...typography.title2, color: tokens.colors.charcoal, margin: 0, marginBottom: '20px' }}>
                  Innsikt
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '14px',
                    backgroundColor: `${tokens.colors.success}10`,
                    borderRadius: tokens.borderRadius.md,
                  }}>
                    <TrendingUp size={20} color={tokens.colors.success} />
                    <div>
                      <p style={{ ...typography.body, fontWeight: 500, margin: 0 }}>
                        Positiv trend
                      </p>
                      <p style={{ ...typography.small, color: tokens.colors.steel, margin: 0 }}>
                        3 spillere har forbedret seg betydelig denne maneden
                      </p>
                    </div>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '14px',
                    backgroundColor: `${tokens.colors.warning}10`,
                    borderRadius: tokens.borderRadius.md,
                  }}>
                    <AlertTriangle size={20} color={tokens.colors.warning} />
                    <div>
                      <p style={{ ...typography.body, fontWeight: 500, margin: 0 }}>
                        Oppmerksomhet nodvendig
                      </p>
                      <p style={{ ...typography.small, color: tokens.colors.steel, margin: 0 }}>
                        2 spillere har ikke vart aktive pa over 2 uker
                      </p>
                    </div>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '14px',
                    backgroundColor: `${tokens.colors.primary}10`,
                    borderRadius: tokens.borderRadius.md,
                  }}>
                    <Award size={20} color={tokens.colors.primary} />
                    <div>
                      <p style={{ ...typography.body, fontWeight: 500, margin: 0 }}>
                        Kategoriopprykksklar
                      </p>
                      <p style={{ ...typography.small, color: tokens.colors.steel, margin: 0 }}>
                        Lars Olsen er klar for opprykk til kategori A
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Export Options */}
            <Card>
              <div style={{ padding: '20px' }}>
                <h2 style={{ ...typography.title2, color: tokens.colors.charcoal, margin: 0, marginBottom: '16px' }}>
                  Eksporter data
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <button
                    onClick={() => window.open('/api/v1/export/test-results', '_blank')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px',
                      backgroundColor: tokens.colors.snow,
                      border: 'none',
                      borderRadius: tokens.borderRadius.md,
                      cursor: 'pointer',
                      width: '100%',
                      textAlign: 'left',
                    }}
                  >
                    <Download size={18} color={tokens.colors.primary} />
                    <span style={{ ...typography.body }}>Testresultater (Excel)</span>
                  </button>
                  <button
                    onClick={() => window.open('/api/v1/export/training-sessions', '_blank')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px',
                      backgroundColor: tokens.colors.snow,
                      border: 'none',
                      borderRadius: tokens.borderRadius.md,
                      cursor: 'pointer',
                      width: '100%',
                      textAlign: 'left',
                    }}
                  >
                    <Download size={18} color={tokens.colors.primary} />
                    <span style={{ ...typography.body }}>Treningsokter (Excel)</span>
                  </button>
                  <button
                    onClick={() => window.open('/api/v1/export/statistics', '_blank')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px',
                      backgroundColor: tokens.colors.snow,
                      border: 'none',
                      borderRadius: tokens.borderRadius.md,
                      cursor: 'pointer',
                      width: '100%',
                      textAlign: 'left',
                    }}
                  >
                    <Download size={18} color={tokens.colors.primary} />
                    <span style={{ ...typography.body }}>Full statistikk (Excel)</span>
                  </button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
