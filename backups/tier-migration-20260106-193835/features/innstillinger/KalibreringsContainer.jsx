/**
 * AK Golf Academy - Kalibrerings Container
 * Design System v3.0 - Premium Light
 *
 * Calibration settings for player metrics and club distances.
 *
 * MIGRATED TO PAGE ARCHITECTURE - Zero inline styles
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Target, Save, RotateCcw,
  Gauge, Activity, Info, Check
} from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { SubSectionTitle, CardTitle } from '../../components/typography';
import { useAuth } from '../../contexts/AuthContext';

// ============================================================================
// STORAGE KEY & DEFAULT DATA
// ============================================================================

const STORAGE_KEY = 'ak_golf_calibration';

const DEFAULT_CALIBRATION = {
  driving: {
    clubSpeed: { value: 108, unit: 'mph', lastUpdated: null },
    ballSpeed: { value: 158, unit: 'mph', lastUpdated: null },
  },
  irons: {
    '7iron_carry': { value: 160, unit: 'm', lastUpdated: null },
    '7iron_total': { value: 168, unit: 'm', lastUpdated: null },
    'gapping': { value: 12, unit: 'm', lastUpdated: null },
  },
  physical: {
    benchPress: { value: 60, unit: 'kg', lastUpdated: null },
    trapBarDeadlift: { value: 100, unit: 'kg', lastUpdated: null },
    medicineBallThrow: { value: 8, unit: 'm', lastUpdated: null },
    standingLongJump: { value: 200, unit: 'cm', lastUpdated: null },
    running3000m: { value: 720, unit: 'sek', lastUpdated: null },
  },
};

const DEFAULT_CLUB_SPEEDS = [
  { club: 'Driver', clubSpeed: 108 },
  { club: '3-wood', clubSpeed: 102 },
  { club: '5-wood', clubSpeed: 98 },
  { club: '4-hybrid', clubSpeed: 94 },
  { club: '5-iron', clubSpeed: 90 },
  { club: '6-iron', clubSpeed: 87 },
  { club: '7-iron', clubSpeed: 84 },
  { club: '8-iron', clubSpeed: 81 },
  { club: '9-iron', clubSpeed: 78 },
  { club: 'PW', clubSpeed: 75 },
  { club: 'GW', clubSpeed: 72 },
  { club: 'SW', clubSpeed: 68 },
  { club: 'LW', clubSpeed: 64 },
];

// Load calibration from localStorage
const loadCalibration = (userId) => {
  try {
    const key = `${STORAGE_KEY}_${userId}`;
    const stored = localStorage.getItem(key);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (err) {
    console.error('Error loading calibration:', err);
  }
  return null;
};

// Save calibration to localStorage
const saveCalibrationToStorage = (userId, data) => {
  try {
    const key = `${STORAGE_KEY}_${userId}`;
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (err) {
    console.error('Error saving calibration:', err);
    return false;
  }
};

// ============================================================================
// CALIBRATION INPUT
// ============================================================================

const CalibrationInput = ({ label, value, unit, lastUpdated, onChange }) => (
  <div className="flex items-center justify-between py-3 px-3.5 bg-ak-surface-subtle rounded-[10px] mb-2">
    <div>
      <div className="text-[13px] font-medium text-ak-text-primary">
        {label}
      </div>
      <div className="text-[11px] text-ak-text-secondary">
        Oppdatert: {new Date(lastUpdated).toLocaleDateString('nb-NO')}
      </div>
    </div>
    <div className="flex items-center gap-2">
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-20 py-2 px-3 rounded-md border border-ak-border-default text-sm font-medium text-right outline-none focus:border-ak-primary bg-ak-surface-base"
      />
      <span className="text-[13px] text-ak-text-secondary min-w-[40px]">
        {unit}
      </span>
    </div>
  </div>
);

// ============================================================================
// CLUB SPEED ROW
// ============================================================================

const ClubSpeedRow = ({ club, clubSpeed, onChange }) => (
  <div className="grid grid-cols-[100px_1fr_60px] gap-3 items-center py-2.5 border-b border-ak-border-default">
    <span className="text-[13px] font-medium text-ak-text-primary">
      {club}
    </span>
    <input
      type="number"
      value={clubSpeed}
      onChange={(e) => onChange(parseInt(e.target.value))}
      className="py-2 px-3 rounded-md border border-ak-border-default text-sm text-center outline-none focus:border-ak-primary bg-ak-surface-base"
    />
    <span className="text-[13px] text-ak-text-secondary">mph</span>
  </div>
);

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const KalibreringsContainer = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [drivingSettings, setDrivingSettings] = useState(DEFAULT_CALIBRATION.driving);
  const [ironsSettings, setIronsSettings] = useState(DEFAULT_CALIBRATION.irons);
  const [physicalSettings, setPhysicalSettings] = useState(DEFAULT_CALIBRATION.physical);
  const [clubSpeeds, setClubSpeeds] = useState(DEFAULT_CLUB_SPEEDS);
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Load saved calibration on mount
  useEffect(() => {
    if (user?.id) {
      const saved = loadCalibration(user.id);
      if (saved) {
        if (saved.driving) setDrivingSettings(saved.driving);
        if (saved.irons) setIronsSettings(saved.irons);
        if (saved.physical) setPhysicalSettings(saved.physical);
        if (saved.clubSpeeds) setClubSpeeds(saved.clubSpeeds);
      }
      setLoading(false);
    }
  }, [user?.id]);

  const handleSave = useCallback(async () => {
    if (!user?.id) return;

    setSaving(true);
    setError(null);

    // Update timestamps
    const now = new Date().toISOString().split('T')[0];
    const updatedDriving = { ...drivingSettings };
    Object.keys(updatedDriving).forEach(key => {
      if (updatedDriving[key].lastUpdated === null) {
        updatedDriving[key] = { ...updatedDriving[key], lastUpdated: now };
      }
    });

    const updatedPhysical = { ...physicalSettings };
    Object.keys(updatedPhysical).forEach(key => {
      if (updatedPhysical[key].lastUpdated === null) {
        updatedPhysical[key] = { ...updatedPhysical[key], lastUpdated: now };
      }
    });

    const dataToSave = {
      driving: updatedDriving,
      irons: ironsSettings,
      physical: updatedPhysical,
      clubSpeeds,
      savedAt: new Date().toISOString(),
    };

    try {
      const saved = saveCalibrationToStorage(user.id, dataToSave);
      if (saved) {
        setDrivingSettings(updatedDriving);
        setPhysicalSettings(updatedPhysical);
        setSuccess(true);
        setHasChanges(false);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        throw new Error('Kunne ikke lagre');
      }
    } catch (err) {
      setError(err.message || 'Kunne ikke lagre kalibrering.');
    } finally {
      setSaving(false);
    }
  }, [user?.id, drivingSettings, ironsSettings, physicalSettings, clubSpeeds]);

  const handleReset = () => {
    setDrivingSettings(DEFAULT_CALIBRATION.driving);
    setIronsSettings(DEFAULT_CALIBRATION.irons);
    setPhysicalSettings(DEFAULT_CALIBRATION.physical);
    setClubSpeeds(DEFAULT_CLUB_SPEEDS);
    setHasChanges(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-ak-surface-subtle flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-[3px] border-ak-border-default border-t-ak-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-ak-text-secondary">Laster kalibrering...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ak-surface-subtle">
      <PageHeader
        title="Kalibrering"
        subtitle="Juster dine personlige mål og verdier"
      />

      <div className="p-4 px-6 pb-6 max-w-[800px] mx-auto">
        {/* Info Banner */}
        <div className="flex items-start gap-3 p-3.5 bg-ak-primary/10 rounded-xl mb-6">
          <Info size={20} className="text-ak-primary flex-shrink-0 mt-0.5" />
          <div>
            <CardTitle className="text-sm font-semibold text-ak-text-primary m-0 mb-1">
              Viktig for presise mål
            </CardTitle>
            <p className="text-[13px] text-ak-text-secondary m-0 leading-snug">
              Oppdater disse verdiene regelmessig for a fa mest mulig noyaktige treningsmal og analyser.
              Verdiene brukes til a beregne fremgang og sammenligne med benchmark.
            </p>
          </div>
        </div>

        {/* Success Banner */}
        {success && (
          <div className="flex items-center gap-2.5 py-3 px-3.5 bg-ak-status-success/15 rounded-[10px] mb-4">
            <Check size={18} className="text-ak-status-success" />
            <span className="text-sm text-ak-status-success font-medium">
              Kalibrering lagret!
            </span>
          </div>
        )}

        {/* Error Banner */}
        {error && (
          <div className="flex items-center gap-2.5 py-3 px-3.5 bg-ak-status-error/15 rounded-[10px] mb-4">
            <Info size={18} className="text-ak-status-error" />
            <span className="text-sm text-ak-status-error font-medium">
              {error}
            </span>
          </div>
        )}

        {/* Driving Settings */}
        <div className="bg-ak-surface-base rounded-[14px] p-4 mb-5">
          <div className="flex items-center gap-2.5 mb-3.5">
            <div className="w-9 h-9 rounded-lg bg-ak-primary/15 flex items-center justify-center">
              <Gauge size={18} className="text-ak-primary" />
            </div>
            <SubSectionTitle className="text-[15px] font-semibold text-ak-text-primary m-0">
              Driver-verdier
            </SubSectionTitle>
          </div>

          <CalibrationInput
            label="Klubbfart"
            value={drivingSettings.clubSpeed.value}
            unit={drivingSettings.clubSpeed.unit}
            lastUpdated={drivingSettings.clubSpeed.lastUpdated}
            onChange={(val) => {
              setDrivingSettings({ ...drivingSettings, clubSpeed: { ...drivingSettings.clubSpeed, value: val } });
              setHasChanges(true);
            }}
          />
          <CalibrationInput
            label="Ballfart"
            value={drivingSettings.ballSpeed.value}
            unit={drivingSettings.ballSpeed.unit}
            lastUpdated={drivingSettings.ballSpeed.lastUpdated}
            onChange={(val) => {
              setDrivingSettings({ ...drivingSettings, ballSpeed: { ...drivingSettings.ballSpeed, value: val } });
              setHasChanges(true);
            }}
          />
        </div>

        {/* Club Speeds */}
        <div className="bg-ak-surface-base rounded-[14px] p-4 mb-5">
          <div className="flex items-center gap-2.5 mb-3.5">
            <div className="w-9 h-9 rounded-lg bg-ak-status-success/15 flex items-center justify-center">
              <Gauge size={18} className="text-ak-status-success" />
            </div>
            <SubSectionTitle className="text-[15px] font-semibold text-ak-text-primary m-0">
              Klubbfart per kølle
            </SubSectionTitle>
          </div>

          <div className="grid grid-cols-[100px_1fr_60px] gap-3 py-2 border-b-2 border-ak-border-default mb-2">
            <span className="text-xs font-semibold text-ak-text-secondary">Klubb</span>
            <span className="text-xs font-semibold text-ak-text-secondary text-center">Club Speed</span>
            <span className="text-xs font-semibold text-ak-text-secondary"></span>
          </div>

          {clubSpeeds.map((club, idx) => (
            <ClubSpeedRow
              key={club.club}
              club={club.club}
              clubSpeed={club.clubSpeed}
              onChange={(value) => {
                const newSpeeds = [...clubSpeeds];
                newSpeeds[idx] = { ...newSpeeds[idx], clubSpeed: value };
                setClubSpeeds(newSpeeds);
                setHasChanges(true);
              }}
            />
          ))}
        </div>

        {/* Physical Settings */}
        <div className="bg-ak-surface-base rounded-[14px] p-4 mb-5">
          <div className="flex items-center gap-2.5 mb-3.5">
            <div className="w-9 h-9 rounded-lg bg-ak-status-error/15 flex items-center justify-center">
              <Activity size={18} className="text-ak-status-error" />
            </div>
            <SubSectionTitle className="text-[15px] font-semibold text-ak-text-primary m-0">
              Fysiske verdier
            </SubSectionTitle>
          </div>

          <CalibrationInput
            label="Benkpress"
            value={physicalSettings.benchPress.value}
            unit={physicalSettings.benchPress.unit}
            lastUpdated={physicalSettings.benchPress.lastUpdated}
            onChange={(val) => {
              setPhysicalSettings({ ...physicalSettings, benchPress: { ...physicalSettings.benchPress, value: val } });
              setHasChanges(true);
            }}
          />
          <CalibrationInput
            label="Markløft m/ trapbar"
            value={physicalSettings.trapBarDeadlift.value}
            unit={physicalSettings.trapBarDeadlift.unit}
            lastUpdated={physicalSettings.trapBarDeadlift.lastUpdated}
            onChange={(val) => {
              setPhysicalSettings({ ...physicalSettings, trapBarDeadlift: { ...physicalSettings.trapBarDeadlift, value: val } });
              setHasChanges(true);
            }}
          />
          <CalibrationInput
            label="Medisinballkast"
            value={physicalSettings.medicineBallThrow.value}
            unit={physicalSettings.medicineBallThrow.unit}
            lastUpdated={physicalSettings.medicineBallThrow.lastUpdated}
            onChange={(val) => {
              setPhysicalSettings({ ...physicalSettings, medicineBallThrow: { ...physicalSettings.medicineBallThrow, value: val } });
              setHasChanges(true);
            }}
          />
          <CalibrationInput
            label="Stille stående lengde"
            value={physicalSettings.standingLongJump.value}
            unit={physicalSettings.standingLongJump.unit}
            lastUpdated={physicalSettings.standingLongJump.lastUpdated}
            onChange={(val) => {
              setPhysicalSettings({ ...physicalSettings, standingLongJump: { ...physicalSettings.standingLongJump, value: val } });
              setHasChanges(true);
            }}
          />
          <CalibrationInput
            label="3000 m løping"
            value={physicalSettings.running3000m.value}
            unit={physicalSettings.running3000m.unit}
            lastUpdated={physicalSettings.running3000m.lastUpdated}
            onChange={(val) => {
              setPhysicalSettings({ ...physicalSettings, running3000m: { ...physicalSettings.running3000m, value: val } });
              setHasChanges(true);
            }}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleReset}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-[10px] border border-ak-border-default bg-ak-surface-base text-ak-text-primary text-[15px] font-medium cursor-pointer hover:bg-ak-surface-subtle transition-colors"
          >
            <RotateCcw size={18} />
            Tilbakestill
          </button>
          <button
            onClick={handleSave}
            disabled={!hasChanges}
            className={`flex-[2] flex items-center justify-center gap-2 py-3.5 rounded-[10px] border-none text-[15px] font-semibold transition-colors ${
              hasChanges
                ? 'bg-ak-primary text-white cursor-pointer hover:bg-ak-primary/90'
                : 'bg-ak-border-default text-ak-text-secondary cursor-not-allowed'
            }`}
          >
            <Save size={18} />
            Lagre endringer
          </button>
        </div>
      </div>
    </div>
  );
};

export default KalibreringsContainer;
