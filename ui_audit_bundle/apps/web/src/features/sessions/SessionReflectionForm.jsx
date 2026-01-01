/**
 * SessionReflectionForm - Refleksjon etter fullført økt
 *
 * Samler data for treningsanalyse og utvikling.
 * Basert på: APP_FUNCTIONALITY.md Section 8
 * Design: /packages/design-system/figma/ak_golf_complete_figma_kit.svg
 */
import React, { useState } from 'react';
import Button from '../../ui/primitives/Button';

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
    <div style={{ marginBottom: '24px' }}>
      <span style={{ fontSize: '15px', lineHeight: '20px', fontWeight: 500, color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>
        {label}
      </span>
      {description && (
        <span style={{ fontSize: '12px', lineHeight: '16px', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
          {description}
        </span>
      )}
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

// Sleep duration selector
function SleepDurationSelector({ value, onChange }) {
  const options = ['< 5t', '5-6t', '6-7t', '7-8t', '> 8t'];

  return (
    <div style={{ marginBottom: '24px' }}>
      <span style={{ fontSize: '15px', lineHeight: '20px', fontWeight: 500, color: 'var(--text-primary)', display: 'block', marginBottom: '8px' }}>
        Søvn siste natt
      </span>
      <div
        style={{
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap',
        }}
      >
        {options.map((option) => (
          <button
            key={option}
            onClick={() => onChange(option)}
            style={{
              padding: `${'8px'} ${'16px'}`,
              backgroundColor: value === option ? 'var(--accent)' : 'var(--bg-secondary)',
              color: value === option ? 'var(--bg-primary)' : 'var(--text-primary)',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              fontSize: '15px', lineHeight: '20px', fontWeight: 500,
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
    <div style={{ marginBottom: '24px' }}>
      <span style={{ fontSize: '15px', lineHeight: '20px', fontWeight: 500, color: 'var(--text-primary)', display: 'block', marginBottom: '8px' }}>
        {label}
      </span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
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
  );
}

// Section divider
function SectionDivider() {
  return (
    <div
      style={{
        height: '1px',
        backgroundColor: 'var(--border-default)',
        marginTop: '24px',
        marginBottom: '24px',
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
        backgroundColor: 'var(--bg-secondary)',
        minHeight: '100vh',
        fontFamily: 'Inter, -apple-system, system-ui, sans-serif',
      }}
    >
      {/* Header */}
      <div
        style={{
          backgroundColor: 'var(--bg-primary)',
          padding: '24px',
          borderBottom: '1px solid var(--border-default)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span style={{ color: 'var(--success)', fontSize: '28px' }}>✓</span>
          <span style={{ fontSize: '28px', lineHeight: '34px', fontWeight: 700, color: 'var(--text-primary)' }}>
            Økt fullført!
          </span>
        </div>
        <div
          style={{
            height: '2px',
            backgroundColor: 'var(--accent)',
            marginBottom: '16px',
          }}
        />
        <div style={{ fontSize: '16px', lineHeight: '21px', fontWeight: 400, color: 'var(--text-secondary)' }}>
          {session?.date} • {formatTime(totalDuration)}
        </div>
        <div style={{ fontSize: '12px', lineHeight: '16px', color: 'var(--text-secondary)' }}>
          {blocksCompleted} av {session?.blocks?.length || 0} blokker fullført
        </div>
      </div>

      {/* Form content */}
      <div style={{ padding: '24px' }}>
        <div style={{ fontSize: '22px', lineHeight: '28px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '24px' }}>
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
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={!isComplete}
          style={{ width: '100%', marginBottom: '16px' }}
        >
          Lagre refleksjon
        </Button>

        <Button
          variant="ghost"
          onClick={onSkip}
          style={{ width: '100%' }}
        >
          Hopp over
        </Button>

        {/* Sports science info */}
        <div
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
            marginTop: '32px',
          }}
        >
          <span style={{ fontSize: '12px', lineHeight: '16px', color: 'var(--text-secondary)' }}>
            💡 Refleksjonene hjelper deg og treneren din med å forstå hvordan kropp og sinn responderer på trening,
            og justere treningsbelastningen for optimal utvikling.
          </span>
        </div>
      </div>
    </div>
  );
}
