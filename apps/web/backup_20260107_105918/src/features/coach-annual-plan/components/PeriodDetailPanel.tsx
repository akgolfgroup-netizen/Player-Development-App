/**
 * PeriodDetailPanel.tsx
 * Side panel for editing period details
 */

import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Target, Plus, Trash2, Save } from 'lucide-react';
import Button from '../../../ui/primitives/Button';
import Input from '../../../ui/primitives/Input';
import { SubSectionTitle } from '../../../components/typography';

// ============================================================================
// TYPES
// ============================================================================

export interface Period {
  id: string;
  type: 'E' | 'G' | 'S' | 'T';
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  weeklyFrequency: number;
  goals: string[];
  color: string;
  textColor: string;
}

interface PeriodDetailPanelProps {
  period: Period | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (period: Period) => void;
  onDelete?: (periodId: string) => void;
}

// ============================================================================
// PERIOD CONFIG
// ============================================================================

const PERIOD_CONFIG = {
  E: {
    label: 'Evaluering',
    color: '#8B6E9D',
    bgColor: 'bg-[#8B6E9D]/15',
    textColor: 'text-[#8B6E9D]',
  },
  G: {
    label: 'Grunnperiode',
    color: '#D97644',
    bgColor: 'bg-[#D97644]/15',
    textColor: 'text-[#D97644]',
  },
  S: {
    label: 'Spesialisering',
    color: '#4A8C7C',
    bgColor: 'bg-[#4A8C7C]/15',
    textColor: 'text-[#4A8C7C]',
  },
  T: {
    label: 'Turnering',
    color: '#C9A227',
    bgColor: 'bg-[#C9A227]/15',
    textColor: 'text-[#C9A227]',
  },
};

// ============================================================================
// COMPONENT
// ============================================================================

const PeriodDetailPanel: React.FC<PeriodDetailPanelProps> = ({
  period,
  isOpen,
  onClose,
  onSave,
  onDelete,
}) => {
  const [formData, setFormData] = useState<Period | null>(null);
  const [newGoal, setNewGoal] = useState('');

  useEffect(() => {
    if (period) {
      setFormData({ ...period });
    }
  }, [period]);

  if (!isOpen || !formData) return null;

  const config = PERIOD_CONFIG[formData.type];

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  const handleDelete = () => {
    if (formData.id && onDelete) {
      if (confirm('Er du sikker på at du vil slette denne perioden?')) {
        onDelete(formData.id);
        onClose();
      }
    }
  };

  const addGoal = () => {
    if (newGoal.trim()) {
      setFormData({
        ...formData,
        goals: [...formData.goals, newGoal.trim()],
      });
      setNewGoal('');
    }
  };

  const removeGoal = (index: number) => {
    setFormData({
      ...formData,
      goals: formData.goals.filter((_, i) => i !== index),
    });
  };

  const calculateDuration = () => {
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const weeks = Math.ceil(days / 7);
    return { days, weeks };
  };

  const duration = calculateDuration();

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-tier-white border-l border-tier-border-default shadow-2xl z-50 flex flex-col">
      {/* Header */}
      <div className={`${config.bgColor} p-5 border-b border-tier-border-default`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-lg ${config.bgColor} flex items-center justify-center`}>
              <span className={`text-sm font-bold ${config.textColor}`}>
                {formData.type}
              </span>
            </div>
            <span className={`text-sm font-bold ${config.textColor} uppercase`}>
              {config.label}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-tier-white/50 border-none flex items-center justify-center cursor-pointer hover:bg-tier-white transition-colors"
          >
            <X size={18} className="text-tier-text-secondary" />
          </button>
        </div>

        {/* Duration Stats */}
        <div className="flex gap-4 text-sm">
          <div>
            <div className="text-xs text-tier-text-tertiary mb-1">Varighet</div>
            <div className="font-semibold text-tier-navy">
              {duration.weeks} uker ({duration.days} dager)
            </div>
          </div>
          <div>
            <div className="text-xs text-tier-text-tertiary mb-1">Økter/uke</div>
            <div className="font-semibold text-tier-navy">
              {formData.weeklyFrequency}
            </div>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto p-5">
        {/* Period Name */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-tier-navy mb-2">
            Periode-navn
          </label>
          <Input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="F.eks. Vår-grunnperiode"
          />
        </div>

        {/* Description */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-tier-navy mb-2">
            Beskrivelse
          </label>
          <textarea
            value={formData.description || ''}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Beskriv fokus og innhold for perioden..."
            rows={3}
            className="w-full py-3 px-3 rounded-lg border border-tier-border-default text-sm outline-none resize-y font-inherit focus:border-tier-navy"
          />
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div>
            <label className="block text-sm font-medium text-tier-navy mb-2">
              Startdato
            </label>
            <Input
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-tier-navy mb-2">
              Sluttdato
            </label>
            <Input
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            />
          </div>
        </div>

        {/* Weekly Frequency */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-tier-navy mb-2">
            Økter per uke
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5, 6, 7].map((num) => (
              <button
                key={num}
                onClick={() => setFormData({ ...formData, weeklyFrequency: num })}
                className={`flex-1 py-2 rounded-lg text-sm font-medium cursor-pointer transition-all border ${
                  formData.weeklyFrequency === num
                    ? 'border-tier-navy bg-tier-navy/15 text-tier-navy'
                    : 'border-tier-border-default bg-tier-white text-tier-navy hover:bg-tier-surface-base'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        {/* Goals */}
        <div className="mb-5">
          <SubSectionTitle className="mb-3">
            Mål for perioden
          </SubSectionTitle>

          {/* Goal List */}
          <div className="space-y-2 mb-3">
            {formData.goals.map((goal, index) => (
              <div
                key={index}
                className="flex items-start gap-2 p-3 rounded-lg bg-tier-surface-base border border-tier-border-default"
              >
                <Target size={16} className="text-tier-navy mt-0.5 flex-shrink-0" />
                <span className="flex-1 text-sm text-tier-navy">{goal}</span>
                <button
                  onClick={() => removeGoal(index)}
                  className="w-6 h-6 rounded-md bg-transparent border-none flex items-center justify-center cursor-pointer hover:bg-tier-error/10 transition-colors"
                >
                  <Trash2 size={14} className="text-tier-error" />
                </button>
              </div>
            ))}
          </div>

          {/* Add Goal */}
          <div className="flex gap-2">
            <Input
              type="text"
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addGoal();
                }
              }}
              placeholder="Legg til mål..."
              className="flex-1"
            />
            <Button
              variant="secondary"
              size="sm"
              onClick={addGoal}
              leftIcon={<Plus size={16} />}
            >
              Legg til
            </Button>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-5 border-t border-tier-border-default space-y-2">
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={onClose}
            className="flex-1"
          >
            Avbryt
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            leftIcon={<Save size={18} />}
            className="flex-1"
          >
            Lagre
          </Button>
        </div>

        {onDelete && (
          <Button
            variant="secondary"
            onClick={handleDelete}
            leftIcon={<Trash2 size={18} />}
            className="w-full text-tier-error hover:bg-tier-error/10"
          >
            Slett periode
          </Button>
        )}
      </div>
    </div>
  );
};

export default PeriodDetailPanel;
