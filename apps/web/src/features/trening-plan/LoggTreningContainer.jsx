/**
 * LoggTreningContainer.jsx
 * Design System v3.0 - Premium Light
 *
 * MIGRATED TO PAGE ARCHITECTURE - Zero inline styles
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus, Clock, Target, Dumbbell, Brain,
  Star, Save, CheckCircle, AlertCircle
} from 'lucide-react';
import Button from '../../ui/primitives/Button';
import { sessionsAPI } from '../../services/api';
import { SubSectionTitle } from '../../components/typography';

// ============================================================================
// CLASS MAPPINGS
// ============================================================================

const SESSION_TYPE_CLASSES = {
  technical: {
    text: 'text-ak-brand-primary',
    bg: 'bg-ak-brand-primary/15',
    activeBg: 'bg-ak-brand-primary',
    border: 'border-ak-brand-primary',
    icon: Target,
    label: 'Teknikk',
  },
  short_game: {
    text: 'text-ak-status-success',
    bg: 'bg-ak-status-success/15',
    activeBg: 'bg-ak-status-success',
    border: 'border-ak-status-success',
    icon: Target,
    label: 'Kortspill',
  },
  physical: {
    text: 'text-ak-status-error',
    bg: 'bg-ak-status-error/15',
    activeBg: 'bg-ak-status-error',
    border: 'border-ak-status-error',
    icon: Dumbbell,
    label: 'Fysisk',
  },
  mental: {
    text: 'text-amber-500',
    bg: 'bg-amber-500/15',
    activeBg: 'bg-amber-500',
    border: 'border-amber-500',
    icon: Brain,
    label: 'Mental',
  },
  round: {
    text: 'text-ak-text-primary',
    bg: 'bg-ak-surface-subtle',
    activeBg: 'bg-ak-text-primary',
    border: 'border-ak-text-primary',
    icon: Target,
    label: 'Runde',
  },
};

// ============================================================================
// MOCK DATA
// ============================================================================

const SESSION_TYPES = Object.entries(SESSION_TYPE_CLASSES).map(([id, config]) => ({
  id,
  label: config.label,
  icon: config.icon,
}));

const QUICK_EXERCISES = [
  { id: 'driver', name: 'Driver-trening', type: 'technical', duration: 45 },
  { id: 'irons', name: 'Jernspill', type: 'technical', duration: 45 },
  { id: 'chipping', name: 'Chipping', type: 'short_game', duration: 30 },
  { id: 'bunker', name: 'Bunker', type: 'short_game', duration: 30 },
  { id: 'putting', name: 'Putting', type: 'short_game', duration: 30 },
  { id: 'gym', name: 'Styrketrening', type: 'physical', duration: 60 },
  { id: 'flexibility', name: 'Mobilitet', type: 'physical', duration: 30 },
  { id: 'visualization', name: 'Visualisering', type: 'mental', duration: 20 },
];

const RECENT_LOGS = [
  {
    id: 'r1',
    date: '2025-01-18',
    type: 'technical',
    name: 'Driver-trening',
    duration: 90,
    rating: 4,
  },
  {
    id: 'r2',
    date: '2025-01-17',
    type: 'short_game',
    name: 'Kortspill og putting',
    duration: 75,
    rating: 5,
  },
  {
    id: 'r3',
    date: '2025-01-15',
    type: 'physical',
    name: 'Styrketrening',
    duration: 60,
    rating: 4,
  },
];

// ============================================================================
// SESSION TYPE SELECTOR
// ============================================================================

const SessionTypeSelector = ({ selected, onSelect }) => (
  <div className="grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))] gap-2 mb-6">
    {SESSION_TYPES.map((type) => {
      const classes = SESSION_TYPE_CLASSES[type.id];
      const Icon = type.icon;
      const isSelected = selected === type.id;

      return (
        <button
          key={type.id}
          onClick={() => onSelect(type.id)}
          className={`flex flex-col items-center gap-2 py-4 px-3 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
            isSelected
              ? `${classes.border} ${classes.bg}`
              : 'border-transparent bg-ak-surface-base'
          }`}
        >
          <div className={`w-10 h-10 rounded-[10px] flex items-center justify-center ${
            isSelected ? classes.activeBg : classes.bg
          }`}>
            <Icon size={20} className={isSelected ? 'text-white' : classes.text} />
          </div>
          <span className={`text-xs font-medium ${
            isSelected ? classes.text : 'text-ak-text-primary'
          }`}>
            {type.label}
          </span>
        </button>
      );
    })}
  </div>
);

// ============================================================================
// QUICK LOG BUTTONS
// ============================================================================

const QuickLogButtons = ({ sessionType, onQuickLog }) => {
  const filtered = sessionType
    ? QUICK_EXERCISES.filter((e) => e.type === sessionType)
    : QUICK_EXERCISES;

  return (
    <div className="bg-ak-surface-base rounded-[14px] p-4 mb-5">
      <SubSectionTitle className="text-sm m-0 mb-3">
        Hurtiglogg
      </SubSectionTitle>
      <div className="flex gap-2 flex-wrap">
        {filtered.map((exercise) => (
          <button
            key={exercise.id}
            onClick={() => onQuickLog(exercise)}
            className="py-2 px-3 rounded-lg border border-ak-border-default bg-ak-surface-subtle text-ak-text-primary text-[13px] font-medium cursor-pointer flex items-center gap-1 transition-all duration-200 hover:bg-ak-border-default"
          >
            <Plus size={14} />
            {exercise.name}
            <span className="text-[11px] text-ak-text-secondary">
              ({exercise.duration} min)
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// LOG FORM
// ============================================================================

const LogForm = ({ sessionType, onSubmit, saving = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    duration: 60,
    rating: 4,
    energyLevel: 4,
    notes: '',
    achievements: '',
    improvements: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      type: sessionType,
      date: new Date().toISOString().split('T')[0],
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-ak-surface-base rounded-[14px] p-5 mb-5">
      <SubSectionTitle className="text-[15px] m-0 mb-4">
        Logg okt
      </SubSectionTitle>

      {/* Session Name */}
      <div className="mb-4">
        <label className="block text-[13px] font-medium text-ak-text-primary mb-1">
          Navn pa okten
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="F.eks. Driver-trening pa range"
          className="w-full py-3 px-3 rounded-lg border border-ak-border-default text-sm outline-none focus:border-ak-brand-primary"
        />
      </div>

      {/* Duration and Rating Row */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-[13px] font-medium text-ak-text-primary mb-1">
            Varighet (minutter)
          </label>
          <div className="flex items-center gap-2">
            <Clock size={18} className="text-ak-text-secondary" />
            <input
              type="number"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
              min="5"
              max="300"
              className="flex-1 py-3 px-3 rounded-lg border border-ak-border-default text-sm outline-none focus:border-ak-brand-primary"
            />
          </div>
        </div>

        <div>
          <label className="block text-[13px] font-medium text-ak-text-primary mb-1">
            Rating
          </label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setFormData({ ...formData, rating: star })}
                className="p-2 rounded-md border-none bg-transparent cursor-pointer"
              >
                <Star
                  size={24}
                  fill={star <= formData.rating ? '#F59E0B' : 'none'}
                  className={star <= formData.rating ? 'text-amber-500' : 'text-ak-border-default'}
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Energy Level */}
      <div className="mb-4">
        <label className="block text-[13px] font-medium text-ak-text-primary mb-1">
          Energiniva
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => setFormData({ ...formData, energyLevel: level })}
              className={`flex-1 py-2 rounded-lg text-sm font-medium cursor-pointer transition-all ${
                formData.energyLevel === level
                  ? 'border-2 border-ak-brand-primary bg-ak-brand-primary/15 text-ak-brand-primary'
                  : 'border border-ak-border-default bg-ak-surface-base text-ak-text-primary'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
        <div className="flex justify-between text-[11px] text-ak-text-secondary mt-1">
          <span>Lav</span>
          <span>Hoy</span>
        </div>
      </div>

      {/* Notes */}
      <div className="mb-4">
        <label className="block text-[13px] font-medium text-ak-text-primary mb-1">
          Notater
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Hva jobbet du med? Hvordan gikk det?"
          rows={3}
          className="w-full py-3 px-3 rounded-lg border border-ak-border-default text-sm outline-none resize-y font-inherit focus:border-ak-brand-primary"
        />
      </div>

      {/* Achievements */}
      <div className="mb-4">
        <label className="block text-[13px] font-medium text-ak-text-primary mb-1">
          Prestasjoner (valgfritt)
        </label>
        <input
          type="text"
          value={formData.achievements}
          onChange={(e) => setFormData({ ...formData, achievements: e.target.value })}
          placeholder="F.eks. Ny toppfart, PR i ovelse"
          className="w-full py-3 px-3 rounded-lg border border-ak-border-default text-sm outline-none focus:border-ak-brand-primary"
        />
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        leftIcon={<Save size={18} />}
        disabled={saving}
        loading={saving}
        className="w-full justify-center"
      >
        {saving ? 'Lagrer...' : 'Lagre økt'}
      </Button>
    </form>
  );
};

// ============================================================================
// RECENT LOGS
// ============================================================================

const RecentLogs = ({ logs }) => (
  <div className="bg-ak-surface-base rounded-[14px] p-4">
    <SubSectionTitle className="text-sm m-0 mb-3">
      Siste loggforinger
    </SubSectionTitle>
    <div className="flex flex-col gap-2">
      {logs.map((log) => {
        const typeConfig = SESSION_TYPE_CLASSES[log.type] || SESSION_TYPE_CLASSES.technical;
        const Icon = typeConfig.icon;

        return (
          <div
            key={log.id}
            className="flex items-center gap-3 p-2 rounded-lg bg-ak-surface-subtle"
          >
            <div className={`w-9 h-9 rounded-lg ${typeConfig.bg} flex items-center justify-center`}>
              <Icon size={18} className={typeConfig.text} />
            </div>
            <div className="flex-1">
              <div className="text-[13px] font-medium text-ak-text-primary">
                {log.name}
              </div>
              <div className="text-[11px] text-ak-text-secondary flex items-center gap-2">
                <span>{new Date(log.date).toLocaleDateString('nb-NO', { day: 'numeric', month: 'short' })}</span>
                <span>•</span>
                <span>{log.duration} min</span>
              </div>
            </div>
            <div className="flex gap-0">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={12}
                  fill={star <= log.rating ? '#F59E0B' : 'none'}
                  className={star <= log.rating ? 'text-amber-500' : 'text-ak-border-default'}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const LoggTreningContainer = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null); // 'success' | 'error' | null
  const [errorMessage, setErrorMessage] = useState('');

  const handleQuickLog = (exercise) => {
    setSelectedType(exercise.type);
  };

  const handleSubmit = async (formData) => {
    setSaving(true);
    setSaveStatus(null);
    setErrorMessage('');

    try {
      // Map form data to session API format
      const sessionData = {
        title: formData.name || `${formData.type} økt`,
        type: formData.type,
        plannedDuration: formData.duration,
        date: formData.date,
        status: 'completed',
        notes: formData.notes,
        evaluation: {
          rating: formData.rating,
          energyLevel: formData.energyLevel,
          achievements: formData.achievements,
          improvements: formData.improvements,
        },
      };

      await sessionsAPI.create(sessionData);
      setSaveStatus('success');

      // Navigate to sessions list after short delay
      setTimeout(() => {
        navigate('/treningsokter');
      }, 1500);
    } catch (err) {
      setSaveStatus('error');
      setErrorMessage(err.response?.data?.message || err.message || 'Kunne ikke lagre økten');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-ak-surface-subtle">
      {/* Session Type Selector */}
      <div className="bg-ak-surface-base rounded-[14px] p-4 mb-5">
        <SubSectionTitle className="text-sm m-0 mb-3">
          Velg type okt
        </SubSectionTitle>
        <SessionTypeSelector selected={selectedType} onSelect={setSelectedType} />
      </div>

      {/* Quick Log Buttons */}
      <QuickLogButtons sessionType={selectedType} onQuickLog={handleQuickLog} />

      {/* Save Status */}
      {saveStatus === 'success' && (
        <div className="flex items-center gap-2 py-3 px-4 rounded-[10px] bg-ak-status-success/15 mb-5">
          <CheckCircle size={20} className="text-ak-status-success" />
          <span className="text-sm text-ak-status-success font-medium">
            Økten ble lagret! Videresender...
          </span>
        </div>
      )}

      {saveStatus === 'error' && (
        <div className="flex items-center gap-2 py-3 px-4 rounded-[10px] bg-ak-status-error/15 mb-5">
          <AlertCircle size={20} className="text-ak-status-error" />
          <span className="text-sm text-ak-status-error font-medium">
            {errorMessage}
          </span>
        </div>
      )}

      {/* Log Form */}
      <LogForm sessionType={selectedType} onSubmit={handleSubmit} saving={saving} />

      {/* Recent Logs */}
      <RecentLogs logs={RECENT_LOGS} />
    </div>
  );
};

export default LoggTreningContainer;
