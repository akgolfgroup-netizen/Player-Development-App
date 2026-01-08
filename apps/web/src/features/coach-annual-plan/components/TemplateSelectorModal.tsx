/**
 * TemplateSelectorModal.tsx
 * Modal for selecting annual plan templates
 */

import React, { useState } from 'react';
import { X, Check, Calendar, Target, TrendingUp, Users } from 'lucide-react';
import Button from '../../../ui/primitives/Button';
import { SectionTitle, SubSectionTitle } from '../../../components/typography';

// ============================================================================
// TYPES
// ============================================================================

export interface PlanTemplate {
  id: string;
  name: string;
  description: string;
  targetGroup: string;
  icon: React.ElementType;
  periodStructure: {
    type: 'E' | 'G' | 'S' | 'T';
    name: string;
    weeks: number;
    description: string;
  }[];
  totalWeeks: number;
  weeklyFrequency: number;
  highlights: string[];
}

// ============================================================================
// TEMPLATES DATA
// ============================================================================

export const PLAN_TEMPLATES: PlanTemplate[] = [
  {
    id: 'junior-development',
    name: 'Junior Utviklingsplan',
    description: 'Allsidig utvikling med fokus på grunnleggende ferdigheter',
    targetGroup: '12-15 år',
    icon: Users,
    totalWeeks: 52,
    weeklyFrequency: 3,
    highlights: [
      'Balansert fokus på alle kategorier',
      'Gradvis progresjon gjennom året',
      'Regelmessig evaluering og testing',
    ],
    periodStructure: [
      {
        type: 'E',
        name: 'Vår-evaluering',
        weeks: 4,
        description: 'Kartlegging av nivå og målsetting',
      },
      {
        type: 'G',
        name: 'Grunnferdigheter',
        weeks: 16,
        description: 'Teknikk, fysisk og slagkvalitet',
      },
      {
        type: 'S',
        name: 'Sommerfokus',
        weeks: 12,
        description: 'Spesialisering på slag og kort spill',
      },
      {
        type: 'T',
        name: 'Turnerings-sesong',
        weeks: 8,
        description: 'Mental trening og konkurranseerfaring',
      },
      {
        type: 'E',
        name: 'Høst-evaluering',
        weeks: 4,
        description: 'Oppsummering og ny målsetting',
      },
      {
        type: 'G',
        name: 'Vintertrening',
        weeks: 8,
        description: 'Indoor-trening og fysisk styrke',
      },
    ],
  },
  {
    id: 'elite-competitive',
    name: 'Elitespiller Sesongplan',
    description: 'Periodisering for toppform til viktige turneringer',
    targetGroup: 'Elite/Senior',
    icon: TrendingUp,
    totalWeeks: 52,
    weeklyFrequency: 5,
    highlights: [
      'Systematisk periodisering',
      'Peak performance til hovedturneringer',
      'Balanse mellom volum og intensitet',
    ],
    periodStructure: [
      {
        type: 'E',
        name: 'Preseason Testing',
        weeks: 2,
        description: 'Baseline testing og målsetting',
      },
      {
        type: 'G',
        name: 'Off-season Grunnlag',
        weeks: 8,
        description: 'Fysisk styrke og teknisk finpuss',
      },
      {
        type: 'S',
        name: 'Pre-competition',
        weeks: 10,
        description: 'Skarpe økter og konkurranseforberedelse',
      },
      {
        type: 'T',
        name: 'Vår-sesong',
        weeks: 12,
        description: 'Turneringsspill og vedlikehold',
      },
      {
        type: 'G',
        name: 'Mid-season Rebuild',
        weeks: 4,
        description: 'Aktiv restitusjon og justering',
      },
      {
        type: 'T',
        name: 'Høst-sesong (Peak)',
        weeks: 8,
        description: 'Toppform til hovedturneringer',
      },
      {
        type: 'E',
        name: 'Sesong-evaluering',
        weeks: 4,
        description: 'Analyse og planlegging neste år',
      },
      {
        type: 'G',
        name: 'Recovery',
        weeks: 4,
        description: 'Aktiv hvile og mental pause',
      },
    ],
  },
  {
    id: 'recreational',
    name: 'Rekreasjonsspiller',
    description: 'Fleksibel plan for hobbyspillere med begrenset tid',
    targetGroup: '1-2 økter/uke',
    icon: Calendar,
    totalWeeks: 52,
    weeklyFrequency: 1.5,
    highlights: [
      'Fleksibel struktur',
      'Fokus på moro og fremgang',
      'Enkle, effektive økter',
    ],
    periodStructure: [
      {
        type: 'G',
        name: 'Vår-oppstart',
        weeks: 20,
        description: 'Grunnferdigheter og konsistens',
      },
      {
        type: 'S',
        name: 'Sommerfokus',
        weeks: 12,
        description: 'Utvalgte fokusområder',
      },
      {
        type: 'T',
        name: 'Sommersesongen',
        weeks: 8,
        description: 'Banespill og sosialt',
      },
      {
        type: 'E',
        name: 'Høst-evaluering',
        weeks: 4,
        description: 'Vurdere progresjon',
      },
      {
        type: 'G',
        name: 'Vinter Indoor',
        weeks: 8,
        description: 'Vedlikehold og teknikk',
      },
    ],
  },
];

