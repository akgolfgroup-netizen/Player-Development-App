/**
 * AK Golf Academy - Session Detail View
 * Design System v3.0 - Premium Light
 *
 * Viser full økt med alle blokker når spiller trykker på en økt.
 * Basert på: APP_FUNCTIONALITY.md Section 6
 *
 * MIGRATED TO PAGE ARCHITECTURE - Zero inline styles
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../ui/raw-blocks/PageHeader.raw';
import { Button } from '../../ui/primitives';

// Helper functions for tag color classes
const getLearningPhaseClasses = (phase) => {
  const classes = {
    Eksponering: 'bg-ak-status-success/15 text-ak-brand-primary',
    Fundamentals: 'bg-ak-status-success/20 text-ak-brand-primary',
    Variasjon: 'bg-ak-status-success/30 text-ak-brand-primary',
    'Timing og Flow': 'bg-ak-status-success/50 text-white',
    Automatisering: 'bg-ak-status-success text-white',
  };
  return classes[phase] || classes.Eksponering;
};

const getCsLevelClasses = (level) => {
  const classes = {
    20: 'bg-ak-surface-subtle text-ak-text-secondary',
    40: 'bg-ak-status-success/15 text-ak-brand-primary',
    60: 'bg-ak-status-success/20 text-ak-brand-primary',
    80: 'bg-ak-status-success/30 text-ak-brand-primary',
    100: 'bg-ak-brand-primary text-white',
  };
  return classes[level] || classes[80];
};

const getEnvironmentClasses = (env) => {
  const classes = {
    M1: 'bg-ak-border-default text-ak-text-primary',
    M2: 'bg-ak-surface-subtle text-ak-text-primary',
    M3: 'bg-ak-status-success/20 text-ak-brand-primary',
    M4: 'bg-ak-status-success/30 text-ak-brand-primary',
    M5: 'bg-ak-brand-primary text-white',
  };
  return classes[env] || classes.M3;
};

const getPressureClasses = (pressure) => {
  const classes = {
    PR1: 'bg-ak-surface-subtle text-ak-text-secondary',
    PR2: 'bg-amber-500/10 text-ak-text-primary',
    PR3: 'bg-ak-status-warning/50 text-ak-text-primary',
    PR4: 'bg-ak-status-warning text-white',
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

// Tag component for block parameters
function Tag({ label, colorClasses }) {
  return (
    <span className={`inline-flex items-center py-1 px-2.5 rounded text-xs font-medium ${colorClasses}`}>
      {label}
    </span>
  );
}

// Single block component
function SessionBlock({ block, index, total, expanded, onToggle, onComplete }) {
  return (
    <div className="bg-ak-surface-base rounded-xl shadow-sm mb-4 overflow-hidden">
      {/* Block header */}
      <div
        onClick={() => onToggle(index)}
        className={`flex justify-between items-center p-4 cursor-pointer ${
          expanded ? 'border-b border-ak-border-default' : ''
        }`}
      >
        <div>
          <span className="text-xs text-ak-text-secondary">
            BLOKK {index + 1} av {total}
          </span>
        </div>
        <span className="text-sm text-ak-text-secondary">
          {block.duration} min
        </span>
      </div>

      {/* Block content */}
      <div className="p-4">
        {/* Exercise name and focus */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">📋</span>
            <span className="text-xl font-semibold text-ak-text-primary">
              {block.exercise}
            </span>
          </div>
          <span className="text-sm text-ak-text-secondary">
            Fokus: {block.focus}
          </span>
        </div>

        {/* Training area */}
        <div className="mb-4">
          <span className="block text-xs text-ak-text-secondary mb-1">
            Treningsområde
          </span>
          <span className="text-[15px] text-ak-text-primary">
            {block.trainingArea}
          </span>
        </div>

        {/* Volume */}
        <div className="mb-4">
          <span className="block text-xs text-ak-text-secondary mb-1">
            Volum
          </span>
          <span className="text-[15px] text-ak-text-primary">
            {block.reps} repetisjoner
          </span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Tag label={block.learningPhase} colorClasses={getLearningPhaseClasses(block.learningPhase)} />
          <Tag label={`CS ${block.csLevel}%`} colorClasses={getCsLevelClasses(block.csLevel)} />
          <Tag label={block.environment} colorClasses={getEnvironmentClasses(block.environment)} />
          <Tag label={block.pressureRating} colorClasses={getPressureClasses(block.pressureRating)} />
        </div>

        {/* Instructions toggle (expanded view) */}
        {expanded && block.instructions && (
          <div className="bg-ak-surface-subtle rounded-lg p-4 mb-4">
            <span className="block text-xs font-medium text-ak-brand-primary mb-1">
              Instruksjoner
            </span>
            <span className="text-sm text-ak-text-primary">
              {block.instructions}
            </span>
          </div>
        )}

        {/* Complete checkbox */}
        <button
          onClick={() => onComplete(index)}
          className={`flex items-center justify-center w-full p-4 border-none rounded-lg cursor-pointer text-xs font-medium ${
            block.completed
              ? 'bg-ak-status-success text-white'
              : 'bg-ak-surface-subtle text-ak-text-primary'
          }`}
        >
          {block.completed ? '✓ Fullført' : '☐ Marker som fullført'}
        </button>
      </div>
    </div>
  );
}

