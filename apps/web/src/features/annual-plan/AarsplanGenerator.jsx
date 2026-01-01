import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar, Target, Clock, Trophy, ChevronRight, ChevronLeft,
  Check, Plus, X, Loader2, Sparkles, CheckCircle, ArrowRight
} from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
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

      return (
        <div key={index} className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all"
            style={{
              backgroundColor: isCompleted || isActive ? 'var(--accent)' : 'var(--bg-secondary)',
              color: isCompleted || isActive ? 'white' : 'var(--text-secondary)',
            }}
          >
            {isCompleted ? <Check size={16} /> : index + 1}
          </div>
          <span
            className="text-sm"
            style={{
              fontWeight: isActive ? 600 : 400,
              color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
            }}
          >
            {step.label}
          </span>
          {index < totalSteps - 1 && (
            <div
              className="w-10 h-0.5 ml-2"
              style={{
                backgroundColor: isCompleted ? 'var(--accent)' : 'var(--border-default)',
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
    className="rounded-2xl p-6 shadow-sm"
    style={{
      backgroundColor: 'var(--bg-primary)',
      border: '1px solid var(--border-default)',
    }}
  >
    {title && (
      <div className="mb-5">
        <div className="flex items-center gap-3 mb-1">
          {Icon && <Icon size={24} color="var(--accent)" />}
          <h3 className="text-lg font-semibold m-0" style={{ color: 'var(--text-primary)' }}>
            {title}
          </h3>
        </div>
        {subtitle && (
          <p className="text-sm m-0" style={{ color: 'var(--text-secondary)', marginLeft: Icon ? '36px' : 0 }}>
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
    <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>
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
      className="w-full py-3 px-3.5 rounded-lg text-base outline-none transition-colors"
      style={{
        border: '1px solid var(--border-default)',
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--text-primary)',
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
    <div className="flex gap-2 flex-wrap">
      {days.map(day => {
        const isSelected = selectedDays.includes(day.value);
        return (
          <button
            key={day.value}
            type="button"
            onClick={() => toggleDay(day.value)}
            className="py-3 px-4 rounded-lg text-sm cursor-pointer transition-all min-w-[52px]"
            style={{
              border: isSelected ? '2px solid var(--accent)' : '1px solid var(--border-default)',
              backgroundColor: isSelected ? 'rgba(var(--accent-rgb), 0.1)' : 'var(--bg-primary)',
              color: isSelected ? 'var(--accent)' : 'var(--text-primary)',
              fontWeight: isSelected ? 600 : 400,
            }}
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

  const importanceColors = {
    A: { bg: 'rgba(239, 68, 68, 0.1)', text: 'var(--error)', label: 'A - Hovedmål' },
    B: { bg: 'rgba(234, 179, 8, 0.1)', text: 'var(--warning)', label: 'B - Viktig' },
    C: { bg: 'rgba(34, 197, 94, 0.1)', text: 'var(--success)', label: 'C - Forberedelse' },
  };

  return (
    <div>
      {/* Existing tournaments */}
      {tournaments.length > 0 && (
        <div className="flex flex-col gap-2.5 mb-4">
          {tournaments.map((t, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-3 px-4 rounded-lg"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-default)',
              }}
            >
              <div className="flex items-center gap-3">
                <Trophy size={18} color={importanceColors[t.importance].text} />
                <div>
                  <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    {t.name}
                  </div>
                  <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {new Date(t.startDate).toLocaleDateString('nb-NO')}
                    {t.endDate !== t.startDate && ` - ${new Date(t.endDate).toLocaleDateString('nb-NO')}`}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="py-1 px-2 rounded-md text-xs font-semibold"
                  style={{
                    backgroundColor: importanceColors[t.importance].bg,
                    color: importanceColors[t.importance].text,
                  }}
                >
                  {t.importance}
                </span>
                <button
                  type="button"
                  onClick={() => onRemove(index)}
                  className="p-1.5 rounded-md border-none bg-transparent cursor-pointer"
                  style={{ color: 'var(--text-secondary)' }}
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
          className="p-4 rounded-xl"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-default)',
          }}
        >
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
                className="w-full py-3 px-3.5 rounded-lg text-base"
                style={{
                  border: '1px solid var(--border-default)',
                  backgroundColor: 'var(--bg-primary)',
                }}
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
              className="flex-1 py-2.5 px-4 rounded-lg border-none text-sm font-medium cursor-pointer text-white"
              style={{
                backgroundColor: 'var(--accent)',
                opacity: (!newTournament.name || !newTournament.startDate) ? 0.5 : 1,
              }}
            >
              Legg til
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="py-2.5 px-4 rounded-lg text-sm cursor-pointer"
              style={{
                border: '1px solid var(--border-default)',
                backgroundColor: 'var(--bg-primary)',
                color: 'var(--text-primary)',
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
          className="flex items-center justify-center gap-2 w-full py-3.5 rounded-lg bg-transparent text-sm cursor-pointer transition-all"
          style={{
            border: '2px dashed var(--border-default)',
            color: 'var(--text-secondary)',
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
        <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
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
      <p className="text-sm mt-3" style={{ color: 'var(--text-secondary)' }}>
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

    <div
      className="p-4 rounded-xl"
      style={{
        backgroundColor: 'rgba(var(--accent-rgb), 0.05)',
        border: '1px solid rgba(var(--accent-rgb), 0.2)',
      }}
    >
      <div className="flex items-start gap-3">
        <Sparkles size={20} color="var(--accent)" className="shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium mb-1 m-0" style={{ color: 'var(--text-primary)' }}>
            Tips: A, B, C-prioritering
          </p>
          <p className="text-sm m-0" style={{ color: 'var(--text-secondary)' }}>
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
            <h4 className="text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
              GRUNNLEGGENDE
            </h4>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-3">
              <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Startdato</div>
                <div className="text-base font-medium">
                  {formData.startDate ? new Date(formData.startDate).toLocaleDateString('nb-NO') : '-'}
                </div>
              </div>
              <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Score</div>
                <div className="text-base font-medium">{formData.baselineAverageScore || '-'}</div>
              </div>
              <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Handicap</div>
                <div className="text-base font-medium">{formData.baselineHandicap || '-'}</div>
              </div>
              <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Driver speed</div>
                <div className="text-base font-medium">
                  {formData.baselineDriverSpeed ? `${formData.baselineDriverSpeed} mph` : '-'}
                </div>
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div>
            <h4 className="text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
              TRENINGSPLAN
            </h4>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-3">
              <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Timer/uke</div>
                <div className="text-base font-medium">{formData.weeklyHoursTarget || 12} timer</div>
              </div>
              <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Treningsdager</div>
                <div className="text-base font-medium">
                  {formData.preferredTrainingDays.map(d => dayNames[d]).join(', ') || '-'}
                </div>
              </div>
            </div>
          </div>

          {/* Tournaments */}
          <div>
            <h4 className="text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
              TURNERINGER ({formData.tournaments.length})
            </h4>
            {formData.tournaments.length > 0 ? (
              <div className="flex flex-col gap-2">
                {formData.tournaments.map((t, i) => (
                  <div
                    key={i}
                    className="flex justify-between py-2.5 px-3 rounded-lg"
                    style={{ backgroundColor: 'var(--bg-secondary)' }}
                  >
                    <span className="font-medium">{t.name}</span>
                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {new Date(t.startDate).toLocaleDateString('nb-NO')} ({t.importance})
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Ingen turneringer lagt til
              </p>
            )}
          </div>
        </div>
      </FormCard>

      <div
        className="p-5 rounded-xl text-center"
        style={{
          backgroundColor: 'rgba(34, 197, 94, 0.05)',
          border: '1px solid rgba(34, 197, 94, 0.2)',
        }}
      >
        <Sparkles size={32} color="var(--success)" className="mb-3" />
        <h3 className="text-lg font-semibold mb-2 m-0" style={{ color: 'var(--text-primary)' }}>
          Klar til å generere!
        </h3>
        <p className="text-sm m-0" style={{ color: 'var(--text-secondary)' }}>
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
    <div
      className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
      style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)' }}
    >
      <CheckCircle size={40} color="var(--success)" />
    </div>

    <h2 className="text-2xl font-semibold mb-2 m-0" style={{ color: 'var(--text-primary)' }}>
      Årsplan opprettet!
    </h2>
    <p className="text-base mb-8 m-0" style={{ color: 'var(--text-secondary)' }}>
      Din 12-måneders treningsplan er klar
    </p>

    {/* Stats */}
    <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mb-8">
      <div
        className="p-5 rounded-xl"
        style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--border-default)',
        }}
      >
        <div className="text-3xl font-bold" style={{ color: 'var(--accent)' }}>
          {result?.dailyAssignments?.created || 365}
        </div>
        <div className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
          Treningsøkter
        </div>
      </div>
      <div
        className="p-5 rounded-xl"
        style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--border-default)',
        }}
      >
        <div className="text-3xl font-bold" style={{ color: 'var(--accent)' }}>
          52
        </div>
        <div className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
          Uker planlagt
        </div>
      </div>
      <div
        className="p-5 rounded-xl"
        style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--border-default)',
        }}
      >
        <div className="text-3xl font-bold" style={{ color: 'var(--accent)' }}>
          {result?.tournaments?.scheduled || 0}
        </div>
        <div className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
          Turneringer
        </div>
      </div>
    </div>

    {/* Info box */}
    <div
      className="py-4 px-5 rounded-xl max-w-lg mx-auto mb-8 text-left"
      style={{
        backgroundColor: syncResult ? 'rgba(34, 197, 94, 0.05)' : 'rgba(var(--accent-rgb), 0.05)',
        border: `1px solid ${syncResult ? 'rgba(34, 197, 94, 0.2)' : 'rgba(var(--accent-rgb), 0.2)'}`,
      }}
    >
      <div className="flex gap-3 items-start">
        <Calendar size={20} color={syncResult ? 'var(--success)' : 'var(--accent)'} className="shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium mb-1 m-0" style={{ color: 'var(--text-primary)' }}>
            {syncResult ? `${syncResult.syncedCount} økter synkronisert!` : 'Klar til synkronisering'}
          </p>
          <p className="text-sm m-0" style={{ color: 'var(--text-secondary)' }}>
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
          className="flex items-center justify-center gap-2 py-3.5 px-8 rounded-lg border-none text-base font-medium mx-auto text-white"
          style={{
            backgroundColor: 'var(--accent)',
            cursor: isSyncing ? 'not-allowed' : 'pointer',
            opacity: isSyncing ? 0.7 : 1,
          }}
        >
          {isSyncing ? (
            <>
              <Loader2 size={18} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
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
        className="flex items-center gap-2 py-3.5 px-6 rounded-lg text-base font-medium cursor-pointer"
        style={{
          border: '1px solid var(--border-default)',
          backgroundColor: 'var(--bg-primary)',
          color: 'var(--text-primary)',
        }}
      >
        <Calendar size={18} />
        Se kalender
      </button>
      <button
        onClick={onViewPlan}
        className="flex items-center gap-2 py-3.5 px-6 rounded-lg border-none text-base font-medium cursor-pointer text-white"
        style={{ backgroundColor: 'var(--accent)' }}
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
      <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <PageHeader
          title="Årsplan opprettet"
          subtitle="Din treningsplan er klar"
          showBackButton
          onBack={() => navigate('/aarsplan')}
        />
        <div className="max-w-xl mx-auto p-6">
          <div
            className="rounded-2xl shadow-sm"
            style={{
              backgroundColor: 'var(--bg-primary)',
              border: '1px solid var(--border-default)',
            }}
          >
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
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-secondary)' }}>
      <PageHeader
        title="Årsplan Generator"
        subtitle="Lag din personlige 12-måneders treningsplan"
        showBackButton
        onBack={() => navigate('/aarsplan')}
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
          <div
            className="mt-5 py-3.5 px-4 rounded-lg text-sm"
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              color: 'var(--error)',
            }}
          >
            {error}
          </div>
        )}

        {/* Navigation buttons */}
        <div
          className="flex justify-between mt-8 pt-6"
          style={{ borderTop: '1px solid var(--border-default)' }}
        >
          <button
            type="button"
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="flex items-center gap-2 py-3 px-5 rounded-lg text-base font-medium"
            style={{
              border: '1px solid var(--border-default)',
              backgroundColor: 'var(--bg-primary)',
              color: 'var(--text-primary)',
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
              className="flex items-center gap-2 py-3 px-6 rounded-lg border-none text-base font-medium"
              style={{
                backgroundColor: canProceed() ? 'var(--accent)' : 'var(--bg-secondary)',
                color: canProceed() ? 'white' : 'var(--text-secondary)',
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
              className="flex items-center gap-2 py-3 px-7 rounded-lg border-none text-base font-semibold text-white"
              style={{
                backgroundColor: 'var(--success)',
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
