/**
 * SessionDetailView - Treningsøkt Detaljvisning
 *
 * Viser full økt med alle blokker når spiller trykker på en økt.
 * Basert på: APP_FUNCTIONALITY.md Section 6
 * Design: Blue Palette 01 (v3.0)
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { tokens } from '../../design-tokens';

// Learning phase colors - Blue Palette 01
const learningPhaseColors = {
  Ball: { bg: 'rgba(var(--success-rgb), 0.15)', text: 'var(--accent)' },
  Teknikk: { bg: 'rgba(var(--success-rgb), 0.2)', text: 'var(--accent)' },
  Transfer: { bg: 'rgba(var(--success-rgb), 0.3)', text: 'var(--accent)' },
  Variasjon: { bg: 'rgba(var(--success-rgb), 0.5)', text: 'var(--bg-primary)' },
  Spill: { bg: 'var(--success)', text: 'var(--bg-primary)' },
};

// CS level colors - Blue Palette 01
const csLevelColors = {
  20: { bg: 'var(--bg-secondary)', text: 'var(--text-secondary)' },
  40: { bg: 'rgba(var(--success-rgb), 0.15)', text: 'var(--accent)' },
  60: { bg: 'rgba(var(--success-rgb), 0.2)', text: 'var(--accent)' },
  80: { bg: 'rgba(var(--success-rgb), 0.3)', text: 'var(--accent)' },
  100: { bg: 'var(--accent)', text: 'var(--bg-primary)' },
};

// Environment colors - Blue Palette 01
const environmentColors = {
  M1: { bg: 'var(--border-default)', text: 'var(--text-primary)', label: 'Inne' },
  M2: { bg: 'var(--bg-secondary)', text: 'var(--text-primary)', label: 'Matte' },
  M3: { bg: 'rgba(var(--success-rgb), 0.2)', text: 'var(--accent)', label: 'Treningsområde' },
  M4: { bg: 'rgba(var(--success-rgb), 0.3)', text: 'var(--accent)', label: 'Øvingsbane' },
  M5: { bg: 'var(--accent)', text: 'var(--bg-primary)', label: 'Bane' },
};

// Pressure rating colors - Blue Palette 01
const pressureColors = {
  PR1: { bg: 'var(--bg-secondary)', text: 'var(--text-secondary)', label: 'Ingen press' },
  PR2: { bg: 'rgba(var(--achievement-rgb), 0.1)', text: 'var(--text-primary)', label: 'Lavt press' },
  PR3: { bg: 'rgba(var(--warning-rgb), 0.5)', text: 'var(--text-primary)', label: 'Medium press' },
  PR4: { bg: 'var(--warning)', text: 'var(--bg-primary)', label: 'Høyt press' },
  PR5: { bg: 'var(--achievement)', text: 'var(--bg-primary)', label: 'Maks press' },
};

// Tag component for block parameters
function Tag({ label, color }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '4px 10px',
        borderRadius: 'var(--radius-sm)',
        backgroundColor: color.bg,
        color: color.text,
        fontSize: '12px', lineHeight: '16px',
        fontWeight: 500,
      }}
    >
      {label}
    </span>
  );
}

// Single block component
function SessionBlock({ block, index, total, expanded, onToggle, onComplete }) {
  const phaseColor = learningPhaseColors[block.learningPhase] || learningPhaseColors.Ball;
  const csColor = csLevelColors[block.csLevel] || csLevelColors[80];
  const envColor = environmentColors[block.environment] || environmentColors.M3;
  const pressColor = pressureColors[block.pressureRating] || pressureColors.PR2;

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-primary)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-card)',
        marginBottom: '16px',
        overflow: 'hidden',
      }}
    >
      {/* Block header */}
      <div
        onClick={() => onToggle(index)}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px',
          cursor: 'pointer',
          borderBottom: expanded ? '1px solid var(--border-default)' : 'none',
        }}
      >
        <div>
          <span style={{ fontSize: '12px', lineHeight: '16px', color: 'var(--text-secondary)' }}>
            BLOKK {index + 1} av {total}
          </span>
        </div>
        <span style={{ fontSize: '14px', lineHeight: '19px', color: 'var(--text-secondary)' }}>
          {block.duration} min
        </span>
      </div>

      {/* Block content */}
      <div style={{ padding: '16px' }}>
        {/* Exercise name and focus */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '18px' }}>📋</span>
            <span style={{ fontSize: '20px', lineHeight: '25px', fontWeight: 600, color: 'var(--text-primary)' }}>
              {block.exercise}
            </span>
          </div>
          <span style={{ fontSize: '14px', lineHeight: '19px', color: 'var(--text-secondary)' }}>
            Fokus: {block.focus}
          </span>
        </div>

        {/* Training area */}
        <div style={{ marginBottom: '16px' }}>
          <span style={{ fontSize: '12px', lineHeight: '16px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
            Treningsområde
          </span>
          <span style={{ fontSize: '15px', lineHeight: '20px', color: 'var(--text-primary)' }}>
            {block.trainingArea}
          </span>
        </div>

        {/* Volume */}
        <div style={{ marginBottom: '16px' }}>
          <span style={{ fontSize: '12px', lineHeight: '16px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
            Volum
          </span>
          <span style={{ fontSize: '15px', lineHeight: '20px', color: 'var(--text-primary)' }}>
            {block.reps} repetisjoner
          </span>
        </div>

        {/* Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
          <Tag label={block.learningPhase} color={phaseColor} />
          <Tag label={`CS ${block.csLevel}%`} color={csColor} />
          <Tag label={block.environment} color={envColor} />
          <Tag label={block.pressureRating} color={pressColor} />
        </div>

        {/* Instructions toggle (expanded view) */}
        {expanded && block.instructions && (
          <div
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              marginBottom: '16px',
            }}
          >
            <span style={{ fontSize: '12px', lineHeight: '16px', fontWeight: 500, color: 'var(--accent)', display: 'block', marginBottom: '4px' }}>
              Instruksjoner
            </span>
            <span style={{ fontSize: '14px', lineHeight: '19px', color: 'var(--text-primary)' }}>
              {block.instructions}
            </span>
          </div>
        )}

        {/* Complete checkbox */}
        <button
          onClick={() => onComplete(index)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            padding: '16px',
            backgroundColor: block.completed ? 'var(--success)' : 'var(--bg-secondary)',
            color: block.completed ? 'var(--bg-primary)' : 'var(--text-primary)',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
            fontSize: '12px', lineHeight: '16px', fontWeight: 500,
          }}
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

  // Status badge
  const getStatusBadge = (status) => {
    const styles = {
      Planlagt: { bg: 'var(--bg-secondary)', text: 'var(--text-secondary)' },
      Pågår: { bg: 'var(--warning)', text: 'var(--bg-primary)' },
      Fullført: { bg: 'var(--success)', text: 'var(--bg-primary)' },
    };
    const style = styles[status] || styles.Planlagt;

    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          padding: '6px 12px',
          borderRadius: '9999px',
          backgroundColor: style.bg,
          color: style.text,
          fontSize: '12px', lineHeight: '16px',
          fontWeight: 600,
        }}
      >
        {status}
      </span>
    );
  };

  if (!session) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <span style={{ fontSize: '15px', lineHeight: '20px', color: 'var(--text-secondary)' }}>
          Ingen økt valgt
        </span>
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: 'var(--bg-primary)',
      minHeight: '100vh',
      fontFamily: 'Inter, -apple-system, system-ui, sans-serif',
    }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px',
          backgroundColor: 'var(--bg-primary)',
          borderBottom: '1px solid var(--border-default)',
        }}
      >
        <button
          onClick={onBack}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: 'none',
            border: 'none',
            color: 'var(--accent)',
            cursor: 'pointer',
            fontSize: '15px', lineHeight: '20px',
          }}
        >
          ← Tilbake
        </button>
        <button
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            fontSize: '20px',
          }}
        >
          ⋮
        </button>
      </div>

      {/* Session info */}
      <div style={{ padding: '24px' }}>
        <span style={{ fontSize: '12px', lineHeight: '16px', color: 'var(--text-secondary)', letterSpacing: '0.5px' }}>
          TRENINGSØKT
        </span>
        <div
          style={{
            height: '2px',
            backgroundColor: 'var(--accent)',
            marginTop: '4px',
            marginBottom: '16px',
          }}
        />

        {/* Date, time, location */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>📅</span>
            <span style={{ fontSize: '15px', lineHeight: '20px', color: 'var(--text-primary)' }}>
              {session.date}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🕐</span>
            <span style={{ fontSize: '15px', lineHeight: '20px', color: 'var(--text-primary)' }}>
              {session.startTime} - {session.endTime} ({session.duration} min)
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>📍</span>
            <span style={{ fontSize: '15px', lineHeight: '20px', color: 'var(--text-primary)' }}>
              {session.location}
            </span>
          </div>
        </div>

        {/* Status */}
        <div style={{ marginBottom: '24px' }}>
          {getStatusBadge(session.status)}
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
        <div
          style={{
            backgroundColor: 'var(--bg-primary)',
            borderRadius: 'var(--radius-lg)',
            padding: '16px',
            marginBottom: '24px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span>📝</span>
            <span style={{ fontSize: '12px', lineHeight: '16px', fontWeight: 500, color: 'var(--text-primary)' }}>
              Notater
            </span>
          </div>
          <textarea
            placeholder="Legg til notater fra økten..."
            style={{
              width: '100%',
              minHeight: '80px',
              padding: '16px',
              backgroundColor: 'var(--bg-secondary)',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              resize: 'vertical',
              fontSize: '14px', lineHeight: '19px',
            }}
          />
        </div>

        {/* Action buttons based on session status */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {/* Start session button - only for planned sessions */}
          {session.status === 'Planlagt' && (
            <button
              onClick={onStartSession}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                padding: '16px',
                backgroundColor: 'var(--accent)',
                color: 'var(--bg-primary)',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                fontSize: '20px', lineHeight: '25px', fontWeight: 600,
              }}
            >
              Start økt
            </button>
          )}

          {/* Evaluate button - for in-progress sessions */}
          {(session.status === 'Pågår' || session.completionStatus === 'in_progress') && (
            <button
              onClick={handleEvaluate}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                padding: '16px',
                backgroundColor: 'var(--success)',
                color: 'var(--bg-primary)',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                fontSize: '20px', lineHeight: '25px', fontWeight: 600,
              }}
            >
              Evaluer økt
            </button>
          )}

          {/* Continue session button - for in-progress */}
          {session.status === 'Pågår' && onStartSession && (
            <button
              onClick={onStartSession}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                padding: '16px',
                backgroundColor: 'var(--accent)',
                color: 'var(--bg-primary)',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                fontSize: '20px', lineHeight: '25px', fontWeight: 600,
              }}
            >
              Fortsett økt
            </button>
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
