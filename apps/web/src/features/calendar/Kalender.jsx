import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { tokens } from '../../design-tokens';
import Button from '../../ui/primitives/Button';

// Import view components
import DayView from './views/DayView';
import MonthView from './views/MonthView';
import YearView from './views/YearView';
import SessionPreviewModal from './components/SessionPreviewModal';

// ===== VIEW CONSTANTS =====
const VIEW_MODES = {
  DAY: 'day',
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year'
};

// ===== HELPER COMPONENTS =====
const ViewToggle = ({ currentView, onChange }) => {
  const views = [
    { id: VIEW_MODES.DAY, label: 'Dag' },
    { id: VIEW_MODES.WEEK, label: 'Uke' },
    { id: VIEW_MODES.MONTH, label: 'Måned' },
    { id: VIEW_MODES.YEAR, label: 'År' },
  ];

  return (
    <div className="flex bg-ak-snow rounded-xl p-1">
      {views.map(view => (
        <button
          key={view.id}
          onClick={() => onChange(view.id)}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
            currentView === view.id
              ? 'bg-ak-primary text-white shadow-sm'
              : 'text-ak-charcoal hover:bg-ak-mist'
          }`}
        >
          {view.label}
        </button>
      ))}
    </div>
  );
};

const LevelTag = ({ level }) => {
  const config = {
    L1: { bg: tokens.colors.snow, text: tokens.colors.steel },
    L2: { bg: tokens.colors.mist, text: tokens.colors.charcoal },
    L3: { bg: `${tokens.colors.success}20`, text: tokens.colors.primaryLight },
    L4: { bg: tokens.colors.success, text: tokens.colors.white },
    L5: { bg: tokens.colors.primary, text: tokens.colors.white },
  };
  const { bg, text } = config[level] || config.L3;

  return (
    <span className="px-1.5 py-0.5 rounded text-[10px] font-medium" style={{ backgroundColor: bg, color: text }}>
      {level}
    </span>
  );
};

// ===== WEEK VIEW COMPONENT =====
const WeekView = ({ currentDate, sessions, selectedDate, onDateSelect, onSessionClick }) => {
  const weekDays = ['Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør', 'Søn'];

  const getWeekDates = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(d.setDate(diff));

    return Array.from({ length: 7 }, (_, i) => {
      const weekDate = new Date(monday);
      weekDate.setDate(monday.getDate() + i);
      return weekDate;
    });
  };

  const weekDates = getWeekDates(currentDate);
  const today = new Date();

  const getSessionColor = (type) => {
    // Use semantic session tokens from design system
    const colors = {
      teknikk: 'var(--ak-session-teknikk)',
      golfslag: 'var(--ak-session-golfslag)',
      spill: 'var(--ak-session-spill)',
      konkurranse: 'var(--ak-session-kompetanse)',
      fysisk: 'var(--ak-session-fysisk)',
      mental: 'var(--text-muted)',
    };
    return colors[type] || 'var(--text-tertiary)';
  };

  const getDayStats = (date) => {
    const day = date.getDate();
    const daySessions = sessions[day] || [];
    const completed = daySessions.filter(s => s.status === 'completed').length;
    const total = daySessions.length;
    return { completed, total };
  };

  return (
    <div className="bg-white rounded-xl border border-ak-mist overflow-hidden">
      {/* Day Headers */}
      <div className="grid grid-cols-7 border-b border-ak-mist">
        {weekDays.map((day, idx) => {
          const date = weekDates[idx];
          const isToday = date.toDateString() === today.toDateString();
          const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
          const stats = getDayStats(date);

          return (
            <div
              key={day}
              className={`p-3 text-center border-r border-ak-mist last:border-r-0 cursor-pointer transition-colors ${
                isSelected ? 'bg-ak-primary/5' : 'hover:bg-ak-snow'
              }`}
              onClick={() => onDateSelect(date)}
            >
              <p className="text-xs text-ak-steel mb-1">{day}</p>
              <p className={`text-lg font-semibold ${
                isToday ? 'text-ak-primary' : isSelected ? 'text-ak-primary' : 'text-ak-charcoal'
              }`}>
                {date.getDate()}
              </p>
              {stats.total > 0 && (
                <div className="mt-1 flex justify-center gap-1">
                  <span className={`text-[10px] ${stats.completed === stats.total ? 'text-ak-success' : 'text-ak-steel'}`}>
                    {stats.completed}/{stats.total}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Time Grid */}
      <div className="grid grid-cols-7 min-h-[400px]">
        {weekDates.map((date, dayIdx) => {
          const day = date.getDate();
          const daySessions = sessions[day] || [];
          const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();

          return (
            <div
              key={dayIdx}
              className={`border-r border-ak-mist last:border-r-0 p-2 ${
                isSelected ? 'bg-ak-primary/5' : ''
              }`}
            >
              {daySessions.length === 0 ? (
                <div className="h-full flex items-center justify-center">
                  <span className="text-xs text-ak-mist">-</span>
                </div>
              ) : (
                <div className="space-y-2">
                  {daySessions.map(session => (
                    <div
                      key={session.id}
                      className={`p-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                        session.status === 'completed' ? 'opacity-70' : ''
                      }`}
                      style={{
                        backgroundColor: `${getSessionColor(session.type)}15`,
                        borderLeft: `3px solid ${getSessionColor(session.type)}`
                      }}
                      onClick={() => onSessionClick(session, date)}
                    >
                      <span className="text-[10px] text-ak-steel block">{session.time}</span>
                      <p className="text-xs font-medium text-ak-charcoal line-clamp-2">{session.name}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <LevelTag level={session.level} />
                        {session.duration > 0 && (
                          <span className="text-[9px] text-ak-steel">{session.duration}m</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ===== MAIN CALENDAR COMPONENT =====
const AKGolfKalender = ({ events = [] }) => {
  const navigate = useNavigate();
  const today = new Date();

  // State
  const [currentDate, setCurrentDate] = useState(today);
  const [selectedDate, setSelectedDate] = useState(today);
  const [viewMode, setViewMode] = useState(VIEW_MODES.WEEK);
  const [previewSession, setPreviewSession] = useState(null);
  const [showSessionModal, setShowSessionModal] = useState(false);

  // Session form state for editing/creating
  const [sessionForm, setSessionForm] = useState({
    date: today.getDate(),
    time: '',
    name: '',
    type: 'teknikk',
    duration: 60,
    level: 'L3',
    status: 'upcoming',
    location: ''
  });
  const [editingSession, setEditingSession] = useState(null);

  const monthNames = ['Januar', 'Februar', 'Mars', 'April', 'Mai', 'Juni',
                      'Juli', 'August', 'September', 'Oktober', 'November', 'Desember'];

  // Demo sessions data
  const demoSessions = {
    [today.getDate() - 3]: [
      { id: 1, time: '08:00', name: 'WANG Trening', type: 'teknikk', duration: 120, level: 'L3', status: 'completed', location: 'Indoor Range' },
      { id: 2, time: '15:00', name: 'Fysisk trening', type: 'fysisk', duration: 45, level: 'L2', status: 'completed', location: 'Gym' }
    ],
    [today.getDate() - 2]: [
      { id: 3, time: '10:00', name: 'Teknisk økt - Driver', type: 'teknikk', duration: 90, level: 'L3', status: 'completed', location: 'Driving Range' },
    ],
    [today.getDate() - 1]: [
      { id: 4, time: '08:00', name: 'Hviledag', type: 'mental', duration: 0, level: 'L1', status: 'rest' }
    ],
    [today.getDate()]: [
      { id: 5, time: '08:00', name: 'WANG Morgentrim', type: 'fysisk', duration: 30, level: 'L2', status: 'upcoming', location: 'Gym' },
      { id: 6, time: '10:00', name: 'Langspill - Jern', type: 'teknikk', duration: 90, level: 'L3', status: 'upcoming', location: 'Driving Range', assignedByCoach: true },
    ],
    [today.getDate() + 1]: [
      { id: 7, time: '10:00', name: 'Benchmark Test', type: 'teknikk', duration: 120, level: 'L5', status: 'upcoming', location: 'Test Center', assignedByCoach: true }
    ],
    [today.getDate() + 2]: [
      { id: 8, time: '09:00', name: 'Spill 9 hull', type: 'spill', duration: 180, level: 'L5', status: 'upcoming', location: 'Banen' }
    ],
    [today.getDate() + 3]: [
      { id: 9, time: '14:00', name: 'Putting økt', type: 'golfslag', duration: 60, level: 'L4', status: 'upcoming', location: 'Putting Green' }
    ],
  };

  // Transform API events to sessions format
  const transformEventsToSessions = (apiEvents) => {
    if (!apiEvents || apiEvents.length === 0) return demoSessions;

    const grouped = {};
    apiEvents.forEach(event => {
      const eventDate = new Date(event.date || event.startTime);
      const day = eventDate.getDate();

      if (!grouped[day]) grouped[day] = [];

      grouped[day].push({
        id: event.id,
        time: event.time || eventDate.toTimeString().slice(0, 5),
        name: event.title || event.name,
        type: event.type || event.category || 'teknikk',
        duration: event.duration || 60,
        level: event.level || 'L3',
        status: event.status || 'upcoming',
        location: event.location || '',
        assignedByCoach: event.assignedByCoach || false,
      });
    });

    Object.keys(grouped).forEach(day => {
      grouped[day].sort((a, b) => a.time.localeCompare(b.time));
    });

    return grouped;
  };

  const [sessions, setSessions] = useState(() => transformEventsToSessions(events));

  useEffect(() => {
    if (events && events.length > 0) {
      setSessions(transformEventsToSessions(events));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [events]);

  // Get week number
  const getWeekNumber = (date) => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  };

  // Navigation handlers
  const navigate_calendar = (direction) => {
    const newDate = new Date(currentDate);

    switch (viewMode) {
      case VIEW_MODES.DAY:
        newDate.setDate(newDate.getDate() + direction);
        break;
      case VIEW_MODES.WEEK:
        newDate.setDate(newDate.getDate() + (direction * 7));
        break;
      case VIEW_MODES.MONTH:
        newDate.setMonth(newDate.getMonth() + direction);
        break;
      case VIEW_MODES.YEAR:
        newDate.setFullYear(newDate.getFullYear() + direction);
        break;
      default:
        break;
    }

    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  // Session handlers
  const handleSessionClick = (session, date) => {
    setPreviewSession({ ...session, date });
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    if (viewMode === VIEW_MODES.YEAR) {
      setViewMode(VIEW_MODES.MONTH);
      setCurrentDate(date);
    } else if (viewMode === VIEW_MODES.MONTH) {
      setViewMode(VIEW_MODES.WEEK);
      setCurrentDate(date);
    }
  };

  const openNewSession = () => {
    setSessionForm({
      date: selectedDate.getDate(),
      time: '',
      name: '',
      type: 'teknikk',
      duration: 60,
      level: 'L3',
      status: 'upcoming',
      location: ''
    });
    setEditingSession(null);
    setShowSessionModal(true);
  };

  const handleEditSession = (session) => {
    setSessionForm({
      date: session.date?.getDate() || selectedDate.getDate(),
      time: session.time,
      name: session.name,
      type: session.type,
      duration: session.duration,
      level: session.level,
      status: session.status,
      location: session.location || ''
    });
    setEditingSession(session);
    setPreviewSession(null);
    setShowSessionModal(true);
  };

  const handleDeleteSession = (session) => {
    if (!window.confirm('Er du sikker på at du vil slette denne økten?')) {
      return;
    }

    setSessions(prev => {
      const updated = { ...prev };
      const day = session.date?.getDate() || selectedDate.getDate();
      updated[day] = (updated[day] || []).filter(s => s.id !== session.id);
      if (updated[day].length === 0) {
        delete updated[day];
      }
      return updated;
    });

    setPreviewSession(null);
  };

  const handleSaveSession = () => {
    if (!sessionForm.time || !sessionForm.name) {
      alert('Vennligst fyll inn tid og navn');
      return;
    }

    const newSession = {
      id: editingSession ? editingSession.id : Date.now(),
      time: sessionForm.time,
      name: sessionForm.name,
      type: sessionForm.type,
      duration: parseInt(sessionForm.duration),
      level: sessionForm.level,
      status: sessionForm.status,
      location: sessionForm.location
    };

    setSessions(prev => {
      const updated = { ...prev };
      const dateKey = sessionForm.date;

      if (editingSession) {
        updated[dateKey] = (updated[dateKey] || []).map(s =>
          s.id === editingSession.id ? newSession : s
        );
      } else {
        updated[dateKey] = [...(updated[dateKey] || []), newSession];
        updated[dateKey].sort((a, b) => a.time.localeCompare(b.time));
      }

      return updated;
    });

    setShowSessionModal(false);
    setEditingSession(null);
  };

  const handleStartSession = (session) => {
    navigate(`/session/${session.id}/active`);
  };

  // Get navigation title
  const getNavigationTitle = () => {
    switch (viewMode) {
      case VIEW_MODES.DAY:
        return `${selectedDate.getDate()}. ${monthNames[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`;
      case VIEW_MODES.WEEK:
        return `Uke ${getWeekNumber(currentDate)} · ${monthNames[currentDate.getMonth()]}`;
      case VIEW_MODES.MONTH:
        return `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
      case VIEW_MODES.YEAR:
        return `${currentDate.getFullYear()}`;
      default:
        return '';
    }
  };

  // Organize sessions by month for year view
  const getSessionsByMonth = () => {
    const byMonth = {};
    Object.entries(sessions).forEach(([day, daySessions]) => {
      const month = currentDate.getMonth();
      if (!byMonth[month]) byMonth[month] = {};
      byMonth[month][day] = daySessions;
    });
    return byMonth;
  };

  return (
    <div className="min-h-screen" style={{ fontFamily: 'Inter, -apple-system, system-ui, sans-serif' }}>
      {/* Header */}
      <PageHeader
        title="Kalender"
        logoSize={40}
        badgeSize={48}
        actions={
          <Button
            variant="primary"
            onClick={openNewSession}
            leftIcon={<Plus size={18} />}
          >
            Ny økt
          </Button>
        }
      />

      <div className="w-full">
        {/* Navigation Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate_calendar(-1)}
              className="p-2 hover:bg-white rounded-xl border border-ak-mist"
            >
              <ChevronLeft size={20} />
            </button>

            <h2 className="text-lg font-semibold text-ak-charcoal min-w-[200px] text-center">
              {getNavigationTitle()}
            </h2>

            <button
              onClick={() => navigate_calendar(1)}
              className="p-2 hover:bg-white rounded-xl border border-ak-mist"
            >
              <ChevronRight size={20} />
            </button>

            <button
              onClick={goToToday}
              className="px-3 py-2 text-sm text-ak-primary hover:bg-ak-primary/5 rounded-xl font-medium"
            >
              I dag
            </button>
          </div>

          <ViewToggle currentView={viewMode} onChange={setViewMode} />
        </div>

        {/* Calendar View */}
        {viewMode === VIEW_MODES.DAY && (
          <DayView
            date={selectedDate}
            sessions={sessions[selectedDate.getDate()] || []}
            onSessionClick={(session) => handleSessionClick(session, selectedDate)}
            onTimeSlotClick={(hour) => {
              setSessionForm(prev => ({
                ...prev,
                time: `${hour.toString().padStart(2, '0')}:00`,
                date: selectedDate.getDate()
              }));
              setShowSessionModal(true);
            }}
          />
        )}

        {viewMode === VIEW_MODES.WEEK && (
          <WeekView
            currentDate={currentDate}
            sessions={sessions}
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
            onSessionClick={handleSessionClick}
          />
        )}

        {viewMode === VIEW_MODES.MONTH && (
          <MonthView
            currentDate={currentDate}
            sessions={sessions}
            selectedDate={selectedDate}
            onDateClick={handleDateSelect}
            onNavigate={navigate_calendar}
          />
        )}

        {viewMode === VIEW_MODES.YEAR && (
          <YearView
            currentYear={currentDate.getFullYear()}
            sessionsByMonth={getSessionsByMonth()}
            onMonthClick={(monthIndex) => {
              const newDate = new Date(currentDate.getFullYear(), monthIndex, 1);
              setCurrentDate(newDate);
              setViewMode(VIEW_MODES.MONTH);
            }}
            onNavigate={navigate_calendar}
            periods={[
              { type: 'evaluering', months: [0] },
              { type: 'grunnlag', months: [1, 2, 3] },
              { type: 'spesialisering', months: [4, 5] },
              { type: 'turnering', months: [6, 7, 8] },
              { type: 'evaluering', months: [9] },
              { type: 'grunnlag', months: [10, 11] },
            ]}
          />
        )}

        {/* Selected Day Sessions (for week/month views) */}
        {(viewMode === VIEW_MODES.WEEK || viewMode === VIEW_MODES.MONTH) &&
          sessions[selectedDate.getDate()] && (
          <div className="mt-6">
            <h3 className="text-base font-semibold text-ak-charcoal mb-3">
              {selectedDate.getDate()}. {monthNames[selectedDate.getMonth()]} - Økter
            </h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {sessions[selectedDate.getDate()].map(session => (
                <div
                  key={session.id}
                  className="bg-white p-4 rounded-xl border border-ak-mist hover:border-ak-primary/30 cursor-pointer transition-all"
                  onClick={() => handleSessionClick(session, selectedDate)}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-ak-steel mb-1">{session.time} · {session.duration} min</p>
                      <h4 className="font-semibold text-ak-charcoal">{session.name}</h4>
                      {session.location && (
                        <p className="text-xs text-ak-steel mt-1">📍 {session.location}</p>
                      )}
                    </div>
                    <LevelTag level={session.level} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Session Preview Modal */}
      <SessionPreviewModal
        session={previewSession}
        isOpen={!!previewSession}
        onClose={() => setPreviewSession(null)}
        onEdit={handleEditSession}
        onDelete={handleDeleteSession}
        onStart={handleStartSession}
      />

      {/* Session Edit/Create Modal */}
      {showSessionModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          onClick={() => setShowSessionModal(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-ak-charcoal mb-5">
              {editingSession ? 'Rediger økt' : 'Ny økt'}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-ak-charcoal mb-2">Tidspunkt</label>
                <input
                  type="time"
                  value={sessionForm.time}
                  onChange={(e) => setSessionForm({ ...sessionForm, time: e.target.value })}
                  className="w-full p-3 bg-ak-snow border border-ak-mist rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ak-charcoal mb-2">Navn</label>
                <input
                  type="text"
                  value={sessionForm.name}
                  onChange={(e) => setSessionForm({ ...sessionForm, name: e.target.value })}
                  placeholder="F.eks. 'Putting økt'"
                  className="w-full p-3 bg-ak-snow border border-ak-mist rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ak-charcoal mb-2">Sted</label>
                <input
                  type="text"
                  value={sessionForm.location}
                  onChange={(e) => setSessionForm({ ...sessionForm, location: e.target.value })}
                  placeholder="F.eks. 'Driving Range'"
                  className="w-full p-3 bg-ak-snow border border-ak-mist rounded-xl text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-ak-charcoal mb-2">Type</label>
                  <select
                    value={sessionForm.type}
                    onChange={(e) => setSessionForm({ ...sessionForm, type: e.target.value })}
                    className="w-full p-3 bg-ak-snow border border-ak-mist rounded-xl text-sm"
                  >
                    <option value="teknikk">Teknikk</option>
                    <option value="golfslag">Golfslag</option>
                    <option value="spill">Spill</option>
                    <option value="fysisk">Fysisk</option>
                    <option value="mental">Mental</option>
                    <option value="konkurranse">Konkurranse</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-ak-charcoal mb-2">Varighet (min)</label>
                  <input
                    type="number"
                    value={sessionForm.duration}
                    onChange={(e) => setSessionForm({ ...sessionForm, duration: e.target.value })}
                    min="0"
                    step="15"
                    className="w-full p-3 bg-ak-snow border border-ak-mist rounded-xl text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-ak-charcoal mb-2">Nivå</label>
                <select
                  value={sessionForm.level}
                  onChange={(e) => setSessionForm({ ...sessionForm, level: e.target.value })}
                  className="w-full p-3 bg-ak-snow border border-ak-mist rounded-xl text-sm"
                >
                  <option value="L1">L1 - Lett</option>
                  <option value="L2">L2 - Moderat</option>
                  <option value="L3">L3 - Middels</option>
                  <option value="L4">L4 - Krevende</option>
                  <option value="L5">L5 - Maksimal</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                variant="secondary"
                onClick={() => setShowSessionModal(false)}
                style={{ flex: 1 }}
              >
                Avbryt
              </Button>
              <Button
                variant="primary"
                onClick={handleSaveSession}
                style={{ flex: 1 }}
              >
                Lagre
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AKGolfKalender;
