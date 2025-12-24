import React, { useState } from 'react';
import {
  Target, Save, RotateCcw,
  Gauge, Activity, Info
} from 'lucide-react';
import { tokens } from '../../design-tokens';
import { PageHeader } from '../../components/layout/PageHeader';
import { settingsAPI } from '../../services/api';

// ============================================================================
// MOCK DATA
// ============================================================================

const CALIBRATION_SETTINGS = {
  driving: {
    clubSpeed: { value: 108, unit: 'mph', lastUpdated: '2025-01-15' },
    ballSpeed: { value: 158, unit: 'mph', lastUpdated: '2025-01-15' },
    launchAngle: { value: 11.5, unit: '°', lastUpdated: '2025-01-15' },
    spinRate: { value: 2400, unit: 'rpm', lastUpdated: '2025-01-15' },
    carryDistance: { value: 255, unit: 'm', lastUpdated: '2025-01-15' },
  },
  irons: {
    '7iron_carry': { value: 160, unit: 'm', lastUpdated: '2025-01-10' },
    '7iron_total': { value: 168, unit: 'm', lastUpdated: '2025-01-10' },
    'gapping': { value: 12, unit: 'm', lastUpdated: '2025-01-10' },
  },
  physical: {
    coreStrength: { value: 90, unit: 'sek', lastUpdated: '2025-01-12' },
    flexibility: { value: 45, unit: 'cm', lastUpdated: '2025-01-12' },
    rotationSpeed: { value: 650, unit: '°/s', lastUpdated: '2025-01-08' },
  },
};

const CLUB_DISTANCES = [
  { club: 'Driver', carry: 255, total: 270 },
  { club: '3-wood', carry: 230, total: 242 },
  { club: '5-wood', carry: 215, total: 225 },
  { club: '4-hybrid', carry: 200, total: 210 },
  { club: '5-iron', carry: 185, total: 195 },
  { club: '6-iron', carry: 172, total: 180 },
  { club: '7-iron', carry: 160, total: 168 },
  { club: '8-iron', carry: 148, total: 154 },
  { club: '9-iron', carry: 135, total: 140 },
  { club: 'PW', carry: 120, total: 125 },
  { club: 'GW', carry: 105, total: 110 },
  { club: 'SW', carry: 90, total: 92 },
  { club: 'LW', carry: 75, total: 77 },
];

// ============================================================================
// CALIBRATION INPUT
// ============================================================================

const CalibrationInput = ({ label, value, unit, lastUpdated, onChange }) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 14px',
    backgroundColor: tokens.colors.snow,
    borderRadius: '10px',
    marginBottom: '8px',
  }}>
    <div>
      <div style={{ fontSize: '13px', fontWeight: 500, color: tokens.colors.charcoal }}>
        {label}
      </div>
      <div style={{ fontSize: '11px', color: tokens.colors.steel }}>
        Oppdatert: {new Date(lastUpdated).toLocaleDateString('nb-NO')}
      </div>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        style={{
          width: '80px',
          padding: '8px 12px',
          borderRadius: '6px',
          border: `1px solid ${tokens.colors.mist}`,
          fontSize: '14px',
          fontWeight: 500,
          textAlign: 'right',
          outline: 'none',
        }}
      />
      <span style={{
        fontSize: '13px',
        color: tokens.colors.steel,
        minWidth: '40px',
      }}>
        {unit}
      </span>
    </div>
  </div>
);

// ============================================================================
// CLUB DISTANCE ROW
// ============================================================================

