import React, { useState } from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import StartTestModal from './StartTestModal';
import apiClient from '../../services/apiClient';
import {
  HomeIcon, CalendarIcon, GolfScorecard, ChartIcon, ProfileIcon
} from '../../components/icons';

// ===== ICONS =====
const Icons = {
  Check: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
      <polyline points="20,6 9,17 4,12"/>
    </svg>
  ),
  TrendingUp: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="23,6 13.5,15.5 8.5,10.5 1,18"/>
      <polyline points="17,6 23,6 23,12"/>
    </svg>
  ),
  TrendingDown: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="23,18 13.5,8.5 8.5,13.5 1,6"/>
      <polyline points="17,18 23,18 23,12"/>
    </svg>
  ),
  Minus: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  ),
  Info: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="16" x2="12" y2="12"/>
      <line x1="12" y1="8" x2="12.01" y2="8"/>
    </svg>
  ),
  Calendar: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  Play: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <polygon points="5,3 19,12 5,21"/>
    </svg>
  ),
};

// ===== UI COMPONENTS =====
const Card = ({ children, className = '', padding = true }) => (
  <div className={`bg-white border border-ak-mist rounded-xl ${padding ? 'p-4' : ''} ${className}`}
       style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
    {children}
  </div>
);

const Badge = ({ children, variant = 'neutral', size = 'sm' }) => {
  const variants = {
    neutral: 'bg-gray-100 text-gray-600',
    accent: 'bg-blue-50 text-blue-700',
    success: 'bg-green-50 text-green-700',
    warning: 'bg-amber-50 text-amber-700',
    error: 'bg-red-50 text-red-700',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[11px]',
    md: 'px-2.5 py-1 text-[13px]',
  };

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${variants[variant]} ${sizes[size]}`}>
      {children}
    </span>
  );
};

const Avatar = ({ name, size = 40 }) => {
  const initials = name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'AK';
  return (
    <div
      className="rounded-full flex items-center justify-center font-medium text-white"
      style={{
        width: size,
        height: size,
        backgroundColor: 'var(--accent)',
        fontSize: size * 0.4
      }}
    >
      {initials}
    </div>
  );
};

const ProgressBar = ({ value, max, color = 'var(--ak-primary)' }) => {
  const percentage = Math.min((value / max) * 100, 100);
  return (
    <div className="h-2 bg-ak-mist rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${percentage}%`, backgroundColor: color }}
      />
    </div>
  );
};

// ===== HELPER FUNCTIONS =====
const getCategoryIcon = (category) => {
  const icons = {
    speed: '⚡',
    distance: '🏌️',
    accuracy: '🎯',
    short_game: '⛳',
    putting: '🕳️',
    physical: '💪',
    mental: '🧠',
    scoring: '📊',
    golf: '🏌️',
    teknikk: '⚙️',
    fysisk: '💪',
    strategisk: '🎲',
  };
  return icons[category] || '📋';
};

const getTestUnit = (testType, category) => {
  if (testType === 'speed_measurement') return 'mph';
  if (testType === 'distance_measurement') return 'm';
  if (testType === 'putting_test') return '%';
  if (testType === 'accuracy_measurement') return category === 'accuracy' ? '' : '%';
  if (testType === 'mobility_test') return '°';
  if (testType === 'physical_test') return '';
  return '';
};

const isLowerBetter = (testType, category) => {
  return testType === 'accuracy_measurement' || category === 'accuracy';
};

const mapApiCategory = (apiCategory) => {
  const mapping = {
    speed: 'teknikk',
    distance: 'golf',
    accuracy: 'golf',
    short_game: 'golf',
    putting: 'golf',
    physical: 'fysisk',
    mental: 'mental',
    scoring: 'strategisk',
  };
  return mapping[apiCategory] || apiCategory;
};

