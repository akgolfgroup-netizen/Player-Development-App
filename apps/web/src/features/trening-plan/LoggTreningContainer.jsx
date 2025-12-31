import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus, Clock, Target, Dumbbell, Brain,
  Star, Save, CheckCircle, AlertCircle
} from 'lucide-react';
// UiCanon: Using CSS variables
import Button from '../../ui/primitives/Button';
import { sessionsAPI } from '../../services/api';
import { SubSectionTitle } from '../../components/typography';

// ============================================================================
// MOCK DATA
// ============================================================================

const SESSION_TYPES = [
  { id: 'technical', label: 'Teknikk', icon: Target, color: 'var(--accent)' },
  { id: 'short_game', label: 'Kortspill', icon: Target, color: 'var(--success)' },
  { id: 'physical', label: 'Fysisk', icon: Dumbbell, color: 'var(--error)' },
  { id: 'mental', label: 'Mental', icon: Brain, color: 'var(--achievement)' },
  { id: 'round', label: 'Runde', icon: Target, color: 'var(--text-primary)' },
];

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
  <div style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
    gap: 'var(--spacing-2)',
    marginBottom: 'var(--spacing-6)',
  }}>
    {SESSION_TYPES.map((type) => {
      const Icon = type.icon;
      const isSelected = selected === type.id;

      return (
        <button
          key={type.id}
          onClick={() => onSelect(type.id)}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 'var(--spacing-2)',
            padding: 'var(--spacing-4) var(--spacing-3)',
            borderRadius: '12px',
            border: isSelected ? `2px solid ${type.color}` : '2px solid transparent',
            backgroundColor: isSelected ? `${type.color}15` : 'var(--bg-primary)',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            backgroundColor: isSelected ? type.color : `${type.color}20`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Icon size={20} color={isSelected ? 'var(--bg-primary)' : type.color} />
          </div>
          <span style={{
            fontSize: '12px',
            fontWeight: 500,
            color: isSelected ? type.color : 'var(--text-primary)',
          }}>
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
    <div style={{
      backgroundColor: 'var(--bg-primary)',
      borderRadius: '14px',
      padding: 'var(--spacing-4)',
      marginBottom: 'var(--spacing-5)',
    }}>
      <SubSectionTitle style={{
        fontSize: '14px',
        marginBottom: 'var(--spacing-3)',
      }}>
        Hurtiglogg
      </SubSectionTitle>
      <div style={{ display: 'flex', gap: 'var(--spacing-2)', flexWrap: 'wrap' }}>
        {filtered.map((exercise) => (
          <button
            key={exercise.id}
            onClick={() => onQuickLog(exercise)}
            style={{
              padding: 'var(--spacing-2) var(--spacing-3)',
              borderRadius: '8px',
              border: '1px solid var(--border-default)',
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-1)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--border-default)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
            }}
          >
            <Plus size={14} />
            {exercise.name}
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
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
    <form onSubmit={handleSubmit} style={{
      backgroundColor: 'var(--bg-primary)',
      borderRadius: '14px',
      padding: 'var(--spacing-5)',
      marginBottom: 'var(--spacing-5)',
    }}>
      <SubSectionTitle style={{
        fontSize: '15px',
        marginBottom: 'var(--spacing-4)',
      }}>
        Logg okt
      </SubSectionTitle>

      {/* Session Name */}
      <div style={{ marginBottom: 'var(--spacing-4)' }}>
        <label style={{
          display: 'block',
          fontSize: '13px',
          fontWeight: 500,
          color: 'var(--text-primary)',
          marginBottom: 'var(--spacing-1)',
        }}>
          Navn pa okten
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="F.eks. Driver-trening pa range"
          style={{
            width: '100%',
            padding: 'var(--spacing-3) var(--spacing-3)',
            borderRadius: '8px',
            border: '1px solid var(--border-default)',
            fontSize: '14px',
            outline: 'none',
          }}
        />
      </div>

      {/* Duration and Rating Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 'var(--spacing-4)',
        marginBottom: 'var(--spacing-4)',
      }}>
        <div>
          <label style={{
            display: 'block',
            fontSize: '13px',
            fontWeight: 500,
            color: 'var(--text-primary)',
            marginBottom: 'var(--spacing-1)',
          }}>
            Varighet (minutter)
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
            <Clock size={18} color={'var(--text-secondary)'} />
            <input
              type="number"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
              min="5"
              max="300"
              style={{
                flex: 1,
                padding: 'var(--spacing-3) var(--spacing-3)',
                borderRadius: '8px',
                border: '1px solid var(--border-default)',
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </div>
        </div>

        <div>
          <label style={{
            display: 'block',
            fontSize: '13px',
            fontWeight: 500,
            color: 'var(--text-primary)',
            marginBottom: 'var(--spacing-1)',
          }}>
            Rating
          </label>
          <div style={{ display: 'flex', gap: 'var(--spacing-1)' }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setFormData({ ...formData, rating: star })}
                style={{
                  padding: 'var(--spacing-2)',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                }}
              >
                <Star
                  size={24}
                  fill={star <= formData.rating ? 'var(--achievement)' : 'none'}
                  color={star <= formData.rating ? 'var(--achievement)' : 'var(--border-default)'}
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Energy Level */}
      <div style={{ marginBottom: 'var(--spacing-4)' }}>
        <label style={{
          display: 'block',
          fontSize: '13px',
          fontWeight: 500,
          color: 'var(--text-primary)',
          marginBottom: 'var(--spacing-1)',
        }}>
          Energiniva
        </label>
        <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
          {[1, 2, 3, 4, 5].map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => setFormData({ ...formData, energyLevel: level })}
              style={{
                flex: 1,
                padding: 'var(--spacing-2)',
                borderRadius: '8px',
                border: formData.energyLevel === level
                  ? '2px solid var(--accent)'
                  : '1px solid var(--border-default)',
                backgroundColor: formData.energyLevel === level
                  ? 'rgba(var(--accent-rgb), 0.15)'
                  : 'var(--bg-primary)',
                color: formData.energyLevel === level
                  ? 'var(--accent)'
                  : 'var(--text-primary)',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              {level}
            </button>
          ))}
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '11px',
          color: 'var(--text-secondary)',
          marginTop: 'var(--spacing-1)',
        }}>
          <span>Lav</span>
          <span>Hoy</span>
        </div>
      </div>

      {/* Notes */}
      <div style={{ marginBottom: 'var(--spacing-4)' }}>
        <label style={{
          display: 'block',
          fontSize: '13px',
          fontWeight: 500,
          color: 'var(--text-primary)',
          marginBottom: 'var(--spacing-1)',
        }}>
          Notater
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Hva jobbet du med? Hvordan gikk det?"
          rows={3}
          style={{
            width: '100%',
            padding: 'var(--spacing-3) var(--spacing-3)',
            borderRadius: '8px',
            border: '1px solid var(--border-default)',
            fontSize: '14px',
            outline: 'none',
            resize: 'vertical',
            fontFamily: 'inherit',
          }}
        />
      </div>

      {/* Achievements */}
      <div style={{ marginBottom: 'var(--spacing-4)' }}>
        <label style={{
          display: 'block',
          fontSize: '13px',
          fontWeight: 500,
          color: 'var(--text-primary)',
          marginBottom: 'var(--spacing-1)',
        }}>
          Prestasjoner (valgfritt)
        </label>
        <input
          type="text"
          value={formData.achievements}
          onChange={(e) => setFormData({ ...formData, achievements: e.target.value })}
          placeholder="F.eks. Ny toppfart, PR i ovelse"
          style={{
            width: '100%',
            padding: 'var(--spacing-3) var(--spacing-3)',
            borderRadius: '8px',
            border: '1px solid var(--border-default)',
            fontSize: '14px',
            outline: 'none',
          }}
        />
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        leftIcon={<Save size={18} />}
        disabled={saving}
        loading={saving}
        style={{ width: '100%', justifyContent: 'center' }}
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
  <div style={{
    backgroundColor: 'var(--bg-primary)',
    borderRadius: '14px',
    padding: 'var(--spacing-4)',
  }}>
    <SubSectionTitle style={{
      fontSize: '14px',
      marginBottom: 'var(--spacing-3)',
    }}>
      Siste loggforinger
    </SubSectionTitle>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
      {logs.map((log) => {
        const typeConfig = SESSION_TYPES.find((t) => t.id === log.type);
        const Icon = typeConfig?.icon || Target;

        return (
          <div
            key={log.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-3)',
              padding: 'var(--spacing-2)',
              borderRadius: '8px',
              backgroundColor: 'var(--bg-secondary)',
            }}
          >
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: `${typeConfig?.color || 'var(--accent)'}15`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Icon size={18} color={typeConfig?.color || 'var(--accent)'} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)' }}>
                {log.name}
              </div>
              <div style={{
                fontSize: '11px',
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-2)',
              }}>
                <span>{new Date(log.date).toLocaleDateString('nb-NO', { day: 'numeric', month: 'short' })}</span>
                <span>•</span>
                <span>{log.duration} min</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 'var(--spacing-0)' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={12}
                  fill={star <= log.rating ? 'var(--achievement)' : 'none'}
                  color={star <= log.rating ? 'var(--achievement)' : 'var(--border-default)'}
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
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-secondary)' }}>
      {/* Session Type Selector */}
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          borderRadius: '14px',
          padding: 'var(--spacing-4)',
          marginBottom: 'var(--spacing-5)',
        }}>
          <SubSectionTitle style={{
            fontSize: '14px',
            marginBottom: 'var(--spacing-3)',
          }}>
            Velg type okt
          </SubSectionTitle>
          <SessionTypeSelector selected={selectedType} onSelect={setSelectedType} />
        </div>

        {/* Quick Log Buttons */}
        <QuickLogButtons sessionType={selectedType} onQuickLog={handleQuickLog} />

        {/* Save Status */}
        {saveStatus === 'success' && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-2)',
            padding: 'var(--spacing-3) var(--spacing-4)',
            borderRadius: '10px',
            backgroundColor: 'rgba(34, 197, 94, 0.15)',
            marginBottom: 'var(--spacing-5)',
          }}>
            <CheckCircle size={20} color="var(--success)" />
            <span style={{ fontSize: '14px', color: 'var(--success)', fontWeight: 500 }}>
              Økten ble lagret! Videresender...
            </span>
          </div>
        )}

        {saveStatus === 'error' && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-2)',
            padding: 'var(--spacing-3) var(--spacing-4)',
            borderRadius: '10px',
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            marginBottom: 'var(--spacing-5)',
          }}>
            <AlertCircle size={20} color="var(--error)" />
            <span style={{ fontSize: '14px', color: 'var(--error)', fontWeight: 500 }}>
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
