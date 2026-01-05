/**
 * AK Golf Academy - Session Detail View
 * Design System v3.0 - Premium Light
 *
 * Viser full økt med AK-formel hierarki og alle blokker.
 * Integrert med AK_GOLF_KATEGORI_HIERARKI_v2.0
 *
 * MIGRATED TO PAGE ARCHITECTURE - Zero inline styles
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Clock,
  MapPin,
  Calendar,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Circle,
  Dumbbell,
  Target,
  Flag,
  Gamepad2,
  Trophy
} from 'lucide-react';
import PageHeader from '../../ui/raw-blocks/PageHeader.raw';
import { Button } from '../../ui/primitives';

// =============================================================================
// AK HIERARCHY CONSTANTS (from useAKFormula)
// =============================================================================

const PYRAMIDS = {
  FYS: { label: 'Fysisk', icon: '🏋️', description: 'Styrke, power, mobilitet' },
  TEK: { label: 'Teknikk', icon: '🎯', description: 'Bevegelsesmønster, posisjoner' },
  SLAG: { label: 'Golfslag', icon: '⛳', description: 'Slagkvalitet, nøyaktighet' },
  SPILL: { label: 'Spill', icon: '🏌️', description: 'Strategi, banehåndtering' },
  TURN: { label: 'Turnering', icon: '🏆', description: 'Mental prestasjon' },
};

const L_PHASES = {
  'L-KROPP': { label: 'Kun kropp', short: 'Kropp' },
  'L-ARM': { label: 'Med armer', short: 'Arm' },
  'L-KØLLE': { label: 'Med kølle', short: 'Kølle' },
  'L-BALL': { label: 'Med ball', short: 'Ball' },
  'L-AUTO': { label: 'Automatisert', short: 'Auto' },
};

const ENVIRONMENTS = {
  M0: { label: 'Off-course', short: 'Gym' },
  M1: { label: 'Simulator', short: 'Sim' },
  M2: { label: 'Range', short: 'Range' },
  M3: { label: 'Øvingsfelt', short: 'Øving' },
  M4: { label: 'Bane (trening)', short: 'Bane' },
  M5: { label: 'Bane (turnering)', short: 'Turn' },
};

const PRESSURE_LEVELS = {
  PR1: { label: 'Ingen press', short: 'Lav' },
  PR2: { label: 'Selvmonitorering', short: 'Moderat' },
  PR3: { label: 'Sosial', short: 'Sosial' },
  PR4: { label: 'Konkurranse', short: 'Konk' },
  PR5: { label: 'Turnering', short: 'Høy' },
};

// =============================================================================
// STYLING HELPERS
// =============================================================================

const getPyramidClasses = (pyramid) => {
  const classes = {
    FYS: 'bg-red-500/15 text-red-600 border-red-500/30',
    TEK: 'bg-ak-primary/15 text-ak-primary border-ak-primary/30',
    SLAG: 'bg-emerald-500/15 text-emerald-600 border-emerald-500/30',
    SPILL: 'bg-amber-500/15 text-amber-600 border-amber-500/30',
    TURN: 'bg-purple-500/15 text-purple-600 border-purple-500/30',
  };
  return classes[pyramid] || classes.TEK;
};

const getLPhaseClasses = (phase) => {
  const intensity = {
    'L-KROPP': 'bg-ak-surface-subtle text-ak-text-secondary',
    'L-ARM': 'bg-ak-primary/10 text-ak-primary',
    'L-KØLLE': 'bg-ak-primary/20 text-ak-primary',
    'L-BALL': 'bg-ak-primary/30 text-ak-primary',
    'L-AUTO': 'bg-ak-primary text-white',
  };
  return intensity[phase] || intensity['L-BALL'];
};

const getCsLevelClasses = (level) => {
  if (level <= 30) return 'bg-ak-surface-subtle text-ak-text-secondary';
  if (level <= 50) return 'bg-emerald-500/15 text-emerald-600';
  if (level <= 70) return 'bg-emerald-500/25 text-emerald-600';
  if (level <= 90) return 'bg-emerald-500/40 text-emerald-700';
  return 'bg-emerald-500 text-white';
};

const getEnvironmentClasses = (env) => {
  const classes = {
    M0: 'bg-gray-100 text-gray-600',
    M1: 'bg-blue-500/15 text-blue-600',
    M2: 'bg-green-500/15 text-green-600',
    M3: 'bg-emerald-500/20 text-emerald-600',
    M4: 'bg-emerald-500/30 text-emerald-700',
    M5: 'bg-emerald-500 text-white',
  };
  return classes[env] || classes.M2;
};

const getPressureClasses = (pressure) => {
  const classes = {
    PR1: 'bg-gray-100 text-gray-500',
    PR2: 'bg-amber-500/15 text-amber-600',
    PR3: 'bg-amber-500/25 text-amber-600',
    PR4: 'bg-amber-500/40 text-amber-700',
    PR5: 'bg-amber-500 text-white',
  };
  return classes[pressure] || classes.PR2;
};

const getStatusClasses = (status) => {
  const classes = {
    Planlagt: 'bg-ak-surface-subtle text-ak-text-secondary',
    Pågår: 'bg-ak-status-warning text-white',
    Fullført: 'bg-ak-status-success text-white',
  };
  return classes[status] || classes.Planlagt;
};

// =============================================================================
// COMPONENTS
// =============================================================================

// Tag component for parameters
function Tag({ label, colorClasses, tooltip }) {
  return (
    <span
      className={`inline-flex items-center py-1 px-2.5 rounded-md text-xs font-medium ${colorClasses}`}
      title={tooltip}
    >
      {label}
    </span>
  );
}

// AK Formula Card - Shows the complete formula breakdown
function FormulaCard({ session }) {
  const pyramid = session.pyramid || 'TEK';
  const pyramidInfo = PYRAMIDS[pyramid] || PYRAMIDS.TEK;

  return (
    <div className="bg-ak-surface-card rounded-xl p-4 mb-4 border border-ak-border-default">
      {/* Formula header */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-ak-text-tertiary uppercase tracking-wide">
          AK-Formel
        </span>
        {session.formula && (
          <code className="text-xs bg-ak-surface-subtle px-2 py-1 rounded font-mono text-ak-text-secondary">
            {session.formula}
          </code>
        )}
      </div>

      {/* Pyramid badge */}
      <div className="flex items-center gap-3 mb-4">
        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${getPyramidClasses(pyramid)}`}>
          <span className="text-xl">{pyramidInfo.icon}</span>
          <div>
            <div className="font-semibold text-sm">{pyramidInfo.label}</div>
            <div className="text-xs opacity-75">{pyramidInfo.description}</div>
          </div>
        </div>
      </div>

      {/* Parameters grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* L-Phase */}
        {session.lPhase && (
          <div className="bg-ak-surface-subtle rounded-lg p-3">
            <span className="text-xs text-ak-text-tertiary block mb-1">L-Fase</span>
            <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getLPhaseClasses(session.lPhase)}`}>
              {L_PHASES[session.lPhase]?.label || session.lPhase}
            </span>
          </div>
        )}

        {/* CS Level */}
        {session.csLevel !== undefined && (
          <div className="bg-ak-surface-subtle rounded-lg p-3">
            <span className="text-xs text-ak-text-tertiary block mb-1">Clubspeed</span>
            <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getCsLevelClasses(session.csLevel)}`}>
              CS{session.csLevel}%
            </span>
          </div>
        )}

        {/* Environment */}
        {session.environment && (
          <div className="bg-ak-surface-subtle rounded-lg p-3">
            <span className="text-xs text-ak-text-tertiary block mb-1">Miljø</span>
            <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getEnvironmentClasses(session.environment)}`}>
              {session.environment} – {ENVIRONMENTS[session.environment]?.label || ''}
            </span>
          </div>
        )}

        {/* Pressure */}
        {session.pressure && (
          <div className="bg-ak-surface-subtle rounded-lg p-3">
            <span className="text-xs text-ak-text-tertiary block mb-1">Press</span>
            <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getPressureClasses(session.pressure)}`}>
              {session.pressure} – {PRESSURE_LEVELS[session.pressure]?.label || ''}
            </span>
          </div>
        )}

        {/* P-Positions */}
        {session.positionStart && (
          <div className="bg-ak-surface-subtle rounded-lg p-3 col-span-2">
            <span className="text-xs text-ak-text-tertiary block mb-1">P-Posisjon (MORAD)</span>
            <span className="text-sm font-medium text-ak-text-primary">
              {session.positionStart}
              {session.positionEnd && session.positionEnd !== session.positionStart && (
                <> → {session.positionEnd}</>
              )}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// Single block component
function SessionBlock({ block, index, total, expanded, onToggle, onComplete }) {
  const pyramid = block.pyramid || 'TEK';
  const pyramidInfo = PYRAMIDS[pyramid] || PYRAMIDS.TEK;

  return (
    <div className="bg-ak-surface-card rounded-xl shadow-sm mb-3 overflow-hidden border border-ak-border-default">
      {/* Block header */}
      <div
        onClick={() => onToggle(index)}
        className={`flex justify-between items-center p-4 cursor-pointer hover:bg-ak-surface-subtle/50 transition-colors ${
          expanded ? 'border-b border-ak-border-default' : ''
        }`}
      >
        <div className="flex items-center gap-3">
          {/* Pyramid badge mini */}
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${getPyramidClasses(pyramid)}`}>
            {pyramidInfo.icon}
          </div>
          <div>
            <div className="font-semibold text-ak-text-primary text-[15px]">
              {block.exercise}
            </div>
            <div className="text-xs text-ak-text-secondary">
              Blokk {index + 1} av {total} • {block.duration} min
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {block.completed && (
            <CheckCircle2 size={20} className="text-ak-status-success" />
          )}
          {expanded ? (
            <ChevronUp size={20} className="text-ak-text-tertiary" />
          ) : (
            <ChevronDown size={20} className="text-ak-text-tertiary" />
          )}
        </div>
      </div>

      {/* Block content (expanded) */}
      {expanded && (
        <div className="p-4">
          {/* Focus and area */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <span className="text-xs text-ak-text-tertiary block mb-1">Fokus</span>
              <span className="text-sm font-medium text-ak-text-primary">{block.focus}</span>
            </div>
            <div>
              <span className="text-xs text-ak-text-tertiary block mb-1">Treningsområde</span>
              <span className="text-sm font-medium text-ak-text-primary">{block.trainingArea}</span>
            </div>
          </div>

          {/* Volume */}
          <div className="mb-4">
            <span className="text-xs text-ak-text-tertiary block mb-1">Volum</span>
            <span className="text-sm font-medium text-ak-text-primary">
              {block.reps} repetisjoner
            </span>
          </div>

          {/* Tags - Hierarchy parameters */}
          <div className="flex flex-wrap gap-2 mb-4">
            {block.lPhase && (
              <Tag
                label={L_PHASES[block.lPhase]?.short || block.lPhase}
                colorClasses={getLPhaseClasses(block.lPhase)}
                tooltip={L_PHASES[block.lPhase]?.label}
              />
            )}
            {block.csLevel !== undefined && (
              <Tag
                label={`CS${block.csLevel}%`}
                colorClasses={getCsLevelClasses(block.csLevel)}
                tooltip={`Clubspeed ${block.csLevel}%`}
              />
            )}
            {block.environment && (
              <Tag
                label={block.environment}
                colorClasses={getEnvironmentClasses(block.environment)}
                tooltip={ENVIRONMENTS[block.environment]?.label}
              />
            )}
            {block.pressure && (
              <Tag
                label={block.pressure}
                colorClasses={getPressureClasses(block.pressure)}
                tooltip={PRESSURE_LEVELS[block.pressure]?.label}
              />
            )}
            {block.position && (
              <Tag
                label={block.position}
                colorClasses="bg-purple-500/15 text-purple-600"
                tooltip={`P-posisjon: ${block.position}`}
              />
            )}
          </div>

          {/* Instructions */}
          {block.instructions && (
            <div className="bg-ak-surface-subtle rounded-lg p-3 mb-4">
              <span className="text-xs font-medium text-ak-primary block mb-1">
                Instruksjoner
              </span>
              <span className="text-sm text-ak-text-primary">
                {block.instructions}
              </span>
            </div>
          )}

          {/* Complete button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onComplete(index);
            }}
            className={`flex items-center justify-center gap-2 w-full p-3 rounded-lg cursor-pointer text-sm font-medium transition-colors ${
              block.completed
                ? 'bg-ak-status-success text-white'
                : 'bg-ak-surface-subtle text-ak-text-primary hover:bg-ak-border-default'
            }`}
          >
            {block.completed ? (
              <>
                <CheckCircle2 size={18} />
                Fullført
              </>
            ) : (
              <>
                <Circle size={18} />
                Marker som fullført
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function SessionDetailView({ session, onBack, onStartSession }) {
  const navigate = useNavigate();
  const [expandedBlocks, setExpandedBlocks] = useState({ 0: true }); // First block expanded by default
  const [blocks, setBlocks] = useState(session?.blocks || []);

  const handleEvaluate = () => {
    navigate(`/session/${session.id}/evaluate`);
  };

  const toggleBlock = (index) => {
    setExpandedBlocks(prev => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const completeBlock = (index) => {
    setBlocks(prev => prev.map((block, i) =>
      i === index ? { ...block, completed: !block.completed } : block
    ));
  };

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <span className="text-[15px] text-ak-text-secondary">
          Ingen økt valgt
        </span>
      </div>
    );
  }

  const completedCount = blocks.filter(b => b.completed).length;
  const totalDuration = blocks.reduce((sum, b) => sum + (b.duration || 0), 0);

  return (
    <div className="bg-ak-surface-base min-h-screen">
      {/* Header */}
      <PageHeader
        title={session.title || 'Treningsøkt'}
        subtitle={session.date}
        onBack={onBack}
        actions={
          <Button variant="ghost" size="sm">
            ⋮
          </Button>
        }
      />

      <div className="p-4 max-w-2xl mx-auto">
        {/* AK Formula Card */}
        <FormulaCard session={session} />

        {/* Session meta info */}
        <div className="bg-ak-surface-card rounded-xl p-4 mb-4 border border-ak-border-default">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-ak-text-tertiary" />
              <span className="text-sm text-ak-text-primary">{session.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-ak-text-tertiary" />
              <span className="text-sm text-ak-text-primary">
                {session.startTime} – {session.endTime}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-ak-text-tertiary" />
              <span className="text-sm text-ak-text-primary">{session.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center py-1 px-2.5 rounded-full text-xs font-semibold ${getStatusClasses(session.status)}`}>
                {session.status}
              </span>
            </div>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="bg-ak-surface-card rounded-xl p-4 mb-4 border border-ak-border-default">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-ak-text-primary">
              Fremgang
            </span>
            <span className="text-sm text-ak-text-secondary">
              {completedCount} av {blocks.length} blokker
            </span>
          </div>
          <div className="h-2 bg-ak-surface-subtle rounded-full overflow-hidden">
            <div
              className="h-full bg-ak-status-success rounded-full transition-all duration-300"
              style={{ width: `${blocks.length > 0 ? (completedCount / blocks.length) * 100 : 0}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-ak-text-tertiary">
            <span>{totalDuration} min totalt</span>
            <span>{blocks.length} blokker</span>
          </div>
        </div>

        {/* Blocks section */}
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-ak-text-primary mb-3 flex items-center gap-2">
            <Target size={16} />
            Treningsblokker
          </h3>

          {blocks.map((block, index) => (
            <SessionBlock
              key={index}
              block={block}
              index={index}
              total={blocks.length}
              expanded={expandedBlocks[index]}
              onToggle={toggleBlock}
              onComplete={completeBlock}
            />
          ))}
        </div>

        {/* Notes */}
        <div className="bg-ak-surface-card rounded-xl p-4 mb-4 border border-ak-border-default">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium text-ak-text-primary">
              Notater
            </span>
          </div>
          <textarea
            placeholder="Legg til notater fra økten..."
            className="w-full min-h-[80px] p-3 bg-ak-surface-subtle border border-ak-border-default rounded-lg resize-y text-sm text-ak-text-primary focus:outline-none focus:ring-2 focus:ring-ak-primary/30"
          />
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-2 pb-6">
          {session.status === 'Planlagt' && (
            <Button
              variant="primary"
              onClick={onStartSession}
              className="w-full"
            >
              Start økt
            </Button>
          )}

          {(session.status === 'Pågår' || session.completionStatus === 'in_progress') && (
            <Button
              variant="primary"
              onClick={handleEvaluate}
              className="w-full bg-ak-status-success hover:bg-ak-status-success/90"
            >
              Evaluer økt
            </Button>
          )}

          {session.status === 'Pågår' && onStartSession && (
            <Button
              variant="secondary"
              onClick={onStartSession}
              className="w-full"
            >
              Fortsett økt
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// DEMO DATA (with full hierarchy)
// =============================================================================

export const demoSession = {
  id: '1',
  title: 'Teknikk – Innspill',
  formula: 'TEK_INN100_L-BALL_CS80_M3_PR2_P4.0-P7.0',
  pyramid: 'TEK',
  lPhase: 'L-BALL',
  csLevel: 80,
  environment: 'M3',
  pressure: 'PR2',
  positionStart: 'P4.0',
  positionEnd: 'P7.0',
  date: 'Mandag 16. desember 2025',
  startTime: '09:00',
  endTime: '11:00',
  duration: 120,
  location: 'Driving Range, Miklagard',
  status: 'Planlagt',
  blocks: [
    {
      exercise: 'Pyramiden',
      focus: 'Teknikk innspill',
      trainingArea: 'INN100 (100-150m)',
      pyramid: 'TEK',
      lPhase: 'L-BALL',
      csLevel: 80,
      environment: 'M3',
      pressure: 'PR2',
      position: 'P4.0-P7.0',
      reps: 300,
      duration: 30,
      instructions: 'Start med 1 slag, øk til 10, deretter ned igjen. Fokuser på konsistens.',
      completed: false,
    },
    {
      exercise: 'Scattered Targets',
      focus: 'Variasjon og transfer',
      trainingArea: 'INN50 (50-100m)',
      pyramid: 'SLAG',
      lPhase: 'L-AUTO',
      csLevel: 90,
      environment: 'M4',
      pressure: 'PR3',
      reps: 200,
      duration: 30,
      instructions: 'Bytt mål og klubb for hvert slag. Full pre-shot rutine.',
      completed: false,
    },
    {
      exercise: '9-holes Putting',
      focus: 'Spill under press',
      trainingArea: 'PUTT5-10',
      pyramid: 'SPILL',
      lPhase: 'L-AUTO',
      environment: 'M5',
      pressure: 'PR4',
      reps: 50,
      duration: 30,
      instructions: 'Simuler 9 hull. Spill mot par.',
      completed: false,
    },
    {
      exercise: 'Kjernetrening',
      focus: 'Stabilitet og mobilitet',
      trainingArea: 'Fysisk',
      pyramid: 'FYS',
      environment: 'M0',
      pressure: 'PR1',
      reps: 36,
      duration: 30,
      instructions: 'Fokus på hoftemobilitet og kjerneaktivering.',
      completed: false,
    },
  ],
};
