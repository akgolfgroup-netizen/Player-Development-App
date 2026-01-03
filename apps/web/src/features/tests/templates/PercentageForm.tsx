/**
 * PercentageForm Component
 * Design System v3.0 - Premium Light
 *
 * MIGRATED TO PAGE ARCHITECTURE - Minimal inline styles (dynamic colors)
 */

import React, { useState, useMemo } from 'react';
import { ArrowLeft, Save, RotateCcw, Check, X, Target, Percent } from 'lucide-react';
import { SectionTitle, SubSectionTitle } from '../../../components/typography';
import Button from '../../../ui/primitives/Button';
import { TestDefinition, getScoreLevel } from '../config/testDefinitions';

// ============================================================================
// TYPES
// ============================================================================

interface PercentageFormProps {
  test: TestDefinition;
  player?: {
    id: string;
    name: string;
    category: string;
  };
  onSubmit?: (data: PercentageData) => Promise<void>;
  onClose: () => void;
}

interface PercentageData {
  testId: string;
  playerId?: string;
  attempts: ('success' | 'fail' | null)[];
  successCount: number;
  totalCount: number;
  percentage: number;
  timestamp: string;
}

// ============================================================================
// ATTEMPT BUTTON COMPONENT
// ============================================================================

interface AttemptButtonProps {
  index: number;
  value: 'success' | 'fail' | null;
  onChange: (value: 'success' | 'fail' | null) => void;
}

const AttemptButton: React.FC<AttemptButtonProps> = ({ index, value, onChange }) => {
  const handleClick = () => {
    if (value === null) {
      onChange('success');
    } else if (value === 'success') {
      onChange('fail');
    } else {
      onChange(null);
    }
  };

  const getStyles = () => {
    if (value === 'success') {
      return {
        backgroundColor: 'var(--ak-status-success)',
        borderColor: 'var(--ak-status-success)',
        color: 'var(--ak-surface-card)',
      };
    }
    if (value === 'fail') {
      return {
        backgroundColor: 'var(--ak-status-error)',
        borderColor: 'var(--ak-status-error)',
        color: 'var(--ak-surface-card)',
      };
    }
    return {
      backgroundColor: 'var(--ak-surface-card)',
      borderColor: 'var(--ak-border-default)',
      color: 'var(--ak-text-secondary)',
    };
  };

  const styles = getStyles();

  return (
    <button
      onClick={handleClick}
      style={{
        width: '48px',
        height: '48px',
        borderRadius: '12px',
        border: `2px solid ${styles.borderColor}`,
        backgroundColor: styles.backgroundColor,
        color: styles.color,
        fontSize: '14px',
        fontWeight: 600,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.15s ease',
      }}
    >
      {value === 'success' && <Check size={20} />}
      {value === 'fail' && <X size={20} />}
      {value === null && (index + 1)}
    </button>
  );
};

// ============================================================================
// QUICK ACTION BUTTONS
// ============================================================================

