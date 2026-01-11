import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar, Target, Clock, Trophy, ChevronRight, ChevronLeft,
  Check, Plus, X, Loader2, Sparkles, CheckCircle, ArrowRight
} from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { SectionTitle, SubSectionTitle, CardTitle } from '../../components/typography/Headings';
import { useAuth } from '../../contexts/AuthContext';
import apiClient from '../../services/apiClient';
import { toast } from 'sonner';

// ============================================================================
// STEP INDICATOR
// ============================================================================

const StepIndicator = ({ currentStep, totalSteps, steps }) => (
  <div className="flex justify-center gap-2 mb-8">
    {steps.map((step, index) => {
      const isActive = index === currentStep;
      const isCompleted = index < currentStep;
      const isHighlighted = isCompleted || isActive;

      return (
        <div key={index} className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
              isHighlighted ? 'bg-accent text-white' : 'bg-bg-secondary text-text-secondary'
            }`}
          >
            {isCompleted ? <Check size={16} /> : index + 1}
          </div>
          <span
            className={`text-sm ${isActive ? 'font-semibold text-text-primary' : 'font-normal text-text-secondary'}`}
          >
            {step.label}
          </span>
          {index < totalSteps - 1 && (
            <div
              className={`w-10 h-0.5 ml-2 ${isCompleted ? 'bg-accent' : 'bg-border-default'}`}
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
  <div className="rounded-2xl p-6 shadow-sm bg-bg-primary border border-default">
    {title && (
      <div className="mb-5">
        <div className="flex items-center gap-3 mb-1">
          {Icon && <Icon size={24} color="var(--accent)" />}
          <SubSectionTitle style={{ marginBottom: 0 }}>
            {title}
          </SubSectionTitle>
        </div>
        {subtitle && (
          <p className={`text-sm m-0 text-text-secondary ${Icon ? 'ml-9' : ''}`}>
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
  <div className="mb-4">
    <label className="block text-sm font-medium mb-1.5 text-text-primary">
      {label} {required && <span className="text-danger">*</span>}
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
      className="w-full py-3 px-3.5 rounded-lg text-base outline-none transition-colors border border-default bg-bg-primary text-text-primary"
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
    <div className="flex gap-2 flex-wrap">
      {days.map(day => {
        const isSelected = selectedDays.includes(day.value);
        return (
          <button
            key={day.value}
            type="button"
            onClick={() => toggleDay(day.value)}
            className={`py-3 px-4 rounded-lg text-sm cursor-pointer transition-all min-w-[52px] ${
              isSelected
                ? 'border-2 border-accent bg-accent-muted text-accent font-semibold'
                : 'border border-default bg-bg-primary text-text-primary font-normal'
            }`}
          >
            {day.label}
          </button>
        );
      })}
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

  // Map importance to semantic class strings
  const importanceStyles = {
    A: { classes: 'bg-danger-muted text-danger', iconColor: 'var(--status-error)', label: 'A - Hovedmål' },
    B: { classes: 'bg-warning-muted text-warning', iconColor: 'var(--status-warning)', label: 'B - Viktig' },
    C: { classes: 'bg-success-muted text-success', iconColor: 'var(--status-success)', label: 'C - Forberedelse' },
  };

  return (
    <div>
      {/* Existing tournaments */}
      {tournaments.length > 0 && (
        <div className="flex flex-col gap-2.5 mb-4">
          {tournaments.map((t, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-3 px-4 rounded-lg bg-bg-secondary border border-default"
            >
              <div className="flex items-center gap-3">
                <Trophy size={18} color={importanceStyles[t.importance].iconColor} />
                <div>
                  <div className="text-sm font-medium text-text-primary">
                    {t.name}
                  </div>
                  <div className="text-xs text-text-secondary">
                    {new Date(t.startDate).toLocaleDateString('nb-NO')}
                    {t.endDate !== t.startDate && ` - ${new Date(t.endDate).toLocaleDateString('nb-NO')}`}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`py-1 px-2 rounded-md text-xs font-semibold ${importanceStyles[t.importance].classes}`}
                >
                  {t.importance}
                </span>
                <button
                  type="button"
                  onClick={() => onRemove(index)}
                  className="p-1.5 rounded-md border-none bg-transparent cursor-pointer text-text-secondary"
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
        <div className="p-4 rounded-xl bg-bg-secondary border border-default">
          <div className="grid grid-cols-2 gap-3 mb-3">
            <InputField
              label="Turneringsnavn"
              value={newTournament.name}
              onChange={(v) => setNewTournament({ ...newTournament, name: v })}
              placeholder="f.eks. NM Senior"
              required
            />
            <div>
              <label className="block text-sm font-medium mb-1.5">
                Viktighet
              </label>
              <select
                value={newTournament.importance}
                onChange={(e) => setNewTournament({ ...newTournament, importance: e.target.value })}
                className="w-full py-3 px-3.5 rounded-lg text-base border border-default bg-bg-primary"
              >
                <option value="A">A - Hovedmål</option>
                <option value="B">B - Viktig</option>
                <option value="C">C - Forberedelse</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-4">
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
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleAdd}
              disabled={!newTournament.name || !newTournament.startDate}
              className="flex-1 py-2.5 px-4 rounded-lg border-none text-sm font-medium cursor-pointer text-white bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Legg til
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="py-2.5 px-4 rounded-lg text-sm cursor-pointer border border-default bg-bg-primary text-text-primary"
            >
              Avbryt
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="flex items-center justify-center gap-2 w-full py-3.5 rounded-lg bg-transparent text-sm cursor-pointer transition-all border-2 border-dashed border-default text-text-secondary"
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
  <div className="grid gap-6">
    <FormCard
      title="Grunnleggende info"
      subtitle="Start med å angi når planen skal starte og dine nåværende nivå"
      icon={Calendar}
    >
      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
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
      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
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
  <div className="grid gap-6">
    <FormCard
      title="Treningstimer per uke"
      subtitle="Hvor mye tid kan du dedikere til golf per uke?"
      icon={Clock}
    >
      <div className="max-w-xs">
        <InputField
          label="Timer per uke"
          type="number"
          value={formData.weeklyHoursTarget}
          onChange={(v) => setFormData({ ...formData, weeklyHoursTarget: parseInt(v) || '' })}
          placeholder="f.eks. 12"
          min={5}
          max={30}
        />
        <p className="text-sm mt-2 text-text-secondary">
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
      <p className="text-sm mt-3 text-text-secondary">
        Valgt: {formData.preferredTrainingDays.length} dager per uke
      </p>
    </FormCard>
  </div>
);

const Step3Tournaments = ({ formData, setFormData }) => (
  <div className="grid gap-6">
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

    <div className="p-4 rounded-xl bg-accent-muted border border-accent">
      <div className="flex items-start gap-3">
        <Sparkles size={20} color="var(--accent)" className="shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium mb-1 m-0 text-text-primary">
            Tips: A, B, C-prioritering
          </p>
          <p className="text-sm m-0 text-text-secondary">
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
    <div className="grid gap-6">
      <FormCard title="Oppsummering" icon={Check}>
        <div className="grid gap-5">
          {/* Basics */}
          <div>
            <CardTitle style={{ marginBottom: '0.5rem' }} className="text-sm text-text-secondary">
              GRUNNLEGGENDE
            </CardTitle>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-3">
              <div className="p-3 rounded-lg bg-bg-secondary">
                <div className="text-xs text-text-secondary">Startdato</div>
                <div className="text-base font-medium">
                  {formData.startDate ? new Date(formData.startDate).toLocaleDateString('nb-NO') : '-'}
                </div>
              </div>
              <div className="p-3 rounded-lg bg-bg-secondary">
                <div className="text-xs text-text-secondary">Score</div>
                <div className="text-base font-medium">{formData.baselineAverageScore || '-'}</div>
              </div>
              <div className="p-3 rounded-lg bg-bg-secondary">
                <div className="text-xs text-text-secondary">Handicap</div>
                <div className="text-base font-medium">{formData.baselineHandicap || '-'}</div>
              </div>
              <div className="p-3 rounded-lg bg-bg-secondary">
                <div className="text-xs text-text-secondary">Driver speed</div>
                <div className="text-base font-medium">
                  {formData.baselineDriverSpeed ? `${formData.baselineDriverSpeed} mph` : '-'}
                </div>
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div>
            <CardTitle style={{ marginBottom: '0.5rem' }} className="text-sm text-text-secondary">
              TRENINGSPLAN
            </CardTitle>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-3">
              <div className="p-3 rounded-lg bg-bg-secondary">
                <div className="text-xs text-text-secondary">Timer/uke</div>
                <div className="text-base font-medium">{formData.weeklyHoursTarget || 12} timer</div>
              </div>
              <div className="p-3 rounded-lg bg-bg-secondary">
                <div className="text-xs text-text-secondary">Treningsdager</div>
                <div className="text-base font-medium">
                  {formData.preferredTrainingDays.map(d => dayNames[d]).join(', ') || '-'}
                </div>
              </div>
            </div>
          </div>

          {/* Tournaments */}
          <div>
            <CardTitle style={{ marginBottom: '0.5rem' }} className="text-sm text-text-secondary">
              TURNERINGER ({formData.tournaments.length})
            </CardTitle>
            {formData.tournaments.length > 0 ? (
              <div className="flex flex-col gap-2">
                {formData.tournaments.map((t, i) => (
                  <div
                    key={i}
                    className="flex justify-between py-2.5 px-3 rounded-lg bg-bg-secondary"
                  >
                    <span className="font-medium">{t.name}</span>
                    <span className="text-sm text-text-secondary">
                      {new Date(t.startDate).toLocaleDateString('nb-NO')} ({t.importance})
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-text-secondary">
                Ingen turneringer lagt til
              </p>
            )}
          </div>
        </div>
      </FormCard>

      <div className="p-5 rounded-xl text-center bg-success-muted border border-success-muted">
        <Sparkles size={32} color="var(--status-success)" className="mb-3" />
        <SubSectionTitle style={{ marginBottom: '0.5rem' }}>
          Klar til å generere!
        </SubSectionTitle>
        <p className="text-sm m-0 text-text-secondary">
          Klikk "Generer årsplan" for å lage din personlige 12-måneders treningsplan
        </p>
      </div>
    </div>
  );
};

// ============================================================================
// SUCCESS SCREEN
// ============================================================================

const SuccessScreen = ({ result, planId, onViewPlan, onViewCalendar, onSyncToSessions }) => {
  const [isSyncing, setIsSyncing] = React.useState(false);
  const [syncResult, setSyncResult] = React.useState(null);

  const handleSync = async () => {
    if (!planId || isSyncing) return;
    setIsSyncing(true);
    try {
      const synced = await onSyncToSessions(planId);
      setSyncResult(synced);
    } catch (err) {
      console.error('Sync failed:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
  <div className="text-center py-10 px-5">
    <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 bg-success-muted">
      <CheckCircle size={40} color="var(--status-success)" />
    </div>

    <SectionTitle style={{ marginBottom: '0.5rem' }}>
      Årsplan opprettet!
    </SectionTitle>
    <p className="text-base mb-8 m-0 text-text-secondary">
      Din 12-måneders treningsplan er klar
    </p>

    {/* Stats */}
    <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mb-8">
      <div className="p-5 rounded-xl bg-bg-primary border border-default">
        <div className="text-3xl font-bold text-accent">
          {result?.dailyAssignments?.created || 365}
        </div>
        <div className="text-sm mt-1 text-text-secondary">
          Treningsøkter
        </div>
      </div>
      <div className="p-5 rounded-xl bg-bg-primary border border-default">
        <div className="text-3xl font-bold text-accent">
          52
        </div>
        <div className="text-sm mt-1 text-text-secondary">
          Uker planlagt
        </div>
      </div>
      <div className="p-5 rounded-xl bg-bg-primary border border-default">
        <div className="text-3xl font-bold text-accent">
          {result?.tournaments?.scheduled || 0}
        </div>
        <div className="text-sm mt-1 text-text-secondary">
          Turneringer
        </div>
      </div>
    </div>

    {/* Info box */}
    <div
      className={`py-4 px-5 rounded-xl max-w-lg mx-auto mb-8 text-left ${
        syncResult ? 'bg-success-muted border border-success-muted' : 'bg-accent-muted border border-accent'
      }`}
    >
      <div className="flex gap-3 items-start">
        <Calendar size={20} color={syncResult ? 'var(--status-success)' : 'var(--accent)'} className="shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium mb-1 m-0 text-text-primary">
            {syncResult ? `${syncResult.syncedCount} økter synkronisert!` : 'Klar til synkronisering'}
          </p>
          <p className="text-sm m-0 text-text-secondary">
            {syncResult
              ? 'Alle planlagte treningsøkter er lagt til i økt-oversikten. Du kan se dem under "Alle økter".'
              : 'Trykk "Synkroniser" for å legge til de neste 4 ukenes økter i økt-oversikten.'
            }
          </p>
        </div>
      </div>
    </div>

    {/* Sync button */}
    {!syncResult && (
      <div className="mb-6">
        <button
          onClick={handleSync}
          disabled={isSyncing}
          className="flex items-center justify-center gap-2 py-3.5 px-8 rounded-lg border-none text-base font-medium mx-auto text-white bg-accent disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSyncing ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Synkroniserer...
            </>
          ) : (
            <>
              <Sparkles size={18} />
              Synkroniser til økter
            </>
          )}
        </button>
      </div>
    )}

    {/* Action buttons */}
    <div className="flex gap-3 justify-center">
      <button
        onClick={onViewCalendar}
        className="flex items-center gap-2 py-3.5 px-6 rounded-lg text-base font-medium cursor-pointer border border-default bg-bg-primary text-text-primary"
      >
        <Calendar size={18} />
        Se kalender
      </button>
      <button
        onClick={onViewPlan}
        className="flex items-center gap-2 py-3.5 px-6 rounded-lg border-none text-base font-medium cursor-pointer text-white bg-accent"
      >
        Se årsplan
        <ArrowRight size={18} />
      </button>
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
  const [generationResult, setGenerationResult] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [createdPlanId, setCreatedPlanId] = useState(null);

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

      const response = await apiClient.post('/training-plan/generate', payload);

      // Store the plan ID for syncing
      const planId = response.data?.plan?.id || response.data?.id;
      setCreatedPlanId(planId);

      // Store the result and show success screen
      setGenerationResult({
        dailyAssignments: { created: response.data?.dailyAssignments?.length || 365 },
        tournaments: { scheduled: formData.tournaments.length },
      });
      setShowSuccess(true);

      // Show toast notification
      toast.success('Årsplan opprettet!', {
        description: `${response.data?.dailyAssignments?.length || 365} treningsøkter lagt til i kalenderen`,
      });
    } catch (err) {
      console.error('Error generating plan:', err);
      setError(err.response?.data?.message || 'Kunne ikke generere årsplan. Prøv igjen.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Sync plan to sessions
  const handleSyncToSessions = useCallback(async (planId) => {
    try {
      const response = await apiClient.post(`/training-plan/${planId}/sync-to-sessions`);
      const { syncedCount, skippedCount } = response.data || {};

      toast.success(`${syncedCount} økter synkronisert!`, {
        description: skippedCount > 0 ? `${skippedCount} økter var allerede synkronisert` : undefined,
      });

      return response.data;
    } catch (err) {
      console.error('Error syncing plan:', err);
      toast.error('Kunne ikke synkronisere økter', {
        description: err.response?.data?.message || 'Prøv igjen senere',
      });
      throw err;
    }
  }, []);

  const StepComponent = steps[currentStep].component;

  // Show success screen after generation
  if (showSuccess) {
    return (
      <div className="min-h-screen bg-bg-secondary">
        <PageHeader
          title="Årsplan opprettet"
          subtitle="Din treningsplan er klar"
        />
        <div className="max-w-xl mx-auto p-6">
          <div className="rounded-2xl shadow-sm bg-bg-primary border border-default">
            <SuccessScreen
              result={generationResult}
              planId={createdPlanId}
              onViewPlan={() => navigate('/aarsplan')}
              onViewCalendar={() => navigate('/kalender')}
              onSyncToSessions={handleSyncToSessions}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-secondary">
      <PageHeader
        title="Årsplan Generator"
        subtitle="Lag din personlige 12-måneders treningsplan"
        helpText="Generer en komplett årsplan basert på dine mål, tilgjengelighet og treningsnivå. Systemet lager en periodisert plan med anbefalt fokus for hver måned."
      />

      <div className="max-w-3xl mx-auto p-6">
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
          <div className="mt-5 py-3.5 px-4 rounded-lg text-sm bg-danger-muted border border-danger-muted text-danger">
            {error}
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex justify-between mt-8 pt-6 border-t border-default">
          <button
            type="button"
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="flex items-center gap-2 py-3 px-5 rounded-lg text-base font-medium border border-default bg-bg-primary text-text-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={18} />
            Tilbake
          </button>

          {currentStep < steps.length - 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep + 1)}
              disabled={!canProceed()}
              className={`flex items-center gap-2 py-3 px-6 rounded-lg border-none text-base font-medium ${
                canProceed()
                  ? 'bg-accent text-white cursor-pointer'
                  : 'bg-bg-secondary text-text-secondary cursor-not-allowed'
              }`}
            >
              Neste
              <ChevronRight size={18} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleGenerate}
              disabled={isGenerating || !canProceed()}
              className="flex items-center gap-2 py-3 px-7 rounded-lg border-none text-base font-semibold text-white bg-success disabled:opacity-80 disabled:cursor-wait"
            >
              {isGenerating ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
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

    </div>
  );
};

export default AarsplanGenerator;
