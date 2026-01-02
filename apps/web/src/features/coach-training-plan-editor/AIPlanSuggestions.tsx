/**
 * AK Golf Academy - AI Plan Suggestions Component
 *
 * Provides AI-generated training plan suggestions for coaches.
 * Uses the AI service to analyze player data and generate recommendations.
 */

import React, { useState, useCallback } from 'react';
import { Sparkles, Target, Calendar, TrendingUp, Loader2, AlertCircle, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';
import { getPlanSuggestions, PlanSuggestionResponse } from '../../services/aiService';

interface Props {
  playerId: string;
  playerName?: string;
  onApplySuggestion?: (suggestion: SuggestionToApply) => void;
}

export interface SuggestionToApply {
  type: 'session';
  name: string;
  description: string;
  durationMinutes: number;
}

const PRIORITY_COLORS = {
  high: { bg: 'rgba(239, 68, 68, 0.1)', text: 'var(--error)', border: 'var(--error)' },
  medium: { bg: 'rgba(245, 158, 11, 0.1)', text: 'var(--warning)', border: 'var(--warning)' },
  low: { bg: 'rgba(34, 197, 94, 0.1)', text: 'var(--success)', border: 'var(--success)' },
};

export default function AIPlanSuggestions({ playerId, playerName = 'Spiller', onApplySuggestion }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<PlanSuggestionResponse | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    focus: true,
    structure: true,
    periodization: false,
  });

  // Form state
  const [weeklyHours, setWeeklyHours] = useState('');
  const [goalDescription, setGoalDescription] = useState('');

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const fetchSuggestions = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getPlanSuggestions({
        playerId,
        weeklyHoursTarget: weeklyHours ? parseFloat(weeklyHours) : undefined,
        goalDescription: goalDescription.trim() || undefined,
      });
      setSuggestions(response);
    } catch (err) {
      console.error('Failed to get AI suggestions:', err);
      setError('Kunne ikke hente AI-forslag. Prøv igjen senere.');
    } finally {
      setIsLoading(false);
    }
  }, [playerId, weeklyHours, goalDescription]);

  const handleApplySession = (session: { type: string; frequency: string; duration: string }) => {
    if (!onApplySuggestion) return;

    const durationMatch = session.duration.match(/(\d+)/);
    const durationMinutes = durationMatch ? parseInt(durationMatch[1], 10) : 60;

    onApplySuggestion({
      type: 'session',
      name: session.type,
      description: `${session.frequency}. AI-anbefalt økt.`,
      durationMinutes,
    });
  };

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-primary)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-card)',
        overflow: 'hidden',
        border: '1px solid rgba(var(--accent-rgb), 0.2)',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '20px',
          borderBottom: '1px solid var(--border-default)',
          background: 'linear-gradient(135deg, rgba(var(--accent-rgb), 0.05) 0%, rgba(var(--accent-rgb), 0.02) 100%)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(var(--accent-rgb), 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Sparkles size={20} color="var(--accent)" />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 600, color: 'var(--text-primary)' }}>
              AI Treningsassistent
            </h3>
            <p style={{ margin: 0, marginTop: '2px', fontSize: '13px', color: 'var(--text-secondary)' }}>
              Få personlige anbefalinger for {playerName}
            </p>
          </div>
        </div>
      </div>

      {/* Input Form */}
      <div style={{ padding: '20px', borderBottom: '1px solid var(--border-default)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
              Timer per uke (valgfritt)
            </label>
            <input
              type="number"
              value={weeklyHours}
              onChange={(e) => setWeeklyHours(e.target.value)}
              placeholder="F.eks. 10"
              min="1"
              max="40"
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-default)',
                fontSize: '14px',
                color: 'var(--text-primary)',
                boxSizing: 'border-box',
              }}
            />
          </div>
          <div>
            <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
              Mål (valgfritt)
            </label>
            <input
              type="text"
              value={goalDescription}
              onChange={(e) => setGoalDescription(e.target.value)}
              placeholder="F.eks. Forbedre putting"
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-default)',
                fontSize: '14px',
                color: 'var(--text-primary)',
                boxSizing: 'border-box',
              }}
            />
          </div>
        </div>

        <button
          onClick={fetchSuggestions}
          disabled={isLoading}
          style={{
            marginTop: '16px',
            width: '100%',
            padding: '12px',
            borderRadius: 'var(--radius-md)',
            border: 'none',
            backgroundColor: isLoading ? 'var(--border-default)' : 'var(--accent)',
            color: isLoading ? 'var(--text-secondary)' : 'var(--bg-primary)',
            fontSize: '14px',
            fontWeight: 600,
            cursor: isLoading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          {isLoading ? (
            <>
              <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
              Analyserer spillerdata...
            </>
          ) : (
            <>
              <Sparkles size={16} />
              Generer AI-forslag
            </>
          )}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div
          style={{
            margin: '16px 20px',
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid var(--error)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <AlertCircle size={16} color="var(--error)" />
          <span style={{ fontSize: '14px', color: 'var(--error)' }}>{error}</span>
        </div>
      )}

      {/* Results */}
      {suggestions && (
        <div style={{ padding: '0 20px 20px' }}>
          {/* Summary */}
          <div
            style={{
              padding: '16px',
              marginTop: '16px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-default)',
            }}
          >
            <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.6', color: 'var(--text-primary)' }}>
              {suggestions.summary}
            </p>
          </div>

          {/* Focus Areas */}
          <div style={{ marginTop: '20px' }}>
            <button
              onClick={() => toggleSection('focus')}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 0',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Target size={18} color="var(--accent)" />
                <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Fokusområder ({suggestions.suggestedFocus.length})
                </span>
              </div>
              {expandedSections.focus ? <ChevronUp size={18} color="var(--text-secondary)" /> : <ChevronDown size={18} color="var(--text-secondary)" />}
            </button>

            {expandedSections.focus && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {suggestions.suggestedFocus.map((focus, index) => (
                  <div
                    key={index}
                    style={{
                      padding: '14px 16px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: PRIORITY_COLORS[focus.priority].bg,
                      borderLeft: `3px solid ${PRIORITY_COLORS[focus.priority].border}`,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {focus.area}
                      </span>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          color: PRIORITY_COLORS[focus.priority].text,
                        }}
                      >
                        {focus.priority === 'high' ? 'Høy' : focus.priority === 'medium' ? 'Medium' : 'Lav'} prioritet
                      </span>
                    </div>
                    <p style={{ margin: '8px 0 0', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                      {focus.reason}
                    </p>
                    <div style={{ marginTop: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                      Anbefalt: {focus.suggestedHoursPerWeek} timer/uke
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Weekly Structure */}
          <div style={{ marginTop: '16px' }}>
            <button
              onClick={() => toggleSection('structure')}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 0',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={18} color="var(--accent)" />
                <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Ukestruktur ({suggestions.weeklyStructure.recommendedDays} dager/uke)
                </span>
              </div>
              {expandedSections.structure ? <ChevronUp size={18} color="var(--text-secondary)" /> : <ChevronDown size={18} color="var(--text-secondary)" />}
            </button>

            {expandedSections.structure && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {suggestions.weeklyStructure.sessionTypes.map((session, index) => (
                  <div
                    key={index}
                    style={{
                      padding: '12px 16px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--bg-secondary)',
                      border: '1px solid var(--border-default)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)' }}>
                        {session.type}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                        {session.frequency} • {session.duration}
                      </div>
                    </div>
                    {onApplySuggestion && (
                      <button
                        onClick={() => handleApplySession(session)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--accent)',
                          backgroundColor: 'transparent',
                          color: 'var(--accent)',
                          fontSize: '12px',
                          fontWeight: 500,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <CheckCircle2 size={12} />
                        Legg til
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Periodization */}
          <div style={{ marginTop: '16px' }}>
            <button
              onClick={() => toggleSection('periodization')}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 0',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <TrendingUp size={18} color="var(--accent)" />
                <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Periodisering
                </span>
              </div>
              {expandedSections.periodization ? <ChevronUp size={18} color="var(--text-secondary)" /> : <ChevronDown size={18} color="var(--text-secondary)" />}
            </button>

            {expandedSections.periodization && (
              <div
                style={{
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-default)',
                }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--accent)' }}>
                      {suggestions.periodization.baseWeeks}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Base uker</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--warning)' }}>
                      {suggestions.periodization.buildWeeks}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Build uker</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--success)' }}>
                      {suggestions.periodization.peakWeeks}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Peak uker</div>
                  </div>
                </div>
                <p style={{ margin: 0, fontSize: '13px', lineHeight: '1.5', color: 'var(--text-secondary)' }}>
                  {suggestions.periodization.rationale}
                </p>
              </div>
            )}
          </div>

          {/* Tools Used */}
          {suggestions.toolsUsed.length > 0 && (
            <div
              style={{
                marginTop: '20px',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(var(--accent-rgb), 0.05)',
                fontSize: '12px',
                color: 'var(--text-secondary)',
              }}
            >
              <strong>Data brukt:</strong> {suggestions.toolsUsed.join(', ')}
            </div>
          )}
        </div>
      )}

      {/* Animation keyframes */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
