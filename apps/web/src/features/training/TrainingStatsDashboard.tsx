/**
 * TIER Golf - Training Statistics Dashboard
 * Design System v3.0 - Premium Light
 *
 * Comprehensive training analytics dashboard with DataGolf integration.
 * Uses trainingStatsAPI for weekly/monthly statistics.
 * Uses DataGolf API for Strokes Gained performance metrics.
 */

import React, { useState, useEffect } from 'react';
import { TrendingUp, Calendar, Target, Award, BarChart3, Activity, TrendingDown } from 'lucide-react';
import { Page } from '../../ui/components/Page';
import { Text } from '../../ui/primitives';
import Button from '../../ui/primitives/Button';
import apiClient from '../../services/apiClient';
import { useStrokesGained } from '../../hooks/useStrokesGained';
import { useAuth } from '../../contexts/AuthContext';

// ============================================================================
// TYPES
// ============================================================================

interface TrainingStats {
  totalSessions: number;
  totalHours: number;
  avgQuality: number;
  completionRate: number;
  sessionChange?: number;
  hoursChange?: number;
  weeklyHours?: number;
  weeklyGoal?: number;
  categoryBreakdown?: Array<{ category: string; hours: number }>;
  recentSessions?: Array<{
    id: string;
    date: string;
    duration: number;
    category: string;
    quality: number;
    notes?: string;
  }>;
}

// ============================================================================
// COMPONENT
// ============================================================================

