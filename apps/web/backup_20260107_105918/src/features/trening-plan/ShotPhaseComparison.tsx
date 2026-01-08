/**
 * ShotPhaseComparison
 *
 * Sammenlign prestasjoner på tvers av:
 * - Golfslag-typer (TEE, INN200, INN150, CHIP, PITCH, PUTT)
 * - L-Faser (KROPP → ARM → KØLLE → BALL → AUTO)
 * - Innspillskategorier (Full Swing, Short Game, Putting)
 *
 * Viser distribusjon av treningstimer, repetisjoner og fokus-score
 */

import React, { useState, useMemo } from 'react';
import { BarChart3, TrendingUp, Clock, Flame, Target, Filter } from 'lucide-react';
import Card from '../../ui/primitives/Card';
import Button from '../../ui/primitives/Button';
import { StandardPageHeader } from '../../components/layout/StandardPageHeader';

// ============================================================================
// TYPES
// ============================================================================

type ShotCategory = 'TEE' | 'INN200' | 'INN150' | 'INN100' | 'INN50' | 'CHIP' | 'PITCH' | 'LOB' | 'BUNKER' | 'PUTT';
type LPhase = 'L-KROPP' | 'L-ARM' | 'L-KØLLE' | 'L-BALL' | 'L-AUTO';
type CategoryGroup = 'fullSwing' | 'shortGame' | 'putting';

