/**
 * SessionDetailView - Treningsøkt Detaljvisning
 *
 * Viser full økt med alle blokker når spiller trykker på en økt.
 * Basert på: APP_FUNCTIONALITY.md Section 6
 * Design: Blue Palette 01 (v3.0)
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// ===== AK GOLF DESIGN TOKENS v3.0 (Blue Palette 01) =====
const tokens = {
  colors: {
    // Brand Colors - Blue Palette 01
    primary: '#10456A',
    primaryLight: '#2C5F7F',
    snow: '#EDF0F2',
    surface: '#EBE5DA',
    gold: '#C9A227',
    // Semantic Colors
    success: '#4A7C59',
    warning: '#D4A84B',
    error: '#C45B4E',
    // Neutrals
    charcoal: '#1C1C1E',
    steel: '#8E8E93',
    mist: '#E5E5EA',
    cloud: '#F2F2F7',
    white: '#FFFFFF',
  },
  spacing: { xs: '4px', sm: '8px', md: '16px', lg: '24px', xl: '32px' },
  borderRadius: { sm: '4px', md: '8px', lg: '12px', full: '9999px' },
  shadows: { card: '0 2px 8px rgba(0,0,0,0.08)' },
  typography: { fontFamily: 'Inter, -apple-system, system-ui, sans-serif' },
};

// Typography style helper
const typographyStyle = (variant) => {
  const styles = {
    title3: { fontSize: '17px', fontWeight: 600, lineHeight: 1.3 },
    body: { fontSize: '15px', fontWeight: 400, lineHeight: 1.5 },
    callout: { fontSize: '14px', fontWeight: 400, lineHeight: 1.4 },
    caption: { fontSize: '12px', fontWeight: 500, lineHeight: 1.3, letterSpacing: '0.5px' },
    label: { fontSize: '13px', fontWeight: 600, lineHeight: 1.3 },
  };
  return styles[variant] || styles.body;
};

// Learning phase colors - Blue Palette 01
const learningPhaseColors = {
  Ball: { bg: `${tokens.colors.success}15`, text: tokens.colors.primary },
  Teknikk: { bg: `${tokens.colors.success}20`, text: tokens.colors.primary },
  Transfer: { bg: `${tokens.colors.success}30`, text: tokens.colors.primary },
  Variasjon: { bg: `${tokens.colors.success}50`, text: tokens.colors.white },
  Spill: { bg: tokens.colors.success, text: tokens.colors.white },
};

// CS level colors - Blue Palette 01
const csLevelColors = {
  20: { bg: tokens.colors.snow, text: tokens.colors.steel },
  40: { bg: `${tokens.colors.success}15`, text: tokens.colors.primary },
  60: { bg: `${tokens.colors.success}20`, text: tokens.colors.primary },
  80: { bg: `${tokens.colors.success}30`, text: tokens.colors.primary },
  100: { bg: tokens.colors.primary, text: tokens.colors.white },
};

// Environment colors - Blue Palette 01
const environmentColors = {
  M1: { bg: tokens.colors.mist, text: tokens.colors.charcoal, label: 'Inne' },
  M2: { bg: tokens.colors.snow, text: tokens.colors.charcoal, label: 'Matte' },
  M3: { bg: `${tokens.colors.success}20`, text: tokens.colors.primary, label: 'Treningsområde' },
  M4: { bg: `${tokens.colors.success}30`, text: tokens.colors.primary, label: 'Øvingsbane' },
  M5: { bg: tokens.colors.primary, text: tokens.colors.white, label: 'Bane' },
};

// Pressure rating colors - Blue Palette 01
const pressureColors = {
  PR1: { bg: tokens.colors.snow, text: tokens.colors.steel, label: 'Ingen press' },
  PR2: { bg: `${tokens.colors.gold}10`, text: tokens.colors.charcoal, label: 'Lavt press' },
  PR3: { bg: `${tokens.colors.warning}50`, text: tokens.colors.charcoal, label: 'Medium press' },
  PR4: { bg: tokens.colors.warning, text: tokens.colors.white, label: 'Høyt press' },
  PR5: { bg: tokens.colors.gold, text: tokens.colors.white, label: 'Maks press' },
};

// Tag component for block parameters
function Tag({ label, color }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '4px 10px',
        borderRadius: tokens.borderRadius.sm,
        backgroundColor: color.bg,
        color: color.text,
        ...typographyStyle('caption'),
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
        backgroundColor: tokens.colors.white,
        borderRadius: tokens.borderRadius.lg,
        boxShadow: tokens.shadows.card,
        marginBottom: tokens.spacing.md,
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
          padding: tokens.spacing.md,
          cursor: 'pointer',
          borderBottom: expanded ? `1px solid ${tokens.colors.mist}` : 'none',
        }}
      >
        <div>
          <span style={{ ...typographyStyle('caption'), color: tokens.colors.steel }}>
            BLOKK {index + 1} av {total}
          </span>
        </div>
        <span style={{ ...typographyStyle('callout'), color: tokens.colors.steel }}>
          {block.duration} min
        </span>
      </div>

      {/* Block content */}
      <div style={{ padding: tokens.spacing.md }}>
        {/* Exercise name and focus */}
        <div style={{ marginBottom: tokens.spacing.md }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing.sm, marginBottom: tokens.spacing.xs }}>
            <span style={{ fontSize: '18px' }}>📋</span>
            <span style={{ ...typographyStyle('title3'), color: tokens.colors.charcoal }}>
              {block.exercise}
            </span>
          </div>
          <span style={{ ...typographyStyle('callout'), color: tokens.colors.steel }}>
            Fokus: {block.focus}
          </span>
        </div>

        {/* Training area */}
        <div style={{ marginBottom: tokens.spacing.md }}>
          <span style={{ ...typographyStyle('caption'), color: tokens.colors.steel, display: 'block', marginBottom: tokens.spacing.xs }}>
            Treningsområde
          </span>
          <span style={{ ...typographyStyle('body'), color: tokens.colors.charcoal }}>
            {block.trainingArea}
          </span>
        </div>

        {/* Volume */}
        <div style={{ marginBottom: tokens.spacing.md }}>
          <span style={{ ...typographyStyle('caption'), color: tokens.colors.steel, display: 'block', marginBottom: tokens.spacing.xs }}>
            Volum
          </span>
          <span style={{ ...typographyStyle('body'), color: tokens.colors.charcoal }}>
            {block.reps} repetisjoner
          </span>
        </div>

        {/* Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: tokens.spacing.sm, marginBottom: tokens.spacing.md }}>
          <Tag label={block.learningPhase} color={phaseColor} />
          <Tag label={`CS ${block.csLevel}%`} color={csColor} />
          <Tag label={block.environment} color={envColor} />
          <Tag label={block.pressureRating} color={pressColor} />
        </div>

        {/* Instructions toggle (expanded view) */}
        {expanded && block.instructions && (
          <div
            style={{
              backgroundColor: tokens.colors.snow,
              borderRadius: tokens.borderRadius.md,
              padding: tokens.spacing.md,
              marginBottom: tokens.spacing.md,
            }}
          >
            <span style={{ ...typographyStyle('label'), color: tokens.colors.primary, display: 'block', marginBottom: tokens.spacing.xs }}>
              Instruksjoner
            </span>
            <span style={{ ...typographyStyle('callout'), color: tokens.colors.charcoal }}>
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
            padding: tokens.spacing.md,
            backgroundColor: block.completed ? tokens.colors.success : tokens.colors.snow,
            color: block.completed ? tokens.colors.white : tokens.colors.charcoal,
            border: 'none',
            borderRadius: tokens.borderRadius.md,
            cursor: 'pointer',
            ...typographyStyle('label'),
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
      Planlagt: { bg: tokens.colors.snow, text: tokens.colors.steel },
      Pågår: { bg: tokens.colors.warning, text: tokens.colors.white },
      Fullført: { bg: tokens.colors.success, text: tokens.colors.white },
    };
    const style = styles[status] || styles.Planlagt;

    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          padding: '6px 12px',
          borderRadius: tokens.borderRadius.full,
          backgroundColor: style.bg,
          color: style.text,
          ...typographyStyle('caption'),
          fontWeight: 600,
        }}
      >
        {status}
      </span>
    );
  };

  if (!session) {
    return (
      <div style={{ padding: tokens.spacing.lg, textAlign: 'center' }}>
        <span style={{ ...typographyStyle('body'), color: tokens.colors.steel }}>
          Ingen økt valgt
        </span>
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: tokens.colors.surface,
      minHeight: '100vh',
      fontFamily: tokens.typography.fontFamily,
    }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: tokens.spacing.md,
          backgroundColor: tokens.colors.white,
          borderBottom: `1px solid ${tokens.colors.mist}`,
        }}
      >
        <button
          onClick={onBack}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: tokens.spacing.xs,
            background: 'none',
            border: 'none',
            color: tokens.colors.primary,
            cursor: 'pointer',
            ...typographyStyle('body'),
          }}
        >
          ← Tilbake
        </button>
        <button
          style={{
            background: 'none',
            border: 'none',
            color: tokens.colors.steel,
            cursor: 'pointer',
            fontSize: '20px',
          }}
        >
          ⋮
        </button>
      </div>

      {/* Session info */}
      <div style={{ padding: tokens.spacing.lg }}>
        <span style={{ ...typographyStyle('caption'), color: tokens.colors.steel, letterSpacing: '0.5px' }}>
          TRENINGSØKT
        </span>
        <div
          style={{
            height: '2px',
            backgroundColor: tokens.colors.primary,
            marginTop: tokens.spacing.xs,
            marginBottom: tokens.spacing.md,
          }}
        />

        {/* Date, time, location */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.sm, marginBottom: tokens.spacing.lg }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing.sm }}>
            <span>📅</span>
            <span style={{ ...typographyStyle('body'), color: tokens.colors.charcoal }}>
              {session.date}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing.sm }}>
            <span>🕐</span>
            <span style={{ ...typographyStyle('body'), color: tokens.colors.charcoal }}>
              {session.startTime} - {session.endTime} ({session.duration} min)
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing.sm }}>
            <span>📍</span>
            <span style={{ ...typographyStyle('body'), color: tokens.colors.charcoal }}>
              {session.location}
            </span>
          </div>
        </div>

        {/* Status */}
        <div style={{ marginBottom: tokens.spacing.lg }}>
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
            backgroundColor: tokens.colors.white,
            borderRadius: tokens.borderRadius.lg,
            padding: tokens.spacing.md,
            marginBottom: tokens.spacing.lg,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing.sm, marginBottom: tokens.spacing.sm }}>
            <span>📝</span>
            <span style={{ ...typographyStyle('label'), color: tokens.colors.charcoal }}>
              Notater
            </span>
          </div>
          <textarea
            placeholder="Legg til notater fra økten..."
            style={{
              width: '100%',
              minHeight: '80px',
              padding: tokens.spacing.md,
              backgroundColor: tokens.colors.snow,
              border: 'none',
              borderRadius: tokens.borderRadius.md,
              resize: 'vertical',
              ...typographyStyle('callout'),
            }}
          />
        </div>

        {/* Action buttons based on session status */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.sm }}>
          {/* Start session button - only for planned sessions */}
          {session.status === 'Planlagt' && (
            <button
              onClick={onStartSession}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                padding: tokens.spacing.md,
                backgroundColor: tokens.colors.primary,
                color: tokens.colors.white,
                border: 'none',
                borderRadius: tokens.borderRadius.md,
                cursor: 'pointer',
                ...typographyStyle('title3'),
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
                padding: tokens.spacing.md,
                backgroundColor: tokens.colors.success,
                color: tokens.colors.white,
                border: 'none',
                borderRadius: tokens.borderRadius.md,
                cursor: 'pointer',
                ...typographyStyle('title3'),
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
                padding: tokens.spacing.md,
                backgroundColor: tokens.colors.primary,
                color: tokens.colors.white,
                border: 'none',
                borderRadius: tokens.borderRadius.md,
                cursor: 'pointer',
                ...typographyStyle('title3'),
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
