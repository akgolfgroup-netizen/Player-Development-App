import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Calendar, Clock, Target, CheckCircle, ChevronRight, ChevronLeft,
  Dumbbell, Brain, Flag, RotateCcw, Flame, X, Plus, FileText,
  MoreHorizontal
} from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { AICoachGuide } from '../ai-coach';
import { GUIDE_PRESETS } from '../ai-coach/types';
import { tokens } from '../../design-tokens';

// Session type color configuration using design tokens
const SESSION_COLORS = {
  technical: { color: tokens.colors.info, bgColor: 'rgba(2, 132, 199, 0.08)' },
  physical: { color: tokens.colors.error, bgColor: 'rgba(220, 38, 38, 0.08)' },
  mental: { color: tokens.colors.primaryLight, bgColor: 'rgba(42, 107, 85, 0.08)' },
  short_game: { color: tokens.colors.success, bgColor: 'rgba(5, 150, 105, 0.08)' },
  warmup: { color: tokens.colors.warning, bgColor: 'rgba(217, 119, 6, 0.08)' },
  rest: { color: tokens.colors.gray600, bgColor: tokens.colors.gray50 },
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
  const icons = {
    technical: Target,
    physical: Dumbbell,
    mental: Brain,
    short_game: Flag,
    warmup: Flame,
    rest: RotateCcw,
  };
  const labels = {
    technical: 'Teknikk',
    physical: 'Fysisk',
    mental: 'Mental',
    short_game: 'Kortspill',
    warmup: 'Oppvarming',
    rest: 'Hvile',
  };
  const colors = SESSION_COLORS[type] || SESSION_COLORS.rest;
  return {
    color: colors.color,
    bgColor: colors.bgColor,
    label: labels[type] || type,
    icon: icons[type] || Calendar,
  };
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
      <div
        style={{
          padding: '6px 10px',
          fontSize: '12px',
          color: tokens.colors.gray500,
          fontStyle: 'italic',
        }}
      >
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
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '6px 10px',
        backgroundColor: isSelected ? config.color : config.bgColor,
        color: isSelected ? tokens.colors.white : config.color,
        border: 'none',
        borderRadius: '6px',
        fontSize: '12px',
        fontWeight: 500,
        cursor: 'pointer',
        width: '100%',
        textAlign: 'left',
        transition: 'all 0.15s ease',
        opacity: isCompleted ? 0.7 : 1,
        textDecoration: isCompleted ? 'line-through' : 'none',
      }}
      onMouseEnter={(e) => {
        if (!isSelected) {
          e.currentTarget.style.backgroundColor = config.color;
          e.currentTarget.style.color = tokens.colors.white;
        }
      }}
      onMouseLeave={(e) => {
        if (!isSelected) {
          e.currentTarget.style.backgroundColor = config.bgColor;
          e.currentTarget.style.color = config.color;
        }
      }}
    >
      {isCompleted ? (
        <CheckCircle size={12} />
      ) : (
        <Icon size={12} />
      )}
      <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {session.name}
      </span>
      <span style={{ fontSize: '10px', opacity: 0.8 }}>
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
    <div
      style={{
        flex: 1,
        minWidth: 0,
        borderRight: `1px solid ${tokens.colors.gray300}`,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Day Header */}
      <div
        style={{
          padding: '12px 8px',
          borderBottom: `1px solid ${tokens.colors.gray300}`,
          textAlign: 'center',
          backgroundColor: isToday ? 'rgba(2, 132, 199, 0.06)' : 'transparent',
          position: 'relative',
        }}
      >
        {isToday && (
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: '3px',
              backgroundColor: tokens.colors.info,
            }}
          />
        )}
        <div
          style={{
            fontSize: '11px',
            fontWeight: 500,
            color: isToday ? tokens.colors.info : tokens.colors.gray600,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          {dayName}
        </div>
        <div
          style={{
            fontSize: '20px',
            fontWeight: 600,
            color: isToday ? tokens.colors.info : tokens.colors.ink,
            marginTop: '2px',
          }}
        >
          {dayNumber}
        </div>
        {isToday && (
          <div
            style={{
              marginTop: '4px',
              fontSize: '9px',
              fontWeight: 600,
              color: tokens.colors.info,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            I dag
          </div>
        )}
      </div>

      {/* Sessions */}
      <div
        style={{
          flex: 1,
          padding: '8px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          minHeight: '120px',
          backgroundColor: day.isCompleted ? tokens.colors.gray50 : 'transparent',
        }}
      >
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
        // Don't close if clicking on a session chip
        if (e.target.closest('[data-session-chip]')) return;
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  const config = session ? getSessionTypeConfig(session.type) : null;

  return (
    <>
      {/* Backdrop */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
          opacity: isOpen ? 1 : 0,
          visibility: isOpen ? 'visible' : 'hidden',
          transition: 'opacity 0.2s ease, visibility 0.2s ease',
          zIndex: 40,
        }}
        onClick={onClose}
      />

      {/* Drawer */}
      <aside
        ref={drawerRef}
        role="complementary"
        aria-label="Øktdetaljer"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          width: '380px',
          backgroundColor: tokens.colors.white,
          boxShadow: isOpen ? '4px 0 24px rgba(0, 0, 0, 0.1)' : 'none',
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.25s ease',
          zIndex: 50,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            borderBottom: `1px solid ${tokens.colors.gray300}`,
          }}
        >
          <h2
            style={{
              fontSize: '14px',
              fontWeight: 600,
              color: tokens.colors.ink,
              margin: 0,
            }}
          >
            {session ? 'Øktdetaljer' : 'Oversikt'}
          </h2>
          <button
            onClick={onClose}
            aria-label="Lukk sidebar"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              border: 'none',
              backgroundColor: 'transparent',
              borderRadius: '6px',
              cursor: 'pointer',
              color: tokens.colors.gray600,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = tokens.colors.gray100;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflow: 'auto', padding: '20px' }}>
          {session ? (
            // Session Details View
            <div>
              {/* Session Title */}
              <div style={{ marginBottom: '20px' }}>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 10px',
                    backgroundColor: config.bgColor,
                    color: config.color,
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: 600,
                    marginBottom: '12px',
                  }}
                >
                  {React.createElement(config.icon, { size: 12 })}
                  {config.label}
                </div>
                <h3
                  style={{
                    fontSize: '20px',
                    fontWeight: 600,
                    color: tokens.colors.ink,
                    margin: 0,
                  }}
                >
                  {session.name}
                </h3>
              </div>

              {/* Metadata */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  padding: '16px',
                  backgroundColor: tokens.colors.gray50,
                  borderRadius: '8px',
                  marginBottom: '20px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Calendar size={14} color={tokens.colors.gray600} />
                  <span style={{ fontSize: '13px', color: tokens.colors.gray700 }}>
                    {formatFullDate(WEEK_DATA.days.find(d => d.sessions.some(s => s.id === session.id))?.date)}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Clock size={14} color={tokens.colors.gray600} />
                  <span style={{ fontSize: '13px', color: tokens.colors.gray700 }}>
                    {session.duration} minutter
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {session.status === 'completed' ? (
                    <>
                      <CheckCircle size={14} color={tokens.colors.success} />
                      <span style={{ fontSize: '13px', color: tokens.colors.success, fontWeight: 500 }}>
                        Fullført
                      </span>
                    </>
                  ) : session.status === 'in_progress' ? (
                    <>
                      <div style={{ width: 14, height: 14, borderRadius: '50%', backgroundColor: tokens.colors.info }} />
                      <span style={{ fontSize: '13px', color: tokens.colors.info, fontWeight: 500 }}>
                        Pågår
                      </span>
                    </>
                  ) : (
                    <>
                      <div style={{ width: 14, height: 14, borderRadius: '50%', border: `2px solid ${tokens.colors.gray400}` }} />
                      <span style={{ fontSize: '13px', color: tokens.colors.gray600 }}>
                        Planlagt
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Description */}
              {session.description && (
                <div style={{ marginBottom: '20px' }}>
                  <h4
                    style={{
                      fontSize: '12px',
                      fontWeight: 600,
                      color: tokens.colors.gray600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      marginBottom: '8px',
                    }}
                  >
                    Beskrivelse
                  </h4>
                  <p
                    style={{
                      fontSize: '14px',
                      color: tokens.colors.gray700,
                      lineHeight: 1.6,
                      margin: 0,
                    }}
                  >
                    {session.description}
                  </p>
                </div>
              )}

              {/* Exercises */}
              {session.exercises && session.exercises.length > 0 && (
                <div style={{ marginBottom: '20px' }}>
                  <h4
                    style={{
                      fontSize: '12px',
                      fontWeight: 600,
                      color: tokens.colors.gray600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      marginBottom: '8px',
                    }}
                  >
                    Øvelser
                  </h4>
                  <ul
                    style={{
                      margin: 0,
                      padding: 0,
                      listStyle: 'none',
                    }}
                  >
                    {session.exercises.map((exercise, idx) => (
                      <li
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '10px 0',
                          borderBottom: idx < session.exercises.length - 1 ? `1px solid ${tokens.colors.gray300}` : 'none',
                        }}
                      >
                        <div
                          style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            backgroundColor: config.color,
                            flexShrink: 0,
                          }}
                        />
                        <span style={{ fontSize: '13px', color: tokens.colors.gray700 }}>
                          {exercise}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Actions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {session.status !== 'completed' && (
                  <button
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      padding: '12px 16px',
                      backgroundColor: tokens.colors.info,
                      color: tokens.colors.white,
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: 500,
                      cursor: 'pointer',
                    }}
                  >
                    <CheckCircle size={16} />
                    Marker som fullført
                  </button>
                )}
                <button
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '12px 16px',
                    backgroundColor: 'transparent',
                    color: tokens.colors.gray700,
                    border: `1px solid ${tokens.colors.gray300}`,
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                >
                  <FileText size={16} />
                  Legg til notat
                </button>
              </div>
            </div>
          ) : (
            // Overview View (when no session selected)
            <div>
              {/* Today's Sessions */}
              <div style={{ marginBottom: '24px' }}>
                <h4
                  style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: tokens.colors.gray600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: '12px',
                  }}
                >
                  Dagens økter
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {allSessions
                    .filter(s => {
                      const day = WEEK_DATA.days.find(d => d.sessions.some(sess => sess.id === s.id));
                      return day?.isToday;
                    })
                    .map(session => {
                      const cfg = getSessionTypeConfig(session.type);
                      return (
                        <button
                          key={session.id}
                          onClick={() => onSessionSelect(session)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '12px',
                            backgroundColor: tokens.colors.gray50,
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            textAlign: 'left',
                            width: '100%',
                          }}
                        >
                          <div
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '6px',
                              backgroundColor: cfg.bgColor,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            {React.createElement(cfg.icon, { size: 16, color: cfg.color })}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '13px', fontWeight: 500, color: tokens.colors.ink }}>
                              {session.name}
                            </div>
                            <div style={{ fontSize: '12px', color: tokens.colors.gray600 }}>
                              {session.duration} min
                            </div>
                          </div>
                          <ChevronRight size={16} color={tokens.colors.gray500} />
                        </button>
                      );
                    })}
                  {allSessions.filter(s => {
                    const day = WEEK_DATA.days.find(d => d.sessions.some(sess => sess.id === s.id));
                    return day?.isToday;
                  }).length === 0 && (
                    <p style={{ fontSize: '13px', color: tokens.colors.gray600, fontStyle: 'italic' }}>
                      Ingen økter planlagt i dag
                    </p>
                  )}
                </div>
              </div>

              {/* Week Summary */}
              <div style={{ marginBottom: '24px' }}>
                <h4
                  style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: tokens.colors.gray600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: '12px',
                  }}
                >
                  Ukeoversikt
                </h4>
                <div
                  style={{
                    padding: '16px',
                    backgroundColor: tokens.colors.gray50,
                    borderRadius: '8px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ fontSize: '13px', color: tokens.colors.gray600 }}>Fullført</span>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: tokens.colors.ink }}>
                      {WEEK_DATA.completedHours}t / {WEEK_DATA.totalPlannedHours}t
                    </span>
                  </div>
                  <div
                    style={{
                      height: '6px',
                      backgroundColor: tokens.colors.gray300,
                      borderRadius: '3px',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: `${(WEEK_DATA.completedHours / WEEK_DATA.totalPlannedHours) * 100}%`,
                        backgroundColor: tokens.colors.info,
                        borderRadius: '3px',
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <h4
                  style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: tokens.colors.gray600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: '12px',
                  }}
                >
                  Kategorier
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {['technical', 'physical', 'mental', 'short_game'].map(type => {
                    const cfg = getSessionTypeConfig(type);
                    return (
                      <div
                        key={type}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '6px 12px',
                          backgroundColor: cfg.bgColor,
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: 500,
                          color: cfg.color,
                        }}
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
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '24px',
        padding: '12px 20px',
        backgroundColor: tokens.colors.white,
        borderBottom: `1px solid ${tokens.colors.gray300}`,
        fontSize: '13px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ color: tokens.colors.gray600 }}>Fremgang:</span>
        <span style={{ fontWeight: 600, color: tokens.colors.ink }}>{progressPercent}%</span>
        <div
          style={{
            width: '80px',
            height: '4px',
            backgroundColor: tokens.colors.gray300,
            borderRadius: '2px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${progressPercent}%`,
              backgroundColor: tokens.colors.info,
              borderRadius: '2px',
            }}
          />
        </div>
      </div>

      <div style={{ width: '1px', height: '16px', backgroundColor: tokens.colors.gray300 }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <Clock size={14} color={tokens.colors.gray600} />
        <span style={{ color: tokens.colors.gray600 }}>{completedHours}t fullført</span>
        <span style={{ color: tokens.colors.gray500 }}>/</span>
        <span style={{ color: tokens.colors.gray600 }}>{totalHours}t planlagt</span>
      </div>

      <div style={{ width: '1px', height: '16px', backgroundColor: tokens.colors.gray300 }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {[
          { type: 'technical', hours: stats.technicalHours },
          { type: 'physical', hours: stats.physicalHours },
          { type: 'mental', hours: stats.mentalHours },
          { type: 'short_game', hours: stats.shortGameHours },
        ].map(({ type, hours }) => {
          const cfg = getSessionTypeConfig(type);
          return (
            <div
              key={type}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '2px',
                  backgroundColor: cfg.color,
                }}
              />
              <span style={{ color: tokens.colors.gray600 }}>{hours}t</span>
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
    // Delay clearing selection for smooth animation
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
    <div style={{ minHeight: '100vh', backgroundColor: tokens.colors.white }}>
      {/* Page Header */}
      <PageHeader
        title="Ukens treningsplan"
        subtitle="Din plan for denne uken"
      />

      {/* AI Coach Guide */}
      <div style={{ padding: '0 20px', marginBottom: '12px' }}>
        <AICoachGuide config={GUIDE_PRESETS.weeklyPlan} variant="compact" />
      </div>

      {/* Navigation Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 20px',
          borderBottom: `1px solid ${tokens.colors.gray300}`,
          backgroundColor: tokens.colors.white,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Sidebar Toggle */}
          <button
            onClick={handleToggleSidebar}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              border: `1px solid ${tokens.colors.gray300}`,
              borderRadius: '6px',
              backgroundColor: isSidebarOpen ? tokens.colors.gray100 : tokens.colors.white,
              cursor: 'pointer',
              color: tokens.colors.gray600,
            }}
            aria-label="Toggle sidebar"
          >
            <MoreHorizontal size={16} />
          </button>

          {/* Week Navigation */}
          <button
            onClick={() => setWeekOffset(weekOffset - 1)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              border: `1px solid ${tokens.colors.gray300}`,
              borderRadius: '6px',
              backgroundColor: tokens.colors.white,
              cursor: 'pointer',
              color: tokens.colors.gray700,
            }}
            aria-label="Forrige uke"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => setWeekOffset(weekOffset + 1)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              border: `1px solid ${tokens.colors.gray300}`,
              borderRadius: '6px',
              backgroundColor: tokens.colors.white,
              cursor: 'pointer',
              color: tokens.colors.gray700,
            }}
            aria-label="Neste uke"
          >
            <ChevronRight size={16} />
          </button>

          {/* Week Info */}
          <div style={{ marginLeft: '8px' }}>
            <span
              style={{
                fontSize: '15px',
                fontWeight: 600,
                color: tokens.colors.ink,
              }}
            >
              Uke {WEEK_DATA.weekNumber}
            </span>
            <span
              style={{
                fontSize: '14px',
                color: tokens.colors.gray600,
                marginLeft: '8px',
              }}
            >
              {startDate} – {endDate}
            </span>
          </div>
        </div>

        {/* Right Side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              backgroundColor: 'rgba(2, 132, 199, 0.08)',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 500,
              color: tokens.colors.info,
            }}
          >
            <Calendar size={12} />
            {WEEK_DATA.period}
          </div>

          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              backgroundColor: tokens.colors.ink,
              color: tokens.colors.white,
              border: 'none',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
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
      <div
        style={{
          display: 'flex',
          borderBottom: `1px solid ${tokens.colors.gray300}`,
          minHeight: 'calc(100vh - 280px)',
        }}
      >
        {WEEK_DATA.days.map((day, idx) => (
          <DayColumn
            key={idx}
            day={day}
            selectedSessionId={selectedSessionId}
            onSessionClick={handleSessionClick}
          />
        ))}
        {/* Remove last border */}
        <style>{`
          .week-grid > div:last-child {
            border-right: none;
          }
        `}</style>
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
