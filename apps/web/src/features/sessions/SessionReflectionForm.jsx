/**
 * SessionReflectionForm - Refleksjon etter fullført økt
 *
 * Samler data for treningsanalyse og utvikling.
 * Basert på: APP_FUNCTIONALITY.md Section 8
 * Design: /packages/design-system/figma/ak_golf_complete_figma_kit.svg
 */
import React, { useState } from 'react';
import { tokens, typographyStyle } from '../../design-tokens';

// Format time as HH:MM:SS
function formatTime(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Rating scale component with custom icons and labels
function RatingScale({ label, description, value, onChange, icons, labels }) {
  return (
    <div style={{ marginBottom: tokens.spacing.lg }}>
      <span style={{ ...typographyStyle('label'), color: tokens.colors.charcoal, display: 'block', marginBottom: tokens.spacing.xs }}>
        {label}
      </span>
      {description && (
        <span style={{ ...typographyStyle('caption'), color: tokens.colors.steel, display: 'block', marginBottom: tokens.spacing.sm }}>
          {description}
        </span>
      )}
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

// Sleep duration selector
function SleepDurationSelector({ value, onChange }) {
  const options = ['< 5t', '5-6t', '6-7t', '7-8t', '> 8t'];

  return (
    <div style={{ marginBottom: tokens.spacing.lg }}>
      <span style={{ ...typographyStyle('label'), color: tokens.colors.charcoal, display: 'block', marginBottom: tokens.spacing.sm }}>
        Søvn siste natt
      </span>
      <div
        style={{
          display: 'flex',
          gap: tokens.spacing.sm,
          flexWrap: 'wrap',
        }}
      >
        {options.map((option) => (
          <button
            key={option}
            onClick={() => onChange(option)}
            style={{
              padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
              backgroundColor: value === option ? tokens.colors.forest : tokens.colors.foam,
              color: value === option ? tokens.colors.white : tokens.colors.charcoal,
              border: 'none',
              borderRadius: tokens.borderRadius.md,
              cursor: 'pointer',
              ...typographyStyle('label'),
            }}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

// Text area field
function TextAreaField({ label, value, onChange, placeholder }) {
  return (
    <div style={{ marginBottom: tokens.spacing.lg }}>
      <span style={{ ...typographyStyle('label'), color: tokens.colors.charcoal, display: 'block', marginBottom: tokens.spacing.sm }}>
        {label}
      </span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
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
  );
}

// Section divider
function SectionDivider() {
  return (
    <div
      style={{
        height: '1px',
        backgroundColor: tokens.colors.mist,
        marginTop: tokens.spacing.lg,
        marginBottom: tokens.spacing.lg,
      }}
    />
  );
}

// Main SessionReflectionForm component
export default function SessionReflectionForm({ session, totalDuration, blocksCompleted, onSave, onSkip }) {
  // Mental state
  const [fokus, setFokus] = useState(0);
  const [motivasjon, setMotivasjon] = useState(0);
  const [mentalTilstand, setMentalTilstand] = useState(0);

  // Physical state
  const [energiniva, setEnerginia] = useState(0);
  const [fysiskTilstand, setFysiskTilstand] = useState(0);
  const [tekniskUtforelse, setTekniskUtforelse] = useState(0);

  // Rest & recovery
  const [sovnTimer, setSovnTimer] = useState('');
  const [sovnKvalitet, setSovnKvalitet] = useState(0);

  // Free text reflections
  const [hvaBra, setHvaBra] = useState('');
  const [hvaForbedres, setHvaForbedres] = useState('');
  const [malNesteOkt, setMalNesteOkt] = useState('');

  const handleSubmit = () => {
    const reflection = {
      // Mental
      fokus,
      motivasjon,
      mentalTilstand,
      // Physical
      energiniva,
      fysiskTilstand,
      tekniskUtforelse,
      // Recovery
      sovnTimer,
      sovnKvalitet,
      // Text
      hvaBra,
      hvaForbedres,
      malNesteOkt,
      // Meta
      completedAt: new Date().toISOString(),
    };

    onSave(reflection);
  };

  const isComplete = fokus > 0 && energiniva > 0 && motivasjon > 0;

  return (
    <div
      style={{
        backgroundColor: tokens.colors.ivory,
        minHeight: '100vh',
        fontFamily: tokens.typography.fontFamily,
      }}
    >
      {/* Header */}
      <div
        style={{
          backgroundColor: tokens.colors.white,
          padding: tokens.spacing.lg,
          borderBottom: `1px solid ${tokens.colors.mist}`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing.sm, marginBottom: tokens.spacing.sm }}>
          <span style={{ color: tokens.colors.success, fontSize: '28px' }}>✓</span>
          <span style={{ ...typographyStyle('title1'), color: tokens.colors.charcoal }}>
            Økt fullført!
          </span>
        </div>
        <div
          style={{
            height: '2px',
            backgroundColor: tokens.colors.forest,
            marginBottom: tokens.spacing.md,
          }}
        />
        <div style={{ ...typographyStyle('callout'), color: tokens.colors.steel }}>
          {session?.date} • {formatTime(totalDuration)}
        </div>
        <div style={{ ...typographyStyle('caption'), color: tokens.colors.steel }}>
          {blocksCompleted} av {session?.blocks?.length || 0} blokker fullført
        </div>
      </div>

      {/* Form content */}
      <div style={{ padding: tokens.spacing.lg }}>
        <div style={{ ...typographyStyle('title2'), color: tokens.colors.charcoal, marginBottom: tokens.spacing.lg }}>
          REFLEKSJON
        </div>

        {/* Focus */}
        <RatingScale
          label="Fokus"
          description="Hvor godt klarte du å holde fokus gjennom økten?"
          value={fokus}
          onChange={setFokus}
          icons={['😟', '😐', '🙂', '😊', '🤩']}
          labels={['Svært lav', 'Svært høy']}
        />

        {/* Energy level */}
        <RatingScale
          label="Energinivå"
          description="Hvordan var energinivået ditt under økten?"
          value={energiniva}
          onChange={setEnerginia}
          icons={['😴', '🥱', '😐', '💪', '⚡']}
          labels={['Svært sliten', 'Topp form']}
        />

        {/* Motivation */}
        <RatingScale
          label="Motivasjon"
          description="Hvor motivert var du under økten?"
          value={motivasjon}
          onChange={setMotivasjon}
          icons={['😞', '😕', '😐', '🙂', '🔥']}
          labels={['Svært lav', 'Svært høy']}
        />

        {/* Technical execution */}
        <RatingScale
          label="Teknisk utførelse"
          description="Hvordan opplevde du den tekniske utførelsen?"
          value={tekniskUtforelse}
          onChange={setTekniskUtforelse}
          icons={['😟', '😐', '🙂', '😊', '🤩']}
          labels={['Mye feil', 'Svært bra']}
        />

        {/* Mental state */}
        <RatingScale
          label="Mental tilstand"
          description="Hvordan var din mentale tilstand?"
          value={mentalTilstand}
          onChange={setMentalTilstand}
          icons={['😰', '😟', '😐', '😌', '🧘']}
          labels={['Stresset', 'Fokusert']}
        />

        {/* Physical state */}
        <RatingScale
          label="Fysisk tilstand"
          description="Hvordan føltes kroppen under økten?"
          value={fysiskTilstand}
          onChange={setFysiskTilstand}
          icons={['🤕', '😣', '😐', '💪', '🏃']}
          labels={['Vondt', 'Optimal']}
        />

        <SectionDivider />

        {/* Sleep */}
        <SleepDurationSelector value={sovnTimer} onChange={setSovnTimer} />

        <RatingScale
          label="Søvnkvalitet"
          value={sovnKvalitet}
          onChange={setSovnKvalitet}
          icons={['😫', '😴', '😐', '😊', '🌟']}
          labels={['Dårlig', 'Utmerket']}
        />

        <SectionDivider />

        {/* Free text reflections */}
        <TextAreaField
          label="Hva gikk bra?"
          value={hvaBra}
          onChange={setHvaBra}
          placeholder="Skriv her..."
        />

        <TextAreaField
          label="Hva kan forbedres?"
          value={hvaForbedres}
          onChange={setHvaForbedres}
          placeholder="Skriv her..."
        />

        <TextAreaField
          label="Mål for neste økt"
          value={malNesteOkt}
          onChange={setMalNesteOkt}
          placeholder="Skriv her..."
        />

        <SectionDivider />

        {/* Submit button */}
        <button
          onClick={handleSubmit}
          disabled={!isComplete}
          style={{
            width: '100%',
            padding: tokens.spacing.md,
            backgroundColor: isComplete ? tokens.colors.forest : tokens.colors.mist,
            color: isComplete ? tokens.colors.white : tokens.colors.steel,
            border: 'none',
            borderRadius: tokens.borderRadius.md,
            cursor: isComplete ? 'pointer' : 'not-allowed',
            marginBottom: tokens.spacing.md,
            ...typographyStyle('title3'),
          }}
        >
          Lagre refleksjon
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

        {/* Sports science info */}
        <div
          style={{
            backgroundColor: tokens.colors.foam,
            borderRadius: tokens.borderRadius.md,
            padding: tokens.spacing.md,
            marginTop: tokens.spacing.xl,
          }}
        >
          <span style={{ ...typographyStyle('caption'), color: tokens.colors.steel }}>
            💡 Refleksjonene hjelper deg og treneren din med å forstå hvordan kropp og sinn responderer på trening,
            og justere treningsbelastningen for optimal utvikling.
          </span>
        </div>
      </div>
    </div>
  );
}
