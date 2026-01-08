/**
 * AnnualPlanGenerator.tsx
 * Design System v3.0 - Premium Light
 *
 * Årsplangenerator for trenere
 * - Opprett årsplan fra mal eller fra scratch
 * - Drag-and-drop perioder og økter
 * - Visuell timeline med periodisering
 *
 * Basert på AK-formel hierarki v2.0
 * Periode-typer: E (Evaluering), G (Grunnperiode), S (Spesialisering), T (Turnering)
 */

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Save, Download, Calendar, Plus, Layout,
  Layers, Clock, Target, Settings
} from 'lucide-react';
import Button from '../../ui/primitives/Button';
import Card from '../../ui/primitives/Card';
import { PageTitle, SectionTitle } from '../../components/typography';
import { exportAnnualPlanToPDF } from '../../services/pdfExport';

// ============================================================================
// TYPES
// ============================================================================

type PeriodType = 'E' | 'G' | 'S' | 'T';

interface Period {
  id: string;
  type: PeriodType;
  name: string;
  description?: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;
  weeklyFrequency: number;
  goals: string[];
  color: string;
  textColor: string;
}

interface AnnualPlan {
  id?: string;
  playerId: string;
  playerName: string;
  name: string;
  startDate: string;
  endDate: string;
  periods: Period[];
}

type CreationMode = 'template' | 'scratch' | null;

// ============================================================================
// PERIODE KONFIGURASJON
// ============================================================================

const PERIOD_CONFIG: Record<PeriodType, {
  label: string;
  description: string;
  color: string;
  bgColor: string;
  textColor: string;
  defaultWeeks: number;
}> = {
  E: {
    label: 'Evaluering',
    description: 'Testing, kartlegging og vurdering',
    color: '#8B6E9D',
    bgColor: 'bg-[#8B6E9D]/15',
    textColor: 'text-[#8B6E9D]',
    defaultWeeks: 4,
  },
  G: {
    label: 'Grunnperiode',
    description: 'Grunnleggende ferdigheter og allsidig utvikling',
    color: '#D97644',
    bgColor: 'bg-[#D97644]/15',
    textColor: 'text-[#D97644]',
    defaultWeeks: 12,
  },
  S: {
    label: 'Spesialisering',
    description: 'Fokusert trening på spesifikke områder',
    color: '#4A8C7C',
    bgColor: 'bg-[#4A8C7C]/15',
    textColor: 'text-[#4A8C7C]',
    defaultWeeks: 10,
  },
  T: {
    label: 'Turnering',
    description: 'Konkurranseperiode og toppform',
    color: '#C9A227',
    bgColor: 'bg-[#C9A227]/15',
    textColor: 'text-[#C9A227]',
    defaultWeeks: 8,
  },
};

// ============================================================================
// MODE SELECTOR COMPONENT
// ============================================================================

interface ModeSelectorProps {
  onSelectMode: (mode: CreationMode) => void;
  playerName: string;
}

const ModeSelector: React.FC<ModeSelectorProps> = ({ onSelectMode, playerName }) => (
  <div className="min-h-[60vh] flex items-center justify-center p-6">
    <div className="max-w-4xl w-full">
      <div className="text-center mb-8">
        <PageTitle className="mb-2">Opprett årsplan</PageTitle>
        <p className="text-tier-text-secondary text-[15px]">
          For {playerName}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Template Mode */}
        <Card
          variant="default"
          padding="none"
          className="cursor-pointer transition-all hover:shadow-lg hover:border-tier-navy/30 group"
          onClick={() => onSelectMode('template')}
        >
          <div className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-tier-navy/15 flex items-center justify-center group-hover:bg-tier-navy/25 transition-colors">
              <Layout size={32} className="text-tier-navy" />
            </div>
            <SectionTitle className="mb-2">Fra mal</SectionTitle>
            <p className="text-sm text-tier-text-secondary mb-6">
              Velg en ferdig periodiseringsmal tilpasset spillernivå og mål
            </p>
            <div className="flex flex-col gap-2 text-left">
              <div className="flex items-center gap-2 text-xs text-tier-text-secondary">
                <div className="w-1.5 h-1.5 rounded-full bg-tier-success" />
                <span>Anbefalt for de fleste</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-tier-text-secondary">
                <div className="w-1.5 h-1.5 rounded-full bg-tier-success" />
                <span>Spar tid med forhåndsdefinerte perioder</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-tier-text-secondary">
                <div className="w-1.5 h-1.5 rounded-full bg-tier-success" />
                <span>Kan tilpasses etter valg</span>
              </div>
            </div>
          </div>
        </Card>

        {/* From Scratch Mode */}
        <Card
          variant="default"
          padding="none"
          className="cursor-pointer transition-all hover:shadow-lg hover:border-tier-navy/30 group"
          onClick={() => onSelectMode('scratch')}
        >
          <div className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-tier-surface-base flex items-center justify-center group-hover:bg-tier-border-default transition-colors">
              <Plus size={32} className="text-tier-navy" />
            </div>
            <SectionTitle className="mb-2">Fra scratch</SectionTitle>
            <p className="text-sm text-tier-text-secondary mb-6">
              Start med tom plan og bygg din egen periodisering fra bunnen
            </p>
            <div className="flex flex-col gap-2 text-left">
              <div className="flex items-center gap-2 text-xs text-tier-text-secondary">
                <div className="w-1.5 h-1.5 rounded-full bg-tier-border-default" />
                <span>Full kontroll</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-tier-text-secondary">
                <div className="w-1.5 h-1.5 rounded-full bg-tier-border-default" />
                <span>For erfarne trenere</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-tier-text-secondary">
                <div className="w-1.5 h-1.5 rounded-full bg-tier-border-default" />
                <span>Skreddersydd planlegging</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  </div>
);

