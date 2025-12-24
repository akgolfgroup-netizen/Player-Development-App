/**
 * BlockRatingModal - Kvalitetsvurdering etter fullført blokk
 *
 * Vises når spiller fullfører en blokk.
 * Basert på: APP_FUNCTIONALITY.md Section 7.5
 * Design: /packages/design-system/figma/ak_golf_complete_figma_kit.svg
 */
import React, { useState } from 'react';
import { tokens, typographyStyle } from '../../design-tokens';

// Format time as MM:SS
function formatTimeShort(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Rating scale component
function RatingScale({ label, value, onChange, icons, labels }) {
  return (
    <div style={{ marginBottom: tokens.spacing.lg }}>
      <span style={{ ...typographyStyle('label'), color: tokens.colors.charcoal, display: 'block', marginBottom: tokens.spacing.sm }}>
        {label}
      </span>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          backgroundColor: tokens.colors.foam,
          borderRadius: tokens.borderRadius.md,
          padding: tokens.spacing.md,
        }}
      >
        {[1, 2, 3, 4, 5].map((rating) => (
          <button
            key={rating}
            onClick={() => onChange(rating)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: tokens.spacing.sm,
              backgroundColor: value === rating ? tokens.colors.forest : 'transparent',
              border: 'none',
              borderRadius: tokens.borderRadius.sm,
              cursor: 'pointer',
              minWidth: '48px',
            }}
          >
            <span style={{ fontSize: '24px' }}>{icons[rating - 1]}</span>
            <span
              style={{
                ...typographyStyle('caption'),
                color: value === rating ? tokens.colors.white : tokens.colors.steel,
                marginTop: tokens.spacing.xs,
              }}
            >
              {rating}
            </span>
          </button>
        ))}
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: tokens.spacing.xs,
        }}
      >
        <span style={{ ...typographyStyle('caption'), color: tokens.colors.steel }}>
          {labels[0]}
        </span>
        <span style={{ ...typographyStyle('caption'), color: tokens.colors.steel }}>
          {labels[1]}
        </span>
      </div>
    </div>
  );
}

// Main BlockRatingModal component
export default function BlockRatingModal({ block, duration, reps, onComplete, onSkip }) {
  const [quality, setQuality] = useState(0);
  const [focus, setFocus] = useState(0);
  const [intensity, setIntensity] = useState(0);
  const [note, setNote] = useState('');

  const handleSubmit = () => {
    onComplete({
      quality,
      focus,
      intensity,
      note,
    });
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: tokens.spacing.md,
      }}
    >
      <div
        style={{
          backgroundColor: tokens.colors.white,
          borderRadius: tokens.borderRadius.lg,
          padding: tokens.spacing.lg,
          width: '100%',
          maxWidth: '400px',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: tokens.spacing.lg }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: tokens.spacing.sm, marginBottom: tokens.spacing.sm }}>
            <span style={{ color: tokens.colors.success, fontSize: '24px' }}>✓</span>
            <span style={{ ...typographyStyle('title2'), color: tokens.colors.charcoal }}>
              Blokk fullført
            </span>
          </div>
          <div
            style={{
              height: '2px',
              backgroundColor: tokens.colors.mist,
              marginBottom: tokens.spacing.md,
            }}
          />
        </div>

        {/* Block summary */}
        <div
          style={{
            backgroundColor: tokens.colors.foam,
            borderRadius: tokens.borderRadius.md,
            padding: tokens.spacing.md,
            marginBottom: tokens.spacing.lg,
          }}
        >
          <div style={{ ...typographyStyle('label'), color: tokens.colors.forest }}>
            {block.exercise}: {block.focus}
          </div>
          <div style={{ ...typographyStyle('callout'), color: tokens.colors.steel }}>
            {block.trainingArea} • {reps} reps • {formatTimeShort(duration)}
          </div>
        </div>

        {/* Question */}
        <div style={{ ...typographyStyle('title3'), color: tokens.colors.charcoal, marginBottom: tokens.spacing.lg, textAlign: 'center' }}>
          Hvordan gikk det?
        </div>

        {/* Rating scales */}
        <RatingScale
          label="Kvalitet"
          value={quality}
          onChange={setQuality}
          icons={['😟', '😐', '🙂', '😊', '🤩']}
          labels={['Dårlig', 'Utmerket']}
        />

        <RatingScale
          label="Fokus"
          value={focus}
          onChange={setFocus}
          icons={['😟', '😐', '🙂', '😊', '🤩']}
          labels={['Distrahert', 'Laserfokusert']}
        />

        <RatingScale
          label="Intensitet"
          value={intensity}
          onChange={setIntensity}
          icons={['💤', '😴', '💪', '🔥', '⚡']}
          labels={['Lav', 'Høy']}
        />

        {/* Note */}
        <div style={{ marginBottom: tokens.spacing.lg }}>
          <span style={{ ...typographyStyle('label'), color: tokens.colors.charcoal, display: 'block', marginBottom: tokens.spacing.sm }}>
            Notat (valgfritt)
          </span>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Følte god kontakt på de siste 100 slagene..."
            style={{
              width: '100%',
              minHeight: '80px',
              padding: tokens.spacing.md,
              backgroundColor: tokens.colors.foam,
              border: 'none',
              borderRadius: tokens.borderRadius.md,
              resize: 'vertical',
              ...typographyStyle('callout'),
            }}
          />
        </div>

        {/* Buttons */}
        <button
          onClick={handleSubmit}
          disabled={quality === 0 || focus === 0 || intensity === 0}
          style={{
            width: '100%',
            padding: tokens.spacing.md,
            backgroundColor: (quality === 0 || focus === 0 || intensity === 0)
              ? tokens.colors.mist
              : tokens.colors.forest,
            color: (quality === 0 || focus === 0 || intensity === 0)
              ? tokens.colors.steel
              : tokens.colors.white,
            border: 'none',
            borderRadius: tokens.borderRadius.md,
            cursor: (quality === 0 || focus === 0 || intensity === 0) ? 'not-allowed' : 'pointer',
            marginBottom: tokens.spacing.md,
            ...typographyStyle('title3'),
          }}
        >
          Lagre og fortsett →
        </button>

        <button
          onClick={onSkip}
          style={{
            width: '100%',
            padding: tokens.spacing.sm,
            backgroundColor: 'transparent',
            color: tokens.colors.steel,
            border: 'none',
            cursor: 'pointer',
            ...typographyStyle('callout'),
          }}
        >
          Hopp over
        </button>
      </div>
    </div>
  );
}
