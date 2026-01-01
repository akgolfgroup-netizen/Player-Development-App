/**
 * BlockRatingModal - Kvalitetsvurdering etter fullført blokk
 *
 * Vises når spiller fullfører en blokk.
 * Basert på: APP_FUNCTIONALITY.md Section 7.5
 * Design: /packages/design-system/figma/ak_golf_complete_figma_kit.svg
 */
import React, { useState } from 'react';
import Button from '../../ui/primitives/Button';

// Format time as MM:SS
function formatTimeShort(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Rating scale component
function RatingScale({ label, value, onChange, icons, labels }) {
  return (
    <div style={{ marginBottom: '24px' }}>
      <span style={{ fontSize: '15px', lineHeight: '20px', fontWeight: 500, color: 'var(--text-primary)', display: 'block', marginBottom: '8px' }}>
        {label}
      </span>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-md)',
          padding: '16px',
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
              padding: '8px',
              backgroundColor: value === rating ? 'var(--accent)' : 'transparent',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              minWidth: '48px',
            }}
          >
            <span style={{ fontSize: '24px' }}>{icons[rating - 1]}</span>
            <span
              style={{
                fontSize: '12px', lineHeight: '16px',
                color: value === rating ? 'var(--bg-primary)' : 'var(--text-secondary)',
                marginTop: '4px',
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
          marginTop: '4px',
        }}
      >
        <span style={{ fontSize: '12px', lineHeight: '16px', color: 'var(--text-secondary)' }}>
          {labels[0]}
        </span>
        <span style={{ fontSize: '12px', lineHeight: '16px', color: 'var(--text-secondary)' }}>
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
        padding: '16px',
      }}
    >
      <div
        style={{
          backgroundColor: 'var(--bg-primary)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
          width: '100%',
          maxWidth: '400px',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{ color: 'var(--success)', fontSize: '24px' }}>✓</span>
            <span style={{ fontSize: '22px', lineHeight: '28px', fontWeight: 700, color: 'var(--text-primary)' }}>
              Blokk fullført
            </span>
          </div>
          <div
            style={{
              height: '2px',
              backgroundColor: 'var(--border-default)',
              marginBottom: '16px',
            }}
          />
        </div>

        {/* Block summary */}
        <div
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
            marginBottom: '24px',
          }}
        >
          <div style={{ fontSize: '15px', lineHeight: '20px', fontWeight: 500, color: 'var(--accent)' }}>
            {block.exercise}: {block.focus}
          </div>
          <div style={{ fontSize: '16px', lineHeight: '21px', fontWeight: 400, color: 'var(--text-secondary)' }}>
            {block.trainingArea} • {reps} reps • {formatTimeShort(duration)}
          </div>
        </div>

        {/* Question */}
        <div style={{ fontSize: '20px', lineHeight: '25px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '24px', textAlign: 'center' }}>
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
        <div style={{ marginBottom: '24px' }}>
          <span style={{ fontSize: '15px', lineHeight: '20px', fontWeight: 500, color: 'var(--text-primary)', display: 'block', marginBottom: '8px' }}>
            Notat (valgfritt)
          </span>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Følte god kontakt på de siste 100 slagene..."
            style={{
              width: '100%',
              minHeight: '80px',
              padding: '16px',
              backgroundColor: 'var(--bg-secondary)',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              resize: 'vertical',
              fontSize: '16px', lineHeight: '21px', fontWeight: 400,
            }}
          />
        </div>

        {/* Buttons */}
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={quality === 0 || focus === 0 || intensity === 0}
          style={{ width: '100%', marginBottom: '16px' }}
        >
          Lagre og fortsett →
        </Button>

        <Button
          variant="ghost"
          onClick={onSkip}
          style={{ width: '100%' }}
        >
          Hopp over
        </Button>
      </div>
    </div>
  );
}
