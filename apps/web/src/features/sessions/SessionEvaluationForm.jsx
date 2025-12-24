/**
 * SessionEvaluationForm - Evaluering av treningsøkt
 *
 * Samler evalueringsdata etter fullført økt.
 * Inkluderer: fokus, teknisk, energi, mental, pre-shot rutine, tekniske cues
 *
 * Design: AK Golf Academy Design System v3.0
 */
import React, { useState, useEffect } from 'react';
import { tokens, typographyStyle } from '../../design-tokens';
import { Check, X, ChevronLeft, Clock, Target, Zap, Brain } from 'lucide-react';

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

/**
 * Rating scale component (1-10)
 */
function RatingScale({ label, description, value, onChange, icon: Icon, lowLabel, highLabel }) {
  return (
    <div style={{ marginBottom: tokens.spacing.lg }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing.sm, marginBottom: tokens.spacing.xs }}>
        {Icon && <Icon size={18} color={tokens.colors.forest} />}
        <span style={{ ...typographyStyle('headline'), color: tokens.colors.charcoal }}>
          {label}
        </span>
      </div>
      {description && (
        <span style={{ ...typographyStyle('caption1'), color: tokens.colors.steel, display: 'block', marginBottom: tokens.spacing.sm }}>
          {description}
        </span>
      )}
      <div
        style={{
          display: 'flex',
          gap: tokens.spacing.xs,
          backgroundColor: tokens.colors.foam,
          borderRadius: tokens.borderRadius.md,
          padding: tokens.spacing.sm,
        }}
      >
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
          <button
            key={rating}
            onClick={() => onChange(rating)}
            style={{
              flex: 1,
              padding: `${tokens.spacing.sm} 0`,
              backgroundColor: value === rating ? tokens.colors.forest : 'transparent',
              color: value === rating ? tokens.colors.white : tokens.colors.charcoal,
              border: 'none',
              borderRadius: tokens.borderRadius.sm,
              cursor: 'pointer',
              ...typographyStyle('label'),
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
          marginTop: tokens.spacing.xs,
        }}
      >
        <span style={{ ...typographyStyle('caption1'), color: tokens.colors.steel }}>
          {lowLabel || '1'}
        </span>
        <span style={{ ...typographyStyle('caption1'), color: tokens.colors.steel }}>
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
    { value: 'yes', label: 'Ja', color: tokens.colors.success },
    { value: 'partial', label: 'Delvis', color: tokens.colors.warning },
    { value: 'no', label: 'Nei', color: tokens.colors.error },
  ];

  return (
    <div style={{ marginBottom: tokens.spacing.lg }}>
      <span style={{ ...typographyStyle('headline'), color: tokens.colors.charcoal, display: 'block', marginBottom: tokens.spacing.xs }}>
        Konsistent pre-shot rutine?
      </span>
      <span style={{ ...typographyStyle('caption1'), color: tokens.colors.steel, display: 'block', marginBottom: tokens.spacing.sm }}>
        Fulgte du pre-shot rutinen din konsekvent?
      </span>

      <div style={{ display: 'flex', gap: tokens.spacing.sm, marginBottom: tokens.spacing.md }}>
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            style={{
              flex: 1,
              padding: tokens.spacing.md,
              backgroundColor: value === option.value ? option.color : tokens.colors.foam,
              color: value === option.value ? tokens.colors.white : tokens.colors.charcoal,
              border: 'none',
              borderRadius: tokens.borderRadius.md,
              cursor: 'pointer',
              ...typographyStyle('label'),
              fontWeight: value === option.value ? 600 : 400,
              transition: 'all 0.15s ease',
            }}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Shot count inputs */}
      <div style={{ display: 'flex', gap: tokens.spacing.md }}>
        <div style={{ flex: 1 }}>
          <label style={{ ...typographyStyle('caption1'), color: tokens.colors.steel, display: 'block', marginBottom: tokens.spacing.xs }}>
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
              padding: tokens.spacing.sm,
              backgroundColor: tokens.colors.foam,
              border: 'none',
              borderRadius: tokens.borderRadius.sm,
              ...typographyStyle('body'),
            }}
          />
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ ...typographyStyle('caption1'), color: tokens.colors.steel, display: 'block', marginBottom: tokens.spacing.xs }}>
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
              padding: tokens.spacing.sm,
              backgroundColor: tokens.colors.foam,
              border: 'none',
              borderRadius: tokens.borderRadius.sm,
              ...typographyStyle('body'),
            }}
          />
        </div>
      </div>

      {/* Percentage display */}
      {totalShots > 0 && shotCount >= 0 && (
        <div style={{ marginTop: tokens.spacing.sm, textAlign: 'center' }}>
          <span style={{ ...typographyStyle('headline'), color: tokens.colors.forest }}>
            {Math.round((shotCount / totalShots) * 100)}%
          </span>
          <span style={{ ...typographyStyle('caption1'), color: tokens.colors.steel, marginLeft: tokens.spacing.xs }}>
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
    <div style={{ marginBottom: tokens.spacing.lg }}>
      <span style={{ ...typographyStyle('headline'), color: tokens.colors.charcoal, display: 'block', marginBottom: tokens.spacing.xs }}>
        Tekniske cues brukt
      </span>
      <span style={{ ...typographyStyle('caption1'), color: tokens.colors.steel, display: 'block', marginBottom: tokens.spacing.sm }}>
        Velg cues du fokuserte på i dag
      </span>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: tokens.spacing.sm, marginBottom: tokens.spacing.md }}>
        {cues.map((cue) => {
          const isSelected = selectedCues.includes(cue);
          return (
            <button
              key={cue}
              onClick={() => onToggle(cue)}
              style={{
                padding: `${tokens.spacing.xs} ${tokens.spacing.md}`,
                backgroundColor: isSelected ? tokens.colors.forest : tokens.colors.foam,
                color: isSelected ? tokens.colors.white : tokens.colors.charcoal,
                border: 'none',
                borderRadius: tokens.borderRadius.full,
                cursor: 'pointer',
                ...typographyStyle('label'),
                display: 'flex',
                alignItems: 'center',
                gap: tokens.spacing.xs,
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
          padding: tokens.spacing.sm,
          backgroundColor: tokens.colors.foam,
          border: 'none',
          borderRadius: tokens.borderRadius.sm,
          ...typographyStyle('body'),
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
    <div style={{ marginBottom: tokens.spacing.lg }}>
      <span style={{ ...typographyStyle('headline'), color: tokens.colors.charcoal, display: 'block', marginBottom: tokens.spacing.xs }}>
        {label}
      </span>
      {description && (
        <span style={{ ...typographyStyle('caption1'), color: tokens.colors.steel, display: 'block', marginBottom: tokens.spacing.sm }}>
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
          padding: tokens.spacing.md,
          backgroundColor: tokens.colors.foam,
          border: 'none',
          borderRadius: tokens.borderRadius.md,
          resize: 'vertical',
          ...typographyStyle('body'),
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
    <div style={{ marginTop: tokens.spacing.xl, marginBottom: tokens.spacing.lg }}>
      <div
        style={{
          height: '1px',
          backgroundColor: tokens.colors.mist,
          marginBottom: title ? tokens.spacing.md : 0,
        }}
      />
      {title && (
        <span style={{ ...typographyStyle('label'), color: tokens.colors.steel, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
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
        backgroundColor: tokens.colors.white,
        minHeight: '100vh',
        fontFamily: tokens.typography.fontFamily,
      }}
    >
      {/* Header */}
      <div
        style={{
          backgroundColor: tokens.colors.forest,
          color: tokens.colors.white,
          padding: tokens.spacing.lg,
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button
            onClick={onCancel}
            style={{
              background: 'none',
              border: 'none',
              color: tokens.colors.white,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: tokens.spacing.xs,
              padding: tokens.spacing.xs,
            }}
          >
            <ChevronLeft size={24} />
          </button>
          <span style={{ ...typographyStyle('title2') }}>
            Evaluer Okt
          </span>
          <div style={{ width: 40 }} /> {/* Spacer for centering */}
        </div>

        {/* Session info */}
        {session && (
          <div
            style={{
              marginTop: tokens.spacing.md,
              padding: tokens.spacing.md,
              backgroundColor: 'rgba(255,255,255,0.1)',
              borderRadius: tokens.borderRadius.md,
            }}
          >
            <div style={{ ...typographyStyle('headline') }}>
              {session.focusArea || session.sessionType}
            </div>
            <div style={{ ...typographyStyle('caption1'), opacity: 0.8, marginTop: tokens.spacing.xs }}>
              {session.duration} min | {session.learningPhase} | {session.period}
            </div>
          </div>
        )}
      </div>

      {/* Form content */}
      <div style={{ padding: tokens.spacing.lg }}>
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
        <div style={{ marginTop: tokens.spacing.xl }}>
          <button
            onClick={handleComplete}
            disabled={isLoading}
            style={{
              width: '100%',
              padding: tokens.spacing.md,
              backgroundColor: tokens.colors.forest,
              color: tokens.colors.white,
              border: 'none',
              borderRadius: tokens.borderRadius.md,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              marginBottom: tokens.spacing.md,
              ...typographyStyle('headline'),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: tokens.spacing.sm,
              opacity: isLoading ? 0.7 : 1,
            }}
          >
            <Check size={20} />
            Fullfør økt
          </button>

          <button
            onClick={handleAbandon}
            disabled={isLoading}
            style={{
              width: '100%',
              padding: tokens.spacing.sm,
              backgroundColor: 'transparent',
              color: tokens.colors.error,
              border: `1px solid ${tokens.colors.error}`,
              borderRadius: tokens.borderRadius.md,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              ...typographyStyle('label'),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: tokens.spacing.sm,
            }}
          >
            <X size={16} />
            Avbryt okt
          </button>
        </div>

        {/* Auto-save indicator */}
        {autoSaveEnabled && hasMinimumData && (
          <div
            style={{
              marginTop: tokens.spacing.lg,
              textAlign: 'center',
              ...typographyStyle('caption1'),
              color: tokens.colors.steel,
            }}
          >
            Lagres automatisk
          </div>
        )}

        {/* Info box */}
        <div
          style={{
            backgroundColor: tokens.colors.foam,
            borderRadius: tokens.borderRadius.md,
            padding: tokens.spacing.md,
            marginTop: tokens.spacing.xl,
          }}
        >
          <span style={{ ...typographyStyle('caption1'), color: tokens.colors.steel }}>
            Evalueringen hjelper deg og treneren din med a folge utviklingen over tid.
            Okten auto-fullføres etter 15 minutter uten aktivitet.
          </span>
        </div>
      </div>
    </div>
  );
}
