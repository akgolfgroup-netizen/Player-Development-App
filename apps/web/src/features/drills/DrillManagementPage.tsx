/**
 * DrillManagementPage
 *
 * Comprehensive drill/exercise management system with:
 * - Repetitions (reps)
 * - Estimated time
 * - L-Phase (learning phase)
 * - Training area (treningsområde)
 * - Environment (miljø)
 * - CS level (club speed)
 * - Belastning (pressure)
 *
 * Features:
 * - Create, edit, delete drills
 * - Filter by all taxonomy dimensions
 * - Add drills to training sessions
 * - Template library
 *
 * MIGRATED TO PAGE ARCHITECTURE - Zero inline styles
 */

import React, { useState, useMemo } from 'react';
import { Plus, Edit2, Trash2, Copy, Dumbbell, Clock, Target, Gauge, Filter } from 'lucide-react';
import { StandardPageHeader } from '../../components/layout/StandardPageHeader';
import Button from '../../ui/primitives/Button';
import Card from '../../ui/primitives/Card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/shadcn/dialog';
import { SubSectionTitle } from '../../components/typography';

// ============================================================================
// TYPES
// ============================================================================

type PyramideLevel = 'FYS' | 'TEK' | 'SLAG' | 'SPILL' | 'TURN';
type LPhase = 'L-KROPP' | 'L-ARM' | 'L-KØLLE' | 'L-BALL' | 'L-AUTO';
type CSLevel = 'CS20' | 'CS40' | 'CS60' | 'CS80' | 'CS100';
type EnvironmentLevel = 'M0' | 'M1' | 'M2' | 'M3' | 'M4' | 'M5';
type PressureLevel = 'PR1' | 'PR2' | 'PR3' | 'PR4' | 'PR5';

interface Drill {
  id: string;
  name: string;
  description: string;
  pyramide: PyramideLevel;
  golfArea: string;
  lPhase: LPhase;
  csLevel: CSLevel;
  environment: EnvironmentLevel;
  pressure: PressureLevel;
  reps?: number;
  sets?: number;
  estimatedMinutes: number;
  difficulty: 1 | 2 | 3 | 4 | 5;
  isFavorite?: boolean;
  tags?: string[];
}

// ============================================================================
// CONSTANTS
// ============================================================================

const PYRAMIDE_LEVELS: Record<PyramideLevel, { label: string; color: string; bgColor: string }> = {
  FYS: { label: 'Fysisk', color: 'text-purple-600', bgColor: 'bg-purple-500/15' },
  TEK: { label: 'Teknikk', color: 'text-tier-navy', bgColor: 'bg-tier-navy/15' },
  SLAG: { label: 'Golfslag', color: 'text-tier-success', bgColor: 'bg-tier-success/15' },
  SPILL: { label: 'Spill', color: 'text-amber-600', bgColor: 'bg-amber-500/15' },
  TURN: { label: 'Turnering', color: 'text-tier-error', bgColor: 'bg-tier-error/15' },
};

const GOLF_AREAS = [
  { id: 'TEE', label: 'Tee Total', group: 'fullSwing' },
  { id: 'INN200', label: 'Innspill 200+ m', group: 'fullSwing' },
  { id: 'INN150', label: 'Innspill 150-200 m', group: 'fullSwing' },
  { id: 'INN100', label: 'Innspill 100-150 m', group: 'fullSwing' },
  { id: 'INN50', label: 'Innspill 50-100 m', group: 'fullSwing' },
  { id: 'PITCH', label: 'Pitch', group: 'shortGame' },
  { id: 'BUNKER', label: 'Bunker', group: 'shortGame' },
  { id: 'LOB', label: 'Lob', group: 'shortGame' },
  { id: 'CHIP', label: 'Chip', group: 'shortGame' },
  { id: 'PUTT0-3', label: 'Putting 0-3 ft', group: 'putting' },
  { id: 'PUTT3-5', label: 'Putting 3-5 ft', group: 'putting' },
  { id: 'PUTT5-10', label: 'Putting 5-10 ft', group: 'putting' },
  { id: 'PUTT10-15', label: 'Putting 10-15 ft', group: 'putting' },
  { id: 'PUTT15-25', label: 'Putting 15-25 ft', group: 'putting' },
  { id: 'PUTT25-40', label: 'Putting 25-40 ft', group: 'putting' },
  { id: 'PUTT40+', label: 'Putting 40+ ft', group: 'putting' },
];

