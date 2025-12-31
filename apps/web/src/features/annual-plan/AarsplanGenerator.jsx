import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar, Target, Clock, Trophy, ChevronRight, ChevronLeft,
  Check, Plus, X, Loader2, Sparkles
} from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { useAuth } from '../../contexts/AuthContext';
import apiClient from '../../services/apiClient';

// ============================================================================
// STEP INDICATOR
// ============================================================================

const StepIndicator = ({ currentStep, totalSteps, steps }) => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    gap: '8px',
    marginBottom: '32px',
  }}>
    {steps.map((step, index) => {
      const isActive = index === currentStep;
      const isCompleted = index < currentStep;

      return (
        <div
          key={index}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              fontWeight: 600,
              backgroundColor: isCompleted ? 'var(--accent)' : isActive ? 'var(--accent)' : 'var(--bg-secondary)',
              color: isCompleted || isActive ? 'white' : 'var(--text-secondary)',
              transition: 'all 0.2s',
            }}
          >
            {isCompleted ? <Check size={16} /> : index + 1}
          </div>
          <span
            style={{
              fontSize: '14px',
              fontWeight: isActive ? 600 : 400,
              color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
              display: index < totalSteps - 1 ? 'block' : 'block',
            }}
          >
            {step.label}
          </span>
          {index < totalSteps - 1 && (
            <div
              style={{
                width: '40px',
                height: '2px',
                backgroundColor: isCompleted ? 'var(--accent)' : 'var(--border-default)',
                marginLeft: '8px',
              }}
            />
          )}
        </div>
      );
    })}
  </div>
);

// ============================================================================
// FORM CARD
// ============================================================================

const FormCard = ({ children, title, subtitle, icon: Icon }) => (
  <div
    style={{
      backgroundColor: 'var(--bg-primary)',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      border: '1px solid var(--border-default)',
    }}
  >
    {title && (
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
          {Icon && <Icon size={24} color="var(--accent)" />}
          <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
            {title}
          </h3>
        </div>
        {subtitle && (
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0, marginLeft: Icon ? '36px' : 0 }}>
            {subtitle}
          </p>
        )}
      </div>
    )}
    {children}
  </div>
);

// ============================================================================
// INPUT COMPONENTS
// ============================================================================

const InputField = ({ label, type = 'text', value, onChange, placeholder, min, max, step, required }) => (
  <div style={{ marginBottom: '16px' }}>
    <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '6px' }}>
      {label} {required && <span style={{ color: 'var(--error)' }}>*</span>}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      min={min}
      max={max}
      step={step}
      required={required}
      style={{
        width: '100%',
        padding: '12px 14px',
        borderRadius: '10px',
        border: '1px solid var(--border-default)',
        fontSize: '15px',
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--text-primary)',
        outline: 'none',
        transition: 'border-color 0.2s',
      }}
    />
  </div>
);

const DaySelector = ({ selectedDays, onChange }) => {
  const days = [
    { value: 1, label: 'Man' },
    { value: 2, label: 'Tir' },
    { value: 3, label: 'Ons' },
    { value: 4, label: 'Tor' },
    { value: 5, label: 'Fre' },
    { value: 6, label: 'Lør' },
    { value: 0, label: 'Søn' },
  ];

  const toggleDay = (day) => {
    if (selectedDays.includes(day)) {
      onChange(selectedDays.filter(d => d !== day));
    } else {
      onChange([...selectedDays, day].sort((a, b) => a - b));
    }
  };

  return (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      {days.map(day => (
        <button
          key={day.value}
          type="button"
          onClick={() => toggleDay(day.value)}
          style={{
            padding: '12px 16px',
            borderRadius: '10px',
            border: selectedDays.includes(day.value) ? '2px solid var(--accent)' : '1px solid var(--border-default)',
            backgroundColor: selectedDays.includes(day.value) ? 'rgba(var(--accent-rgb), 0.1)' : 'var(--bg-primary)',
            color: selectedDays.includes(day.value) ? 'var(--accent)' : 'var(--text-primary)',
            fontSize: '14px',
            fontWeight: selectedDays.includes(day.value) ? 600 : 400,
            cursor: 'pointer',
            transition: 'all 0.2s',
            minWidth: '52px',
          }}
        >
          {day.label}
        </button>
      ))}
    </div>
  );
};

