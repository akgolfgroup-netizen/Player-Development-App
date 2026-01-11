/**
 * Equipment Step - Access to equipment and willingness to invest
 */

import React, { useState, useEffect } from 'react';
import Input from '../../../ui/primitives/Input';
import { CardTitle } from '../../../components/typography';

interface Props {
  data?: any;
  onComplete: (data: any) => void;
}

const INVESTMENT_LEVELS = [
  { value: 'minimal', label: 'Minimal', description: 'Kun det mest nødvendige' },
  { value: 'moderate', label: 'Moderat', description: 'Fornuftige investeringer' },
  { value: 'significant', label: 'Betydelig', description: 'Villig til større investeringer' },
];

const EquipmentStep: React.FC<Props> = ({ data, onComplete }) => {
  const [formData, setFormData] = useState({
    hasDriverSpeedMeasurement: data?.hasDriverSpeedMeasurement ?? false,
    driverSpeed: data?.driverSpeed || null,
    recentClubFitting: data?.recentClubFitting ?? false,
    accessToTrackMan: data?.accessToTrackMan ?? false,
    accessToGym: data?.accessToGym ?? false,
    willingToInvest: data?.willingToInvest || 'moderate',
  });

  useEffect(() => {
    onComplete(formData);
  }, [formData, onComplete]);

  return (
    <div className="space-y-6">
      {/* Driver Speed */}
      <div>
        <label className="flex items-center gap-3 p-4 bg-tier-surface-base rounded-lg cursor-pointer hover:bg-tier-info-light transition-all mb-3">
          <input
            type="checkbox"
            checked={formData.hasDriverSpeedMeasurement}
            onChange={(e) => setFormData({ ...formData, hasDriverSpeedMeasurement: e.target.checked })}
            className="w-5 h-5 text-tier-info rounded focus:ring-tier-info"
          />
          <div>
            <div className="font-medium text-sm text-tier-navy">Har målt driver-hastighet</div>
            <div className="text-xs text-tier-text-secondary">Kjenner til klubbhodehastigheten min med driver</div>
          </div>
        </label>

        {formData.hasDriverSpeedMeasurement && (
          <div className="pl-8">
            <label className="block text-sm font-medium text-tier-navy mb-2">
              Driver-hastighet (mph)
            </label>
            <Input
              type="number"
              min={40}
              max={150}
              value={formData.driverSpeed || ''}
              onChange={(e) => setFormData({ ...formData, driverSpeed: e.target.value ? parseFloat(e.target.value) : null })}
              placeholder="f.eks. 95"
              className="w-full"
            />
            <p className="text-xs text-tier-text-secondary mt-1">Målt med TrackMan, FlightScope, eller lignende</p>
          </div>
        )}
      </div>

      {/* Recent Club Fitting */}
      <div>
        <label className="flex items-center gap-3 p-4 bg-tier-surface-base rounded-lg cursor-pointer hover:bg-tier-info-light transition-all">
          <input
            type="checkbox"
            checked={formData.recentClubFitting}
            onChange={(e) => setFormData({ ...formData, recentClubFitting: e.target.checked })}
            className="w-5 h-5 text-tier-info rounded focus:ring-tier-info"
          />
          <div>
            <div className="font-medium text-sm text-tier-navy">Nylig klubb-fitting</div>
            <div className="text-xs text-tier-text-secondary">Har fått tilpasset klubber de siste 12 månedene</div>
          </div>
        </label>
      </div>

      {/* TrackMan Access */}
      <div>
        <label className="flex items-center gap-3 p-4 bg-tier-surface-base rounded-lg cursor-pointer hover:bg-tier-info-light transition-all">
          <input
            type="checkbox"
            checked={formData.accessToTrackMan}
            onChange={(e) => setFormData({ ...formData, accessToTrackMan: e.target.checked })}
            className="w-5 h-5 text-tier-info rounded focus:ring-tier-info"
          />
          <div>
            <div className="font-medium text-sm text-tier-navy">Tilgang til TrackMan</div>
            <div className="text-xs text-tier-text-secondary">Har regelmessig tilgang til TrackMan eller lignende launch monitor</div>
          </div>
        </label>
      </div>

      {/* Gym Access */}
      <div>
        <label className="flex items-center gap-3 p-4 bg-tier-surface-base rounded-lg cursor-pointer hover:bg-tier-success-light transition-all">
          <input
            type="checkbox"
            checked={formData.accessToGym}
            onChange={(e) => setFormData({ ...formData, accessToGym: e.target.checked })}
            className="w-5 h-5 text-tier-success rounded focus:ring-tier-success"
          />
          <div>
            <div className="font-medium text-sm text-tier-navy">Tilgang til treningsstudio</div>
            <div className="text-xs text-tier-text-secondary">
              Har tilgang til treningsstudio for styrke- og kondisjonstrening
            </div>
          </div>
        </label>
      </div>

      {/* Investment Willingness */}
      <div>
        <label className="block text-sm font-medium text-tier-navy mb-2">
          Investeringsvilje i utstyr og treningshjelp
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {INVESTMENT_LEVELS.map((level) => (
            <button
              key={level.value}
              type="button"
              onClick={() => setFormData({ ...formData, willingToInvest: level.value })}
              className={`p-4 rounded-lg border-2 transition-all text-center ${
                formData.willingToInvest === level.value
                  ? 'border-tier-info bg-tier-info-light'
                  : 'border-tier-border-default hover:border-tier-info'
              }`}
            >
              <div className="font-medium text-sm text-tier-navy mb-1">{level.label}</div>
              <div className="text-xs text-tier-text-secondary">{level.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-tier-info-light border border-tier-info rounded-lg p-4">
        <CardTitle className="text-sm font-semibold text-tier-navy mb-2">Hvorfor spor vi om dette?</CardTitle>
        <p className="text-xs text-tier-text-secondary">
          Tilgang til utstyr som TrackMan, treningsstudio og godt tilpassede klubber påvirker hvilke treningsmetoder
          som er tilgjengelige for deg. Dette hjelper oss å lage en plan som passer din situasjon og ressurser.
        </p>
      </div>
    </div>
  );
};

export default EquipmentStep;
