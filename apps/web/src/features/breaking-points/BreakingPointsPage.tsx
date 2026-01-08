/**
 * Breaking Points Page
 * Identifies and displays performance inflection points
 */

import React, { useState } from 'react';
import { TrendingUp, AlertCircle, Filter } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useBreakingPoints } from '../../hooks/useBreakingPoints';
import BreakingPointTimeline from './components/BreakingPointTimeline';
import BreakingPointCard from './components/BreakingPointCard';
import { PageHeader } from '../../components/layout/PageHeader';
import LoadingSpinner from '../../components/LoadingSpinner';
import Button from '../../ui/primitives/Button';

type FilterType = 'all' | 'plateau' | 'regression' | 'breakthrough';

const FILTERS = [
  { value: 'all' as FilterType, label: 'Alle', icon: '📊' },
  { value: 'breakthrough' as FilterType, label: 'Gjennombrudd', icon: '🎯' },
  { value: 'plateau' as FilterType, label: 'Platåer', icon: '⚠️' },
  { value: 'regression' as FilterType, label: 'Tilbakeganger', icon: '📉' },
];

const BreakingPointsPage: React.FC = () => {
  const { user } = useAuth();
  const playerId = user?.playerId || user?.id;
  const [filter, setFilter] = useState<FilterType>('all');
  const [selectedPointId, setSelectedPointId] = useState<string | null>(null);

  const { data, loading, error, refetch } = useBreakingPoints(filter);

  const breakingPoints = data?.breakingPoints || [];
  const stats = data?.summary || { total: 0, resolved: 0, inProgress: 0, awaitingProof: 0, averageEffort: 0, averageProgress: 0 };

  // Filter breaking points
  const filteredPoints = filter === 'all'
    ? breakingPoints
    : breakingPoints.filter((bp: any) => {
        // Map old status to new type field for filtering
        if (filter === 'breakthrough') return bp.status === 'resolved' || bp.progress > 80;
        if (filter === 'plateau') return bp.progress > 20 && bp.progress < 80;
        if (filter === 'regression') return bp.progress < 20;
        return true;
      });

  // Convert to timeline format
  const timelinePoints = filteredPoints.map((bp: any) => {
    const type: 'breakthrough' | 'plateau' | 'regression' = bp.progress > 80 ? 'breakthrough' : bp.progress > 20 ? 'plateau' : 'regression';
    return {
      id: bp.id,
      date: bp.identifiedDate,
      type,
      title: bp.title,
      area: bp.area,
      performanceChange: bp.progressPercent || 0,
    };
  });

  // Convert to card format (with mock data for demonstration)
  const cardPoints = filteredPoints.map((bp: any) => ({
    id: bp.id,
    type: bp.progress > 80 ? 'breakthrough' : bp.progress > 20 ? 'plateau' : 'regression',
    date: bp.identifiedDate,
    area: bp.area,
    title: bp.title,
    description: bp.description,
    performanceBefore: 70, // Mock data - would come from API
    performanceAfter: 70 + (bp.progressPercent || 0),
    causes: bp.coachNotes ? [bp.coachNotes] : [],
    recommendations: bp.drills?.map((d: any) => d.name) || [],
    priority: bp.priority,
  }));

  if (loading) {
    return (
      <div className="min-h-screen bg-tier-surface-base p-6 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <LoadingSpinner />
          <p className="mt-4 text-tier-text-secondary">Analyserer vendepunkter...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-tier-surface-base p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl border border-tier-border-default p-8 text-center">
            <div className="text-tier-error text-4xl mb-4">⚠️</div>
            <h3 className="text-lg font-semibold text-tier-navy mb-2">Kunne ikke laste vendepunkter</h3>
            <p className="text-tier-text-secondary mb-4">{error}</p>
            <Button variant="primary" onClick={refetch}>
              Prøv igjen
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-tier-surface-base p-6">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-6">
          <PageHeader
            title="Vendepunkter i prestasjonen"
            subtitle="Identifiser kritiske punkter i din utvikling - gjennombrudd, platåer og tilbakeganger"
            helpText=""
            actions={null}
          />
        </div>

        {/* Stats cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-tier-border-default p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-tier-text-secondary">Pågående vendepunkter</div>
              <AlertCircle size={20} className="text-tier-warning" />
            </div>
            <div className="text-3xl font-bold text-tier-navy">{stats.inProgress}</div>
          </div>
          <div className="bg-white rounded-xl border border-tier-border-default p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-tier-text-secondary">Venter på bevis</div>
              <TrendingUp size={20} className="text-tier-error" />
            </div>
            <div className="text-3xl font-bold text-tier-error">{stats.awaitingProof}</div>
          </div>
          <div className="bg-white rounded-xl border border-tier-border-default p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-tier-text-secondary">Løste vendepunkter</div>
              <TrendingUp size={20} className="text-tier-success" />
            </div>
            <div className="text-3xl font-bold text-tier-success">{stats.resolved}</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-tier-border-default p-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-tier-navy">
              <Filter size={18} />
              <span className="font-medium">Filter:</span>
            </div>
            <div className="flex gap-2">
              {FILTERS.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setFilter(f.value)}
                  className={`px-4 py-2 rounded-lg border transition-all ${
                    filter === f.value
                      ? 'bg-tier-navy text-white border-tier-navy'
                      : 'bg-white text-tier-navy border-tier-border-default hover:border-tier-navy'
                  }`}
                >
                  <span className="mr-2">{f.icon}</span>
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-6">
          <BreakingPointTimeline
            breakingPoints={timelinePoints}
            onPointClick={(id) => setSelectedPointId(id)}
          />
        </div>

        {/* Breaking point cards */}
        {cardPoints.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-tier-navy mb-4">Detaljer</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {cardPoints.map((point: any) => (
                <BreakingPointCard
                  key={point.id}
                  breakingPoint={point}
                  onClick={() => setSelectedPointId(point.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* No breaking points */}
        {cardPoints.length === 0 && (
          <div className="bg-white rounded-xl border border-tier-border-default p-12 text-center">
            <div className="text-tier-text-secondary text-4xl mb-4">📊</div>
            <h3 className="text-lg font-semibold text-tier-navy mb-2">
              Ingen vendepunkter funnet
            </h3>
            <p className="text-tier-text-secondary">
              {filter === 'all'
                ? 'Fortsett å trene og registrere tester, så vil systemet identifisere vendepunkter automatisk.'
                : `Ingen ${FILTERS.find((f) => f.value === filter)?.label.toLowerCase()} funnet.`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BreakingPointsPage;
