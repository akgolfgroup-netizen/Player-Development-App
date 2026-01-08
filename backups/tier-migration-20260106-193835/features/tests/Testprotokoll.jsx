/**
 * Testprotokoll Component
 * Design System v3.0 - Premium Light
 *
 * REDESIGNED - Clean, consistent layout with proper visual hierarchy
 */

import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { SectionTitle, SubSectionTitle } from '../../components/typography';
import Button from '../../ui/primitives/Button';
import StartTestModal from './StartTestModal';
import TestRegistrationForm from './TestRegistrationForm';
import apiClient from '../../services/apiClient';
import {
  Zap, Ruler, Target, Flag, Circle, Dumbbell, Activity,
  FlagTriangleRight, Brain, ChevronRight, CheckCircle,
  AlertCircle, Clock, TrendingUp, Calendar, Search, Plus
} from 'lucide-react';
import { testDefinitions } from './config/testDefinitions';

// ============================================================================
// CATEGORY CONFIGURATION
// ============================================================================

const CATEGORY_CONFIG = {
  speed: {
    label: 'Hastighet',
    icon: Zap,
    color: 'rgb(16, 69, 106)',      // primary blue
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
  },
  distance: {
    label: 'Avstand',
    icon: Ruler,
    color: 'rgb(14, 116, 144)',     // teal
    bgColor: 'bg-teal-50',
    borderColor: 'border-teal-200',
  },
  accuracy: {
    label: 'Presisjon',
    icon: Target,
    color: 'rgb(124, 58, 237)',     // purple
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
  },
  short_game: {
    label: 'Nærspill',
    icon: Flag,
    color: 'rgb(31, 122, 92)',      // emerald
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
  },
  putting: {
    label: 'Putting',
    icon: Circle,
    color: 'rgb(37, 99, 235)',      // blue
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
  },
  physical: {
    label: 'Fysisk',
    icon: Dumbbell,
    color: 'rgb(220, 38, 38)',      // red
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
  },
  scoring: {
    label: 'Scoring',
    icon: FlagTriangleRight,
    color: 'rgb(158, 124, 47)',     // gold
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
  },
  mental: {
    label: 'Mental',
    icon: Brain,
    color: 'rgb(79, 70, 229)',      // indigo
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
  },
};

// Group tests by category in display order
const CATEGORY_ORDER = ['speed', 'distance', 'accuracy', 'short_game', 'putting', 'physical', 'scoring', 'mental'];

// ============================================================================
// UI COMPONENTS
// ============================================================================

