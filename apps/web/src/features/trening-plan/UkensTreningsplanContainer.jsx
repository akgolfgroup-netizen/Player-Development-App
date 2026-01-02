/**
 * UkensTreningsplanContainer.jsx
 * Design System v3.0 - Premium Light
 *
 * MIGRATED TO PAGE ARCHITECTURE - Zero inline styles
 */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Calendar, Clock, Target, CheckCircle, ChevronRight, ChevronLeft,
  Dumbbell, Brain, Flag, RotateCcw, Flame, X, Plus, FileText,
  MoreHorizontal
} from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { AICoachGuide } from '../ai-coach';
import { GUIDE_PRESETS } from '../ai-coach/types';

// Session type color configuration
const SESSION_TYPE_CLASSES = {
  technical: {
    text: 'text-ak-info',
    bg: 'bg-ak-info/10',
    activeBg: 'bg-ak-info',
    icon: Target,
    label: 'Teknikk',
  },
  physical: {
    text: 'text-danger',
    bg: 'bg-danger/10',
    activeBg: 'bg-danger',
    icon: Dumbbell,
    label: 'Fysisk',
  },
  mental: {
    text: 'text-ak-brand-primary',
    bg: 'bg-ak-brand-primary/10',
    activeBg: 'bg-ak-brand-primary',
    icon: Brain,
    label: 'Mental',
  },
  short_game: {
    text: 'text-ak-status-success',
    bg: 'bg-ak-status-success/10',
    activeBg: 'bg-ak-status-success',
    icon: Flag,
    label: 'Kortspill',
  },
  warmup: {
    text: 'text-ak-status-warning',
    bg: 'bg-ak-status-warning/10',
    activeBg: 'bg-ak-status-warning',
    icon: Flame,
    label: 'Oppvarming',
  },
  rest: {
    text: 'text-ak-text-secondary',
    bg: 'bg-ak-surface-subtle',
    activeBg: 'bg-ak-text-secondary',
    icon: RotateCcw,
    label: 'Hvile',
  },
};

// ============================================================================
// MOCK DATA - Will be replaced with API data
// ============================================================================

const getWeekDates = (weekOffset = 0) => {
  const now = new Date();
  const currentDay = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - (currentDay === 0 ? 6 : currentDay - 1) + (weekOffset * 7));

  const dates = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    dates.push(date);
  }
  return dates;
};

const WEEK_DATA = {
  weekNumber: 1,
  theme: 'Langt spill og styrke',
  period: 'Vintertrening',
  totalPlannedHours: 12,
  completedHours: 5.5,
  days: [
    {
      dayName: 'Mandag',
      date: '2025-12-29',
      isToday: false,
      isCompleted: true,
      sessions: [
        { id: 's1', type: 'physical', name: 'Styrketrening', duration: 60, status: 'completed', description: 'Fokus på core og rotasjon. 3 sett av hver øvelse.', exercises: ['Planke 3x60s', 'Russian twists 3x20', 'Cable rotations 3x15'] },
        { id: 's2', type: 'mental', name: 'Visualisering', duration: 20, status: 'completed', description: 'Visualiser perfekte slag på driving range.' },
      ],
    },
    {
      dayName: 'Tirsdag',
      date: '2025-12-30',
      isToday: false,
      isCompleted: true,
      sessions: [
        { id: 's3', type: 'technical', name: 'Simulator - Driver', duration: 90, status: 'completed', description: 'Fokus på konsistent kontakt og ballbane.', exercises: ['Oppvarming 20 baller', 'Alignment drill', 'Tempo drill 1-2-3', 'Full sving med mål'] },
        { id: 's4', type: 'short_game', name: 'Putting drill', duration: 30, status: 'completed', description: 'Gate putting og avstandskontroll.' },
      ],
    },
    {
      dayName: 'Onsdag',
      date: '2025-12-31',
      isToday: true,
      isCompleted: false,
      sessions: [
        { id: 's5', type: 'rest', name: 'Hviledag', duration: 0, status: 'pending' },
      ],
    },
    {
      dayName: 'Torsdag',
      date: '2026-01-01',
      isToday: false,
      isCompleted: false,
      sessions: [
        { id: 's6', type: 'technical', name: 'Lange jern', duration: 120, status: 'pending', description: 'Presisjon og avstandskontroll med 4-6 jern.', exercises: ['6-jern til mål 147m', '5-jern til mål 160m', '4-jern til mål 175m'] },
        { id: 's7', type: 'short_game', name: 'Chipping', duration: 40, status: 'pending', description: 'Chip fra tight lie og fringe.' },
      ],
    },
    {
      dayName: 'Fredag',
      date: '2026-01-02',
      isToday: false,
      isCompleted: false,
      sessions: [
        { id: 's8', type: 'physical', name: 'Mobilitet', duration: 45, status: 'pending', description: 'Dynamisk stretching og mobilitetstrening.' },
        { id: 's9', type: 'mental', name: 'Mental forberedelse', duration: 30, status: 'pending', description: 'Pre-round rutine og fokusøvelser.' },
      ],
    },
    {
      dayName: 'Lørdag',
      date: '2026-01-03',
      isToday: false,
      isCompleted: false,
      sessions: [
        { id: 's10', type: 'technical', name: 'Simulert runde', duration: 150, status: 'pending', description: 'Full 18-hulls simulering på TrackMan.', exercises: ['Pre-shot rutine', 'Course management', 'Scoring fokus'] },
      ],
    },
    {
      dayName: 'Søndag',
      date: '2026-01-04',
      isToday: false,
      isCompleted: false,
      sessions: [
        { id: 's11', type: 'rest', name: 'Hviledag', duration: 0, status: 'pending' },
      ],
    },
  ],
  weeklyGoals: [
    { text: 'Gjennomføre alle planlagte styrkeøkter', progress: 50 },
    { text: 'Minimum 200 baller med driver', progress: 75 },
    { text: '2 timer putting-trening', progress: 30 },
  ],
  stats: {
    technicalHours: 6,
    physicalHours: 2,
    mentalHours: 1,
    shortGameHours: 1.5,
    restDays: 2,
  },
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const getSessionTypeConfig = (type) => {
  return SESSION_TYPE_CLASSES[type] || SESSION_TYPE_CLASSES.rest;
};

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('nb-NO', { day: 'numeric' });
};

const formatFullDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('nb-NO', { weekday: 'long', day: 'numeric', month: 'long' });
};

// ============================================================================
// SESSION CHIP COMPONENT (Notion-style)
// ============================================================================

const SessionChip = ({ session, isSelected, onClick }) => {
  const config = getSessionTypeConfig(session.type);
  const Icon = config.icon;
  const isRest = session.type === 'rest';
  const isCompleted = session.status === 'completed';

  if (isRest) {
    return (
      <div className="py-1.5 px-2.5 text-xs text-ak-text-secondary italic">
        Hviledag
      </div>
    );
  }

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick(session);
      }}
      className={`flex items-center gap-1.5 py-1.5 px-2.5 border-none rounded-md text-xs font-medium cursor-pointer w-full text-left transition-all duration-150 ${
        isSelected
          ? `${config.activeBg} text-white`
          : `${config.bg} ${config.text} hover:${config.activeBg} hover:text-white`
      } ${isCompleted ? 'opacity-70 line-through' : ''}`}
    >
      {isCompleted ? <CheckCircle size={12} /> : <Icon size={12} />}
      <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
        {session.name}
      </span>
      <span className="text-[10px] opacity-80">
        {session.duration}m
      </span>
    </button>
  );
};

// ============================================================================
// DAY COLUMN COMPONENT (Notion-style)
// ============================================================================