// ============================================================================
// TOURNAMENT LIST
// ============================================================================

const TournamentList = ({ tournaments, onAdd, onRemove }) => {
  const [showForm, setShowForm] = useState(false);
  const [newTournament, setNewTournament] = useState({
    name: '',
    startDate: '',
    endDate: '',
    importance: 'B',
  });

  const handleAdd = () => {
    if (newTournament.name && newTournament.startDate) {
      onAdd({
        ...newTournament,
        endDate: newTournament.endDate || newTournament.startDate,
      });
      setNewTournament({ name: '', startDate: '', endDate: '', importance: 'B' });
      setShowForm(false);
    }
  };

  const importanceColors = {
    A: { bg: 'rgba(239, 68, 68, 0.1)', text: '#ef4444', label: 'A - Hovedmål' },
    B: { bg: 'rgba(234, 179, 8, 0.1)', text: '#eab308', label: 'B - Viktig' },
    C: { bg: 'rgba(34, 197, 94, 0.1)', text: '#22c55e', label: 'C - Forberedelse' },
  };

  return (
    <div>
      {/* Existing tournaments */}
      {tournaments.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
          {tournaments.map((t, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                borderRadius: '10px',
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-default)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Trophy size={18} color={importanceColors[t.importance].text} />
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)' }}>
                    {t.name}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    {new Date(t.startDate).toLocaleDateString('nb-NO')}
                    {t.endDate !== t.startDate && ` - ${new Date(t.endDate).toLocaleDateString('nb-NO')}`}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: 600,
                    backgroundColor: importanceColors[t.importance].bg,
                    color: importanceColors[t.importance].text,
                  }}
                >
                  {t.importance}
                </span>
                <button
                  type="button"
                  onClick={() => onRemove(index)}
                  style={{
                    padding: '6px',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    color: 'var(--text-secondary)',
                  }}
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add tournament form */}
      {showForm ? (
        <div
          style={{
            padding: '16px',
            borderRadius: '12px',
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-default)',
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
            <InputField
              label="Turneringsnavn"
              value={newTournament.name}
              onChange={(v) => setNewTournament({ ...newTournament, name: v })}
              placeholder="f.eks. NM Senior"
              required
            />
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px' }}>
                Viktighet
              </label>
              <select
                value={newTournament.importance}
                onChange={(e) => setNewTournament({ ...newTournament, importance: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-default)',
                  fontSize: '15px',
                  backgroundColor: 'var(--bg-primary)',
                }}
              >
                <option value="A">A - Hovedmål</option>
                <option value="B">B - Viktig</option>
                <option value="C">C - Forberedelse</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <InputField
              label="Startdato"
              type="date"
              value={newTournament.startDate}
              onChange={(v) => setNewTournament({ ...newTournament, startDate: v })}
              required
            />
            <InputField
              label="Sluttdato"
              type="date"
              value={newTournament.endDate}
              onChange={(v) => setNewTournament({ ...newTournament, endDate: v })}
            />
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={handleAdd}
              disabled={!newTournament.name || !newTournament.startDate}
              style={{
                flex: 1,
                padding: '10px 16px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: 'var(--accent)',
                color: 'white',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
                opacity: (!newTournament.name || !newTournament.startDate) ? 0.5 : 1,
              }}
            >
              Legg til
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              style={{
                padding: '10px 16px',
                borderRadius: '8px',
                border: '1px solid var(--border-default)',
                backgroundColor: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              Avbryt
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            width: '100%',
            padding: '14px',
            borderRadius: '10px',
            border: '2px dashed var(--border-default)',
            backgroundColor: 'transparent',
            color: 'var(--text-secondary)',
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          <Plus size={18} />
          Legg til turnering
        </button>
      )}
    </div>
  );
};

// ============================================================================
// STEP CONTENT COMPONENTS
// ============================================================================

const Step1Basics = ({ formData, setFormData }) => (
  <div style={{ display: 'grid', gap: '24px' }}>
    <FormCard
      title="Grunnleggende info"
      subtitle="Start med å angi når planen skal starte og dine nåværende nivå"
      icon={Calendar}
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <InputField
          label="Startdato for plan"
          type="date"
          value={formData.startDate}
          onChange={(v) => setFormData({ ...formData, startDate: v })}
          required
        />
        <InputField
          label="Plannavn (valgfritt)"
          value={formData.planName}
          onChange={(v) => setFormData({ ...formData, planName: v })}
          placeholder="f.eks. Sesong 2025"
        />
      </div>
    </FormCard>

    <FormCard
      title="Nåværende nivå"
      subtitle="Vi bruker dette for å tilpasse planen til deg"
      icon={Target}
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <InputField
          label="Gjennomsnittlig score"
          type="number"
          value={formData.baselineAverageScore}
          onChange={(v) => setFormData({ ...formData, baselineAverageScore: parseFloat(v) || '' })}
          placeholder="f.eks. 85"
          min={50}
          max={150}
          required
        />
        <InputField
          label="Handicap"
          type="number"
          value={formData.baselineHandicap}
          onChange={(v) => setFormData({ ...formData, baselineHandicap: parseFloat(v) || '' })}
          placeholder="f.eks. 12.5"
          min={-10}
          max={54}
          step={0.1}
        />
        <InputField
          label="Driver hastighet (mph)"
          type="number"
          value={formData.baselineDriverSpeed}
          onChange={(v) => setFormData({ ...formData, baselineDriverSpeed: parseFloat(v) || '' })}
          placeholder="f.eks. 105"
          min={40}
          max={150}
        />
      </div>
    </FormCard>
  </div>
);

const Step2Schedule = ({ formData, setFormData }) => (
  <div style={{ display: 'grid', gap: '24px' }}>
    <FormCard
      title="Treningstimer per uke"
      subtitle="Hvor mye tid kan du dedikere til golf per uke?"
      icon={Clock}
    >
      <div style={{ maxWidth: '300px' }}>
        <InputField
          label="Timer per uke"
          type="number"
          value={formData.weeklyHoursTarget}
          onChange={(v) => setFormData({ ...formData, weeklyHoursTarget: parseInt(v) || '' })}
          placeholder="f.eks. 12"
          min={5}
          max={30}
        />
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '8px' }}>
          Anbefalt: 10-15 timer for seriøse spillere
        </p>
      </div>
    </FormCard>

    <FormCard
      title="Foretrukne treningsdager"
      subtitle="Velg hvilke dager du vanligvis kan trene"
      icon={Calendar}
    >
      <DaySelector
        selectedDays={formData.preferredTrainingDays}
        onChange={(days) => setFormData({ ...formData, preferredTrainingDays: days })}
      />
      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '12px' }}>
        Valgt: {formData.preferredTrainingDays.length} dager per uke
      </p>
    </FormCard>
  </div>
);