// ============================================================================
// COMPONENT
// ============================================================================

interface TemplateSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: PlanTemplate) => void;
}

const TemplateSelectorModal: React.FC<TemplateSelectorModalProps> = ({
  isOpen,
  onClose,
  onSelectTemplate,
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<PlanTemplate | null>(null);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (selectedTemplate) {
      onSelectTemplate(selectedTemplate);
      onClose();
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-tier-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-tier-border-default">
            <div>
              <SectionTitle className="m-0 mb-1">Velg mal</SectionTitle>
              <p className="text-sm text-tier-text-secondary">
                Start med en ferdig periodiseringsmal tilpasset spillernivå
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-tier-surface-base border-none flex items-center justify-center cursor-pointer hover:bg-tier-border-default transition-colors"
            >
              <X size={18} className="text-tier-text-secondary" />
            </button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
              {PLAN_TEMPLATES.map((template) => {
                const Icon = template.icon;
                const isSelected = selectedTemplate?.id === template.id;

                return (
                  <div
                    key={template.id}
                    onClick={() => setSelectedTemplate(template)}
                    className={`relative rounded-xl border-2 p-5 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-tier-navy bg-tier-navy/5 shadow-lg'
                        : 'border-tier-border-default bg-tier-white hover:border-tier-navy/50 hover:shadow-md'
                    }`}
                  >
                    {/* Selection indicator */}
                    {isSelected && (
                      <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-tier-navy flex items-center justify-center">
                        <Check size={14} className="text-white" />
                      </div>
                    )}

                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-xl mb-4 flex items-center justify-center ${
                      isSelected ? 'bg-tier-navy/15' : 'bg-tier-surface-base'
                    }`}>
                      <Icon size={24} className={isSelected ? 'text-tier-navy' : 'text-tier-navy'} />
                    </div>

                    {/* Title */}
                    <SubSectionTitle className="mb-1">
                      {template.name}
                    </SubSectionTitle>

                    {/* Target group */}
                    <div className="text-xs text-tier-text-secondary mb-3 flex items-center gap-1">
                      <Target size={12} />
                      {template.targetGroup}
                    </div>

                    {/* Description */}
                    <p className="text-sm text-tier-text-secondary mb-4">
                      {template.description}
                    </p>

                    {/* Stats */}
                    <div className="flex gap-4 mb-4 pb-4 border-b border-tier-border-default">
                      <div>
                        <div className="text-xs text-tier-text-tertiary">Perioder</div>
                        <div className="text-sm font-semibold text-tier-navy">
                          {template.periodStructure.length}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-tier-text-tertiary">Uker/økter</div>
                        <div className="text-sm font-semibold text-tier-navy">
                          {template.weeklyFrequency}/uke
                        </div>
                      </div>
                    </div>

                    {/* Highlights */}
                    <div className="space-y-1.5">
                      {template.highlights.map((highlight, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <div className="w-1 h-1 rounded-full bg-tier-success mt-1.5 flex-shrink-0" />
                          <span className="text-xs text-tier-text-secondary">{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Preview of selected template */}
            {selectedTemplate && (
              <div className="p-6 bg-tier-surface-base border-t border-tier-border-default">
                <SubSectionTitle className="mb-4">
                  Periode-struktur: {selectedTemplate.name}
                </SubSectionTitle>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {selectedTemplate.periodStructure.map((period, index) => {
                    const periodColors = {
                      E: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Evaluering' },
                      G: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Grunnperiode' },
                      S: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Spesialisering' },
                      T: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Turnering' },
                    };
                    const config = periodColors[period.type];

                    return (
                      <div
                        key={index}
                        className={`${config.bg} rounded-lg p-3 border border-transparent`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-xs font-bold ${config.text} uppercase`}>
                            {period.type}
                          </span>
                          <span className="text-xs text-tier-text-tertiary">
                            {period.weeks}u
                          </span>
                        </div>
                        <div className="text-sm font-medium text-tier-navy mb-1">
                          {period.name}
                        </div>
                        <div className="text-xs text-tier-text-secondary">
                          {period.description}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex gap-3 p-6 border-t border-tier-border-default">
            <Button variant="secondary" onClick={onClose} className="flex-1">
              Avbryt
            </Button>
            <Button
              variant="primary"
              onClick={handleConfirm}
              disabled={!selectedTemplate}
              className="flex-1"
            >
              Bruk mal
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default TemplateSelectorModal;
