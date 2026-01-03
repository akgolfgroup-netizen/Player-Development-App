/**
 * TekniskPlanContainer.jsx
 * Design System v3.0 - Premium Light
 *
 * MIGRATED TO PAGE ARCHITECTURE - Zero inline styles
 */
import React, { useState } from 'react';
import {
  Target, Video, CheckCircle, Clock, ChevronRight, ChevronDown,
  Play, Camera, MessageCircle, Award,
  Repeat, Eye, BookOpen, TrendingUp
} from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import Button from '../../ui/primitives/Button';
import { SectionTitle, SubSectionTitle } from '../../components/typography';

// Status configuration
const STATUS_CLASSES = {
  completed: {
    text: 'text-ak-status-success',
    bg: 'bg-ak-status-success/15',
    activeBg: 'bg-ak-status-success',
    icon: CheckCircle,
    label: 'Fullfort',
  },
  in_progress: {
    text: 'text-ak-brand-primary',
    bg: 'bg-ak-brand-primary/15',
    activeBg: 'bg-ak-brand-primary',
    icon: Play,
    label: 'Pagar',
  },
  pending: {
    text: 'text-ak-text-secondary',
    bg: 'bg-ak-surface-subtle',
    activeBg: 'bg-ak-text-secondary',
    icon: Clock,
    label: 'Venter',
  },
};

// ============================================================================
// MOCK DATA - Will be replaced with API data
// ============================================================================