const Step3Tournaments = ({ formData, setFormData }) => (
  <div style={{ display: 'grid', gap: '24px' }}>
    <FormCard
      title="Turneringer"
      subtitle="Legg til turneringer du planlegger å spille. Planen vil periodiseres rundt disse."
      icon={Trophy}
    >
      <TournamentList
        tournaments={formData.tournaments}
        onAdd={(t) => setFormData({ ...formData, tournaments: [...formData.tournaments, t] })}
        onRemove={(index) => setFormData({
          ...formData,
          tournaments: formData.tournaments.filter((_, i) => i !== index)
        })}
      />
    </FormCard>

    <div
      style={{
        padding: '16px',
        borderRadius: '12px',
        backgroundColor: 'rgba(var(--accent-rgb), 0.05)',
        border: '1px solid rgba(var(--accent-rgb), 0.2)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        <Sparkles size={20} color="var(--accent)" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div>
          <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)', margin: '0 0 4px 0' }}>
            Tips: A, B, C-prioritering
          </p>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
            <strong>A-turneringer</strong> er hovedmål (1-2 per år). Planen vil bygge opp mot disse med optimal periodisering.
            <strong> B-turneringer</strong> er viktige konkurranser. <strong>C-turneringer</strong> er forberedelse og erfaring.
          </p>
        </div>
      </div>
    </div>
  </div>
);

const Step4Review = ({ formData }) => {
  const dayNames = ['Søn', 'Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør'];

  return (
    <div style={{ display: 'grid', gap: '24px' }}>
      <FormCard title="Oppsummering" icon={Check}>
        <div style={{ display: 'grid', gap: '20px' }}>
          {/* Basics */}
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
              GRUNNLEGGENDE
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
              <div style={{ padding: '12px', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Startdato</div>
                <div style={{ fontSize: '15px', fontWeight: 500 }}>
                  {formData.startDate ? new Date(formData.startDate).toLocaleDateString('nb-NO') : '-'}
                </div>
              </div>
              <div style={{ padding: '12px', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Score</div>
                <div style={{ fontSize: '15px', fontWeight: 500 }}>{formData.baselineAverageScore || '-'}</div>
              </div>
              <div style={{ padding: '12px', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Handicap</div>
                <div style={{ fontSize: '15px', fontWeight: 500 }}>{formData.baselineHandicap || '-'}</div>
              </div>
              <div style={{ padding: '12px', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Driver speed</div>
                <div style={{ fontSize: '15px', fontWeight: 500 }}>
                  {formData.baselineDriverSpeed ? `${formData.baselineDriverSpeed} mph` : '-'}
                </div>
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
              TRENINGSPLAN
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
              <div style={{ padding: '12px', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Timer/uke</div>
                <div style={{ fontSize: '15px', fontWeight: 500 }}>{formData.weeklyHoursTarget || 12} timer</div>
              </div>
              <div style={{ padding: '12px', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Treningsdager</div>
                <div style={{ fontSize: '15px', fontWeight: 500 }}>
                  {formData.preferredTrainingDays.map(d => dayNames[d]).join(', ') || '-'}
                </div>
              </div>
            </div>
          </div>

          {/* Tournaments */}
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
              TURNERINGER ({formData.tournaments.length})
            </h4>
            {formData.tournaments.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {formData.tournaments.map((t, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '10px 12px',
                      backgroundColor: 'var(--bg-secondary)',
                      borderRadius: '8px',
                    }}
                  >
                    <span style={{ fontWeight: 500 }}>{t.name}</span>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                      {new Date(t.startDate).toLocaleDateString('nb-NO')} ({t.importance})
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                Ingen turneringer lagt til
              </p>
            )}
          </div>
        </div>
      </FormCard>

      <div
        style={{
          padding: '20px',
          borderRadius: '12px',
          backgroundColor: 'rgba(34, 197, 94, 0.05)',
          border: '1px solid rgba(34, 197, 94, 0.2)',
          textAlign: 'center',
        }}
      >
        <Sparkles size={32} color="#22c55e" style={{ marginBottom: '12px' }} />
        <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 8px 0' }}>
          Klar til å generere!
        </h3>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>
          Klikk "Generer årsplan" for å lage din personlige 12-måneders treningsplan
        </p>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const AarsplanGenerator = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    startDate: new Date().toISOString().split('T')[0],
    planName: '',
    baselineAverageScore: '',
    baselineHandicap: '',
    baselineDriverSpeed: '',
    weeklyHoursTarget: 12,
    preferredTrainingDays: [1, 3, 5, 6], // Man, Ons, Fre, Lør
    tournaments: [],
  });

  const steps = [
    { label: 'Grunnlag', component: Step1Basics },
    { label: 'Timeplan', component: Step2Schedule },
    { label: 'Turneringer', component: Step3Tournaments },
    { label: 'Bekreft', component: Step4Review },
  ];

  const canProceed = useCallback(() => {
    switch (currentStep) {
      case 0:
        return formData.startDate && formData.baselineAverageScore;
      case 1:
        return formData.preferredTrainingDays.length > 0;
      case 2:
        return true; // Tournaments are optional
      case 3:
        return true;
      default:
        return false;
    }
  }, [currentStep, formData]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const payload = {
        playerId: user?.playerId || user?.id,
        startDate: formData.startDate,
        baselineAverageScore: formData.baselineAverageScore,
        baselineHandicap: formData.baselineHandicap || undefined,
        baselineDriverSpeed: formData.baselineDriverSpeed || undefined,
        planName: formData.planName || `Årsplan ${new Date().getFullYear()}`,
        weeklyHoursTarget: formData.weeklyHoursTarget,
        tournaments: formData.tournaments.length > 0 ? formData.tournaments : undefined,
        preferredTrainingDays: formData.preferredTrainingDays,
      };

      await apiClient.post('/training-plan/generate', payload);

      // Navigate to the annual plan page
      navigate('/aarsplan');
    } catch (err) {
      console.error('Error generating plan:', err);
      setError(err.response?.data?.message || 'Kunne ikke generere årsplan. Prøv igjen.');
    } finally {
      setIsGenerating(false);
    }
  };

  const StepComponent = steps[currentStep].component;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-secondary)' }}>
      <PageHeader
        title="Årsplan Generator"
        subtitle="Lag din personlige 12-måneders treningsplan"
        showBackButton
        onBack={() => navigate('/aarsplan')}
      />

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '24px' }}>
        {/* Step indicator */}
        <StepIndicator
          currentStep={currentStep}
          totalSteps={steps.length}
          steps={steps}
        />

        {/* Step content */}
        <StepComponent formData={formData} setFormData={setFormData} />

        {/* Error message */}
        {error && (
          <div
            style={{
              marginTop: '20px',
              padding: '14px 16px',
              borderRadius: '10px',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              color: '#ef4444',
              fontSize: '14px',
            }}
          >
            {error}
          </div>
        )}

        {/* Navigation buttons */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '32px',
            paddingTop: '24px',
            borderTop: '1px solid var(--border-default)',
          }}
        >
          <button
            type="button"
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 20px',
              borderRadius: '10px',
              border: '1px solid var(--border-default)',
              backgroundColor: 'var(--bg-primary)',
              color: 'var(--text-primary)',
              fontSize: '15px',
              fontWeight: 500,
              cursor: currentStep === 0 ? 'not-allowed' : 'pointer',
              opacity: currentStep === 0 ? 0.5 : 1,
            }}
          >
            <ChevronLeft size={18} />
            Tilbake
          </button>

          {currentStep < steps.length - 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep + 1)}
              disabled={!canProceed()}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: canProceed() ? 'var(--accent)' : 'var(--bg-secondary)',
                color: canProceed() ? 'white' : 'var(--text-secondary)',
                fontSize: '15px',
                fontWeight: 500,
                cursor: canProceed() ? 'pointer' : 'not-allowed',
              }}
            >
              Neste
              <ChevronRight size={18} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleGenerate}
              disabled={isGenerating || !canProceed()}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 28px',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: '#22c55e',
                color: 'white',
                fontSize: '15px',
                fontWeight: 600,
                cursor: isGenerating ? 'wait' : 'pointer',
                opacity: isGenerating ? 0.8 : 1,
              }}
            >
              {isGenerating ? (
                <>
                  <Loader2 size={18} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
                  Genererer...
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  Generer årsplan
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* CSS for spinner animation */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AarsplanGenerator;
