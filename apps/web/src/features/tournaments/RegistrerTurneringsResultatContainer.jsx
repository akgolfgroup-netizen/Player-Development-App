import React, { useState } from 'react';
import {
  Trophy, Save, MapPin, Calendar, Plus, Trash2,
  Users, Award
} from 'lucide-react';
import { tokens } from '../../design-tokens';
import { PageHeader } from '../../components/layout/PageHeader';

// ============================================================================
// MOCK DATA
// ============================================================================

const TOURNAMENT_TYPES = [
  { id: 'ranking', label: 'Ranking', color: tokens.colors.gold },
  { id: 'tour', label: 'Tour', color: tokens.colors.primary },
  { id: 'club', label: 'Klubbturnering', color: tokens.colors.success },
  { id: 'friendly', label: 'Vennskapelig', color: tokens.colors.steel },
];

const RECENT_COURSES = [
  'Oslo Golfklubb',
  'Asker Golfklubb',
  'Bogstad Golfklubb',
  'Drammen Golfklubb',
  'Miklagard Golfklubb',
];

// ============================================================================
// ROUND INPUT COMPONENT
// ============================================================================

const RoundInput = ({ roundNumber, score, onChange, onRemove, canRemove }) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 14px',
    backgroundColor: tokens.colors.snow,
    borderRadius: '10px',
  }}>
    <div style={{
      width: '32px',
      height: '32px',
      borderRadius: '8px',
      backgroundColor: tokens.colors.primary,
      color: tokens.colors.white,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '14px',
      fontWeight: 600,
    }}>
      R{roundNumber}
    </div>
    <div style={{ flex: 1 }}>
      <label style={{
        display: 'block',
        fontSize: '12px',
        color: tokens.colors.steel,
        marginBottom: '4px',
      }}>
        Score runde {roundNumber}
      </label>
      <input
        type="number"
        value={score || ''}
        onChange={(e) => onChange(parseInt(e.target.value) || 0)}
        placeholder="72"
        min="50"
        max="150"
        style={{
          width: '100%',
          padding: '10px 12px',
          borderRadius: '8px',
          border: `1px solid ${tokens.colors.mist}`,
          fontSize: '16px',
          fontWeight: 500,
          outline: 'none',
        }}
      />
    </div>
    {canRemove && (
      <button
        onClick={onRemove}
        style={{
          padding: '8px',
          borderRadius: '8px',
          border: 'none',
          backgroundColor: `${tokens.colors.error}10`,
          cursor: 'pointer',
        }}
      >
        <Trash2 size={16} color={tokens.colors.error} />
      </button>
    )}
  </div>
);

// ============================================================================
// TYPE SELECTOR
// ============================================================================

