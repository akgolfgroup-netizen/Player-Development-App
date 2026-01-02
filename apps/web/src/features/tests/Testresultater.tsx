// @ts-nocheck
/**
 * Testresultater - Test results overview with shadcn/ui components
 */
import React, { useState } from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import { SectionTitle, SubSectionTitle, CardTitle as TypographyCardTitle } from '../../components/typography';
import { AICoachGuide, GUIDE_PRESETS } from '../ai-coach';
import {
  TrendingUp, TrendingDown, Minus, Calendar, ChevronDown,
  ChevronRight, Info, Target
} from 'lucide-react';
import ExportButton from '../../components/ui/ExportButton';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Button,
  Progress,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  ScrollArea,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '../../components/shadcn';
import { SkillRadar, PlayerStatCard, CategoryProgressRing } from '../../components/shadcn/golf';
import { cn } from 'lib/utils';

// ===== MINI LINE CHART =====
interface ChartDataPoint {
  label: string;
  value: number;
}

interface MiniLineChartProps {
  data: ChartDataPoint[];
  requirement?: number;
  height?: number;
  lowerIsBetter?: boolean;
}

const MiniLineChart: React.FC<MiniLineChartProps> = ({
  data,
  requirement,
  height = 120,
  lowerIsBetter = false,
}) => {
  const values = data.map(d => d.value);
  const allValues = requirement ? [...values, requirement] : values;
  const maxValue = Math.max(...allValues);
  const minValue = Math.min(...allValues);
  const range = maxValue - minValue || 1;

  const getY = (value: number) => {
    return 100 - ((value - minValue) / range) * 80 - 10;
  };

  const points = data.map((d, i) => {
    const x = data.length > 1 ? (i / (data.length - 1)) * 100 : 50;
    const y = getY(d.value);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div style={{ height }} className="relative">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
        {/* Grid lines */}
        {[20, 40, 60, 80].map(y => (
          <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="var(--border-subtle)" strokeWidth="0.3" />
        ))}

        {/* Requirement line */}
        {requirement && (
          <line
            x1="0"
            y1={getY(requirement)}
            x2="100"
            y2={getY(requirement)}
            stroke="var(--ak-error)"
            strokeWidth="0.5"
            strokeDasharray="3,3"
          />
        )}

        {/* Data line */}
        <polyline
          fill="none"
          stroke="var(--ak-primary)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />

        {/* Data points */}
        {data.map((d, i) => {
          const x = data.length > 1 ? (i / (data.length - 1)) * 100 : 50;
          const y = getY(d.value);
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="2.5"
              fill="white"
              stroke="var(--ak-primary)"
              strokeWidth="2"
            />
          );
        })}
      </svg>

      {/* X-axis labels */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[10px] text-text-tertiary px-1">
        {data.map((d, i) => (
          <span key={i}>{d.label}</span>
        ))}
      </div>
    </div>
  );
};

// ===== TEST CARD =====
interface TestResult {
  id: string | number;
  name: string;
  category: string;
  icon: string;
  unit: string;
  requirement: number;
  lowerIsBetter: boolean;
  history: ChartDataPoint[];
}

interface TestCardProps {
  test: TestResult;
  isExpanded: boolean;
  onToggle: () => void;
}

const TestCard: React.FC<TestCardProps> = ({ test, isExpanded, onToggle }) => {
  const currentValue = test.history[test.history.length - 1]?.value ?? 0;
  const previousValue = test.history[test.history.length - 2]?.value ?? currentValue;
  const firstValue = test.history[0]?.value ?? currentValue;

  const meetsReq = test.lowerIsBetter
    ? currentValue <= test.requirement
    : currentValue >= test.requirement;

  const improved = test.lowerIsBetter
    ? currentValue < previousValue
    : currentValue > previousValue;

  const totalChange = test.lowerIsBetter
    ? firstValue - currentValue
    : currentValue - firstValue;

  const percentChange = previousValue !== 0
    ? ((Math.abs(currentValue - previousValue)) / previousValue * 100).toFixed(1)
    : '0.0';

  const progressValue = test.lowerIsBetter
    ? Math.max(0, 100 - ((currentValue / test.requirement) * 100 - 100))
    : (currentValue / test.requirement) * 100;

  return (
    <Collapsible open={isExpanded} onOpenChange={onToggle}>
      <Card className={cn(
        "transition-all hover:shadow-md cursor-pointer",
        isExpanded && "ring-2 ring-ak-primary"
      )}>
        <CollapsibleTrigger asChild>
          <CardContent className="p-4">
            {/* Header Row */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-background-default flex items-center justify-center text-lg">
                  {test.icon}
                </div>
                <div>
                  <SubSectionTitle className="text-sm font-semibold text-text-primary">{test.name}</SubSectionTitle>
                  <p className="text-xs text-text-secondary">
                    Krav: {test.lowerIsBetter ? '≤' : '≥'}{test.requirement}{test.unit}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={meetsReq ? 'default' : 'destructive'}
                  style={meetsReq
                    ? { backgroundColor: 'var(--success-muted)', color: 'var(--success)', border: '1px solid var(--success)' }
                    : { backgroundColor: 'var(--error-muted)', color: 'var(--error)', border: '1px solid var(--error)' }
                  }
                >
                  {meetsReq ? 'Oppfylt' : 'Under krav'}
                </Badge>
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-text-secondary" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-text-secondary" />
                )}
              </div>
            </div>

            {/* Stats Row */}
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className={cn(
                  "text-2xl font-bold",
                  meetsReq ? "text-ak-success" : "text-ak-error"
                )}>
                  {currentValue}{test.unit}
                </span>
                <span className={cn(
                  "flex items-center gap-1 text-xs",
                  improved ? "text-ak-success" : "text-ak-error"
                )}>
                  {improved ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {percentChange}%
                </span>
              </div>
              <Progress
                value={Math.min(progressValue, 100)}
                className="h-2"
              />
            </div>
          </CardContent>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="border-t border-border-subtle p-4 bg-background-default">
            <CardTitle className="text-sm font-medium text-text-primary mb-3">
              Historikk ({test.history.length} målinger)
            </CardTitle>
            <MiniLineChart
              data={test.history}
              requirement={test.requirement}
              lowerIsBetter={test.lowerIsBetter}
            />

            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="bg-white rounded-lg p-3 text-center">
                <p className="text-[10px] text-text-secondary uppercase">Første test</p>
                <p className="text-sm font-semibold text-text-primary">
                  {firstValue}{test.unit}
                </p>
              </div>
              <div className="bg-white rounded-lg p-3 text-center">
                <p className="text-[10px] text-text-secondary uppercase">Endring</p>
                <p className={cn(
                  "text-sm font-semibold",
                  totalChange > 0 ? "text-ak-success" : "text-ak-error"
                )}>
                  {totalChange > 0 ? '+' : ''}{totalChange.toFixed(test.unit === '' ? 3 : 0)}{test.unit}
                </p>
              </div>
              <div className="bg-white rounded-lg p-3 text-center">
                <p className="text-[10px] text-text-secondary uppercase">Til krav</p>
                <p className={cn(
                  "text-sm font-semibold",
                  meetsReq ? "text-ak-success" : "text-ak-error"
                )}>
                  {meetsReq
                    ? 'Oppfylt'
                    : `${Math.abs(currentValue - test.requirement).toFixed(test.unit === '' ? 3 : 0)}${test.unit} igjen`}
                </p>
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};

// ===== MAIN COMPONENT =====
interface TestresultaterProps {
  player?: {
    name: string;
    category: string;
    age?: number;
  };
  testResults?: TestResult[];
  onRefresh?: () => void;
}

const Testresultater: React.FC<TestresultaterProps> = ({
  player: apiPlayer,
  testResults: apiTestResults,
  onRefresh,
}) => {
  const [selectedTest, setSelectedTest] = useState<string | number | null>(null);
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Default player profile
  const player = apiPlayer || {
    name: 'Ola Nordmann',
    category: 'B',
    age: 17,
  };

  // Default test results with history
  const defaultTestResults: TestResult[] = [
    {
      id: 1,
      name: 'Driver Avstand',
      category: 'golf',
      icon: '🏌️',
      unit: 'm',
      requirement: 260,
      lowerIsBetter: false,
      history: [
        { label: 'U33', value: 242 },
        { label: 'U36', value: 245 },
        { label: 'U39', value: 248 },
        { label: 'U42', value: 252 },
        { label: 'U45', value: 248 },
        { label: 'U48', value: 255 },
      ],
    },
    {
      id: 2,
      name: 'Jern 7 Avstand',
      category: 'golf',
      icon: '🎯',
      unit: 'm',
      requirement: 165,
      lowerIsBetter: false,
      history: [
        { label: 'U33', value: 155 },
        { label: 'U36', value: 157 },
        { label: 'U39', value: 158 },
        { label: 'U42', value: 160 },
        { label: 'U45', value: 158 },
        { label: 'U48', value: 162 },
      ],
    },
    {
      id: 3,
      name: 'Klubbfart Driver',
      category: 'teknikk',
      icon: '⚡',
      unit: 'mph',
      requirement: 112,
      lowerIsBetter: false,
      history: [
        { label: 'U33', value: 102 },
        { label: 'U36', value: 104 },
        { label: 'U39', value: 106 },
        { label: 'U42', value: 107 },
        { label: 'U45', value: 106 },
        { label: 'U48', value: 109 },
      ],
    },
    {
      id: 4,
      name: 'Benkpress',
      category: 'fysisk',
      icon: '🏋️',
      unit: 'kg',
      requirement: 82,
      lowerIsBetter: false,
      history: [
        { label: 'U33', value: 65 },
        { label: 'U36', value: 68 },
        { label: 'U39', value: 70 },
        { label: 'U42', value: 72 },
        { label: 'U45', value: 72 },
        { label: 'U48', value: 78 },
      ],
    },
    {
      id: 5,
      name: 'Mental Toughness',
      category: 'mental',
      icon: '🧠',
      unit: 'pts',
      requirement: 55,
      lowerIsBetter: false,
      history: [
        { label: 'U33', value: 42 },
        { label: 'U36', value: 45 },
        { label: 'U39', value: 48 },
        { label: 'U42', value: 48 },
        { label: 'U45', value: 48 },
        { label: 'U48', value: 52 },
      ],
    },
  ];

  const testResults = apiTestResults || defaultTestResults;

  // Calculate overall stats
  const totalTests = testResults.length;
  const passedTests = testResults.filter(test => {
    const currentValue = test.history[test.history.length - 1]?.value ?? 0;
    return test.lowerIsBetter
      ? currentValue <= test.requirement
      : currentValue >= test.requirement;
  }).length;

  const improvedTests = testResults.filter(test => {
    const current = test.history[test.history.length - 1]?.value ?? 0;
    const previous = test.history[test.history.length - 2]?.value ?? current;
    return test.lowerIsBetter ? current < previous : current > previous;
  }).length;

  // Filter tests by category
  const filteredTests = categoryFilter === 'all'
    ? testResults
    : testResults.filter(t => t.category === categoryFilter);

  // Get unique categories
  const categories = ['all', ...new Set(testResults.map(t => t.category))];
  const categoryLabels: Record<string, string> = {
    all: 'Alle',
    golf: 'Golf',
    teknikk: 'Teknikk',
    fysisk: 'Fysisk',
    mental: 'Mental',
    strategisk: 'Strategi',
  };

  // Radar data for skill overview
  const radarData = categories
    .filter(c => c !== 'all')
    .map(category => {
      const categoryTests = testResults.filter(t => t.category === category);
      const avgProgress = categoryTests.reduce((sum, test) => {
        const current = test.history[test.history.length - 1]?.value ?? 0;
        const progress = test.lowerIsBetter
          ? Math.max(0, 100 - ((current / test.requirement) * 100 - 100))
          : (current / test.requirement) * 100;
        return sum + Math.min(progress, 100);
      }, 0) / (categoryTests.length || 1);

      return {
        category: categoryLabels[category] || category,
        value: Math.round(avgProgress),
      };
    });

  return (
    <div id="testresultater-export" className="min-h-screen bg-background-default">
      <PageHeader
        title="Testresultater"
        subtitle="Historikk og fremgang"
        actions={
          <ExportButton
            targetId="testresultater-export"
            filename={`testresultater-${player?.name?.replace(/\s+/g, '-') || 'spiller'}-${new Date().toISOString().split('T')[0]}`}
            title={`Testresultater - ${player?.name || 'Spiller'}`}
            label="Eksporter PDF"
            size="sm"
          />
        }
      />

      <div className="p-6 max-w-7xl mx-auto">
        {/* AI Coach contextual guide */}
        <AICoachGuide config={GUIDE_PRESETS.tests} />
        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <PlayerStatCard
            label="Bestått"
            value={`${passedTests}/${totalTests}`}
            trend={passedTests > totalTests / 2 ? 'up' : 'down'}
            trendLabel={`${Math.round((passedTests / totalTests) * 100)}%`}
            accentColor="success"
          />
          <PlayerStatCard
            label="Forbedret"
            value={`${improvedTests}`}
            suffix="tester"
            trend={improvedTests > totalTests / 2 ? 'up' : 'neutral'}
            trendLabel={`${Math.round((improvedTests / totalTests) * 100)}%`}
            accentColor="primary"
          />
          <PlayerStatCard
            label="Kategori"
            value={player.category}
            suffix="nivå"
            accentColor="warning"
          />
          <PlayerStatCard
            label="Under krav"
            value={`${totalTests - passedTests}`}
            suffix="fokusområder"
            accentColor={totalTests - passedTests > 0 ? 'warning' : 'success'}
          />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Overview */}
          <div className="space-y-6">
            {/* Skill Radar */}
            {radarData.length > 0 && (
              <SkillRadar
                data={radarData}
                title="Samlet profil"
                subtitle={`Kategori ${player.category}`}
                height={250}
              />
            )}

            {/* Category Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Kategorifremgang</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap justify-center gap-4">
                  {radarData.map((item) => (
                    <CategoryProgressRing
                      key={item.category}
                      category={item.category.toLowerCase() as any}
                      value={item.value}
                      size="sm"
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Legend */}
            <Card className="bg-ak-primary/5 border-ak-primary/20">
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-ak-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <CardTitle className="text-sm font-semibold text-text-primary mb-2">
                      Slik leser du grafene
                    </CardTitle>
                    <ul className="text-xs text-text-secondary space-y-1.5">
                      <li className="flex items-center gap-2">
                        <span className="w-4 h-0.5 bg-ak-primary rounded" />
                        Faktisk resultat
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-4 h-0.5 border-t-2 border-dashed border-ak-error" />
                        Krav for kategori {player.category}
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Test Results */}
          <div className="lg:col-span-2 space-y-4">
            {/* Category Tabs */}
            <Tabs value={categoryFilter} onValueChange={setCategoryFilter}>
              <TabsList className="w-full justify-start">
                {categories.map(cat => (
                  <TabsTrigger key={cat} value={cat}>
                    {categoryLabels[cat] || cat}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            {/* Test Cards */}
            <ScrollArea className="h-[calc(100vh-400px)]">
              <div className="space-y-3 pr-4">
                {filteredTests.map(test => (
                  <TestCard
                    key={test.id}
                    test={test}
                    isExpanded={selectedTest === test.id}
                    onToggle={() => setSelectedTest(
                      selectedTest === test.id ? null : test.id
                    )}
                  />
                ))}

                {filteredTests.length === 0 && (
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 'var(--spacing-12) var(--spacing-4)',
                    textAlign: 'center'
                  }}>
                    <Target style={{ width: '48px', height: '48px', color: 'var(--text-muted)', marginBottom: 'var(--spacing-4)' }} />
                    <h3 style={{ fontSize: 'var(--font-size-headline)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 'var(--spacing-2)' }}>
                      Ingen testresultater
                    </h3>
                    <p style={{ fontSize: 'var(--font-size-footnote)', color: 'var(--text-tertiary)', marginBottom: 'var(--spacing-4)', maxWidth: '320px' }}>
                      Ingen testresultater i denne kategorien enda. Testresultater vises her etter at de er registrert.
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testresultater;