const ClubDistanceRow = ({ club, carry, total, onChange }) => (
  <div style={{
    display: 'grid',
    gridTemplateColumns: '80px 1fr 1fr',
    gap: '12px',
    alignItems: 'center',
    padding: '10px 0',
    borderBottom: `1px solid ${tokens.colors.mist}`,
  }}>
    <span style={{
      fontSize: '13px',
      fontWeight: 500,
      color: tokens.colors.charcoal,
    }}>
      {club}
    </span>
    <input
      type="number"
      value={carry}
      onChange={(e) => onChange('carry', parseInt(e.target.value))}
      style={{
        padding: '8px 12px',
        borderRadius: '6px',
        border: `1px solid ${tokens.colors.mist}`,
        fontSize: '14px',
        textAlign: 'center',
        outline: 'none',
      }}
    />
    <input
      type="number"
      value={total}
      onChange={(e) => onChange('total', parseInt(e.target.value))}
      style={{
        padding: '8px 12px',
        borderRadius: '6px',
        border: `1px solid ${tokens.colors.mist}`,
        fontSize: '14px',
        textAlign: 'center',
        outline: 'none',
      }}
    />
  </div>
);

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const KalibreringsContainer = () => {
  const [drivingSettings, setDrivingSettings] = useState(CALIBRATION_SETTINGS.driving);
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const [ironsSettings, setIronsSettings] = useState(CALIBRATION_SETTINGS.irons);
  const [physicalSettings, setPhysicalSettings] = useState(CALIBRATION_SETTINGS.physical);
  const [clubDistances, setClubDistances] = useState(CLUB_DISTANCES);
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    setError(null);

    try {
      await settingsAPI.saveCalibration({
        driver: drivingSettings,
        irons: ironsSettings,
        physical: physicalSettings,
        clubDistances,
      });

      setSuccess(true);
      setHasChanges(false);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Kunne ikke lagre kalibrering.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setDrivingSettings(CALIBRATION_SETTINGS.driving);
    setIronsSettings(CALIBRATION_SETTINGS.irons);
    setPhysicalSettings(CALIBRATION_SETTINGS.physical);
    setClubDistances(CLUB_DISTANCES);
    setHasChanges(false);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: tokens.colors.snow }}>
      <PageHeader
        title="Kalibrering"
        subtitle="Juster dine personlige mål og verdier"
      />

      <div style={{ padding: '16px 24px 24px', maxWidth: '800px', margin: '0 auto' }}>
        {/* Info Banner */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px',
          padding: '14px',
          backgroundColor: `${tokens.colors.primary}10`,
          borderRadius: '12px',
          marginBottom: '24px',
        }}>
          <Info size={20} color={tokens.colors.primary} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <h4 style={{
              fontSize: '14px',
              fontWeight: 600,
              color: tokens.colors.charcoal,
              margin: '0 0 4px 0',
            }}>
              Viktig for presise mål
            </h4>
            <p style={{
              fontSize: '13px',
              color: tokens.colors.steel,
              margin: 0,
              lineHeight: 1.4,
            }}>
              Oppdater disse verdiene regelmessig for a fa mest mulig noyaktige treningsmal og analyser.
              Verdiene brukes til a beregne fremgang og sammenligne med benchmark.
            </p>
          </div>
        </div>

        {/* Driving Settings */}
        <div style={{
          backgroundColor: tokens.colors.white,
          borderRadius: '14px',
          padding: '16px',
          marginBottom: '20px',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '14px',
          }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: `${tokens.colors.primary}15`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Gauge size={18} color={tokens.colors.primary} />
            </div>
            <h3 style={{
              fontSize: '15px',
              fontWeight: 600,
              color: tokens.colors.charcoal,
              margin: 0,
            }}>
              Driver-verdier
            </h3>
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
          <CalibrationInput
            label="Launch angle"
            value={drivingSettings.launchAngle.value}
            unit={drivingSettings.launchAngle.unit}
            lastUpdated={drivingSettings.launchAngle.lastUpdated}
            onChange={(val) => {
              setDrivingSettings({ ...drivingSettings, launchAngle: { ...drivingSettings.launchAngle, value: val } });
              setHasChanges(true);
            }}
          />
          <CalibrationInput
            label="Carry-avstand"
            value={drivingSettings.carryDistance.value}
            unit={drivingSettings.carryDistance.unit}
            lastUpdated={drivingSettings.carryDistance.lastUpdated}
            onChange={(val) => {
              setDrivingSettings({ ...drivingSettings, carryDistance: { ...drivingSettings.carryDistance, value: val } });
              setHasChanges(true);
            }}
          />
        </div>

        {/* Club Distances */}
        <div style={{
          backgroundColor: tokens.colors.white,
          borderRadius: '14px',
          padding: '16px',
          marginBottom: '20px',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '14px',
          }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: `${tokens.colors.success}15`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Target size={18} color={tokens.colors.success} />
            </div>
            <h3 style={{
              fontSize: '15px',
              fontWeight: 600,
              color: tokens.colors.charcoal,
              margin: 0,
            }}>
              Klubbavstander
            </h3>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '80px 1fr 1fr',
            gap: '12px',
            padding: '8px 0',
            borderBottom: `2px solid ${tokens.colors.mist}`,
            marginBottom: '8px',
          }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: tokens.colors.steel }}>Klubb</span>
            <span style={{ fontSize: '12px', fontWeight: 600, color: tokens.colors.steel, textAlign: 'center' }}>Carry (m)</span>
            <span style={{ fontSize: '12px', fontWeight: 600, color: tokens.colors.steel, textAlign: 'center' }}>Total (m)</span>
          </div>

          {clubDistances.map((club, idx) => (
            <ClubDistanceRow
              key={club.club}
              club={club.club}
              carry={club.carry}
              total={club.total}
              onChange={(field, value) => {
                const newDistances = [...clubDistances];
                newDistances[idx] = { ...newDistances[idx], [field]: value };
                setClubDistances(newDistances);
                setHasChanges(true);
              }}
            />
          ))}
        </div>

        {/* Physical Settings */}
        <div style={{
          backgroundColor: tokens.colors.white,
          borderRadius: '14px',
          padding: '16px',
          marginBottom: '20px',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '14px',
          }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: `${tokens.colors.error}15`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Activity size={18} color={tokens.colors.error} />
            </div>
            <h3 style={{
              fontSize: '15px',
              fontWeight: 600,
              color: tokens.colors.charcoal,
              margin: 0,
            }}>
              Fysiske verdier
            </h3>
          </div>

          <CalibrationInput
            label="Core-styrke (planke)"
            value={physicalSettings.coreStrength.value}
            unit={physicalSettings.coreStrength.unit}
            lastUpdated={physicalSettings.coreStrength.lastUpdated}
            onChange={(val) => {
              setPhysicalSettings({ ...physicalSettings, coreStrength: { ...physicalSettings.coreStrength, value: val } });
              setHasChanges(true);
            }}
          />
          <CalibrationInput
            label="Fleksibilitet"
            value={physicalSettings.flexibility.value}
            unit={physicalSettings.flexibility.unit}
            lastUpdated={physicalSettings.flexibility.lastUpdated}
            onChange={(val) => {
              setPhysicalSettings({ ...physicalSettings, flexibility: { ...physicalSettings.flexibility, value: val } });
              setHasChanges(true);
            }}
          />
          <CalibrationInput
            label="Rotasjonshastighet"
            value={physicalSettings.rotationSpeed.value}
            unit={physicalSettings.rotationSpeed.unit}
            lastUpdated={physicalSettings.rotationSpeed.lastUpdated}
            onChange={(val) => {
              setPhysicalSettings({ ...physicalSettings, rotationSpeed: { ...physicalSettings.rotationSpeed, value: val } });
              setHasChanges(true);
            }}
          />
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          gap: '12px',
        }}>
          <button
            onClick={handleReset}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '14px',
              borderRadius: '10px',
              border: `1px solid ${tokens.colors.mist}`,
              backgroundColor: tokens.colors.white,
              color: tokens.colors.charcoal,
              fontSize: '15px',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            <RotateCcw size={18} />
            Tilbakestill
          </button>
          <button
            onClick={handleSave}
            style={{
              flex: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '14px',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: hasChanges ? tokens.colors.primary : tokens.colors.mist,
              color: hasChanges ? tokens.colors.white : tokens.colors.steel,
              fontSize: '15px',
              fontWeight: 600,
              cursor: hasChanges ? 'pointer' : 'not-allowed',
            }}
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
