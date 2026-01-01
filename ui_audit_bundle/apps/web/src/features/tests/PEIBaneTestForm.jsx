import React, { useState, useMemo } from 'react';
import { Save, RotateCcw, Target, MapPin } from 'lucide-react';
import { tokens } from '../../design-tokens';
import { SectionTitle, SubSectionTitle } from '../../components/typography';
import Button from '../../ui/primitives/Button';
import apiClient from '../../services/apiClient';

// ============================================================================
// CONSTANTS
// ============================================================================

const SLAG_TYPER = [
  { id: 'f', label: 'Fairway', short: 'F', color: tokens.colors.success },
  { id: 'r', label: 'Rough', short: 'R', color: tokens.colors.warning },
  { id: 't', label: 'Tee', short: 'T', color: tokens.colors.primary },
  { id: 'b', label: 'Bunker', short: 'B', color: tokens.colors.error },
];

const INITIAL_SHOTS = Array.from({ length: 18 }, (_, i) => ({
  nr: i + 1,
  hull: '',
  slagType: '',
  lengde: '',
  tillHull: '',
}));

// ============================================================================
// PEI CALCULATION
// ============================================================================

/**
 * Beregner PEI (Precision Error Index) for et slag
 * PEI = (Avstand til hull) / (Slaglengde) * 100
 * Lavere PEI = bedre presisjon
 */
const calculatePEI = (lengde, tillHull) => {
  const l = parseFloat(lengde);
  const t = parseFloat(tillHull);
  if (!l || !t || l <= 0) return null;
  return (t / l) * 100;
};

// ============================================================================
// SHOT ROW COMPONENT
// ============================================================================