const StatCard = ({ label, value, subValue, variant = 'default', icon: Icon }) => {
  const variants = {
    default: 'bg-white border-ak-border-default',
    success: 'bg-emerald-50 border-emerald-200',
    warning: 'bg-amber-50 border-amber-200',
    error: 'bg-red-50 border-red-200',
  };

  const textVariants = {
    default: 'text-ak-text-primary',
    success: 'text-emerald-700',
    warning: 'text-amber-700',
    error: 'text-red-700',
  };

  return (
    <div className={`rounded-xl border p-5 ${variants[variant]}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium uppercase tracking-wider text-ak-text-tertiary">
          {label}
        </span>
        {Icon && <Icon size={18} className="text-ak-text-tertiary" />}
      </div>
      <p className={`text-3xl font-bold ${textVariants[variant]}`}>
        {value}
      </p>
      {subValue && (
        <p className="text-sm text-ak-text-secondary mt-1">{subValue}</p>
      )}
    </div>
  );
};

const TestCard = ({ test, playerCategory = 'B', result = null }) => {
  const config = CATEGORY_CONFIG[test.category] || CATEGORY_CONFIG.speed;
  const CategoryIcon = config.icon;

  // Determine status based on result
  const getStatus = () => {
    if (!result || result.currentResult === null || result.currentResult === undefined) {
      return { type: 'pending', label: 'Ikke testet', color: 'text-ak-text-tertiary', bgColor: 'bg-ak-surface-subtle' };
    }
    // For now, simplified status - could be enhanced with actual requirement checking
    return { type: 'completed', label: 'Fullført', color: 'text-emerald-600', bgColor: 'bg-emerald-50' };
  };

  const status = getStatus();

  return (
    <Link
      to={`/testing/${test.id}`}
      className="block group"
    >
      <div className="bg-white rounded-xl border border-ak-border-default p-4 transition-all duration-200 hover:shadow-md hover:border-ak-primary/40 group-hover:bg-ak-surface-subtle/30">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `${config.color}15` }}
          >
            <CategoryIcon size={22} style={{ color: config.color }} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="font-semibold text-ak-text-primary text-[15px] truncate group-hover:text-ak-primary transition-colors">
                  {test.shortName}
                </h3>
                <p className="text-xs text-ak-text-tertiary mt-0.5">
                  Test {test.testNumber} · {test.duration}
                </p>
              </div>

              {/* Status Badge */}
              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-medium ${status.bgColor} ${status.color}`}>
                {status.type === 'completed' ? (
                  <CheckCircle size={12} />
                ) : (
                  <Clock size={12} />
                )}
                {status.label}
              </span>
            </div>

            {/* Result Preview (if available) */}
            {result && result.currentResult !== null && (
              <div className="mt-3 pt-3 border-t border-ak-border-subtle">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-ak-text-secondary">Siste resultat:</span>
                  <span className="font-semibold text-ak-text-primary">
                    {result.currentResult}{test.unit}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Arrow */}
          <ChevronRight size={18} className="text-ak-text-tertiary group-hover:text-ak-primary transition-colors flex-shrink-0 mt-1" />
        </div>
      </div>
    </Link>
  );
};

const CategorySection = ({ category, tests, playerCategory, results }) => {
  const config = CATEGORY_CONFIG[category];
  if (!config) return null;

  const CategoryIcon = config.icon;

  return (
    <div className="mb-8">
      {/* Category Header */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${config.color}15` }}
        >
          <CategoryIcon size={18} style={{ color: config.color }} />
        </div>
        <h2 className="text-lg font-semibold text-ak-text-primary">
          {config.label}
        </h2>
        <span className="text-sm text-ak-text-tertiary">
          ({tests.length} {tests.length === 1 ? 'test' : 'tester'})
        </span>
      </div>

      {/* Test Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tests.map(test => (
          <TestCard
            key={test.id}
            test={test}
            playerCategory={playerCategory}
            result={results?.find(r => r.id === test.testNumber || r.id === test.id)}
          />
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const AKGolfTestprotokoll = ({ player: apiPlayer = null, tests: apiTests = null, onRefresh = null }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [testModalOpen, setTestModalOpen] = useState(false);
  const [testToStart, setTestToStart] = useState(null);
  const [showNewTestModal, setShowNewTestModal] = useState(false);
  const [selectedTestForRegistration, setSelectedTestForRegistration] = useState(null);

  // Default player profile
  const player = apiPlayer ? {
    name: `${apiPlayer.firstName || ''} ${apiPlayer.lastName || ''}`.trim() || 'Spiller',
    category: apiPlayer.category || 'B',
    age: apiPlayer.age || (apiPlayer.birthDate
      ? Math.floor((Date.now() - new Date(apiPlayer.birthDate).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
      : null),
  } : {
    name: 'Ola Nordmann',
    category: 'B',
    age: 17,
  };

  // Get initials for avatar
  const initials = player.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'AK';

  // Group tests by category
  const testsByCategory = useMemo(() => {
    const grouped = {};
    CATEGORY_ORDER.forEach(cat => {
      const categoryTests = testDefinitions.filter(t => t.category === cat);
      if (categoryTests.length > 0) {
        grouped[cat] = categoryTests;
      }
    });
    return grouped;
  }, []);

  // Filter tests by search
  const filteredTestsByCategory = useMemo(() => {
    if (!searchQuery.trim()) return testsByCategory;

    const query = searchQuery.toLowerCase();
    const filtered = {};

    Object.entries(testsByCategory).forEach(([cat, tests]) => {
      const matchingTests = tests.filter(t =>
        t.name.toLowerCase().includes(query) ||
        t.shortName.toLowerCase().includes(query) ||
        t.description.toLowerCase().includes(query)
      );
      if (matchingTests.length > 0) {
        filtered[cat] = matchingTests;
      }
    });

    return filtered;
  }, [testsByCategory, searchQuery]);

  // Calculate stats
  const stats = useMemo(() => {
    // For now, use mock stats - could be enhanced with actual API data
    const totalTests = testDefinitions.length;
    const completedTests = apiTests?.filter(t => t.currentResult !== null && t.currentResult !== undefined).length || 0;
    const passedTests = 0; // Would need actual requirement checking
    const improvedTests = 0; // Would need historical comparison

    return {
      total: totalTests,
      completed: completedTests,
      passed: passedTests,
      improved: improvedTests,
      focusAreas: totalTests - passedTests,
    };
  }, [apiTests]);

  // Handle test submission
  const handleSubmitTestResult = async (resultData) => {
    try {
      await apiClient.post('/tests/results', {
        testId: resultData.testId,
        playerId: apiPlayer?.id,
        testDate: resultData.testDate,
        value: resultData.value,
        results: resultData.results,
        passed: resultData.passed,
      });

      if (onRefresh) {
        await onRefresh();
      }
    } catch (error) {
      console.error('Error submitting test result:', error);
      throw error;
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="mb-8">
        {/* Player Info & Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
          {/* Player Card */}
          <div className="bg-white rounded-xl border border-ak-border-default p-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-ak-primary flex items-center justify-center text-white font-semibold text-lg">
                {initials}
              </div>
              <div>
                <h1 className="font-semibold text-ak-text-primary text-lg">{player.name}</h1>
                <p className="text-sm text-ak-text-secondary">
                  Kategori {player.category} · {player.age} år
                </p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-ak-border-subtle text-sm text-ak-text-secondary">
              <div className="flex items-center gap-2 mb-1">
                <Calendar size={14} />
                <span>Neste benchmark: <span className="font-medium text-ak-text-primary">Uke 50</span></span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} />
                <span>Sist testet: <span className="font-medium text-ak-text-primary">1. des 2025</span></span>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <StatCard
            label="Bestått"
            value={`${stats.passed}/${stats.total}`}
            subValue="tester oppfylt"
            variant="success"
            icon={CheckCircle}
          />

          <StatCard
            label="Forbedret"
            value={stats.improved}
            subValue={`av ${stats.total} tester`}
            variant="default"
            icon={TrendingUp}
          />

          <StatCard
            label="Fokusområder"
            value={stats.focusAreas}
            subValue="under krav"
            variant="error"
            icon={AlertCircle}
          />
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-ak-text-tertiary" />
          <input
            type="text"
            placeholder="Søk i tester..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-ak-border-default bg-white text-ak-text-primary placeholder:text-ak-text-tertiary focus:outline-none focus:ring-2 focus:ring-ak-primary/20 focus:border-ak-primary transition-all"
          />
        </div>
      </div>

      {/* Section Title */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <SectionTitle className="text-xl font-bold text-ak-text-primary">
            Alle {testDefinitions.length} Tester
          </SectionTitle>
          <p className="text-sm text-ak-text-secondary mt-1">
            Velg en test for å se detaljer og registrere resultater
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => setShowNewTestModal(true)}
          leftIcon={<Plus size={16} />}
        >
          Ny test
        </Button>
      </div>

      {/* Test Categories */}
      {Object.entries(filteredTestsByCategory).map(([category, tests]) => (
        <CategorySection
          key={category}
          category={category}
          tests={tests}
          playerCategory={player.category}
          results={apiTests}
        />
      ))}

      {/* Empty State */}
      {Object.keys(filteredTestsByCategory).length === 0 && searchQuery && (
        <div className="text-center py-12 bg-ak-surface-subtle rounded-xl">
          <Search size={48} className="mx-auto mb-4 text-ak-text-tertiary" />
          <h3 className="font-semibold text-ak-text-primary mb-2">Ingen tester funnet</h3>
          <p className="text-ak-text-secondary">
            Prøv et annet søkeord eller fjern filteret
          </p>
        </div>
      )}

      {/* Info Card */}
      <div className="mt-8 bg-ak-primary/5 border border-ak-primary/20 rounded-xl p-5">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-ak-primary/10 flex items-center justify-center flex-shrink-0">
            <Activity size={20} className="text-ak-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-ak-text-primary mb-1">Om testprotokollen</h3>
            <p className="text-sm text-ak-text-secondary leading-relaxed">
              Testprotokollen inneholder 20 offisielle tester basert på Team Norway standarder.
              Benchmark gjennomføres hver 3. uke (uke 3, 6, 9, 12, osv.). For kategori {player.category} kreves
              at minimum 4 av 7 golf-tester er bestått for opprykk.
            </p>
          </div>
        </div>
      </div>

      {/* Start Test Modal */}
      {testModalOpen && testToStart && (
        <StartTestModal
          test={testToStart}
          player={player}
          onClose={() => {
            setTestModalOpen(false);
            setTestToStart(null);
          }}
          onSubmit={handleSubmitTestResult}
        />
      )}

      {/* New Test Picker Modal */}
      {showNewTestModal && !selectedTestForRegistration && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-ak-border-subtle">
              <h2 className="text-lg font-semibold text-ak-text-primary">Velg test å registrere</h2>
              <button
                onClick={() => setShowNewTestModal(false)}
                className="p-2 hover:bg-ak-surface-muted rounded-lg transition-colors"
              >
                <AlertCircle size={20} className="text-ak-text-secondary rotate-45" />
              </button>
            </div>

            {/* Test List */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {testDefinitions.map(test => {
                  const config = CATEGORY_CONFIG[test.category] || CATEGORY_CONFIG.speed;
                  const CategoryIcon = config.icon;

                  return (
                    <button
                      key={test.id}
                      onClick={() => {
                        setSelectedTestForRegistration({
                          id: test.id,
                          navn: test.name,
                          beskrivelse: test.description,
                          maling: test.unit,
                          registrering: test.formType,
                          slag: Array.from({ length: test.attempts || 6 }, (_, i) => ({
                            nr: i + 1,
                            slagType: test.shortName,
                            målLengde: 0,
                            resultatLengde: null,
                            poeng: null,
                          })),
                        });
                      }}
                      className="flex items-center gap-3 p-4 rounded-xl border border-ak-border-default hover:border-ak-primary/40 hover:bg-ak-surface-subtle/50 transition-all text-left group"
                    >
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${config.color}15` }}
                      >
                        <CategoryIcon size={20} style={{ color: config.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-ak-text-primary text-sm group-hover:text-ak-primary transition-colors">
                          {test.shortName}
                        </h3>
                        <p className="text-xs text-ak-text-tertiary truncate">
                          {config.label} · {test.attempts || 6} forsøk
                        </p>
                      </div>
                      <ChevronRight size={16} className="text-ak-text-tertiary group-hover:text-ak-primary transition-colors" />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Test Registration Form */}
      {selectedTestForRegistration && (
        <TestRegistrationForm
          test={selectedTestForRegistration}
          playerId={apiPlayer?.id}
          kategori={CATEGORY_CONFIG[testDefinitions.find(t => t.id === selectedTestForRegistration.id)?.category]?.label?.toLowerCase() || 'presisjon'}
          onSubmit={async (result) => {
            await handleSubmitTestResult({
              testId: result.testId,
              value: result.totalPoeng,
              results: { slag: result.slag },
              testDate: result.dato?.toISOString() || new Date().toISOString(),
              passed: true,
            });
            if (onRefresh) await onRefresh();
          }}
          onClose={() => {
            setSelectedTestForRegistration(null);
            setShowNewTestModal(false);
          }}
        />
      )}
    </div>
  );
};

export default AKGolfTestprotokoll;
