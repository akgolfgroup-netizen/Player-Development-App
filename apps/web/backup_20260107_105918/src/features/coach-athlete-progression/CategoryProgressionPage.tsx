/**
 * TIER Golf Academy - Category Progression Page
 * Design System v3.0 - Premium Light
 *
 * Shows player's progression toward next category with detailed test requirements.
 * Uses analyticsAPI.getCategoryProgression() backend endpoint.
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  TrendingUp,
  Target,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronRight,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { analyticsAPI, playersAPI } from '../../services/api';
import PageHeader from '../../ui/raw-blocks/PageHeader.raw';
import StateCard from '../../ui/composites/StateCard';
import Button from '../../ui/primitives/Button';
import { SectionTitle } from '../../components/typography';

// Types matching backend CategoryProgression interface
interface CategoryProgressionRequirement {
  testNumber: number;
  testName: string;
  requirement: number;
  currentValue?: number;
  passed: boolean;
  gap?: number;
  gapPercentage?: number;
}

interface CategoryProgression {
  playerId: string;
  currentCategory: string;
  nextCategory: string;
  requirements: CategoryProgressionRequirement[];
  testsPassedForNext: number;
  totalRequiredTests: number;
  overallReadiness: number;
  estimatedMonthsToNext?: number;
  recentTrend: 'on_track' | 'needs_attention' | 'excellent';
}

interface PlayerInfo {
  id: string;
  firstName: string;
  lastName: string;
  category: string;
}

export const CategoryProgressionPage: React.FC = () => {
  const { athleteId } = useParams<{ athleteId: string }>();
  const navigate = useNavigate();

  const [progression, setProgression] = useState<CategoryProgression | null>(null);
  const [player, setPlayer] = useState<PlayerInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    if (!athleteId) return;

    try {
      setError(null);

      // Fetch player info and progression in parallel
      const [playerRes, progressionRes] = await Promise.all([
        playersAPI.getById(athleteId).catch(() => null),
        analyticsAPI.getCategoryProgression(athleteId).catch(() => null),
      ]);

      if (playerRes?.data?.data) {
        setPlayer(playerRes.data.data);
      }

      if (progressionRes?.data?.data) {
        // Type assertion needed as API returns generic Record type
        const data = progressionRes.data.data as unknown as CategoryProgression;
        setProgression(data);
      } else {
        setError('Kunne ikke hente kategoridata');
      }
    } catch (err) {
      setError('En feil oppstod');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [athleteId]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'excellent':
        return <TrendingUp size={18} className="text-tier-success" />;
      case 'on_track':
        return <CheckCircle2 size={18} className="text-tier-navy" />;
      case 'needs_attention':
        return <AlertCircle size={18} className="text-tier-warning" />;
      default:
        return null;
    }
  };

  const getTrendLabel = (trend: string) => {
    switch (trend) {
      case 'excellent':
        return 'Utmerket fremgang';
      case 'on_track':
        return 'På rett spor';
      case 'needs_attention':
        return 'Trenger fokus';
      default:
        return '';
    }
  };

  const getTrendClasses = (trend: string) => {
    switch (trend) {
      case 'excellent':
        return 'bg-tier-success/10 text-tier-success';
      case 'on_track':
        return 'bg-tier-navy/10 text-tier-navy';
      case 'needs_attention':
        return 'bg-tier-warning/10 text-tier-warning';
      default:
        return 'bg-tier-surface-base text-tier-text-secondary';
    }
  };

  const getReadinessColor = (readiness: number) => {
    if (readiness >= 80) return 'text-tier-success';
    if (readiness >= 50) return 'text-tier-navy';
    if (readiness >= 25) return 'text-tier-warning';
    return 'text-tier-error';
  };

  const getProgressBarColor = (readiness: number) => {
    if (readiness >= 80) return 'bg-tier-success';
    if (readiness >= 50) return 'bg-tier-navy';
    if (readiness >= 25) return 'bg-tier-warning';
    return 'bg-tier-error';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-tier-surface-base">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={32} className="animate-spin text-tier-navy" />
          <p className="text-sm text-tier-text-secondary">Laster kategoridata...</p>
        </div>
      </div>
    );
  }

  if (error || !progression) {
    return (
      <div className="p-6 bg-tier-surface-base min-h-screen">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-tier-text-secondary hover:text-tier-navy mb-6"
        >
          <ArrowLeft size={16} />
          Tilbake
        </button>
        <StateCard
          variant="error"
          title="Kunne ikke laste kategoridata"
          description={error || 'Prøv igjen senere'}
          action={<Button onClick={handleRefresh}>Prøv igjen</Button>}
        />
      </div>
    );
  }

  const passedRequirements = progression.requirements.filter(r => r.passed);
  const failedRequirements = progression.requirements.filter(r => !r.passed);

  return (
    <div className="p-6 bg-tier-surface-base min-h-screen">
      {/* Back navigation */}
      <button
        onClick={() => navigate(`/coach/athletes/${athleteId}`)}
        className="flex items-center gap-2 text-sm text-tier-text-secondary hover:text-tier-navy mb-4 transition-colors"
      >
        <ArrowLeft size={16} />
        Tilbake til spiller
      </button>

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-tier-navy to-tier-navy/80 flex items-center justify-center flex-shrink-0">
            <Target size={24} className="text-white" />
          </div>
          <div>
            <PageHeader
              title="Kategori-progresjon"
              subtitle={player ? `${player.firstName} ${player.lastName}` : 'Laster...'}
              divider={false}
            />
          </div>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleRefresh}
          disabled={refreshing}
        >
          <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
          {refreshing ? 'Oppdaterer...' : 'Oppdater'}
        </Button>
      </div>

      {/* Summary Card */}
      <div className="bg-tier-white rounded-2xl p-6 mb-6 border border-tier-border-default">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            {/* Current Category */}
            <div className="flex flex-col items-center">
              <span className="text-xs text-tier-text-tertiary mb-1">Nåværende</span>
              <div className="w-14 h-14 rounded-xl bg-tier-surface-base border-2 border-tier-border-default flex items-center justify-center">
                <span className="text-2xl font-bold text-tier-navy">
                  {progression.currentCategory}
                </span>
              </div>
            </div>

            {/* Arrow */}
            <ChevronRight size={24} className="text-tier-text-tertiary" />

            {/* Next Category */}
            <div className="flex flex-col items-center">
              <span className="text-xs text-tier-text-tertiary mb-1">Neste mål</span>
              <div className="w-14 h-14 rounded-xl bg-tier-navy/10 border-2 border-tier-navy flex items-center justify-center">
                <span className="text-2xl font-bold text-tier-navy">
                  {progression.nextCategory}
                </span>
              </div>
            </div>
          </div>

          {/* Trend badge */}
          <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${getTrendClasses(progression.recentTrend)}`}>
            {getTrendIcon(progression.recentTrend)}
            <span className="text-sm font-medium">
              {getTrendLabel(progression.recentTrend)}
            </span>
          </div>
        </div>

        {/* Overall Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-tier-text-secondary">Total fremgang</span>
            <span className={`text-lg font-bold ${getReadinessColor(progression.overallReadiness)}`}>
              {progression.overallReadiness}%
            </span>
          </div>
          <div className="h-3 bg-tier-border-default rounded-full overflow-hidden">
            <div
              className={`h-full ${getProgressBarColor(progression.overallReadiness)} transition-all duration-500 rounded-full`}
              style={{ width: `${progression.overallReadiness}%` }}
            />
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center py-3 px-4 bg-tier-surface-base rounded-xl">
            <span className="text-2xl font-bold text-tier-success">
              {progression.testsPassedForNext}
            </span>
            <p className="text-xs text-tier-text-secondary mt-1">Bestått</p>
          </div>
          <div className="text-center py-3 px-4 bg-tier-surface-base rounded-xl">
            <span className="text-2xl font-bold text-tier-error">
              {progression.totalRequiredTests - progression.testsPassedForNext}
            </span>
            <p className="text-xs text-tier-text-secondary mt-1">Gjenstår</p>
          </div>
          <div className="text-center py-3 px-4 bg-tier-surface-base rounded-xl">
            <span className="text-2xl font-bold text-tier-navy">
              {progression.totalRequiredTests}
            </span>
            <p className="text-xs text-tier-text-secondary mt-1">Totalt</p>
          </div>
        </div>

        {progression.estimatedMonthsToNext && (
          <div className="mt-4 pt-4 border-t border-tier-border-default">
            <p className="text-sm text-tier-text-secondary text-center">
              Estimert tid til kategori {progression.nextCategory}:{' '}
              <span className="font-semibold text-tier-navy">
                {progression.estimatedMonthsToNext} {progression.estimatedMonthsToNext === 1 ? 'måned' : 'måneder'}
              </span>
            </p>
          </div>
        )}
      </div>

      {/* Requirements sections */}
      <div className="space-y-6">
        {/* Passed requirements */}
        {passedRequirements.length > 0 && (
          <div className="bg-tier-white rounded-2xl p-5 border border-tier-border-default">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 size={20} className="text-tier-success" />
              <SectionTitle className="m-0">
                Beståtte krav ({passedRequirements.length})
              </SectionTitle>
            </div>
            <div className="space-y-3">
              {passedRequirements.map((req) => (
                <div
                  key={req.testNumber}
                  className="flex items-center justify-between py-3 px-4 bg-tier-success/5 rounded-xl border border-tier-success/20"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle2 size={18} className="text-tier-success" />
                    <div>
                      <p className="text-sm font-medium text-tier-navy">
                        Test {req.testNumber}: {req.testName}
                      </p>
                      <p className="text-xs text-tier-text-secondary">
                        Krav: {req.requirement}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-tier-success">
                      {req.currentValue ?? '-'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Failed/pending requirements */}
        {failedRequirements.length > 0 && (
          <div className="bg-tier-white rounded-2xl p-5 border border-tier-border-default">
            <div className="flex items-center gap-2 mb-4">
              <Target size={20} className="text-tier-error" />
              <SectionTitle className="m-0">
                Må forbedres ({failedRequirements.length})
              </SectionTitle>
            </div>
            <div className="space-y-3">
              {failedRequirements.map((req) => (
                <div
                  key={req.testNumber}
                  className="flex items-center justify-between py-3 px-4 bg-tier-surface-base rounded-xl border border-tier-border-default"
                >
                  <div className="flex items-center gap-3">
                    <XCircle size={18} className="text-tier-error" />
                    <div>
                      <p className="text-sm font-medium text-tier-navy">
                        Test {req.testNumber}: {req.testName}
                      </p>
                      <p className="text-xs text-tier-text-secondary">
                        Krav: {req.requirement}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-tier-navy">
                      {req.currentValue ?? '-'}
                    </span>
                    {req.gap !== undefined && (
                      <p className="text-xs text-tier-error">
                        {req.gap > 0 ? '+' : ''}{req.gap.toFixed(1)} til krav
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryProgressionPage;