const DayColumn = ({ day, selectedSessionId, onSessionClick }) => {
  const isToday = day.isToday;
  const dayNumber = formatDate(day.date);
  const dayName = day.dayName.slice(0, 3);

  return (
    <div className="flex-1 min-w-0 border-r border-ak-border-default flex flex-col">
      {/* Day Header */}
      <div className={`py-3 px-2 border-b border-ak-border-default text-center relative ${
        isToday ? 'bg-ak-brand-primary/5' : ''
      }`}>
        {isToday && (
          <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-ak-brand-primary" />
        )}
        <div className={`text-[11px] font-medium uppercase tracking-wide ${
          isToday ? 'text-ak-brand-primary' : 'text-ak-text-secondary'
        }`}>
          {dayName}
        </div>
        <div className={`text-xl font-semibold mt-0.5 ${
          isToday ? 'text-ak-brand-primary' : 'text-ak-text-primary'
        }`}>
          {dayNumber}
        </div>
        {isToday && (
          <div className="mt-1 text-[9px] font-semibold text-ak-brand-primary uppercase tracking-wide">
            I dag
          </div>
        )}
      </div>

      {/* Sessions */}
      <div className={`flex-1 p-2 flex flex-col gap-1.5 min-h-[120px] ${
        day.isCompleted ? 'bg-ak-surface-subtle' : ''
      }`}>
        {day.sessions.map((session) => (
          <SessionChip
            key={session.id}
            session={session}
            isSelected={selectedSessionId === session.id}
            onClick={onSessionClick}
          />
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// SESSION SIDEBAR DRAWER COMPONENT
// ============================================================================

const SessionSidebarDrawer = ({ isOpen, session, onClose, allSessions, onSessionSelect }) => {
  const drawerRef = useRef(null);
  const config = session ? getSessionTypeConfig(session.type) : null;

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target) && isOpen) {
        if (e.target.closest('[data-session-chip]')) return;
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/10 transition-all duration-200 z-40 ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <aside
        ref={drawerRef}
        role="complementary"
        aria-label="Øktdetaljer"
        className={`fixed top-0 left-0 bottom-0 w-[380px] bg-ak-surface-base z-50 flex flex-col overflow-hidden transition-transform duration-[250ms] ${
          isOpen ? 'translate-x-0 shadow-xl' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between py-4 px-5 border-b border-ak-border-default">
          <h2 className="text-sm font-semibold text-ak-text-primary m-0">
            {session ? 'Øktdetaljer' : 'Oversikt'}
          </h2>
          <button
            onClick={onClose}
            aria-label="Lukk sidebar"
            className="flex items-center justify-center w-8 h-8 border-none bg-transparent rounded-md cursor-pointer text-ak-text-secondary hover:bg-ak-surface-subtle"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-5">
          {session ? (
            // Session Details View
            <div>
              {/* Session Title */}
              <div className="mb-5">
                <div className={`inline-flex items-center gap-1.5 py-1 px-2.5 ${config.bg} ${config.text} rounded-md text-[11px] font-semibold mb-3`}>
                  {React.createElement(config.icon, { size: 12 })}
                  {config.label}
                </div>
                <h3 className="text-xl font-semibold text-ak-text-primary m-0">
                  {session.name}
                </h3>
              </div>

              {/* Metadata */}
              <div className="flex flex-col gap-3 p-4 bg-ak-surface-subtle rounded-lg mb-5">
                <div className="flex items-center gap-2.5">
                  <Calendar size={14} className="text-ak-text-secondary" />
                  <span className="text-[13px] text-ak-text-primary">
                    {formatFullDate(WEEK_DATA.days.find(d => d.sessions.some(s => s.id === session.id))?.date)}
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock size={14} className="text-ak-text-secondary" />
                  <span className="text-[13px] text-ak-text-primary">
                    {session.duration} minutter
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  {session.status === 'completed' ? (
                    <>
                      <CheckCircle size={14} className="text-ak-status-success" />
                      <span className="text-[13px] text-ak-status-success font-medium">
                        Fullført
                      </span>
                    </>
                  ) : session.status === 'in_progress' ? (
                    <>
                      <div className="w-3.5 h-3.5 rounded-full bg-ak-info" />
                      <span className="text-[13px] text-ak-info font-medium">
                        Pågår
                      </span>
                    </>
                  ) : (
                    <>
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-ak-text-secondary" />
                      <span className="text-[13px] text-ak-text-secondary">
                        Planlagt
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Description */}
              {session.description && (
                <div className="mb-5">
                  <h4 className="text-xs font-semibold text-ak-text-secondary uppercase tracking-wide mb-2">
                    Beskrivelse
                  </h4>
                  <p className="text-sm text-ak-text-primary leading-relaxed m-0">
                    {session.description}
                  </p>
                </div>
              )}

              {/* Exercises */}
              {session.exercises && session.exercises.length > 0 && (
                <div className="mb-5">
                  <h4 className="text-xs font-semibold text-ak-text-secondary uppercase tracking-wide mb-2">
                    Øvelser
                  </h4>
                  <ul className="m-0 p-0 list-none">
                    {session.exercises.map((exercise, idx) => (
                      <li
                        key={idx}
                        className={`flex items-center gap-2.5 py-2.5 ${
                          idx < session.exercises.length - 1 ? 'border-b border-ak-border-default' : ''
                        }`}
                      >
                        <div className={`w-1.5 h-1.5 rounded-full ${config.activeBg} shrink-0`} />
                        <span className="text-[13px] text-ak-text-primary">
                          {exercise}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col gap-2">
                {session.status !== 'completed' && (
                  <button className="flex items-center justify-center gap-2 py-3 px-4 bg-ak-brand-primary text-white border-none rounded-lg text-sm font-medium cursor-pointer">
                    <CheckCircle size={16} />
                    Marker som fullført
                  </button>
                )}
                <button className="flex items-center justify-center gap-2 py-3 px-4 bg-transparent text-ak-text-primary border border-ak-border-default rounded-lg text-sm font-medium cursor-pointer">
                  <FileText size={16} />
                  Legg til notat
                </button>
              </div>
            </div>
          ) : (
            // Overview View (when no session selected)
            <div>
              {/* Today's Sessions */}
              <div className="mb-6">
                <h4 className="text-xs font-semibold text-ak-text-secondary uppercase tracking-wide mb-3">
                  Dagens økter
                </h4>
                <div className="flex flex-col gap-2">
                  {allSessions
                    .filter(s => {
                      const day = WEEK_DATA.days.find(d => d.sessions.some(sess => sess.id === s.id));
                      return day?.isToday;
                    })
                    .map(sess => {
                      const cfg = getSessionTypeConfig(sess.type);
                      return (
                        <button
                          key={sess.id}
                          onClick={() => onSessionSelect(sess)}
                          className="flex items-center gap-2.5 p-3 bg-ak-surface-subtle border-none rounded-lg cursor-pointer text-left w-full"
                        >
                          <div className={`w-8 h-8 rounded-md ${cfg.bg} flex items-center justify-center`}>
                            {React.createElement(cfg.icon, { size: 16, className: cfg.text })}
                          </div>
                          <div className="flex-1">
                            <div className="text-[13px] font-medium text-ak-text-primary">
                              {sess.name}
                            </div>
                            <div className="text-xs text-ak-text-secondary">
                              {sess.duration} min
                            </div>
                          </div>
                          <ChevronRight size={16} className="text-ak-text-secondary" />
                        </button>
                      );
                    })}
                  {allSessions.filter(s => {
                    const day = WEEK_DATA.days.find(d => d.sessions.some(sess => sess.id === s.id));
                    return day?.isToday;
                  }).length === 0 && (
                    <p className="text-[13px] text-ak-text-secondary italic">
                      Ingen økter planlagt i dag
                    </p>
                  )}
                </div>
              </div>

              {/* Week Summary */}
              <div className="mb-6">
                <h4 className="text-xs font-semibold text-ak-text-secondary uppercase tracking-wide mb-3">
                  Ukeoversikt
                </h4>
                <div className="p-4 bg-ak-surface-subtle rounded-lg">
                  <div className="flex justify-between mb-3">
                    <span className="text-[13px] text-ak-text-secondary">Fullført</span>
                    <span className="text-sm font-semibold text-ak-text-primary">
                      {WEEK_DATA.completedHours}t / {WEEK_DATA.totalPlannedHours}t
                    </span>
                  </div>
                  <div className="h-1.5 bg-ak-border-default rounded-sm overflow-hidden">
                    <div
                      className="h-full bg-ak-brand-primary rounded-sm"
                      style={{ width: `${(WEEK_DATA.completedHours / WEEK_DATA.totalPlannedHours) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <h4 className="text-xs font-semibold text-ak-text-secondary uppercase tracking-wide mb-3">
                  Kategorier
                </h4>
                <div className="flex flex-wrap gap-2">
                  {['technical', 'physical', 'mental', 'short_game'].map(type => {
                    const cfg = getSessionTypeConfig(type);
                    return (
                      <div
                        key={type}
                        className={`flex items-center gap-1.5 py-1.5 px-3 ${cfg.bg} rounded-md text-xs font-medium ${cfg.text}`}
                      >
                        {React.createElement(cfg.icon, { size: 12 })}
                        {cfg.label}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

// ============================================================================
// WEEK STATS BAR (Notion-style minimal)
// ============================================================================

const WeekStatsBar = ({ stats, completedHours, totalHours }) => {
  const progressPercent = Math.round((completedHours / totalHours) * 100);

  return (
    <div className="flex items-center gap-6 py-3 px-5 bg-ak-surface-base border-b border-ak-border-default text-[13px]">
      <div className="flex items-center gap-2">
        <span className="text-ak-text-secondary">Fremgang:</span>
        <span className="font-semibold text-ak-text-primary">{progressPercent}%</span>
        <div className="w-20 h-1 bg-ak-border-default rounded-sm overflow-hidden">
          <div
            className="h-full bg-ak-brand-primary rounded-sm"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="w-px h-4 bg-ak-border-default" />

      <div className="flex items-center gap-1.5">
        <Clock size={14} className="text-ak-text-secondary" />
        <span className="text-ak-text-secondary">{completedHours}t fullført</span>
        <span className="text-ak-text-secondary/50">/</span>
        <span className="text-ak-text-secondary">{totalHours}t planlagt</span>
      </div>

      <div className="w-px h-4 bg-ak-border-default" />

      <div className="flex items-center gap-3">
        {[
          { type: 'technical', hours: stats.technicalHours },
          { type: 'physical', hours: stats.physicalHours },
          { type: 'mental', hours: stats.mentalHours },
          { type: 'short_game', hours: stats.shortGameHours },
        ].map(({ type, hours }) => {
          const cfg = getSessionTypeConfig(type);
          return (
            <div key={type} className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-sm ${cfg.activeBg}`} />
              <span className="text-ak-text-secondary">{hours}t</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const UkensTreningsplanContainer = () => {
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const weekDates = getWeekDates(weekOffset);
  const startDate = weekDates[0].toLocaleDateString('nb-NO', { day: 'numeric', month: 'short' });
  const endDate = weekDates[6].toLocaleDateString('nb-NO', { day: 'numeric', month: 'short' });

  // Get all sessions flat
  const allSessions = WEEK_DATA.days.flatMap(day => day.sessions);
  const selectedSession = allSessions.find(s => s.id === selectedSessionId);

  const handleSessionClick = useCallback((session) => {
    setSelectedSessionId(session.id);
    setIsSidebarOpen(true);
  }, []);

  const handleCloseSidebar = useCallback(() => {
    setIsSidebarOpen(false);
    setTimeout(() => setSelectedSessionId(null), 200);
  }, []);

  const handleToggleSidebar = useCallback(() => {
    if (isSidebarOpen) {
      handleCloseSidebar();
    } else {
      setSelectedSessionId(null);
      setIsSidebarOpen(true);
    }
  }, [isSidebarOpen, handleCloseSidebar]);

  return (
    <div className="min-h-screen bg-ak-surface-base">
      {/* Page Header */}
      <PageHeader
        title="Ukens treningsplan"
        subtitle="Din plan for denne uken"
      />

      {/* AI Coach Guide */}
      <div className="px-5 mb-3">
        <AICoachGuide config={GUIDE_PRESETS.weeklyPlan} variant="compact" />
      </div>

      {/* Navigation Bar */}
      <div className="flex items-center justify-between py-3 px-5 border-b border-ak-border-default bg-ak-surface-base">
        <div className="flex items-center gap-3">
          {/* Sidebar Toggle */}
          <button
            onClick={handleToggleSidebar}
            className={`flex items-center justify-center w-8 h-8 border border-ak-border-default rounded-md cursor-pointer text-ak-text-secondary ${
              isSidebarOpen ? 'bg-ak-surface-subtle' : 'bg-ak-surface-base'
            }`}
            aria-label="Toggle sidebar"
          >
            <MoreHorizontal size={16} />
          </button>

          {/* Week Navigation */}
          <button
            onClick={() => setWeekOffset(weekOffset - 1)}
            className="flex items-center justify-center w-8 h-8 border border-ak-border-default rounded-md bg-ak-surface-base cursor-pointer text-ak-text-primary"
            aria-label="Forrige uke"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => setWeekOffset(weekOffset + 1)}
            className="flex items-center justify-center w-8 h-8 border border-ak-border-default rounded-md bg-ak-surface-base cursor-pointer text-ak-text-primary"
            aria-label="Neste uke"
          >
            <ChevronRight size={16} />
          </button>

          {/* Week Info */}
          <div className="ml-2">
            <span className="text-[15px] font-semibold text-ak-text-primary">
              Uke {WEEK_DATA.weekNumber}
            </span>
            <span className="text-sm text-ak-text-secondary ml-2">
              {startDate} – {endDate}
            </span>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 py-1.5 px-3 bg-ak-brand-primary/10 rounded-md text-xs font-medium text-ak-brand-primary">
            <Calendar size={12} />
            {WEEK_DATA.period}
          </div>

          <button className="flex items-center gap-1.5 py-2 px-3.5 bg-ak-text-primary text-white border-none rounded-md text-[13px] font-medium cursor-pointer">
            <Plus size={14} />
            Legg til økt
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <WeekStatsBar
        stats={WEEK_DATA.stats}
        completedHours={WEEK_DATA.completedHours}
        totalHours={WEEK_DATA.totalPlannedHours}
      />

      {/* Calendar Grid */}
      <div className="flex border-b border-ak-border-default min-h-[calc(100vh-280px)]">
        {WEEK_DATA.days.map((day, idx) => (
          <DayColumn
            key={idx}
            day={day}
            selectedSessionId={selectedSessionId}
            onSessionClick={handleSessionClick}
          />
        ))}
      </div>

      {/* Sidebar Drawer */}
      <SessionSidebarDrawer
        isOpen={isSidebarOpen}
        session={selectedSession}
        onClose={handleCloseSidebar}
        allSessions={allSessions}
        onSessionSelect={handleSessionClick}
      />
    </div>
  );
};

export default UkensTreningsplanContainer;