const ShotRow = ({ shot, onChange, isEven }) => {
  const pei = calculatePEI(shot.lengde, shot.tillHull);

  return (
    <tr style={{
      backgroundColor: isEven ? tokens.colors.snow : tokens.colors.white,
    }}>
      {/* Nr */}
      <td style={{
        padding: '8px 12px',
        textAlign: 'center',
        fontWeight: 600,
        color: tokens.colors.charcoal,
        fontSize: '14px',
      }}>
        {shot.nr}
      </td>

      {/* Hull */}
      <td style={{ padding: '6px 8px' }}>
        <input
          type="number"
          min="1"
          max="18"
          value={shot.hull}
          onChange={(e) => onChange('hull', e.target.value)}
          placeholder="-"
          style={{
            width: '100%',
            padding: '8px 10px',
            border: `1px solid ${tokens.colors.mist}`,
            borderRadius: '6px',
            fontSize: '14px',
            textAlign: 'center',
            outline: 'none',
          }}
        />
      </td>

      {/* Slag type (f/r/t/b) */}
      <td style={{ padding: '6px 8px' }}>
        <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
          {SLAG_TYPER.map((type) => (
            <button
              key={type.id}
              onClick={() => onChange('slagType', type.id)}
              title={type.label}
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                border: shot.slagType === type.id
                  ? `2px solid ${type.color}`
                  : `1px solid ${tokens.colors.mist}`,
                backgroundColor: shot.slagType === type.id
                  ? `${type.color}20`
                  : tokens.colors.white,
                color: shot.slagType === type.id ? type.color : tokens.colors.steel,
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {type.short}
            </button>
          ))}
        </div>
      </td>

      {/* Lengde (avstand til mål) */}
      <td style={{ padding: '6px 8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <input
            type="number"
            min="0"
            step="1"
            value={shot.lengde}
            onChange={(e) => onChange('lengde', e.target.value)}
            placeholder="0"
            style={{
              width: '100%',
              padding: '8px 10px',
              border: `1px solid ${tokens.colors.mist}`,
              borderRadius: '6px',
              fontSize: '14px',
              textAlign: 'right',
              outline: 'none',
            }}
          />
          <span style={{ fontSize: '12px', color: tokens.colors.steel, minWidth: '16px' }}>m</span>
        </div>
      </td>

      {/* Till hull (avstand etter slag) */}
      <td style={{ padding: '6px 8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <input
            type="number"
            min="0"
            step="0.1"
            value={shot.tillHull}
            onChange={(e) => onChange('tillHull', e.target.value)}
            placeholder="0"
            style={{
              width: '100%',
              padding: '8px 10px',
              border: `1px solid ${tokens.colors.mist}`,
              borderRadius: '6px',
              fontSize: '14px',
              textAlign: 'right',
              outline: 'none',
            }}
          />
          <span style={{ fontSize: '12px', color: tokens.colors.steel, minWidth: '16px' }}>m</span>
        </div>
      </td>

      {/* PEI (auto-calculated) */}
      <td style={{
        padding: '8px 12px',
        textAlign: 'center',
        fontWeight: 600,
        fontSize: '14px',
        color: pei !== null
          ? (pei <= 5 ? tokens.colors.success : pei <= 10 ? tokens.colors.warning : tokens.colors.error)
          : tokens.colors.mist,
      }}>
        {pei !== null ? pei.toFixed(1) + '%' : '-'}
      </td>
    </tr>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const PEIBaneTestForm = ({ player, onSubmit, onClose }) => {
  const [shots, setShots] = useState(INITIAL_SHOTS);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const handleShotChange = (index, field, value) => {
    const newShots = [...shots];
    newShots[index] = { ...newShots[index], [field]: value };
    setShots(newShots);
  };

  const handleReset = () => {
    setShots(INITIAL_SHOTS);
    setNotes('');
    setSubmitError(null);
  };

  // Calculate statistics
  const stats = useMemo(() => {
    const validShots = shots.filter(s => s.lengde && s.tillHull);
    if (validShots.length === 0) return null;

    const peiValues = validShots.map(s => calculatePEI(s.lengde, s.tillHull)).filter(p => p !== null);
    const avgPEI = peiValues.reduce((a, b) => a + b, 0) / peiValues.length;
    const avgTillHull = validShots.reduce((sum, s) => sum + parseFloat(s.tillHull), 0) / validShots.length;
    const totalLengde = validShots.reduce((sum, s) => sum + parseFloat(s.lengde), 0);

    // Count by slag type
    const slagTypeCounts = SLAG_TYPER.reduce((acc, type) => {
      acc[type.id] = validShots.filter(s => s.slagType === type.id).length;
      return acc;
    }, {});

    return {
      antallSlag: validShots.length,
      avgPEI,
      avgTillHull,
      totalLengde,
      slagTypeCounts,
    };
  }, [shots]);

  const handleSubmit = async () => {
    if (!stats || stats.antallSlag === 0) return;

    setIsSubmitting(true);
    setSubmitError(null);

    const testData = {
      testId: 'pei_bane', // This should match an existing test ID or be created
      value: stats.avgPEI,
      results: {
        shots: shots.filter(s => s.lengde && s.tillHull),
        avgTillHull: stats.avgTillHull,
        totalLengde: stats.totalLengde,
        antallSlag: stats.antallSlag,
        notes,
      },
      testDate: new Date().toISOString(),
      passed: stats.avgPEI <= 10, // Example threshold
    };

    try {
      if (onSubmit) {
        await onSubmit(testData);
      } else {
        await apiClient.post('/tests/results', testData);
      }
      handleReset();
      if (onClose) onClose();
    } catch (err) {
      console.error('Failed to submit PEI test:', err);
      setSubmitError(err.message || 'Kunne ikke lagre testresultatet');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      backgroundColor: tokens.colors.white,
      borderRadius: '16px',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '20px 24px',
        borderBottom: `1px solid ${tokens.colors.mist}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            backgroundColor: `${tokens.colors.primary}15`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Target size={24} color={tokens.colors.primary} />
          </div>
          <div>
            <SectionTitle style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>
              PEI Test - Bane
            </SectionTitle>
            <p style={{ margin: 0, fontSize: '13px', color: tokens.colors.steel }}>
              Slag test med 18 slag fra ulike posisjoner
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleReset}
          leftIcon={<RotateCcw size={16} />}
        >
          Nullstill
        </Button>
      </div>

      {/* Instructions */}
      <div style={{
        padding: '16px 24px',
        backgroundColor: `${tokens.colors.primary}08`,
        borderBottom: `1px solid ${tokens.colors.mist}`,
      }}>
        <p style={{ margin: 0, fontSize: '13px', color: tokens.colors.charcoal, lineHeight: 1.6 }}>
          <strong>Instruksjoner:</strong> Registrer 18 slag fra ulike posisjoner på banen.
          For hvert slag, noter hull-nummer, underlag (F=Fairway, R=Rough, T=Tee, B=Bunker),
          avstand til mål, og avstand til hull etter slaget. PEI beregnes automatisk.
        </p>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          minWidth: '600px',
        }}>
          <thead>
            <tr style={{
              backgroundColor: tokens.colors.snow,
              borderBottom: `2px solid ${tokens.colors.mist}`,
            }}>
              <th style={{ padding: '12px', fontSize: '12px', fontWeight: 600, color: tokens.colors.steel, textAlign: 'center', width: '50px' }}>Nr</th>
              <th style={{ padding: '12px', fontSize: '12px', fontWeight: 600, color: tokens.colors.steel, textAlign: 'center', width: '70px' }}>Hull</th>
              <th style={{ padding: '12px', fontSize: '12px', fontWeight: 600, color: tokens.colors.steel, textAlign: 'center', width: '140px' }}>Slag (F/R/T/B)</th>
              <th style={{ padding: '12px', fontSize: '12px', fontWeight: 600, color: tokens.colors.steel, textAlign: 'center', width: '100px' }}>Lengde</th>
              <th style={{ padding: '12px', fontSize: '12px', fontWeight: 600, color: tokens.colors.steel, textAlign: 'center', width: '100px' }}>Til hull</th>
              <th style={{ padding: '12px', fontSize: '12px', fontWeight: 600, color: tokens.colors.steel, textAlign: 'center', width: '80px' }}>PEI</th>
            </tr>
          </thead>
          <tbody>
            {shots.map((shot, index) => (
              <ShotRow
                key={shot.nr}
                shot={shot}
                onChange={(field, value) => handleShotChange(index, field, value)}
                isEven={index % 2 === 0}
              />
            ))}
          </tbody>

          {/* Total row */}
          {stats && (
            <tfoot>
              <tr style={{
                backgroundColor: tokens.colors.charcoal,
                color: tokens.colors.white,
              }}>
                <td colSpan={3} style={{
                  padding: '14px 16px',
                  fontSize: '14px',
                  fontWeight: 600,
                }}>
                  Total ({stats.antallSlag} slag)
                </td>
                <td style={{
                  padding: '14px 12px',
                  fontSize: '14px',
                  fontWeight: 600,
                  textAlign: 'center',
                }}>
                  {stats.totalLengde.toFixed(0)}m
                </td>
                <td style={{
                  padding: '14px 12px',
                  fontSize: '14px',
                  fontWeight: 600,
                  textAlign: 'center',
                }}>
                  Ø {stats.avgTillHull.toFixed(1)}m
                </td>
                <td style={{
                  padding: '14px 12px',
                  fontSize: '16px',
                  fontWeight: 700,
                  textAlign: 'center',
                  color: stats.avgPEI <= 5 ? tokens.colors.success : stats.avgPEI <= 10 ? tokens.colors.gold : tokens.colors.error,
                }}>
                  {stats.avgPEI.toFixed(1)}%
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      {/* Stats summary */}
      {stats && (
        <div style={{
          padding: '16px 24px',
          backgroundColor: tokens.colors.snow,
          borderTop: `1px solid ${tokens.colors.mist}`,
          display: 'flex',
          gap: '24px',
          flexWrap: 'wrap',
        }}>
          <div>
            <p style={{ margin: 0, fontSize: '11px', color: tokens.colors.steel, marginBottom: '4px' }}>
              Slag fordeling
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              {SLAG_TYPER.map((type) => (
                <span
                  key={type.id}
                  style={{
                    padding: '4px 8px',
                    borderRadius: '6px',
                    backgroundColor: `${type.color}15`,
                    color: type.color,
                    fontSize: '12px',
                    fontWeight: 600,
                  }}
                >
                  {type.short}: {stats.slagTypeCounts[type.id]}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '11px', color: tokens.colors.steel, marginBottom: '4px' }}>
              Gjennomsnitt til hull
            </p>
            <p style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: tokens.colors.primary }}>
              {stats.avgTillHull.toFixed(1)} m
            </p>
          </div>
        </div>
      )}

      {/* Notes */}
      <div style={{
        padding: '16px 24px',
        borderTop: `1px solid ${tokens.colors.mist}`,
      }}>
        <label style={{
          display: 'block',
          fontSize: '13px',
          fontWeight: 600,
          color: tokens.colors.charcoal,
          marginBottom: '8px',
        }}>
          Notater (valgfritt)
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="F.eks. værforhold, baneforhold, utstyr brukt..."
          rows={2}
          style={{
            width: '100%',
            padding: '10px 14px',
            borderRadius: '8px',
            border: `1px solid ${tokens.colors.mist}`,
            fontSize: '14px',
            outline: 'none',
            resize: 'vertical',
            fontFamily: 'inherit',
          }}
        />
      </div>

      {/* Error message */}
      {submitError && (
        <div style={{
          padding: '12px 24px',
          backgroundColor: `${tokens.colors.error}10`,
          borderTop: `1px solid ${tokens.colors.error}30`,
        }}>
          <p style={{ margin: 0, fontSize: '13px', color: tokens.colors.error }}>
            {submitError}
          </p>
        </div>
      )}

      {/* Footer */}
      <div style={{
        padding: '16px 24px',
        borderTop: `1px solid ${tokens.colors.mist}`,
        display: 'flex',
        gap: '12px',
        justifyContent: 'flex-end',
      }}>
        {onClose && (
          <Button variant="secondary" onClick={onClose}>
            Avbryt
          </Button>
        )}
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={!stats || stats.antallSlag === 0 || isSubmitting}
          loading={isSubmitting}
          leftIcon={<Save size={18} />}
        >
          {isSubmitting ? 'Lagrer...' : 'Lagre testresultat'}
        </Button>
      </div>
    </div>
  );
};

export default PEIBaneTestForm;