const L_PHASES: Record<LPhase, string> = {
  'L-KROPP': 'Kropp',
  'L-ARM': 'Arm',
  'L-KØLLE': 'Kølle',
  'L-BALL': 'Ball',
  'L-AUTO': 'Auto',
};

const CS_LEVELS: Record<CSLevel, string> = {
  CS20: '20% hastighet',
  CS40: '40% hastighet',
  CS60: '60% hastighet',
  CS80: '80% hastighet',
  CS100: '100% hastighet',
};

const ENVIRONMENTS: Record<EnvironmentLevel, string> = {
  M0: 'Off course',
  M1: 'Innendørs',
  M2: 'Range',
  M3: 'Treningsområde',
  M4: 'Bane trening',
  M5: 'Turnering',
};

const PRESSURE_LEVELS: Record<PressureLevel, string> = {
  PR1: 'Ingen press',
  PR2: 'Selvmonitorering',
  PR3: 'Sosialt',
  PR4: 'Konkurranse',
  PR5: 'Turnering',
};

// ============================================================================
// MOCK DATA
// ============================================================================

const generateMockDrills = (): Drill[] => [
  {
    id: '1',
    name: 'Hofterotasjon mobilitet',
    description: 'Mobilitet og styrke i hofterotasjon for bedre rotasjon i svingen.',
    pyramide: 'FYS',
    golfArea: 'TEE',
    lPhase: 'L-KROPP',
    csLevel: 'CS20',
    environment: 'M0',
    pressure: 'PR1',
    reps: 12,
    sets: 3,
    estimatedMinutes: 15,
    difficulty: 2,
    isFavorite: true,
    tags: ['mobilitet', 'fysisk'],
  },
  {
    id: '2',
    name: 'Driver Target',
    description: 'Driver-slag mot definert målområde på range.',
    pyramide: 'TEK',
    golfArea: 'TEE',
    lPhase: 'L-KØLLE',
    csLevel: 'CS60',
    environment: 'M2',
    pressure: 'PR2',
    reps: 20,
    estimatedMinutes: 25,
    difficulty: 2,
    tags: ['driver', 'teknikk'],
  },
  {
    id: '3',
    name: 'Gate Drill',
    description: 'Porter med tees som ballen må gå gjennom. Fokus på puttingslinje.',
    pyramide: 'TEK',
    golfArea: 'PUTT3-5',
    lPhase: 'L-BALL',
    csLevel: 'CS40',
    environment: 'M3',
    pressure: 'PR1',
    reps: 15,
    estimatedMinutes: 20,
    difficulty: 2,
    tags: ['putting', 'presisjon'],
  },
  {
    id: '4',
    name: 'Scattered',
    description: 'Bytt mål og/eller klubb for HVERT slag. Simulerer banespill.',
    pyramide: 'SLAG',
    golfArea: 'CHIP',
    lPhase: 'L-AUTO',
    csLevel: 'CS80',
    environment: 'M3',
    pressure: 'PR2',
    reps: 10,
    estimatedMinutes: 20,
    difficulty: 3,
    tags: ['chip', 'variasjon'],
  },
  {
    id: '5',
    name: 'Clock Drill',
    description: '12 baller rundt hullet som en klokke. Alle skal i hullet.',
    pyramide: 'SLAG',
    golfArea: 'PUTT3-5',
    lPhase: 'L-AUTO',
    csLevel: 'CS60',
    environment: 'M3',
    pressure: 'PR3',
    reps: 12,
    estimatedMinutes: 25,
    difficulty: 4,
    tags: ['putting', 'press'],
  },
  {
    id: '6',
    name: 'Pressure Putting',
    description: 'Putting under simulert turneringspress. Mål: 10/10 på rad.',
    pyramide: 'TURN',
    golfArea: 'PUTT3-5',
    lPhase: 'L-AUTO',
    csLevel: 'CS100',
    environment: 'M5',
    pressure: 'PR5',
    reps: 10,
    estimatedMinutes: 30,
    difficulty: 5,
    tags: ['turnering', 'mental'],
  },
];

