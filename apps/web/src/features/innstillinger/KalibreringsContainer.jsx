import React, { useState, useEffect, useCallback } from 'react';
import {
  Target, Save, RotateCcw,
  Gauge, Activity, Info, Check
} from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { useAuth } from '../../contexts/AuthContext';

// ============================================================================
// STORAGE KEY & DEFAULT DATA
// ============================================================================

const STORAGE_KEY = 'ak_golf_calibration';

const DEFAULT_CALIBRATION = {
  driving: {
    clubSpeed: { value: 108, unit: 'mph', lastUpdated: null },
    ballSpeed: { value: 158, unit: 'mph', lastUpdated: null },
    launchAngle: { value: 11.5, unit: '°', lastUpdated: null },
    spinRate: { value: 2400, unit: 'rpm', lastUpdated: null },
    carryDistance: { value: 255, unit: 'm', lastUpdated: null },
  },
  irons: {
    '7iron_carry': { value: 160, unit: 'm', lastUpdated: null },
    '7iron_total': { value: 168, unit: 'm', lastUpdated: null },
    'gapping': { value: 12, unit: 'm', lastUpdated: null },
  },
  physical: {
    coreStrength: { value: 90, unit: 'sek', lastUpdated: null },
    flexibility: { value: 45, unit: 'cm', lastUpdated: null },
    rotationSpeed: { value: 650, unit: '°/s', lastUpdated: null },
  },
};

const DEFAULT_CLUB_DISTANCES = [
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
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 14px',
    backgroundColor: 'var(--bg-secondary)',
    borderRadius: '10px',
    marginBottom: '8px',
  }}>
    <div>
      <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)' }}>
        {label}
      </div>
      <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
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
          border: `1px solid ${'var(--border-default)'}`,
          fontSize: '14px',
          fontWeight: 500,
          textAlign: 'right',
          outline: 'none',
        }}
      />
      <span style={{
        fontSize: '13px',
        color: 'var(--text-secondary)',
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
    borderBottom: `1px solid ${'var(--border-default)'}`,
  }}>
    <span style={{
      fontSize: '13px',
      fontWeight: 500,
      color: 'var(--text-primary)',
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
        border: `1px solid ${'var(--border-default)'}`,
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
        border: `1px solid ${'var(--border-default)'}`,
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
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [drivingSettings, setDrivingSettings] = useState(DEFAULT_CALIBRATION.driving);
  const [ironsSettings, setIronsSettings] = useState(DEFAULT_CALIBRATION.irons);
  const [physicalSettings, setPhysicalSettings] = useState(DEFAULT_CALIBRATION.physical);
  const [clubDistances, setClubDistances] = useState(DEFAULT_CLUB_DISTANCES);
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
        if (saved.clubDistances) setClubDistances(saved.clubDistances);
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
      clubDistances,
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
  }, [user?.id, drivingSettings, ironsSettings, physicalSettings, clubDistances]);

  const handleReset = () => {
    setDrivingSettings(DEFAULT_CALIBRATION.driving);
    setIronsSettings(DEFAULT_CALIBRATION.irons);
    setPhysicalSettings(DEFAULT_CALIBRATION.physical);
    setClubDistances(DEFAULT_CLUB_DISTANCES);
    setHasChanges(true);
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 40, height: 40, border: '3px solid var(--border-default)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ color: 'var(--text-secondary)' }}>Laster kalibrering...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-secondary)' }}>
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
          backgroundColor: `${'var(--accent)'}10`,
          borderRadius: '12px',
          marginBottom: '24px',
        }}>
          <Info size={20} color={'var(--accent)'} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <h4 style={{
              fontSize: '14px',
              fontWeight: 600,
              color: 'var(--text-primary)',
              margin: '0 0 4px 0',
            }}>
              Viktig for presise mål
            </h4>
            <p style={{
              fontSize: '13px',
              color: 'var(--text-secondary)',
              margin: 0,
              lineHeight: 1.4,
            }}>
              Oppdater disse verdiene regelmessig for a fa mest mulig noyaktige treningsmal og analyser.
              Verdiene brukes til a beregne fremgang og sammenligne med benchmark.
            </p>
          </div>
        </div>

        {/* Success Banner */}
        {success && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 14px',
            backgroundColor: `${'var(--success)'}15`,
            borderRadius: '10px',
            marginBottom: '16px',
          }}>
            <Check size={18} color={'var(--success)'} />
            <span style={{ fontSize: '14px', color: 'var(--success)', fontWeight: 500 }}>
              Kalibrering lagret!
            </span>
          </div>
        )}

        {/* Error Banner */}
        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 14px',
            backgroundColor: `${'var(--error)'}15`,
            borderRadius: '10px',
            marginBottom: '16px',
          }}>
            <Info size={18} color={'var(--error)'} />
            <span style={{ fontSize: '14px', color: 'var(--error)', fontWeight: 500 }}>
              {error}
            </span>
          </div>
        )}

        {/* Driving Settings */}
        <div style={{
          backgroundColor: 'var(--bg-primary)',
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
              backgroundColor: `${'var(--accent)'}15`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Gauge size={18} color={'var(--accent)'} />
            </div>
            <h3 style={{
              fontSize: '15px',
              fontWeight: 600,
              color: 'var(--text-primary)',
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
          backgroundColor: 'var(--bg-primary)',
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
              backgroundColor: `${'var(--success)'}15`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Target size={18} color={'var(--success)'} />
            </div>
            <h3 style={{
              fontSize: '15px',
              fontWeight: 600,
              color: 'var(--text-primary)',
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
            borderBottom: `2px solid ${'var(--border-default)'}`,
            marginBottom: '8px',
          }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Klubb</span>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', textAlign: 'center' }}>Carry (m)</span>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', textAlign: 'center' }}>Total (m)</span>
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
          backgroundColor: 'var(--bg-primary)',
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
              backgroundColor: `${'var(--error)'}15`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Activity size={18} color={'var(--error)'} />
            </div>
            <h3 style={{
              fontSize: '15px',
              fontWeight: 600,
              color: 'var(--text-primary)',
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
              border: `1px solid ${'var(--border-default)'}`,
              backgroundColor: 'var(--bg-primary)',
              color: 'var(--text-primary)',
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
              backgroundColor: hasChanges ? 'var(--accent)' : 'var(--border-default)',
              color: hasChanges ? 'var(--bg-primary)' : 'var(--text-secondary)',
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