// Main SessionDetailView component
export default function SessionDetailView({ session, onBack, onStartSession }) {
  const navigate = useNavigate();
  const [expandedBlocks, setExpandedBlocks] = useState({});
  const [blocks, setBlocks] = useState(session?.blocks || []);

  // Navigate to evaluation form
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
      <div className="p-6 text-center">
        <span className="text-[15px] text-ak-text-secondary">
          Ingen økt valgt
        </span>
      </div>
    );
  }

  return (
    <div className="bg-ak-surface-base min-h-screen font-sans">
      {/* Header - using PageHeader from design system */}
      <PageHeader
        title="Treningsøkt"
        subtitle={session.date}
        onBack={onBack}
        actions={
          <Button variant="ghost" size="sm">
            ⋮
          </Button>
        }
      />

      {/* Session info */}
      <div className="p-6">
        <span className="text-xs text-ak-text-secondary tracking-wide">
          TRENINGSØKT
        </span>
        <div className="h-0.5 bg-ak-brand-primary mt-1 mb-4" />

        {/* Date, time, location */}
        <div className="flex flex-col gap-2 mb-6">
          <div className="flex items-center gap-2">
            <span>📅</span>
            <span className="text-[15px] text-ak-text-primary">
              {session.date}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span>🕐</span>
            <span className="text-[15px] text-ak-text-primary">
              {session.startTime} - {session.endTime} ({session.duration} min)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span>📍</span>
            <span className="text-[15px] text-ak-text-primary">
              {session.location}
            </span>
          </div>
        </div>

        {/* Status */}
        <div className="mb-6">
          <span className={`inline-flex items-center py-1.5 px-3 rounded-full text-xs font-semibold ${getStatusClasses(session.status)}`}>
            {session.status}
          </span>
        </div>

        {/* Blocks */}
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

        {/* Notes */}
        <div className="bg-ak-surface-base rounded-xl p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span>📝</span>
            <span className="text-xs font-medium text-ak-text-primary">
              Notater
            </span>
          </div>
          <textarea
            placeholder="Legg til notater fra økten..."
            className="w-full min-h-[80px] p-4 bg-ak-surface-subtle border-none rounded-lg resize-y text-sm text-ak-text-primary"
          />
        </div>

        {/* Action buttons based on session status */}
        <div className="flex flex-col gap-2">
          {/* Start session button - only for planned sessions */}
          {session.status === 'Planlagt' && (
            <Button
              variant="primary"
              onClick={onStartSession}
              className="w-full"
            >
              Start økt
            </Button>
          )}

          {/* Evaluate button - for in-progress sessions */}
          {(session.status === 'Pågår' || session.completionStatus === 'in_progress') && (
            <Button
              variant="primary"
              onClick={handleEvaluate}
              className="w-full bg-ak-status-success hover:bg-ak-status-success/90"
            >
              Evaluer økt
            </Button>
          )}

          {/* Continue session button - for in-progress */}
          {session.status === 'Pågår' && onStartSession && (
            <Button
              variant="primary"
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

// Demo data for testing
export const demoSession = {
  id: '1',
  date: 'Mandag 16. desember 2025',
  startTime: '09:00',
  endTime: '11:00',
  duration: 120,
  location: 'Driving Range, Miklagard',
  status: 'Planlagt',
  blocks: [
    {
      exercise: 'Pyramiden',
      focus: 'Teknikk',
      trainingArea: 'Innspill 100-150 meter',
      reps: 300,
      duration: 30,
      learningPhase: 'Ball',
      csLevel: 80,
      environment: 'M3',
      pressureRating: 'PR2',
      instructions: 'Start med 1 slag, øk til 10, deretter ned igjen. Fokuser på konsistens.',
      completed: false,
    },
    {
      exercise: 'Scattered',
      focus: 'Variasjon',
      trainingArea: 'Innspill 50-100 meter',
      reps: 200,
      duration: 30,
      learningPhase: 'Transfer',
      csLevel: 90,
      environment: 'M4',
      pressureRating: 'PR3',
      instructions: 'Bytt mål og klubb for hvert slag. Full pre-shot rutine.',
      completed: false,
    },
    {
      exercise: '9-holes putting',
      focus: 'Spill',
      trainingArea: 'Putting',
      reps: 50,
      duration: 30,
      learningPhase: 'Spill',
      csLevel: 100,
      environment: 'M5',
      pressureRating: 'PR4',
      instructions: 'Simuler 9 hull. Spill mot par.',
      completed: false,
    },
    {
      exercise: 'Fysisk: Mobilitet',
      focus: 'Kjernemuskulatur',
      trainingArea: 'Fysisk',
      reps: 36, // 3 sett x 12
      duration: 30,
      learningPhase: 'Ball',
      csLevel: 60,
      environment: 'M1',
      pressureRating: 'PR2',
      instructions: 'Fokus på hoftemobilitet og kjerneaktivering.',
      completed: false,
    },
  ],
};