interface QuickActionsProps {
  onMarkAll: (value: 'success' | 'fail') => void;
  onReset: () => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ onMarkAll, onReset }) => (
  <div style={{
    display: 'flex',
    gap: '8px',
    marginBottom: '16px',
    flexWrap: 'wrap',
  }}>
    <button
      onClick={() => onMarkAll('success')}
      style={{
        padding: '8px 16px',
        borderRadius: '8px',
        border: `1px solid var(--ak-status-success)`,
        backgroundColor: `rgba(34, 197, 94, 0.06)`,
        color: 'var(--ak-status-success)',
        fontSize: '13px',
        fontWeight: 500,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
      }}
    >
      <Check size={14} />
      Marker alle treff
    </button>
    <button
      onClick={() => onMarkAll('fail')}
      style={{
        padding: '8px 16px',
        borderRadius: '8px',
        border: `1px solid var(--ak-status-error)`,
        backgroundColor: `rgba(239, 68, 68, 0.06)`,
        color: 'var(--ak-status-error)',
        fontSize: '13px',
        fontWeight: 500,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
      }}
    >
      <X size={14} />
      Marker alle bom
    </button>
    <button
      onClick={onReset}
      style={{
        padding: '8px 16px',
        borderRadius: '8px',
        border: `1px solid var(--ak-text-secondary)`,
        backgroundColor: 'var(--ak-surface-subtle)',
        color: 'var(--ak-text-secondary)',
        fontSize: '13px',
        fontWeight: 500,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
      }}
    >
      <RotateCcw size={14} />
      Nullstill
    </button>
  </div>
);

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const PercentageForm: React.FC<PercentageFormProps> = ({
  test,
  player,
  onSubmit,
  onClose,
}) => {
  const [attempts, setAttempts] = useState<('success' | 'fail' | null)[]>(
    Array(test.attempts).fill(null)
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate stats
  const stats = useMemo(() => {
    const completed = attempts.filter(v => v !== null);
    const successes = attempts.filter(v => v === 'success').length;
    const fails = attempts.filter(v => v === 'fail').length;
    const percentage = completed.length > 0
      ? (successes / completed.length) * 100
      : 0;

    return {
      completed: completed.length,
      successes,
      fails,
      percentage,
    };
  }, [attempts]);

  // Get score level for coloring
  const scoreLevel = useMemo(() => {
    if (stats.completed === 0) return null;
    return getScoreLevel(stats.percentage, test.scoring, test.lowerIsBetter);
  }, [stats.percentage, stats.completed, test.scoring, test.lowerIsBetter]);

  const handleAttemptChange = (index: number, value: 'success' | 'fail' | null) => {
    const newAttempts = [...attempts];
    newAttempts[index] = value;
    setAttempts(newAttempts);
  };

  const handleMarkAll = (value: 'success' | 'fail') => {
    setAttempts(Array(test.attempts).fill(value));
  };

  const handleReset = () => {
    setAttempts(Array(test.attempts).fill(null));
  };

  const handleSubmit = async () => {
    if (stats.completed === 0) return;

    setIsSubmitting(true);
    try {
      const data: PercentageData = {
        testId: test.id,
        playerId: player?.id,
        attempts,
        successCount: stats.successes,
        totalCount: stats.completed,
        percentage: stats.percentage,
        timestamp: new Date().toISOString(),
      };

      if (onSubmit) {
        await onSubmit(data);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit = stats.completed > 0;

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        marginBottom: '24px',
      }}>
        <button
          onClick={onClose}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            border: 'none',
            backgroundColor: 'var(--ak-surface-subtle)',
            cursor: 'pointer',
          }}
        >
          <ArrowLeft size={20} color={var(--ak-text-primary)} />
        </button>
        <div>
          <SectionTitle style={{ margin: 0, fontSize: '20px' }}>
            {test.name}
          </SectionTitle>
          <p style={{ margin: 0, fontSize: '14px', color: 'var(--ak-text-secondary)' }}>
            {player?.name || 'Registrer forsøk'}
          </p>
        </div>
      </div>

      {/* Instructions */}
      <div style={{
        backgroundColor: `rgba(26, 61, 46, 0.06)`,
        borderRadius: '10px',
        padding: '12px 16px',
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
      }}>
        <Target size={18} color={var(--ak-brand-primary)} />
        <p style={{ margin: 0, fontSize: '14px', color: 'var(--ak-text-primary)' }}>
          Trykk for å sykle: Tomt → <Check size={14} style={{ color: 'var(--ak-status-success)', verticalAlign: 'middle' }} /> Treff → <X size={14} style={{ color: 'var(--ak-status-error)', verticalAlign: 'middle' }} /> Bom → Tomt
        </p>
      </div>

      {/* Quick Actions */}
      <QuickActions
        onMarkAll={handleMarkAll}
        onReset={handleReset}
      />

      {/* Attempts Grid */}
      <div style={{
        backgroundColor: 'var(--ak-surface-card)',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '16px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
      }}>
        <SubSectionTitle style={{ margin: '0 0 16px 0', fontSize: '15px' }}>
          {test.attempts} forsøk
        </SubSectionTitle>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(48px, 1fr))',
          gap: '8px',
          maxWidth: '400px',
        }}>
          {attempts.map((value, index) => (
            <AttemptButton
              key={index}
              index={index}
              value={value}
              onChange={(v) => handleAttemptChange(index, v)}
            />
          ))}
        </div>
      </div>

      {/* Stats Summary */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '12px',
        marginBottom: '16px',
      }}>
        <div style={{
          backgroundColor: `rgba(34, 197, 94, 0.06)`,
          borderRadius: '10px',
          padding: '16px',
          textAlign: 'center',
        }}>
          <p style={{ margin: 0, fontSize: '13px', color: 'var(--ak-text-secondary)' }}>Treff</p>
          <p style={{
            margin: '4px 0 0 0',
            fontSize: '24px',
            fontWeight: 700,
            color: 'var(--ak-status-success)',
          }}>
            {stats.successes}
          </p>
        </div>
        <div style={{
          backgroundColor: `rgba(239, 68, 68, 0.06)`,
          borderRadius: '10px',
          padding: '16px',
          textAlign: 'center',
        }}>
          <p style={{ margin: 0, fontSize: '13px', color: 'var(--ak-text-secondary)' }}>Bom</p>
          <p style={{
            margin: '4px 0 0 0',
            fontSize: '24px',
            fontWeight: 700,
            color: 'var(--ak-status-error)',
          }}>
            {stats.fails}
          </p>
        </div>
        <div style={{
          backgroundColor: 'var(--ak-surface-subtle)',
          borderRadius: '10px',
          padding: '16px',
          textAlign: 'center',
        }}>
          <p style={{ margin: 0, fontSize: '13px', color: 'var(--ak-text-secondary)' }}>Gjenstår</p>
          <p style={{
            margin: '4px 0 0 0',
            fontSize: '24px',
            fontWeight: 700,
            color: 'var(--ak-text-primary)',
          }}>
            {test.attempts - stats.completed}
          </p>
        </div>
      </div>

      {/* Result Card */}
      <div style={{
        backgroundColor: scoreLevel ? `${scoreLevel.color}15` : 'var(--ak-surface-subtle)',
        borderRadius: '12px',
        padding: '24px',
        marginBottom: '24px',
        border: scoreLevel ? `2px solid ${scoreLevel.color}40` : `1px solid var(--ak-border-default)`,
        textAlign: 'center',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          marginBottom: '8px',
        }}>
          <Percent size={24} color={scoreLevel?.color || var(--ak-text-secondary)} />
          <span style={{
            fontSize: '40px',
            fontWeight: 700,
            color: scoreLevel?.color || var(--ak-text-primary),
          }}>
            {stats.completed > 0 ? stats.percentage.toFixed(0) : '—'}
          </span>
          <span style={{ fontSize: '20px', color: 'var(--ak-text-secondary)' }}>%</span>
        </div>

        {scoreLevel && (
          <span style={{
            display: 'inline-block',
            padding: '6px 16px',
            backgroundColor: `${scoreLevel.color}20`,
            borderRadius: '20px',
            fontSize: '14px',
            fontWeight: 600,
            color: scoreLevel.color,
          }}>
            {scoreLevel.label}
          </span>
        )}

        {stats.completed === 0 && (
          <p style={{ margin: 0, fontSize: '14px', color: 'var(--ak-text-secondary)' }}>
            Registrer forsøk for å se resultat
          </p>
        )}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '12px' }}>
        <Button
          variant="secondary"
          onClick={handleReset}
          leftIcon={<RotateCcw size={18} />}
          style={{ flex: 1 }}
        >
          Nullstill
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={!canSubmit || isSubmitting}
          leftIcon={<Save size={18} />}
          style={{ flex: 2 }}
        >
          {isSubmitting ? 'Lagrer...' : 'Lagre resultat'}
        </Button>
      </div>
    </div>
  );
};

export default PercentageForm;
