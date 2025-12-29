/**
 * SessionEvaluationForm - Evaluering av treningsøkt
 *
 * Samler evalueringsdata etter fullført økt.
 * Inkluderer: fokus, teknisk, energi, mental, pre-shot rutine, tekniske cues
 *
 * Design: AK Golf Academy Design System v3.0
 */
import React, { useState, useEffect } from 'react';
// UiCanon: CSS variables
import { Check, X, ChevronLeft, Clock, Target, Zap, Brain } from 'lucide-react';
import Button from '../../ui/primitives/Button';

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

/**
 * Rating scale component (1-10)
 */
function RatingScale({ label, description, value, onChange, icon: Icon, lowLabel, highLabel }) {
  return (
    <div style={{ marginBottom: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
        {Icon && <Icon size={18} color={'var(--accent)'} />}
        <span style={{ fontSize: '17px', lineHeight: '22px', fontWeight: 600, color: 'var(--text-primary)' }}>
          {label}
        </span>
      </div>
      {description && (
        <span style={{ fontSize: '12px', lineHeight: '16px', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
          {description}
        </span>
      )}
      <div
        style={{
          display: 'flex',
          gap: '4px',
          backgroundColor: 'var(--bg-tertiary)',
          borderRadius: 'var(--radius-md)',
          padding: '8px',
        }}
      >
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
          <button
            key={rating}
            onClick={() => onChange(rating)}
            style={{
              flex: 1,
              padding: `${'8px'} 0`,
              backgroundColor: value === rating ? 'var(--accent)' : 'transparent',
              color: value === rating ? 'var(--bg-primary)' : 'var(--text-primary)',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              fontSize: '12px', lineHeight: '16px', fontWeight: 500,
              fontWeight: value === rating ? 600 : 400,
              transition: 'all 0.15s ease',
            }}
          >
            {rating}
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
          {lowLabel || '1'}
        </span>
        <span style={{ fontSize: '12px', lineHeight: '16px', color: 'var(--text-secondary)' }}>
          {highLabel || '10'}
        </span>
      </div>
    </div>
  );
}

/**
 * Pre-shot routine selector (yes/partial/no)
 */
function PreShotRoutineSelector({ value, onChange, shotCount, totalShots, onShotCountChange, onTotalShotsChange }) {
  const options = [
    { value: 'yes', label: 'Ja', color: 'var(--success)' },
    { value: 'partial', label: 'Delvis', color: 'var(--warning)' },
    { value: 'no', label: 'Nei', color: 'var(--error)' },
  ];

  return (
    <div style={{ marginBottom: '24px' }}>
      <span style={{ fontSize: '17px', lineHeight: '22px', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>
        Konsistent pre-shot rutine?
      </span>
      <span style={{ fontSize: '12px', lineHeight: '16px', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
        Fulgte du pre-shot rutinen din konsekvent?
      </span>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            style={{
              flex: 1,
              padding: '16px',
              backgroundColor: value === option.value ? option.color : 'var(--bg-tertiary)',
              color: value === option.value ? 'var(--bg-primary)' : 'var(--text-primary)',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              fontSize: '12px', lineHeight: '16px', fontWeight: 500,
              fontWeight: value === option.value ? 600 : 400,
              transition: 'all 0.15s ease',
            }}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Shot count inputs */}
      <div style={{ display: 'flex', gap: '16px' }}>
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: '12px', lineHeight: '16px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
            Slag med rutine
          </label>
          <input
            type="number"
            min="0"
            value={shotCount || ''}
            onChange={(e) => onShotCountChange(parseInt(e.target.value) || 0)}
            placeholder="0"
            style={{
              width: '100%',
              padding: '8px',
              backgroundColor: 'var(--bg-tertiary)',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              fontSize: '15px', lineHeight: '20px',
            }}
          />
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: '12px', lineHeight: '16px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
            Totalt slag
          </label>
          <input
            type="number"
            min="0"
            value={totalShots || ''}
            onChange={(e) => onTotalShotsChange(parseInt(e.target.value) || 0)}
            placeholder="0"
            style={{
              width: '100%',
              padding: '8px',
              backgroundColor: 'var(--bg-tertiary)',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              fontSize: '15px', lineHeight: '20px',
            }}
          />
        </div>
      </div>

      {/* Percentage display */}
      {totalShots > 0 && shotCount >= 0 && (
        <div style={{ marginTop: '8px', textAlign: 'center' }}>
          <span style={{ fontSize: '17px', lineHeight: '22px', fontWeight: 600, color: 'var(--accent)' }}>
            {Math.round((shotCount / totalShots) * 100)}%
          </span>
          <span style={{ fontSize: '12px', lineHeight: '16px', color: 'var(--text-secondary)', marginLeft: '4px' }}>
            konsistens
          </span>
        </div>
      )}
    </div>
  );
}

/**
 * Technical cues selector (multi-select chips)
 */
function TechnicalCuesSelector({ cues, selectedCues, onToggle, customCue, onCustomCueChange }) {
  return (
    <div style={{ marginBottom: '24px' }}>
      <span style={{ fontSize: '17px', lineHeight: '22px', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>
        Tekniske cues brukt
      </span>
      <span style={{ fontSize: '12px', lineHeight: '16px', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
        Velg cues du fokuserte på i dag
      </span>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
        {cues.map((cue) => {
          const isSelected = selectedCues.includes(cue);
          return (
            <button
              key={cue}
              onClick={() => onToggle(cue)}
              style={{
                padding: `${'4px'} ${'16px'}`,
                backgroundColor: isSelected ? 'var(--accent)' : 'var(--bg-tertiary)',
                color: isSelected ? 'var(--bg-primary)' : 'var(--text-primary)',
                border: 'none',
                borderRadius: '9999px',
                cursor: 'pointer',
                fontSize: '12px', lineHeight: '16px', fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                transition: 'all 0.15s ease',
              }}
            >
              {isSelected && <Check size={14} />}
              {cue}
            </button>
          );
        })}
      </div>

      {/* Custom cue input */}
      <input
        type="text"
        value={customCue || ''}
        onChange={(e) => onCustomCueChange(e.target.value)}
        placeholder="Egen cue..."
        style={{
          width: '100%',
          padding: '8px',
          backgroundColor: 'var(--bg-tertiary)',
          border: 'none',
          borderRadius: 'var(--radius-sm)',
          fontSize: '15px', lineHeight: '20px',
        }}
      />
    </div>
  );
}

/**
 * Text area field
 */
function TextAreaField({ label, description, value, onChange, placeholder }) {
  return (
    <div style={{ marginBottom: '24px' }}>
      <span style={{ fontSize: '17px', lineHeight: '22px', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>
        {label}
      </span>
      {description && (
        <span style={{ fontSize: '12px', lineHeight: '16px', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
          {description}
        </span>
      )}
      <textarea
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%',
          minHeight: '80px',
          padding: '16px',
          backgroundColor: 'var(--bg-tertiary)',
          border: 'none',
          borderRadius: 'var(--radius-md)',
          resize: 'vertical',
          fontSize: '15px', lineHeight: '20px',
        }}
      />
    </div>
  );
}

/**
 * Section divider
 */
function SectionDivider({ title }) {
  return (
    <div style={{ marginTop: '32px', marginBottom: '24px' }}>
      <div
        style={{
          height: '1px',
          backgroundColor: 'var(--border-default)',
          marginBottom: title ? '16px' : 0,
        }}
      />
      {title && (
        <span style={{ fontSize: '12px', lineHeight: '16px', fontWeight: 500, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {title}
        </span>
      )}
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function SessionEvaluationForm({
  session,
  technicalCues = [],
  initialValues = {},
  onSave,
  onComplete,
  onCancel,
  isLoading = false,
  autoSaveEnabled = true,
}) {
  // Evaluation ratings (1-10)
  const [evaluationFocus, setEvaluationFocus] = useState(initialValues.evaluationFocus || 0);
  const [evaluationTechnical, setEvaluationTechnical] = useState(initialValues.evaluationTechnical || 0);
  const [evaluationEnergy, setEvaluationEnergy] = useState(initialValues.evaluationEnergy || 0);
  const [evaluationMental, setEvaluationMental] = useState(initialValues.evaluationMental || 0);

  // Pre-shot routine
  const [preShotConsistency, setPreShotConsistency] = useState(initialValues.preShotConsistency || '');
  const [preShotCount, setPreShotCount] = useState(initialValues.preShotCount || 0);
  const [totalShots, setTotalShots] = useState(initialValues.totalShots || 0);

  // Technical cues
  const [selectedCues, setSelectedCues] = useState(initialValues.technicalCues || []);
  const [customCue, setCustomCue] = useState(initialValues.customCue || '');

  // Notes
  const [whatWentWell, setWhatWentWell] = useState(initialValues.whatWentWell || '');
  const [nextSessionFocus, setNextSessionFocus] = useState(initialValues.nextSessionFocus || '');
  const [notes, setNotes] = useState(initialValues.notes || '');

  // Toggle technical cue selection
  const handleToggleCue = (cue) => {
    setSelectedCues((prev) =>
      prev.includes(cue) ? prev.filter((c) => c !== cue) : [...prev, cue]
    );
  };

  // Build evaluation data object
  const getEvaluationData = () => ({
    evaluationFocus: evaluationFocus || null,
    evaluationTechnical: evaluationTechnical || null,
    evaluationEnergy: evaluationEnergy || null,
    evaluationMental: evaluationMental || null,
    preShotConsistency: preShotConsistency || null,
    preShotCount: preShotCount || null,
    totalShots: totalShots || null,
    technicalCues: selectedCues,
    customCue: customCue || null,
    whatWentWell: whatWentWell || null,
    nextSessionFocus: nextSessionFocus || null,
    notes: notes || null,
  });

  // Auto-save on changes
  useEffect(() => {
    if (!autoSaveEnabled || !onSave) return;

    const timer = setTimeout(() => {
      const data = getEvaluationData();
      // Only save if we have at least one rating
      if (data.evaluationFocus || data.evaluationTechnical || data.evaluationEnergy || data.evaluationMental) {
        onSave(data);
      }
    }, 2000);

    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [evaluationFocus, evaluationTechnical, evaluationEnergy, evaluationMental, preShotConsistency, preShotCount, totalShots, selectedCues, customCue, whatWentWell, nextSessionFocus, notes]);

  // Handle complete
  const handleComplete = () => {
    const data = {
      ...getEvaluationData(),
      completionStatus: 'completed',
    };
    onComplete(data);
  };

  // Handle abandon
  const handleAbandon = () => {
    const data = {
      ...getEvaluationData(),
      completionStatus: 'abandoned',
    };
    onComplete(data);
  };

  // Check if form has minimum required data
  const hasMinimumData = evaluationFocus > 0 || evaluationTechnical > 0 || evaluationEnergy > 0 || evaluationMental > 0;

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-primary)',
        minHeight: '100vh',
        fontFamily: 'Inter, -apple-system, system-ui, sans-serif',
      }}
    >
      {/* Header */}
      <div
        style={{
          backgroundColor: 'var(--accent)',
          color: 'var(--bg-primary)',
          padding: '24px',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Button variant="ghost" onClick={onCancel} style={{ color: 'var(--bg-primary)', padding: '4px' }}>
            <ChevronLeft size={24} />
          </Button>
          <span style={{ fontSize: '22px', lineHeight: '28px', fontWeight: 700 }}>
            Evaluer Okt
          </span>
          <div style={{ width: 40 }} /> {/* Spacer for centering */}
        </div>

        {/* Session info */}
        {session && (
          <div
            style={{
              marginTop: '16px',
              padding: '16px',
              backgroundColor: 'rgba(255,255,255,0.1)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <div style={{ fontSize: '17px', lineHeight: '22px', fontWeight: 600 }}>
              {session.focusArea || session.sessionType}
            </div>
            <div style={{ fontSize: '12px', lineHeight: '16px', opacity: 0.8, marginTop: '4px' }}>
              {session.duration} min | {session.learningPhase} | {session.period}
            </div>
          </div>
        )}
      </div>

      {/* Form content */}
      <div style={{ padding: '24px' }}>
        {/* Ratings Section */}
        <SectionDivider title="Vurdering" />

        <RatingScale
          label="Fokus"
          description="Hvor godt klarte du a holde fokus gjennom okten?"
          value={evaluationFocus}
          onChange={setEvaluationFocus}
          icon={Target}
          lowLabel="Distrahert"
          highLabel="Laserfokus"
        />

        <RatingScale
          label="Teknisk utforelse"
          description="Hvordan var den tekniske kvaliteten pa slagene?"
          value={evaluationTechnical}
          onChange={setEvaluationTechnical}
          icon={Zap}
          lowLabel="Mye feil"
          highLabel="Svaert bra"
        />

        <RatingScale
          label="Energiniva"
          description="Hvordan var energien din under okten?"
          value={evaluationEnergy}
          onChange={setEvaluationEnergy}
          icon={Clock}
          lowLabel="Sliten"
          highLabel="Full energi"
        />

        <RatingScale
          label="Mental tilstand"
          description="Hvordan var din mentale tilstand?"
          value={evaluationMental}
          onChange={setEvaluationMental}
          icon={Brain}
          lowLabel="Stresset"
          highLabel="Rolig og fokusert"
        />

        {/* Pre-shot Routine Section */}
        <SectionDivider title="Pre-shot rutine" />

        <PreShotRoutineSelector
          value={preShotConsistency}
          onChange={setPreShotConsistency}
          shotCount={preShotCount}
          totalShots={totalShots}
          onShotCountChange={setPreShotCount}
          onTotalShotsChange={setTotalShots}
        />

        {/* Technical Cues Section */}
        <SectionDivider title="Tekniske cues" />

        <TechnicalCuesSelector
          cues={technicalCues}
          selectedCues={selectedCues}
          onToggle={handleToggleCue}
          customCue={customCue}
          onCustomCueChange={setCustomCue}
        />

        {/* Notes Section */}
        <SectionDivider title="Refleksjon" />

        <TextAreaField
          label="Hva gikk bra?"
          description="Skriv ned positive opplevelser fra okten"
          value={whatWentWell}
          onChange={setWhatWentWell}
          placeholder="F.eks: God rytme pa putting, traff mange fairways..."
        />

        <TextAreaField
          label="Fokus neste okt"
          description="Hva vil du jobbe med neste gang?"
          value={nextSessionFocus}
          onChange={setNextSessionFocus}
          placeholder="F.eks: Fokusere mer pa alignment..."
        />

        <TextAreaField
          label="Andre notater"
          value={notes}
          onChange={setNotes}
          placeholder="Frivillige notater..."
        />

        {/* Action buttons */}
        <div style={{ marginTop: '32px' }}>
          <Button
            variant="primary"
            onClick={handleComplete}
            disabled={isLoading}
            loading={isLoading}
            leftIcon={<Check size={20} />}
            style={{ width: '100%', padding: '16px', marginBottom: '16px', fontSize: '17px', fontWeight: 600 }}
          >
            Fullfør økt
          </Button>

          <Button
            variant="secondary"
            onClick={handleAbandon}
            disabled={isLoading}
            leftIcon={<X size={16} />}
            style={{ width: '100%', color: 'var(--error)', borderColor: 'var(--error)' }}
          >
            Avbryt okt
          </Button>
        </div>

        {/* Auto-save indicator */}
        {autoSaveEnabled && hasMinimumData && (
          <div
            style={{
              marginTop: '24px',
              textAlign: 'center',
              fontSize: '12px', lineHeight: '16px',
              color: 'var(--text-secondary)',
            }}
          >
            Lagres automatisk
          </div>
        )}

        {/* Info box */}
        <div
          style={{
            backgroundColor: 'var(--bg-tertiary)',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
            marginTop: '32px',
          }}
        >
          <span style={{ fontSize: '12px', lineHeight: '16px', color: 'var(--text-secondary)' }}>
            Evalueringen hjelper deg og treneren din med a folge utviklingen over tid.
            Okten auto-fullføres etter 15 minutter uten aktivitet.
          </span>
        </div>
      </div>
    </div>
  );
}
