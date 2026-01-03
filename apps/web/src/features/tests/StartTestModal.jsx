/**
 * StartTestModal Component
 * Design System v3.0 - Premium Light
 *
 * MIGRATED TO PAGE ARCHITECTURE - Minimal inline styles (modal positioning)
 */

import React, { useState } from 'react';
import { X, Play, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { SectionTitle, SubSectionTitle, CardTitle } from '../../components/typography';
import Button from '../../ui/primitives/Button';

const StartTestModal = ({ test, player, onClose, onSubmit }) => {
  const [step, setStep] = useState('instructions'); // instructions, recording, review
  const [attempts, setAttempts] = useState([]);
  const [currentAttempt, setCurrentAttempt] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!test) return null;

  const testDetails = test.testDetails || {};
  const requiredAttempts = testDetails.attempts || 5;
  const requirement = test.requirement?.[player?.category] || test.requirement?.B;

  const handleAddAttempt = () => {
    if (currentAttempt && !isNaN(parseFloat(currentAttempt))) {
      setAttempts([...attempts, parseFloat(currentAttempt)]);
      setCurrentAttempt('');
    }
  };

  const handleRemoveAttempt = (index) => {
    setAttempts(attempts.filter((_, i) => i !== index));
  };

  const calculateResult = () => {
    if (attempts.length === 0) return null;

    // Different calculation based on test type
    if (testDetails.scoring?.includes('beste') || testDetails.scoring?.includes('Høyeste')) {
      return Math.max(...attempts);
    } else if (testDetails.scoring?.includes('Gjennomsnitt')) {
      // Average of best 3 if we have enough attempts
      if (attempts.length >= 5) {
        const sorted = [...attempts].sort((a, b) => test.lowerIsBetter ? a - b : b - a);
        const best3 = sorted.slice(0, 3);
        return best3.reduce((a, b) => a + b, 0) / best3.length;
      }
      return attempts.reduce((a, b) => a + b, 0) / attempts.length;
    } else if (testDetails.scoring?.includes('Prosent')) {
      // Percentage based (e.g., holed putts)
      const successCount = attempts.filter(a => a === 1).length;
      return (successCount / attempts.length) * 100;
    }
    // Default: average
    return attempts.reduce((a, b) => a + b, 0) / attempts.length;
  };

  const result = calculateResult();
  const meetsRequirement = result !== null && requirement !== undefined
    ? (test.lowerIsBetter ? result <= requirement : result >= requirement)
    : false;

  const handleSubmit = async () => {
    if (result === null) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        testId: test.id,
        value: result,
        results: { attempts, notes },
        testDate: new Date().toISOString(),
        passed: meetsRequirement,
      });
      onClose();
    } catch (error) {
      console.error('Error submitting test result:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px',
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          backgroundColor: 'var(--ak-surface-card)',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '500px',
          maxHeight: '90vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--ak-border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '24px' }}>{test.icon}</span>
            <div>
              <SectionTitle style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: 'var(--ak-text-primary)' }}>
                {test.name}
              </SectionTitle>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--ak-text-secondary)' }}>
                Test {test.testNumber || test.id}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              color: 'var(--ak-text-secondary)',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflow: 'auto', padding: '20px' }}>
          {step === 'instructions' && (
            <div>
              <SubSectionTitle style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px', color: 'var(--ak-text-primary)' }}>
                Instruksjoner
              </SubSectionTitle>
              <p style={{ fontSize: '14px', color: 'var(--ak-text-primary)', marginBottom: '16px', lineHeight: 1.5 }}>
                {test.description}
              </p>

              {testDetails.equipment && (
                <div style={{ marginBottom: '16px' }}>
                  <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--ak-text-secondary)', marginBottom: '8px' }}>
                    Utstyr
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {testDetails.equipment.map((item, i) => (
                      <span
                        key={i}
                        style={{
                          padding: '4px 10px',
                          backgroundColor: 'var(--ak-surface-subtle)',
                          borderRadius: '12px',
                          fontSize: '12px',
                          color: 'var(--ak-text-primary)',
                        }}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {testDetails.warmup && (
                <div style={{ marginBottom: '16px' }}>
                  <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--ak-text-secondary)', marginBottom: '4px' }}>
                    Oppvarming
                  </p>
                  <p style={{ fontSize: '13px', color: 'var(--ak-text-primary)' }}>
                    {testDetails.warmup}
                  </p>
                </div>
              )}

              <div style={{
                backgroundColor: 'var(--ak-surface-subtle)',
                padding: '12px 16px',
                borderRadius: '8px',
                marginTop: '16px',
              }}>
                <p style={{ fontSize: '12px', color: 'var(--ak-text-secondary)', marginBottom: '4px' }}>
                  Krav for kategori {player?.category || 'B'}
                </p>
                <p style={{ fontSize: '18px', fontWeight: 700, color: 'var(--ak-brand-primary)' }}>
                  {test.lowerIsBetter ? '≤ ' : '≥ '}{requirement}{test.unit}
                </p>
              </div>
            </div>
          )}

          {step === 'recording' && (
            <div>
              <SubSectionTitle style={{ fontSize: '14px', fontWeight: 600, marginBottom: '16px', color: 'var(--ak-text-primary)' }}>
                Registrer forsøk ({attempts.length}/{requiredAttempts})
              </SubSectionTitle>

              {/* Input for new attempt */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <input
                  type="number"
                  step="any"
                  value={currentAttempt}
                  onChange={(e) => setCurrentAttempt(e.target.value)}
                  placeholder={`Skriv inn resultat (${test.unit})`}
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    border: '1px solid var(--ak-border-subtle)',
                    borderRadius: '8px',
                    fontSize: '16px',
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddAttempt()}
                />
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleAddAttempt}
                  disabled={!currentAttempt}
                >
                  Legg til
                </Button>
              </div>

              {/* List of attempts */}
              <div style={{ marginBottom: '16px' }}>
                {attempts.length === 0 ? (
                  <p style={{ color: 'var(--ak-text-secondary)', fontSize: '13px', textAlign: 'center', padding: '20px' }}>
                    Ingen forsøk registrert ennå
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {attempts.map((attempt, i) => (
                      <div
                        key={i}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '10px 14px',
                          backgroundColor: 'var(--ak-surface-subtle)',
                          borderRadius: '8px',
                        }}
                      >
                        <span style={{ fontSize: '13px', color: 'var(--ak-text-secondary)' }}>
                          Forsøk {i + 1}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{ fontSize: '16px', fontWeight: 600, color: 'var(--ak-text-primary)' }}>
                            {attempt}{test.unit}
                          </span>
                          <button
                            onClick={() => handleRemoveAttempt(i)}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              color: 'var(--ak-status-error)',
                              fontSize: '14px',
                            }}
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Notes */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--ak-text-secondary)', display: 'block', marginBottom: '6px' }}>
                  Notater (valgfritt)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Legg til kommentarer om testen..."
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    border: '1px solid var(--ak-border-subtle)',
                    borderRadius: '8px',
                    fontSize: '14px',
                    resize: 'vertical',
                    minHeight: '60px',
                  }}
                />
              </div>
            </div>
          )}

          {step === 'review' && (
            <div>
              <SubSectionTitle style={{ fontSize: '14px', fontWeight: 600, marginBottom: '16px', color: 'var(--ak-text-primary)' }}>
                Gjennomgang
              </SubSectionTitle>

              {/* Result summary */}
              <div style={{
                backgroundColor: meetsRequirement ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                border: meetsRequirement ? '1px solid var(--ak-status-success)' : '1px solid var(--ak-status-error)',
                borderRadius: '12px',
                padding: '20px',
                textAlign: 'center',
                marginBottom: '20px',
              }}>
                <p style={{ fontSize: '12px', color: 'var(--ak-text-secondary)', marginBottom: '4px' }}>
                  Ditt resultat
                </p>
                <p style={{
                  fontSize: '32px',
                  fontWeight: 700,
                  color: meetsRequirement ? 'var(--ak-status-success)' : 'var(--ak-status-error)',
                  marginBottom: '8px',
                }}>
                  {result?.toFixed(test.unit === '' ? 2 : 0)}{test.unit}
                </p>
                <p style={{
                  fontSize: '14px',
                  fontWeight: 500,
                  color: meetsRequirement ? 'var(--ak-status-success)' : 'var(--ak-status-error)',
                }}>
                  {meetsRequirement ? 'Oppfylt' : `Under krav (${test.lowerIsBetter ? '≤' : '≥'}${requirement}${test.unit})`}
                </p>
              </div>

              {/* Attempts breakdown */}
              <div style={{ marginBottom: '16px' }}>
                <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--ak-text-secondary)', marginBottom: '8px' }}>
                  Alle forsøk
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {attempts.map((attempt, i) => (
                    <span
                      key={i}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: 'var(--ak-surface-subtle)',
                        borderRadius: '6px',
                        fontSize: '13px',
                        color: 'var(--ak-text-primary)',
                      }}
                    >
                      {attempt}{test.unit}
                    </span>
                  ))}
                </div>
              </div>

              {notes && (
                <div>
                  <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--ak-text-secondary)', marginBottom: '4px' }}>
                    Notater
                  </p>
                  <p style={{ fontSize: '13px', color: 'var(--ak-text-primary)' }}>
                    {notes}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 20px',
          borderTop: '1px solid var(--ak-border-subtle)',
          display: 'flex',
          gap: '12px',
        }}>
          {step === 'instructions' && (
            <Button
              variant="primary"
              onClick={() => setStep('recording')}
              leftIcon={<Play size={18} />}
              fullWidth
            >
              Start test
            </Button>
          )}

          {step === 'recording' && (
            <>
              <Button
                variant="secondary"
                onClick={() => setStep('instructions')}
                leftIcon={<ChevronLeft size={18} />}
              >
                Tilbake
              </Button>
              <Button
                variant="primary"
                onClick={() => setStep('review')}
                disabled={attempts.length === 0}
                rightIcon={<ChevronRight size={18} />}
                style={{ flex: 1 }}
              >
                Se resultat
              </Button>
            </>
          )}

          {step === 'review' && (
            <>
              <Button
                variant="secondary"
                onClick={() => setStep('recording')}
                leftIcon={<ChevronLeft size={18} />}
              >
                Rediger
              </Button>
              <Button
                variant="primary"
                onClick={handleSubmit}
                disabled={isSubmitting}
                loading={isSubmitting}
                leftIcon={<Check size={18} />}
                style={{ flex: 1, backgroundColor: 'var(--success)' }}
              >
                {isSubmitting ? 'Lagrer...' : 'Lagre resultat'}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StartTestModal;
