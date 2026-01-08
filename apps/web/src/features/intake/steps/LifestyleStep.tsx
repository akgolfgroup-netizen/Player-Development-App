/**
 * Lifestyle Step - Work schedule, stress, sleep, nutrition
 */

import React, { useState, useEffect } from 'react';

interface Props {
  data?: any;
  onComplete: (data: any) => void;
}

const WORK_SCHEDULES = [
  { value: 'flexible', label: 'Fleksibel', description: 'Kan trene når som helst' },
  { value: 'regular_hours', label: 'Faste timer', description: '8-17 eller lignende' },
  { value: 'irregular', label: 'Uregelmessig', description: 'Varierer fra uke til uke' },
  { value: 'shift_work', label: 'Skiftarbeid', description: 'Natt/dag/kveld skift' },
];

const PHYSICAL_ACTIVITY = [
  { value: 'sedentary', label: 'Stillesittende', description: 'Mesteparten av dagen sittende' },
  { value: 'light', label: 'Lett aktiv', description: 'Noe bevegelse i hverdagen' },
  { value: 'moderate', label: 'Moderat aktiv', description: 'Regelmessig mosjon' },
  { value: 'active', label: 'Svært aktiv', description: 'Daglig trening/fysisk arbeid' },
];

const LifestyleStep: React.FC<Props> = ({ data, onComplete }) => {
  const [formData, setFormData] = useState({
    workSchedule: data?.workSchedule || 'regular_hours',
    stressLevel: data?.stressLevel || 3,
    sleepQuality: data?.sleepQuality || 3,
    nutritionFocus: data?.nutritionFocus ?? false,
    physicalActivity: data?.physicalActivity || 'moderate',
  });

  useEffect(() => {
    onComplete(formData);
  }, [formData, onComplete]);

  return (
    <div className="space-y-6">
      {/* Work Schedule */}
      <div>
        <label className="block text-sm font-medium text-tier-navy mb-2">
          Arbeidsplan
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {WORK_SCHEDULES.map((schedule) => (
            <button
              key={schedule.value}
              type="button"
              onClick={() => setFormData({ ...formData, workSchedule: schedule.value })}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                formData.workSchedule === schedule.value
                  ? 'border-tier-info bg-tier-info-light'
                  : 'border-tier-border-default hover:border-tier-info'
              }`}
            >
              <div className="font-medium text-sm text-tier-navy mb-1">{schedule.label}</div>
              <div className="text-xs text-tier-text-secondary">{schedule.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Stress Level */}
      <div>
        <label className="block text-sm font-medium text-tier-navy mb-2">
          Stressnivå i hverdagen
        </label>
        <div className="space-y-2">
          <input
            type="range"
            min={1}
            max={5}
            step={1}
            value={formData.stressLevel}
            onChange={(e) => setFormData({ ...formData, stressLevel: parseInt(e.target.value) })}
            className="w-full h-2 bg-tier-surface-base rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, var(--tier-success) 0%, var(--tier-warning) 50%, var(--tier-error) 100%)`,
            }}
          />
          <div className="flex justify-between text-xs text-tier-text-secondary">
            <span>Lavt (1)</span>
            <span className="font-semibold text-tier-navy">Nivå {formData.stressLevel}</span>
            <span>Høyt (5)</span>
          </div>
        </div>
      </div>

      {/* Sleep Quality */}
      <div>
        <label className="block text-sm font-medium text-tier-navy mb-2">
          Søvnkvalitet
        </label>
        <div className="space-y-2">
          <input
            type="range"
            min={1}
            max={5}
            step={1}
            value={formData.sleepQuality}
            onChange={(e) => setFormData({ ...formData, sleepQuality: parseInt(e.target.value) })}
            className="w-full h-2 bg-tier-surface-base rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, var(--tier-error) 0%, var(--tier-warning) 50%, var(--tier-success) 100%)`,
            }}
          />
          <div className="flex justify-between text-xs text-tier-text-secondary">
            <span>Dårlig (1)</span>
            <span className="font-semibold text-tier-navy">Kvalitet {formData.sleepQuality}</span>
            <span>Utmerket (5)</span>
          </div>
        </div>
      </div>

      {/* Physical Activity */}
      <div>
        <label className="block text-sm font-medium text-tier-navy mb-2">
          Fysisk aktivitet utenom golf
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {PHYSICAL_ACTIVITY.map((activity) => (
            <button
              key={activity.value}
              type="button"
              onClick={() => setFormData({ ...formData, physicalActivity: activity.value })}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                formData.physicalActivity === activity.value
                  ? 'border-tier-success bg-tier-success-light'
                  : 'border-tier-border-default hover:border-tier-success'
              }`}
            >
              <div className="font-medium text-sm text-tier-navy mb-1">{activity.label}</div>
              <div className="text-xs text-tier-text-secondary">{activity.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Nutrition Focus */}
      <div>
        <label className="flex items-center gap-3 p-4 bg-tier-surface-base rounded-lg cursor-pointer hover:bg-tier-info-light transition-all">
          <input
            type="checkbox"
            checked={formData.nutritionFocus}
            onChange={(e) => setFormData({ ...formData, nutritionFocus: e.target.checked })}
            className="w-5 h-5 text-tier-info rounded focus:ring-tier-info"
          />
          <div>
            <div className="font-medium text-sm text-tier-navy">Fokus på ernæring</div>
            <div className="text-xs text-tier-text-secondary">
              Jeg følger eller ønsker å følge et ernæringsprogram for optimal prestasjon
            </div>
          </div>
        </label>
      </div>

      {/* Info Box */}
      <div className="bg-tier-info-light border border-tier-info rounded-lg p-4">
        <h4 className="text-sm font-semibold text-tier-navy mb-2">💡 Hvorfor spør vi om dette?</h4>
        <p className="text-xs text-tier-text-secondary">
          Livsstilsfaktorer som søvn, stress og aktivitetsnivå påvirker både prestasjon og restitusjon.
          Dette hjelper oss å tilpasse treningsplanen til din totale livssituasjon, slik at den blir realistisk og bærekraftig.
        </p>
      </div>
    </div>
  );
};

export default LifestyleStep;
