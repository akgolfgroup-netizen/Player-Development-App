/**
 * Strokes Gained Comparison
 * Compare player performance to benchmarks (tour, peers)
 */

import React, { useState } from 'react';
import { Users, Award, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend } from 'recharts';
import { useStrokesGainedBreakdown, useStrokesGainedPeerComparison } from '../../hooks/useStrokesGained';
import { PageHeader } from '../../components/layout/PageHeader';
import LoadingSpinner from '../../components/LoadingSpinner';

interface Props {
  playerId: string;
  className?: string;
}

const BENCHMARK_OPTIONS = [
  { value: 'peers', label: 'Mine konkurrenter', icon: Users },
  { value: 'tour', label: 'Tour-gjennomsnitt', icon: Award },
];

const StrokesGainedComparison: React.FC<Props> = ({ playerId, className = '' }) => {
  const [benchmark, setBenchmark] = useState<'peers' | 'tour'>('peers');
  const { breakdown, loading: breakdownLoading, error: breakdownError } = useStrokesGainedBreakdown(playerId);
  const { percentile, peerAverage, playerValue, loading: peerLoading, error: peerError } = useStrokesGainedPeerComparison(playerId);

  const loading = breakdownLoading || peerLoading;
  const error = breakdownError || peerError;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <LoadingSpinner />
        <p className="mt-4 text-tier-text-secondary">Laster sammenligning...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl border border-tier-border-default p-8 text-center">
        <div className="text-tier-error text-4xl mb-4">⚠️</div>
        <h3 className="text-lg font-semibold text-tier-navy mb-2">Kunne ikke laste sammenligning</h3>
        <p className="text-tier-text-secondary">{error}</p>
      </div>
    );
  }

  // Prepare chart data
  const categories = [
    { name: 'Approach', player: breakdown.approach || 0, benchmark: benchmark === 'peers' ? peerAverage * 0.4 : 0.8 },
    { name: 'Around Green', player: breakdown.aroundGreen || 0, benchmark: benchmark === 'peers' ? peerAverage * 0.3 : 0.5 },
    { name: 'Putting', player: breakdown.putting || 0, benchmark: benchmark === 'peers' ? peerAverage * 0.3 : 0.6 },
    { name: 'Tee to Green', player: breakdown.teeToGreen || 0, benchmark: benchmark === 'peers' ? peerAverage * 0.5 : 1.2 },
  ];

  const SelectedIcon = BENCHMARK_OPTIONS.find((opt) => opt.value === benchmark)?.icon || Users;

  return (
    <div className={`bg-white rounded-xl border border-tier-border-default ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-tier-border-default">
        <div className="flex items-center gap-3">
          <TrendingUp size={24} className="text-tier-navy" />
          <PageHeader title="Sammenligning" subtitle="" helpText="" actions={null} className="m-0" />
        </div>

        {/* Benchmark selector */}
        <div className="flex gap-2">
          {BENCHMARK_OPTIONS.map((option) => {
            const Icon = option.icon;
            const isSelected = benchmark === option.value;
            return (
              <button
                key={option.value}
                onClick={() => setBenchmark(option.value as 'peers' | 'tour')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                  isSelected
                    ? 'bg-tier-navy text-white border-tier-navy'
                    : 'bg-white text-tier-navy border-tier-border-default hover:border-tier-navy'
                }`}
              >
                <Icon size={16} />
                <span className="text-sm font-medium">{option.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Percentile card */}
      {benchmark === 'peers' && (
        <div className="m-6 p-6 bg-tier-info-light rounded-xl border border-tier-info">
          <div className="flex items-start gap-4">
            <div className="bg-tier-info text-white p-3 rounded-lg">
              <SelectedIcon size={24} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-tier-navy mb-2">Din posisjon</h3>
              <p className="text-tier-text-secondary mb-4">
                Du er i <span className="font-bold text-tier-navy">{percentile}. persentil</span> blant spillere på ditt nivå
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-tier-text-secondary mb-1">Din SG</div>
                  <div className="text-2xl font-bold text-tier-navy">
                    {playerValue >= 0 ? '+' : ''}{playerValue.toFixed(2)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-tier-text-secondary mb-1">Gjennomsnitt</div>
                  <div className="text-2xl font-bold text-tier-text-secondary">
                    {peerAverage >= 0 ? '+' : ''}{peerAverage.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Comparison chart */}
      <div className="p-6">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={categories}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--tier-border-default)" />
            <XAxis
              dataKey="name"
              stroke="var(--tier-text-secondary)"
              style={{ fontSize: 12 }}
            />
            <YAxis
              stroke="var(--tier-text-secondary)"
              style={{ fontSize: 12 }}
              label={{ value: 'Strokes Gained', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--tier-surface-base)',
                border: '1px solid var(--tier-border-default)',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <ReferenceLine y={0} stroke="var(--tier-border-default)" strokeDasharray="3 3" />
            <Bar
              dataKey="player"
              fill="var(--tier-navy)"
              name="Din prestasjon"
              radius={[8, 8, 0, 0]}
            />
            <Bar
              dataKey="benchmark"
              fill="var(--tier-text-secondary)"
              name={benchmark === 'peers' ? 'Konkurrenter' : 'Tour'}
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Category details */}
      <div className="grid grid-cols-2 gap-4 p-6 border-t border-tier-border-default bg-tier-surface-base">
        {categories.map((category) => {
          const diff = category.player - category.benchmark;
          const isPositive = diff > 0;

          return (
            <div
              key={category.name}
              className="p-4 bg-white rounded-lg border border-tier-border-default"
            >
              <div className="text-sm font-medium text-tier-text-secondary mb-2">
                {category.name}
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-xl font-bold text-tier-navy">
                    {category.player >= 0 ? '+' : ''}{category.player.toFixed(2)}
                  </div>
                  <div className="text-xs text-tier-text-secondary">
                    vs {category.benchmark.toFixed(2)}
                  </div>
                </div>
                <div
                  className={`text-sm font-semibold ${
                    isPositive ? 'text-tier-success' : 'text-tier-error'
                  }`}
                >
                  {isPositive ? '↑' : '↓'} {Math.abs(diff).toFixed(2)}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Insights */}
      <div className="p-6 border-t border-tier-border-default">
        <h3 className="text-lg font-semibold text-tier-navy mb-4">💡 Innsikt</h3>
        <div className="space-y-3">
          {categories
            .sort((a, b) => (a.player - a.benchmark) - (b.player - b.benchmark))
            .map((category, index) => {
              const diff = category.player - category.benchmark;
              if (index === 0) {
                return (
                  <div key={category.name} className="p-3 bg-tier-error-light rounded-lg">
                    <span className="text-sm text-tier-error">
                      <strong>{category.name}</strong> er ditt største forbedringsområde.
                      Du ligger {Math.abs(diff).toFixed(2)} slag bak {benchmark === 'peers' ? 'konkurrentene' : 'tour-snittet'}.
                    </span>
                  </div>
                );
              }
              if (index === categories.length - 1) {
                return (
                  <div key={category.name} className="p-3 bg-tier-success-light rounded-lg">
                    <span className="text-sm text-tier-success">
                      <strong>{category.name}</strong> er din sterkeste side!
                      Du ligger {diff.toFixed(2)} slag foran {benchmark === 'peers' ? 'konkurrentene' : 'tour-snittet'}.
                    </span>
                  </div>
                );
              }
              return null;
            })}
        </div>
      </div>
    </div>
  );
};

export default StrokesGainedComparison;
