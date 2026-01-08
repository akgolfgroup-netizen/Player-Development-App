/**
 * OnboardingPageV2 - AK Golf Academy
 *
 * Single-page onboarding with all sections visible
 * Features: Scroll-based navigation, clean sections, immediate feedback
 */

import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ChevronDown } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { intakeAPI } from '../../services/api';

// ============================================================================
// TYPES
// ============================================================================

interface OnboardingData {
  userType?: 'player' | 'coach';
  goals: string[];
  currentLevel: {
    handicap: number;
    frequency: 'daily' | '2-3x-week' | 'weekly' | 'monthly';
    yearsPlaying: number;
  };
  focusAreas: string[];
  preferences: {
    trainingFrequency: number;
  };
}

const defaultData: OnboardingData = {
  goals: [],
  currentLevel: {
    handicap: 15,
    frequency: '2-3x-week',
    yearsPlaying: 5,
  },
  focusAreas: [],
  preferences: {
    trainingFrequency: 3,
  },
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function OnboardingPageV2() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [data, setData] = useState<OnboardingData>(defaultData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  const updateData = (updates: Partial<OnboardingData>) => {
    setData(prev => ({ ...prev, ...updates }));
  };

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleComplete = async () => {
    setIsSubmitting(true);

    try {
      if (user?.playerId) {
        const goalsRecord: Record<string, unknown> = {
          selected: data.goals,
          updatedAt: new Date().toISOString(),
        };

        const payload = {
          playerId: user.playerId,
          goals: {
            ...goalsRecord,
            userType: data.userType,
          },
          background: {
            currentLevel: data.currentLevel,
            focusAreas: data.focusAreas,
          },
          availability: data.preferences,
        };

        await intakeAPI.submit(payload);

        setShowConfetti(true);
        createConfetti();

        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      }
    } catch (error) {
      console.error('Onboarding error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const createConfetti = () => {
    const colors = ['#10456A', '#C9A227', '#1F7A5C', '#4A90E2'];
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div');
      confetti.style.cssText = `
        position: fixed;
        width: 10px;
        height: 10px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        left: ${Math.random() * 100}%;
        top: -10px;
        border-radius: 50%;
        animation: fall 3s ease-out forwards;
        animation-delay: ${Math.random() * 2}s;
        z-index: 9999;
      `;
      document.body.appendChild(confetti);
      setTimeout(() => confetti.remove(), 5000);
    }
  };

  const canSubmit = () => {
    return (
      data.userType &&
      data.goals.length > 0 &&
      data.currentLevel.handicap >= 0 &&
      data.focusAreas.length > 0
    );
  };

  // Options data
  const availableGoals = [
    { id: 'handicap', label: 'Senke handicap', icon: '📉' },
    { id: 'tournaments', label: 'Vinne turneringer', icon: '🏆' },
    { id: 'professional', label: 'Bli profesjonell', icon: '⭐' },
    { id: 'consistency', label: 'Forbedre konsistens', icon: '🎯' },
    { id: 'fun', label: 'Ha det gøy!', icon: '😊' },
  ];

  const focusOptions = [
    { id: 'putting', label: 'Putting', icon: '🏌️' },
    { id: 'driver', label: 'Driver', icon: '🎯' },
    { id: 'short-game', label: 'Nærspill', icon: '⛳' },
    { id: 'irons', label: 'Jernspill', icon: '🏌️‍♂️' },
    { id: 'mental', label: 'Mental trening', icon: '🧠' },
    { id: 'fitness', label: 'Fysisk trening', icon: '💪' },
  ];

  const frequencyOptions = [
    { value: 'daily', label: 'Daglig' },
    { value: '2-3x-week', label: '2-3 ganger/uke' },
    { value: 'weekly', label: 'Ukentlig' },
    { value: 'monthly', label: 'Månedlig' },
  ];

  const toggleGoal = (goalId: string) => {
    const newGoals = data.goals.includes(goalId)
      ? data.goals.filter(g => g !== goalId)
      : [...data.goals, goalId];
    updateData({ goals: newGoals });
  };

  const toggleFocus = (focusId: string) => {
    const newFocus = data.focusAreas.includes(focusId)
      ? data.focusAreas.filter(f => f !== focusId)
      : [...data.focusAreas, focusId];
    updateData({ focusAreas: newFocus });
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="min-h-screen bg-gradient-to-b from-ak-primary to-ak-primary/90">
      {/* Hero Section */}
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <div className="text-6xl mb-6">🏌️</div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Velkommen til<br />AK Golf Academy!
        </h1>
        <p className="text-xl text-white/80 mb-8 max-w-md">
          La oss bygge din personlige treningsplan sammen
        </p>
        <button
          onClick={scrollToForm}
          className="px-8 py-4 bg-ak-gold text-ak-primary font-semibold rounded-xl text-lg hover:bg-ak-gold/90 transition-all shadow-lg"
        >
          Kom i gang
        </button>
        <button
          onClick={scrollToForm}
          className="mt-12 text-white/60 hover:text-white transition-colors animate-bounce"
        >
          <ChevronDown size={32} />
        </button>
      </div>

      {/* Form Section */}
      <div ref={formRef} className="bg-ak-surface-base min-h-screen py-12 px-6">
        <div className="max-w-2xl mx-auto">

          {/* Section 1: User Type */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-ak-text-primary mb-2">
              1. Hvem er du?
            </h2>
            <p className="text-ak-text-secondary mb-6">Velg din rolle</p>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => updateData({ userType: 'player' })}
                className={`p-6 rounded-xl border-2 transition-all text-left ${
                  data.userType === 'player'
                    ? 'border-ak-primary bg-ak-primary/5'
                    : 'border-ak-border-default hover:border-ak-primary/50'
                }`}
              >
                <div className="text-3xl mb-3">👤</div>
                <h3 className="font-semibold text-ak-text-primary mb-1">Spiller</h3>
                <p className="text-sm text-ak-text-secondary">
                  Få personlig treningsplan og track fremgang
                </p>
              </button>

              <button
                onClick={() => updateData({ userType: 'coach' })}
                className={`p-6 rounded-xl border-2 transition-all text-left ${
                  data.userType === 'coach'
                    ? 'border-ak-primary bg-ak-primary/5'
                    : 'border-ak-border-default hover:border-ak-primary/50'
                }`}
              >
                <div className="text-3xl mb-3">🎓</div>
                <h3 className="font-semibold text-ak-text-primary mb-1">Coach</h3>
                <p className="text-sm text-ak-text-secondary">
                  Håndter spillere og lag treningsprogram
                </p>
              </button>
            </div>
          </section>

          {/* Section 2: Goals */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-ak-text-primary mb-2">
              2. Hva er dine mål?
            </h2>
            <p className="text-ak-text-secondary mb-6">Velg ett eller flere</p>

            <div className="flex flex-wrap gap-3">
              {availableGoals.map(goal => (
                <button
                  key={goal.id}
                  onClick={() => toggleGoal(goal.id)}
                  className={`px-4 py-2.5 rounded-full border-2 font-medium transition-all ${
                    data.goals.includes(goal.id)
                      ? 'border-ak-primary bg-ak-primary text-white'
                      : 'border-ak-border-default text-ak-text-primary hover:border-ak-primary/50'
                  }`}
                >
                  {goal.icon} {goal.label}
                </button>
              ))}
            </div>
          </section>

          {/* Section 3: Current Level */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-ak-text-primary mb-2">
              3. Ditt nåværende nivå
            </h2>
            <p className="text-ak-text-secondary mb-6">Fortell oss om din erfaring</p>

            <div className="space-y-6">
              {/* Handicap */}
              <div>
                <label className="block text-sm font-medium text-ak-text-primary mb-2">
                  Handicap
                </label>
                <input
                  type="number"
                  value={data.currentLevel.handicap}
                  onChange={(e) => updateData({
                    currentLevel: { ...data.currentLevel, handicap: parseFloat(e.target.value) || 0 }
                  })}
                  min="0"
                  max="54"
                  step="0.1"
                  className="w-full px-4 py-3 border border-ak-border-default rounded-xl text-ak-text-primary focus:outline-none focus:ring-2 focus:ring-ak-primary/20 focus:border-ak-primary"
                />
              </div>

              {/* Years Playing */}
              <div>
                <label className="block text-sm font-medium text-ak-text-primary mb-2">
                  År med golf
                </label>
                <input
                  type="number"
                  value={data.currentLevel.yearsPlaying}
                  onChange={(e) => updateData({
                    currentLevel: { ...data.currentLevel, yearsPlaying: parseInt(e.target.value) || 0 }
                  })}
                  min="0"
                  max="50"
                  className="w-full px-4 py-3 border border-ak-border-default rounded-xl text-ak-text-primary focus:outline-none focus:ring-2 focus:ring-ak-primary/20 focus:border-ak-primary"
                />
              </div>

              {/* Frequency */}
              <div>
                <label className="block text-sm font-medium text-ak-text-primary mb-2">
                  Hvor ofte spiller du?
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {frequencyOptions.map(freq => (
                    <button
                      key={freq.value}
                      onClick={() => updateData({
                        currentLevel: { ...data.currentLevel, frequency: freq.value as any }
                      })}
                      className={`px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                        data.currentLevel.frequency === freq.value
                          ? 'border-ak-primary bg-ak-primary text-white'
                          : 'border-ak-border-default text-ak-text-primary hover:border-ak-primary/50'
                      }`}
                    >
                      {freq.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Section 4: Focus Areas */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-ak-text-primary mb-2">
              4. Fokusområder
            </h2>
            <p className="text-ak-text-secondary mb-6">Hva vil du jobbe mest med?</p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {focusOptions.map(option => (
                <button
                  key={option.id}
                  onClick={() => toggleFocus(option.id)}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    data.focusAreas.includes(option.id)
                      ? 'border-ak-primary bg-ak-primary/5'
                      : 'border-ak-border-default hover:border-ak-primary/50'
                  }`}
                >
                  <div className="text-2xl mb-2">{option.icon}</div>
                  <span className="font-medium text-ak-text-primary">{option.label}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Section 5: Training Frequency */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-ak-text-primary mb-2">
              5. Treningsfrekvens
            </h2>
            <p className="text-ak-text-secondary mb-6">Hvor mange økter per uke?</p>

            <div className="flex items-center gap-4">
              <input
                type="range"
                min="1"
                max="7"
                value={data.preferences.trainingFrequency}
                onChange={(e) => updateData({
                  preferences: { ...data.preferences, trainingFrequency: parseInt(e.target.value) }
                })}
                className="flex-1 h-2 bg-ak-surface-muted rounded-lg appearance-none cursor-pointer accent-ak-primary"
              />
              <div className="w-16 h-16 rounded-xl bg-ak-primary flex items-center justify-center">
                <span className="text-2xl font-bold text-white">
                  {data.preferences.trainingFrequency}
                </span>
              </div>
            </div>
            <p className="text-sm text-ak-text-tertiary mt-2">
              Vi anbefaler 3-5 økter per uke for best fremgang
            </p>
          </section>

          {/* Summary */}
          <section className="mb-8 p-6 bg-ak-primary/5 rounded-2xl border border-ak-primary/20">
            <h3 className="font-semibold text-ak-text-primary mb-4">
              Din plan vil inneholde:
            </h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-ak-text-primary">
                <CheckCircle size={18} className="text-ak-status-success" />
                <span>12 ukers personlig treningsplan</span>
              </div>
              <div className="flex items-center gap-2 text-ak-text-primary">
                <CheckCircle size={18} className="text-ak-status-success" />
                <span>{data.preferences.trainingFrequency}x ukentlige økter</span>
              </div>
              <div className="flex items-center gap-2 text-ak-text-primary">
                <CheckCircle size={18} className="text-ak-status-success" />
                <span>
                  Fokus på {data.focusAreas.length > 0
                    ? data.focusAreas.map(f => focusOptions.find(o => o.id === f)?.label).join(', ')
                    : 'dine valgte områder'}
                </span>
              </div>
            </div>
          </section>

          {/* Submit Button */}
          <button
            onClick={handleComplete}
            disabled={!canSubmit() || isSubmitting}
            className="w-full py-4 bg-ak-primary text-white font-semibold rounded-xl text-lg hover:bg-ak-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Lagrer...
              </>
            ) : (
              <>
                <CheckCircle size={20} />
                Fullfør registrering
              </>
            )}
          </button>

          {!canSubmit() && (
            <p className="text-center text-sm text-ak-text-tertiary mt-4">
              Fyll ut alle feltene for å fortsette
            </p>
          )}
        </div>
      </div>

      {/* Completion celebration overlay */}
      {showConfetti && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-3xl font-bold text-white mb-2">Gratulerer!</h1>
            <p className="text-white/80 mb-4">
              Din personlige treningsplan er klar!
            </p>
            <p className="text-white/60 text-sm">
              Sender deg til dashboardet...
            </p>
          </div>
        </div>
      )}

      {/* CSS for confetti animation */}
      <style>{`
        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
