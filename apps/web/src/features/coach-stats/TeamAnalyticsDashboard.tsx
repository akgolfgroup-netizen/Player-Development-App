import React, { useState, useEffect } from 'react';
import { analyticsAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../components/shadcn/use-toast';
import Card from '../../ui/primitives/Card';
import StateCard from '../../ui/composites/StateCard';
import StatsGridTemplate from '../../ui/templates/StatsGridTemplate';
import { PageTitle, SectionTitle, SubSectionTitle } from '../../components/typography';
import { Users, TrendingUp, Target, Award, BarChart3, Activity } from 'lucide-react';

interface TeamAnalytics {
  summary: {
    totalPlayers: number;
    activePlayers: number;
    averageCategory: string;
    averageHandicap: number;
    sessionsThisMonth: number;
    testsThisMonth: number;
  };
  categoryDistribution: Record<string, number>;
  progressMetrics: {
    improvedPlayers: number;
    stalledPlayers: number;
    newBreakingPoints: number;
    resolvedBreakingPoints: number;
  };
  topPerformers: Array<{
    id: string;
    name: string;
    category: string;
    improvement: number;
  }>;
  needsAttention: Array<{
    id: string;
    name: string;
    reason: string;
    daysInactive: number;
  }>;
}

export const TeamAnalyticsDashboard: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [analytics, setAnalytics] = useState<TeamAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!user?.id) return;

      try {
        const response = await analyticsAPI.getTeamAnalytics(user.id);
        setAnalytics(response.data.data as unknown as TeamAnalytics);
      } catch (error) {
        toast({ title: 'Feil', description: 'Kunne ikke hente team-analyse', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [user?.id]);

  if (loading) {
    return (
      <div className="p-6">
        <StateCard variant="loading" title="Laster team-analyse..." />
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="p-6">
        <StateCard variant="empty" title="Ingen data tilgjengelig" description="Kunne ikke laste team-analyse" />
      </div>
    );
  }

  const categoryColors: Record<string, string> = {
    A: 'bg-ak-success',
    B: 'bg-ak-primary',
    C: 'bg-ak-warning',
    D: 'bg-ak-text-secondary',
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <PageTitle>Team-analyse</PageTitle>
        <p className="text-ak-text-secondary mt-1">Oversikt over lagets prestasjoner og fremgang</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
        <Card variant="default" padding="md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-ak-primary/10 flex items-center justify-center">
              <Users size={20} className="text-ak-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-ak-text-primary">{analytics.summary.totalPlayers}</p>
              <p className="text-xs text-ak-text-secondary">Totalt spillere</p>
            </div>
          </div>
        </Card>
        <Card variant="default" padding="md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-ak-success/10 flex items-center justify-center">
              <Activity size={20} className="text-ak-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-ak-text-primary">{analytics.summary.activePlayers}</p>
              <p className="text-xs text-ak-text-secondary">Aktive</p>
            </div>
          </div>
        </Card>
        <Card variant="default" padding="md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-ak-warning/10 flex items-center justify-center">
              <Target size={20} className="text-ak-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-ak-text-primary">{analytics.summary.averageHandicap?.toFixed(1) || '-'}</p>
              <p className="text-xs text-ak-text-secondary">Snitt HCP</p>
            </div>
          </div>
        </Card>
        <Card variant="default" padding="md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-ak-primary/10 flex items-center justify-center">
              <BarChart3 size={20} className="text-ak-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-ak-text-primary">{analytics.summary.sessionsThisMonth}</p>
              <p className="text-xs text-ak-text-secondary">Okter/mnd</p>
            </div>
          </div>
        </Card>
        <Card variant="default" padding="md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-ak-success/10 flex items-center justify-center">
              <TrendingUp size={20} className="text-ak-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-ak-text-primary">{analytics.progressMetrics.improvedPlayers}</p>
              <p className="text-xs text-ak-text-secondary">Forbedret</p>
            </div>
          </div>
        </Card>
        <Card variant="default" padding="md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-ak-error/10 flex items-center justify-center">
              <Award size={20} className="text-ak-error" />
            </div>
            <div>
              <p className="text-2xl font-bold text-ak-text-primary">{analytics.progressMetrics.stalledPlayers}</p>
              <p className="text-xs text-ak-text-secondary">Stagnert</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <Card variant="default" padding="lg">
          <SectionTitle className="mb-4">Kategorifordeling</SectionTitle>
          <div className="space-y-3">
            {Object.entries(analytics.categoryDistribution || {}).map(([category, count]) => {
              const total = Object.values(analytics.categoryDistribution || {}).reduce((a, b) => a + b, 0);
              const percentage = total > 0 ? (count / total) * 100 : 0;
              return (
                <div key={category}>
                  <div className="flex justify-between mb-1">
                    <span className="font-medium text-ak-text-primary">Kategori {category}</span>
                    <span className="text-ak-text-secondary">{count} spillere ({percentage.toFixed(0)}%)</span>
                  </div>
                  <div className="h-3 bg-ak-surface-subtle rounded-full overflow-hidden">
                    <div
                      className={`h-full ${categoryColors[category] || 'bg-ak-primary'} rounded-full transition-all`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Breaking Points Progress */}
        <Card variant="default" padding="lg">
          <SectionTitle className="mb-4">Breaking Points</SectionTitle>
          <StatsGridTemplate
            items={[
              { id: 'new', label: 'Nye identifisert', value: analytics.progressMetrics.newBreakingPoints.toString() },
              { id: 'resolved', label: 'Løst', value: analytics.progressMetrics.resolvedBreakingPoints.toString() },
              { id: 'improved', label: 'Spillere forbedret', value: analytics.progressMetrics.improvedPlayers.toString() },
              { id: 'stalled', label: 'Trenger oppfølging', value: analytics.progressMetrics.stalledPlayers.toString() },
            ]}
            columns={2}
          />
        </Card>

        {/* Top Performers */}
        <Card variant="default" padding="lg">
          <SectionTitle className="mb-4">Topp prestasjoner</SectionTitle>
          {analytics.topPerformers?.length > 0 ? (
            <div className="space-y-3">
              {analytics.topPerformers.slice(0, 5).map((player, index) => (
                <div key={player.id} className="flex items-center gap-3 p-3 bg-ak-surface-subtle rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-ak-success text-white flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-ak-text-primary">{player.name}</p>
                    <p className="text-xs text-ak-text-secondary">Kat. {player.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-ak-success">+{player.improvement.toFixed(1)}%</p>
                    <p className="text-xs text-ak-text-secondary">forbedring</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-ak-text-secondary text-center py-4">Ingen data enna</p>
          )}
        </Card>

        {/* Needs Attention */}
        <Card variant="default" padding="lg">
          <SectionTitle className="mb-4">Trenger oppfølging</SectionTitle>
          {analytics.needsAttention?.length > 0 ? (
            <div className="space-y-3">
              {analytics.needsAttention.slice(0, 5).map(player => (
                <div key={player.id} className="flex items-center gap-3 p-3 bg-ak-error/5 rounded-lg border-l-3 border-ak-error">
                  <div className="flex-1">
                    <p className="font-medium text-ak-text-primary">{player.name}</p>
                    <p className="text-xs text-ak-text-secondary">{player.reason}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-ak-error">{player.daysInactive} dager</p>
                    <p className="text-xs text-ak-text-secondary">inaktiv</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-ak-text-secondary text-center py-4">Alle spillere er aktive</p>
          )}
        </Card>
      </div>
    </div>
  );
};

export default TeamAnalyticsDashboard;
