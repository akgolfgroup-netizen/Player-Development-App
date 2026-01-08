import React, { useState, useEffect } from 'react';
import { sessionsAPI } from '../../../services/api';
import { useToast } from '../../../components/shadcn/use-toast';
import Card from '../../../ui/primitives/Card';
import { SubSectionTitle } from '../../../components/typography';
import { BarChart3, TrendingUp, Target, Clock, Star } from 'lucide-react';

interface EvaluationStats {
  totalSessions: number;
  averageFocus: number;
  averageEffort: number;
  averageTechnique: number;
  completionRate: number;
  topCategories: Array<{ category: string; count: number }>;
}

interface SessionStatsWidgetProps {
  playerId?: string;
  dateRange?: { from: string; to: string };
}

export const SessionStatsWidget: React.FC<SessionStatsWidgetProps> = ({
  playerId,
  dateRange,
}) => {
  const { toast } = useToast();
  const [stats, setStats] = useState<EvaluationStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await sessionsAPI.getEvaluationStats({
          playerId,
          ...dateRange,
        });
        setStats(response.data.data as unknown as EvaluationStats);
      } catch (error) {
        // Demo data on error
        setStats({
          totalSessions: 24,
          averageFocus: 4.2,
          averageEffort: 4.5,
          averageTechnique: 3.8,
          completionRate: 87,
          topCategories: [
            { category: 'Putting', count: 8 },
            { category: 'Kortspill', count: 6 },
            { category: 'Driving', count: 5 },
          ],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [playerId, dateRange]);

  if (loading) {
    return (
      <Card variant="default" padding="md">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-ak-surface-subtle rounded w-1/3" />
          <div className="grid grid-cols-4 gap-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-20 bg-ak-surface-subtle rounded" />
            ))}
          </div>
        </div>
      </Card>
    );
  }

  if (!stats) return null;

  const ratingToStars = (rating: number) => {
    const stars: React.ReactNode[] = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          size={12}
          className={i <= Math.round(rating) ? 'text-ak-prestige fill-ak-prestige' : 'text-ak-border-default'}
        />
      );
    }
    return stars;
  };

  return (
    <Card variant="default" padding="md">
      <SubSectionTitle className="mb-4">Økt-statistikk</SubSectionTitle>

      {/* Overview Stats */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        <div className="text-center p-3 bg-ak-surface-subtle rounded-lg">
          <BarChart3 size={20} className="mx-auto mb-1 text-ak-primary" />
          <p className="text-lg font-bold text-ak-text-primary">{stats.totalSessions}</p>
          <p className="text-xs text-ak-text-secondary">Totalt økter</p>
        </div>
        <div className="text-center p-3 bg-ak-surface-subtle rounded-lg">
          <Target size={20} className="mx-auto mb-1 text-ak-success" />
          <p className="text-lg font-bold text-ak-text-primary">{stats.completionRate}%</p>
          <p className="text-xs text-ak-text-secondary">Fullført</p>
        </div>
        <div className="text-center p-3 bg-ak-surface-subtle rounded-lg">
          <TrendingUp size={20} className="mx-auto mb-1 text-ak-primary" />
          <p className="text-lg font-bold text-ak-text-primary">{stats.averageEffort.toFixed(1)}</p>
          <p className="text-xs text-ak-text-secondary">Snitt innsats</p>
        </div>
        <div className="text-center p-3 bg-ak-surface-subtle rounded-lg">
          <Clock size={20} className="mx-auto mb-1 text-ak-warning" />
          <p className="text-lg font-bold text-ak-text-primary">{stats.averageFocus.toFixed(1)}</p>
          <p className="text-xs text-ak-text-secondary">Snitt fokus</p>
        </div>
      </div>

      {/* Rating Breakdown */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between p-2 bg-ak-surface-subtle rounded">
          <span className="text-sm text-ak-text-secondary">Fokus</span>
          <div className="flex items-center gap-2">
            <div className="flex">{ratingToStars(stats.averageFocus)}</div>
            <span className="text-sm font-medium text-ak-text-primary">{stats.averageFocus.toFixed(1)}</span>
          </div>
        </div>
        <div className="flex items-center justify-between p-2 bg-ak-surface-subtle rounded">
          <span className="text-sm text-ak-text-secondary">Innsats</span>
          <div className="flex items-center gap-2">
            <div className="flex">{ratingToStars(stats.averageEffort)}</div>
            <span className="text-sm font-medium text-ak-text-primary">{stats.averageEffort.toFixed(1)}</span>
          </div>
        </div>
        <div className="flex items-center justify-between p-2 bg-ak-surface-subtle rounded">
          <span className="text-sm text-ak-text-secondary">Teknikk</span>
          <div className="flex items-center gap-2">
            <div className="flex">{ratingToStars(stats.averageTechnique)}</div>
            <span className="text-sm font-medium text-ak-text-primary">{stats.averageTechnique.toFixed(1)}</span>
          </div>
        </div>
      </div>

      {/* Top Categories */}
      {stats.topCategories && stats.topCategories.length > 0 && (
        <div>
          <p className="text-xs font-medium text-ak-text-secondary mb-2">Mest trente kategorier</p>
          <div className="flex flex-wrap gap-2">
            {stats.topCategories.slice(0, 3).map((cat, index) => (
              <span
                key={cat.category}
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  index === 0
                    ? 'bg-ak-primary/10 text-ak-primary'
                    : 'bg-ak-surface-subtle text-ak-text-secondary'
                }`}
              >
                {cat.category} ({cat.count})
              </span>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};

export default SessionStatsWidget;