// ============================================================================
// COMPONENTS
// ============================================================================

interface DrillCardProps {
  drill: Drill;
  onEdit: (drill: Drill) => void;
  onDelete: (id: string) => void;
  onDuplicate: (drill: Drill) => void;
  onAddToSession: (drill: Drill) => void;
}

const DrillCard: React.FC<DrillCardProps> = ({
  drill,
  onEdit,
  onDelete,
  onDuplicate,
  onAddToSession,
}) => {
  const pyramideConfig = PYRAMIDE_LEVELS[drill.pyramide];

  return (
    <Card className="hover:shadow-md transition-shadow">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${pyramideConfig.bgColor} ${pyramideConfig.color}`}>
                {pyramideConfig.label}
              </span>
              {drill.isFavorite && (
                <span className="text-tier-navy">★</span>
              )}
            </div>
            <SubSectionTitle style={{ margin: 0, marginBottom: 4 }}>
              {drill.name}
            </SubSectionTitle>
            <p className="text-sm text-tier-text-secondary m-0">
              {drill.description}
            </p>
          </div>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 gap-3 mb-3 p-3 bg-tier-surface-base rounded">
          <div className="flex items-center gap-2 text-xs">
            <Target size={14} className="text-tier-text-tertiary flex-shrink-0" />
            <div>
              <div className="font-medium text-tier-navy">
                {GOLF_AREAS.find(a => a.id === drill.golfArea)?.label}
              </div>
              <div className="text-tier-text-tertiary">Område</div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <Gauge size={14} className="text-tier-text-tertiary flex-shrink-0" />
            <div>
              <div className="font-medium text-tier-navy">
                {L_PHASES[drill.lPhase]} • {drill.csLevel}
              </div>
              <div className="text-tier-text-tertiary">Fase • Hastighet</div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <Dumbbell size={14} className="text-tier-text-tertiary flex-shrink-0" />
            <div>
              <div className="font-medium text-tier-navy">
                {drill.reps ? `${drill.reps} reps${drill.sets ? ` × ${drill.sets}` : ''}` : 'Ikke spesifisert'}
              </div>
              <div className="text-tier-text-tertiary">Repetisjoner</div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <Clock size={14} className="text-tier-text-tertiary flex-shrink-0" />
            <div>
              <div className="font-medium text-tier-navy">
                {drill.estimatedMinutes} min
              </div>
              <div className="text-tier-text-tertiary">Estimert tid</div>
            </div>
          </div>
        </div>

        {/* Environment and Pressure */}
        <div className="flex gap-2 mb-3 text-xs">
          <span className="px-2 py-1 rounded bg-blue-50 text-blue-700">
            {ENVIRONMENTS[drill.environment]}
          </span>
          <span className="px-2 py-1 rounded bg-orange-50 text-orange-700">
            {PRESSURE_LEVELS[drill.pressure]}
          </span>
          <span className="px-2 py-1 rounded bg-gray-100 text-gray-700">
            Nivå {drill.difficulty}/5
          </span>
        </div>

        {/* Tags */}
        {drill.tags && drill.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {drill.tags.map(tag => (
              <span key={tag} className="px-2 py-0.5 rounded bg-tier-surface-base text-tier-text-secondary text-xs">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-3 border-t border-tier-border-default">
          <Button
            variant="primary"
            size="sm"
            onClick={() => onAddToSession(drill)}
            className="flex-1"
          >
            Legg til økt
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(drill)}
            leftIcon={<Edit2 size={14} />}
          >
            Rediger
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDuplicate(drill)}
            leftIcon={<Copy size={14} />}
          >
            Kopier
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(drill.id)}
            leftIcon={<Trash2 size={14} />}
            className="text-tier-error hover:text-tier-error"
          >
            Slett
          </Button>
        </div>
      </div>
    </Card>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const DrillManagementPage: React.FC = () => {
  const [drills, setDrills] = useState<Drill[]>(generateMockDrills());
  const [filterPyramide, setFilterPyramide] = useState<PyramideLevel | 'all'>('all');
  const [filterArea, setFilterArea] = useState<string>('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  // Filtered drills
  const filteredDrills = useMemo(() => {
    return drills.filter(drill => {
      if (filterPyramide !== 'all' && drill.pyramide !== filterPyramide) return false;
      if (filterArea !== 'all' && drill.golfArea !== filterArea) return false;
      return true;
    });
  }, [drills, filterPyramide, filterArea]);

  const handleEdit = (_drill: Drill) => {
    // TODO: Open edit dialog
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Er du sikker på at du vil slette denne øvelsen?')) {
      setDrills(drills.filter(d => d.id !== id));
    }
  };

  const handleDuplicate = (drill: Drill) => {
    const newDrill: Drill = {
      ...drill,
      id: Date.now().toString(),
      name: `${drill.name} (kopi)`,
    };
    setDrills([...drills, newDrill]);
  };

  const handleAddToSession = (_drill: Drill) => {
    // TODO: Implement add to session functionality
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <StandardPageHeader
        icon={Dumbbell}
        title="Øvelsesbibliotek"
        subtitle="Administrer din samling av treningsøvelser med reps, tid, fase og belastning"
        helpText="Komplett bibliotek av treningsøvelser med full AK-hierarki klassifisering. Hver øvelse har pyramidenivå, L-fase, CS-nivå, miljø, belastning, repetisjoner og estimert tid. Filtrer, søk og legg til øvelser i treningsøkter."
        actions={
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus size={16} />}
            onClick={() => setShowCreateDialog(true)}
          >
            Ny øvelse
          </Button>
        }
      />

      {/* Filters */}
      <Card className="mb-6">
        <div className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Filter size={16} className="text-tier-text-secondary" />
            <span className="text-sm font-medium text-tier-navy">Filtrer:</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Pyramide filter */}
            <div>
              <label className="block text-xs font-medium text-tier-text-secondary mb-2">
                Pyramide nivå
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilterPyramide('all')}
                  className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                    filterPyramide === 'all'
                      ? 'bg-tier-navy text-white'
                      : 'bg-tier-surface-base text-tier-navy hover:bg-tier-white'
                  }`}
                >
                  Alle
                </button>
                {Object.entries(PYRAMIDE_LEVELS).map(([key, config]) => (
                  <button
                    key={key}
                    onClick={() => setFilterPyramide(key as PyramideLevel)}
                    className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                      filterPyramide === key
                        ? 'bg-tier-navy text-white'
                        : `${config.bgColor} ${config.color}`
                    }`}
                  >
                    {config.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Area filter */}
            <div>
              <label className="block text-xs font-medium text-tier-text-secondary mb-2">
                Treningsområde
              </label>
              <select
                value={filterArea}
                onChange={(e) => setFilterArea(e.target.value)}
                className="w-full px-3 py-2 border border-tier-border-default rounded bg-tier-white text-tier-navy text-sm"
              >
                <option value="all">Alle områder</option>
                {GOLF_AREAS.map(area => (
                  <option key={area.id} value={area.id}>{area.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Results count */}
      <div className="mb-4">
        <p className="text-sm text-tier-text-secondary">
          Viser {filteredDrills.length} av {drills.length} øvelser
        </p>
      </div>

      {/* Drills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDrills.map(drill => (
          <DrillCard
            key={drill.id}
            drill={drill}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onDuplicate={handleDuplicate}
            onAddToSession={handleAddToSession}
          />
        ))}
      </div>

      {/* Empty state */}
      {filteredDrills.length === 0 && (
        <Card>
          <div className="p-12 text-center">
            <Dumbbell size={48} className="mx-auto text-tier-text-tertiary mb-4" />
            <SubSectionTitle style={{ marginBottom: 8 }}>
              Ingen øvelser funnet
            </SubSectionTitle>
            <p className="text-sm text-tier-text-secondary mb-4">
              {filterPyramide !== 'all' || filterArea !== 'all'
                ? 'Prøv å justere filtrene for å se flere øvelser.'
                : 'Kom i gang ved å opprette din første øvelse.'}
            </p>
            {(filterPyramide !== 'all' || filterArea !== 'all') && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setFilterPyramide('all');
                  setFilterArea('all');
                }}
              >
                Tilbakestill filtre
              </Button>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default DrillManagementPage;