// Category requirements per player category
const categoryRequirements = {
  A: {
    1: 120, 2: 95, 3: 280, 4: 0.04, 5: 75, 6: 80, 7: 80, 8: 5, 9: 90, 10: 70, 11: 30,
    12: 10, 13: 65, 14: 50, 15: 50, 16: 150, 17: -4, 18: 8, 19: 90, 20: 90,
  },
  B: {
    1: 112, 2: 87, 3: 260, 4: 0.05, 5: 70, 6: 70, 7: 70, 8: 8, 9: 85, 10: 55, 11: 45,
    12: 8.5, 13: 58, 14: 45, 15: 45, 16: 120, 17: 0, 18: 7, 19: 80, 20: 85,
  },
  C: {
    1: 105, 2: 80, 3: 240, 4: 0.06, 5: 65, 6: 60, 7: 60, 8: 10, 9: 80, 10: 45, 11: 55,
    12: 7, 13: 52, 14: 40, 15: 40, 16: 90, 17: 4, 18: 6, 19: 70, 20: 80,
  },
  D: {
    1: 98, 2: 75, 3: 220, 4: 0.07, 5: 60, 6: 50, 7: 50, 8: 12, 9: 75, 10: 35, 11: 65,
    12: 6, 13: 45, 14: 35, 15: 35, 16: 60, 17: 8, 18: 5, 19: 60, 20: 75,
  },
};