interface ComparisonData {
  shotCategory: ShotCategory;
  phase: LPhase;
  categoryGroup: CategoryGroup;
  hours: number;
  reps: number;
  sessions: number;
  avgFocus: number;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const SHOT_CATEGORIES: Record<ShotCategory, { label: string; group: CategoryGroup }> = {
  TEE: { label: 'Tee Total', group: 'fullSwing' },
  INN200: { label: 'Innspill 200+', group: 'fullSwing' },
  INN150: { label: 'Innspill 150-200', group: 'fullSwing' },
  INN100: { label: 'Innspill 100-150', group: 'fullSwing' },
  INN50: { label: 'Innspill 50-100', group: 'fullSwing' },
  CHIP: { label: 'Chip', group: 'shortGame' },
  PITCH: { label: 'Pitch', group: 'shortGame' },
  LOB: { label: 'Lob', group: 'shortGame' },
  BUNKER: { label: 'Bunker', group: 'shortGame' },
  PUTT: { label: 'Putting', group: 'putting' },
};

const L_PHASES: Record<LPhase, { label: string; color: string }> = {
  'L-KROPP': { label: 'Kropp', color: '#94A3B8' },
  'L-ARM': { label: 'Arm', color: '#64748B' },
  'L-KØLLE': { label: 'Kølle', color: '#475569' },
  'L-BALL': { label: 'Ball', color: '#334155' },
  'L-AUTO': { label: 'Auto', color: '#0A2540' },
};

const CATEGORY_GROUPS: Record<CategoryGroup, { label: string; color: string }> = {
  fullSwing: { label: 'Full Swing', color: '#3B82F6' },
  shortGame: { label: 'Nærspill', color: '#10B981' },
  putting: { label: 'Putting', color: '#F59E0B' },
};

// ============================================================================
// MOCK DATA
// ============================================================================

const generateMockData = (): ComparisonData[] => {
  const data: ComparisonData[] = [];
  const shots: ShotCategory[] = ['TEE', 'INN150', 'INN100', 'CHIP', 'PITCH', 'PUTT'];
  const phases: LPhase[] = ['L-KROPP', 'L-ARM', 'L-KØLLE', 'L-BALL', 'L-AUTO'];

  shots.forEach((shot) => {
    phases.forEach((phase) => {
      const group = SHOT_CATEGORIES[shot].group;
      data.push({
        shotCategory: shot,
        phase,
        categoryGroup: group,
        hours: Math.random() * 10,
        reps: Math.floor(Math.random() * 500),
        sessions: Math.floor(Math.random() * 20),
        avgFocus: Math.random() * 4 + 6, // 6-10
      });
    });
  });

  return data;
};

// ============================================================================
// COMPONENTS
// ============================================================================

interface ComparisonTableProps {
  data: ComparisonData[];
  groupBy: 'shot' | 'phase' | 'category';
}

const ComparisonTable: React.FC<ComparisonTableProps> = ({ data, groupBy }) => {
  const aggregatedData = useMemo(() => {
    if (groupBy === 'shot') {
      // Group by shot category
      const grouped: Record<string, { hours: number; reps: number; sessions: number; avgFocus: number }> = {};
      data.forEach((item) => {
        if (!grouped[item.shotCategory]) {
          grouped[item.shotCategory] = { hours: 0, reps: 0, sessions: 0, avgFocus: 0 };
        }
        grouped[item.shotCategory].hours += item.hours;
        grouped[item.shotCategory].reps += item.reps;
        grouped[item.shotCategory].sessions += item.sessions;
        grouped[item.shotCategory].avgFocus += item.avgFocus;
      });

      // Calculate averages
      Object.keys(grouped).forEach((key) => {
        const count = data.filter((item) => item.shotCategory === key).length;
        grouped[key].avgFocus /= count;
      });

      return Object.entries(grouped).map(([key, value]) => ({
        label: SHOT_CATEGORIES[key as ShotCategory].label,
        color: undefined,
        ...value,
      }));
    } else if (groupBy === 'phase') {
      // Group by L-Phase
      const grouped: Record<string, { hours: number; reps: number; sessions: number; avgFocus: number }> = {};
      data.forEach((item) => {
        if (!grouped[item.phase]) {
          grouped[item.phase] = { hours: 0, reps: 0, sessions: 0, avgFocus: 0 };
        }
        grouped[item.phase].hours += item.hours;
        grouped[item.phase].reps += item.reps;
        grouped[item.phase].sessions += item.sessions;
        grouped[item.phase].avgFocus += item.avgFocus;
      });

      // Calculate averages
      Object.keys(grouped).forEach((key) => {
        const count = data.filter((item) => item.phase === key).length;
        grouped[key].avgFocus /= count;
      });

      return Object.entries(grouped).map(([key, value]) => ({
        label: L_PHASES[key as LPhase].label,
        color: L_PHASES[key as LPhase].color,
        ...value,
      }));
    } else {
      // Group by category group
      const grouped: Record<string, { hours: number; reps: number; sessions: number; avgFocus: number }> = {};
      data.forEach((item) => {
        if (!grouped[item.categoryGroup]) {
          grouped[item.categoryGroup] = { hours: 0, reps: 0, sessions: 0, avgFocus: 0 };
        }
        grouped[item.categoryGroup].hours += item.hours;
        grouped[item.categoryGroup].reps += item.reps;
        grouped[item.categoryGroup].sessions += item.sessions;
        grouped[item.categoryGroup].avgFocus += item.avgFocus;
      });

      // Calculate averages
      Object.keys(grouped).forEach((key) => {
        const count = data.filter((item) => item.categoryGroup === key).length;
        grouped[key].avgFocus /= count;
      });

      return Object.entries(grouped).map(([key, value]) => ({
        label: CATEGORY_GROUPS[key as CategoryGroup].label,
        color: CATEGORY_GROUPS[key as CategoryGroup].color,
        ...value,
      }));
    }
  }, [data, groupBy]);

  // Sort by hours descending
  const sortedData = aggregatedData.sort((a, b) => b.hours - a.hours);

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-tier-border-default">
            <th className="text-left py-3 px-4 text-xs font-semibold text-tier-text-secondary uppercase tracking-wide">
              {groupBy === 'shot' ? 'Golfslag' : groupBy === 'phase' ? 'L-Fase' : 'Kategori'}
            </th>
            <th className="text-right py-3 px-4 text-xs font-semibold text-tier-text-secondary uppercase tracking-wide">
              Timer
            </th>
            <th className="text-right py-3 px-4 text-xs font-semibold text-tier-text-secondary uppercase tracking-wide">
              Reps
            </th>
            <th className="text-right py-3 px-4 text-xs font-semibold text-tier-text-secondary uppercase tracking-wide">
              Økter
            </th>
            <th className="text-right py-3 px-4 text-xs font-semibold text-tier-text-secondary uppercase tracking-wide">
              Snitt Fokus
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row, index) => (
            <tr key={index} className="border-b border-tier-border-default last:border-b-0 hover:bg-tier-surface-base transition-colors">
              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  {row.color && (
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: row.color }}
                    />
                  )}
                  <span className="text-sm font-medium text-tier-navy">{row.label}</span>
                </div>
              </td>
              <td className="text-right py-3 px-4">
                <div className="flex items-center justify-end gap-1">
                  <Clock size={14} className="text-tier-text-tertiary" />
                  <span className="text-sm font-semibold text-tier-navy">
                    {row.hours.toFixed(1)}t
                  </span>
                </div>
              </td>
              <td className="text-right py-3 px-4">
                <div className="flex items-center justify-end gap-1">
                  <Flame size={14} className="text-tier-text-tertiary" />
                  <span className="text-sm font-semibold text-tier-navy">
                    {row.reps.toFixed(0)}
                  </span>
                </div>
              </td>
              <td className="text-right py-3 px-4">
                <div className="flex items-center justify-end gap-1">
                  <TrendingUp size={14} className="text-tier-text-tertiary" />
                  <span className="text-sm font-semibold text-tier-navy">
                    {row.sessions}
                  </span>
                </div>
              </td>
              <td className="text-right py-3 px-4">
                <div className="flex items-center justify-end gap-1">
                  <Target size={14} className="text-tier-text-tertiary" />
                  <span className="text-sm font-semibold text-tier-navy">
                    {row.avgFocus.toFixed(1)}
                  </span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const ShotPhaseComparison: React.FC = () => {
  const [groupBy, setGroupBy] = useState<'shot' | 'phase' | 'category'>('category');
  const [mockData] = useState(() => generateMockData());

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <StandardPageHeader
        icon={BarChart3}
        title="Treningssammenligning"
        subtitle="Sammenlign din treningsfordeling på tvers av golfslag, faser og kategorier"
      />

      {/* Filter Controls */}
      <Card className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={16} className="text-tier-text-secondary" />
          <span className="text-sm font-medium text-tier-navy">Grupper etter:</span>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={groupBy === 'category' ? 'primary' : 'ghost'}
            onClick={() => setGroupBy('category')}
          >
            Kategori
          </Button>
          <Button
            size="sm"
            variant={groupBy === 'shot' ? 'primary' : 'ghost'}
            onClick={() => setGroupBy('shot')}
          >
            Golfslag
          </Button>
          <Button
            size="sm"
            variant={groupBy === 'phase' ? 'primary' : 'ghost'}
            onClick={() => setGroupBy('phase')}
          >
            L-Fase
          </Button>
        </div>
      </Card>

      {/* Comparison Table */}
      <Card>
        <ComparisonTable data={mockData} groupBy={groupBy} />
      </Card>

      {/* Info Box */}
      <div className="mt-6 p-4 bg-tier-surface-base rounded-lg border border-tier-border-default">
        <p className="text-xs text-tier-text-secondary m-0">
          <strong>Tips:</strong> Denne sammenligningen viser hvordan treningstiden din er fordelt.
          Idealfordeling avhenger av ditt nivå og mål, men generelt bør du ha en balansert
          tilnærming på tvers av kategorier og faser.
        </p>
      </div>
    </div>
  );
};

export default ShotPhaseComparison;