const TypeSelector = ({ selected, onChange }) => (
  <div style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: '10px',
  }}>
    {TOURNAMENT_TYPES.map((type) => (
      <button
        key={type.id}
        onClick={() => onChange(type.id)}
        style={{
          padding: '14px',
          borderRadius: '10px',
          border: selected === type.id
            ? `2px solid ${type.color}`
            : '2px solid transparent',
          backgroundColor: selected === type.id
            ? `${type.color}15`
            : tokens.colors.white,
          color: selected === type.id ? type.color : tokens.colors.charcoal,
          fontSize: '13px',
          fontWeight: 500,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
        }}
      >
        <Trophy size={16} color={selected === type.id ? type.color : tokens.colors.steel} />
        {type.label}
      </button>
    ))}
  </div>
);

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const RegistrerTurneringsResultatContainer = () => {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    course: '',
    date: new Date().toISOString().split('T')[0],
    par: 72,
    position: '',
    participants: '',
    rounds: [0],
    notes: '',
  });

  const handleRoundChange = (index, value) => {
    const newRounds = [...formData.rounds];
    newRounds[index] = value;
    setFormData({ ...formData, rounds: newRounds });
  };

  const addRound = () => {
    if (formData.rounds.length < 4) {
      setFormData({ ...formData, rounds: [...formData.rounds, 0] });
    }
  };

  const removeRound = (index) => {
    if (formData.rounds.length > 1) {
      const newRounds = formData.rounds.filter((_, i) => i !== index);
      setFormData({ ...formData, rounds: newRounds });
    }
  };

  const totalScore = formData.rounds.reduce((sum, score) => sum + (score || 0), 0);
  const totalPar = formData.par * formData.rounds.length;
  const scoreToPar = totalScore - totalPar;

  const handleSubmit = () => {
    // TODO: Save tournament result to backend API
  };

  const canSubmit = formData.name && formData.type && formData.course &&
    formData.date && formData.position && formData.participants &&
    formData.rounds.every((r) => r > 0);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: tokens.colors.snow }}>
      <PageHeader
        title="Registrer resultat"
        subtitle="Legg inn et nytt turneringsresultat"
      />

      <div style={{ padding: '16px 24px 24px', maxWidth: '800px', margin: '0 auto' }}>
        {/* Tournament Type */}
        <div style={{
          backgroundColor: tokens.colors.white,
          borderRadius: '14px',
          padding: '16px',
          marginBottom: '20px',
        }}>
          <h3 style={{
            fontSize: '14px',
            fontWeight: 600,
            color: tokens.colors.charcoal,
            marginBottom: '12px',
          }}>
            Type turnering
          </h3>
          <TypeSelector
            selected={formData.type}
            onChange={(type) => setFormData({ ...formData, type })}
          />
        </div>

        {/* Tournament Details */}
        <div style={{
          backgroundColor: tokens.colors.white,
          borderRadius: '14px',
          padding: '16px',
          marginBottom: '20px',
        }}>
          <h3 style={{
            fontSize: '14px',
            fontWeight: 600,
            color: tokens.colors.charcoal,
            marginBottom: '12px',
          }}>
            Turneringsdetaljer
          </h3>

          {/* Name */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: 500,
              color: tokens.colors.charcoal,
              marginBottom: '6px',
            }}>
              Turneringsnavn
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="F.eks. Junior Masters Oslo"
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '8px',
                border: `1px solid ${tokens.colors.mist}`,
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </div>

          {/* Course */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px',
              fontWeight: 500,
              color: tokens.colors.charcoal,
              marginBottom: '6px',
            }}>
              <MapPin size={14} />
              Bane
            </label>
            <input
              type="text"
              value={formData.course}
              onChange={(e) => setFormData({ ...formData, course: e.target.value })}
              placeholder="Velg eller skriv banenavn"
              list="courses"
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '8px',
                border: `1px solid ${tokens.colors.mist}`,
                fontSize: '14px',
                outline: 'none',
              }}
            />
            <datalist id="courses">
              {RECENT_COURSES.map((course) => (
                <option key={course} value={course} />
              ))}
            </datalist>
          </div>

          {/* Date and Par */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px',
          }}>
            <div>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '13px',
                fontWeight: 500,
                color: tokens.colors.charcoal,
                marginBottom: '6px',
              }}>
                <Calendar size={14} />
                Dato
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '8px',
                  border: `1px solid ${tokens.colors.mist}`,
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
            </div>
            <div>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 500,
                color: tokens.colors.charcoal,
                marginBottom: '6px',
              }}>
                Par per runde
              </label>
              <input
                type="number"
                value={formData.par}
                onChange={(e) => setFormData({ ...formData, par: parseInt(e.target.value) || 72 })}
                min="60"
                max="80"
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '8px',
                  border: `1px solid ${tokens.colors.mist}`,
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
            </div>
          </div>
        </div>

        {/* Scores */}
        <div style={{
          backgroundColor: tokens.colors.white,
          borderRadius: '14px',
          padding: '16px',
          marginBottom: '20px',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '12px',
          }}>
            <h3 style={{
              fontSize: '14px',
              fontWeight: 600,
              color: tokens.colors.charcoal,
              margin: 0,
            }}>
              Scorer
            </h3>
            {formData.rounds.length < 4 && (
              <button
                onClick={addRound}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: `${tokens.colors.primary}15`,
                  color: tokens.colors.primary,
                  fontSize: '12px',
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                <Plus size={14} />
                Legg til runde
              </button>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
            {formData.rounds.map((score, index) => (
              <RoundInput
                key={index}
                roundNumber={index + 1}
                score={score}
                onChange={(value) => handleRoundChange(index, value)}
                onRemove={() => removeRound(index)}
                canRemove={formData.rounds.length > 1}
              />
            ))}
          </div>

          {/* Score Summary */}
          {totalScore > 0 && (
            <div style={{
              display: 'flex',
              justifyContent: 'space-around',
              padding: '14px',
              backgroundColor: tokens.colors.snow,
              borderRadius: '10px',
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: tokens.colors.steel }}>Total</div>
                <div style={{ fontSize: '20px', fontWeight: 700, color: tokens.colors.charcoal }}>
                  {totalScore}
                </div>
              </div>
              <div style={{ borderLeft: `1px solid ${tokens.colors.mist}` }} />
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: tokens.colors.steel }}>Par</div>
                <div style={{ fontSize: '20px', fontWeight: 700, color: tokens.colors.charcoal }}>
                  {totalPar}
                </div>
              </div>
              <div style={{ borderLeft: `1px solid ${tokens.colors.mist}` }} />
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: tokens.colors.steel }}>Til par</div>
                <div style={{
                  fontSize: '20px',
                  fontWeight: 700,
                  color: scoreToPar < 0 ? tokens.colors.success :
                         scoreToPar > 0 ? tokens.colors.error : tokens.colors.charcoal,
                }}>
                  {scoreToPar === 0 ? 'E' : scoreToPar > 0 ? `+${scoreToPar}` : scoreToPar}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Position */}
        <div style={{
          backgroundColor: tokens.colors.white,
          borderRadius: '14px',
          padding: '16px',
          marginBottom: '20px',
        }}>
          <h3 style={{
            fontSize: '14px',
            fontWeight: 600,
            color: tokens.colors.charcoal,
            marginBottom: '12px',
          }}>
            Plassering
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px',
          }}>
            <div>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '13px',
                fontWeight: 500,
                color: tokens.colors.charcoal,
                marginBottom: '6px',
              }}>
                <Award size={14} />
                Din plassering
              </label>
              <input
                type="number"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                placeholder="1"
                min="1"
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '8px',
                  border: `1px solid ${tokens.colors.mist}`,
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
            </div>
            <div>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '13px',
                fontWeight: 500,
                color: tokens.colors.charcoal,
                marginBottom: '6px',
              }}>
                <Users size={14} />
                Antall deltakere
              </label>
              <input
                type="number"
                value={formData.participants}
                onChange={(e) => setFormData({ ...formData, participants: e.target.value })}
                placeholder="48"
                min="2"
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '8px',
                  border: `1px solid ${tokens.colors.mist}`,
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
            </div>
          </div>
        </div>

        {/* Notes */}
        <div style={{
          backgroundColor: tokens.colors.white,
          borderRadius: '14px',
          padding: '16px',
          marginBottom: '20px',
        }}>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: 600,
            color: tokens.colors.charcoal,
            marginBottom: '8px',
          }}>
            Notater (valgfritt)
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Tanker om turneringen, hva gikk bra/darlig..."
            rows={3}
            style={{
              width: '100%',
              padding: '12px 14px',
              borderRadius: '8px',
              border: `1px solid ${tokens.colors.mist}`,
              fontSize: '14px',
              outline: 'none',
              resize: 'vertical',
              fontFamily: 'inherit',
            }}
          />
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '14px',
            borderRadius: '10px',
            border: 'none',
            backgroundColor: canSubmit ? tokens.colors.primary : tokens.colors.mist,
            color: canSubmit ? tokens.colors.white : tokens.colors.steel,
            fontSize: '15px',
            fontWeight: 600,
            cursor: canSubmit ? 'pointer' : 'not-allowed',
          }}
        >
          <Save size={18} />
          Lagre resultat
        </button>
      </div>
    </div>
  );
};

export default RegistrerTurneringsResultatContainer;
