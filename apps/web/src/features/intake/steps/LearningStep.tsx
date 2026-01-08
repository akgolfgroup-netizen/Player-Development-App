/**
 * Learning Step - Preferred learning style and motivations
 */

import React, { useState, useEffect } from 'react';

interface Props {
  data?: any;
  onComplete: (data: any) => void;
}

const LEARNING_STYLES = [
  { value: 'visual', label: 'Visuell', description: 'Lærer best ved å se demonstrasjoner og videoer', icon: '👁️' },
  { value: 'verbal', label: 'Verbal', description: 'Lærer best gjennom detaljerte forklaringer', icon: '💬' },
  { value: 'kinesthetic', label: 'Kinestetisk', description: 'Lærer best ved å gjøre og føle bevegelsen', icon: '🤸' },
  { value: 'mixed', label: 'Blandet', description: 'Kombinasjon av flere læringstiler', icon: '🔄' },
];

const MOTIVATION_TYPES = [
  { value: 'competition', label: 'Konkuranse', description: 'Motivert av å konkurrere og vinne', icon: '🏆' },
  { value: 'personal_growth', label: 'Personlig utvikling', description: 'Motivert av egen fremgang', icon: '📈' },
  { value: 'social', label: 'Sosial', description: 'Motivert av fellesskap og sosiale aspekter', icon: '👥' },
  { value: 'achievement', label: 'Prestasjon', description: 'Motivert av å nå konkrete mål', icon: '🎯' },
];

const LearningStep: React.FC<Props> = ({ data, onComplete }) => {
  const [formData, setFormData] = useState({
    preferredStyle: data?.preferredStyle || 'mixed',
    wantsDetailedExplanations: data?.wantsDetailedExplanations ?? true,
    prefersStructure: data?.prefersStructure ?? true,
    motivationType: data?.motivationType || 'personal_growth',
  });

  useEffect(() => {
    onComplete(formData);
  }, [formData, onComplete]);

  return (
    <div className="space-y-6">
      {/* Learning Style */}
      <div>
        <label className="block text-sm font-medium text-tier-navy mb-2">
          Foretrukket læringsstil
        </label>
        <p className="text-xs text-tier-text-secondary mb-3">
          Hvordan lærer du nye golfbevegelser best?
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {LEARNING_STYLES.map((style) => (
            <button
              key={style.value}
              type="button"
              onClick={() => setFormData({ ...formData, preferredStyle: style.value })}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                formData.preferredStyle === style.value
                  ? 'border-tier-info bg-tier-info-light'
                  : 'border-tier-border-default hover:border-tier-info'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{style.icon}</span>
                <div className="font-medium text-sm text-tier-navy">{style.label}</div>
              </div>
              <div className="text-xs text-tier-text-secondary">{style.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Detailed Explanations */}
      <div>
        <label className="flex items-center gap-3 p-4 bg-tier-surface-base rounded-lg cursor-pointer hover:bg-tier-info-light transition-all">
          <input
            type="checkbox"
            checked={formData.wantsDetailedExplanations}
            onChange={(e) => setFormData({ ...formData, wantsDetailedExplanations: e.target.checked })}
            className="w-5 h-5 text-tier-info rounded focus:ring-tier-info"
          />
          <div>
            <div className="font-medium text-sm text-tier-navy">Ønsker detaljerte forklaringer</div>
            <div className="text-xs text-tier-text-secondary">
              Jeg vil forstå "hvorfor" bak hver øvelse og teknikk
            </div>
          </div>
        </label>
      </div>

      {/* Structure Preference */}
      <div>
        <label className="flex items-center gap-3 p-4 bg-tier-surface-base rounded-lg cursor-pointer hover:bg-tier-info-light transition-all">
          <input
            type="checkbox"
            checked={formData.prefersStructure}
            onChange={(e) => setFormData({ ...formData, prefersStructure: e.target.checked })}
            className="w-5 h-5 text-tier-info rounded focus:ring-tier-info"
          />
          <div>
            <div className="font-medium text-sm text-tier-navy">Foretrekker strukturert plan</div>
            <div className="text-xs text-tier-text-secondary">
              Jeg liker klare planer og rutiner fremfor improvisasjon
            </div>
          </div>
        </label>
      </div>

      {/* Motivation Type */}
      <div>
        <label className="block text-sm font-medium text-tier-navy mb-2">
          Hva motiverer deg mest?
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {MOTIVATION_TYPES.map((type) => (
            <button
              key={type.value}
              type="button"
              onClick={() => setFormData({ ...formData, motivationType: type.value })}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                formData.motivationType === type.value
                  ? 'border-tier-success bg-tier-success-light'
                  : 'border-tier-border-default hover:border-tier-success'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{type.icon}</span>
                <div className="font-medium text-sm text-tier-navy">{type.label}</div>
              </div>
              <div className="text-xs text-tier-text-secondary">{type.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-tier-success-light border border-tier-success rounded-lg p-4">
        <h4 className="text-sm font-semibold text-tier-navy mb-2">✨ Nesten ferdig!</h4>
        <p className="text-xs text-tier-text-secondary mb-2">
          Ved å forstå hvordan du lærer best og hva som motiverer deg, kan vi lage en treningsplan
          som passer din personlighet og læringsstil. Dette øker sjansen for langsiktig suksess.
        </p>
        <p className="text-xs font-medium text-tier-navy">
          Når du klikker "Fullfør" vil vi generere en skreddersydd treningsplan for deg.
        </p>
      </div>
    </div>
  );
};

export default LearningStep;