// ===== MAIN TEST PROTOCOL COMPONENT =====
const AKGolfTestprotokoll = ({ player: apiPlayer = null, tests: apiTests = null, onRefresh = null }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTest, setSelectedTest] = useState(null);
  const [testModalOpen, setTestModalOpen] = useState(false);
  const [testToStart, setTestToStart] = useState(null);

  // Handle starting a test
  const handleStartTest = (test) => {
    setTestToStart(test);
    setTestModalOpen(true);
  };

  // Handle submitting test results
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

      // Refresh data after successful submission
      if (onRefresh) {
        await onRefresh();
      }
    } catch (error) {
      console.error('Error submitting test result:', error);
      throw error;
    }
  };

  // Default player profile (fallback if no API data)
  const defaultPlayer = {
    name: 'Ola Nordmann',
    category: 'B',
    gender: 'M',
    age: 17,
  };

  // Transform API player data
  const player = apiPlayer ? {
    name: `${apiPlayer.firstName || ''} ${apiPlayer.lastName || ''}`.trim() || 'Spiller',
    category: apiPlayer.category || 'B',
    gender: apiPlayer.gender || 'M',
    age: apiPlayer.age || apiPlayer.birthDate
      ? Math.floor((Date.now() - new Date(apiPlayer.birthDate).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
      : null,
  } : defaultPlayer;

  // Transform API tests to component format
  const transformApiTests = (tests) => {
    if (!tests || tests.length === 0) return null;

    return tests.map(test => {
      const mappedCategory = mapApiCategory(test.category);
      const testNum = test.testNumber || test.id;
      const playerCat = player.category || 'B';
      const requirement = categoryRequirements[playerCat]?.[testNum] || 100;

      return {
        id: test.id || testNum,
        category: mappedCategory,
        name: test.name,
        description: test.description || test.protocolName || '',
        unit: test.unit || getTestUnit(test.testType, test.category),
        requirement: { [playerCat]: requirement },
        currentResult: test.currentResult,
        previousResult: test.previousResult,
        bestResult: test.bestResult,
        lastTested: test.lastTested,
        icon: test.icon || getCategoryIcon(test.category),
        lowerIsBetter: test.lowerIsBetter ?? isLowerBetter(test.testType, test.category),
        testDetails: test.testDetails,
      };
    });
  };

  // Calculate category counts from tests
  const calculateCategoryCounts = (tests) => {
    const counts = { all: tests.length };
    tests.forEach(t => {
      const cat = t.category;
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  };

  // Test categories with dynamic counts
  const testCategoriesBase = [
    { id: 'all', label: 'Alle tester' },
    { id: 'golf', label: 'Golf Shots' },
    { id: 'teknikk', label: 'Teknikk' },
    { id: 'fysisk', label: 'Fysisk' },
    { id: 'mental', label: 'Mental' },
    { id: 'strategisk', label: 'Strategisk' },
  ];

  // Default tests with results (fallback if no API data)
  const defaultTests = [
    // Golf Shots (1-7)
    {
      id: 1,
      category: 'golf',
      name: 'Driver Avstand',
      description: 'Carry-distanse med driver (gjennomsnitt 5 slag)',
      unit: 'm',
      requirement: { B: 260 },
      currentResult: 255,
      previousResult: 248,
      bestResult: 262,
      lastTested: '2025-12-01',
      icon: '🏌️',
    },
    {
      id: 2,
      category: 'golf',
      name: 'Jern 7 Avstand',
      description: 'Carry-distanse med jern 7 (gjennomsnitt 5 slag)',
      unit: 'm',
      requirement: { B: 165 },
      currentResult: 162,
      previousResult: 158,
      bestResult: 165,
      lastTested: '2025-12-01',
      icon: '🎯',
    },
    {
      id: 3,
      category: 'golf',
      name: 'Jern 7 Nøyaktighet',
      description: '6 slag til target, meter fra hull',
      unit: 'm',
      requirement: { B: 8 },
      currentResult: 9.2,
      previousResult: 10.5,
      bestResult: 8.1,
      lastTested: '2025-12-01',
      icon: '🎯',
      lowerIsBetter: true,
    },
    {
      id: 4,
      category: 'golf',
      name: 'Wedge PEI',
      description: 'Precision Efficiency Index (gjennomsnitt avstand / ideal approach)',
      unit: '',
      requirement: { B: 0.05 },
      currentResult: 0.052,
      previousResult: 0.061,
      bestResult: 0.048,
      lastTested: '2025-12-01',
      icon: '📐',
      lowerIsBetter: true,
    },
    {
      id: 5,
      category: 'golf',
      name: 'Lag-kontroll Putting',
      description: '9 putts fra 3, 6, 9 meter - avstand fra hull',
      unit: 'cm',
      requirement: { B: 45 },
      currentResult: 52,
      previousResult: 58,
      bestResult: 44,
      lastTested: '2025-12-01',
      icon: '⛳',
      lowerIsBetter: true,
    },
    {
      id: 6,
      category: 'golf',
      name: 'Lesing Putting',
      description: '6 putts fra 3m med break - hullet %',
      unit: '%',
      requirement: { B: 70 },
      currentResult: 67,
      previousResult: 60,
      bestResult: 72,
      lastTested: '2025-12-01',
      icon: '👁️',
    },
    {
      id: 7,
      category: 'golf',
      name: 'Bunker',
      description: '10 slag fra greenside bunker - % innenfor 3m',
      unit: '%',
      requirement: { B: 70 },
      currentResult: 65,
      previousResult: 58,
      bestResult: 72,
      lastTested: '2025-12-01',
      icon: '🏖️',
    },
    // Teknikk (8-11)
    {
      id: 8,
      category: 'teknikk',
      name: 'Klubbfart Driver',
      description: 'Clubspeed driver (gjennomsnitt 5 slag)',
      unit: 'mph',
      requirement: { B: 112 },
      currentResult: 109,
      previousResult: 106,
      bestResult: 111,
      lastTested: '2025-12-01',
      icon: '⚡',
    },
    {
      id: 9,
      category: 'teknikk',
      name: 'Smash Factor Driver',
      description: 'Ball speed / Club speed',
      unit: '',
      requirement: { B: 1.48 },
      currentResult: 1.46,
      previousResult: 1.44,
      bestResult: 1.48,
      lastTested: '2025-12-01',
      icon: '💥',
    },
    {
      id: 10,
      category: 'teknikk',
      name: 'Launch Angle Driver',
      description: 'Optimal launch angle',
      unit: '°',
      requirement: { B: 12 },
      currentResult: 11.5,
      previousResult: 10.8,
      bestResult: 12.2,
      lastTested: '2025-12-01',
      icon: '📐',
    },
    {
      id: 11,
      category: 'teknikk',
      name: 'Spin Rate Driver',
      description: 'Optimal spin rate',
      unit: 'rpm',
      requirement: { B: 2400 },
      currentResult: 2650,
      previousResult: 2800,
      bestResult: 2450,
      lastTested: '2025-12-01',
      icon: '🔄',
      lowerIsBetter: true,
    },
    // Fysisk (12-14)
    {
      id: 12,
      category: 'fysisk',
      name: 'Benkpress',
      description: '1RM benkpress',
      unit: 'kg',
      requirement: { B: 82 },
      currentResult: 78,
      previousResult: 72,
      bestResult: 80,
      lastTested: '2025-11-15',
      icon: '🏋️',
    },
    {
      id: 13,
      category: 'fysisk',
      name: 'Markløft Trapbar',
      description: '1RM markløft med trapbar',
      unit: 'kg',
      requirement: { B: 130 },
      currentResult: 125,
      previousResult: 118,
      bestResult: 128,
      lastTested: '2025-11-15',
      icon: '💪',
    },
    {
      id: 14,
      category: 'fysisk',
      name: 'Rotasjonskast 4kg',
      description: 'Rotasjonskast med 4kg medisinball',
      unit: 'm',
      requirement: { B: 13 },
      currentResult: 12.4,
      previousResult: 11.8,
      bestResult: 12.8,
      lastTested: '2025-11-15',
      icon: '🔄',
    },
    // Mental (15-18)
    {
      id: 15,
      category: 'mental',
      name: 'Pressure Putting',
      description: '10 putts @ 2m eliminering (miss = ute) - % suksess',
      unit: '%',
      requirement: { B: 80 },
      currentResult: 75,
      previousResult: 68,
      bestResult: 82,
      lastTested: '2025-12-01',
      icon: '🎯',
    },
    {
      id: 16,
      category: 'mental',
      name: 'Pre-shot Rutine Konsistens',
      description: 'Videoanalyse 18 hull - konsistens i tid og bevegelse',
      unit: '%',
      requirement: { B: 80 },
      currentResult: 78,
      previousResult: 72,
      bestResult: 81,
      lastTested: '2025-11-20',
      icon: '⏱️',
    },
    {
      id: 17,
      category: 'mental',
      name: 'Fokus Under Distraksjon',
      description: 'Øvelse med distraksjoner - % treff vs baseline',
      unit: '%',
      requirement: { B: 90 },
      currentResult: 88,
      previousResult: 84,
      bestResult: 92,
      lastTested: '2025-11-20',
      icon: '🧘',
    },
    {
      id: 18,
      category: 'mental',
      name: 'Mental Toughness (MTQ48)',
      description: 'Standardisert spørreskjema - score',
      unit: 'pts',
      requirement: { B: 55 },
      currentResult: 52,
      previousResult: 48,
      bestResult: 54,
      lastTested: '2025-11-01',
      icon: '🧠',
    },
    // Strategisk (19-20)
    {
      id: 19,
      category: 'strategisk',
      name: 'Klubbvalg og Risikovurdering',
      description: '20 scenarios - % optimale valg',
      unit: '%',
      requirement: { B: 75 },
      currentResult: 72,
      previousResult: 65,
      bestResult: 78,
      lastTested: '2025-11-20',
      icon: '🎲',
    },
    {
      id: 20,
      category: 'strategisk',
      name: 'Banestrategi-planlegging',
      description: 'Gitt bane-layout, planlegg 18 hull - score',
      unit: 'pts',
      requirement: { B: 85 },
      currentResult: 82,
      previousResult: 76,
      bestResult: 86,
      lastTested: '2025-11-20',
      icon: '🗺️',
    },
  ];

  // Use transformed API data if available, otherwise use default
  const tests = transformApiTests(apiTests) || defaultTests;

  // Calculate dynamic category counts
  const categoryCounts = calculateCategoryCounts(tests);
  const testCategories = testCategoriesBase.map(cat => ({
    ...cat,
    count: categoryCounts[cat.id] || 0,
  })).filter(cat => cat.id === 'all' || cat.count > 0);

  // Filter tests by category
  const filteredTests = selectedCategory === 'all'
    ? tests
    : tests.filter(t => t.category === selectedCategory);

  // Calculate overall stats
  const calculateStats = () => {
    let passed = 0;
    let improved = 0;

    tests.forEach(test => {
      if (test.currentResult === null || test.currentResult === undefined) return;

      const req = test.requirement[player.category] || test.requirement.B;
      if (req === undefined) return;

      const isBetter = test.lowerIsBetter
        ? test.currentResult <= req
        : test.currentResult >= req;
      if (isBetter) passed++;

      if (test.previousResult !== null && test.previousResult !== undefined) {
        const hasImproved = test.lowerIsBetter
          ? test.currentResult < test.previousResult
          : test.currentResult > test.previousResult;
        if (hasImproved) improved++;
      }
    });

    return {
      passed,
      total: tests.length,
      improved,
    };
  };

  const stats = calculateStats();

  // Get result status
  const getResultStatus = (test) => {
    const req = test.requirement[player.category] || test.requirement.B;
    const current = test.currentResult;
    const previous = test.previousResult;

    // Handle null/undefined values
    if (current === null || current === undefined) {
      return { meetsReq: false, improved: false, declined: false, noData: true };
    }

    const meetsReq = test.lowerIsBetter ? current <= req : current >= req;
    const improved = previous !== null && previous !== undefined
      ? (test.lowerIsBetter ? current < previous : current > previous)
      : false;
    const declined = previous !== null && previous !== undefined
      ? (test.lowerIsBetter ? current > previous : current < previous)
      : false;

    return { meetsReq, improved, declined, noData: false };
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-secondary)' }}>
      <PageHeader
        title="Testprotokoll"
        subtitle="IUP Tester og benchmarks"
        actions={
          <button
            onClick={() => filteredTests[0] && handleStartTest(filteredTests[0])}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              backgroundColor: 'var(--accent)',
              color: 'var(--bg-primary)',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: 500,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <Icons.Play />
            Start test
          </button>
        }
      />

      <div style={{ padding: '24px', maxWidth: '900px', margin: '0 auto' }}>
        {/* Player & Stats Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
          {/* Player Card */}
          <Card className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <Avatar name={player.name} size={48} />
              <div>
                <h2 className="text-[15px] font-semibold text-ak-charcoal">{player.name}</h2>
                <p className="text-[12px] text-ak-steel">Kategori {player.category} · {player.age} år</p>
              </div>
            </div>
            <div className="text-[12px] text-ak-steel">
              <p>Neste benchmark: <span className="text-ak-charcoal font-medium">Uke 50</span></p>
              <p>Sist testet: <span className="text-ak-charcoal font-medium">1. des 2025</span></p>
            </div>
          </Card>

          {/* Stats Cards */}
          <Card className="text-center">
            <p className="text-[11px] text-ak-steel uppercase tracking-wide mb-1">Bestått</p>
            <p className="text-[32px] font-bold text-ak-success">{stats.passed}/{stats.total}</p>
            <ProgressBar value={stats.passed} max={stats.total} color={'var(--success)'} />
          </Card>

          <Card className="text-center">
            <p className="text-[11px] text-ak-steel uppercase tracking-wide mb-1">Forbedret</p>
            <p className="text-[32px] font-bold text-ak-primary">{stats.improved}</p>
            <p className="text-[12px] text-ak-steel">av {stats.total} tester</p>
          </Card>

          <Card className="text-center">
            <p className="text-[11px] text-ak-steel uppercase tracking-wide mb-1">Fokusområder</p>
            <p className="text-[32px] font-bold text-ak-warning">{stats.total - stats.passed}</p>
            <p className="text-[12px] text-ak-steel">under krav</p>
          </Card>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {testCategories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-lg text-[13px] font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-ak-primary text-white'
                  : 'bg-white text-ak-charcoal border border-ak-mist hover:bg-ak-snow'
              }`}
            >
              {cat.label} ({cat.count})
            </button>
          ))}
        </div>

        {/* Tests Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTests.map(test => {
            const status = getResultStatus(test);

            return (
              <Card
                key={test.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedTest === test.id ? 'ring-2 ring-ak-primary' : ''
                }`}
                onClick={() => setSelectedTest(selectedTest === test.id ? null : test.id)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-ak-snow flex items-center justify-center text-lg">
                      {test.icon}
                    </div>
                    <div>
                      <h3 className="text-[15px] font-semibold text-ak-charcoal">{test.name}</h3>
                      <p className="text-[11px] text-ak-steel">Test {test.id}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {status.noData ? (
                      <Badge variant="neutral">Ikke testet</Badge>
                    ) : status.meetsReq ? (
                      <Badge variant="success">Bestått</Badge>
                    ) : (
                      <Badge variant="warning">Under krav</Badge>
                    )}
                  </div>
                </div>

                {/* Results */}
                <div className="grid grid-cols-3 gap-3 mb-3">
                  <div className="bg-ak-snow rounded-lg p-2 text-center">
                    <p className="text-[10px] text-ak-steel uppercase">Nåværende</p>
                    <p className={`text-[16px] font-bold ${status.noData ? 'text-ak-steel' : status.meetsReq ? 'text-ak-success' : 'text-ak-warning'}`}>
                      {status.noData ? '–' : `${test.currentResult}${test.unit}`}
                    </p>
                  </div>
                  <div className="bg-ak-snow rounded-lg p-2 text-center">
                    <p className="text-[10px] text-ak-steel uppercase">Krav ({player.category})</p>
                    <p className="text-[16px] font-bold text-ak-charcoal">
                      {test.lowerIsBetter ? '≤' : '≥'}{test.requirement[player.category] || test.requirement.B}{test.unit}
                    </p>
                  </div>
                  <div className="bg-ak-snow rounded-lg p-2 text-center">
                    <p className="text-[10px] text-ak-steel uppercase">Beste</p>
                    <p className="text-[16px] font-bold text-ak-primary">
                      {test.bestResult !== null ? `${test.bestResult}${test.unit}` : '–'}
                    </p>
                  </div>
                </div>

                {/* Trend Indicator */}
                <div className="flex items-center justify-between pt-3 border-t border-ak-mist">
                  <div className="flex items-center gap-2">
                    {status.noData ? (
                      <span className="flex items-center gap-1 text-[12px] text-ak-steel">
                        <Icons.Info /> Ingen data
                      </span>
                    ) : status.improved ? (
                      <span className="flex items-center gap-1 text-[12px] text-ak-success">
                        <Icons.TrendingUp /> Forbedret
                      </span>
                    ) : status.declined ? (
                      <span className="flex items-center gap-1 text-[12px] text-ak-error">
                        <Icons.TrendingDown /> Tilbakegang
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[12px] text-ak-steel">
                        <Icons.Minus /> Uendret
                      </span>
                    )}
                    {!status.noData && test.previousResult !== null && (
                      <span className="text-[11px] text-ak-steel">
                        (forrige: {test.previousResult}{test.unit})
                      </span>
                    )}
                  </div>
                  {test.lastTested && (
                    <span className="text-[11px] text-ak-steel flex items-center gap-1">
                      <Icons.Calendar /> {test.lastTested}
                    </span>
                  )}
                </div>

                {/* Expanded Details */}
                {selectedTest === test.id && (
                  <div className="mt-4 pt-4 border-t border-ak-mist">
                    <p className="text-[13px] text-ak-charcoal mb-3">{test.description}</p>

                    {/* Progress to requirement */}
                    {!status.noData && (
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[11px] text-ak-steel">Progresjon mot krav</span>
                          <span className="text-[11px] font-medium text-ak-charcoal">
                            {Math.round((test.currentResult / (test.requirement[player.category] || test.requirement.B)) * 100)}%
                          </span>
                        </div>
                        <ProgressBar
                          value={test.currentResult}
                          max={test.requirement[player.category] || test.requirement.B}
                          color={status.meetsReq ? 'var(--success)' : 'var(--warning)'}
                        />
                      </div>
                    )}

                    <div className="flex gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleStartTest(test); }}
                        className="flex-1 px-3 py-2 bg-ak-primary text-white rounded-lg text-[12px] font-medium hover:bg-ak-primary-light"
                      >
                        Start test
                      </button>
                      <button className="px-3 py-2 bg-ak-snow text-ak-charcoal rounded-lg text-[12px] font-medium hover:bg-ak-mist">
                        Historikk
                      </button>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {/* Info Card */}
        <Card className="mt-6 bg-ak-primary/5 border-ak-primary/20">
          <div className="flex items-start gap-3">
            <Icons.Info />
            <div>
              <h4 className="text-[14px] font-semibold text-ak-charcoal mb-1">Om testprotokollen</h4>
              <p className="text-[13px] text-ak-charcoal">
                Testprotokollen inneholder 20 offisielle tester basert på Team Norway standarder.
                14 teknisk/fysiske tester pluss 6 mental/strategiske tester. Benchmark gjennomføres hver 3. uke
                (uke 3, 6, 9, 12, osv.). For kategori {player.category} kreves at minimum 4 av 7 golf-tester er bestått
                for opprykk.
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Bottom Navigation (Mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-ak-mist z-50 lg:hidden">
        <div className="max-w-lg mx-auto flex items-center justify-around py-2">
          {[
            { id: 'dashboard', Icon: HomeIcon, label: 'Hjem' },
            { id: 'calendar', Icon: CalendarIcon, label: 'Kalender' },
            { id: 'tests', Icon: GolfScorecard, label: 'Tester', active: true },
            { id: 'stats', Icon: ChartIcon, label: 'Stats' },
            { id: 'profile', Icon: ProfileIcon, label: 'Profil' },
          ].map(tab => (
            <button
              key={tab.id}
              className={`flex flex-col items-center py-2 px-4 rounded-xl transition-all ${
                tab.active
                  ? 'text-ak-primary'
                  : 'text-ak-steel hover:text-ak-charcoal'
              }`}
            >
              <span className="mb-1">{tab.Icon && <tab.Icon size={20} />}</span>
              <span className={`text-[11px] font-medium ${
                tab.active ? 'text-ak-primary' : 'text-ak-steel'
              }`}>{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>

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
    </div>
  );
};

export default AKGolfTestprotokoll;