// ============================================================================
// TIMELINE HEADER COMPONENT
// ============================================================================

interface TimelineHeaderProps {
  startDate: Date;
  endDate: Date;
  currentView: 'month' | 'week';
  onViewChange: (view: 'month' | 'week') => void;
}

const TimelineHeader: React.FC<TimelineHeaderProps> = ({
  startDate,
  endDate,
  currentView,
  onViewChange,
}) => {
  const months = [] as Date[];
  const current = new Date(startDate);

  while (current <= endDate) {
    months.push(new Date(current));
    current.setMonth(current.getMonth() + 1);
  }

  return (
    <div className="sticky top-0 bg-tier-white z-10 border-b border-tier-border-default">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <Calendar size={18} className="text-tier-text-secondary" />
          <span className="text-sm font-medium text-tier-navy">
            {startDate.toLocaleDateString('nb-NO', { year: 'numeric' })}
          </span>
        </div>

        <div className="flex gap-1 p-1 bg-tier-surface-base rounded-lg">
          <button
            onClick={() => onViewChange('month')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              currentView === 'month'
                ? 'bg-white text-tier-navy shadow-sm'
                : 'text-tier-text-secondary hover:text-tier-navy'
            }`}
          >
            Måned
          </button>
          <button
            onClick={() => onViewChange('week')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              currentView === 'week'
                ? 'bg-white text-tier-navy shadow-sm'
                : 'text-tier-text-secondary hover:text-tier-navy'
            }`}
          >
            Uke
          </button>
        </div>
      </div>

      {/* Month headers */}
      <div className="flex border-t border-tier-border-default">
        {months.map((month, index) => (
          <div
            key={index}
            className="flex-1 px-3 py-2 text-center border-r border-tier-border-default last:border-r-0"
          >
            <div className="text-xs font-semibold text-tier-navy uppercase">
              {month.toLocaleDateString('nb-NO', { month: 'short' })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// PERIOD BLOCK COMPONENT
// ============================================================================

interface PeriodBlockProps {
  period: Period;
  onClick: () => void;
  totalDays: number;
}

const PeriodBlock: React.FC<PeriodBlockProps> = ({ period, onClick, totalDays }) => {
  const config = PERIOD_CONFIG[period.type];

  const start = new Date(period.startDate);
  const end = new Date(period.endDate);
  const duration = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div
      onClick={onClick}
      className={`${config.bgColor} rounded-xl p-4 border-2 border-transparent hover:border-current cursor-pointer transition-all group`}
      style={{ borderColor: 'transparent' }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = config.color;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'transparent';
      }}
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <div className={`text-xs font-bold ${config.textColor} uppercase tracking-wide mb-1`}>
            {config.label}
          </div>
          <div className="text-sm font-semibold text-tier-navy">
            {period.name}
          </div>
        </div>
        <div className={`w-6 h-6 rounded-md ${config.bgColor} flex items-center justify-center`}>
          <span className={`text-xs font-bold ${config.textColor}`}>
            {period.type}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-tier-text-secondary">
        <Clock size={12} />
        <span>{duration} dager</span>
        <span>•</span>
        <span>{Math.ceil(duration / 7)} uker</span>
      </div>

      {period.weeklyFrequency > 0 && (
        <div className="mt-2 text-xs text-tier-text-secondary">
          {period.weeklyFrequency} økter/uke
        </div>
      )}
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const AnnualPlanGenerator: React.FC = () => {
  const { playerId } = useParams<{ playerId: string }>();
  const navigate = useNavigate();

  const [mode, setMode] = useState<CreationMode>(null);
  const [currentView, setCurrentView] = useState<'month' | 'week'>('month');
  const [plan, setPlan] = useState<AnnualPlan>({
    playerId: playerId || '',
    playerName: 'Emma Hansen', // Mock - should come from API
    name: 'Årsplan 2026',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    periods: [],
  });

  const handleBack = () => {
    navigate(-1);
  };

  const handleSave = () => {
    console.log('Saving annual plan:', plan);
    // TODO: API call to save
  };

  const handleExport = async () => {
    try {
      await exportAnnualPlanToPDF({
        playerName: plan.playerName,
        name: plan.name,
        startDate: plan.startDate,
        endDate: plan.endDate,
        periods: plan.periods,
      });
      console.log('Annual plan exported successfully');
    } catch (error) {
      console.error('Failed to export annual plan:', error);
    }
  };

  // If mode not selected, show mode selector
  if (!mode) {
    return (
      <div className="min-h-screen bg-tier-surface-base">
        <div className="bg-tier-white border-b border-tier-border-default py-4 px-6">
          <Button variant="ghost" size="sm" onClick={handleBack} leftIcon={<ArrowLeft size={18} />}>
            Tilbake
          </Button>
        </div>
        <ModeSelector onSelectMode={setMode} playerName={plan.playerName} />
      </div>
    );
  }

  // Main editor view
  const startDate = new Date(plan.startDate);
  const endDate = new Date(plan.endDate);

  return (
    <div className="min-h-screen bg-tier-surface-base flex flex-col">
      {/* Header */}
      <div className="bg-tier-white border-b border-tier-border-default py-4 px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={handleBack} leftIcon={<ArrowLeft size={18} />}>
            Tilbake
          </Button>
          <div>
            <PageTitle className="m-0">{plan.name}</PageTitle>
            <p className="text-sm text-tier-text-secondary mt-1">{plan.playerName}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<Download size={18} />}
            onClick={handleExport}
          >
            Eksporter
          </Button>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Save size={18} />}
            onClick={handleSave}
          >
            Lagre
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Timeline Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <TimelineHeader
            startDate={startDate}
            endDate={endDate}
            currentView={currentView}
            onViewChange={setCurrentView}
          />

          <div className="flex-1 overflow-auto p-6">
            {plan.periods.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center max-w-md">
                  <Layers size={48} className="mx-auto mb-4 text-tier-text-tertiary" />
                  <SectionTitle className="mb-2">Ingen perioder lagt til</SectionTitle>
                  <p className="text-sm text-tier-text-secondary mb-6">
                    {mode === 'template'
                      ? 'Velg en mal fra høyre sidebar for å komme i gang'
                      : 'Legg til perioder ved å dra dem fra biblioteket til høyre'}
                  </p>
                  <Button variant="primary" leftIcon={<Plus size={18} />}>
                    Legg til periode
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {plan.periods.map((period) => (
                  <PeriodBlock
                    key={period.id}
                    period={period}
                    onClick={() => console.log('Period clicked:', period)}
                    totalDays={365}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar - Session Library / Templates */}
        <div className="w-80 bg-tier-white border-l border-tier-border-default overflow-auto">
          <div className="p-4 border-b border-tier-border-default">
            <SectionTitle className="m-0">
              {mode === 'template' ? 'Velg mal' : 'Periode-bibliotek'}
            </SectionTitle>
          </div>

          <div className="p-4">
            {mode === 'template' ? (
              <div className="text-sm text-tier-text-secondary">
                Template selector kommer her...
              </div>
            ) : (
              <div className="space-y-3">
                {Object.entries(PERIOD_CONFIG).map(([type, config]) => (
                  <div
                    key={type}
                    className={`${config.bgColor} rounded-lg p-3 border-2 border-transparent hover:border-current cursor-move transition-all`}
                    style={{ borderColor: 'transparent' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = config.color;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'transparent';
                    }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-sm font-semibold ${config.textColor}`}>
                        {config.label}
                      </span>
                      <span className={`text-xs font-bold ${config.textColor}`}>
                        {type}
                      </span>
                    </div>
                    <p className="text-xs text-tier-text-secondary">
                      {config.description}
                    </p>
                    <div className="mt-2 text-xs text-tier-text-tertiary">
                      Standard: {config.defaultWeeks} uker
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnualPlanGenerator;