export default function TrainingStatsDashboard() {
  const { user } = useAuth();
  const [timeframe, setTimeframe] = useState<'week' | 'month'>('week');
  const [stats, setStats] = useState<TrainingStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch DataGolf Strokes Gained data
  const {
    data: sgData,
    loading: sgLoading,
    error: sgError,
  } = useStrokesGained(user?.playerId);

  // Fetch training statistics
  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const endpoint =
        timeframe === 'week'
          ? '/api/v1/training-stats/weekly'
          : '/api/v1/training-stats/monthly';

      const response = await apiClient.get(endpoint);
      setStats(response.data.data || response.data);
    } catch (err) {
      console.error('Failed to fetch training stats:', err);
      setError('Kunne ikke laste treningsstatistikk');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [timeframe]);

  // Helper functions for Strokes Gained display
  const formatSG = (value: number | null | undefined) => {
    if (value === null || value === undefined) return '-';
    if (value > 0) return `+${value.toFixed(2)}`;
    return value.toFixed(2);
  };

  const getSGColor = (value: number | null | undefined) => {
    if (value === null || value === undefined) return 'text-tier-text-tertiary';
    if (value > 0) return 'text-green-600';
    if (value < 0) return 'text-red-600';
    return 'text-tier-text-secondary';
  };

  const getTrendIcon = (trend: number) => {
    if (trend > 0) return <TrendingUp size={16} className="text-green-600" />;
    if (trend < 0) return <TrendingDown size={16} className="text-red-600" />;
    return <Activity size={16} className="text-tier-text-tertiary" />;
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'approach':
        return 'Approach';
      case 'around_green':
        return 'Rundt green';
      case 'putting':
        return 'Putting';
      default:
        return category;
    }
  };

  // Calculate progress percentage
  const progressPercentage = stats?.weeklyGoal
    ? Math.min(100, ((stats.weeklyHours || 0) / stats.weeklyGoal) * 100)
    : 0;

  // Determine page state
  const pageState = loading ? 'loading' : error ? 'error' : 'idle';

  return (
    <Page state={pageState} maxWidth="xl">
      <Page.Header
        title="Treningsstatistikk"
        subtitle="Oversikt over dine treningstimer og fremgang"
        helpText="Komplett oversikt over treningsstatistikk med ukentlige og månedlige rapporter. Se totale timer, øktkvalitet, fullføringsgrad og kategorifordeling. Spor fremgang mot ukentlige mål med DataGolf Strokes Gained-analyse. Filtrer på uke eller måned for detaljert innsikt."
        actions={
          <div className="flex gap-2">
            <Button
              variant={timeframe === 'week' ? 'primary' : 'outline'}
              onClick={() => setTimeframe('week')}
            >
              Denne uken
            </Button>
            <Button
              variant={timeframe === 'month' ? 'primary' : 'outline'}
              onClick={() => setTimeframe('month')}
            >
              Denne måneden
            </Button>
          </div>
        }
      />

      <Page.Content>
        {error ? (
          <div className="text-center py-12">
            <Text variant="body" color="secondary">
              {error}
            </Text>
            <Button onClick={fetchStats} variant="primary" className="mt-4">
              Prøv igjen
            </Button>
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="bg-tier-white border border-tier-border-default rounded-xl p-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-tier-navy/10 flex items-center justify-center">
                    <Calendar size={20} className="text-tier-navy" />
                  </div>
                  <Text variant="caption1" color="secondary">
                    Totalt økter
                  </Text>
                </div>
                <Text className="text-3xl font-bold text-tier-navy">
                  {stats?.totalSessions || 0}
                </Text>
                {stats?.sessionChange !== undefined && (
                  <Text
                    variant="caption1"
                    className={
                      stats.sessionChange >= 0
                        ? 'text-green-600 mt-1'
                        : 'text-red-600 mt-1'
                    }
                  >
                    {stats.sessionChange >= 0 ? '+' : ''}
                    {stats.sessionChange}% fra forrige periode
                  </Text>
                )}
              </div>

              <div className="bg-tier-white border border-tier-border-default rounded-xl p-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-tier-navy/10 flex items-center justify-center">
                    <TrendingUp size={20} className="text-tier-navy" />
                  </div>
                  <Text variant="caption1" color="secondary">
                    Totalt timer
                  </Text>
                </div>
                <Text className="text-3xl font-bold text-tier-navy">
                  {stats?.totalHours || 0}
                </Text>
                {stats?.hoursChange !== undefined && (
                  <Text
                    variant="caption1"
                    className={
                      stats.hoursChange >= 0
                        ? 'text-green-600 mt-1'
                        : 'text-red-600 mt-1'
                    }
                  >
                    {stats.hoursChange >= 0 ? '+' : ''}
                    {stats.hoursChange}% fra forrige periode
                  </Text>
                )}
              </div>

              <div className="bg-tier-white border border-tier-border-default rounded-xl p-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-tier-navy/10 flex items-center justify-center">
                    <Award size={20} className="text-tier-navy" />
                  </div>
                  <Text variant="caption1" color="secondary">
                    Gjennomsnitt kvalitet
                  </Text>
                </div>
                <Text className="text-3xl font-bold text-tier-navy">
                  {stats?.avgQuality?.toFixed(1) || '0.0'}
                  <span className="text-lg text-tier-text-secondary">/10</span>
                </Text>
              </div>

              <div className="bg-tier-white border border-tier-border-default rounded-xl p-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-tier-navy/10 flex items-center justify-center">
                    <Target size={20} className="text-tier-navy" />
                  </div>
                  <Text variant="caption1" color="secondary">
                    Gjennomføringsrate
                  </Text>
                </div>
                <Text className="text-3xl font-bold text-tier-navy">
                  {stats?.completionRate || 0}
                  <span className="text-lg text-tier-text-secondary">%</span>
                </Text>
              </div>
            </div>

            {/* DataGolf Strokes Gained Section */}
            {sgData && sgData.hasData && (
              <div className="bg-gradient-to-br from-tier-navy to-tier-navy/90 border border-tier-border-default rounded-xl p-6 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-tier-gold/20 flex items-center justify-center">
                    <BarChart3 size={24} className="text-tier-gold" />
                  </div>
                  <div>
                    <Text className="font-semibold text-white mb-1">
                      Spillprestasjon (DataGolf)
                    </Text>
                    <Text variant="caption1" className="text-tier-gold/80">
                      Strokes Gained fra testresultater
                    </Text>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4 mt-4">
                  {/* Total SG */}
                  <div className="bg-tier-white/10 backdrop-blur-sm rounded-lg p-4">
                    <Text variant="caption1" className="text-tier-gold/80 mb-2">
                      Total SG
                    </Text>
                    <Text className={`text-2xl font-bold ${getSGColor(sgData.total)} !text-white`}>
                      {formatSG(sgData.total)}
                    </Text>
                    <div className="flex items-center gap-1 mt-1">
                      {getTrendIcon(sgData.trend || 0)}
                      <Text variant="caption1" className="text-tier-gold/60">
                        {formatSG(sgData.trend)} siste uke
                      </Text>
                    </div>
                  </div>

                  {/* Approach */}
                  <div className="bg-tier-white/10 backdrop-blur-sm rounded-lg p-4">
                    <Text variant="caption1" className="text-tier-gold/80 mb-2">
                      {getCategoryLabel('approach')}
                    </Text>
                    <Text className={`text-2xl font-bold ${getSGColor(sgData.byCategory?.approach?.value)} !text-white`}>
                      {formatSG(sgData.byCategory?.approach?.value)}
                    </Text>
                    <Text variant="caption1" className="text-tier-gold/60 mt-1">
                      {sgData.byCategory?.approach?.testCount || 0} tester
                    </Text>
                  </div>

                  {/* Around Green */}
                  <div className="bg-tier-white/10 backdrop-blur-sm rounded-lg p-4">
                    <Text variant="caption1" className="text-tier-gold/80 mb-2">
                      {getCategoryLabel('around_green')}
                    </Text>
                    <Text className={`text-2xl font-bold ${getSGColor(sgData.byCategory?.around_green?.value)} !text-white`}>
                      {formatSG(sgData.byCategory?.around_green?.value)}
                    </Text>
                    <Text variant="caption1" className="text-tier-gold/60 mt-1">
                      {sgData.byCategory?.around_green?.testCount || 0} tester
                    </Text>
                  </div>

                  {/* Putting */}
                  <div className="bg-tier-white/10 backdrop-blur-sm rounded-lg p-4">
                    <Text variant="caption1" className="text-tier-gold/80 mb-2">
                      {getCategoryLabel('putting')}
                    </Text>
                    <Text className={`text-2xl font-bold ${getSGColor(sgData.byCategory?.putting?.value)} !text-white`}>
                      {formatSG(sgData.byCategory?.putting?.value)}
                    </Text>
                    <Text variant="caption1" className="text-tier-gold/60 mt-1">
                      {sgData.byCategory?.putting?.testCount || 0} tester
                    </Text>
                  </div>
                </div>

                {sgData.isDemo && (
                  <div className="mt-4 p-3 bg-tier-gold/20 rounded-lg border border-tier-gold/30">
                    <Text variant="caption1" className="text-tier-gold">
                      Merk: Dette er demodata. Fullfør tester for å se dine egne Strokes Gained resultater.
                    </Text>
                  </div>
                )}
              </div>
            )}

            {/* Weekly Goal Progress */}
            {stats?.weeklyGoal && (
              <div className="bg-tier-white border border-tier-border-default rounded-xl p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <Text className="font-semibold text-tier-navy mb-1">
                      Ukentlig treningsmål
                    </Text>
                    <Text variant="caption1" color="secondary">
                      {stats.weeklyHours || 0} av {stats.weeklyGoal} timer
                    </Text>
                  </div>
                  <Text className="text-2xl font-bold text-tier-navy">
                    {Math.round(progressPercentage)}%
                  </Text>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-4 bg-tier-surface-base rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-tier-navy to-tier-gold transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>
            )}

            {/* Category Breakdown */}
            {stats?.categoryBreakdown && stats.categoryBreakdown.length > 0 && (
              <div className="bg-tier-white border border-tier-border-default rounded-xl p-6 mb-6">
                <Text className="font-semibold text-tier-navy mb-4">
                  Trening per kategori
                </Text>
                <div className="space-y-3">
                  {stats.categoryBreakdown.map((cat, index) => {
                    const total = stats.totalHours || 1;
                    const percentage = (cat.hours / total) * 100;
                    return (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-1">
                          <Text variant="body" className="text-tier-navy">
                            {cat.category}
                          </Text>
                          <Text variant="caption1" color="secondary">
                            {cat.hours}t ({percentage.toFixed(0)}%)
                          </Text>
                        </div>
                        <div className="w-full h-2 bg-tier-surface-base rounded-full overflow-hidden">
                          <div
                            className="h-full bg-tier-navy transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Recent Sessions */}
            {stats?.recentSessions && stats.recentSessions.length > 0 && (
              <div className="bg-tier-white border border-tier-border-default rounded-xl p-6">
                <Text className="font-semibold text-tier-navy mb-4">
                  Siste treningsøkter
                </Text>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-tier-border-default">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-tier-navy">
                          Dato
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-tier-navy">
                          Kategori
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-tier-navy">
                          Varighet
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-tier-navy">
                          Kvalitet
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-tier-navy">
                          Notater
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recentSessions.map((session) => (
                        <tr
                          key={session.id}
                          className="border-b border-tier-border-default hover:bg-tier-surface-base transition-colors"
                        >
                          <td className="py-3 px-4">
                            <Text variant="body" className="text-tier-navy">
                              {new Date(session.date).toLocaleDateString('no-NO')}
                            </Text>
                          </td>
                          <td className="py-3 px-4">
                            <span className="inline-block px-3 py-1 bg-tier-navy/10 text-tier-navy rounded-full text-sm">
                              {session.category}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <Text variant="body" className="text-tier-navy">
                              {session.duration}t
                            </Text>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <div className="w-full max-w-[100px] h-2 bg-tier-surface-base rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-tier-gold transition-all"
                                  style={{ width: `${(session.quality / 10) * 100}%` }}
                                />
                              </div>
                              <Text variant="caption1" color="secondary">
                                {session.quality}/10
                              </Text>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <Text variant="caption1" color="secondary" className="line-clamp-1">
                              {session.notes || '-'}
                            </Text>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </Page.Content>
    </Page>
  );
}