const TECHNICAL_PLAN = {
  currentFocus: 'Rotasjon og sekvensiering',
  startDate: '2025-01-01',
  targetDate: '2025-03-15',
  progress: 45,
  coach: 'Anders Kristiansen',
  areas: [
    {
      id: 'a1',
      name: 'Backsving',
      status: 'completed',
      focus: 'Skulder-rotasjon og arm-posisjon',
      checkpoints: [
        { id: 'c1', text: 'Full skulder-rotasjon (90+)', completed: true },
        { id: 'c2', text: 'Venstre arm straight ved toppen', completed: true },
        { id: 'c3', text: 'Klubb parallell med mal-linje', completed: true },
      ],
      drills: [
        { name: 'Alignment stick drill', duration: '10 min', videoUrl: '#' },
        { name: 'Speil-trening', duration: '5 min', videoUrl: '#' },
      ],
      notes: 'God progresjon. Konsistent posisjon ved toppen na.',
    },
    {
      id: 'a2',
      name: 'Nedsvings-sekvensiering',
      status: 'in_progress',
      focus: 'Starte nedsvingen fra bakken opp',
      checkpoints: [
        { id: 'c4', text: 'Hofte-initiering for armer', completed: true },
        { id: 'c5', text: 'Lagre vinkelen lengre', completed: false },
        { id: 'c6', text: 'Shaft lean ved impact', completed: false },
      ],
      drills: [
        { name: 'Step-through drill', duration: '15 min', videoUrl: '#' },
        { name: 'Pump drill', duration: '10 min', videoUrl: '#' },
        { name: 'Impact bag', duration: '10 min', videoUrl: '#' },
      ],
      notes: 'Hovedfokus na. Jobber med a holde vinkelen lengre i nedsvingen.',
      coachFeedback: 'Bra fremgang siste 2 uker! Fokuser pa a fole "drag" fra hoftene.',
    },
    {
      id: 'a3',
      name: 'Impact & Follow-through',
      status: 'pending',
      focus: 'Ren kontakt og balansert finish',
      checkpoints: [
        { id: 'c7', text: 'Hender foran hodet ved impact', completed: false },
        { id: 'c8', text: 'Full ekstensjon etter impact', completed: false },
        { id: 'c9', text: 'Balansert finish-posisjon', completed: false },
      ],
      drills: [
        { name: 'Slow motion swings', duration: '10 min', videoUrl: '#' },
        { name: 'Finish & hold', duration: '5 min', videoUrl: '#' },
      ],
      notes: 'Starter nar sekvensiering er pa plass.',
    },
  ],
  recentVideos: [
    { id: 'v1', date: '2025-01-14', title: 'Driver FO-view', thumbnail: null, duration: '0:45' },
    { id: 'v2', date: '2025-01-12', title: '7-jern DTL', thumbnail: null, duration: '0:32' },
    { id: 'v3', date: '2025-01-10', title: 'Sammenligning for/etter', thumbnail: null, duration: '1:20' },
  ],
  keyMetrics: [
    { name: 'Klubbhastighet', current: '108 mph', target: '112 mph', progress: 75 },
    { name: 'Attack angle (driver)', current: '+2.5', target: '+4', progress: 60 },
    { name: 'Smash factor', current: '1.46', target: '1.48', progress: 85 },
    { name: 'Dispersion 150y', current: '12y', target: '8y', progress: 40 },
  ],
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const getStatusConfig = (status) => {
  return STATUS_CLASSES[status] || STATUS_CLASSES.pending;
};

// ============================================================================
// AREA CARD COMPONENT
// ============================================================================

const AreaCard = ({ area }) => {
  const [isExpanded, setIsExpanded] = useState(area.status === 'in_progress');
  const statusConfig = getStatusConfig(area.status);
  const StatusIcon = statusConfig.icon;

  const completedCheckpoints = area.checkpoints.filter(c => c.completed).length;
  const totalCheckpoints = area.checkpoints.length;
  const progressPercent = (completedCheckpoints / totalCheckpoints) * 100;

  return (
    <div className={`bg-ak-surface-base rounded-2xl overflow-hidden shadow-sm ${
      area.status === 'in_progress' ? 'border-2 border-ak-brand-primary' : 'border-2 border-transparent'
    }`}>
      {/* Header */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-5 cursor-pointer flex items-center gap-4"
      >
        <div className={`w-12 h-12 rounded-xl ${statusConfig.bg} flex items-center justify-center`}>
          <StatusIcon size={24} className={statusConfig.text} />
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2.5">
            <SubSectionTitle className="text-base">
              {area.name}
            </SubSectionTitle>
            <span className={`text-[11px] font-medium ${statusConfig.text} ${statusConfig.bg} py-0.5 px-2 rounded`}>
              {statusConfig.label}
            </span>
          </div>
          <div className="text-[13px] text-ak-text-secondary mt-1">
            {area.focus}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-sm font-semibold text-ak-text-primary">
              {completedCheckpoints}/{totalCheckpoints}
            </div>
            <div className="text-[11px] text-ak-text-secondary">checkpoints</div>
          </div>
          <div className={`w-7 h-7 rounded-lg bg-ak-surface-subtle flex items-center justify-center transition-transform duration-200 ${
            isExpanded ? 'rotate-180' : ''
          }`}>
            <ChevronDown size={16} className="text-ak-text-secondary" />
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="px-5 pb-3">
        <div className="h-1 bg-ak-surface-subtle rounded-sm overflow-hidden">
          <div
            className={`h-full ${statusConfig.activeBg} rounded-sm transition-all duration-300`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-5 pb-5 border-t border-ak-border-default">
          {/* Checkpoints */}
          <div className="mt-4">
            <div className="text-[13px] font-semibold text-ak-text-primary mb-2.5 flex items-center gap-1.5">
              <Target size={14} />
              Checkpoints
            </div>
            <div className="flex flex-col gap-2">
              {area.checkpoints.map((checkpoint) => (
                <div
                  key={checkpoint.id}
                  className={`flex items-center gap-2.5 py-2.5 px-3 rounded-lg ${
                    checkpoint.completed ? 'bg-ak-status-success/10' : 'bg-ak-surface-subtle'
                  }`}
                >
                  <div className={`w-[22px] h-[22px] rounded-full flex items-center justify-center ${
                    checkpoint.completed
                      ? 'bg-ak-status-success'
                      : 'bg-ak-surface-base border-2 border-ak-border-default'
                  }`}>
                    {checkpoint.completed && <CheckCircle size={14} className="text-white" />}
                  </div>
                  <span className={`text-[13px] ${
                    checkpoint.completed
                      ? 'text-ak-text-secondary line-through'
                      : 'text-ak-text-primary'
                  }`}>
                    {checkpoint.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Drills */}
          <div className="mt-4">
            <div className="text-[13px] font-semibold text-ak-text-primary mb-2.5 flex items-center gap-1.5">
              <Repeat size={14} />
              Drills
            </div>
            <div className="flex gap-2 flex-wrap">
              {area.drills.map((drill, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 py-2 px-3 bg-ak-surface-subtle rounded-lg cursor-pointer"
                >
                  <Video size={14} className="text-ak-brand-primary" />
                  <span className="text-xs text-ak-text-primary">
                    {drill.name}
                  </span>
                  <span className="text-[11px] text-ak-text-secondary bg-ak-surface-base py-0.5 px-1.5 rounded">
                    {drill.duration}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Coach Feedback */}
          {area.coachFeedback && (
            <div className="mt-4 p-3 bg-ak-brand-primary/10 rounded-[10px] border-l-[3px] border-ak-brand-primary">
              <div className="flex items-center gap-1.5 mb-1.5">
                <MessageCircle size={14} className="text-ak-brand-primary" />
                <span className="text-xs font-semibold text-ak-brand-primary">
                  Trener-feedback
                </span>
              </div>
              <p className="text-[13px] text-ak-text-primary m-0 leading-relaxed">
                {area.coachFeedback}
              </p>
            </div>
          )}

          {/* Notes */}
          {area.notes && !area.coachFeedback && (
            <div className="mt-4 p-3 bg-ak-surface-subtle rounded-[10px]">
              <div className="text-[11px] text-ak-text-secondary mb-1">
                Notater
              </div>
              <p className="text-[13px] text-ak-text-primary m-0 leading-relaxed">
                {area.notes}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// METRICS CARD COMPONENT
// ============================================================================

const MetricsCard = ({ metrics }) => {
  return (
    <div className="bg-ak-surface-base rounded-2xl p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp size={16} className="text-ak-status-warning" />
        <SubSectionTitle className="text-sm">
          Nokkeltall
        </SubSectionTitle>
      </div>

      <div className="flex flex-col gap-3.5">
        {metrics.map((metric, idx) => (
          <div key={idx}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[13px] text-ak-text-primary">
                {metric.name}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-semibold text-ak-text-primary">
                  {metric.current}
                </span>
                <span className="text-[11px] text-ak-text-secondary">
                  / {metric.target}
                </span>
              </div>
            </div>
            <div className="h-1.5 bg-ak-surface-subtle rounded-sm overflow-hidden">
              <div
                className={`h-full rounded-sm ${
                  metric.progress >= 80 ? 'bg-ak-status-success' :
                  metric.progress >= 50 ? 'bg-ak-brand-primary' : 'bg-ak-status-warning'
                }`}
                style={{ width: `${metric.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// VIDEO CARD COMPONENT
// ============================================================================

const RecentVideosCard = ({ videos }) => {
  return (
    <div className="bg-ak-surface-base rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Camera size={16} className="text-ak-brand-primary" />
          <SubSectionTitle className="text-sm">
            Siste videoer
          </SubSectionTitle>
        </div>
        <Button variant="ghost" size="sm">
          Se alle
        </Button>
      </div>

      <div className="flex flex-col gap-2.5">
        {videos.map((video) => (
          <div
            key={video.id}
            className="flex items-center gap-3 p-2.5 bg-ak-surface-subtle rounded-[10px] cursor-pointer"
          >
            <div className="w-12 h-9 rounded-md bg-ak-text-primary flex items-center justify-center">
              <Play size={16} className="text-white" />
            </div>
            <div className="flex-1">
              <div className="text-[13px] font-medium text-ak-text-primary">
                {video.title}
              </div>
              <div className="text-[11px] text-ak-text-secondary">
                {video.date} - {video.duration}
              </div>
            </div>
            <ChevronRight size={16} className="text-ak-text-secondary" />
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const TekniskPlanContainer = () => {
  const plan = TECHNICAL_PLAN;
  const completedAreas = plan.areas.filter(a => a.status === 'completed').length;

  return (
    <div className="min-h-screen bg-ak-surface-subtle">
      <PageHeader
        title="Teknisk plan"
        subtitle={`Fokus: ${plan.currentFocus}`}
      />

      <div className="p-6">
        {/* Progress Overview */}
        <div className="bg-ak-surface-base rounded-2xl p-5 mb-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <SectionTitle className="text-lg">
                Teknisk utviklingsplan
              </SectionTitle>
              <div className="text-[13px] text-ak-text-secondary mt-1">
                Trener: {plan.coach} - Maldat: {new Date(plan.targetDate).toLocaleDateString('nb-NO', { day: 'numeric', month: 'long' })}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-2xl font-bold text-ak-brand-primary">
                  {plan.progress}%
                </div>
                <div className="text-[11px] text-ak-text-secondary">total fremgang</div>
              </div>
            </div>
          </div>

          <div className="h-2 bg-ak-surface-subtle rounded overflow-hidden">
            <div
              className="h-full bg-ak-brand-primary rounded"
              style={{ width: `${plan.progress}%` }}
            />
          </div>

          <div className="flex justify-between mt-2 text-xs text-ak-text-secondary">
            <span>{completedAreas}/{plan.areas.length} omrader fullfort</span>
            <span>Startet {new Date(plan.startDate).toLocaleDateString('nb-NO', { day: 'numeric', month: 'short' })}</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-[1fr_340px] gap-6">
          {/* Areas */}
          <div>
            <SectionTitle className="text-base m-0 mb-4">
              Utviklingsomrader
            </SectionTitle>
            <div className="flex flex-col gap-3">
              {plan.areas.map((area) => (
                <AreaCard key={area.id} area={area} />
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-4">
            <MetricsCard metrics={plan.keyMetrics} />
            <RecentVideosCard videos={plan.recentVideos} />

            {/* Resources */}
            <div className="bg-ak-surface-base rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen size={16} className="text-ak-status-success" />
                <SubSectionTitle className="text-sm">
                  Ressurser
                </SubSectionTitle>
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  leftIcon={<Eye size={14} />}
                  className="w-full justify-start"
                >
                  Se treningsvideoer
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  leftIcon={<Award size={14} />}
                  className="w-full justify-start"
                >
                  Tidligere planer
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TekniskPlanContainer;
